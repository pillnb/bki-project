// src/components/training/TrainingPegawaiClient.tsx
"use client";

import React from "react";
import Navbar from "@/app/dashboard/pegawai/Navbar";
import { PegawaiLite, Training, AddFormData, CompleteFormData } from "./types";
import SearchAndFilter from "./SearchAndFilter";
import TrainingTable from "./TrainingTable";
import AddTrainingModal from "./AddTrainingModal";
import CompleteTrainingModal from "./CompleteTrainingModal";
import EditTrainingModal from "./EditTrainingModal";
import { mapApiTrainingToClient, computeTrainingStatus } from "./utils";

type Props = {
  nup?: string;
  pegawai?: PegawaiLite;
};

export default function TrainingPegawaiClient({ nup, pegawai }: Props) {
  const [trainings, setTrainings] = React.useState<Training[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [currentNup, setCurrentNup] = React.useState<string>("");

  const [filter, setFilter] = React.useState<string>("");
  const [statusFilter, setStatusFilter] = React.useState<string[]>(["ALL"]);
  const [sortKey, setSortKey] = React.useState<keyof Training>("nama");
  const [sortAsc, setSortAsc] = React.useState<boolean>(true);

  const [showAddForm, setShowAddForm] = React.useState<boolean>(false);
  const [showCompleteForm, setShowCompleteForm] = React.useState<boolean>(false);
  const [completeDefault, setCompleteDefault] = React.useState<CompleteFormData>({
    id: null,
    tanggalSelesaiAktual: "",
    noSertifikat: "",
    file: null,
    tanggalKadaluarsa: "",
  });

  const [selectedTraining, setSelectedTraining] = React.useState<Training | null>(null);
  const [editing, setEditing] = React.useState<Training | null>(null);

  // load data
  React.useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        if (nup) {
          setCurrentNup(nup);
          const res = await fetch(`/api/training?nup=${nup}`);
          if (!res.ok) throw new Error("Gagal mengambil data training");
          const data = await res.json();
          const mapped = (Array.isArray(data) ? data : []).map((raw) => {
            const t = mapApiTrainingToClient(raw);
            return {
              ...t,
              status: computeTrainingStatus({
                fileUrl: t.fileUrl,
                tanggalKadaluarsa: t.tanggalKadaluarsa,
              }),
            };
          });
          setTrainings(mapped);
        } else {
          const res = await fetch("/api/training");
          if (!res.ok) throw new Error("Gagal mengambil data training");
          const data = await res.json();
          const mapped = (Array.isArray(data) ? data : []).map((raw) => {
            const t = mapApiTrainingToClient(raw);
            return {
              ...t,
              status: computeTrainingStatus({
                fileUrl: t.fileUrl,
                tanggalKadaluarsa: t.tanggalKadaluarsa,
              }),
            };
          });
          setTrainings(mapped);

          const userRes = await fetch("/api/pegawai/current");
          if (userRes.ok) {
            const userData = await userRes.json();
            setCurrentNup(userData.nup);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [nup]);

  // re-kalkulasi status harian (kalau tab-nya lama terbuka)
  React.useEffect(() => {
    const timer = setInterval(() => {
      setTrainings((prev) =>
        prev.map((t) => ({
          ...t,
          status: computeTrainingStatus({
            fileUrl: t.fileUrl,
            tanggalKadaluarsa: t.tanggalKadaluarsa,
          }),
        }))
      );
    }, 24 * 60 * 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  const filteredTrainings = React.useMemo(() => {
    let result = trainings.filter((t) => {
      if (!t || typeof t !== "object") return false;
      const nama = typeof t.nama === "string" ? t.nama : "";
      const penyelenggara = typeof t.penyelenggara === "string" ? t.penyelenggara : "";
      const status = typeof t.status === "string" ? t.status : "";
      return (
        nama.toLowerCase().includes(filter.toLowerCase()) ||
        penyelenggara.toLowerCase().includes(filter.toLowerCase()) ||
        status.toLowerCase().includes(filter.toLowerCase())
      );
    });
    if (!(statusFilter.includes("ALL") || statusFilter.length === 0)) {
      result = result.filter((t) => statusFilter.includes(t.status));
    }
    return result.sort((a, b) => {
      const aValue = a[sortKey] as unknown;
      const bValue = b[sortKey] as unknown;
      if (aValue === undefined && bValue === undefined) return 0;
      if (aValue === undefined || aValue === null) return 1;
      if (bValue === undefined || bValue === null) return -1;
      if (aValue < bValue) return sortAsc ? -1 : 1;
      if (aValue > bValue) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [trainings, filter, sortKey, sortAsc, statusFilter]);

  const handleSort = (key: keyof Training) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  // ADD
  const submitAdd = async (addForm: AddFormData) => {
    if (!currentNup) {
      alert("NUP tidak ditemukan. Silakan login ulang.");
      return;
    }
    try {
      let fileUrl: string | undefined;

      if (addForm.sudahSelesai && addForm.file) {
        const fd = new FormData();
        fd.append("file", addForm.file);
        fd.append("nup", currentNup);
        fd.append("namaPegawai", pegawai?.nama_pegawai || "");
        fd.append("namaTraining", addForm.nama);
        fd.append("penyelenggara", addForm.penyelenggara);
        fd.append("tahun", String(addForm.tahun || ""));

        const uploadRes = await fetch("/api/drive/upload-certificate", { method: "POST", body: fd });
        if (!uploadRes.ok) {
          const err = await uploadRes.json().catch(() => ({}));
          throw new Error(err?.error || "Gagal upload sertifikat ke Google Drive");
        }
        const uploadData = await uploadRes.json();
        fileUrl = uploadData.webViewLink || uploadData.webContentLink;
      }

      const payload: Record<string, unknown> = {
        nup: currentNup,
        nama_pelatihan: addForm.nama,
        penyelenggara: addForm.penyelenggara,
        tanggal_awal: addForm.tanggalMulai,
        tanggal_akhir: addForm.sudahSelesai ? addForm.tanggalSelesaiAktual : addForm.tanggalSelesaiEstimasi,
        tahun: Number(addForm.tahun),
      };

      if (addForm.sudahSelesai && fileUrl) {
        payload.file_sertifikat = fileUrl;
        payload.nomor_sertifikat = addForm.noSertifikat || null;
      }

      const res = await fetch("/api/training", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "Gagal menambah training");
      }

      const created = await res.json();
      const mapped = mapApiTrainingToClient(created);
      const withStatus: Training = {
        ...mapped,
        status: computeTrainingStatus({
          fileUrl: mapped.fileUrl,
          tanggalKadaluarsa: mapped.tanggalKadaluarsa,
        }),
      };
      setTrainings((prev) => [withStatus, ...prev]);
      setShowAddForm(false);
    } catch (e) {
      console.error(e);
      alert(e instanceof Error ? e.message : "Gagal menambah training");
    }
  };

  // COMPLETE
  const submitComplete = async (form: CompleteFormData, fileUrl: string) => {
    try {
      const payload = {
        id_pelatihan: form.id,
        data: {
          nomor_sertifikat: form.noSertifikat,
          tanggal_akhir: form.tanggalSelesaiAktual,
          masa_berlaku: form.tanggalKadaluarsa,
          file_sertifikat: fileUrl,
        },
      };

      const res = await fetch("/api/training", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "Gagal menyelesaikan training");
      }

      const updated = await res.json();
      const mapped = mapApiTrainingToClient(updated);
      const withStatus: Training = {
        ...mapped,
        status: computeTrainingStatus({
          fileUrl: mapped.fileUrl,
          tanggalKadaluarsa: mapped.tanggalKadaluarsa,
        }),
      };

      setTrainings((prev) => prev.map((t) => (t.id === withStatus.id ? withStatus : t)));
      setShowCompleteForm(false);
    } catch (e: unknown) {
      console.error(e);
      alert((e as Error)?.message || "Gagal menyelesaikan training");
    }
  };

  // DELETE
  const deleteTraining = async (t: Training) => {
    if (!confirm(`Hapus training "${t.nama}"?`)) return;
    try {
      const res = await fetch(`/api/training?id=${t.id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "Gagal menghapus training");
      }
      setTrainings((prev) => prev.filter((x) => x.id !== t.id));
    } catch (e: unknown) {
      alert((e as Error)?.message || "Gagal menghapus training");
    }
  };

  const openComplete = (t: Training) => {
    setSelectedTraining(t);
    setCompleteDefault({
      id: t.id,
      tanggalSelesaiAktual: t.tanggalSelesaiAktual || t.tanggalSelesaiEstimasi || "",
      noSertifikat: t.noSertifikat || "",
      file: null,
      tanggalKadaluarsa: t.tanggalKadaluarsa || "",
    });
    setShowCompleteForm(true);
  };

  const openEdit = (t: Training) => setEditing(t);

  const handleSavedFromEdit = (updated: Training) => {
    const withStatus: Training = {
      ...updated,
      status: computeTrainingStatus({
        fileUrl: updated.fileUrl,
        tanggalKadaluarsa: updated.tanggalKadaluarsa,
      }),
    };
    setTrainings((prev) => prev.map((x) => (x.id === withStatus.id ? withStatus : x)));
    setEditing(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#e9f1fa] pb-10">
        <Navbar />
        <div className="max-w-6xl mx-auto mt-12 px-4">
          <div className="text-center py-8">
            <div className="text-blue-900">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#e9f1fa] pb-10">
      <Navbar />
      <div className="max-w-6xl mx-auto mt-12 px-4">
        {pegawai && (
          <div className="rounded-xl shadow-lg p-6 flex items-center gap-6 mb-8" style={{ backgroundColor: "#193288" }}>
            <div className="w-20 h-20 rounded-full bg-yellow-400 flex items-center justify-center text-4xl font-bold text-white border-2 border-white border-solid shadow-md">
              <span role="img" aria-label="avatar">🧑🏽‍💼</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">{pegawai?.nama_pegawai || "-"}</h2>
              <div className="text-white text-sm">Status Pegawai: <span className="font-bold text-white">{pegawai?.status_pegawai || "-"}</span></div>
              <div className="text-white text-sm">NUP: <span className="font-bold text-white">{pegawai?.nup || "-"}</span></div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-blue-900">Training Pegawai</h1>
          <button
            className="bg-blue-900 text-white px-4 py-2 rounded font-semibold hover:bg-blue-800 shadow transition-colors"
            onClick={() => setShowAddForm(true)}
          >
            Tambah Training
          </button>
        </div>

        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <SearchAndFilter
            filter={filter}
            setFilter={setFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            total={filteredTrainings.length}
          />

          <TrainingTable
            items={filteredTrainings}
            onSort={(k) => handleSort(k)}
            sortKey={sortKey}
            sortAsc={sortAsc}
            onCompleteClick={(t) => openComplete(t)}
            onEditClick={(t) => openEdit(t)}
            onDeleteClick={(t) => deleteTraining(t)}
          />
        </div>
      </div>

      <AddTrainingModal open={showAddForm} onClose={() => setShowAddForm(false)} onSubmit={submitAdd} />

      <CompleteTrainingModal
        open={showCompleteForm}
        onClose={() => setShowCompleteForm(false)}
        onSubmit={submitComplete}
        defaultValues={completeDefault}
        namaPegawai={pegawai?.nama_pegawai || ""}
        nup={pegawai?.nup || currentNup}
        namaTraining={selectedTraining?.nama || ""}
        penyelenggara={selectedTraining?.penyelenggara || ""}
        tahun={String(selectedTraining?.tahun || "")}
      />

      <EditTrainingModal
        open={!!editing}
        onClose={() => setEditing(null)}
        training={editing}
        onSaved={handleSavedFromEdit}
        nup={pegawai?.nup || currentNup}
        namaPegawai={pegawai?.nama_pegawai || ""}
      />
    </div>
  );
}