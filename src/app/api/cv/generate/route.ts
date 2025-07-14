import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
const QRCode = require('qrcode');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const ImageModule = require('docxtemplater-image-module-free');
import fs from 'fs';

export async function POST(request: NextRequest) {
  try {
    // 1. Autentikasi & ambil nup dari session/cookie
    const cookieStore = await cookies();
    const allCookies = await cookieStore;
    const nik = allCookies.get ? allCookies.get('nik')?.value : undefined;
    if (!nik) return NextResponse.json({ error: 'Unauthorized: NIK not found' }, { status: 401 });

    // Ambil NUP dari pegawai
    const pegawaiUser = await prisma.pegawai.findFirst({ where: { nik }, select: { nup: true } });
    if (!pegawaiUser?.nup) return NextResponse.json({ error: 'Pegawai/NUP not found' }, { status: 404 });
    const nup = pegawaiUser.nup;

    // 2. Query data pegawai beserta relasi
    const pegawai = await prisma.pegawai.findUnique({
      where: { nup },
      include: {
        pelatihan: true,
        pengalaman_kerja: true,
      },
    });
    if (!pegawai) return new NextResponse('Not found', { status: 404 });

    // 3. Update cvGeneratedAt
    const now = new Date();
    await prisma.pegawai.update({
      where: { nup },
      data: { cv_generated_at: now },
    });

    // 4. Generate QR-Code untuk tanda tangan digital
    const qrData = JSON.stringify({ nup, generatedAt: now.toISOString() });
    const qrSignature = await QRCode.toDataURL(qrData);

    // 5. Isi template DOCX (pakai docxtemplater + pizzip)
    const templatePath = process.cwd() + '/src/app/api/cv/generate/template_cv.docx';
    const templateBuffer = fs.readFileSync(templatePath);
    const zip = new PizZip(templateBuffer);

    // Improved base64 parser for image module (sesuai dokumentasi)
    const base64Regex = /^(?:data:)?image\/(png|jpg|jpeg|svg|svg\+xml);base64,/;
    const validBase64 = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
    
    function base64Parser(tagValue: any) {
      if (typeof tagValue !== "string" || !base64Regex.test(tagValue)) {
        return false;
      }
      const stringBase64 = tagValue.replace(base64Regex, "");
      if (!validBase64.test(stringBase64)) {
        throw new Error("Error parsing base64 data, your data contains invalid characters");
      }
      
      // For nodejs, return a Buffer
      if (typeof Buffer !== "undefined" && Buffer.from) {
        return Buffer.from(stringBase64, "base64");
      }
      
      // For browsers, return a string (of binary content)
      const binaryString = window.atob(stringBase64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        const ascii = binaryString.charCodeAt(i);
        bytes[i] = ascii;
      }
      return bytes.buffer;
    }

    const imageOptions = {
      getImage(tagValue: any) {
        return base64Parser(tagValue);
      },
      getSize(img: any, tagValue: any, tagName: any, context: any) {
        return [100, 100];
      },
    };

    const imageModule = new ImageModule(imageOptions);
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
      syntax: {
        allowUnopenedTag: true,
        allowUnclosedTag: true,
      },
      modules: [imageModule],
    });

    // Data mapping sesuai placeholder
    const peg = pegawai;
    
    // Format tanggal CV generated (misal: 14 Juli 2025)
    function formatTanggalIndo(date: any) {
      if (!date) return '-';
      const bulan = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
      ];
      const d = new Date(date);
      const day = d.getDate().toString().padStart(2, '0');
      return `${day} ${bulan[d.getMonth()]} ${d.getFullYear()}`;
    }

    // Gunakan tanggal sekarang untuk tanggal generate CV
    const today = new Date();
    const cvGeneratedAtFormatted = formatTanggalIndo(today);
    
    // Format tanggal lahir
    let birthDate = '-';
    if (peg.tanggal_lahir) {
      const dob = new Date(peg.tanggal_lahir);
      birthDate = dob.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
    }

    const docData = {
      nama_pegawai: peg.nama_pegawai,
      tempat_lahir: peg.tempat_lahir,
      tanggal_lahir: birthDate,
      agama: peg.agama,
      kewarganegaraan: peg.warga_negara,
      jabatan: peg.jabatan,
      jenjang: peg.jenjang_pend,
      pendidikan: peg.pendidikan,
      tahun_pend: peg.tahun_pend,
      pelatihan: (peg.pelatihan || [])
        .filter(pel => pel.status === 'VALID')
        .slice()
        .sort((a, b) => (a.tahun ?? 0) - (b.tahun ?? 0))
        .map(pel => ({
          tahun: pel.tahun,
          nama_pelatihan: pel.nama_pelatihan,
          penyelenggara: pel.penyelenggara,
          lokasi: pel.lokasi
        })),
      pengalaman_kerja: (peg.pengalaman_kerja || [])
        .slice()
        .sort((a, b) => (a.tahun ?? 0) - (b.tahun ?? 0))
        .map(pen => ({
          tahun: pen.tahun,
          nama_pekerjaan: pen.pengalaman_kerja,
          perusahaan: pen.perusahaan,
          lokasi: pen.lokasi
        })),
      // Data tanggal generate CV
      cvGeneratedAt: today,
      cvGeneratedAtFormatted: cvGeneratedAtFormatted,
      tanggal_generate: cvGeneratedAtFormatted, // alternatif placeholder
      // QR signature dengan format yang benar untuk image module
      qr_signature: qrSignature, // gunakan data URL lengkap
      qr_image: qrSignature      // alternatif placeholder
    };

    console.log('CV Generated At:', cvGeneratedAtFormatted); // untuk debugging
    console.log('QR Signature format:', qrSignature.substring(0, 50) + '...'); // untuk debugging

    doc.render(docData);
    const generatedBuffer = doc.getZip().generate({ type: 'nodebuffer' });
    
    return new NextResponse(generatedBuffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': 'attachment; filename="cv_pegawai.docx"'
      }
    });
  } catch (err) {
    console.error('CV Generator API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}