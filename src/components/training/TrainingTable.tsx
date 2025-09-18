"use client";

import React from "react";
import { Trash2, AlertTriangle, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { Training } from "./types";
import { formatDate } from "./utils";
import StatusBadge from "./StatusBadge";

type Props = {
  items: Training[];
  onSort: (key: keyof Training) => void;
  sortKey: keyof Training;
  sortAsc: boolean;
  onCompleteClick: (t: Training) => void;
  onEditClick: (t: Training) => void;
  onDeleteClick?: (t: Training) => Promise<void> | void; // <- support async
};

const COLUMNS: [keyof Training, string][] = [
  ["nama", "Nama Training"],
  ["penyelenggara", "Penyelenggara"],
  ["tanggalMulai", "Tanggal Mulai"],
  ["tanggalSelesaiEstimasi", "Tanggal Selesai"],
  ["status", "Status"],
];

// helper hitung sisa hari ke tanggal kadaluarsa
function daysUntil(dateStr?: string | null) {
  if (!dateStr) return null;
  const target = new Date(dateStr);
  if (isNaN(target.getTime())) return null;

  const now = new Date();
  // normalisasi ke tanggal saja supaya akurat
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const end = new Date(target.getFullYear(), target.getMonth(), target.getDate()).getTime();
  const diffMs = end - start;
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export default function TrainingTable({
  items,
  onSort,
  sortKey,
  sortAsc,
  onCompleteClick,
  onEditClick,
  onDeleteClick
}: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border rounded">
        <thead>
          <tr className="bg-blue-100 text-blue-900">
            {COLUMNS.map(([colKey, label]) => (
              <th
                key={colKey as string}
                className="py-3 px-4 text-left cursor-pointer hover:bg-blue-200 transition-colors"
                onClick={() => onSort(colKey)}
              >
                {label} {sortKey === colKey && (sortAsc ? "↑" : "↓")}
              </th>
            ))}
            <th className="py-3 px-4 text-left">Aksi</th>
          </tr>
        </thead>

        <tbody>
          {items.map((training, idx) => {
            const d = daysUntil(training.tanggalKadaluarsa);
            const isWarning = typeof d === "number" && d < 30;
            const Icon = isWarning ? AlertTriangle : CheckCircle;
            const colorClass =
              d == null ? "hidden" : isWarning ? "text-yellow-500" : "text-green-600";
            const tooltipText =
              d == null
                ? "Masa berlaku tidak diketahui"
                : `${isWarning ? "Warning" : "Aman"} • sisa ${d} hari • exp ${formatDate(
                    training.tanggalKadaluarsa
                  )}`;

            return (
              <tr key={training.id ?? `row-${idx}`} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 text-black">{training.nama}</td>
                <td className="py-3 px-4 text-black">{training.penyelenggara}</td>
                <td className="py-3 px-4 text-black">{formatDate(training.tanggalMulai)}</td>
                <td className="py-3 px-4 text-black">
                  {formatDate(training.tanggalSelesaiEstimasi)}
                </td>

                {/* Status + ikon countdown */}
                <td className="py-3 px-4 relative">
                  <div className="flex items-center gap-2 relative group">
                    <StatusBadge status={training.status} />
                    {d != null && <Icon className={`h-4 w-4 ${colorClass}`} />}

                    {/* tooltip: hanya muncul saat hover di area status */}
                    <div
                      className="
                        pointer-events-none
                        absolute left-0 top-full mt-1
                        rounded bg-gray-900 text-white text-xs
                        px-2 py-1 opacity-0 group-hover:opacity-100
                        transition-opacity whitespace-nowrap shadow
                      "
                    >
                      {tooltipText}
                    </div>
                  </div>
                </td>

                <td className="py-3 px-4">
                  <div className="flex items-center gap-2 min-h-[32px]">
                    {!training.fileUrl ? (
                      <button
                        onClick={() => onCompleteClick(training)}
                        className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 transition-colors"
                      >
                        Selesaikan
                      </button>
                    ) : (
                      <button
                        title="Edit Training"
                        className="flex items-center gap-1 bg-blue-900 hover:bg-blue-800 text-white px-3 py-1 rounded text-xs font-semibold transition-colors"
                        onClick={() => onEditClick(training)}
                      >
                        <span>Edit</span>
                      </button>
                    )}

                    {typeof onDeleteClick === "function" && (
                      <button
                        onClick={async () => {
                          try {
                            await onDeleteClick!(training);
                            toast.success("Training berhasil dihapus");
                          } catch (err) {
                            toast.error(
                              (err as Error)?.message || "Gagal menghapus training"
                            );
                          }
                        }}
                        className="p-1 rounded hover:bg-red-100 transition-colors"
                        title="Hapus"
                      >
                        <Trash2 size={18} color="#dc2626" />
                      </button>
                    )}
                  </div>

                  {training.fileUrl && (
                    <a
                      key={`sertifikat-${training.id ?? idx}`}
                      href={training.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-gray-600 hover:underline mt-0.5 block"
                      style={{ fontSize: "11px" }}
                    >
                      Lihat Sertifikat
                    </a>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {items.length === 0 && (
        <div className="text-center py-8 text-gray-500">Tidak ada training yang ditemukan.</div>
      )}
    </div>
  );
}