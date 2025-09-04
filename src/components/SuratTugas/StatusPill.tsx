"use client";
import React from "react";

export type StatusSurat =
  | "DRAFT"
  | "MENUNGGU_LEAD"
  | "MENUNGGU_KOORDINATOR"
  | "MENUNGGU_SM"
  | "MENUNGGU_KACAB"
  | "DISETUJUI"
  | "BERJALAN"
  | "SELESAI"
  | "DITOLAK";

const statusClass: Record<StatusSurat, string> = {
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

export default function StatusPill({ status }: { status: StatusSurat }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${statusClass[status]}`}>
      {status}
    </span>
  );
}