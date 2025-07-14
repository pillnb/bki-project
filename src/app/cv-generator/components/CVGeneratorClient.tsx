"use client";

import React, { useState, useTransition } from "react";
import { Download, FileText, File, Loader2 } from 'lucide-react';
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

// Komponen download CV dengan pilihan format
type CVDownloadComponentProps = {
  setError: (msg: string | null) => void;
};

const CVDownloadComponent = ({ setError }: CVDownloadComponentProps) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState<'docx' | 'pdf'>('docx');
  const [showDropdown, setShowDropdown] = useState(false);

  const handleDownload = async (format: 'docx' | 'pdf') => {
    setIsDownloading(true);
    setShowDropdown(false);
    setError(null);
    
    try {
      const response = await fetch('/api/cv/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ format }),
      });
      
      if (!response.ok) {
        let errorMsg = 'Download failed';
        try {
          const errorData = await response.json();
          errorMsg = errorData.error || errorMsg;
        } catch {}
        throw new Error(errorMsg);
      }
      
      // Get filename from response headers
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = `cv_pegawai.${format}`;
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match) filename = match[1];
      }
      
      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error: any) {
      setError(error.message || 'Gagal download CV');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="relative inline-block">
      {/* Main Download Button */}
      <div className="flex">
        <button
          onClick={() => handleDownload(downloadFormat)}
          disabled={isDownloading}
          className="flex items-center gap-2 bg-blue-900 hover:bg-blue-800 disabled:bg-blue-400 text-white px-4 py-2 rounded-l-lg transition-colors font-semibold"
        >
          {isDownloading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          {isDownloading ? 'Generating...' : `Download ${downloadFormat.toUpperCase()}`}
        </button>
        
        {/* Dropdown Button */}
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          disabled={isDownloading}
          className="bg-blue-900 hover:bg-blue-800 disabled:bg-blue-400 text-white px-2 py-2 rounded-r-lg border-l border-blue-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      
      {/* Dropdown Menu */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          <div className="py-1">
            <button
              onClick={() => {
                setDownloadFormat('docx');
                handleDownload('docx');
              }}
              className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors"
            >
              <FileText className="w-4 h-4 text-blue-600" />
              <span className="text-black">Download as DOCX</span>
            </button>
            <button
              onClick={() => {
                setDownloadFormat('pdf');
                handleDownload('pdf');
              }}
              className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors"
            >
              <File className="w-4 h-4 text-red-600" />
              <span className="text-black">Download as PDF</span>
            </button>
          </div>
        </div>
      )}
      
      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};

export default function CVGeneratorPageClient({ 
  initialDataDiri, 
  initialDataKualifikasi, 
  initialDataPengalaman, 
  nup 
}: CVGeneratorPageClientProps) {
  const [modalKualifikasi, setModalKualifikasi] = useState(false);
  const [modalPengalaman, setModalPengalaman] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleKualifikasiSubmit = async (data: {
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
        // Convert status_override to the correct enum type or undefined
        const allowedStatus = ["ON_GOING", "VALID", "EXPIRED"] as const;
        const status = allowedStatus.includes(data.status_override as any)
          ? (data.status_override as "ON_GOING" | "VALID" | "EXPIRED")
          : undefined;
        await tambahKualifikasi(nup, { ...data, status_override: status });
        setModalKualifikasi(false);
      } catch (error) {
        console.error('Error adding kualifikasi:', error);
      }
    });
  };

  const handlePengalamanSubmit = async (data: {
    pengalaman_kerja: string;
    perusahaan: string;
    tahun: number;
    lokasi: string;
  }) => {
    startTransition(async () => {
      try {
        await tambahPengalaman(nup, data);
        setModalPengalaman(false);
      } catch (error) {
        console.error('Error adding pengalaman:', error);
      }
    });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#e9f1fa] flex justify-center items-start py-10">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-4xl">
          <h1 className="text-2xl font-bold text-blue-900 mb-6 text-center">CV Generator</h1>
          
          {isPending && (
            <div className="text-center text-blue-600 mb-4 p-2 bg-blue-50 rounded-md">
              Memperbarui data...
            </div>
          )}

          {/* Data Diri Section */}
          <div className="bg-white rounded-xl shadow p-6 mb-8">
            <h3 className="text-lg font-bold text-blue-900 mb-4">Data Diri</h3>
            {initialDataDiri ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-500 mb-1">NUP</div>
                  <div className="bg-blue-50 rounded px-3 py-2 mb-2 text-black">{initialDataDiri.nup || '-'}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Status/Jabatan Pegawai</div>
                  <div className="bg-blue-50 rounded px-3 py-2 mb-2 text-black">{initialDataDiri.status_pegawai || initialDataDiri.jabatan || '-'}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Nama Lengkap</div>
                  <div className="bg-blue-50 rounded px-3 py-2 mb-2 text-black">{initialDataDiri.nama_pegawai || '-'}</div>
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
                  <div className="text-xs text-gray-500 mb-1">Agama</div>
                  <div className="bg-blue-50 rounded px-3 py-2 mb-2 text-black">{initialDataDiri.agama || '-'}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Kewarganegaraan</div>
                  <div className="bg-blue-50 rounded px-3 py-2 mb-2 text-black">{initialDataDiri.warga_negara || '-'}</div>
                </div>
              </div>
            ) : (
              <div className="text-gray-500">Tidak ada data diri.</div>
            )}
          </div>

          {/* Kualifikasi Section */}
          <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-blue-800">Kualifikasi & Pelatihan</h2>
              <button
                onClick={() => setModalKualifikasi(true)}
                className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg transition-colors font-semibold"
              >
                Tambah Kualifikasi
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-blue-100">
                    <th className="px-4 py-2 font-bold text-blue-900 border-b border-gray-300">Tahun</th>
                    <th className="px-4 py-2 font-bold text-blue-900 border-b border-gray-300">Nama Pelatihan</th>
                    <th className="px-4 py-2 font-bold text-blue-900 border-b border-gray-300">Penyelenggara</th>
                    <th className="px-4 py-2 font-bold text-blue-900 border-b border-gray-300">Lokasi</th>
                    <th className="px-4 py-2 font-bold text-blue-900 border-b border-gray-300">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {initialDataKualifikasi?.length > 0 ? (
                    initialDataKualifikasi.map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? "bg-white hover:bg-blue-50" : "bg-gray-50 hover:bg-blue-50"}>
                        <td className="px-4 py-2 text-black border-b border-gray-200">{item.tahun}</td>
                        <td className="px-4 py-2 text-black border-b border-gray-200">{item.nama_pelatihan}</td>
                        <td className="px-4 py-2 text-black border-b border-gray-200">{item.penyelenggara}</td>
                        <td className="px-4 py-2 text-black border-b border-gray-200">{item.lokasi}</td>
                        <td className="px-4 py-2 border-b border-gray-200">
                          {item.status === 'VALID' && (
                            <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-800 border border-green-300">Valid</span>
                          )}
                          {item.status === 'ON_GOING' && (
                            <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-yellow-100 text-yellow-800 border border-yellow-300">On Going</span>
                          )}
                          {item.status === 'EXPIRED' && (
                            <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-red-100 text-red-800 border border-red-300">Expired</span>
                          )}
                          {!item.status && (
                            <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-gray-100 text-gray-600 border border-gray-300">-</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-4 py-2 text-center text-gray-500 bg-white">Belum ada data kualifikasi</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Pengalaman Kerja Section */}
          <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-blue-800">Pengalaman Kerja</h2>
              <button
                onClick={() => setModalPengalaman(true)}
                className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg transition-colors font-semibold "
              >
                Tambah Pengalaman
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-blue-100">
                    <th className="px-4 py-2 font-bold text-blue-900 border-b border-gray-300">Tahun</th>
                    <th className="px-4 py-2 font-bold text-blue-900 border-b border-gray-300">Pengalaman Kerja</th>
                    <th className="px-4 py-2 font-bold text-blue-900 border-b border-gray-300">Perusahaan</th>
                    <th className="px-4 py-2 font-bold text-blue-900 border-b border-gray-300">Lokasi</th>
                  </tr>
                </thead>
                <tbody>
                  {initialDataPengalaman?.length > 0 ? (
                    initialDataPengalaman.map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? "bg-white hover:bg-blue-50" : "bg-gray-50 hover:bg-blue-50"}>
                        <td className="px-4 py-2 text-black border-b border-gray-200">{item.tahun}</td>
                        <td className="px-4 py-2 text-black border-b border-gray-200">{item.pengalaman_kerja}</td>
                        <td className="px-4 py-2 text-black border-b border-gray-200">{item.perusahaan}</td>
                        <td className="px-4 py-2 text-black border-b border-gray-200">{item.lokasi}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-4 py-2 text-center text-gray-500 bg-white">Belum ada data pengalaman kerja</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Download CV Section */}
          <div className="flex justify-center mt-8">
            <CVDownloadComponent setError={setError} />
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-500 text-center mt-4 p-2 bg-red-50 rounded-md">
              {error}
            </div>
          )}

          {/* Modals */}
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