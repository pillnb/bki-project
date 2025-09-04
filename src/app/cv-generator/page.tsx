import { cookies } from "next/headers";
import { getPegawaiByNik } from "../dashboard/pegawai/data-diri";
import { getKualifikasiByNup, getPengalamanKerjaByNup } from "./data-cv";
import CVGeneratorClient from "@/components/cv-generator/CVGeneratorClient";

export default async function CVGeneratorPage() {
  const cookieStore = await cookies();
  const nik = cookieStore.get("nik")?.value;

  const dataDiri = nik ? await getPegawaiByNik(nik) : null;
  const nup = dataDiri?.nup ?? "";

  const dataKualifikasi = nup ? await getKualifikasiByNup(nup) : [];
  const dataPengalaman = nup ? await getPengalamanKerjaByNup(nup) : [];

  return (
    <CVGeneratorClient
      initialDataDiri={dataDiri}
      initialDataKualifikasi={dataKualifikasi}
      initialDataPengalaman={dataPengalaman}
      nup={nup}
    />
  );
}