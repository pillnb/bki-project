"use client";

import React, { useState, useTransition } from "react";
import dynamic from 'next/dynamic';
import { tambahKualifikasi, tambahPengalaman } from "../actions";
import Navbar from "../../dashboard/pegawai/Navbar";

const Modal = dynamic(() => import("./Modal"), { ssr: false });
const KualifikasiForm = dynamic(() => import("./KualifikasiForm"), { ssr: false });
const PengalamanForm = dynamic(() => import("./PengalamanForm"), { ssr: false });

function formatDate(date: Date | string | null | undefined) {
  if (!date) return "-";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" });
}

type CVGeneratorPageClientProps = {
  initialDataDiri: any;
  initialDataKualifikasi: any[];
  initialDataPengalaman: any[];
  nup: string;
};

export default function CVGeneratorPageClient({ initialDataDiri, initialDataKualifikasi, initialDataPengalaman, nup }: CVGeneratorPageClientProps) {
  const [modalKualifikasi, setModalKualifikasi] = useState(false);
  const [modalPengalaman, setModalPengalaman] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleKualifikasiSubmit = async (formData: any) => {
    if (!nup) return;
    setModalKualifikasi(false);
    startTransition(() => {
      tambahKualifikasi(nup, formData).catch((e) => {
        setError(e.message || "Gagal menambah kualifikasi");
      });
    });
  };

  const handlePengalamanSubmit = async (formData: any) => {
    if (!nup) return;
    setModalPengalaman(false);
    startTransition(() => {
      tambahPengalaman(nup, formData).catch((e) => {
        setError(e.message || "Gagal menambah pengalaman kerja");
      });
    });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#e9f1fa] flex justify-center items-start py-10">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-4xl">
          <h1 className="text-2xl font-bold text-blue-900 mb-6 text-center">CV Generator</h1>
          {isPending && <div className="text-center text-blue-600 mb-4 p-2 bg-blue-50 rounded-md">Memperbarui data...</div>}

          <section className="mb-8">
            <h2 className="text-lg font-bold text-blue-900 mb-2">Data Diri</h2>
            {initialDataDiri ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-500 mb-1">NUP</div>
                  <div className="bg-blue-50 rounded px-3 py-2 mb-2 text-black">{initialDataDiri.nup}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Status/Jabatan Pegawai</div>
                  <div className="bg-blue-50 rounded px-3 py-2 mb-2 text-black">{initialDataDiri.status_pegawai || '-'}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Nama Lengkap</div>
                  <div className="bg-blue-50 rounded px-3 py-2 mb-2 text-black">{initialDataDiri.nama_pegawai}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Email</div>
                  <div className="bg-blue-50 rounded px-3 py-2 mb-2 text-black">{initialDataDiri.email || '-'}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Tempat Lahir</div>
                  <div className="bg-blue-50 rounded px-3 py-2 mb-2 text-black">{initialDataDiri.tempat_lahir || '-'}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Tanggal Lahir</div>
                  <div className="bg-blue-50 rounded px-3 py-2 mb-2 text-black">{formatDate(initialDataDiri.tanggal_lahir)}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Kewarganegaraan</div>
                  <div className="bg-blue-50 rounded px-3 py-2 mb-2 text-black">{initialDataDiri.warga_negara || '-'}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Agama</div>
                  <div className="bg-blue-50 rounded px-3 py-2 mb-2 text-black">{initialDataDiri.agama || '-'}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">No. Telepon</div>
                  <div className="bg-blue-50 rounded px-3 py-2 mb-2 text-black">{initialDataDiri.no_telepon || '-'}</div>
                </div>
                <div className="md:col-span-2">
                  <div className="text-xs text-gray-500 mb-1">Alamat</div>
                  <div className="bg-blue-50 rounded px-3 py-2 mb-2 text-black">{initialDataDiri.alamat || '-'}</div>
                </div>
              </div>
            ) : <div className="text-red-500">Data pegawai tidak ditemukan.</div>}
          </section>
          
          <section className="mb-8">
              <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-bold text-blue-900">Data Kualifikasi</h2>
                  <button disabled={isPending} onClick={() => setModalKualifikasi(true)} className="bg-blue-900 text-white px-4 py-2 rounded shadow hover:bg-blue-800 text-sm font-semibold disabled:bg-gray-400">Tambah Kualifikasi</button>
              </div>
              <div className="overflow-x-auto">
                  <table className="w-full text-sm border rounded">
                    <thead>
                        <tr className="bg-blue-100 text-blue-900">
                        <th className="py-2 px-3 text-left">Nama Kualifikasi</th>
                        <th className="py-2 px-3 text-left">Penyelenggara</th>
                        <th className="py-2 px-3 text-left">Nomor Sertifikat</th>
                        <th className="py-2 px-3 text-left">Tahun</th>
                        <th className="py-2 px-3 text-left">Tanggal Awal</th>
                        <th className="py-2 px-3 text-left">Tanggal Akhir</th>
                        <th className="py-2 px-3 text-left">Kadaluarsa</th>
                        <th className="py-2 px-3 text-left">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {initialDataKualifikasi.length === 0 ? (
                        <tr><td colSpan={8} className="text-center text-gray-400 py-4">Belum ada data kualifikasi</td></tr>
                        ) : (
                        initialDataKualifikasi.map((k: any, idx: number) => (
                            <tr key={idx} className="border-b last:border-b-0">
                            <td className="py-2 px-3 text-black">{k.nama_pelatihan}</td>
                            <td className="py-2 px-3 text-black">{k.penyelenggara}</td>
                            <td className="py-2 px-3 text-black">{k.nomor_sertifikat}</td>
                            <td className="py-2 px-3 text-black">{k.tahun}</td>
                            <td className="py-2 px-3 text-black">{formatDate(k.tanggal_awal)}</td>
                            <td className="py-2 px-3 text-black">{formatDate(k.tanggal_akhir)}</td>
                            <td className="py-2 px-3 text-black">{formatDate(k.masa_berlaku)}</td>
                            <td className="py-2 px-3 text-black whitespace-nowrap">
                              {k.status === "ON_GOING" && <span className="inline-block px-2 py-1 rounded bg-yellow-100 text-yellow-800 font-semibold text-xs whitespace-nowrap">On Going</span>}
                              {k.status === "VALID" && <span className="inline-block px-2 py-1 rounded bg-green-100 text-green-800 font-semibold text-xs whitespace-nowrap">Valid</span>}
                              {k.status === "EXPIRED" && <span className="inline-block px-2 py-1 rounded bg-red-100 text-red-800 font-semibold text-xs whitespace-nowrap">Expired</span>}
                              {!["ON_GOING","VALID","EXPIRED"].includes(k.status) && <span className="inline-block whitespace-nowrap">{k.status}</span>}
                            </td>
                            </tr>
                        ))
                        )}
                    </tbody>
                  </table>
              </div>
          </section>
          
          <section className="mb-8">
              <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-bold text-blue-900">Data Pengalaman Kerja</h2>
                  <button disabled={isPending} onClick={() => setModalPengalaman(true)} className="bg-blue-900 text-white px-4 py-2 rounded shadow hover:bg-blue-800 text-sm font-semibold disabled:bg-gray-400">Tambah Pengalaman</button>
              </div>
               <div className="overflow-x-auto">
                  <table className="w-full text-sm border rounded">
                  <thead>
                      <tr className="bg-blue-100 text-blue-900">
                      <th className="py-2 px-3 text-left">Nama Pengalaman</th>
                      <th className="py-2 px-3 text-left">Perusahaan</th>
                      <th className="py-2 px-3 text-left">Tahun</th>
                      </tr>
                  </thead>
                  <tbody>
                      {initialDataPengalaman.length === 0 ? (
                      <tr><td colSpan={3} className="text-center text-gray-400 py-4">Belum ada data pengalaman kerja</td></tr>
                      ) : (
                      initialDataPengalaman.map((p: any, idx: number) => (
                          <tr key={idx} className="border-b last:border-b-0">
                          <td className="py-2 px-3 text-black">{p.pengalaman_kerja}</td>
                          <td className="py-2 px-3 text-black">{p.perusahaan}</td>
                          <td className="py-2 px-3 text-black">{p.tahun}</td>
                          </tr>
                      ))
                      )}
                  </tbody>
                  </table>
              </div>
          </section>

          <div className="flex justify-center mt-8">
            <button className="bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 px-8 rounded shadow text-lg transition">Download CV PDF</button>
          </div>

          <Modal open={modalKualifikasi} onClose={() => setModalKualifikasi(false)} title="Tambah Kualifikasi">
            <KualifikasiForm onSubmit={handleKualifikasiSubmit} onCancel={() => setModalKualifikasi(false)} />
          </Modal>
          <Modal open={modalPengalaman} onClose={() => setModalPengalaman(false)} title="Tambah Pengalaman Kerja">
            <PengalamanForm onSubmit={handlePengalamanSubmit} onCancel={() => setModalPengalaman(false)} />
          </Modal>

          {error && <div className="text-red-500 text-center mt-4">{error}</div>}
        </div>
      </div>
    </>
  );
}