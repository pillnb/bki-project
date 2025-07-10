import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  // Di aplikasi nyata, di sini Anda akan:
  // 1. Mengambil data surat tugas dengan ID
  // 2. Menggunakan library seperti 'puppeteer' atau 'pdf-lib' untuk membuat file PDF
  // 3. Mengirim file PDF tersebut sebagai respons

  console.log(`Menerima permintaan download PDF untuk Surat Tugas ID: ${id}`);

  // Untuk sekarang, kita kirim respons dummy seolah-olah ini adalah file PDF
  const dummyPdfContent = `Ini adalah konten PDF dummy untuk Surat Tugas ID: ${id}`;
  const blob = new Blob([dummyPdfContent], { type: 'application/pdf' });

  return new NextResponse(blob, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="surat-tugas-${id}.pdf"`,
    },
  });
}