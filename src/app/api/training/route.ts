// src/app/api/training/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { computeTrainingStatus } from "@/lib/trainingStatus";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Normalisasi string tanggal ke Date (support "YYYY-MM-DD" dan ISO lengkap) */
function toDateOrNull(v: unknown): Date | null {
  if (!v) return null;
  if (v instanceof Date) return isNaN(v.getTime()) ? null : v;
  try {
    const s = String(v);
    const iso = /^\d{4}-\d{2}-\d{2}$/.test(s) ? `${s}T00:00:00.000Z` : s;
    const d = new Date(iso);
    return isNaN(d.getTime()) ? null : d;
  } catch {
    return null;
  }
}

// GET /api/training?nup=123
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const nup = searchParams.get("nup") || undefined;

    const where = nup ? { nup } : {};

    const rows = await prisma.pelatihan.findMany({
      where,
      orderBy: { id_pelatihan: "desc" }, // ganti dari updatedAt -> id_pelatihan
    });

    const data = rows.map((r) => ({
      ...r,
      status: computeTrainingStatus({
        fileUrl: (r as any).file_sertifikat,
        tanggalKadaluarsa: (r as any).masa_berlaku,
      }),
    }));

    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Gagal mengambil data training" }, { status: 500 });
  }
}

// POST /api/training
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const status = computeTrainingStatus({
      fileUrl: body.fileUrl ?? body.file_sertifikat,
      tanggalKadaluarsa: body.tanggalKadaluarsa ?? body.masa_berlaku,
    });

    const saved = await prisma.pelatihan.create({
      data: {
        nup: body.nup,
        nama_pelatihan: body.nama_pelatihan ?? body.nama,
        penyelenggara: body.penyelenggara,
        tanggal_awal: toDateOrNull(body.tanggal_awal ?? body.tanggalMulai),
        tanggal_akhir: toDateOrNull(
          body.tanggal_akhir ?? body.tanggalSelesaiAktual ?? body.tanggalSelesaiEstimasi
        ),
        masa_berlaku: toDateOrNull(body.masa_berlaku ?? body.tanggalKadaluarsa),
        tahun: body.tahun ? Number(body.tahun) : null,
        nomor_sertifikat: body.nomor_sertifikat ?? body.noSertifikat ?? null,
        file_sertifikat: body.file_sertifikat ?? body.fileUrl ?? null,
        status,
      },
    });

    return NextResponse.json(saved);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Create training gagal" }, { status: 500 });
  }
}

// PATCH /api/training
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const id =
      Number(body.id) ||
      Number(body.id_pelatihan) ||
      Number(body.where?.id) ||
      Number(body.where?.id_pelatihan);

    if (!id) return NextResponse.json({ error: "id tidak valid" }, { status: 400 });

    const data = body.data ?? body;

    const status = computeTrainingStatus({
      fileUrl: data.fileUrl ?? data.file_sertifikat,
      tanggalKadaluarsa: data.tanggalKadaluarsa ?? data.masa_berlaku,
    });

    const updated = await prisma.pelatihan.update({
      where: { id_pelatihan: id },
      data: {
        nama_pelatihan: data.nama_pelatihan ?? data.nama,
        penyelenggara: data.penyelenggara,
        tanggal_awal: toDateOrNull(data.tanggal_awal ?? data.tanggalMulai) ?? undefined,
        tanggal_akhir:
          toDateOrNull(data.tanggal_akhir ?? data.tanggalSelesaiAktual ?? data.tanggalSelesaiEstimasi) ??
          undefined,
        masa_berlaku: toDateOrNull(data.masa_berlaku ?? data.tanggalKadaluarsa) ?? undefined,
        tahun: data.tahun !== undefined && data.tahun !== null ? Number(data.tahun) : undefined,
        nomor_sertifikat: data.nomor_sertifikat ?? data.noSertifikat,
        file_sertifikat: data.file_sertifikat ?? data.fileUrl,
        status,
      },
    });

    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Update training gagal" }, { status: 500 });
  }
}

// DELETE /api/training?id=123
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));
    if (!id) return NextResponse.json({ error: "id tidak valid" }, { status: 400 });

    await prisma.pelatihan.delete({ where: { id_pelatihan: id } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Hapus training gagal" }, { status: 500 });
  }
}