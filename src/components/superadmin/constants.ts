// src/components/superadmin/constants.ts
export const ROLE_OPTIONS = ["admin", "pegawai", "superadmin"] as const;

export const STATUS_FILTER_OPTIONS = [
  { label: "Semua Status", value: "ALL" },
  { label: "PKWT", value: "PKWT" },
  { label: "PKWTT", value: "PKWTT" },
  { label: "KOMERBA", value: "KOMERBA" },
  { label: "FREELANCE", value: "FREELANCE" },
];

export const DEFAULT_PAGE_SIZE = 20;