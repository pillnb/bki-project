"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import SuratDetailModal, {
  type SuratDetail,
} from "@/components/SuratTugas/SuratDetailModal";
import { normalizeStatus, fmt } from "@/components/SuratTugas/utils";
import type { StatusSurat } from "@/components/SuratTugas/StatusPill";

type ApiSurat = {
  id?: number | string;
  nomor_surat?: string | null;
  proyek?: { klien?: string | null; namaProyek?: string | null } | null;
  klien?: string | null;
  pekerjaan?: string | null;
  status?: StatusSurat | string | null;
  leadInspector?:
    | string
    | { nup?: string | null; nama_pegawai?: string | null }
    | null;
  timInspektor?: Array<{ nup?: string | null; nama_pegawai?: string | null }> | null;
  createdAt?: string | null;
  tanggal_berangkat?: string | null;
  tanggal_kembali?: string | null;
};

type Row = {
  id: number;
  nomor_surat: string | null;
  klien: string;
  pekerjaan: string;
  status: StatusSurat;
  leadInspectorText: string;
  createdAt: string | null;
  tanggal_berangkat: string | null;
  tanggal_kembali: string | null;
};

export default function MonitoringPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  // modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<SuratDetail | null>(null);

  useEffect(() => {
    const ac = new AbortController();

    (async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/surat-tugas", {
          cache: "no-store",
          signal: ac.signal,
        });
        const raw = await res.json().catch(() => []);
        const arr: ApiSurat[] = Array.isArray(raw?.data)
          ? raw.data
          : Array.isArray(raw)
          ? raw
          : [];

        const list: Row[] = arr.map((x) => {
          const lead = x?.leadInspector;
          const leadInspectorText =
            typeof lead === "string"
              ? lead
              : lead && typeof lead === "object"
              ? lead.nama_pegawai || lead.nup || "-"
              : (() => {
                  const first = x?.timInspektor?.[0];
                  return first?.nama_pegawai || first?.nup || "-";
                })();

          return {
            id: Number(x?.id ?? 0),
            nomor_surat: x?.nomor_surat ?? null,
            klien: x?.proyek?.klien ?? x?.klien ?? "-",
            pekerjaan: x?.proyek?.namaProyek ?? x?.pekerjaan ?? "-",
            status: normalizeStatus(x?.status),
            leadInspectorText,
            createdAt: x?.createdAt ?? null,
            tanggal_berangkat: x?.tanggal_berangkat ?? null,
            tanggal_kembali: x?.tanggal_kembali ?? null,
          };
        });

        setRows(list);
      } catch (e) {
        if (!(e instanceof DOMException && e.name === "AbortError")) {
          setRows([]);
        }
      } finally {
        setLoading(false);
      }
    })();

    return () => ac.abort();
  }, []);

  // buka modal + ambil detail penuh
  const openDetail = async (row: Row) => {
    setModalOpen(true);
    setSelected(null); // reset dulu (modal akan menunggu data)
    try {
      const res = await fetch(`/api/surat-tugas/${row.id}`, { cache: "no-store" });
      const detail = (await res.json()) as SuratDetail;
      setSelected(detail);
    } catch {
      // kalau gagal, tetap tampilkan data minimum dari row
      setSelected({
        id: row.id,
        nomor_surat: row.nomor_surat,
        klien: row.klien,
        pekerjaan: row.pekerjaan,
        status: row.status,
        createdAt: row.createdAt,
        tanggal_berangkat: row.tanggal_berangkat,
        tanggal_kembali: row.tanggal_kembali,
      });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-blue-900">Monitoring Surat Tugas</h1>
        <p className="text-sm text-blue-700">
          Pantau status pengajuan dan progres surat tugas anda.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-blue-100">
          <thead className="bg-blue-900">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">No</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Nomor</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Klien</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Pekerjaan</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Lead</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Diajukan</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Berangkat</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Kembali</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-blue-50">
            {loading ? (
              <tr>
                <td colSpan={10} className="px-6 py-6 text-center text-blue-600">Loading...</td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-6 py-6 text-center text-blue-400">Belum ada data</td>
              </tr>
            ) : (
              rows.map((r, i) => (
                <tr key={r.id || i} className={i % 2 === 0 ? "bg-blue-50" : "bg-white"}>
                  <td className="px-4 py-3 text-sm text-blue-900">{i + 1}</td>
                  <td className="px-4 py-3 text-sm text-blue-900">{r.nomor_surat || "-"}</td>
                  <td className="px-4 py-3 text-sm text-blue-900">{r.klien}</td>
                  <td className="px-4 py-3 text-sm text-blue-900 max-w-[280px] truncate" title={r.pekerjaan}>
                    {r.pekerjaan}
                  </td>
                  <td className="px-4 py-3 text-sm text-blue-900">{r.leadInspectorText}</td>
                  <td className="px-4 py-3 text-sm text-blue-900">{fmt(r.createdAt)}</td>
                  <td className="px-4 py-3 text-sm text-blue-900">{fmt(r.tanggal_berangkat)}</td>
                  <td className="px-4 py-3 text-sm text-blue-900">{fmt(r.tanggal_kembali)}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => openDetail(r)}
                      className="p-2 text-blue-700 hover:bg-blue-100 rounded-lg transition"
                      title="Lihat detail"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Detail */}
      <SuratDetailModal
        open={modalOpen}
        surat={selected}
        onClose={() => setModalOpen(false)}
        onSaved={(updated) => {
          // sinkronkan baris tabel setelah edit
          setSelected(updated);
          setRows((prev) =>
            prev.map((x) =>
              x.id === updated.id
                ? {
                    ...x,
                    nomor_surat: updated.nomor_surat ?? x.nomor_surat,
                    klien: updated.proyek?.klien ?? updated.klien ?? x.klien,
                    pekerjaan: updated.proyek?.namaProyek ?? updated.pekerjaan ?? x.pekerjaan,
                    status: normalizeStatus(updated.status),
                    tanggal_berangkat: updated.tanggal_berangkat ?? x.tanggal_berangkat,
                    tanggal_kembali: updated.tanggal_kembali ?? x.tanggal_kembali,
                  }
                : x
            )
          );
        }}
      />
    </div>
  );
}