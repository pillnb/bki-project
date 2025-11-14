"use client";
import { useState } from "react";
import { FileText, File } from "lucide-react";
import { toast } from "sonner";

export default function DownloadButtons({
  suratId,
  variant = "compact",
}: {
  suratId: string;
  variant?: "compact" | "detailed";
}) {
  const [kind, setKind] = useState<null | "pdf" | "docx">(null);
  const busy = kind !== null;
  const base =
    "flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed";

  async function download(t: "pdf" | "docx") {
    if (busy) return;
    setKind(t);
    try {
      const url =
        t === "pdf"
          ? `/api/surat-tugas/${suratId}/download/pdf`
          : `/api/surat-tugas/${suratId}/download`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download =
        t === "pdf"
          ? `Draft Surat Tugas - ${suratId}.pdf`
          : `surat-tugas-${suratId}.docx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      toast.success(`Surat Tugas (${t.toUpperCase()}) berhasil diunduh`);
    } catch {
      toast.error(`Gagal mengunduh ${t.toUpperCase()}`);
    } finally {
      setKind(null);
    }
  }

  if (variant === "compact") {
    return (
      <div className="flex gap-2">
        <button
          onClick={() => download("pdf")}
          disabled={busy}
          className={`${base} bg-red-50 text-red-700 hover:bg-red-100 text-sm`}
          title="Download PDF"
        >
          <FileText size={16} />
          {kind === "pdf" && (
            <div className="w-3 h-3 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
          )}
        </button>
        <button
          onClick={() => download("docx")}
          disabled={busy}
          className={`${base} bg-blue-50 text-blue-700 hover:bg-blue-100 text-sm`}
          title="Download DOCX"
        >
          <File size={16} />
          {kind === "docx" && (
            <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={() => download("pdf")}
        disabled={busy}
        className={`${base} bg-red-600 text-white hover:bg-red-700`}
      >
        <FileText size={18} />{" "}
        {kind === "pdf" ? "Downloading PDF..." : "Download PDF"}
      </button>
      <button
        onClick={() => download("docx")}
        disabled={busy}
        className={`${base} bg-blue-600 text-white hover:bg-blue-700`}
      >
        <File size={18} />{" "}
        {kind === "docx" ? "Downloading DOCX..." : "Download DOCX"}
      </button>
    </div>
  );
}
