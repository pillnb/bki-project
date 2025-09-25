"use client";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function DeleteUserDialog({
  open,
  onOpenChange,
  userId,
  userName,
  onSuccess,
  onDelete, // optional override
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  userId?: number;
  userName?: string;
  onSuccess?: () => void;
  onDelete?: (id: number) => Promise<void>;
}) {
  async function handleDelete() {
    if (!userId) return;
    try {
      if (onDelete) {
        await onDelete(userId);
      } else {
        // default: asumsi ada endpoint ini (silakan ganti sesuai backend kamu).
        const res = await fetch(`/api/pegawai/${userId}`, { method: "DELETE" });
        if (!res.ok) throw new Error("delete failed");
      }
      toast.success("User dihapus");
      onSuccess?.();
      onOpenChange(false);
    } catch {
      toast.error("Gagal menghapus user");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>Hapus User</DialogTitle>
      </DialogHeader>
      <DialogContent>
        <p className="text-sm text-slate-700">
          Kamu yakin mau hapus{" "}
          <span className="font-semibold">{userName ?? `ID ${userId}`}</span>?
          Tindakan ini tidak bisa dibatalkan.
        </p>
      </DialogContent>
      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Batal
        </Button>
        <Button variant="destructive" onClick={handleDelete}>
          Hapus
        </Button>
      </DialogFooter>
    </Dialog>
  );
}