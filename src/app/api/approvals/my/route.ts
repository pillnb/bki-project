import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import {
  KOOR_JABATAN_BY_BIDANG,
  JABATAN_SM,
  JABATAN_KACAB,
} from "@/lib/approval/constants";

export const runtime = "nodejs"; // Prisma butuh Node
export const dynamic = "force-dynamic"; // jangan pernah di-SSG

async function getCurrentPegawai() {
  const cookieStore = await cookies();
  const nik = cookieStore.get("nik")?.value;
  if (!nik) return null;
  return prisma.pegawai.findFirst({
    where: { nik },
    select: {
      id: true,
      nup: true,
      nama_pegawai: true,
      jabatan: true,
      role: true,
    },
  });
}

export async function GET() {
  try {
    const me = await getCurrentPegawai();
    if (!me) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const menungguLead = await prisma.suratTugas.findMany({
      where: {
        status: "MENUNGGU_LEAD",
        leadInspectorId: me.id,
      },
      include: {
        proyek: true,
        leadInspector: { select: { nama_pegawai: true, nup: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const menungguKoor = await prisma.suratTugas.findMany({
      where: {
        status: "MENUNGGU_KOORDINATOR",
        OR: [
          { koordinatorId: me.id },
          {
            AND: [
              { koordinatorId: null },
              {
                OR: [
                  { bidang_pekerjaan: "Energi" },
                  { bidang_pekerjaan: "Industri" },
                  { bidang_pekerjaan: "Marine" },
                ],
              },
            ],
          },
        ],
      },
      include: { proyek: true },
      orderBy: { createdAt: "desc" },
    });

    const menungguSm = await prisma.suratTugas.findMany({
      where: {
        status: "MENUNGGU_SM",
        OR: [{ seniorManagerId: me.id }, { AND: [{ seniorManagerId: null }] }],
      },
      include: { proyek: true },
      orderBy: { createdAt: "desc" },
    });

    const menungguKacab = await prisma.suratTugas.findMany({
      where: {
        status: "MENUNGGU_KACAB",
        OR: [{ kepalaCabangId: me.id }, { AND: [{ kepalaCabangId: null }] }],
      },
      include: { proyek: true },
      orderBy: { createdAt: "desc" },
    });

    const isKoorEnergi = me.jabatan === KOOR_JABATAN_BY_BIDANG.Energi;
    const isKoorIndustri = me.jabatan === KOOR_JABATAN_BY_BIDANG.Industri;
    const isKoorMarine = me.jabatan === KOOR_JABATAN_BY_BIDANG.Marine;

    const menungguKoorFiltered = menungguKoor.filter((s) => {
      if (s.koordinatorId && s.koordinatorId === me.id) return true;
      if (!s.koordinatorId) {
        if (s.bidang_pekerjaan === "Energi" && isKoorEnergi) return true;
        if (s.bidang_pekerjaan === "Industri" && isKoorIndustri) return true;
        if (s.bidang_pekerjaan === "Marine" && isKoorMarine) return true;
      }
      return false;
    });

    const isSM = me.jabatan === JABATAN_SM;
    const isKACAB = me.jabatan === JABATAN_KACAB;

    const menungguSmFiltered = menungguSm.filter((s) => {
      if (s.seniorManagerId && s.seniorManagerId === me.id) return true;
      if (!s.seniorManagerId && isSM) return true;
      return false;
    });

    const menungguKacabFiltered = menungguKacab.filter((s) => {
      if (s.kepalaCabangId && s.kepalaCabangId === me.id) return true;
      if (!s.kepalaCabangId && isKACAB) return true;
      return false;
    });

    const result = [
      ...menungguLead.map((x) => ({ queue: "MENUNGGU_LEAD" as const, ...x })),
      ...menungguKoorFiltered.map((x) => ({
        queue: "MENUNGGU_KOORDINATOR" as const,
        ...x,
      })),
      ...menungguSmFiltered.map((x) => ({
        queue: "MENUNGGU_SM" as const,
        ...x,
      })),
      ...menungguKacabFiltered.map((x) => ({
        queue: "MENUNGGU_KACAB" as const,
        ...x,
      })),
    ];

    return NextResponse.json({ data: result });
  } catch (e) {
    console.error("GET /api/approvals/my error:", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
