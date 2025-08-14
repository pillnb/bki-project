import { PrismaClient, StatusPelatihan } from '../src/generated/prisma';
import * as bcrypt from 'bcrypt';
import pegawaiData from './pegawai.json';
import kualifikasiData from './kualifikasi.json';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Mulai seeding data pegawai...');

  // Hash default password
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Import data dari pegawai.json
  const pegawaiToCreate = pegawaiData.map(p => ({
    nup: p.nup,
    nama_pegawai: p.nama_pegawai,
    jabatan: p.jabatan,
    tempat_lahir: p.tempat_lahir ?? null,
    tanggal_lahir: p.tanggal_lahir ? new Date(p.tanggal_lahir) : null,
    alamat: p.alamat ?? null,
    warga_negara: p.warga_negara ?? null,
    agama: p.agama ?? null,
    no_telepon: p.no_telepon ?? null,
    email: p.email ?? null,
    nik: p.nik ?? null,
    tandaTanganUrl: p.tandaTanganUrl ?? null,
    status_pegawai: p.status_pegawai ?? 'PKWTT',
    username: p.nik,
    password: hashedPassword,
  }));

  await prisma.pegawai.createMany({ data: pegawaiToCreate, skipDuplicates: true });
  console.log('✅ Seed pegawai selesai.');

  console.log('🌱 Mulai seeding data kualifikasi (pelatihan)...');
  const today = new Date();

  const createOps = kualifikasiData.map(k => {
    const awal    = k.tanggal_awal    ? new Date(k.tanggal_awal)    : null;
    const berlaku = k.masa_berlaku    ? new Date(k.masa_berlaku)    : null;
    const akhir   = k.tanggal_akhir   ? new Date(k.tanggal_akhir)   : null;
    const status: StatusPelatihan = (berlaku && berlaku < today)
      ? StatusPelatihan.EXPIRED
      : StatusPelatihan.VALID;

    return prisma.pelatihan.create({
      data: {
        nup:                  k.nup                  ?? null,
        nama_pelatihan:       k.nama_pelatihan       ?? null,
        penyelenggara:        k.penyelenggara        ?? null,
        lokasi:               k.lokasi               ?? null,
        nomor_sertifikat:     k.nomor_sertifikat     ?? null,
        file_sertifikat:      k.file_sertifikat      ?? null,
        tanggal_awal:         awal,
        masa_berlaku:         berlaku,
        keterangan_utilisasi: k.keterangan_utilisasi ?? null,
        tahun:                k.tahun                ?? null,
        tanggal_akhir:        akhir,
        status,
        pegawai: {
          connect: { nup: k.pegawai.connect.nup }
        }
      }
    });
  });

  const results = await Promise.allSettled(createOps);
  const successCount = results.filter(r => r.status === 'fulfilled').length;
  console.log(`✅ Berhasil menambahkan ${successCount} data kualifikasi.`);

  await prisma.$disconnect();
  console.log('✨ Seeding selesai!');
}

main().catch(e => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});