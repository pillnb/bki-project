// app/api/sertifikat/admin/reject/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminToken } from "@/lib/middleware/sertifikatAuth";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin authentication
    const admin = await verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized - Admin only" },
        { status: 403 }
      );
    }

    const { keterangan } = await request.json();
    const sertifikatId = parseInt(params.id);

    if (isNaN(sertifikatId)) {
      return NextResponse.json(
        { error: "ID sertifikat tidak valid" },
        { status: 400 }
      );
    }

    if (!keterangan || keterangan.trim() === "") {
      return NextResponse.json(
        { error: "Keterangan penolakan wajib diisi" },
        { status: 400 }
      );
    }

    // Get sertifikat data
    const sertifikat = await prisma.sertifikat.findUnique({
      where: { id: sertifikatId },
    });

    if (!sertifikat) {
      return NextResponse.json(
        { error: "Sertifikat tidak ditemukan" },
        { status: 404 }
      );
    }

    if (sertifikat.status !== "PENDING_APPROVAL") {
      return NextResponse.json(
        { error: "Sertifikat sudah diproses sebelumnya" },
        { status: 400 }
      );
    }

    // Update status to REJECTED
    const updated = await prisma.sertifikat.update({
      where: { id: sertifikatId },
      data: {
        status: "REJECTED",
        approvedBy: null, // Tidak set foreign key
        approvedByAdmin: admin.nup, // Simpan NUP admin di sini
        rejectedAt: new Date(),
        keterangan: keterangan.trim(),
      },
      include: {
        pengaju: {
          select: {
            nup: true,
            nama_pegawai: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Pengajuan sertifikat berhasil ditolak",
      data: updated,
    });
  } catch (error) {
    console.error("Reject sertifikat error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat reject sertifikat" },
      { status: 500 }
    );
  }
}
