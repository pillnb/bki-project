"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import { Training } from "./types";
import { formatDate } from "./utils";
import { hasCertificate } from "./utils";
import StatusBadge from "./StatusBadge";

type Props = {
  items: Training[];
  onSort: (key: keyof Training) => void;
  sortKey: keyof Training;
  sortAsc: boolean;
  onCompleteClick: (t: Training) => void;
  onEditClick: (t: Training) => void;
  onDeleteClick?: (t: Training) => void;
};

const COLUMNS: [keyof Training, string][] = [
  ["nama", "Nama Training"],
  ["penyelenggara", "Penyelenggara"],
  ["tanggalMulai", "Tanggal Mulai"],
  ["tanggalSelesaiEstimasi", "Tanggal Selesai"],
  ["status", "Status"],
];

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
          {items.map((training, idx) => (
            <tr key={training.id ?? `row-${idx}`} className="border-b hover:bg-gray-50">
              <td className="py-3 px-4 text-black">{training.nama}</td>
              <td className="py-3 px-4 text-black">{training.penyelenggara}</td>
              <td className="py-3 px-4 text-black">{formatDate(training.tanggalMulai)}</td>
              <td className="py-3 px-4 text-black">{formatDate(training.tanggalSelesaiEstimasi)}</td>
              <td className="py-3 px-4">
                <StatusBadge status={training.status} />
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2 min-h-[32px]">
                  {(!training.fileUrl) ? (
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
                      onClick={() => onDeleteClick!(training)}
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
          ))}
        </tbody>

      </table>

      {items.length === 0 && (
        <div className="text-center py-8 text-gray-500">Tidak ada training yang ditemukan.</div>
      )}
    </div>
  );
}

function ActionsCell({ row, onComplete, onEdit }: { row: Training; onComplete: () => void; onEdit: () => void }) {
  const ready = hasCertificate(row);

  return ready ? (
    <button className="btn btn-sm" onClick={onEdit}>Edit</button>
  ) : (
    <button className="btn btn-sm btn-success" onClick={onComplete}>Selesaikan</button>
  );
}