// src/components/superadmin/api.ts
import {
  AssignRolesPayload,
  StatsResponse,
  UsersQuery,
  UsersResponse,
} from "./types";

const BASE = "/api/pegawai/assign-roles";

function qs(params: Record<string, any>) {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v == null || v === "") return;
    if (Array.isArray(v)) v.forEach((it) => sp.append(k, String(it)));
    else sp.set(k, String(v));
  });
  return sp.toString();
}

export async function fetchUsers(q: UsersQuery): Promise<UsersResponse> {
  const url = `${BASE}?${qs(q)}`;
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) throw new Error("fetchUsers failed");
  return res.json();
}

export async function fetchStats(q: UsersQuery = {}): Promise<StatsResponse> {
  const url = `${BASE}?mode=stats&${qs(q)}`;
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) throw new Error("fetchStats failed");
  return res.json();
}

export async function exportCsv(q: UsersQuery = {}): Promise<Blob> {
  const url = `${BASE}?export=csv&${qs(q)}`;
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) throw new Error("exportCsv failed");
  return res.blob();
}

export async function assignRoles(payload: AssignRolesPayload): Promise<void> {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("assignRoles failed");
}