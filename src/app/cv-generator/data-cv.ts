
export async function getKualifikasiByNup(nup: string) {
  return await prisma.pelatihan.findMany({
    where: { nup },
    select: {
      id_pelatihan: true,
      kualifikasi: true,
      penyelenggara: true,
      nomor_sertifikat: true,
      tahun: true,
      tanggal_awal: true,
      tanggal_akhir: true,
      masa_berlaku: true,
      status: true,
      keterangan_utilisasi: true,
    },
    orderBy: { tahun: "desc" },
  });
}

export async function getPengalamanKerjaByNup(nup: string) {
  return await prisma.pengalaman_kerja.findMany({
    where: { nup },
    select: {
      id_pengalaman: true,
      pengalaman_kerja: true,
      perusahaan: true,
      tahun: true,
    },
    orderBy: { tahun: "desc" },
  });
}
