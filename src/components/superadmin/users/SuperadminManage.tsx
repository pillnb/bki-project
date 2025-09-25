// src/components/superadmin/users/SuperadminManage.tsx
"use client";

import SuperadminInfoCardClient from "@/components/superadmin/layout/SuperadminInfoCardClient";
import UsersInlineTable from "@/components/superadmin/users/UsersInlineTable";
import { useAssignRoles, useUsers } from "@/components/superadmin/hooks";
import { DEFAULT_PAGE_SIZE } from "@/components/superadmin/constants";
import PaginationBar from "@/components/superadmin/users/PaginationBar";
import UsersToolbar from "@/components/superadmin/users/UsersToolbar";
import { useState } from "react";
import BulkRoleBar from "@/components/superadmin/users/BulkRoleBar";
import { toast } from "sonner";

export default function SuperadminManage() {
  // superadmin lihat semua role -> jangan set filter role default
  const { data, meta, query, setQuery, reload, loading } = useUsers({
    pageSize: DEFAULT_PAGE_SIZE,
  });

  // selection buat bulk actions
  const [selected, setSelected] = useState<number[]>([]);
  const { assign, loading: assigning } = useAssignRoles(async () => {
    toast.success("Role updated");
    reload();
    setSelected([]);
  });

  return (
    <div className="space-y-4">
      <SuperadminInfoCardClient />

      <UsersToolbar
        query={query}
        onQueryChange={setQuery}
        onExport={() => Promise.resolve()}
      />

      {/* bulk role actions */}
      <BulkRoleBar
        disabled={selected.length === 0 || assigning}
        count={selected.length}
        onSet={(role) => assign({ userIds: selected, role, mode: "set" })}
        onPush={(role) => assign({ userIds: selected, role, mode: "push" })}
        onRemove={(role) => assign({ userIds: selected, role, mode: "remove" })}
        onClear={() => assign({ userIds: selected, mode: "clear" })}
      />

      <UsersInlineTable
        rows={data as any}
        loading={loading}
        onSaved={reload}
        // selection handlers
        selected={selected}
        onToggleOne={(id, on) =>
          setSelected((prev) =>
            on
              ? Array.from(new Set([...prev, id]))
              : prev.filter((x) => x !== id)
          )
        }
        onToggleAll={(ids, on) =>
          setSelected((prev) =>
            on
              ? Array.from(new Set([...prev, ...ids]))
              : prev.filter((x) => !ids.includes(x))
          )
        }
        // quick assign per-baris
        onAssignOne={(id, role) => assign({ userIds: [id], role, mode: "set" })}
      />

      <PaginationBar
        meta={meta}
        onPageChange={(p) => setQuery((q) => ({ ...q, page: p }))}
      />
    </div>
  );
}
