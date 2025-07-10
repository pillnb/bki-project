import prisma from "@/lib/prisma";

export async function getTrainingOnGoingByNup(nup: string) {
  return await prisma.pelatihan.findMany({
    where: { nup, status: "ON_GOING" },
    select: {
      id_pelatihan: true,
      nama_pelatihan: true,
      penyelenggara: true,
      nomor_sertifikat: true,
      tahun: true,
      tanggal_awal: true,
      tanggal_akhir: true,
      masa_berlaku: true,
      status: true,
      keterangan_utilisasi: true,
    },
    orderBy: { tanggal_awal: "desc" },
  });
}
