"use client";

import { useState } from "react";
import Navbar from "../dashboard/pegawai/Navbar";
import SuratTugasForm from "@/components/SuratTugas/SuratTugasForm";
import MonitoringSuratTugas from "@/components/SuratTugas/MonitoringSuratTugas";

export default function SuratTugasPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="min-h-screen bg-[#e9f1fa]">
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-blue-900 mb-8">
          Permohonan Surat Tugas Inspeksi
        </h1>

        <SuratTugasForm onSubmitted={() => setRefreshKey((v) => v + 1)} />
        <MonitoringSuratTugas key={refreshKey} />
      </div>
    </div>
  );
}