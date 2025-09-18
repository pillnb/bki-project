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

export const daftarCabang = [
  // Cabang Klas
  { tipe: "Klas", kota: "Surabaya" },
  { tipe: "Klas", kota: "Banjarmasin" },
  { tipe: "Klas", kota: "Palembang" },
  { tipe: "Klas", kota: "Batam" },
  { tipe: "Klas", kota: "Tanjung Priok (Jakarta)" },
  { tipe: "Klas", kota: "Cirebon" },
  { tipe: "Klas", kota: "Makassar" },
  { tipe: "Klas", kota: "Bitung" },
  { tipe: "Klas", kota: "Sorong" },
  { tipe: "Klas", kota: "Ambon" },
  { tipe: "Klas", kota: "Samarinda" },
  { tipe: "Klas", kota: "Singapore" },
  { tipe: "Klas", kota: "Belawan (Medan)" },
  { tipe: "Klas", kota: "Jambi" },
  { tipe: "Klas", kota: "Pontianak" },
  { tipe: "Klas", kota: "Pekanbaru" },
  { tipe: "Klas", kota: "Semarang" },
  { tipe: "Klas", kota: "Banten (Cilegon)" },

  // Cabang Komersil
  { tipe: "Komersil", kota: "Balikpapan" },
  { tipe: "Komersil", kota: "Pekanbaru" },
  { tipe: "Komersil", kota: "Surabaya" },
  { tipe: "Komersil", kota: "Palembang" },
  { tipe: "Komersil", kota: "Semarang" },
  { tipe: "Komersil", kota: "Banjarmasin" },
  { tipe: "Komersil", kota: "Belawan (Medan)" },
  { tipe: "Komersil", kota: "Cilegon (Banten)" },
  { tipe: "Komersil", kota: "Makassar" },
  { tipe: "Komersil", kota: "Batam" },
  { tipe: "Komersil", kota: "Pontianak" },
];