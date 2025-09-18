"use client";

import { useState } from "react";
import Navbar from "../dashboard/pegawai/Navbar";
import SuratTugasForm from "@/components/SuratTugas/SuratTugasForm";
import MonitoringSuratTugas from "@/components/SuratTugas/MonitoringSuratTugas";
import { PlusCircle, ArrowLeft } from "lucide-react";

export default function SuratTugasPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleFormSubmitted = () => {
    setRefreshKey((v) => v + 1);
    setIsFormVisible(false);
  };

  return (
    <div className="min-h-screen bg-[#e9f1fa]">
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-blue-900">
            {isFormVisible ? "Buat Ajuan Surat Tugas" : "Monitoring Surat Tugas"}
          </h1>
          <div>
            {isFormVisible ? (
              <button
                onClick={() => setIsFormVisible(false)}
                className="inline-flex items-center gap-2 rounded-lg bg-gray-500 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-600 transition-colors"
              >
                <ArrowLeft size={16} />
                Kembali
              </button>
            ) : (
              <button
                onClick={() => setIsFormVisible(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
              >
                <PlusCircle size={16} />
                Buat Ajuan
              </button>
            )}
          </div>
        </div>

        <div>
          {isFormVisible ? (
            <SuratTugasForm onSubmitted={handleFormSubmitted} />
          ) : (
            <MonitoringSuratTugas key={refreshKey} />
          )}
        </div>
      </div>
    </div>
  );
}