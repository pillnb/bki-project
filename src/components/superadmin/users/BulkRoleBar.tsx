"use client";
import { Shield, Trash2, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ROLE_OPTIONS } from "@/components/superadmin/constants";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
  count: number;
  disabled?: boolean;
  onSet: (role: string) => void | Promise<void>;
  onPush: (role: string) => void | Promise<void>;
  onRemove: (role: string) => void | Promise<void>;
  onClear: () => void | Promise<void>;
};

export default function BulkRoleBar({
  count,
  disabled,
  onSet,
  onPush,
  onRemove,
  onClear,
}: Props) {
  const [role, setRole] = useState<string>("PEGAWAI");

  const guard = (fn: () => void | Promise<void>) => async () => {
    if (count === 0) {
      toast.error("Pilih minimal 1 user dulu");
      return;
    }
    await Promise.resolve(fn());
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-3 bg-white border border-slate-200 rounded-xl">
      <div className="text-sm text-slate-600">Dipilih {count} user</div>
      <div className="flex items-center gap-2 flex-wrap">
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger className="w-48 rounded-xl text-blue-900">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ROLE_OPTIONS.map((r) => (
              <SelectItem key={r} value={r}>
                {r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          className="rounded-xl"
          disabled={disabled}
          onClick={guard(() => onSet(role))}
        >
          <Shield className="h-4 w-4 mr-2" /> Set
        </Button>
        <Button
          variant="outline"
          className="rounded-xl"
          disabled={disabled}
          onClick={guard(() => onPush(role))}
        >
          <Plus className="h-4 w-4 mr-2" /> Tambah
        </Button>
        <Button
          variant="outline"
          className="rounded-xl"
          disabled={disabled}
          onClick={guard(() => onRemove(role))}
        >
          <Minus className="h-4 w-4 mr-2" /> Hapus Role Ini
        </Button>
        <Button
          variant="destructive"
          className="rounded-xl"
          disabled={disabled}
          onClick={guard(onClear)}
        >
          <Trash2 className="h-4 w-4 mr-2" /> Kosongkan Semua Role
        </Button>
      </div>
    </div>
  );
}