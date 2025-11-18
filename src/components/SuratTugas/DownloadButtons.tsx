// src/components/SuratTugas/DownloadButtons.tsx
"use client";

import React from "react";
import { FileText, File, FileCheck2 } from "lucide-react";

type Props = {
  id: string | number;
  nomorSurat?: string | null;
  status?: string | null;

  // opsional: kalau dikirim dari parent, pakai itu. kalau tidak, komponen ini handle sendiri.
  onDownloadPDF?: (id: string, filename?: string) => void;
  onDownloadDocx?: (id: string, filename?: string) => void;
  onDownloadFinal?: (id: string, filename?: string) => void;

  isDownloading?: boolean;
  downloadType?: "pdf" | "docx" | "final" | null;

  className?: string;
};

export default function DownloadButtons({
  id,
  nomorSurat = null,
  onDownloadPDF,
  onDownloadDocx,
  onDownloadFinal,
  isDownloading = false,
  downloadType = null,
  className = "",
}: Props) {
  const strId = String(id);

  // fallback internal downloaders kalau parent tidak ngasih handler
  const dlPDF = async () => {
    if (onDownloadPDF) return onDownloadPDF(strId, buildName("pdf"));
    await genericFetch(`/api/surat-tugas/${strId}/download/pdf`, buildName("pdf"));
  };

  const dlDOCX = async () => {
    if (onDownloadDocx) return onDownloadDocx(strId, buildName("docx"));
    await genericFetch(`/api/surat-tugas/${strId}/download`, buildName("docx"));
  };

  const dlFINAL = async () => {
    if (onDownloadFinal) return onDownloadFinal(strId, buildName("docx", true));
    await genericFetch(`/api/surat-tugas/${strId}/download/final`, buildName("docx", true));
  };

  function buildName(ext: "pdf" | "docx", isFinal = false) {
    const base = nomorSurat?.trim() ? nomorSurat.trim() : `surat-tugas-${strId}`;
    return isFinal ? `${base}-FINAL.${ext}` : `${base}.${ext}`;
  }

  async function genericFetch(url: string, filename: string) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Gagal download (${res.status})`);
    const blob = await res.blob();
    const href = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = href;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(href);
  }

  const spinner = (
    <span className="inline-block h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
  );

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* PDF */}
      <button
        onClick={dlPDF}
        disabled={isDownloading}
        title="Download PDF"
        className="p-2 rounded-lg text-red-700 bg-red-50 hover:bg-red-100 disabled:opacity-50"
      >
        {isDownloading && downloadType === "pdf" ? spinner : <FileText size={16} />}
      </button>

      {/* DOCX (draft/normal) */}
      <button
        onClick={dlDOCX}
        disabled={isDownloading}
        title="Download DOCX"
        className="p-2 rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 disabled:opacity-50"
      >
        {isDownloading && downloadType === "docx" ? spinner : <File size={16} />}
      </button>

      {/* DOCX FINAL (tetap bisa diunduh tanpa syarat status/nomor) */}
      <button
        onClick={dlFINAL}
        disabled={isDownloading}
        title="Download DOCX Final"
        className="p-2 rounded-lg text-violet-700 bg-violet-50 hover:bg-violet-100 disabled:opacity-50"
      >
        {isDownloading && downloadType === "final" ? spinner : <FileCheck2 size={16} />}
      </button>
    </div>
  );
}
