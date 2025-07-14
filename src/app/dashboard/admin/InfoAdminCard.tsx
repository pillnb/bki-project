import { cookies } from "next/headers";
import { getAdminByNik } from "./data-admin";

export default async function InfoAdminCard() {
  const cookieStore = await cookies();
  const nik = cookieStore.get("nik")?.value;
  const dataDiri = nik ? await getAdminByNik(nik) : null;

  return (
    <div className="rounded-xl shadow-lg p-6 flex items-center gap-6 mb-8" style={{ backgroundColor: '#193288' }}>
      <div className="w-20 h-20 rounded-full bg-yellow-400 flex items-center justify-center text-4xl font-bold text-white border-2 border-white border-solid shadow-md">
        <span role="img" aria-label="avatar">🧑🏽‍💼</span>
      </div>
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">{dataDiri?.nama_pegawai || '-'}</h2>
        <div className="text-white text-sm">Status Pegawai: <span className="font-bold text-white">{dataDiri?.status_pegawai || '-'}</span></div>
      </div>
    </div>
  );
}
