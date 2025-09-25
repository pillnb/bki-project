// src/components/superadmin/hooks.ts
import { useCallback, useEffect, useMemo, useState } from "react";
import { assignRoles, exportCsv, fetchStats, fetchUsers } from "./api";
import {
  AssignMode,
  AssignRolesPayload,
  PegawaiRow,
  Role,
  UsersQuery,
  UsersResponse,
} from "./types";

export function useUsers(defaultQuery: UsersQuery = {}) {
  const [query, setQuery] = useState<UsersQuery>({
    page: 1,
    pageSize: 20,
    orderBy: "id",
    order: "asc",
    ...defaultQuery,
  });
  const [data, setData] = useState<PegawaiRow[]>([]);
  const [meta, setMeta] = useState<UsersResponse["meta"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchUsers(query);
      setData(res.data);
      setMeta(res.meta);
    } catch (e: any) {
      setError(e?.message || "failed");
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, meta, query, setQuery, reload, loading, error };
}

export function useAssignRoles(onDone?: () => void) {
  const [loading, setLoading] = useState(false);
  const run = useCallback(
    async (payload: AssignRolesPayload) => {
      setLoading(true);
      try {
        await assignRoles(payload);
        onDone?.();
      } finally {
        setLoading(false);
      }
    },
    [onDone]
  );
  return { assign: run, loading };
}

export function useStats(initialQuery: UsersQuery = {}) {
  const [query, setQuery] = useState<UsersQuery>(initialQuery);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchStats(query);
      setData(res);
    } catch (e: any) {
      setError(e?.message || "failed");
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, loading, error, query, setQuery, reload };
}

export function useCsv() {
  const [loading, setLoading] = useState(false);
  const run = useCallback(async (q: UsersQuery, filename = `pegawai-${new Date()
    .toISOString()
    .slice(0, 10)}.csv`) => {
    setLoading(true);
    try {
      const blob = await exportCsv(q);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } finally {
      setLoading(false);
    }
  }, []);
  return { exportCsv: run, loading };
}