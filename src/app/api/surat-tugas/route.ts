// src/app/api/surat-tugas/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ========= helper auth/role =========
type RoleName = "user" | "admin" | "superadmin";

async function getPegawaiAndRole() {
  const cookieStore = await cookies();
  const nik = cookieStore.get("nik")?.value || null;
  const roleFromCookie = (cookieStore.get("role")?.value || "").toLowerCase() as
    | RoleName
    | "";

  if (!nik) return null;

  const pegawai = await prisma.pegawai.findFirst({
    where: { nik },
    select: {
      id: true,
      nup: true,
      nik: true,
      nama_pegawai: true,
      jabatan: true,
      // jika tabel kamu memang punya kolom "role", ikutkan
      role: true as any,
    },
  });
  if (!pegawai) return null;

  const role =
    ((pegawai as any).role?.toLowerCase?.() as RoleName | undefined) ||
    (roleFromCookie as RoleName) ||
    "user";

  return { ...pegawai, role };
}

// ================== POST: Buat Surat Tugas ==================
export async function POST(req: NextRequest) {
  try {
    const me = await getPegawaiAndRole();
    if (!me)
      return NextResponse.json(
        { error: "User tidak terautentikasi." },
        { status: 401 }
      );

    const body = await req.json();

    const {
      nomor_surat,
      klien,
      pekerjaan,
      no_service_order,
      spi,
      wbs,
      bidang_pekerjaan,
      peralatan_inspeksi,
      kebutuhan_material,
      lokasi_pekerjaan,
      tanggal_berangkat,
      tanggal_kembali,
      transportasi_operasional,
      nomor_plat_kendaraan,
      transportasi_ditanggung_klien,
      transportasi_asal_tujuan,
      transportasi_dinas,
      tiket,
      penginapan,
      keterangan_lain,
      pegawaiNupList = body.pegawaiNupList || body.timInspektor,
      leadInspectorNup,
      status,
      cabang_pinjam,
      pihak_ketiga,
    } = body;

    const pegawaiNupList_valid = Array.isArray(pegawaiNupList)
      ? pegawaiNupList.filter(
          (nup: unknown) =>
            nup && typeof nup === "string" && (nup as string).trim() !== ""
        )
      : [];

    if (!klien || !pekerjaan || pegawaiNupList_valid.length === 0) {
      return NextResponse.json(
        {
          error:
            "Klien, Pekerjaan, dan Tim Inspektor tidak boleh kosong.",
        },
        { status: 400 }
      );
    }

    if (!no_service_order && !spi && !wbs) {
      return NextResponse.json(
        {
          error:
            "Salah satu dari No Service Order, SPI, atau WBS harus diisi.",
        },
        { status: 400 }
      );
    }

    // Lead inspector -> id
    let leadInspectorId: number | null = null;
    if (leadInspectorNup) {
      const leadInspectorData = await prisma.pegawai.findUnique({
        where: { nup: leadInspectorNup as string },
        select: { id: true },
      });
      if (leadInspectorData) leadInspectorId = leadInspectorData.id;
    }

    // default SM & Kacab (jika kamu memang ingin set default)
    const [seniorManager, kepalaCabang] = await Promise.all([
      prisma.pegawai.findFirst({
        where: {
          jabatan: { equals: "Senior Manager Operasi", mode: "insensitive" },
        },
        select: { id: true },
      }),
      prisma.pegawai.findFirst({
        where: { jabatan: { equals: "Kepala Cabang", mode: "insensitive" } },
        select: { id: true },
      }),
    ]);

    // proyek by pekerjaan
    let proyek = await prisma.proyek.findFirst({
      where: { namaProyek: pekerjaan },
    });
    if (!proyek) {
      proyek = await prisma.proyek.create({
        data: {
          namaProyek: pekerjaan,
          klien,
          lokasi: lokasi_pekerjaan || "N/A", // lokasi sekarang string
        },
      });
    }

    const newSuratTugas = await prisma.suratTugas.create({
      data: {
        nomor_surat: nomor_surat || null,
        no_service_order: no_service_order || null,
        spi: spi || null,
        wbs: wbs || null,
        bidang_pekerjaan,
        peralatan_inspeksi: Array.isArray(peralatan_inspeksi)
          ? peralatan_inspeksi
          : [],
        kebutuhan_material: Array.isArray(kebutuhan_material)
          ? kebutuhan_material.filter(
              (m: string) => m && m.trim() !== ""
            )
          : [],
        tanggal_berangkat: tanggal_berangkat
          ? new Date(tanggal_berangkat)
          : null,
        tanggal_kembali: tanggal_kembali
          ? new Date(tanggal_kembali)
          : null,
        transportasi_operasional: !!transportasi_operasional,
        nomor_plat_kendaraan: nomor_plat_kendaraan || null,
        transportasi_ditanggung_klien: !!transportasi_ditanggung_klien,
        transportasi_asal_tujuan: !!transportasi_asal_tujuan,
        transportasi_dinas: !!transportasi_dinas,
        tiket: !!tiket,
        penginapan: !!penginapan,
        keterangan_lain,
        status: status || "MENUNGGU_LEAD",
        cabang_pinjam: cabang_pinjam || null,
        pihak_ketiga: pihak_ketiga || null,
        proyekId: proyek.id,
        leadInspectorId,
        seniorManagerId: seniorManager?.id ?? null,
        kepalaCabangId: kepalaCabang?.id ?? null,
        timInspektor: {
          connect: pegawaiNupList_valid.map((nup: string) => ({ nup })),
        },
        // penting: selalu dari user login, JANGAN ambil dari body
        dibuatOlehId: me.id,
      },
    });

    return NextResponse.json(
      { message: "Surat tugas berhasil dibuat!", data: newSuratTugas },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Error saat membuat surat tugas:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}

// ================== PUT: Update (hanya DRAFT) ==================
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updateData } = body;
    if (!id)
      return NextResponse.json(
        { error: "ID surat tugas wajib diisi." },
        { status: 400 }
      );

    const surat = await prisma.suratTugas.findUnique({
      where: { id },
      select: { status: true },
    });
    if (!surat)
      return NextResponse.json(
        { error: "Surat tugas tidak ditemukan." },
        { status: 404 }
      );
    if (surat.status !== "DRAFT") {
      return NextResponse.json(
        { error: "Surat tugas hanya bisa diupdate jika status masih DRAFT." },
        { status: 403 }
      );
    }

    const allowedFields = [
      "nomor_surat",
      "klien",
      "pekerjaan",
      "no_service_order",
      "spi",
      "wbs",
      "bidang_pekerjaan",
      "peralatan_inspeksi",
      "kebutuhan_material",
      "lokasi_pekerjaan",
      "tanggal_berangkat",
      "tanggal_kembali",
      "transportasi_operasional",
      "nomor_plat_kendaraan",
      "transportasi_ditanggung_klien",
      "transportasi_asal_tujuan",
      "transportasi_dinas",
      "tiket",
      "penginapan",
      "keterangan_lain",
      "timInspektor",
      "leadInspectorNup",
      "cabang_pinjam",
      "pihak_ketiga",
    ] as const;

    const dataToUpdate: Record<string, any> = {};
    for (const key of allowedFields) {
      if (key in updateData) dataToUpdate[key] = updateData[key];
    }

    if ("timInspektor" in dataToUpdate) {
      dataToUpdate.timInspektor = {
        set: [],
        connect: Array.isArray(updateData.timInspektor)
          ? updateData.timInspektor.map((nup: string) => ({ nup }))
          : [],
      };
    }

    if (typeof dataToUpdate.leadInspectorNup === "string") {
      const leadInspector = await prisma.pegawai.findUnique({
        where: { nup: dataToUpdate.leadInspectorNup },
        select: { id: true },
      });
      if (leadInspector) dataToUpdate.leadInspectorId = leadInspector.id;
      delete dataToUpdate.leadInspectorNup;
    }

    if (
      dataToUpdate.pekerjaan ||
      dataToUpdate.klien ||
      dataToUpdate.lokasi_pekerjaan
    ) {
      const suratLama = await prisma.suratTugas.findUnique({
        where: { id },
        include: { proyek: true },
      });
      const namaProyek =
        (typeof dataToUpdate.pekerjaan === "string"
          ? dataToUpdate.pekerjaan
          : null) ||
        suratLama?.proyek?.namaProyek ||
        "";
      const klienProyek =
        (typeof dataToUpdate.klien === "string" ? dataToUpdate.klien : null) ||
        suratLama?.proyek?.klien ||
        "";
      const lokasiProyek =
        typeof dataToUpdate.lokasi_pekerjaan === "string"
          ? dataToUpdate.lokasi_pekerjaan
          : suratLama?.proyek?.lokasi || "";

      let proyek = await prisma.proyek.findFirst({ where: { namaProyek } });
      if (!proyek) {
        proyek = await prisma.proyek.create({
          data: { namaProyek, klien: klienProyek, lokasi: lokasiProyek },
        });
      }
      dataToUpdate.proyekId = proyek.id;
    }

    const updatedSurat = await prisma.suratTugas.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json({
      message: "Surat tugas berhasil diupdate.",
      data: updatedSurat,
    });
  } catch (error: unknown) {
    console.error("Error saat update surat tugas:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}

// ================== GET: List Surat Tugas ==================
export async function GET(req: NextRequest) {
  try {
    const me = await getPegawaiAndRole();
    if (!me)
      return NextResponse.json(
        { error: "User tidak terautentikasi." },
        { status: 401 }
      );

    const { searchParams } = new URL(req.url);
    const scope = (searchParams.get("scope") || "user").toLowerCase(); // "admin" | "user"
    const wantShowAll = searchParams.get("showAll") === "true";

    // Definisi admin untuk halaman monitoring admin:
    const jabatan = (me.jabatan || "").toLowerCase();
    const isSeniorManager = jabatan.includes("senior manager");
    const isKacab = jabatan.includes("kepala cabang");
    const isAdmin =
      me.role === "admin" || me.role === "superadmin" || isSeniorManager || isKacab;

    // Hanya admin yang boleh minta scope=admin & showAll=true
    if (scope === "admin" && wantShowAll && !isAdmin) {
      return NextResponse.json({ error: "Forbidden (admin scope)" }, { status: 403 });
    }
    const showAll = scope === "admin" && wantShowAll && isAdmin;

    // Debug minimal
    console.log("[GET /api/surat-tugas]", {
      actor: { id: me.id, nup: me.nup, role: me.role, jabatan: me.jabatan },
      scope,
      wantShowAll,
      isAdmin,
      showAll,
    });

    const whereCondition = showAll
      ? {}
      : {
          OR: [
            { timInspektor: { some: { nup: me.nup } } },
            { leadInspectorId: me.id },
            { koordinatorId: me.id },
            { seniorManagerId: me.id },
            { kepalaCabangId: me.id },
            { dibuatOlehId: me.id },
          ],
        };

    const allSuratTugas = await prisma.suratTugas.findMany({
      where: whereCondition,
      include: {
        timInspektor: { select: { id: true, nama_pegawai: true, nup: true } },
        proyek: { select: { id: true, namaProyek: true, klien: true, lokasi: true } },
        leadInspector: { select: { id: true, nama_pegawai: true, nup: true } },
        koordinator: { select: { id: true, nama_pegawai: true, nup: true } },
        seniorManager: { select: { id: true, nama_pegawai: true, nup: true } },
        kepalaCabang: { select: { id: true, nama_pegawai: true, nup: true } },
        dibuatOleh: { select: { id: true, nama_pegawai: true, nup: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      data: allSuratTugas,
      totalCount: allSuratTugas.length,
      userInfo: {
        id: me.id,
        nup: me.nup,
        nama: me.nama_pegawai,
        role: me.role,
        jabatan: me.jabatan,
        scope: showAll ? "admin" : "user",
      },
    });
  } catch (error) {
    console.error("Error saat mengambil data surat tugas:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
