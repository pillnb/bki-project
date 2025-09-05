// src/lib/trainingStatus.ts
export type StatusPelatihan = "ON_GOING" | "VALID" | "EXPIRED";

// nilai string yang dianggap kosong
function truthy(v: unknown) {
  const s = String(v ?? "").trim();
  return s !== "" && s !== "null" && s !== "undefined" && s !== "-";
}

// normalisasi ke YYYY-MM-DD
function toDateOnly(input?: string | Date | null): string | null {
  if (!input) return null;
  try {
    if (typeof input === "string") {
      if (/^\d{4}-\d{2}-\d{2}$/.test(input)) return input;
      const d = new Date(input);
      if (isNaN(d.getTime())) return null;
      return new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString().slice(0, 10);
    }
    const d = input as Date;
    if (isNaN(d.getTime())) return null;
    return new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString().slice(0, 10);
  } catch {
    return null;
  }
}

// aturan utama:
// belum ada sertifikat => ON_GOING
// ada sertifikat dan kadaluarsa < hari ini => EXPIRED
// selain itu => VALID
export function computeTrainingStatus(input: {
  fileUrl?: string | null;
  tanggalKadaluarsa?: string | Date | null;
}): StatusPelatihan {
  const hasFile = truthy(input.fileUrl);
  if (!hasFile) return "ON_GOING";

  const today = new Date();
  const todayStr = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    .toISOString()
    .slice(0, 10);

  const exp = toDateOnly(input.tanggalKadaluarsa);
  if (exp && exp < todayStr) return "EXPIRED";

  return "VALID";
}