import prisma from '@/lib/prisma';

export async function getHistorySuratTugasByNup(nup: string) {
  // Jika NUP tidak diberikan, kembalikan array kosong untuk menghindari error.
  if (!nup) return [];

  try {
    const suratTugas = await prisma.suratTugas.findMany({
      where: {
        timInspektor: {
          some: {
            nup: nup,
          },
        },
      },
      // Urutkan berdasarkan tanggal pembuatan, dari yang terbaru
      orderBy: { createdAt: 'desc' },
      // Sertakan data relasi yang relevan
      include: {
        // Sertakan data anggota tim lainnya
        timInspektor: {
          select: {
            nup: true,
            nama_pegawai: true,
          }
        },
        // Sertakan juga data proyek terkait
        proyek: true,
      },
    });

    return suratTugas;
  } catch (error) {
    console.error(`Error saat mengambil riwayat surat tugas untuk NUP ${nup}:`, error);
    return [];
  }
}