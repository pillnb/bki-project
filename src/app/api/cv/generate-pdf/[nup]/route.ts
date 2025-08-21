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

// Wrapper
async function convertToPdf(inputBuffer: Buffer) {
  return await new Promise<Buffer>((resolve, reject) => {
    const maybe = libre.convert(inputBuffer, '.pdf', undefined, (err: any, done: Buffer) => {
      if (err) return reject(err);
      resolve(done);
    });

    //versi baru yang ngembaliin Promise
    if (maybe && typeof maybe.then === 'function') {
      maybe.then(resolve).catch(reject);
    }
  });
}

export async function POST(request: NextRequest, props: { params: Promise<{ nup: string }> }) {
  const params = await props.params;
  try {
    // Parse request body untuk mendapatkan format yang diinginkan
    const body = await request.json();
    const { format = 'pdf' } = body; // default ke pdf jika tidak ada format

    // Validasi format
    if (!['docx', 'pdf'].includes(format)) {
      return NextResponse.json({ error: 'Format harus docx atau pdf' }, { status: 400 });
    }

    // 1. Autentikasi admin (pastikan yang akses adalah admin)
    const cookieStore = await cookies();
    const allCookies = await cookieStore;
    const adminNik = allCookies.get ? allCookies.get('nik')?.value : undefined;
    
    if (!adminNik) {
      return NextResponse.json({ error: 'Unauthorized: Admin NIK not found' }, { status: 401 });
    }

    // Validasi apakah user adalah admin (sesuaikan dengan logic role checking kamu)
    const adminUser = await prisma.pegawai.findFirst({ 
      where: {
        nik: adminNik,
        role: { has: 'admin' } // role array, cari yang mengandung 'admin'
      },
      select: { role: true }
    });
    
    if (!adminUser) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    // 2. Ambil NUP dari parameter URL (langsung dari params, bukan dari cookie)
    const { nup } = params;
    if (!nup) {
      return NextResponse.json({ error: 'NUP parameter is required' }, { status: 400 });
    }

    // 3. Query data pegawai berdasarkan NUP dari parameter
    const pegawai = await prisma.pegawai.findUnique({
      where: { nup },
      include: {
        pelatihan: true,
        pengalaman_kerja: true,
      },
    });
    
    if (!pegawai) {
      return NextResponse.json({ error: 'Pegawai not found' }, { status: 404 });
    }

    // 4. Update cvGeneratedAt
    const now = new Date();
    await prisma.pegawai.update({
      where: { nup },
      data: { cv_generated_at: now },
    });

    // 5. Generate QR-Code untuk tanda tangan digital
    const qrData = JSON.stringify({
      nama_pegawai: pegawai.nama_pegawai,
      nup,
      perusahaan: 'PT. BKI Komersil Balikpapan',
      generatedAt: now.toISOString(),
      generatedBy: 'admin', // tambahan info bahwa di-generate oleh admin
    });
    const qrSignature = await QRCode.toDataURL(qrData);

    // 6. Generate DOCX file
    const docxBuffer = await generateDocxBuffer(pegawai, qrSignature);

    // 7. Jika format PDF, konversi DOCX ke PDF
    if (format === 'pdf') {
      try {
        const pdfBuffer = await convertToPdf(docxBuffer);
        return new NextResponse( new Uint8Array(pdfBuffer), {
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

    // 8. Return DOCX file
    return new NextResponse(docxBuffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="cv_${pegawai.nama_pegawai}_${now.toISOString().split('T')[0]}.docx"`
      }
    });

  } catch (err) {
    console.error('Admin CV Generator API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Fungsi terpisah untuk generate DOCX buffer (sama seperti sebelumnya)
async function generateDocxBuffer(pegawai: any, qrSignature: any) {
  const templatePath = process.cwd() + '/src/app/api/cv/generate/template_cv.docx';
  const templateBuffer = fs.readFileSync(templatePath);
  const zip = new PizZip(templateBuffer);

  // parser base64 untuk gambar
  const base64Regex = /^(?:data:)?image\/(png|jpg|jpeg|svg|svg\+xml);base64,/;
  const validBase64 = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
  function base64Parser(tagValue: any) {
    if (typeof tagValue !== "string" || !base64Regex.test(tagValue)) return false;
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
    for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
    return bytes.buffer;
  }

  const imageModule = new ImageModule({
    getImage(tagValue: any) {
      return base64Parser(tagValue);
    },
    getSize() {
      return [100, 100];
    },
  });

  const NBSP = '\u00A0';

  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
    syntax: {
      allowUnopenedTag: true,
      allowUnclosedTag: true,
    },
    modules: [imageModule],
    // ini penting buat value kosong di DOCX
    nullGetter: () => ''
  });

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

    // sama seperti versi PDF, tapi yang kosong pakai NBSP biar tampil di DOCX
    pelatihan: (() => {
      const arr = ((pegawai.pelatihan || []) as Array<{ tahun?: number; nama_pelatihan?: string; penyelenggara?: string; lokasi?: string; status?: string }>)
        .filter(p => p.status === 'VALID')
        .slice()
        .sort((a, b) => (a.tahun ?? 0) - (b.tahun ?? 0));

      let lastYear: number | undefined = undefined;
      return arr.map(p => {
        let tahunStr: string = '';
        if (p.tahun !== lastYear) {
          tahunStr = String(p.tahun ?? '');
          lastYear = p.tahun;
        } else {
          tahunStr = NBSP; // kosong yang benar-benar “kosong” di Word
        }
        return {
          tahun: tahunStr,
          nama_pelatihan: p.nama_pelatihan,
          penyelenggara: p.penyelenggara,
          lokasi: p.lokasi
        };
      });
    })(),

    // logic sesuai permintaan:
    // 1) expand rentang tahun
    // 2) sort by tahun ASC lalu idx ASC supaya pengalaman yang sama di tahun berurutan tidak kepotong
    // 3) tahun diulang sekali saja, baris berikutnya kosong pakai NBSP
    pengalaman_kerja: (() => {
      const pengalaman = (pegawai.pengalaman_kerja || []);
      type Row = { tahun: number, nama_pekerjaan: string, perusahaan: string, lokasi: string, idx: number };

      const expanded: Row[] = [];
      pengalaman.forEach((pen: any, idx: number) => {
        const start = pen.tahun_awal ?? null;
        const end = pen.tahun_akhir ?? pen.tahun_awal ?? null;
        if (start && end) {
          for (let t = start; t <= end; t++) {
            expanded.push({
              tahun: t,
              nama_pekerjaan: pen.pengalaman_kerja ?? '',
              perusahaan: pen.perusahaan ?? '',
              lokasi: pen.lokasi ?? '',
              idx
            });
          }
        } else if (start) {
          expanded.push({
            tahun: start,
            nama_pekerjaan: pen.pengalaman_kerja ?? '',
            perusahaan: pen.perusahaan ?? '',
            lokasi: pen.lokasi ?? '',
            idx
          });
        }
      });

      expanded.sort((a, b) => a.tahun - b.tahun || a.idx - b.idx);

      let lastTahun: number | null = null;
      return expanded.map(row => {
        const showYear = lastTahun === row.tahun ? NBSP : String(row.tahun);
        lastTahun = row.tahun;
        return {
          tahun: showYear,
          nama_pekerjaan: row.nama_pekerjaan,
          perusahaan: row.perusahaan,
          lokasi: row.lokasi
        };
      });
    })(),

    cvGeneratedAt: today,
    cvGeneratedAtFormatted,
    tanggal_generate: cvGeneratedAtFormatted,
    // qr_signature: qrSignature,
    // qr_image: qrSignature
  };

  doc.render(docData);
  return doc.getZip().generate({ type: 'nodebuffer' });
}
