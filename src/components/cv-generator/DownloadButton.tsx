"use client";

import React, { useState } from "react";
import { Download, FileText, File, Loader2 } from "lucide-react";

export default function DownloadButton({ setError }: { setError: (msg: string | null) => void }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState<"docx" | "pdf">("docx");
  const [showDropdown, setShowDropdown] = useState(false);

  const handleDownload = async (format: "docx" | "pdf") => {
    setIsDownloading(true);
    setShowDropdown(false);
    setError(null);
    try {
      const res = await fetch("/api/cv/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ format }),
      });
      if (!res.ok) {
        let msg = "Download failed";
        try {
          const j = await res.json();
          msg = j.error || msg;
        } catch {}
        throw new Error(msg);
      }
      const cd = res.headers.get("Content-Disposition");
      let filename = `cv_pegawai.${format}`;
      if (cd) {
        const m = cd.match(/filename="(.+)"/);
        if (m) filename = m[1];
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      a.remove();
    } catch (e: unknown) {
      setError((e as Error)?.message || "Gagal download CV");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="relative inline-block">
      <div className="flex">
        <button
          onClick={() => handleDownload(downloadFormat)}
          disabled={isDownloading}
          className="flex items-center gap-2 bg-blue-900 hover:bg-blue-800 disabled:bg-blue-400 text-white px-4 py-2 rounded-l-lg transition-colors font-semibold"
        >
          {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          {isDownloading ? "Generating..." : `Download ${downloadFormat.toUpperCase()}`}
        </button>
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

      {showDropdown && (
        <>
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
            <div className="py-1">
              <button
                onClick={() => {
                  setDownloadFormat("docx");
                  handleDownload("docx");
                }}
                className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors"
              >
                <FileText className="w-4 h-4 text-blue-600" />
                <span className="text-black">Download as DOCX</span>
              </button>
              <button
                onClick={() => {
                  setDownloadFormat("pdf");
                  handleDownload("pdf");
                }}
                className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors"
              >
                <File className="w-4 h-4 text-red-600" />
                <span className="text-black">Download as PDF</span>
              </button>
            </div>
          </div>
          <div className="fixed inset-0 z-0" onClick={() => setShowDropdown(false)} />
        </>
      )}
    </div>
  );
}