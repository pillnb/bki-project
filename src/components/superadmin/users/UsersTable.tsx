"use client";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import RoleAssignCell from "@/components/superadmin/users/RoleAssignCell";
import { toast } from "sonner";

export type TableRowData = {
  id: number;
  nup?: string | null;
  nama_pegawai: string;
  email?: string | null;
  role: string[];
  status_pegawai?: string | null;
};

type Props = {
  rows: TableRowData[];
  loading?: boolean;
  error?: string | null;
  selected: number[];
  onToggleOne: (id: number, checked: boolean) => void;
  onToggleAll: (currentPageIds: number[], checked: boolean) => void;
  onAssignOne: (id: number, role: string) => void | Promise<void>;
};

export default function UsersTable({
  rows,
  loading,
  error,
  selected,
  onToggleOne,
  onToggleAll,
  onAssignOne,
}: Props) {
  const pageIds = rows.map((r) => r.id);
  const allChecked =
    pageIds.length > 0 && pageIds.every((id) => selected.includes(id));

  if (error) {
    toast.error("Gagal memuat data");
  }

  // Lebar kolom untuk kalkulasi sticky
  const CHECKBOX_W = 48; // w-12
  const ID_W = 96;
  const NUP_W = 140;
  const NAME_W = 240;

  // offset kolom "Nama" = total lebar kolom sebelum "Nama"
  const NAME_LEFT_OFFSET = CHECKBOX_W + ID_W + NUP_W; // 48 + 96 + 140 = 284

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto relative">
      <Table className="min-w-[1200px]">
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <input
                type="checkbox"
                checked={allChecked}
                onChange={(e) => onToggleAll(pageIds, e.currentTarget.checked)}
              />
            </TableHead>

            {/* ID (tidak sticky) */}
            <TableHead className="w-[96px] whitespace-nowrap">ID</TableHead>

            {/* NUP (tidak sticky) */}
            <TableHead className="w-[140px] whitespace-nowrap">NUP</TableHead>

            {/* NAMA (STICKY) */}
            <TableHead
              className="sticky z-20 bg-white dark:bg-slate-900 border-r whitespace-nowrap shadow-[8px_0_8px_-8px_rgba(0,0,0,0.15)]"
              style={{
                left: NAME_LEFT_OFFSET,
                width: NAME_W,
                minWidth: NAME_W,
                maxWidth: NAME_W,
              }}
            >
              Nama
            </TableHead>

            {/* SISANYA */}
            <TableHead className="w-[260px] whitespace-nowrap">Email</TableHead>
            <TableHead className="w-[280px] whitespace-nowrap">Role</TableHead>
            <TableHead className="w-[140px] whitespace-nowrap">Status</TableHead>
            <TableHead className="text-right w-[160px] whitespace-nowrap">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-10">
                Loading...
              </TableCell>
            </TableRow>
          ) : rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-10">
                Tidak ada data
              </TableCell>
            </TableRow>
          ) : (
            rows.map((r) => (
              <TableRow key={r.id} className="hover:bg-slate-50">
                <TableCell className="w-12">
                  <input
                    type="checkbox"
                    checked={selected.includes(r.id)}
                    onChange={(e) => onToggleOne(r.id, e.currentTarget.checked)}
                  />
                </TableCell>

                {/* ID (tidak sticky) */}
                <TableCell className="w-[96px] whitespace-nowrap">
                  {r.id}
                </TableCell>

                {/* NUP (tidak sticky) */}
                <TableCell className="w-[140px] whitespace-nowrap">
                  {r.nup ?? "-"}
                </TableCell>

                {/* NAMA (STICKY) */}
                <TableCell
                  className="sticky z-10 bg-white dark:bg-slate-900 border-r font-medium whitespace-nowrap shadow-[8px_0_8px_-8px_rgba(0,0,0,0.12)]"
                  style={{
                    left: NAME_LEFT_OFFSET,
                    width: NAME_W,
                    minWidth: NAME_W,
                    maxWidth: NAME_W,
                  }}
                >
                  {r.nama_pegawai}
                </TableCell>

                {/* SISANYA */}
                <TableCell className="whitespace-nowrap">
                  {r.email ?? "-"}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {r.role && r.role.length > 0 ? (
                      r.role.map((role, i) => (
                        <Badge key={i} variant="secondary" className="rounded-lg">
                          {role}
                        </Badge>
                      ))
                    ) : (
                      <Badge variant="secondary" className="rounded-lg">
                        pegawai
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {r.status_pegawai ?? "-"}
                </TableCell>
                <TableCell className="text-right">
                  <RoleAssignCell onAssign={(role) => onAssignOne(r.id, role)} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
