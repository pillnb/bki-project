import prisma from '@/lib/prisma';

export async function getHistorySuratTugasByNup(nup: string) {
  if (!nup) return [];

  try {
    const suratTugas = await prisma.suratTugas.findMany({
      where: {
        timInspektor: {
          some: { nup },
        },
      },
      orderBy: { createdAt: 'desc' },
      include: {
        proyek: {
          select: {
            id: true,
            namaProyek: true,
            klien: true,
            lokasi: true,
          },
        },
        timInspektor: {
          select: {
            nup: true,
            nama_pegawai: true,
          },
        },
        leadInspector: {
          select: {
            nup: true,
            nama_pegawai: true,
          },
        },
      },
    });

    return suratTugas;
  } catch (error) {
    console.error(
      `Error saat mengambil riwayat surat tugas untuk NUP ${nup}:`,
      error
    );
    return [];
  }
}