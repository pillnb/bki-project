import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { KOOR_JABATAN_BY_BIDANG, JABATAN_SM, JABATAN_KACAB } from "@/lib/approval/constants";

// ambil user dari cookie kamu sendiri; sesuaikan dengan cara auth kamu.
// misal kamu punya cookie "nik" lalu get pegawai by nik:
async function getCurrentPegawai() {
  const cookieStore = await cookies();
  const nik = cookieStore.get("nik")?.value;
  if (!nik) return null;
  const peg = await prisma.pegawai.findFirst({
    where: { nik },
    select: { id: true, nup: true, nama_pegawai: true, jabatan: true, role: true },
  });
  return peg;
}

export async function GET() {
  try {
    const me = await getCurrentPegawai();
    if (!me) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // cari semua surat yang “menunggu” dan relevan dengan jabatan user
    const menungguLead = await prisma.suratTugas.findMany({
      where: {
        status: "MENUNGGU_LEAD",
        // lead harus spesifik ke pegawai yang jadi leadInspector
        leadInspectorId: me.id,
      },
      include: {
        proyek: true,
        leadInspector: { select: { nama_pegawai: true, nup: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    // koordinator: dua skenario
    // 1) koordinatorId sudah ditetapkan → harus sama dengan user.id
    // 2) koordinatorId null → jabatan user harus cocok dengan bidang surat
    const menungguKoor = await prisma.suratTugas.findMany({
      where: {
        status: "MENUNGGU_KOORDINATOR",
        OR: [
          { koordinatorId: me.id },
          {
            AND: [
              { koordinatorId: null },
              {
                // bidang_pekerjaan ada di surat; cocokkan dgn jabatan
                OR: [
                  { bidang_pekerjaan: "Energi",  // jabatan harus Koor Energi
                    // Prisma gak bisa baca me.jabatan di level ini, jadi pakai filter pasca-query di js (lihat bawah)
                  },
                  { bidang_pekerjaan: "Industri" },
                  { bidang_pekerjaan: "Marine" },
                ],
              },
            ],
          },
        ],
      },
      include: {
        proyek: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // SM
    const menungguSm = await prisma.suratTugas.findMany({
      where: {
        status: "MENUNGGU_SM",
        OR: [
          { seniorManagerId: me.id },
          // kalau belum ditetapkan, boleh tampil untuk siapapun yg menjabat SM
          { AND: [{ seniorManagerId: null }] },
        ],
      },
      include: { proyek: true },
      orderBy: { createdAt: "desc" },
    });

    // Kacab
    const menungguKacab = await prisma.suratTugas.findMany({
      where: {
        status: "MENUNGGU_KACAB",
        OR: [
          { kepalaCabangId: me.id },
          { AND: [{ kepalaCabangId: null }] },
        ],
      },
      include: { proyek: true },
      orderBy: { createdAt: "desc" },
    });

    // filter lagi di JS untuk kasus koordinatorId null → jabatan harus match bidang
    const isKoorEnergi   = me.jabatan === KOOR_JABATAN_BY_BIDANG.Energi;
    const isKoorIndustri = me.jabatan === KOOR_JABATAN_BY_BIDANG.Industri;
    const isKoorMarine   = me.jabatan === KOOR_JABATAN_BY_BIDANG.Marine;

    const menungguKoorFiltered = menungguKoor.filter((s) => {
      if (s.koordinatorId && s.koordinatorId === me.id) return true;
      if (!s.koordinatorId) {
        if (s.bidang_pekerjaan === "Energi" && isKoorEnergi) return true;
        if (s.bidang_pekerjaan === "Industri" && isKoorIndustri) return true;
        if (s.bidang_pekerjaan === "Marine" && isKoorMarine) return true;
      }
      return false;
    });

    // SM/Kacab: bila id belum ditetapkan, pastikan jabatan user sesuai
    const isSM   = me.jabatan === JABATAN_SM;
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

    // bundle jadi satu list dengan “queue” penandanya
    const result = [
      ...menungguLead.map((x) => ({ queue: "MENUNGGU_LEAD", ...x })),
      ...menungguKoorFiltered.map((x) => ({ queue: "MENUNGGU_KOORDINATOR", ...x })),
      ...menungguSmFiltered.map((x) => ({ queue: "MENUNGGU_SM", ...x })),
      ...menungguKacabFiltered.map((x) => ({ queue: "MENUNGGU_KACAB", ...x })),
    ];

    return NextResponse.json({ data: result });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}