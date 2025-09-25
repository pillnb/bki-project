"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ROLE_OPTIONS } from "@/components/superadmin/constants";
import { toast } from "sonner";

type Payload = {
  nup?: string;
  nama_pegawai: string;
  email?: string;
  role?: string[];
  status_pegawai?: string;
};

export default function AddUserDialog({
  open,
  onOpenChange,
  onSuccess,
  onSubmit, // optional override
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSuccess?: () => void;
  onSubmit?: (payload: Payload) => Promise<void>;
}) {
  const [nup, setNup] = useState("");
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<string>("PEGAWAI");
  const [status, setStatus] = useState<string>("aktif");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!nama.trim()) {
      toast.error("Nama harus diisi");
      return;
    }
    const payload: Payload = {
      nup: nup || undefined,
      nama_pegawai: nama.trim(),
      email: email || undefined,
      role: role ? [role] : undefined,
      status_pegawai: status || undefined,
    };

    try {
      setLoading(true);
      if (onSubmit) {
        await onSubmit(payload);
      } else {
        // default: asumsi ada endpoint ini. silakan ganti sesuai backend kamu.
        const res = await fetch("/api/pegawai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("create failed");
      }
      toast.success("User berhasil ditambahkan");
      onSuccess?.();
      onOpenChange(false);
      // reset
      setNup("");
      setNama("");
      setEmail("");
      setRole("PEGAWAI");
      setStatus("aktif");
    } catch {
      toast.error("Gagal menambah user");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>Tambah User</DialogTitle>
      </DialogHeader>
      <DialogContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="nup">NUP</Label>
            <Input
              id="nup"
              value={nup}
              onChange={(e) => setNup(e.target.value)}
              placeholder="opsional"
            />
          </div>
          <div>
            <Label htmlFor="nama">Nama *</Label>
            <Input
              id="nama"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Nama lengkap"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="opsional"
            />
          </div>
          <div>
            <Label>Role awal</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="rounded-xl">
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
          </div>
          <div>
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PKWT">PKWT</SelectItem>
                <SelectItem value="PKWTT">PKWTT</SelectItem>
                <SelectItem value="Komerba">Komerba</SelectItem>
                <SelectItem value="Freelance">Freelance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </DialogContent>
      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Batal
        </Button>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Menyimpan..." : "Simpan"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}