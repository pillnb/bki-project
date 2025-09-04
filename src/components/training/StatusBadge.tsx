import React from "react";
import { Training } from "./types";

export default function StatusBadge({ status }: { status: Training["status"] }) {
  const cfg =
    status === "VALID"
      ? "bg-green-100 text-green-800"
      : status === "EXPIRED"
      ? "bg-red-100 text-red-800"
      : "bg-yellow-100 text-yellow-800";
  const label =
    status === "VALID" ? "Valid" : status === "EXPIRED" ? "Expired" : "On Going";

  return <span className={`px-2 py-1 rounded text-xs font-medium ${cfg}`}>{label}</span>;
}