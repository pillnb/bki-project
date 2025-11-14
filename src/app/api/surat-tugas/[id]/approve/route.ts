import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { KOOR_JABATAN_BY_BIDANG, JABATAN_SM, JABATAN_KACAB } from "@/lib/approval/constants";

type Status =
  | "DRAFT"
  | "MENUNGGU_LEAD"
  | "MENUNGGU_KOORDINATOR"
  | "MENUNGGU_SM"
  | "MENUNGGU_KACAB"
  | "DISETUJUI"
  | "SELESAI"
  | "DITOLAK";

async function getCurrentPegawai() {
  // di Next 14 cookies() sync, di 15 boleh di-await; dua-duanya jalan
  const jar = await cookies();
  const nik = jar.get("nik")?.value; // pastikan COOKIE INI ADA
  if (!nik) return null;

  const me = await prisma.pegawai.findFirst({
    where: { nik },
    select: { id: true, nik: true, nup: true, jabatan: true, nama_pegawai: true },
  });
  return me;
}

function computeNextStatus(s: Status): Status | null {
  switch (s) {
    case "MENUNGGU_LEAD": return "MENUNGGU_KOORDINATOR";
    case "MENUNGGU_KOORDINATOR": return "MENUNGGU_SM";
    case "MENUNGGU_SM": return "MENUNGGU_KACAB";
    case "MENUNGGU_KACAB": return "DISETUJUI";
    // final states tidak bisa “approve” lagi
    case "DISETUJUI":
    case "SELESAI":
    case "DITOLAK":
    case "DRAFT":
    default:
      return null;
  }
}

function canApprove(params: {
  status: Status;
  bidang?: string | null;
  leadInspectorId?: number | null;
  koordinatorId?: number | null;
  seniorManagerId?: number | null;
  kepalaCabangId?: number | null;
}, me: { id: number; jabatan: string | null }) {

  const { status, bidang, leadInspectorId, koordinatorId, seniorManagerId, kepalaCabangId } = params;

  if (status === "MENUNGGU_LEAD") {
    return leadInspectorId === me.id;
  }

  if (status === "MENUNGGU_KOORDINATOR") {
    // explicit koor OR fallback by jabatan-bidang mapping
    if (koordinatorId && koordinatorId === me.id) return true;
    if (!koordinatorId && bidang) {
      const need = KOOR_JABATAN_BY_BIDANG[bidang as keyof typeof KOOR_JABATAN_BY_BIDANG];
      return !!need && me.jabatan === need;
    }
    return false;
  }

  if (status === "MENUNGGU_SM") {
    return (seniorManagerId && seniorManagerId === me.id) || (!seniorManagerId && me.jabatan === JABATAN_SM);
  }

  if (status === "MENUNGGU_KACAB") {
    return (kepalaCabangId && kepalaCabangId === me.id) || (!kepalaCabangId && me.jabatan === JABATAN_KACAB);
  }

  return false;
}

export async function POST(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const params = await ctx.params;

  try {
    // 0) auth
    const me = await getCurrentPegawai();
    if (!me) {
      console.log("[approve] 401 no cookie/pegawai");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1) validate id
    const idNum = Number(params.id);
    if (!Number.isFinite(idNum)) {
      console.log("[approve] 400 invalid id:", params.id);
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    // 2) load surat
    const surat = await prisma.suratTugas.findUnique({
      where: { id: idNum },
      select: {
        id: true,
        status: true,
        bidang_pekerjaan: true,
        leadInspectorId: true,
        koordinatorId: true,
        seniorManagerId: true,
        kepalaCabangId: true,
      },
    });

    if (!surat) {
      console.log("[approve] 404, id:", idNum);
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    console.log("[approve] me:", { id: me.id, nik: me.nik, nup: me.nup, jabatan: me.jabatan });
    console.log("[approve] surat:", surat);

    // 3) final states guard
    if (["DISETUJUI", "SELESAI", "DITOLAK"].includes(surat.status)) {
      console.log("[approve] 409 already final:", surat.status);
      return NextResponse.json({ error: "Status final, tidak bisa approve." }, { status: 409 });
    }

    // 4) authorization
    const allowed = canApprove(
      {
        status: surat.status as Status,
        bidang: surat.bidang_pekerjaan,
        leadInspectorId: surat.leadInspectorId,
        koordinatorId: surat.koordinatorId,
        seniorManagerId: surat.seniorManagerId,
        kepalaCabangId: surat.kepalaCabangId,
      },
      { id: me.id, jabatan: me.jabatan }
    );

    if (!allowed) {
      console.log("[approve] 403 forbidden for user:", me.id, "at status:", surat.status);
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 5) next status
    const next = computeNextStatus(surat.status as Status);
    if (!next) {
      console.log("[approve] 409 no next status for:", surat.status);
      return NextResponse.json({ error: "Status tidak valid untuk approve" }, { status: 409 });
    }

    // 6) stamping fields
    const stamp: Record<string, any> = {};
    if (surat.status === "MENUNGGU_LEAD") stamp.disetujuiLeadAt = new Date();
    if (surat.status === "MENUNGGU_KOORDINATOR") stamp.disetujuiKoorAt = new Date();
    if (surat.status === "MENUNGGU_SM") stamp.disetujuiSmAt = new Date();
    if (surat.status === "MENUNGGU_KACAB") stamp.disetujuiKacabAt = new Date();

    // Jangan asal overwrite penanda jabatan. Kalau mau auto-assign, lakukan hanya ketika null.
    // (Di kode lama kamu sempat set koordinatorId jadi me.id saat approve LEAD, itu bikin data “nyeleneh”.)
    // Contoh: biarkan ID role tetap seperti input awal; kalau bisnis menghendaki auto-assign, baru isi saat null.
    if (surat.status === "MENUNGGU_LEAD" && surat.koordinatorId == null) {
      // biarkan kosong, atau isi kalau kamu memang ingin auto-route:
      // stamp.koordinatorId = me.id;
    }
    if (surat.status === "MENUNGGU_KOORDINATOR" && surat.seniorManagerId == null) {
      // stamp.seniorManagerId = me.id; // kalau mau auto-assign
    }
    if (surat.status === "MENUNGGU_SM" && surat.kepalaCabangId == null) {
      // stamp.kepalaCabangId = me.id; // kalau mau auto-assign
    }

    // 7) update
    const updated = await prisma.suratTugas.update({
      where: { id: surat.id },
      data: { status: next, ...stamp },
    });

    console.log("[approve] OK ->", next, "id:", surat.id);
    return NextResponse.json({ data: updated });
  } catch (err) {
    console.error("[approve] 500 error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
