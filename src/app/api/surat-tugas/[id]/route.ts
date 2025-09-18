// src/app/api/surat-tugas/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

function toDate(v: unknown): Date | null {
  if (!v) return null;
  const d = new Date(String(v));
  return isNaN(d.getTime()) ? null : d;
}
function toStringArray(v: unknown): string[] | undefined {
  if (v == null) return undefined;
  if (Array.isArray(v)) return v.map(String).filter(Boolean);
  if (typeof v === "string") return v.split(/[\n,]/g).map(s=>s.trim()).filter(Boolean);
  return undefined;
}

// GET detail lengkap
export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const sid = Number(id);
  if (!sid) return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });

  const data = await prisma.suratTugas.findUnique({
    where: { id: sid },
    include: {
      proyek: true,
      leadInspector: { select: { nup: true, nama_pegawai: true } },
      timInspektor:  { select: { nup: true, nama_pegawai: true } },
      koordinator:   { select: { nup: true, nama_pegawai: true } },
      seniorManager: { select: { nup: true, nama_pegawai: true } },
      kepalaCabang:  { select: { nup: true, nama_pegawai: true } },
    },
  });
  if (!data) return NextResponse.json({ error: "Surat tugas tidak ditemukan" }, { status: 404 });
  return NextResponse.json(data);
}

// PATCH beberapa kolom
export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const sid = Number(id);
  if (!sid) return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });

  const body = await req.json().catch(() => ({}));

  const data: Record<string, unknown> = {
    nomor_surat: body.nomor_surat ?? undefined,
    status: body.status ?? undefined,
    // kolom tambahan sesuai schema
    no_service_order: body.no_service_order ?? undefined,
    bidang_pekerjaan: body.bidang_pekerjaan ?? undefined,
    spi: body.spi ?? undefined,
    wbs: body.wbs ?? undefined,

    tanggal_berangkat:
      body.tanggal_berangkat !== undefined ? toDate(body.tanggal_berangkat) : undefined,
    tanggal_kembali:
      body.tanggal_kembali !== undefined ? toDate(body.tanggal_kembali) : undefined,

    peralatan_inspeksi:   toStringArray(body.peralatan_inspeksi),
    kebutuhan_material:   toStringArray(body.kebutuhan_material),
    keterangan_lain:      body.keterangan_lain ?? undefined,

    transportasi_operasional:
      typeof body.transportasi_operasional === "boolean" ? body.transportasi_operasional : undefined,
    transportasi_ditanggung_klien:
      typeof body.transportasi_ditanggung_klien === "boolean" ? body.transportasi_ditanggung_klien : undefined,
    transportasi_asal_tujuan:
      typeof body.transportasi_asal_tujuan === "boolean" ? body.transportasi_asal_tujuan : undefined,
    transportasi_dinas:
      typeof body.transportasi_dinas === "boolean" ? body.transportasi_dinas : undefined,
    tiket: typeof body.tiket === "boolean" ? body.tiket : undefined,
    penginapan: typeof body.penginapan === "boolean" ? body.penginapan : undefined,
  };

  // update Proyek (klien/namaProyek/lokasi)
  const klien: string | undefined = typeof body.klien === "string" ? body.klien : undefined;
  const namaProyek: string | undefined = typeof body.pekerjaan === "string" ? body.pekerjaan : undefined;
  const lokasi: string | undefined = typeof body.lokasi === "string" ? body.lokasi : undefined;

  const existing = await prisma.suratTugas.findUnique({ where: { id: sid }, select: { proyekId: true } });
  if (!existing) return NextResponse.json({ error: "Surat tugas tidak ditemukan" }, { status: 404 });

  if (klien !== undefined || namaProyek !== undefined || lokasi !== undefined) {
    data.proyek = existing.proyekId
      ? { update: { ...(klien!==undefined?{klien}:{}), ...(namaProyek!==undefined?{namaProyek}:{}), ...(lokasi!==undefined?{lokasi}:{}), } }
      : { create: { klien: klien ?? "", namaProyek: namaProyek ?? "", lokasi: lokasi ?? "" } };
  }

  const updated = await prisma.suratTugas.update({
    where: { id: sid },
    data,
    include: {
      proyek: true,
      leadInspector: { select: { nup: true, nama_pegawai: true } },
      timInspektor:  { select: { nup: true, nama_pegawai: true } },
      koordinator:   { select: { nup: true, nama_pegawai: true } },
      seniorManager: { select: { nup: true, nama_pegawai: true } },
      kepalaCabang:  { select: { nup: true, nama_pegawai: true } },
    },
  });

  return NextResponse.json(updated);
}