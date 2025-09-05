"use client";

import React, { useState, useTransition } from "react";
import Navbar from "@/app/dashboard/pegawai/Navbar";
import Modal from "./Modal";
import KualifikasiForm from "./KualifikasiForm";
import PengalamanForm from "./PengalamanForm";
import DataDiriCard from "./DataDiriCard";
import KualifikasiTable from "./KualifikasiTable";
import PengalamanTable from "./PengalamanTable";
import DownloadButton from "./DownloadButton";
import { tambahKualifikasi, tambahPengalaman } from "@/app/cv-generator/actions";
import type { CVGeneratorClientProps } from "./types";

export default function CVGeneratorClient({
  initialDataDiri,
  initialDataKualifikasi,
  initialDataPengalaman,
  nup,
}: CVGeneratorClientProps) {
  const [modalKualifikasi, setModalKualifikasi] = useState(false);
  const [modalPengalaman, setModalPengalaman] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleKualifikasiSubmit = (data: {
    kualifikasi: string;
    penyelenggara: string;
    nomor_sertifikat: string;
    tanggal_awal: string;
    tanggal_akhir: string;
    masa_berlaku: string;
    lokasi: string;
    keterangan_utilisasi: string;
    tahun: number;
    status_override?: string;
  }) => {
    startTransition(async () => {
      try {
        const allowed = ["ON_GOING", "VALID", "EXPIRED"] as const;
        const status = allowed.includes(data.status_override as typeof allowed[number])
          ? (data.status_override as (typeof allowed)[number])
          : undefined;
        await tambahKualifikasi(nup, { ...data, status_override: status });
        setModalKualifikasi(false);
        setError(null);
      } catch (e) {
        console.error(e);
        setError("Gagal menambah kualifikasi");
      }
    });
  };

  const handlePengalamanSubmit = (data: {
    pengalaman_kerja: string;
    perusahaan: string;
    tahun_awal: number;
    tahun_akhir: number;
    lokasi: string;
  }) => {
    startTransition(async () => {
      try {
        await tambahPengalaman(nup, data);
        setModalPengalaman(false);
        setError(null);
      } catch (e) {
        console.error(e);
        setError("Gagal menambah pengalaman");
      }
    });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#e9f1fa] flex justify-center items-start py-10">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-4xl">
          <h1 className="text-2xl font-bold text-blue-900 mb-6 text-center">CV Generator</h1>

          {isPending && <div className="text-center text-blue-600 mb-4 p-2 bg-blue-50 rounded-md">Memperbarui data...</div>}

          <DataDiriCard data={initialDataDiri} />

          <KualifikasiTable
            items={initialDataKualifikasi}
            onAddClick={() => setModalKualifikasi(true)}
          />

          <PengalamanTable
            items={initialDataPengalaman}
            onAddClick={() => setModalPengalaman(true)}
          />

          <div className="flex justify-center mt-8">
            <DownloadButton setError={setError} />
          </div>

          {error && <div className="text-red-500 text-center mt-4 p-2 bg-red-50 rounded-md">{error}</div>}

          <Modal open={modalKualifikasi} onClose={() => setModalKualifikasi(false)} title="Tambah Kualifikasi">
            <KualifikasiForm onSubmit={handleKualifikasiSubmit} onCancel={() => setModalKualifikasi(false)} />
          </Modal>

          <Modal open={modalPengalaman} onClose={() => setModalPengalaman(false)} title="Tambah Pengalaman Kerja">
            <PengalamanForm onSubmit={handlePengalamanSubmit} onCancel={() => setModalPengalaman(false)} />
          </Modal>
        </div>
      </div>
    </>
  );
}