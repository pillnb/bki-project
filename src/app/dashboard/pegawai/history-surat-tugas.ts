import prisma from '@/lib/prisma';

export async function getHistorySuratTugasByNup(nup: string) {
  if (!nup) return [];
  // Cari surat tugas yang memiliki pegawai_surat_tugas dengan pegawaiNup = nup
  const suratTugas = await prisma.suratTugas.findMany({
    where: {
      pegawai_surat_tugas: {
        some: {
          pegawaiNup: nup,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    include: {
      pegawai_surat_tugas: true,
    },
  });
  return suratTugas;
}
