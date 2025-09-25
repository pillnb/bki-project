"use client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ROLE_OPTIONS } from "@/components/superadmin/constants";
import { toast } from "sonner";

type Props = {
  onAssign: (role: string) => void | Promise<void>;
};

export default function RoleAssignCell({ onAssign }: Props) {
  return (
    <Select onValueChange={async (v) => {
      try {
        await Promise.resolve(onAssign(v));
        toast.success(`Role ${v} diterapkan`);
      } catch {
        toast.error("Gagal update role");
      }
    }}>
      <SelectTrigger className="w-44 rounded-xl">
        <SelectValue placeholder="Assign role..." />
      </SelectTrigger>
      <SelectContent>
        {ROLE_OPTIONS.map((opt) => (
          <SelectItem key={opt} value={opt}>{opt}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}