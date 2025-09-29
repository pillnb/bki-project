// src/components/superadmin/pegawai-detail/usePegawaiDetail.ts
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { PegawaiDetail, PengalamanKerja, Kualifikasi } from "./types";
import { toast } from "sonner";

export function usePegawaiDetail(nup?: string) {
  const [data, setData] = useState<PegawaiDetail | null>(null);
  const [form, setForm] = useState<PegawaiDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [pwd, setPwd] = useState({ new_password: "", confirm_password: "" });

  const fetchData = useCallback(async () => {
    if (!nup) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/pegawai/${encodeURIComponent(nup)}?t=${Date.now()}`, {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });
      if (!res.ok) throw new Error("Data pegawai tidak ditemukan");
      const j = (await res.json()) as PegawaiDetail;
      // normalisasi array
      j.kualifikasi = Array.isArray(j.kualifikasi) ? j.kualifikasi : [];
      j.pengalaman_kerja = Array.isArray(j.pengalaman_kerja) ? j.pengalaman_kerja : [];
      setData(j);
      setForm(j);
    } catch (e: any) {
      setError(e?.message ?? "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }, [nup]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onField = useCallback(
    (name: keyof PegawaiDetail, value: any) => {
      setForm((prev) => (prev ? { ...prev, [name]: value } : prev));
    },
    []
  );

  const onRoleToggle = useCallback((role: string, checked: boolean) => {
    setForm((prev) => {
      if (!prev) return prev;
      const next = checked
        ? Array.from(new Set([...(prev.role ?? []), role]))
        : (prev.role ?? []).filter((r) => r !== role);
      return { ...prev, role: next };
    });
  }, []);

  const pengalamanAdd = useCallback(() => {
    setForm((prev) => {
      if (!prev) return prev;
      const item: PengalamanKerja = {
        id: Date.now(),
        pengalaman_kerja: "",
        perusahaan: "",
        tahun_awal: new Date().getFullYear(),
        tahun_akhir: new Date().getFullYear(),
        lokasi: "",
      };
      return { ...prev, pengalaman_kerja: [...prev.pengalaman_kerja, item] };
    });
  }, []);

  const pengalamanRemove = useCallback((idx: number) => {
    setForm((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        pengalaman_kerja: prev.pengalaman_kerja.filter((_, i) => i !== idx),
      };
    });
  }, []);

  const pengalamanUpdate = useCallback((idx: number, field: keyof PengalamanKerja, value: any) => {
    setForm((prev) => {
      if (!prev) return prev;
      const arr = prev.pengalaman_kerja.map((it, i) => (i === idx ? { ...it, [field]: value } : it));
      return { ...prev, pengalaman_kerja: arr };
    });
  }, []);

  const kualifikasiAdd = useCallback(() => {
    setForm((prev) => {
      if (!prev) return prev;
      const item: Kualifikasi = {
        id_pelatihan: Date.now(),
        nama_pelatihan: "",
        penyelenggara: "",
        nomor_sertifikat: "",
        tahun: new Date().getFullYear(),
        tanggal_awal: "",
        tanggal_akhir: "",
        masa_berlaku: "",
        status: "VALID",
        keterangan_utilisasi: "",
        lokasi: "",
      };
      return { ...prev, kualifikasi: [...prev.kualifikasi, item] };
    });
  }, []);

  const kualifikasiRemove = useCallback((idx: number) => {
    setForm((prev) => {
      if (!prev) return prev;
      return { ...prev, kualifikasi: prev.kualifikasi.filter((_, i) => i !== idx) };
    });
  }, []);

  const kualifikasiUpdate = useCallback((idx: number, field: keyof Kualifikasi, value: any) => {
    setForm((prev) => {
      if (!prev) return prev;
      const arr = prev.kualifikasi.map((it, i) => (i === idx ? { ...it, [field]: value } : it));
      return { ...prev, kualifikasi: arr };
    });
  }, []);

  const cancelEdit = useCallback(() => {
    setEditing(false);
    setForm(data);
    setPwd({ new_password: "", confirm_password: "" });
  }, [data]);

  const save = useCallback(async () => {
    if (!form || !nup) return;
    if (pwd.new_password && pwd.new_password !== pwd.confirm_password) {
      toast.error("Password baru dan konfirmasi password tidak cocok");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        ...(pwd.new_password ? { password: pwd.new_password } : {}),
      };
      const res = await fetch(`/api/pegawai/${encodeURIComponent(nup)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Gagal menyimpan data");
      const updated = (await res.json()) as PegawaiDetail;
      updated.kualifikasi = Array.isArray(updated.kualifikasi) ? updated.kualifikasi : [];
      updated.pengalaman_kerja = Array.isArray(updated.pengalaman_kerja) ? updated.pengalaman_kerja : [];
      setData(updated);
      setForm(updated);
      setEditing(false);
      setPwd({ new_password: "", confirm_password: "" });
      toast.success("Data berhasil disimpan");
    } catch (e: any) {
      toast.error(e?.message ?? "Terjadi kesalahan saat menyimpan");
    } finally {
      setSaving(false);
    }
  }, [form, nup, pwd]);

  const fmtDate = useCallback((val?: string) => {
    if (!val) return "-";
    try {
      return new Date(val).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "-";
    }
  }, []);

  return {
    data,
    form,
    setForm,
    loading,
    saving,
    editing,
    error,
    setEditing,
    cancelEdit,
    save,
    onField,
    onRoleToggle,
    pengalamanAdd,
    pengalamanRemove,
    pengalamanUpdate,
    kualifikasiAdd,
    kualifikasiRemove,
    kualifikasiUpdate,
    pwd,
    setPwd,
    fmtDate,
    refetch: fetchData,
  };
}