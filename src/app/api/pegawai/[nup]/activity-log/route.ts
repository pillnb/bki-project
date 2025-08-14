import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest, context: { params: { nup: string } }) {
  // Mengambil NUP dari parameter URL
  const { nup } = context.params;

  // Memastikan NUP ada sebelum melanjutkan
  if (!nup) {
    return NextResponse.json({ error: 'NUP pegawai diperlukan.' }, { status: 400 });
  }

  try {
    // PERBAIKAN: Mengambil data surat tugas langsung dari model SuratTugas
    // Logikanya: cari semua SuratTugas di mana `timInspektor`-nya
    // memiliki (some) pegawai dengan NUP yang sesuai.
    const suratTugas = await prisma.suratTugas.findMany({
      where: {
        timInspektor: {
          some: {
            nup: nup,
          },
        },
      },
      // Mengurutkan berdasarkan tanggal pembuatan, dari yang terbaru
      orderBy: { createdAt: 'desc' },
    });

    // Ambil data pelatihan/training yang sedang berjalan
    // Query ini sudah benar sesuai skema Anda
    const training = await prisma.pelatihan.findMany({
      where: {
        nup,
        status: 'ON_GOING',
      },
      orderBy: { tanggal_awal: 'desc' },
    });

    // Mengembalikan hasil dalam format JSON
    return NextResponse.json({
      suratTugas, // Hasilnya sudah berupa array SuratTugas, tidak perlu di-map lagi
      training,
    });
  } catch (error) {
    console.error('API Error - Gagal mengambil activity log:', error);
    return NextResponse.json({ error: 'Gagal mengambil activity log.' }, { status: 500 });
  }
}