"use client";

import { useEffect, useMemo, useState } from "react";
import { X, Pencil, Save, Loader2 } from "lucide-react";
import StatusPill, { type StatusSurat } from "./StatusPill";
import { fmt, normalizeStatus } from "./utils";

export type SuratDetail = {
  id: number;
  nomor_surat: string | null;
  proyek?: { klien?: string | null; namaProyek?: string | null; lokasi?: string | null } | null;
  klien?: string | null;
  pekerjaan?: string | null;
  status: StatusSurat | string | null;
  leadInspector?:
    | { nup?: string | null; nama_pegawai?: string | null }
    | string
    | null;
  timInspektor?: Array<{ nup?: string | null; nama_pegawai?: string | null }> | null;

  // tanggal
  createdAt?: string | null;
  tanggal_berangkat?: string | null;
  tanggal_kembali?: string | null;

  // list
  peralatan_inspeksi?: string[];
  kebutuhan_material?: string[];

  // flags transport
  transportasi_operasional?: boolean;
  transportasi_ditanggung_klien?: boolean;
  transportasi_asal_tujuan?: boolean;
  transportasi_dinas?: boolean;
  tiket?: boolean;
  penginapan?: boolean;

  keterangan_lain?: string | null;
  catatanPenolakan?: string | null;
};

type Props = {
  open: boolean;
  onClose: () => void;
  surat?: SuratDetail | null;
  onSaved?: (updated: SuratDetail) => void;
  canEdit?: boolean;
  extraSections?: React.ReactNode;

};

function toInputDate(v?: string | null) {
  if (!v) return "";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

// textarea <-> string[]
function parseList(s: string): string[] {
  return s
    .split(/[\n,]/g)
    .map((x) => x.trim())
    .filter(Boolean);
}
function joinList(arr?: string[]) {
  if (!arr || arr.length === 0) return "";
  return arr.join("\n");
}

export default function SuratDetailModal({
  open,
  onClose,
  surat,
  onSaved,
  canEdit = true,
  extraSections
}: Props) {
  const [edit, setEdit] = useState(false);
  const [saving, setSaving] = useState(false);

  // form state
  const [nomorSurat, setNomorSurat] = useState("");
  const [klien, setKlien] = useState("");
  const [pekerjaan, setPekerjaan] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [status, setStatus] = useState<StatusSurat>("DRAFT");
  const [tglBerangkat, setTglBerangkat] = useState("");
  const [tglKembali, setTglKembali] = useState("");
  const [peralatan, setPeralatan] = useState("");
  const [material, setMaterial] = useState("");
  const [ketLain, setKetLain] = useState("");
  const [flags, setFlags] = useState({
    transportasi_operasional: false,
    transportasi_ditanggung_klien: false,
    transportasi_asal_tujuan: false,
    transportasi_dinas: false,
    tiket: false,
    penginapan: false,
  });

  const leadText = useMemo(() => {
    const lead = surat?.leadInspector;
    if (!lead) return "-";
    if (typeof lead === "string") return lead;
    return lead.nama_pegawai || lead.nup || "-";
  }, [surat]);

  useEffect(() => {
    if (!open || !surat) return;
    setEdit(false);
    setNomorSurat(surat.nomor_surat || "");
    setKlien(surat.proyek?.klien || surat.klien || "");
    setPekerjaan(surat.proyek?.namaProyek || surat.pekerjaan || "");
    setLokasi(surat.proyek?.lokasi || "");
    setStatus(normalizeStatus(surat.status));
    setTglBerangkat(toInputDate(surat.tanggal_berangkat));
    setTglKembali(toInputDate(surat.tanggal_kembali));
    setPeralatan(joinList(surat.peralatan_inspeksi));
    setMaterial(joinList(surat.kebutuhan_material));
    setKetLain(surat.keterangan_lain || "");
    setFlags({
      transportasi_operasional: !!surat.transportasi_operasional,
      transportasi_ditanggung_klien: !!surat.transportasi_ditanggung_klien,
      transportasi_asal_tujuan: !!surat.transportasi_asal_tujuan,
      transportasi_dinas: !!surat.transportasi_dinas,
      tiket: !!surat.tiket,
      penginapan: !!surat.penginapan,
    });
  }, [open, surat]);

  if (!open || !surat) return null;

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = {
        nomor_surat: nomorSurat || null,
        klien,
        pekerjaan,
        lokasi,
        status,
        tanggal_berangkat: tglBerangkat || null,
        tanggal_kembali: tglKembali || null,
        peralatan_inspeksi: parseList(peralatan),
        kebutuhan_material: parseList(material),
        keterangan_lain: ketLain || null,
        ...flags,
      };

      const res = await fetch(`/api/surat-tugas/${surat.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        let msg = "Gagal menyimpan perubahan";
        try {
          const j = await res.json();
          msg = j?.error || msg;
        } catch {}
        throw new Error(msg);
      }
      const updated = (await res.json()) as {
        nomor_surat?: string;
        proyek?: unknown;
        klien?: string;
        pekerjaan?: string;
        lokasi?: string;
        status?: string;
        tanggal_berangkat?: string;
        tanggal_kembali?: string;
        peralatan_inspeksi?: string[];
        kebutuhan_material?: string[];
        keterangan_lain?: string;
        transportasi_operasional?: boolean;
        transportasi_ditanggung_klien?: boolean;
        transportasi_asal_tujuan?: boolean;
        transportasi_dinas?: boolean;
        tiket?: boolean;
        penginapan?: boolean;
      };

      const merged: SuratDetail = {
        ...surat,
        nomor_surat: updated?.nomor_surat ?? nomorSurat,
        proyek: updated?.proyek ?? surat.proyek,
        klien: updated?.klien ?? klien,
        pekerjaan: updated?.pekerjaan ?? pekerjaan,
        status: normalizeStatus(updated?.status ?? status),
        tanggal_berangkat: updated?.tanggal_berangkat ?? (tglBerangkat || null),
        tanggal_kembali: updated?.tanggal_kembali ?? (tglKembali || null),
        peralatan_inspeksi: updated?.peralatan_inspeksi ?? parseList(peralatan),
        kebutuhan_material: updated?.kebutuhan_material ?? parseList(material),
        keterangan_lain: updated?.keterangan_lain ?? (ketLain || null),
        transportasi_operasional:
          updated?.transportasi_operasional ?? flags.transportasi_operasional,
        transportasi_ditanggung_klien:
          updated?.transportasi_ditanggung_klien ?? flags.transportasi_ditanggung_klien,
        transportasi_asal_tujuan:
          updated?.transportasi_asal_tujuan ?? flags.transportasi_asal_tujuan,
        transportasi_dinas: updated?.transportasi_dinas ?? flags.transportasi_dinas,
        tiket: updated?.tiket ?? flags.tiket,
        penginapan: updated?.penginapan ?? flags.penginapan,
      };

      onSaved?.(merged);
      setEdit(false);
    } catch (e: unknown) {
      alert((e as Error)?.message || "Gagal menyimpan perubahan");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-xl flex flex-col max-h-[90vh]">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white/90 backdrop-blur px-5 py-4 rounded-t-2xl">
          <div>
            <div className="text-xs font-semibold text-blue-500">Detail Surat Tugas</div>
            <div className="text-lg font-bold text-blue-900">
              {surat.nomor_surat || "(Belum bernomor)"}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusPill status={normalizeStatus(surat.status)} />
            {canEdit && !edit && (
              <button
                onClick={() => setEdit(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-900 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-800"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </button>
            )}
            {canEdit && edit && (
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Simpan
              </button>
            )}
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-blue-900 hover:bg-blue-50"
              aria-label="Tutup"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="grid gap-6 px-5 py-5 md:grid-cols-2">
            {/* kiri */}
            <div className="space-y-3">
              <Labeled label="Nomor Surat">
                {edit ? (
                  <input
                    value={nomorSurat}
                    onChange={(e) => setNomorSurat(e.target.value)}
                    className="w-full rounded-lg border border-blue-200 px-3 py-2 text-blue-900 outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder="CTH: 012/ST/BKI/2025"
                  />
                ) : (
                  <Value>{surat.nomor_surat || "-"}</Value>
                )}
              </Labeled>

              <Labeled label="Klien">
                {edit ? (
                  <input
                    value={klien}
                    onChange={(e) => setKlien(e.target.value)}
                    className="w-full rounded-lg border border-blue-200 px-3 py-2 text-blue-900 outline-none focus:ring-2 focus:ring-blue-300"
                  />
                ) : (
                  <Value>{surat.proyek?.klien || surat.klien || "-"}</Value>
                )}
              </Labeled>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Labeled label="Pekerjaan">
                  {edit ? (
                    <input
                      value={pekerjaan}
                      onChange={(e) => setPekerjaan(e.target.value)}
                      className="w-full rounded-lg border border-blue-200 px-3 py-2 text-blue-900 outline-none focus:ring-2 focus:ring-blue-300"
                    />
                  ) : (
                    <Value>{surat.proyek?.namaProyek || surat.pekerjaan || "-"}</Value>
                  )}
                </Labeled>

                <Labeled label="Lokasi Pekerjaan">
                  {edit ? (
                    <input
                      value={lokasi}
                      onChange={(e) => setLokasi(e.target.value)}
                      className="w-full rounded-lg border border-blue-200 px-3 py-2 text-blue-900 outline-none focus:ring-2 focus:ring-blue-300"
                      placeholder="Lokasi pengerjaan proyek"
                    />
                  ) : (
                    <Value>{surat.proyek?.lokasi || "-"}</Value>
                  )}
                </Labeled>
              </div>

              <Labeled label="Lead Inspector">
                <Value>
                  {leadText}
                  {surat.timInspektor && surat.timInspektor.length > 0 && (
                    <span className="ml-1 text-xs text-blue-400">
                      (+{surat.timInspektor.length} anggota)
                    </span>
                  )}
                </Value>
              </Labeled>

              <Labeled label="Diajukan">
                <Value>{fmt(surat.createdAt)}</Value>
              </Labeled>
            </div>

            {/* kanan */}
            <div className="space-y-3">
              <Labeled label="Tanggal Berangkat">
                {edit ? (
                  <input
                    type="date"
                    value={tglBerangkat}
                    onChange={(e) => setTglBerangkat(e.target.value)}
                    className="w-full rounded-lg border border-blue-200 px-3 py-2 text-blue-900 outline-none focus:ring-2 focus:ring-blue-300"
                  />
                ) : (
                  <Value>{fmt(surat.tanggal_berangkat)}</Value>
                )}
              </Labeled>

              <Labeled label="Tanggal Kembali">
                {edit ? (
                  <input
                    type="date"
                    value={tglKembali}
                    onChange={(e) => setTglKembali(e.target.value)}
                    className="w-full rounded-lg border border-blue-200 px-3 py-2 text-blue-900 outline-none focus:ring-2 focus:ring-blue-300"
                  />
                ) : (
                  <Value>{fmt(surat.tanggal_kembali)}</Value>
                )}
              </Labeled>

              <Labeled label="Status">
                {edit ? (
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as StatusSurat)}
                    className="w-full rounded-lg border border-blue-200 px-3 py-2 text-blue-900 outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    {[
                      "DRAFT",
                      "MENUNGGU_LEAD",
                      "MENUNGGU_KOORDINATOR",
                      "MENUNGGU_SM",
                      "MENUNGGU_KACAB",
                      "DISETUJUI",
                      "BERJALAN",
                      "SELESAI",
                      "DITOLAK",
                    ].map((s) => (
                      <option key={s} value={s}>
                        {s.replaceAll("_", " ")}
                      </option>
                    ))}
                  </select>
                ) : (
                  <StatusPill status={normalizeStatus(surat.status)} />
                )}
              </Labeled>
            </div>
          </div>

          <div className="grid gap-6 px-5 pb-6 md:grid-cols-2">
            <Labeled label="Peralatan Inspeksi">
              {edit ? (
                <textarea
                  rows={5}
                  value={peralatan}
                  onChange={(e) => setPeralatan(e.target.value)}
                  className="w-full rounded-lg border border-blue-200 px-3 py-2 text-blue-900 outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="Pisahkan baris per item (atau koma)."
                />
              ) : (
                <ul className="list-disc pl-5 text-sm text-blue-900">
                  {(surat.peralatan_inspeksi || []).length === 0 ? (
                    <li className="text-blue-400">(kosong)</li>
                  ) : (
                    surat.peralatan_inspeksi!.map((x, i) => <li key={i}>{x}</li>)
                  )}
                </ul>
              )}
            </Labeled>

            <Labeled label="Kebutuhan Material">
              {edit ? (
                <textarea
                  rows={5}
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  className="w-full rounded-lg border border-blue-200 px-3 py-2 text-blue-900 outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="Pisahkan baris per item (atau koma)."
                />
              ) : (
                <ul className="list-disc pl-5 text-sm text-blue-900">
                  {(surat.kebutuhan_material || []).length === 0 ? (
                    <li className="text-blue-400">(kosong)</li>
                  ) : (
                    surat.kebutuhan_material!.map((x, i) => <li key={i}>{x}</li>)
                  )}
                </ul>
              )}
            </Labeled>

            <Labeled label="Fasilitas / Transport">
              <div className="grid grid-cols-2 gap-2 text-sm">
                {(
                  [
                    ["Transport Operasional", "transportasi_operasional"],
                    ["Ditanggung Klien", "transportasi_ditanggung_klien"],
                    ["Asal ↔ Tujuan", "transportasi_asal_tujuan"],
                    ["Transport Dinas", "transportasi_dinas"],
                    ["Tiket", "tiket"],
                    ["Penginapan", "penginapan"],
                  ] as const
                ).map(([label, key]) => (
                  <label key={key} className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      disabled={!edit}
                      checked={flags[key]}
                      onChange={(e) => setFlags((p) => ({ ...p, [key]: e.target.checked }))}
                      className="h-4 w-4 accent-blue-700"
                    />
                    <span className="text-blue-900">{label}</span>
                  </label>
                ))}
              </div>
            </Labeled>

            <Labeled label="Keterangan Lain">
              {edit ? (
                <textarea
                  rows={5}
                  value={ketLain}
                  onChange={(e) => setKetLain(e.target.value)}
                  className="w-full rounded-lg border border-blue-200 px-3 py-2 text-blue-900 outline-none focus:ring-2 focus:ring-blue-300"
                />
              ) : (
                <p className="text-sm text-blue-900">{surat.keterangan_lain || "-"}</p>
              )}
            </Labeled>
          </div>
          {extraSections}
        </div>
      </div>
    </div>
  );
}

function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-blue-900">
        {label}
      </div>
      {children}
    </div>
  );
}

function Value({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-900">
      {children}
    </div>
  );
}