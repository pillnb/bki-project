import { cookies } from "next/headers";
import { getPegawaiByNik } from "../dashboard/pegawai/data-diri";
import { getKualifikasiByNup, getPengalamanKerjaByNup } from "./data-cv";
import CVGeneratorClient from "./components/CVGeneratorClient";

export default async function CVGeneratorPage() {
  // Semua logika ini berjalan di server
  const cookieStore = await cookies();
  
  const nik = cookieStore.get("nik")?.value;
  
  const dataDiri = nik ? await getPegawaiByNik(nik) : null;
  const nup = dataDiri?.nup ?? "";
  
  const dataKualifikasi = nup ? await getKualifikasiByNup(nup) : [];
  const dataPengalaman = nup ? await getPengalamanKerjaByNup(nup) : [];

  // Memberikan data sebagai props ke komponen client
  return (
    <CVGeneratorClient 
      initialDataDiri={dataDiri} 
      initialDataKualifikasi={dataKualifikasi} 
      initialDataPengalaman={dataPengalaman} 
      nup={nup} 
    />
  );
}