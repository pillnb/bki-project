import { SuratTugasItem, TimInspektorItem } from "./types";

export const safeStr = (v: unknown, fallback = ""): string =>
  v == null ? fallback : typeof v === "object" ? fallback : String(v);

export const joinArr = (a?: unknown[], sep = ", "): string =>
  Array.isArray(a) ? a.map((x) => safeStr(x)).filter(Boolean).join(sep) : "";

export const getLeadInspectorNup = (
  lead: SuratTugasItem["leadInspector"]
): string | undefined => {
  if (!lead) return undefined;
  if (typeof lead === "string") return lead;
  if (typeof lead === "object") return lead.nup || undefined;
  return undefined;
};

export const getInspectorNameByNup = (
  nup: string | undefined,
  timInspektor: TimInspektorItem[]
): string | undefined => {
  if (!nup) return undefined;
  const f = timInspektor?.find((p) => p.nup === nup);
  return f?.nama_pegawai;
};

export const formatDateId = (s?: string) =>
  s
    ? new Date(s).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "-";