// app/api/sertifikat/admin/cancel/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/middleware/sertifikatAuth';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const admin = await verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized - Admin only' }, { status: 403 });
    }

    const sertifikatId = parseInt(id);
    if (isNaN(sertifikatId)) {
      return NextResponse.json({ error: 'ID sertifikat tidak valid' }, { status: 400 });
    }

    const sertifikat = await prisma.sertifikat.findUnique({ where: { id: sertifikatId } });
    if (!sertifikat) {
      return NextResponse.json({ error: 'Sertifikat tidak ditemukan' }, { status: 404 });
    }

    if (sertifikat.status !== 'PENDING_APPROVAL') {
      return NextResponse.json({ error: 'Sertifikat sudah diproses sebelumnya' }, { status: 400 });
    }

    const updated = await prisma.sertifikat.update({
      where: { id: sertifikatId },
      data: {
        // cast to any because Prisma client enum types may differ in generated types
        status: 'CANCEL' as any,
        approvedByAdmin: admin.nup,
        keterangan: 'Dibatalkan oleh admin',
        updatedAt: new Date()
      },
      include: {
        pengaju: { select: { nup: true, nama_pegawai: true } }
      }
    });

    return NextResponse.json({ success: true, message: 'Pengajuan dibatalkan', data: updated });

  } catch (error) {
    console.error('Cancel sertifikat error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan saat membatalkan sertifikat' }, { status: 500 });
  }
}
