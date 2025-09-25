import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const ImageModule = require('docxtemplater-image-module-free');
import fs from 'fs';

const libre = require('libreoffice-convert');

// Wrapper
async function convertToPdf(inputBuffer: Buffer) {
  console.log('📄 [PDF-CONVERT] Starting PDF conversion...');
  console.log('📄 [PDF-CONVERT] Input buffer size:', inputBuffer.length, 'bytes');
  
  return await new Promise<Buffer>((resolve, reject) => {
    console.log('📄 [PDF-CONVERT] Calling libre.convert...');
    const startTime = Date.now();
    
    const maybe = libre.convert(inputBuffer, '.pdf', undefined, (err: unknown, done: Buffer) => {
      const duration = Date.now() - startTime;
      if (err) {
        console.error('❌ [PDF-CONVERT] Conversion failed after', duration, 'ms:', err);
        return reject(err);
      }
      console.log('✅ [PDF-CONVERT] Conversion successful after', duration, 'ms');
      console.log('📄 [PDF-CONVERT] Output buffer size:', done.length, 'bytes');
      resolve(done);
    });

    //versi baru yang ngembaliin Promise
    if (maybe && typeof maybe.then === 'function') {
      console.log('📄 [PDF-CONVERT] Using promise-based conversion');
      maybe.then((result: Buffer) => {
        const duration = Date.now() - startTime;
        console.log('✅ [PDF-CONVERT] Promise conversion successful after', duration, 'ms');
        resolve(result);
      }).catch((error: unknown) => {
        const duration = Date.now() - startTime;
        console.error('❌ [PDF-CONVERT] Promise conversion failed after', duration, 'ms:', error);
        reject(error);
      });
    }
  });
}

export async function POST(request: NextRequest, props: { params: Promise<{ nup: string }> }) {
  console.log('🚀 [API] CV Generator API called');
  const requestStartTime = Date.now();
  
  const params = await props.params;
  console.log('📝 [API] Request params:', params);
  
  try {
    // Parse request body untuk mendapatkan format yang diinginkan
    console.log('📥 [API] Parsing request body...');
    const body = await request.json();
    const { format = 'pdf' } = body; // default ke pdf jika tidak ada format
    console.log('📋 [API] Request body parsed. Format requested:', format);

    // Validasi format
    if (!['docx', 'pdf'].includes(format)) {
      console.error('❌ [VALIDATION] Invalid format requested:', format);
      return NextResponse.json({ error: 'Format harus docx atau pdf' }, { status: 400 });
    }
    console.log('✅ [VALIDATION] Format validation passed');

    // 1. Autentikasi admin (pastikan yang akses adalah admin)
    console.log('🔐 [AUTH] Starting admin authentication...');
    const cookieStore = await cookies();
    const allCookies = await cookieStore;
    const adminNik = allCookies.get ? allCookies.get('nik')?.value : undefined;
    console.log('🔐 [AUTH] Admin NIK from cookies:', adminNik ? 'Found' : 'Not found');
    
    if (!adminNik) {
      console.error('❌ [AUTH] No admin NIK found in cookies');
      return NextResponse.json({ error: 'Unauthorized: Admin NIK not found' }, { status: 401 });
    }

    // Validasi apakah user adalah admin (sesuaikan dengan logic role checking kamu)
    console.log('🔍 [AUTH] Checking admin role in database...');
    const adminUser = await prisma.pegawai.findFirst({ 
      where: {
        nik: adminNik,
        role: { has: 'admin' } // role array, cari yang mengandung 'admin'
      },
      select: { role: true }
    });
    
    if (!adminUser) {
      console.error('❌ [AUTH] User is not admin or not found. NIK:', adminNik);
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }
    console.log('✅ [AUTH] Admin authentication successful. Roles:', adminUser.role);

    // 2. Ambil NUP dari parameter URL (langsung dari params, bukan dari cookie)
    console.log('🔍 [PARAM] Extracting NUP from parameters...');
    const { nup } = params;
    if (!nup) {
      console.error('❌ [PARAM] NUP parameter is missing');
      return NextResponse.json({ error: 'NUP parameter is required' }, { status: 400 });
    }
    console.log('✅ [PARAM] NUP extracted:', nup);

    // 3. Query data pegawai berdasarkan NUP dari parameter
    console.log('🔍 [DATABASE] Querying employee data...');
    const pegawai = await prisma.pegawai.findUnique({
      where: { nup },
      include: {
        pelatihan: true,
        pengalaman_kerja: true,
      },
    });
    
    if (!pegawai) {
      console.error('❌ [DATABASE] Employee not found for NUP:', nup);
      return NextResponse.json({ error: 'Pegawai not found' }, { status: 404 });
    }
    console.log('✅ [DATABASE] Employee data found:', {
      nama: pegawai.nama_pegawai,
      pelatihan_count: pegawai.pelatihan?.length || 0,
      pengalaman_count: pegawai.pengalaman_kerja?.length || 0
    });

    // 4. Update cvGeneratedAt
    console.log('📅 [DATABASE] Updating cvGeneratedAt timestamp...');
    const now = new Date();
    await prisma.pegawai.update({
      where: { nup },
      data: { cv_generated_at: now },
    });
    console.log('✅ [DATABASE] cvGeneratedAt updated to:', now.toISOString());

    // 6. Generate DOCX file
    console.log('📄 [DOCX] Starting DOCX generation...');
    const docxStartTime = Date.now();
    const docxBuffer = await generateDocxBuffer(pegawai);
    const docxDuration = Date.now() - docxStartTime;
    console.log('✅ [DOCX] DOCX generated successfully in', docxDuration, 'ms');
    console.log('📄 [DOCX] DOCX buffer size:', docxBuffer.length, 'bytes');

    // 7. Jika format PDF, konversi DOCX ke PDF
    if (format === 'pdf') {
      console.log('🔄 [CONVERT] Converting DOCX to PDF...');
      try {
        const pdfBuffer = await convertToPdf(docxBuffer);
        const totalDuration = Date.now() - requestStartTime;
        const filename = `cv_${pegawai.nama_pegawai}_${now.toISOString().split('T')[0]}.pdf`;
        
        console.log('✅ [SUCCESS] PDF generation completed successfully');
        console.log('📊 [METRICS] Total request duration:', totalDuration, 'ms');
        console.log('📁 [OUTPUT] PDF filename:', filename);
        console.log('📄 [OUTPUT] Final PDF size:', pdfBuffer.length, 'bytes');
        
        return new NextResponse( new Uint8Array(pdfBuffer), {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${filename}"`
          }
        });
      } catch (pdfError) {
        console.error('❌ [PDF-ERROR] PDF conversion failed:', pdfError);
        console.log('🔄 [FALLBACK] Suggesting DOCX download as fallback');
        return NextResponse.json({ 
          error: 'Gagal mengkonversi ke PDF. Coba download sebagai DOCX.' 
        }, { status: 500 });
      }
    }

    // 8. Return DOCX file
    const totalDuration = Date.now() - requestStartTime;
    const filename = `cv_${pegawai.nama_pegawai}_${now.toISOString().split('T')[0]}.docx`;
    
    console.log('✅ [SUCCESS] DOCX generation completed successfully');
    console.log('📊 [METRICS] Total request duration:', totalDuration, 'ms');
    console.log('📁 [OUTPUT] DOCX filename:', filename);
    console.log('📄 [OUTPUT] Final DOCX size:', docxBuffer.length, 'bytes');
    
    return new NextResponse(docxBuffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    });

  } catch (err) {
    const totalDuration = Date.now() - requestStartTime;
    console.error('💥 [ERROR] CV Generator API error after', totalDuration, 'ms');
    console.error('💥 [ERROR] Error details:', err);
    console.error('💥 [ERROR] Error stack:', (err as Error).stack);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Fungsi terpisah untuk generate DOCX buffer (sama seperti sebelumnya)
async function generateDocxBuffer(pegawaiData: unknown) {
  console.log('📄 [DOCX-GEN] Starting DOCX buffer generation...');
  
  const pegawai = pegawaiData as {
    nama_pegawai?: string;
    tempat_lahir?: string;
    tanggal_lahir?: string;
    agama?: string;
    warga_negara?: string;
    jabatan?: string;
    jenjang_pend?: string;
    pendidikan?: string;
    tahun_pend?: string;
    pelatihan?: Array<{
      tahun?: number;
      nama_pelatihan?: string;
      penyelenggara?: string;
      lokasi?: string;
      status?: string;
    }>;
    pengalaman_kerja?: Array<{
      tahun_awal?: number;
      tahun_akhir?: number;
      pengalaman_kerja?: string;
      perusahaan?: string;
      lokasi?: string;
    }>;
  };

  console.log('📁 [DOCX-GEN] Loading template file...');
  const templatePath = process.cwd() + '/src/app/api/cv/generate/template_cv.docx';
  console.log('📁 [DOCX-GEN] Template path:', templatePath);
  
  try {
    const templateBuffer = fs.readFileSync(templatePath);
    console.log('✅ [DOCX-GEN] Template loaded successfully, size:', templateBuffer.length, 'bytes');
  } catch (templateError) {
    console.error('❌ [DOCX-GEN] Failed to load template:', templateError);
    throw templateError;
  }
  
  const templateBuffer = fs.readFileSync(templatePath);
  const zip = new PizZip(templateBuffer);
  console.log('✅ [DOCX-GEN] Template ZIP initialized');

  // parser base64 untuk gambar
  const base64Regex = /^(?:data:)?image\/(png|jpg|jpeg|svg|svg\+xml);base64,/;
  const validBase64 = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
  function base64Parser(tagValue: unknown) {
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

  console.log('🖼️ [DOCX-GEN] Setting up image module...');
  const imageModule = new ImageModule({
    getImage(tagValue: unknown) {
      return base64Parser(tagValue);
    },
    getSize() {
      return [100, 100];
    },
  });

  const NBSP = '\u00A0';

  console.log('⚙️ [DOCX-GEN] Initializing Docxtemplater...');
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

  function formatTanggalIndo(date: unknown) {
    if (!date) return '-';
    const bulan = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const d = new Date(date as string | number | Date);
    const day = d.getDate().toString().padStart(2, '0');
    return `${day} ${bulan[d.getMonth()]} ${d.getFullYear()}`;
  }

  console.log('📅 [DOCX-GEN] Processing dates and basic data...');
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

  console.log('🎓 [DOCX-GEN] Processing training data...');
  const pelatihanData = (() => {
    const arr = ((pegawai.pelatihan || []) as Array<{ tahun?: number; nama_pelatihan?: string; penyelenggara?: string; lokasi?: string; status?: string }>)
      .filter(p => p.status === 'VALID')
      .slice()
      .sort((a, b) => (a.tahun ?? 0) - (b.tahun ?? 0));

    console.log('🎓 [DOCX-GEN] Valid training records:', arr.length);

    let lastYear: number | undefined = undefined;
    return arr.map(p => {
      let tahunStr: string = '';
      if (p.tahun !== lastYear) {
        tahunStr = String(p.tahun ?? '');
        lastYear = p.tahun;
      } else {
        tahunStr = NBSP; // kosong yang benar-benar "kosong" di Word
      }
      return {
        tahun: tahunStr,
        nama_pelatihan: p.nama_pelatihan,
        penyelenggara: p.penyelenggara,
        lokasi: p.lokasi
      };
    });
  })();

  console.log('💼 [DOCX-GEN] Processing work experience data...');
  const pengalamanKerjaData = (() => {
    const pengalaman = (pegawai.pengalaman_kerja || []);
    console.log('💼 [DOCX-GEN] Raw work experience records:', pengalaman.length);
    
    type Row = { tahun: number, nama_pekerjaan: string, perusahaan: string, lokasi: string, idx: number };

    const expanded: Row[] = [];
    pengalaman.forEach((pen: {
      tahun_awal?: number;
      tahun_akhir?: number;
      pengalaman_kerja?: string;
      perusahaan?: string;
      lokasi?: string;
    }, idx: number) => {
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

    console.log('💼 [DOCX-GEN] Expanded work experience records:', expanded.length);
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
  })();

  console.log('📋 [DOCX-GEN] Preparing document data...');
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
    pelatihan: pelatihanData,
    pengalaman_kerja: pengalamanKerjaData,
    cvGeneratedAt: today,
    cvGeneratedAtFormatted,
    tanggal_generate: cvGeneratedAtFormatted,
    // qr_signature: qrSignature,
    // qr_image: qrSignature
  };

  console.log('📋 [DOCX-GEN] Document data summary:', {
    employee_name: docData.nama_pegawai,
    training_records: docData.pelatihan.length,
    work_experience_records: docData.pengalaman_kerja.length,
    birth_date: docData.tanggal_lahir,
    position: docData.jabatan
  });

  console.log('⚡ [DOCX-GEN] Rendering document...');
  try {
    doc.render(docData);
    console.log('✅ [DOCX-GEN] Document rendered successfully');
  } catch (renderError) {
    console.error('❌ [DOCX-GEN] Document rendering failed:', renderError);
    throw renderError;
  }

  console.log('📦 [DOCX-GEN] Generating final buffer...');
  const finalBuffer = doc.getZip().generate({ type: 'nodebuffer' });
  console.log('✅ [DOCX-GEN] DOCX buffer generated successfully, size:', finalBuffer.length, 'bytes');
  
  return finalBuffer;
}