// src/components/superadmin/types.ts
export type Role = "ADMIN" | "PEGAWAI" | "SUPERADMIN" | string;

export type PegawaiRow = {
  id: number;
  nup?: string | null;
  nama_pegawai: string;
  email?: string | null;
  role: Role[]; // dari prisma String[]
  status_pegawai?: string | null;
};

export type UsersQuery = {
  page?: number;
  pageSize?: number;
  q?: string;
  role?: Role[];
  status?: string[];
  orderBy?: "id" | "nup" | "nama" | "status";
  order?: "asc" | "desc";
};

export type PaginationMeta = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type UsersResponse = {
  data: PegawaiRow[];
  meta: PaginationMeta;
};

export type AssignMode = "set" | "push" | "remove" | "clear";

export type AssignRolesPayload = {
  userIds: number[];
  role?: Role;
  roles?: Role[];
  mode?: AssignMode;
};

export type StatsResponse = {
  total: number;
  aktif: number;
  nonaktif: number;
  byStatus: { status_pegawai: string | null; count: number }[];
  byRole: { role: string; count: number }[];
};