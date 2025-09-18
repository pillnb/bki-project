import { cookies } from "next/headers";
import { getPegawaiByNik } from "../dashboard/pegawai/data-diri";
import { getKualifikasiByNup, getPengalamanKerjaByNup } from "./data-cv";
import CVGeneratorClient from "@/components/cv-generator/CVGeneratorClient";

export default async function CVGeneratorPage() {
  const cookieStore = await cookies();
  const nik = cookieStore.get("nik")?.value;

  const defaultDataDiri = {
    nup: "",
    nama_pegawai: "",
    status_pegawai: null,
    jabatan: null,
    tempat_lahir: null,
    tanggal_lahir: null,
    alamat: null,
    warga_negara: null,
    agama: null,
    no_telepon: null,
    email: null,
  };

  const dataDiri = nik ? await getPegawaiByNik(nik) : defaultDataDiri;
  const nup = dataDiri?.nup ?? "";

  const dataKualifikasi = nup ? await getKualifikasiByNup(nup) : [];
  const dataPengalaman = nup ? await getPengalamanKerjaByNup(nup) : [];

  return (
    <CVGeneratorClient
      initialDataDiri={dataDiri ?? defaultDataDiri}
      initialDataKualifikasi={dataKualifikasi}
      initialDataPengalaman={dataPengalaman}
      nup={nup}
    />
  );
}