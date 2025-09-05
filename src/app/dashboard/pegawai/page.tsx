import Navbar from "./Navbar";
import { getPegawaiByNik } from "./data-diri";
import { getKualifikasiByNup, getPengalamanKerjaByNup } from "../../cv-generator/data-cv";
import { getTrainingOnGoingByNup } from "../../cv-generator/data-training";
import { getHistorySuratTugasByNup } from "./history-surat-tugas";
import LogoutButton from "../admin/LogoutButton";

export const dynamic = "force-dynamic";

import { cookies } from "next/headers";

function formatDate(date: Date | string | null | undefined) {
  if (!date) return "-";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" });
}

// kecil2 bantu tampilan status agar aman ke berbagai nilai
function statusBadge(s?: string | null) {
  const v = String(s || "DIAJUKAN").toUpperCase();
  let cls = "bg-blue-100 text-blue-800";
  let label = "Diajukan";

  if (["MENUNGGU_APPROVAL", "MENUNGGU_LEAD", "MENUNGGU_KOORDINATOR", "MENUNGGU_SM", "MENUNGGU_KACAB"].includes(v)) {
    cls = "bg-yellow-100 text-yellow-800";
    label = "Menunggu Approval";
  } else if (["DISETUJUI", "BERJALAN", "SELESAI"].includes(v)) {
    cls = "bg-green-100 text-green-800";
    label = v === "SELESAI" ? "Selesai" : v === "BERJALAN" ? "Berjalan" : "Disetujui";
  } else if (v === "DITOLAK") {
    cls = "bg-red-100 text-red-800";
    label = "Ditolak";
  }

  return (
    <span className={`px-2 py-1 rounded text-xs font-semibold ${cls}`}>
      {label}
    </span>
  );
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

  // Ambil data training ON_GOING
  const historyTraining = nup ? await getTrainingOnGoingByNup(nup) : [];

  return (
    <div className="min-h-screen bg-[#e9f1fa] pb-10">
      <Navbar />
      <div className="max-w-3xl mx-auto mt-8">
        {/* Data Pegawai */}
        <div
          className="rounded-xl shadow-lg p-6 flex items-center justify-between mb-8"
          style={{ backgroundColor: "#193288" }}
        >
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-yellow-400 flex items-center justify-center text-4xl font-bold text-white border-2 border-white border-solid shadow-md">
              <span role="img" aria-label="avatar">
                🧑🏽‍💼
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">{dataDiri?.nama_pegawai || "-"}</h2>
              <div className="text-white text-sm">
                Status Pegawai: <span className="font-bold text-white">{dataDiri?.status_pegawai || "-"}</span>
              </div>
            </div>
          </div>
          <LogoutButton />
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
                <div className="bg-blue-50 rounded px-3 py-2 mb-2 text-black">{dataDiri.status_pegawai || "-"}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Nama Lengkap</div>
                <div className="bg-blue-50 rounded px-3 py-2 mb-2 text-black">{dataDiri.nama_pegawai}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Email</div>
                <div className="bg-blue-50 rounded px-3 py-2 mb-2 text-black">{dataDiri.email || "-"}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Tempat Lahir</div>
                <div className="bg-blue-50 rounded px-3 py-2 mb-2 text-black">{dataDiri.tempat_lahir || "-"}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Tanggal Lahir</div>
                <div className="bg-blue-50 rounded px-3 py-2 mb-2 text-black">{formatDate(dataDiri.tanggal_lahir)}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Kewarganegaraan</div>
                <div className="bg-blue-50 rounded px-3 py-2 mb-2 text-black">{dataDiri.warga_negara || "-"}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Agama</div>
                <div className="bg-blue-50 rounded px-3 py-2 mb-2 text-black">{dataDiri.agama || "-"}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">No. Telepon</div>
                <div className="bg-blue-50 rounded px-3 py-2 mb-2 text-black">{dataDiri.no_telepon || "-"}</div>
              </div>
              <div className="md:col-span-2">
                <div className="text-xs text-gray-500 mb-1">Alamat</div>
                <div className="bg-blue-50 rounded px-3 py-2 mb-2 text-black">{dataDiri.alamat || "-"}</div>
              </div>
            </div>
          ) : (
            <div className="text-red-500">Data pegawai tidak ditemukan.</div>
          )}
        </div>

        {/* Data Kualifikasi */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h3 className="text-lg font-bold text-blue-900 mb-4">Data Kualifikasi</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border rounded">
              <thead>
                <tr className="bg-blue-100 text-blue-900">
                  <th className="py-2 px-3 text-left">No.</th>
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
                  <tr>
                    <td colSpan={10} className="text-center text-gray-400 py-4">
                      Belum ada data kualifikasi
                    </td>
                  </tr>
                ) : (
                  dataKualifikasi.map((k: unknown, idx: number) => {
                    const kual = k as {
                      nama_pelatihan?: string;
                      penyelenggara?: string;
                      nomor_sertifikat?: string;
                      tahun?: number;
                      tanggal_awal?: string;
                      tanggal_akhir?: string;
                      masa_berlaku?: string;
                      status?: string;
                      keterangan_utilisasi?: string;
                    };
                    return (
                    <tr key={idx} className="border-b last:border-b-0">
                      <td className="py-2 px-3 text-black">{idx + 1}</td>
                      <td className="py-2 px-3 text-black">{kual.nama_pelatihan}</td>
                      <td className="py-2 px-3 text-black">{kual.penyelenggara}</td>
                      <td className="py-2 px-3 text-black">{kual.nomor_sertifikat}</td>
                      <td className="py-2 px-3 text-black">{kual.tahun}</td>
                      <td className="py-2 px-3 text-black">{kual.tanggal_awal ? formatDate(kual.tanggal_awal) : "-"}</td>
                      <td className="py-2 px-3 text-black">{kual.tanggal_akhir ? formatDate(kual.tanggal_akhir) : "-"}</td>
                      <td className="py-2 px-3 text-black">{kual.masa_berlaku ? formatDate(kual.masa_berlaku) : "-"}</td>
                      <td className="py-2 px-3 text-black whitespace-nowrap">
                        {kual.status === "ON_GOING" && (
                          <span className="inline-block px-2 py-1 rounded bg-yellow-100 text-yellow-800 font-semibold text-xs whitespace-nowrap">
                            On Going
                          </span>
                        )}
                        {kual.status === "VALID" && (
                          <span className="inline-block px-2 py-1 rounded bg-green-100 text-green-800 font-semibold text-xs whitespace-nowrap">
                            Valid
                          </span>
                        )}
                        {kual.status === "EXPIRED" && (
                          <span className="inline-block px-2 py-1 rounded bg-red-100 text-red-800 font-semibold text-xs whitespace-nowrap">
                            Expired
                          </span>
                        )}
                        {!["ON_GOING", "VALID", "EXPIRED"].includes(kual.status ?? '') && (
                          <span className="inline-block whitespace-nowrap">{kual.status}</span>
                        )}
                      </td>
                      <td className="py-2 px-3 text-black">{kual.keterangan_utilisasi}</td>
                    </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Data Pengalaman Kerja */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h3 className="text-lg font-bold text-blue-900 mb-4">Data Pengalaman Kerja</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border rounded">
              <thead>
                <tr className="bg-blue-100 text-blue-900">
                  <th className="py-2 px-3 text-left">No.</th>
                  <th className="py-2 px-3 text-left">Pengalaman Kerja</th>
                  <th className="py-2 px-3 text-left">Perusahaan</th>
                  <th className="py-2 px-3 text-left">Tahun</th>
                </tr>
              </thead>
              <tbody>
                {dataPengalaman.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center text-gray-400 py-4">
                      Belum ada data pengalaman kerja
                    </td>
                  </tr>
                ) : (
                  dataPengalaman.map((p: unknown, idx: number) => {
                    const peng = p as {
                      pengalaman_kerja?: string;
                      perusahaan?: string;
                      tahun?: number;
                    };
                    return (
                    <tr key={idx} className="border-b last:border-b-0">
                      <td className="py-2 px-3 text-black">{idx + 1}</td>
                      <td className="py-2 px-3 text-black">{peng.pengalaman_kerja}</td>
                      <td className="py-2 px-3 text-black">{peng.perusahaan}</td>
                      <td className="py-2 px-3 text-black">{peng.tahun}</td>
                    </tr>
                    );
                  })
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
              style={{ border: "none", padding: 0 }}
            >
              Lihat Semua
            </a>
          </div>

          {historySuratTugas.length === 0 ? (
            <div className="text-gray-500 italic">Belum ada Permohonan Surat Tugas yang Diajukan.</div>
          ) : (
            <ul className="divide-y">
              {historySuratTugas.map((surat: unknown, idx: number) => {
                const suratData = surat as {
                  id?: number;
                  proyek?: { klien?: string; namaProyek?: string };
                  klien?: string;
                  pekerjaan?: string;
                  createdAt?: string;
                  nomor_surat?: string;
                  status?: string;
                };
                // AMBIL DARI RELASI PROYEK DULU
                const klien = suratData?.proyek?.klien ?? suratData?.klien ?? "-";
                const pekerjaan = suratData?.proyek?.namaProyek ?? suratData?.pekerjaan ?? "-";

                return (
                  <li
                    key={suratData.id || idx}
                    className="py-2 flex flex-col md:flex-row md:items-center md:justify-between gap-2"
                  >
                    <div>
                      <span className="font-semibold text-blue-900">{klien}</span>
                      <span className="ml-2 text-gray-700">{pekerjaan}</span>
                      <span className="ml-2 text-xs text-gray-500">({formatDate(suratData.createdAt)})</span>
                      {suratData.nomor_surat && (
                        <span className="ml-2 text-xs text-gray-500">No: {suratData.nomor_surat}</span>
                      )}
                    </div>
                    <div className="flex gap-2 items-center">{statusBadge(suratData.status)}</div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* History Training */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-blue-900">History Training (On Going)</h3>
            <a href="/training" className="text-gray-400 hover:underline text-xs font-medium" style={{ border: "none", padding: 0 }}>
              Lihat Semua
            </a>
          </div>
          {historyTraining.length === 0 ? (
            <div className="text-gray-500 italic">Tidak ada training yang sedang berlangsung.</div>
          ) : (
            <ul className="divide-y">
              {historyTraining.map((training: unknown, idx: number) => {
                const trainingData = training as {
                  id_pelatihan?: number;
                  nama_pelatihan?: string;
                  penyelenggara?: string;
                  tanggal_awal?: string;
                  nomor_sertifikat?: string;
                };
                return (
                <li
                  key={trainingData.id_pelatihan || idx}
                  className="py-2 flex flex-col md:flex-row md:items-center md:justify-between gap-2"
                >
                  <div>
                    <span className="font-semibold text-blue-900">{trainingData.nama_pelatihan}</span>
                    <span className="ml-2 text-gray-700">{trainingData.penyelenggara}</span>
                    <span className="ml-2 text-xs text-gray-500">
                      ({trainingData.tanggal_awal ? formatDate(trainingData.tanggal_awal) : "-"})
                    </span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="px-2 py-1 rounded text-xs font-semibold bg-yellow-100 text-yellow-800">On Going</span>
                    {trainingData.nomor_sertifikat && (
                      <span className="text-xs text-gray-500 ml-2">No: {trainingData.nomor_sertifikat}</span>
                    )}
                  </div>
                </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
