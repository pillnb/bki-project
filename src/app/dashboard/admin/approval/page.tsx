"use client";
import { useEffect, useState } from "react";
import { Check, X, Eye } from "lucide-react";
import Link from "next/link";

type SuratLite = {
  id: number;
  nomor_surat: string | null;
  status: string;
  bidang_pekerjaan: string | null;
  createdAt: string;
  proyek?: { namaProyek: string; klien: string } | null;
  queue: "MENUNGGU_LEAD" | "MENUNGGU_KOORDINATOR" | "MENUNGGU_SM" | "MENUNGGU_KACAB";
};

function fmt(d?: string | null) {
  if (!d) return "-";
  try {
    return new Date(d).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
  } catch { return "-"; }
}

export default function ApprovalPage() {
  const [rows, setRows] = useState<SuratLite[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/approvals/my", { cache: "no-store" });
      const json = await res.json();
      const list: SuratLite[] = (json?.data ?? []).map((x: unknown) => {
        const item = x as {
          id: number;
          nomor_surat?: string;
          status: string;
          bidang_pekerjaan?: string;
          createdAt: string;
          proyek?: { namaProyek: string; klien: string };
          queue: number;
        };
        return {
          id: item.id,
          nomor_surat: item.nomor_surat ?? null,
          status: item.status,
          bidang_pekerjaan: item.bidang_pekerjaan ?? null,
          createdAt: item.createdAt,
          proyek: item.proyek ? { namaProyek: item.proyek.namaProyek, klien: item.proyek.klien } : null,
          queue: item.queue,
        };
      });
      setRows(list);
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const approve = async (id: number) => {
    setSubmitting(id);
    try {
      const res = await fetch(`/api/surat-tugas/${id}/approve`, { method: "POST" });
      if (!res.ok) throw new Error();
      await load();
    } catch {
      alert("Gagal approve. Mungkin status sudah berubah.");
    } finally {
      setSubmitting(null);
    }
  };

  const reject = async (id: number) => {
    const reason = prompt("Alasan penolakan:");
    if (!reason) return;
    setSubmitting(id);
    try {
      const res = await fetch(`/api/surat-tugas/${id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      if (!res.ok) throw new Error();
      await load();
    } catch {
      alert("Gagal menolak. Mungkin status sudah berubah.");
    } finally {
      setSubmitting(null);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-blue-900">Approval Surat Tugas</h1>
        <p className="text-sm text-blue-700">Hanya menampilkan surat yang sesuai dengan jabatan Anda.</p>
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-blue-100">
          <thead className="bg-blue-900">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">No</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Nomor</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Klien</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Pekerjaan</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Bidang</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Queue</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Diajukan</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-blue-50">
            {loading ? (
              <tr><td colSpan={8} className="px-6 py-6 text-center text-blue-600">Loading...</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={8} className="px-6 py-6 text-center text-blue-400">Tidak ada item untuk di-approve</td></tr>
            ) : (
              rows.map((r, i) => (
                <tr key={r.id} className={i % 2 === 0 ? "bg-blue-50" : "bg-white"}>
                  <td className="px-4 py-3 text-sm text-blue-900">{i + 1}</td>
                  <td className="px-4 py-3 text-sm text-blue-900">{r.nomor_surat ?? "-"}</td>
                  <td className="px-4 py-3 text-sm text-blue-900">{r.proyek?.klien ?? "-"}</td>
                  <td className="px-4 py-3 text-sm text-blue-900 max-w-[300px] truncate" title={r.proyek?.namaProyek ?? "-"}>{r.proyek?.namaProyek ?? "-"}</td>
                  <td className="px-4 py-3 text-sm text-blue-900">{r.bidang_pekerjaan ?? "-"}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800">
                      {r.queue.replace("MENUNGGU_", "").toLowerCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-blue-900">{fmt(r.createdAt)}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/dashboard/admin/monitoring/${r.id}`}
                        className="p-2 text-blue-700 hover:bg-blue-100 rounded-lg transition"
                        title="Lihat detail"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        disabled={submitting === r.id}
                        onClick={() => approve(r.id)}
                        className="inline-flex items-center px-3 py-1.5 rounded bg-green-600 text-white text-xs font-bold hover:bg-green-700 disabled:opacity-50"
                        title="Approve"
                      >
                        <Check className="w-4 h-4 mr-1" /> Approve
                      </button>
                      <button
                        disabled={submitting === r.id}
                        onClick={() => reject(r.id)}
                        className="inline-flex items-center px-3 py-1.5 rounded bg-red-600 text-white text-xs font-bold hover:bg-red-700 disabled:opacity-50"
                        title="Tolak"
                      >
                        <X className="w-4 h-4 mr-1" /> Tolak
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
