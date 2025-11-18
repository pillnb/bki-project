// src/components/SuratTugas/SuratCard.tsx
"use client";

import React, { useMemo } from "react";
import { Eye, MapPin, Calendar, User } from "lucide-react";

import ProgressTracker from "./ProgressTracker";
import type { SuratTugasItem, StatusSuratTugas } from "./types";
import {
  safeStr,
  getLeadInspectorNup,
  getInspectorNameByNup,
  formatDateId,
} from "./helpers";
import { normalizeStatus } from "./utils";
import DownloadButtons from "@/components/SuratTugas/DownloadButtons";

type Props = {
  surat: SuratTugasItem;

  // actions
  onOpenDetail: (s: SuratTugasItem) => void;
  onApproved: (id: string) => void;

  // auth
  currentUserNup: string;

  // download state
  onDownloadPDF?: (id: string, filename?: string) => void;
  onDownloadDocx?: (id: string, filename?: string) => void;
  isDownloading?: boolean;
  downloadType?: "pdf" | "docx" | "final" | null; // tambahkan "final"
};

const statusLabel: Record<StatusSuratTugas, string> = {
  DRAFT: "Draft",
  MENUNGGU_LEAD: "Menunggu Approve Team Leader",
  MENUNGGU_KOORDINATOR: "Menunggu Approve Koordinator Bidang",
  MENUNGGU_SM: "Menunggu Approve SM",
  MENUNGGU_KACAB: "Menunggu Kacab",
  DISETUJUI: "Disetujui",
  BERJALAN: "Berjalan",
  SELESAI: "Selesai",
  DITOLAK: "Ditolak",
};

const statusClass: Record<StatusSuratTugas, string> = {
  DRAFT: "bg-gray-100 text-gray-800",
  MENUNGGU_LEAD: "bg-yellow-100 text-yellow-800",
  MENUNGGU_KOORDINATOR: "bg-yellow-100 text-yellow-800",
  MENUNGGU_SM: "bg-yellow-100 text-yellow-800",
  MENUNGGU_KACAB: "bg-yellow-100 text-yellow-800",
  DISETUJUI: "bg-teal-100 text-teal-800",
  BERJALAN: "bg-indigo-100 text-indigo-800",
  SELESAI: "bg-green-100 text-green-800",
  DITOLAK: "bg-red-100 text-red-800",
};

export default function SuratCard({
  surat,
  onOpenDetail,
  onApproved,
  currentUserNup,
  onDownloadPDF,
  onDownloadDocx,
  isDownloading = false,
  downloadType = null,
}: Props) {
  const status = normalizeStatus(surat.status);
  const leadNup = getLeadInspectorNup(surat.leadInspector) || "";

  // DEBUG lead
  console.groupCollapsed(`[DEBUG][SuratCard] lead check - ${surat.id}`);
  console.log("leadInspector raw:", surat.leadInspector);
  console.log("leadInspector.nup:", (surat.leadInspector as any)?.nup);
  console.log("resolved leadNup (helpers):", leadNup);
  console.log("currentUserNup:", currentUserNup);
  console.log("timInspektor:", surat.timInspektor);
  console.groupEnd();

  const isLead = useMemo(() => {
    const a = (currentUserNup || "").trim();
    const b = leadNup.trim();
    return !!a && !!b && a === b;
  }, [currentUserNup, leadNup]);

  const canApprove = isLead && status === "MENUNGGU_LEAD";

  const leadName =
    getInspectorNameByNup(leadNup, surat.timInspektor) || leadNup || "-";

  console.debug("[SuratCard Approve DBG]", {
    id: surat.id,
    currentUserNup,
    leadNup,
    status,
    isLead,
    canApprove,
  });

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      {/* HEADER */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="min-w-0">
          <h3 className="text-xl font-semibold text-blue-900 truncate">
            {safeStr(surat.proyek?.klien || surat.klien, "Klien tidak tersedia")}
          </h3>
          <p className="text-sm text-slate-600 mt-1 line-clamp-2">
            {safeStr(
              surat.proyek?.namaProyek || surat.pekerjaan,
              "Pekerjaan tidak tersedia"
            )}
          </p>

          {safeStr(surat.proyek?.lokasi) && (
            <div className="flex items-center gap-1.5 mt-2 text-slate-600">
              <MapPin size={14} className="text-slate-400" />
              <span className="text-xs">{safeStr(surat.proyek?.lokasi)}</span>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500">
            <span>Diajukan: {formatDateId(surat.createdAt)}</span>
            {safeStr(surat.nomor_surat) && (
              <span>No. Surat: {safeStr(surat.nomor_surat)}</span>
            )}
          </div>

          {leadName !== "-" && (
            <div className="flex items-center gap-1 mt-2">
              <User size={14} className="text-blue-600" />
              <p className="text-xs text-blue-700">Lead Inspector: {leadName}</p>
            </div>
          )}
        </div>

        {/* KANAN: Status badge + actions */}
        <div className="flex items-center gap-2 shrink-0">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${statusClass[status]}`}
          >
            {statusLabel[status]}
          </span>

          {/* APPROVE */}
          <button
            onClick={() => onApproved(surat.id)}
            disabled={!canApprove}
            title={
              canApprove
                ? "Approve sebagai Lead"
                : !isLead
                ? `Anda bukan Lead (Lead: ${leadNup || "-"})`
                : `Status saat ini: ${status}`
            }
            className={`px-3 py-1.5 rounded-lg text-white text-sm transition
              ${canApprove ? "bg-green-600 hover:bg-green-700" : "bg-gray-300 cursor-not-allowed"}`}
          >
            Approve
          </button>

          {/* VIEW */}
          <button
            onClick={() => onOpenDetail(surat)}
            title="Lihat detail"
            className="p-2 rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100"
          >
            <Eye size={16} />
          </button>

          {/* DOWNLOADS: PDF, DOCX, DOCX FINAL */}
          <DownloadButtons
            id={String(surat.id)}
            status={status}
            nomorSurat={surat.nomor_surat ?? null}
            onDownloadPDF={(id) => onDownloadPDF?.(id)}
            onDownloadDocx={(id) => onDownloadDocx?.(id)}
            isDownloading={isDownloading}
            downloadType={downloadType}
            className="!gap-2"
          />
        </div>
      </div>

      {/* PROGRESS DI DALAM KARTU */}
      <div className="mt-2">
        <ProgressTracker status={surat.status} createdAt={surat.createdAt} />
      </div>

      {/* FOOTER INFO RINGKAS */}
      <div className="mt-4 pt-4 border-t border-slate-200 text-sm text-slate-700">
        <div className="mb-1">
          <span className="font-semibold">Inspektor:</span>{" "}
          {surat.timInspektor?.length
            ? surat.timInspektor.map((i) => i.nama_pegawai || i.nup).join(", ")
            : "Inspektor tidak tersedia"}
        </div>

        {(surat.tanggal_berangkat || surat.tanggal_kembali) && (
          <div className="flex items-center gap-2 text-slate-600">
            <Calendar size={14} className="text-slate-400" />
            <span className="font-semibold">Jadwal:</span>
            <span>
              {surat.tanggal_berangkat && surat.tanggal_kembali
                ? `${formatDateId(surat.tanggal_berangkat)} - ${formatDateId(
                    surat.tanggal_kembali
                  )}`
                : surat.tanggal_berangkat
                ? `${formatDateId(surat.tanggal_berangkat)} - (belum ditentukan)`
                : "Belum dijadwalkan"}
            </span>
          </div>
        )}
      </div>

      {/* DEBUG PANEL VISUAL */}
      {process.env.NEXT_PUBLIC_DEBUG === "true" && (
        <div className="mt-4 rounded-md border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900">
          <div className="font-semibold mb-1">DEBUG Approve</div>
          <div>
            currentUserNup: <b>{currentUserNup || "(kosong)"}</b>
          </div>
          <div>
            leadNup: <b>{leadNup || "(kosong)"}</b>
          </div>
          <div>
            status: <b>{status}</b>
          </div>
          <div>
            isLead: <b>{String(isLead)}</b>
          </div>
          <div>
            canApprove: <b>{String(canApprove)}</b>
          </div>
        </div>
      )}
    </div>
  );
}
