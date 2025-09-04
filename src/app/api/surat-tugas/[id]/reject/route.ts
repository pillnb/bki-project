import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { KOOR_JABATAN_BY_BIDANG, JABATAN_SM, JABATAN_KACAB } from "@/lib/approval/constants";

async function getCurrentPegawai() {
  const cookieStore = await cookies();
  const nik = cookieStore.get("nik")?.value;
  if (!nik) return null;
  return prisma.pegawai.findFirst({
    where: { nik },
    select: { id: true, jabatan: true },
  });
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const me = await getCurrentPegawai();
    if (!me) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { reason } = await req.json().catch(() => ({}));
    if (!reason) return NextResponse.json({ error: "Reason required" }, { status: 400 });

    const surat = await prisma.suratTugas.findUnique({
      where: { id: Number(params.id) },
      select: { id: true, status: true, bidang_pekerjaan: true, leadInspectorId: true, koordinatorId: true, seniorManagerId: true, kepalaCabangId: true }
    });
    if (!surat) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const can =
      (surat.status === "MENUNGGU_LEAD"        && surat.leadInspectorId === me.id) ||
      (surat.status === "MENUNGGU_KOORDINATOR" &&
        (
          surat.koordinatorId === me.id ||
          (!surat.koordinatorId && (
            (surat.bidang_pekerjaan === "Energi"   && me.jabatan === KOOR_JABATAN_BY_BIDANG.Energi) ||
            (surat.bidang_pekerjaan === "Industri" && me.jabatan === KOOR_JABATAN_BY_BIDANG.Industri) ||
            (surat.bidang_pekerjaan === "Marine"   && me.jabatan === KOOR_JABATAN_BY_BIDANG.Marine)
          ))
        )
      ) ||
      (surat.status === "MENUNGGU_SM"           && (surat.seniorManagerId === me.id || me.jabatan === JABATAN_SM)) ||
      (surat.status === "MENUNGGU_KACAB"        && (surat.kepalaCabangId  === me.id || me.jabatan === JABATAN_KACAB));

    if (!can) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const updated = await prisma.suratTugas.update({
      where: { id: surat.id },
      data: {
        status: "DITOLAK",
        catatanPenolakan: String(reason),
      },
    });

    return NextResponse.json({ data: updated });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}