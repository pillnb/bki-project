
import Navbar from "./Navbar";
import { getPegawaiByNik } from "./data-diri";
import { getKualifikasiByNup, getPengalamanKerjaByNup } from "../../cv-generator/data-cv";
import { getHistorySuratTugasByNup } from "./history-surat-tugas";

export const dynamic = "force-dynamic";


import { cookies } from "next/headers";

function formatDate(date: Date | string | null | undefined) {
  if (!date) return "-";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" });
}



export default async function PegawaiDashboard() {
  // Ambil NIK dari cookie (misal: cookie 'nik' di-set saat login)
  const cookieStore = await cookies();
  const nik = cookieStore.get("nik")?.value;
  const dataDiri = nik ? await getPegawaiByNik(nik) : null;
  const nup = dataDiri?.nup ?? "";

  // Ambil data kualifikasi dan pengalaman kerja
  const dataKualifikasi = nup ? await getKualifikasiByNup(nup) : [];
  const dataPengalaman = nup ? await getPengalamanKerjaByNup(nup) : [];

  // Ambil history surat tugas dari database
  const historySuratTugas = nup ? await getHistorySuratTugasByNup(nup) : [];

  const historyTraining = [
    { nama: "Training A", status: "On Going" },
    { nama: "Training B", status: "Selesai" },
  ];

  return (
    <div className="min-h-screen bg-[#e9f1fa] pb-10">
      <Navbar />
      <div className="max-w-3xl mx-auto mt-8">
        {/* Data Pegawai */}
        <div className="rounded-xl shadow-lg p-6 flex items-center gap-6 mb-8" style={{ backgroundColor: '#193288' }}>
          <div className="w-20 h-20 rounded-full bg-yellow-400 flex items-center justify-center text-4xl font-bold text-white border-2 border-white border-solid shadow-md">
            <span role="img" aria-label="avatar">🧑🏽‍💼</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">{dataDiri?.nama_pegawai || '-'}</h2>
            <div className="text-white text-sm">Status Pegawai: <span className="font-bold text-white">{dataDiri?.status_pegawai || '-'}</span></div>
          </div>
        </div>

        {/* Data Diri */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h3 className="text-lg font-bold text-blue-900 mb-4">Data Diri</h3>
          {dataDiri ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-500 mb-1">NUP</div>
                <div className="bg-blue-50 rounded px-3 py-2 mb-2 text-black">{dataDiri.nup}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Status/Jabatan Pegawai</div>
                <div className="bg-blue-50 rounded px-3 py-2 mb-2 text-black">{dataDiri.status_pegawai || '-'}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Nama Lengkap</div>
                <div className="bg-blue-50 rounded px-3 py-2 mb-2 text-black">{dataDiri.nama_pegawai}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Email</div>
                <div className="bg-blue-50 rounded px-3 py-2 mb-2 text-black">{dataDiri.email || '-'}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Tempat Lahir</div>
                <div className="bg-blue-50 rounded px-3 py-2 mb-2 text-black">{dataDiri.tempat_lahir || '-'}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Tanggal Lahir</div>
                <div className="bg-blue-50 rounded px-3 py-2 mb-2 text-black">{formatDate(dataDiri.tanggal_lahir)}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Kewarganegaraan</div>
                <div className="bg-blue-50 rounded px-3 py-2 mb-2 text-black">{dataDiri.warga_negara || '-'}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Agama</div>
                <div className="bg-blue-50 rounded px-3 py-2 mb-2 text-black">{dataDiri.agama || '-'}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">No. Telepon</div>
                <div className="bg-blue-50 rounded px-3 py-2 mb-2 text-black">{dataDiri.no_telepon || '-'}</div>
              </div>
              <div className="md:col-span-2">
                <div className="text-xs text-gray-500 mb-1">Alamat</div>
                <div className="bg-blue-50 rounded px-3 py-2 mb-2 text-black">{dataDiri.alamat || '-'}</div>
              </div>
            </div>
          ) : (
            <div className="text-red-500">Data pegawai tidak ditemukan.</div>
          )}
        </div>

        {/* Section Data Kualifikasi */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h3 className="text-lg font-bold text-blue-900 mb-4">Data Kualifikasi</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border rounded">
              <thead>
                <tr className="bg-blue-100 text-blue-900">
                  <th className="py-2 px-3 text-left">ID</th>
                  <th className="py-2 px-3 text-left">Nama Kualifikasi</th>
                  <th className="py-2 px-3 text-left">Penyelenggara</th>
                  <th className="py-2 px-3 text-left">No Sertifikat</th>
                  <th className="py-2 px-3 text-left">Tahun</th>
                  <th className="py-2 px-3 text-left">Tanggal Awal</th>
                  <th className="py-2 px-3 text-left">Tanggal Akhir</th>
                  <th className="py-2 px-3 text-left">Kadaluarsa</th>
                  <th className="py-2 px-3 text-left">Status</th>
                  <th className="py-2 px-3 text-left">Keterangan Utilisasi</th>
                </tr>
              </thead>
              <tbody>
                {dataKualifikasi.length === 0 ? (
                  <tr><td colSpan={10} className="text-center text-gray-400 py-4">Belum ada data kualifikasi</td></tr>
                ) : (
                  dataKualifikasi.map((k: any, idx: number) => (
                    <tr key={idx} className="border-b last:border-b-0">
                      <td className="py-2 px-3 text-black">{k.id_pelatihan ?? '-'}</td>
                      <td className="py-2 px-3 text-black">{k.kualifikasi}</td>
                      <td className="py-2 px-3 text-black">{k.penyelenggara}</td>
                      <td className="py-2 px-3 text-black">{k.nomor_sertifikat}</td>
                      <td className="py-2 px-3 text-black">{k.tahun}</td>
                      <td className="py-2 px-3 text-black">{k.tanggal_awal ? formatDate(k.tanggal_awal) : '-'}</td>
                      <td className="py-2 px-3 text-black">{k.tanggal_akhir ? formatDate(k.tanggal_akhir) : '-'}</td>
                      <td className="py-2 px-3 text-black">{k.masa_berlaku ? formatDate(k.masa_berlaku) : '-'}</td>
                      <td className="py-2 px-3 text-black">
                        {k.status === "Sedang Berlangsung" && <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-800 font-semibold text-xs">Sedang Berlangsung</span>}
                        {k.status === "Valid" && <span className="px-2 py-1 rounded bg-green-100 text-green-800 font-semibold text-xs">Valid</span>}
                        {k.status === "Expired" && <span className="px-2 py-1 rounded bg-red-100 text-red-800 font-semibold text-xs">Expired</span>}
                        {k.status === "Belum Berlaku" && <span className="px-2 py-1 rounded bg-gray-100 text-gray-800 font-semibold text-xs">Belum Berlaku</span>}
                        {!["Sedang Berlangsung","Valid","Expired","Belum Berlaku"].includes(k.status) && <span>{k.status}</span>}
                      </td>
                      <td className="py-2 px-3 text-black">{k.keterangan_utilisasi}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section Data Pengalaman Kerja */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h3 className="text-lg font-bold text-blue-900 mb-4">Data Pengalaman Kerja</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border rounded">
              <thead>
                <tr className="bg-blue-100 text-blue-900">
                  <th className="py-2 px-3 text-left">ID</th>
                  <th className="py-2 px-3 text-left">Pengalaman Kerja</th>
                  <th className="py-2 px-3 text-left">Perusahaan</th>
                  <th className="py-2 px-3 text-left">Tahun</th>
                </tr>
              </thead>
              <tbody>
                {dataPengalaman.length === 0 ? (
                  <tr><td colSpan={4} className="text-center text-gray-400 py-4">Belum ada data pengalaman kerja</td></tr>
                ) : (
                  dataPengalaman.map((p: any, idx: number) => (
                    <tr key={idx} className="border-b last:border-b-0">
                      <td className="py-2 px-3 text-black">{p.id_pengalaman ?? '-'}</td>
                      <td className="py-2 px-3 text-black">{p.pengalaman_kerja}</td>
                      <td className="py-2 px-3 text-black">{p.perusahaan}</td>
                      <td className="py-2 px-3 text-black">{p.tahun}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* History Surat Tugas */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-blue-900">History Surat Tugas</h3>
            <a
              href="/surat-tugas#monitoring-surat-tugas"
              className="text-gray-400 hover:underline text-xs font-medium"
              style={{ border: 'none', padding: 0 }}
            >
              Lihat Semua
            </a>
          </div>
          {historySuratTugas.length === 0 ? (
            <div className="text-gray-500 italic">Belum ada Permohonan Surat Tugas yang Diajukan.</div>
          ) : (
            <ul className="divide-y">
              {historySuratTugas.map((surat: any, idx: number) => (
                <li key={surat.id || idx} className="py-2 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div>
                    <span className="font-semibold text-blue-900">{surat.klien}</span>
                    <span className="ml-2 text-gray-700">{surat.pekerjaan}</span>
                    <span className="ml-2 text-xs text-gray-500">({formatDate(surat.createdAt)})</span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className={`px-2 py-1 rounded text-xs font-semibold
                      ${surat.status === 'MENUNGGU_APPROVAL' ? 'bg-yellow-100 text-yellow-800' :
                        surat.status === 'SELESAI' ? 'bg-green-100 text-green-800' :
                        surat.status === 'DITOLAK' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'}`}
                    >
                      {surat.status === 'MENUNGGU_APPROVAL' ? 'Menunggu Approval' :
                        surat.status === 'SELESAI' ? 'Selesai' :
                        surat.status === 'DITOLAK' ? 'Ditolak' :
                        'Diajukan'}
                    </span>
                    {surat.nomor_surat && (
                      <span className="text-xs text-gray-500 ml-2">No: {surat.nomor_surat}</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* History Training */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h3 className="text-lg font-bold text-blue-900 mb-4">History Training</h3>
          <ul className="divide-y">
            {historyTraining.map((training, idx) => (
              <li key={idx} className="flex justify-between py-2">
                <span>{training.nama}</span>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${training.status === "On Going" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}`}>
                  {training.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}