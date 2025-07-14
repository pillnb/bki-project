import prisma from '@/lib/prisma';

export async function getAdminByNik(nik: string) {
  return await prisma.pegawai.findFirst({
    where: { nik, role: 'admin' },
    select: {
      nup: true,
      nama_pegawai: true,
      status_pegawai: true,
      jabatan: true,
      tempat_lahir: true,
      tanggal_lahir: true,
      alamat: true,
      warga_negara: true,
      agama: true,
      no_telepon: true,
      email: true,
      nik: true,
    },
  });
}
