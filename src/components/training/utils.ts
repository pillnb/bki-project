// src/components/training/utils.ts
import type { Training, TrainingStatus } from "./types";
export { computeTrainingStatus } from "@/lib/trainingStatus";

// normalisasi string biar nggak keganti "null"/"undefined"
const norm = (v: unknown) =>
  v !== null && v !== undefined && String(v).trim() !== "" && v !== "null" && v !== "undefined"
    ? String(v).trim()
    : "";

/** Mapper API -> client model (kanonikan field2 ke: id, fileUrl, noSertifikat, dst) */
export function mapApiTrainingToClient(api: unknown): Training {
  const apiData = api as Record<string, unknown>;
  const fileUrl =
    norm(apiData.fileUrl) ||
    norm(apiData.file_sertifikat) ||
    norm(apiData.webViewLink) ||
    norm(apiData.webContentLink);

  const noSertifikat = norm(apiData.noSertifikat ?? apiData.nomor_sertifikat);

  return {
    id: (apiData.id ?? apiData.id_pelatihan ?? apiData.training_id) as number,
    nama: (apiData.nama ?? apiData.nama_pelatihan ?? "") as string,
    penyelenggara: (apiData.penyelenggara ?? "") as string,
    tanggalMulai: (apiData.tanggalMulai ?? apiData.tanggal_awal ?? "") as string,
    tanggalSelesaiEstimasi: (apiData.tanggalSelesaiEstimasi ?? apiData.tanggal_akhir ?? "") as string,
    tanggalSelesaiAktual: (apiData.tanggalSelesaiAktual ?? apiData.tanggal_akhir ?? "") as string,
    tanggalKadaluarsa: (apiData.tanggalKadaluarsa ?? apiData.masa_berlaku ?? "") as string,
    tahun: (apiData.tahun ? Number(apiData.tahun) : 0) as number,
    status: (apiData.status || "ON_GOING") as TrainingStatus, // akan distandardkan lagi pakai computeTrainingStatus di caller

    fileUrl,
    noSertifikat,
    matrixCategory: norm(apiData.matrixCategory),
  };
}

/** Ada sertifikat? dipakai table untuk nentuin aksi */
export const hasCertificate = (t: Training) =>
  !!(t.fileUrl && t.fileUrl !== "-" && t.fileUrl !== "null");

/** Format tanggal untuk tampilan (DD MMM YYYY) */
export function formatDate(value?: string | null) {
  if (!value) return "-";
  try {
    const d = new Date(value);
    if (isNaN(d.getTime())) return value;
    return d.toLocaleDateString("id-ID", { year: "numeric", month: "short", day: "2-digit" });
  } catch {
    return value;
  }
}

/** Format tanggal untuk input <input type="date"> → YYYY-MM-DD */
export function formatDateInput(value?: string | null): string {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  try {
    const d = new Date(value);
    if (isNaN(d.getTime())) return "";
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${dd}`;
  } catch {
    return "";
  }
}

/** Validasi file upload (<=5MB dan tipe PDF/PNG/JPG/JPEG) */
export function validateFile(file: File): string | null {
  const MAX = 5 * 1024 * 1024; // 5MB
  if (!file) return "File tidak ditemukan.";
  if (file.size > MAX) return "Ukuran file maksimal 5MB.";

  const allowedMime = new Set(["application/pdf", "image/png", "image/jpeg"]);
  const allowedExt = new Set(["pdf", "png", "jpg", "jpeg"]);

  const name = (file.name || "").toLowerCase();
  const ext = name.split(".").pop() || "";
  const typeOk = file.type ? allowedMime.has(file.type) : true;
  const extOk = allowedExt.has(ext);

  if (!typeOk || !extOk) {
    return "Format file tidak diizinkan. Hanya PDF, PNG, JPG, atau JPEG.";
  }
  return null;
}

/** Validasi rentang tanggal: end tidak boleh < start */
export function validateDateRange(start?: string, end?: string): string | null {
  if (!start || !end) return null; // kalau belum lengkap, jangan blok
  try {
    const s = new Date(start);
    const e = new Date(end);
    if (isNaN(s.getTime()) || isNaN(e.getTime())) return null;
    const s0 = new Date(s.getFullYear(), s.getMonth(), s.getDate()).getTime();
    const e0 = new Date(e.getFullYear(), e.getMonth(), e.getDate()).getTime();
    if (e0 < s0) return "Tanggal selesai tidak boleh sebelum tanggal mulai.";
    return null;
  } catch {
    return null;
  }
}