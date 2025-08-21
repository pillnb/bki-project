// import { NextRequest, NextResponse } from 'next/server';
// import { cookies } from 'next/headers';
// import prisma from '@/lib/prisma';
// const QRCode = require('qrcode');
// const PizZip = require('pizzip');
// const Docxtemplater = require('docxtemplater');
// const ImageModule = require('docxtemplater-image-module-free');
// import fs from 'fs';
// import path from 'path';

// // Fungsi helper untuk generate buffer DOCX (tidak ada perubahan)
// async function generateDocxBuffer(pegawai: any, qrSignature: any) {
//   const templatePath = process.cwd() + '/src/app/api/cv/generate/template_cv.docx';
//   const templateBuffer = fs.readFileSync(templatePath);
//   const zip = new PizZip(templateBuffer);

//   const base64Regex = /^(?:data:)?image\/(png|jpg|jpeg|svg|svg\+xml);base64,/;
//   const validBase64 = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
  
//   function base64Parser(tagValue: any) {
//     if (typeof tagValue !== "string" || !base64Regex.test(tagValue)) {
//       return false;
//     }
//     const stringBase64 = tagValue.replace(base64Regex, "");
//     if (!validBase64.test(stringBase64)) {
//       throw new Error("Error parsing base64 data, your data contains invalid characters");
//     }
    
//     if (typeof Buffer !== "undefined" && Buffer.from) {
//       return Buffer.from(stringBase64, "base64");
//     }
    
//     const binaryString = window.atob(stringBase64);
//     const len = binaryString.length;
//     const bytes = new Uint8Array(len);
//     for (let i = 0; i < len; i++) {
//       const ascii = binaryString.charCodeAt(i);
//       bytes[i] = ascii;
//     }
//     return bytes.buffer;
//   }

//   const imageOptions = {
//     getImage(tagValue: any) {
//       return base64Parser(tagValue);
//     },
//     getSize() {
//       return [100, 100];
//     },
//   };

//   const imageModule = new ImageModule(imageOptions);
//   const doc = new Docxtemplater(zip, {
//     paragraphLoop: true,
//     linebreaks: true,
//     syntax: {
//       allowUnopenedTag: true,
//       allowUnclosedTag: true,
//     },
//     modules: [imageModule],
//   });

//   function formatTanggalIndo(date: any) {
//     if (!date) return '-';
//     const bulan = [
//       'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
//       'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
//     ];
//     const d = new Date(date);
//     const day = d.getDate().toString().padStart(2, '0');
//     return `${day} ${bulan[d.getMonth()]} ${d.getFullYear()}`;
//   }

//   const today = new Date();
//   const cvGeneratedAtFormatted = formatTanggalIndo(today);
  
//   let birthDate = '-';
//   if (pegawai.tanggal_lahir) {
//     const dob = new Date(pegawai.tanggal_lahir);
//     birthDate = dob.toLocaleDateString('id-ID', {
//       day: '2-digit',
//       month: 'long',
//       year: 'numeric',
//     });
//   }

//   const docData = {
//     nama_pegawai: pegawai.nama_pegawai,
//     tempat_lahir: pegawai.tempat_lahir,
//     tanggal_lahir: birthDate,
//     agama: pegawai.agama,
//     kewarganegaraan: pegawai.warga_negara,
//     jabatan: pegawai.jabatan,
//     jenjang: pegawai.jenjang_pend,
//     pendidikan: pegawai.pendidikan,
//     tahun_pend: pegawai.tahun_pend,
//     pelatihan: (() => {
//       const arr = ((pegawai.pelatihan || []) as Array<{ tahun?: number; nama_pelatihan?: string; penyelenggara?: string; lokasi?: string; status?: string }>)
//         .filter(pel => pel.status === 'VALID')
//         .slice()
//         .sort((a, b) => (a.tahun ?? 0) - (b.tahun ?? 0));
//       let lastYear: number | undefined = undefined;
//       return arr.map((pel) => {
//         let tahunStr: string | number | undefined;
//         if (pel.tahun !== lastYear) {
//           tahunStr = pel.tahun;
//           lastYear = pel.tahun;
//         } else {
//           tahunStr = "       "; // 7 spasi untuk indentasi
//         }
//         return {
//           tahun: tahunStr,
//           nama_pelatihan: pel.nama_pelatihan,
//           penyelenggara: pel.penyelenggara,
//           lokasi: pel.lokasi
//         };
//       });
//     })(),
//     pengalaman_kerja: (() => {
//       // Step 1: Expand setiap pengalaman ke array tahun, simpan urutan input
//       const pengalaman = (pegawai.pengalaman_kerja || []);
//       let expanded: Array<{tahun: number, nama_pekerjaan: string, perusahaan: string, lokasi: string, idx: number}> = [];
//       pengalaman.forEach((pen: any, idx: number) => {
//         const start = pen.tahun_awal ?? null;
//         const end = pen.tahun_akhir ?? pen.tahun_awal ?? null;
//         if (start && end) {
//           for (let t = start; t <= end; t++) {
//             expanded.push({
//               tahun: t,
//               nama_pekerjaan: pen.pengalaman_kerja ?? '',
//               perusahaan: pen.perusahaan ?? '',
//               lokasi: pen.lokasi ?? '',
//               idx
//             });
//           }
//         } else if (start) {
//           expanded.push({
//             tahun: start,
//             nama_pekerjaan: pen.pengalaman_kerja ?? '',
//             perusahaan: pen.perusahaan ?? '',
//             lokasi: pen.lokasi ?? '',
//             idx
//           });
//         }
//       });
//       // Step 2: Sort by tahun ASC, lalu idx ASC (agar pengalaman yang sama di tahun berurutan tetap berurutan)
//       expanded.sort((a, b) => a.tahun - b.tahun || a.idx - b.idx);
//       // Step 3: Kosongkan tahun jika sudah pernah muncul sebelumnya (menggunakan Set)
//       const tahunSudah = new Set<number>();
//       return expanded.map((row) => {
//         let tahunStr: string | number = row.tahun;
//         if (tahunSudah.has(row.tahun)) {
//           tahunStr = "";
//         } else {
//           tahunSudah.add(row.tahun);
//         }
//         return {
//           tahun: tahunStr,
//           nama_pekerjaan: row.nama_pekerjaan,
//           perusahaan: row.perusahaan,
//           lokasi: row.lokasi
//         };
//       });
//     })(),
//     cvGeneratedAt: today,
//     cvGeneratedAtFormatted: cvGeneratedAtFormatted,
//     tanggal_generate: cvGeneratedAtFormatted,
//     qr_signature: qrSignature,
//     qr_image: qrSignature
//   };

//   doc.render(docData);
//   return doc.getZip().generate({ type: 'nodebuffer' });
// }

// export async function POST(request: NextRequest, props: { params: Promise<{ nup: string }> }) {
//   const params = await props.params;
//   try {
//     // 1. Autentikasi admin (role array support)
//     const cookieStore = await cookies();
//     const allCookies = await cookieStore;
//     const adminNik = allCookies.get ? allCookies.get('nik')?.value : undefined;
//     if (!adminNik) {
//       return NextResponse.json({ error: 'Unauthorized: Admin NIK not found' }, { status: 401 });
//     }
//     const adminUser = await prisma.pegawai.findFirst({ 
//       where: {
//         nik: adminNik,
//         role: { has: 'admin' }
//       },
//       select: { role: true }
//     });
//     if (!adminUser) {
//       return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
//     }

//     // 2. Ambil NUP dari parameter URL
//     const { nup } = params;
//     if (!nup) {
//       return NextResponse.json({ error: 'NUP parameter is required' }, { status: 400 });
//     }

//     // 3. Query data pegawai
//     const pegawai = await prisma.pegawai.findUnique({
//       where: { nup },
//       include: {
//         pelatihan: true,
//         pengalaman_kerja: true,
//       },
//     });
//     if (!pegawai) {
//       return NextResponse.json({ error: 'Pegawai not found' }, { status: 404 });
//     }

//     // 4. Update cvGeneratedAt
//     const now = new Date();
//     await prisma.pegawai.update({
//       where: { nup },
//       data: { cv_generated_at: now },
//     });

//     // 5. Generate QR-Code untuk tanda tangan digital
//     const qrData = JSON.stringify({
//       nama_pegawai: pegawai.nama_pegawai,
//       nup,
//       perusahaan: 'PT. BKI Komersil Balikpapan',
//       generatedAt: now.toISOString(),
//       generatedBy: 'admin',
//     });
//     const qrSignature = await QRCode.toDataURL(qrData);

//     // 6. Generate DOCX file
//     const docxBuffer = await generateDocxBuffer(pegawai, qrSignature);

//     // 7. Return DOCX file
//     const fileName = `cv_${pegawai.nama_pegawai.replace(/\s+/g, '_')}_${now.toISOString().split('T')[0]}.docx`;
//     return new NextResponse(docxBuffer, {
//       headers: {
//         'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
//         'Content-Disposition': `attachment; filename="${fileName}"`
//       }
//     });
//   } catch (err) {
//     console.error('Admin CV Generator API error:', err);
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   }
// }