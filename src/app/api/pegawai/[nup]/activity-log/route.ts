import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest, context: { params: { nup: string } }) {
  const { nup } = await context.params;
  try {
    // Ambil data surat tugas yang diajukan oleh pegawai
    const suratTugas = await prisma.pegawaiSuratTugas.findMany({
      where: { pegawaiNup: nup },
      include: {
        suratTugas: true,
      },
      orderBy: { id: 'desc' },
    });
    // Ambil data pelatihan/training yang sedang berjalan
    const training = await prisma.pelatihan.findMany({
      where: {
        nup,
        status: 'ON_GOING',
      },
      orderBy: { tanggal_awal: 'desc' },
    });
    return NextResponse.json({
      suratTugas: suratTugas.map((st) => st.suratTugas),
      training,
    });
  } catch (error) {
    console.error('API Error - Gagal mengambil activity log:', error);
    return NextResponse.json({ error: 'Gagal mengambil activity log.' }, { status: 500 });
  }
}
