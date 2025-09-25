// src/components/superadmin/users/UsersInlineTable.tsx
"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import { ROLE_OPTIONS } from "@/components/superadmin/constants";
import type { PegawaiRow } from "@/components/superadmin/types";

type Row = PegawaiRow & { nup?: string | null };

type Props = {
  rows: Row[];
  loading?: boolean;
  onSaved?: () => void;
  // selection for bulk
  selected: number[];
  onToggleOne: (id: number, checked: boolean) => void;
  onToggleAll: (currentPageIds: number[], checked: boolean) => void;
  // quick assign per-row
  onAssignOne: (id: number, role: string) => void | Promise<void>;
};

const STATUS_OPTIONS = [
  "PKWT",
  "PKWTT",
  "KOMERBA",
  "FREELANCE",
] as const;

export default function UsersInlineTable({
  rows,
  loading,
  onSaved,
  selected,
  onToggleOne,
  onToggleAll,
  onAssignOne,
}: Props) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState<Partial<Row>>({});
  const [saving, setSaving] = useState(false);

  const pageIds = rows.map((r) => r.id);
  const allChecked =
    pageIds.length > 0 && pageIds.every((id) => selected.includes(id));

  const startEdit = (row: Row) => {
    setEditingId(row.id);
    setDraft({
      id: row.id,
      nup: row.nup ?? "",
      nama_pegawai: row.nama_pegawai,
      email: row.email ?? "",
      status_pegawai: row.status_pegawai ?? "",
      role: [...(row.role ?? [])],
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft({});
  };

  const setField = (k: keyof Row, v: any) =>
    setDraft((prev) => ({ ...prev, [k]: v }));

  const save = async () => {
    if (!editingId) return;
    try {
      setSaving(true);

      const original = rows.find((r) => r.id === editingId);
      if (!original) throw new Error("row not found");

      // 1) update data pegawai via PUT /api/pegawai/:nup (ganti ke endpoint kamu kalau beda)
      if (draft.nup || original.nup) {
        const nup = String(draft.nup ?? original.nup);
        const payload = {
          nama_pegawai: draft.nama_pegawai ?? original.nama_pegawai,
          email: draft.email ?? original.email,
          status_pegawai: draft.status_pegawai ?? original.status_pegawai,
        };
        const res = await fetch(`/api/pegawai/${encodeURIComponent(nup)}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const j = await safeJson(res);
          throw new Error(j?.message || "gagal update data pegawai");
        }
      }

      // 2) update role kalau berubah
      const oldRoles = new Set(original.role ?? []);
      const newRoles = new Set((draft.role as string[]) ?? []);
      const changed =
        oldRoles.size !== newRoles.size ||
        [...oldRoles].some((r) => !newRoles.has(r));

      if (changed) {
        const res2 = await fetch("/api/pegawai/assign-roles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userIds: [original.id],
            roles: Array.from(newRoles),
            mode: "set",
          }),
        });
        if (!res2.ok) {
          const j = await safeJson(res2);
          throw new Error(j?.message || "gagal update role");
        }
      }

      toast.success("Data pegawai diperbarui");
      setEditingId(null);
      setDraft({});
      onSaved?.();
    } catch (e: any) {
      toast.error(e?.message || "Gagal menyimpan perubahan");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow w-full overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full table-fixed" style={{ width: "100%" }}>
          <thead className="bg-blue-900">
            <tr>
              {/* Checkbox - Fixed width 50px */}
              <th className="w-12 px-2 py-3 text-left text-xs font-bold text-white uppercase tracking-wider border-r border-blue-700">
                <input
                  type="checkbox"
                  checked={allChecked}
                  onChange={(e) => onToggleAll(pageIds, e.currentTarget.checked)}
                  aria-label="Pilih semua"
                />
              </th>

              {/* NUP - Fixed width 120px */}
              <th className="w-24 px-3 py-3 text-left text-xs font-bold text-white uppercase tracking-wider border-r border-blue-700">
                NUP
              </th>

              {/* Nama - Fixed width 180px */}
              <th className="w-44 px-3 py-3 text-left text-xs font-bold text-white uppercase tracking-wider border-r border-blue-700">
                Nama Pegawai
              </th>

              {/* Status - Fixed width 120px */}
              <th className="w-28 px-3 py-3 text-left text-xs font-bold text-white uppercase tracking-wider border-r border-blue-700">
                Status
              </th>

              {/* Email - Flexible width */}
              <th className="px-3 py-3 text-left text-xs font-bold text-white uppercase tracking-wider border-r border-blue-700">
                Email
              </th>

              {/* Role - Fixed width 240px */}
              <th className="w-60 px-3 py-3 text-left text-xs font-bold text-white uppercase tracking-wider border-r border-blue-700">
                Role
              </th>

              {/* Aksi - Fixed width 140px */}
              <th className="w-36 px-3 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-blue-50">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-blue-400">
                  Loading...
                </td>
              </tr>
            ) : !rows || rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-blue-400">
                  Tidak ada data
                </td>
              </tr>
            ) : (
              rows.map((r, idx) => {
                const rowBgClass = idx % 2 === 0 ? "bg-blue-50" : "bg-white";
                const isEdit = editingId === r.id;

                return (
                  <tr key={r.id} className={`${rowBgClass} hover:bg-blue-100`}>
                    {/* Checkbox */}
                    <td className="w-12 px-2 py-3 border-r border-blue-100">
                      <input
                        type="checkbox"
                        checked={selected.includes(r.id)}
                        onChange={(e) =>
                          onToggleOne(r.id, e.currentTarget.checked)
                        }
                        aria-label={`Pilih baris ${idx + 1}`}
                      />
                    </td>

                    {/* NUP */}
                    <td className="w-24 px-3 py-3 text-sm font-bold text-blue-900 border-r border-blue-100">
                      <div className="truncate" title={r.nup ?? "-"}>
                        {r.nup ?? "-"}
                      </div>
                    </td>

                    {/* Nama */}
                    <td className="w-44 px-3 py-3 text-sm text-blue-900 border-r border-blue-100">
                      {isEdit ? (
                        <Input
                          value={String(draft.nama_pegawai ?? r.nama_pegawai)}
                          onChange={(e) =>
                            setField("nama_pegawai", e.target.value)
                          }
                        />
                      ) : (
                        <div className="truncate" title={r.nama_pegawai}>
                          {r.nama_pegawai}
                        </div>
                      )}
                    </td>

                    {/* Status */}
                    <td className="w-28 px-3 py-3 border-r border-blue-100">
                      {isEdit ? (
                        <Select
                          value={String(
                            draft.status_pegawai ?? r.status_pegawai ?? ""
                          )}
                          onValueChange={(v) => setField("status_pegawai", v)}
                        >
                          <SelectTrigger className="rounded-xl text-black">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            {STATUS_OPTIONS.map((s) => (
                              <SelectItem key={s} value={s}>
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            r.status_pegawai === "KOMERBA"
                              ? "bg-green-100 text-green-800"
                              : r.status_pegawai === "PKWTT"
                              ? "bg-yellow-100 text-yellow-800"
                              : r.status_pegawai === "PKWT"
                              ? "bg-orange-100 text-orange-800"
                              : r.status_pegawai === "FREELANCE"
                              ? "bg-indigo-100 text-indigo-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          <span className="truncate max-w-16">
                            {r.status_pegawai || "-"}
                          </span>
                        </span>
                      )}
                    </td>

                    {/* Email - Flexible column */}
                    <td className="px-3 py-3 text-sm text-blue-900 border-r border-blue-100">
                      {isEdit ? (
                        <Input
                          type="email"
                          value={String(draft.email ?? r.email ?? "")}
                          onChange={(e) => setField("email", e.target.value)}
                        />
                      ) : (
                        <div className="truncate" title={r.email || "-"}>
                          {r.email || "-"}
                        </div>
                      )}
                    </td>

                    {/* Role */}
                    <td className="w-60 px-3 py-3 border-r border-blue-100">
                      {isEdit ? (
                        <div className="max-h-20 overflow-y-auto text-black">
                          <div className="flex flex-wrap gap-1">
                            {((draft.role as string[]) ?? []).map((role, i) => (
                              <span
                                key={`${role}-${i}`}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-100 text-xs"
                              >
                                <span className="truncate max-w-20">{role}</span>
                                <button
                                  type="button"
                                  className="text-slate-500 hover:text-red-600"
                                  onClick={() => {
                                    setField(
                                      "role",
                                      ((draft.role as string[]) ?? []).filter(
                                        (x) => x !== role
                                      )
                                    );
                                  }}
                                >
                                  ✕
                                </button>
                              </span>
                            ))}
                            <Select
                              onValueChange={(v) => {
                                const current = (draft.role as string[]) ?? [];
                                if (!current.includes(v)) {
                                  setField("role", [...current, v]);
                                }
                              }}
                            >
                              <SelectTrigger className="w-24 h-6 rounded-xl">
                                <SelectValue placeholder="+ Role" />
                              </SelectTrigger>
                              <SelectContent>
                                {ROLE_OPTIONS.map((rn) => (
                                  <SelectItem key={rn} value={rn}>
                                    {rn}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      ) : (
                        <div className="max-h-20 overflow-y-auto">
                          <div className="flex flex-wrap gap-1 text-black">
                            {(r.role && r.role.length ? r.role : ["pegawai"]).map(
                              (x, i) => (
                                <span
                                  key={`${x}-${i}`}
                                  className="px-2 py-0.5 rounded-md bg-slate-100 text-xs"
                                >
                                  <span className="truncate max-w-20" title={x}>
                                    {x}
                                  </span>
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Aksi */}
                    <td className="w-36 px-3 py-3">
                      {isEdit ? (
                        <div className="flex flex-col gap-1">
                          <Button
                            onClick={save}
                            disabled={saving}
                          >
                            {saving ? "Menyimpan..." : "Simpan"}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={cancelEdit}
                          >
                            Batal
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1">
                          <Button
                            variant="outline"
                            className="text-black"
                            onClick={() => startEdit(r)}
                          >
                            Edit
                          </Button>
                          <Link
                            href={`/dashboard/admin/detail-pegawai/${encodeURIComponent(
                              r.nup ?? ""
                            )}`}
                            className="inline-flex items-center justify-center px-3 py-2 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md"
                          >
                            Detail
                          </Link>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  async function safeJson(res: Response) {
    try {
      return await res.json();
    } catch {
      return null as any;
    }
  }
}