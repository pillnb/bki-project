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

function nextStatus(s: string) {
  switch (s) {
    case "MENUNGGU_LEAD": return "MENUNGGU_KOORDINATOR";
    case "MENUNGGU_KOORDINATOR": return "MENUNGGU_SM";
    case "MENUNGGU_SM": return "MENUNGGU_KACAB";
    case "MENUNGGU_KACAB": return "DISETUJUI";
    default: return s;
  }
}

export async function POST(_: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const me = await getCurrentPegawai();
    if (!me) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const surat = await prisma.suratTugas.findUnique({
      where: { id: Number(params.id) },
      select: {
        id: true, status: true, bidang_pekerjaan: true,
        leadInspectorId: true, koordinatorId: true, seniorManagerId: true, kepalaCabangId: true,
      }
    });
    if (!surat) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // authorization by jabatan
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
      (surat.status === "MENUNGGU_SM"           && (surat.seniorManagerId === me.id || (!surat.seniorManagerId && me.jabatan === JABATAN_SM))) ||
      (surat.status === "MENUNGGU_KACAB"        && (surat.kepalaCabangId  === me.id || (!surat.kepalaCabangId  && me.jabatan === JABATAN_KACAB)));

    if (!can) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const next = nextStatus(surat.status);
    const stampField =
      surat.status === "MENUNGGU_LEAD"        ? { disetujuiLeadAt: new Date(),     koordinatorId: surat.koordinatorId ?? me.id } :
      surat.status === "MENUNGGU_KOORDINATOR" ? { disetujuiKoorAt: new Date(),     seniorManagerId: surat.seniorManagerId ?? undefined } :
      surat.status === "MENUNGGU_SM"          ? { disetujuiSmAt: new Date(),       kepalaCabangId: surat.kepalaCabangId ?? undefined } :
      surat.status === "MENUNGGU_KACAB"       ? { disetujuiKacabAt: new Date() } :
      {};

    const updated = await prisma.suratTugas.update({
      where: { id: surat.id },
      data: {
        status: next as "MENUNGGU_LEAD" | "MENUNGGU_KOORDINATOR" | "MENUNGGU_SM" | "MENUNGGU_KACAB" | "DISETUJUI" | "SELESAI",
        ...stampField,
      },
    });

    return NextResponse.json({ data: updated });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}