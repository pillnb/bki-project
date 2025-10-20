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

    // Determine group key: parentId if present, otherwise this item's id
    const groupKey = sertifikat.parentId || sertifikat.id;

    // Find all records in the same group (parentId === groupKey OR id === groupKey)
    const whereClause = {
      OR: [
        { parentId: groupKey },
        { id: groupKey }
      ]
    } as any;

    // read optional keterangan from body
    let body: any = {};
    try {
      body = await request.json();
    } catch (e) {
      // ignore, body may be empty
    }
    const keterangan = (body && typeof body.keterangan === 'string' && body.keterangan.trim()) ? body.keterangan.trim() : 'Dibatalkan oleh admin';

    // Update all matching records to CANCEL
    const updateResult = await prisma.sertifikat.updateMany({
      where: whereClause,
      data: {
        status: 'CANCEL' as any,
        approvedByAdmin: admin.nup,
        keterangan,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({ success: true, message: `Berhasil membatalkan ${updateResult.count} sertifikat dalam grup`, count: updateResult.count });

  } catch (error) {
    console.error('Cancel sertifikat error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan saat membatalkan sertifikat' }, { status: 500 });
  }
}
