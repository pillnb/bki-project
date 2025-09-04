import React from "react";

export type StatusPelatihanLite = "ON_GOING" | "VALID" | "EXPIRED";

function normalizeStatus(input: string | null | undefined): StatusPelatihanLite | null {
  if (!input) return null;
  const s = String(input).toUpperCase();
  if (s === "ON_GOING" || s === "VALID" || s === "EXPIRED") return s;
  return null;
}

export default function StatusBadge({ status }: { status: string | StatusPelatihanLite | null }) {
  const normalized = normalizeStatus(status);

  if (!normalized) {
    return (
      <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-gray-100 text-gray-600 border border-gray-300">-</span>
    );
  }

  const styles =
    normalized === "VALID"
      ? "bg-green-100 text-green-800 border border-green-300"
      : normalized === "ON_GOING"
      ? "bg-yellow-100 text-yellow-800 border border-yellow-300"
      : "bg-red-100 text-red-800 border border-red-300";

  const label = normalized === "VALID" ? "Valid" : normalized === "ON_GOING" ? "On Going" : "Expired";

  return <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${styles}`}>{label}</span>;
}