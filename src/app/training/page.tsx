import { cookies } from "next/headers";
import { getPegawaiByNik } from "../dashboard/pegawai/data-diri";
import TrainingPegawaiClient from "@/components/training/TrainingPegawaiClient";

export const dynamic = "force-dynamic";

export default async function TrainingPage() {
  const cookieStore = await cookies();
  const nik = cookieStore.get("nik")?.value;
  const pegawai = nik ? await getPegawaiByNik(nik) : null;
  const nup = pegawai?.nup;

  return <TrainingPegawaiClient nup={nup} pegawai={pegawai} />;
}