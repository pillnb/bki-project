"use client";

import { toast } from "sonner";
import { DEFAULT_PAGE_SIZE } from "@/components/superadmin/constants";
import {
  useAssignRoles,
  useCsv,
  useUsers,
} from "@/components/superadmin/hooks";
import UsersToolbar from "@/components/superadmin/users/UsersToolbar";
import UsersTable from "@/components/superadmin/users/UsersTable";
import BulkRoleBar from "@/components/superadmin/users/BulkRoleBar";
import PaginationBar from "@/components/superadmin/users/PaginationBar";
import { useState } from "react";

export default function UsersPage() {
  const { data, meta, query, setQuery, reload, loading, error } = useUsers({
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const [selected, setSelected] = useState<number[]>([]);
  const { assign, loading: assigning } = useAssignRoles(async () => {
    toast.success("Role updated");
    reload();
    setSelected([]);
  });
  const { exportCsv, loading: exporting } = useCsv();

  return (
    <div className="space-y-4">
      <UsersToolbar
        query={query}
        onQueryChange={setQuery}
        onExport={() => exportCsv(query)}
      />
      <BulkRoleBar
        disabled={selected.length === 0 || assigning}
        count={selected.length}
        onSet={(role) => assign({ userIds: selected, role, mode: "set" })}
        onPush={(role) => assign({ userIds: selected, role, mode: "push" })}
        onRemove={(role) => assign({ userIds: selected, role, mode: "remove" })}
        onClear={() => assign({ userIds: selected, mode: "clear" })}
      />
      <UsersTable
        rows={data}
        loading={loading}
        error={error}
        selected={selected}
        onToggleOne={(id, on) =>
          setSelected((prev) =>
            on
              ? Array.from(new Set([...prev, id]))
              : prev.filter((x) => x !== id)
          )
        }
        onToggleAll={(ids, on) =>
          setSelected(
            on
              ? Array.from(new Set([...selected, ...ids]))
              : selected.filter((x) => !ids.includes(x))
          )
        }
        onAssignOne={(id, role) => assign({ userIds: [id], role, mode: "set" })}
      />
      <PaginationBar
        meta={meta}
        onPageChange={(p) => setQuery((q) => ({ ...q, page: p }))}
      />
    </div>
  );
}