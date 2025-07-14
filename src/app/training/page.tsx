import { cookies } from 'next/headers';
import { getPegawaiByNik } from '../dashboard/pegawai/data-diri'; // Sesuaikan path jika perlu
import TrainingPegawaiClient from './TrainingPegawaiClient'; // Sesuaikan path jika perlu

export const dynamic = "force-dynamic";

export default async function TrainingPage() {
  // 1. Ambil NIK dari cookie, sama seperti di dashboard
  const cookieStore = await cookies();
  const nik = cookieStore.get("nik")?.value;

  // 2. Dapatkan data diri dan NUP pegawai
  const pegawai = nik ? await getPegawaiByNik(nik) : null;
  const nup = pegawai?.nup;

  // 3. Render komponen client dan berikan data pegawai sebagai props
  return (
    <TrainingPegawaiClient nup={nup} pegawai={pegawai} />
  );
}