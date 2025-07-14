import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
const QRCode = require('qrcode');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const ImageModule = require('docxtemplater-image-module-free');
import fs from 'fs';
import path from 'path';

// Import untuk PDF conversion
const libre = require('libreoffice-convert');
const util = require('util');
const libreConvert = util.promisify(libre.convert);

export async function POST(request: NextRequest) {
  try {
    // Parse request body untuk mendapatkan format yang diinginkan
    const body = await request.json();
    const { format = 'pdf' } = body; // default ke pdf jika tidak ada format

    // Validasi format
    if (!['docx', 'pdf'].includes(format)) {
      return NextResponse.json({ error: 'Format harus docx atau pdf' }, { status: 400 });
    }

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

    // 5. Generate DOCX file
    const docxBuffer = await generateDocxBuffer(pegawai, qrSignature);

    // 6. Jika format PDF, konversi DOCX ke PDF
    if (format === 'pdf') {
      try {
        const pdfBuffer = await libreConvert(docxBuffer, '.pdf', undefined);
        return new NextResponse(pdfBuffer, {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="cv_${pegawai.nama_pegawai}_${now.toISOString().split('T')[0]}.pdf"`
          }
        });
      } catch (pdfError) {
        console.error('PDF conversion error:', pdfError);
        return NextResponse.json({ 
          error: 'Gagal mengkonversi ke PDF. Coba download sebagai DOCX.' 
        }, { status: 500 });
      }
    }

    // 7. Return DOCX file
    return new NextResponse(docxBuffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="cv_${pegawai.nama_pegawai}_${now.toISOString().split('T')[0]}.docx"`
      }
    });

  } catch (err) {
    console.error('CV Generator API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Fungsi terpisah untuk generate DOCX buffer
async function generateDocxBuffer(pegawai: any, qrSignature: any) {
  const templatePath = process.cwd() + '/src/app/api/cv/generate/template_cv.docx';
  const templateBuffer = fs.readFileSync(templatePath);
  const zip = new PizZip(templateBuffer);

  // Base64 parser untuk image module
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
    
    if (typeof Buffer !== "undefined" && Buffer.from) {
      return Buffer.from(stringBase64, "base64");
    }
    
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

  // Format tanggal Indonesia
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

  const today = new Date();
  const cvGeneratedAtFormatted = formatTanggalIndo(today);
  
  // Format tanggal lahir
  let birthDate = '-';
  if (pegawai.tanggal_lahir) {
    const dob = new Date(pegawai.tanggal_lahir);
    birthDate = dob.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }

  const docData = {
    nama_pegawai: pegawai.nama_pegawai,
    tempat_lahir: pegawai.tempat_lahir,
    tanggal_lahir: birthDate,
    agama: pegawai.agama,
    kewarganegaraan: pegawai.warga_negara,
    jabatan: pegawai.jabatan,
    jenjang: pegawai.jenjang_pend,
    pendidikan: pegawai.pendidikan,
    tahun_pend: pegawai.tahun_pend,
    pelatihan: (() => {
      const arr = ((pegawai.pelatihan || []) as Array<{ tahun?: number; nama_pelatihan?: string; penyelenggara?: string; lokasi?: string; status?: string }>)
        .filter(pel => pel.status === 'VALID')
        .slice()
        .sort((a, b) => (a.tahun ?? 0) - (b.tahun ?? 0));
      let lastYear: number | undefined = undefined;
      return arr.map((pel) => {
        let tahunStr: string | number | undefined;
        if (pel.tahun !== lastYear) {
          tahunStr = pel.tahun;
          lastYear = pel.tahun;
        } else {
          tahunStr = "       "; // 7 spaces for indentation
        }
        return {
          tahun: tahunStr,
          nama_pelatihan: pel.nama_pelatihan,
          penyelenggara: pel.penyelenggara,
          lokasi: pel.lokasi
        };
      });
    })(),
    pengalaman_kerja: (() => {
      const arr = ((pegawai.pengalaman_kerja || []) as Array<{ tahun?: number; pengalaman_kerja?: string; perusahaan?: string; lokasi?: string }>)
        .slice()
        .sort((a, b) => (a.tahun ?? 0) - (b.tahun ?? 0));
      let lastYear: number | undefined = undefined;
      return arr.map((pen) => {
        let tahunStr: string | number | undefined;
        if (pen.tahun !== lastYear) {
          tahunStr = pen.tahun;
          lastYear = pen.tahun;
        } else {
          tahunStr = "       "; // 7 spaces for indentation
        }
        return {
          tahun: tahunStr,
          nama_pekerjaan: pen.pengalaman_kerja,
          perusahaan: pen.perusahaan,
          lokasi: pen.lokasi
        };
      });
    })(),
    cvGeneratedAt: today,
    cvGeneratedAtFormatted: cvGeneratedAtFormatted,
    tanggal_generate: cvGeneratedAtFormatted,
    qr_signature: qrSignature,
    qr_image: qrSignature
  };

  doc.render(docData);
  return doc.getZip().generate({ type: 'nodebuffer' });
}
