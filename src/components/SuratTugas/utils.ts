import { StatusSurat } from "./StatusPill";

export function fmt(date?: string | null) {
  if (!date) return "-";
  const d = new Date(date);
  return isNaN(d.getTime())
    ? "-"
    : d.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
}

export function normalizeStatus(s: unknown): StatusSurat {
  const x = String(s || "DRAFT").toUpperCase() as StatusSurat;
  const allowed: StatusSurat[] = [
    "DRAFT",
    "MENUNGGU_LEAD",
    "MENUNGGU_KOORDINATOR",
    "MENUNGGU_SM",
    "MENUNGGU_KACAB",
    "DISETUJUI",
    "BERJALAN",
    "SELESAI",
    "DITOLAK",
  ];
  return allowed.includes(x) ? x : "DRAFT";
}
