// src/components/superadmin/users/UsersToolbar.tsx
"use client";

import { useMemo, useRef, useState } from "react";
import { Download, Search, ChevronDown, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ROLE_OPTIONS,
  STATUS_FILTER_OPTIONS,
} from "@/components/superadmin/constants";
import type { UsersQuery } from "@/components/superadmin/types";
import { toast } from "sonner";

type Props = {
  query: UsersQuery;
  onQueryChange: (updater: (q: UsersQuery) => UsersQuery | UsersQuery) => void;
  onExport: () => Promise<void> | void;
};

export default function UsersToolbar({
  query,
  onQueryChange,
  onExport,
}: Props) {
  // ----- SEARCH -----
  const qValue = query.q ?? "";

  // ----- STATUS (single) -----
  const statusValue = useMemo(
    () =>
      Array.isArray(query.status) && query.status.length
        ? String(query.status[0])
        : "ALL",
    [query.status]
  );

  // ----- ROLES (multi) -----
  const selectedRoles = useMemo<string[]>(
    () => (Array.isArray(query.role) ? query.role : []),
    [query.role]
  );

  const [roleOpen, setRoleOpen] = useState(false);
  const roleWrapRef = useRef<HTMLDivElement | null>(null);

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!roleWrapRef.current) return;
    if (roleWrapRef.current.contains(e.relatedTarget as Node)) return;
    setRoleOpen(false);
  };

  const toggleRole = (role: string) => {
    const exists = selectedRoles.includes(role);
    const next = exists
      ? selectedRoles.filter((r) => r !== role)
      : [...selectedRoles, role];

    onQueryChange((q) => ({
      ...q,
      page: 1,
      role: next.length ? next : undefined, 
    }));
  };

  const clearRoles = () => {
    onQueryChange((q) => ({ ...q, page: 1, role: undefined }));
  };

  const roleButtonLabel = useMemo(() => {
    if (!selectedRoles.length) return "Semua Role";
    if (selectedRoles.length === 1) return selectedRoles[0];
    return `${selectedRoles.length} dipilih`;
  }, [selectedRoles]);

  return (
    <div className="flex flex-col md:flex-row gap-3 md:items-center">
      {/* Search */}
      <div className="flex items-center gap-2 flex-1">
        <Search className="h-4 w-4 text-slate-600" />
        <Input
          placeholder="Cari nama, email, NUP, role..."
          value={qValue}
          onChange={(e) =>
            onQueryChange((q) => ({ ...q, page: 1, q: e.target.value }))
          }
          className="rounded-xl"
        />
      </div>

      <div className="flex gap-2 flex-wrap">
        <div
          className="relative"
          ref={roleWrapRef}
          tabIndex={-1}
          onBlur={handleBlur}
        >
          <Button
            type="button"
            variant="outline"
            className="rounded-xl inline-flex items-center gap-2"
            onClick={() => setRoleOpen((o) => !o)}
          >
            {roleButtonLabel}
            <ChevronDown className="h-4 w-4 opacity-70" />
          </Button>

          {roleOpen && (
            <div
              className="absolute z-40 mt-2 w-56 rounded-xl border bg-white shadow focus:outline-none"
              tabIndex={0}
            >
              <div className="max-h-64 overflow-auto py-2">
                {ROLE_OPTIONS.map((r) => {
                  const checked = selectedRoles.includes(r);
                  return (
                    <button
                      key={r}
                      type="button"
                      className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2"
                      onClick={() => toggleRole(r)}
                    >
                      <span
                        className={`h-4 w-4 rounded border flex items-center justify-center ${
                          checked
                            ? "border-blue-600 bg-blue-600 text-white"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {checked ? <Check className="h-3 w-3" /> : null}
                      </span>
                      <span>{r}</span>
                    </button>
                  );
                })}
              </div>

              <div className="border-t p-2 flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-lg"
                  onClick={clearRoles}
                >
                  <X className="h-4 w-4 mr-1" />
                  Bersihkan
                </Button>
                <Button
                  type="button"
                  size="sm"
                  className="rounded-lg"
                  onClick={() => setRoleOpen(false)}
                >
                  Terapkan
                </Button>
              </div>
            </div>
          )}
        </div>

        <Select
          value={statusValue}
          onValueChange={(v) =>
            onQueryChange((q) => ({
              ...q,
              page: 1,
              status: v === "ALL" ? undefined : [v],
            }))
          }
        >
          <SelectTrigger className="w-44 rounded-xl">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_FILTER_OPTIONS.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* EXPORT */}
        <Button
          variant="outline"
          className="rounded-xl"
          onClick={async () => {
            try {
              await Promise.resolve(onExport());
              toast.success("Export dimulai");
            } catch {
              toast.error("Export gagal");
            }
          }}
        >
          <Download className="h-4 w-4 mr-2" /> Export CSV
        </Button>
      </div>
    </div>
  );
}
