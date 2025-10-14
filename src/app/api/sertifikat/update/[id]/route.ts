import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/middleware/sertifikatAuth';
import { validateSertifikatForm } from '@/lib/utils/sertifikatUtils';

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await verifyToken(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await context.params;
    const sid = Number(id);
    if (isNaN(sid)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

    const existing = await prisma.sertifikat.findUnique({ where: { id: sid } });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (existing.pengajuId !== user.userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    if (existing.status !== 'REJECTED') return NextResponse.json({ error: 'Only REJECTED submissions can be resubmitted' }, { status: 400 });

    const body = await request.json().catch(() => ({}));
    const {
      nomorKontrak,
      kompetensi,
      pasar,
      kodeProduksiM,
      kodeProduksiE,
      jumlahHalaman,
      linkLaporan
    } = body;

    const normalizedData = {
      nomorKontrak: nomorKontrak?.trim() || '',
      kompetensi: kompetensi?.trim().toUpperCase() || '',
      pasar: pasar?.trim().toUpperCase() || '',
      kodeProduksiM: kodeProduksiM?.trim().toUpperCase() || null,
      kodeProduksiE: kodeProduksiE?.trim().toUpperCase() || null,
      jumlahHalaman: jumlahHalaman ? parseInt(String(jumlahHalaman)) : null,
      linkLaporan: linkLaporan?.trim() || ''
    };

    const validation = validateSertifikatForm(normalizedData);
    if (!validation.valid) {
      return NextResponse.json({ error: 'Validasi gagal', errors: validation.errors }, { status: 400 });
    }

    // Update the record: set status back to PENDING_APPROVAL and clear generated fields
    const updated = await prisma.sertifikat.update({
      where: { id: sid },
      data: {
        nomorKontrak: normalizedData.nomorKontrak,
        kompetensi: normalizedData.kompetensi,
        pasar: normalizedData.pasar,
        kodeProduksiM: normalizedData.kodeProduksiM,
        kodeProduksiE: normalizedData.kodeProduksiE,
        jumlahHalaman: normalizedData.jumlahHalaman,
        linkLaporan: normalizedData.linkLaporan,
        status: 'PENDING_APPROVAL',
        keterangan: null,
        nomorSertifikat: null,
        qrCodeDriveId: null,
        qrCodeUrl: null,
        qrCodeImageUrl: null,
      }
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (e) {
    console.error('Update sertifikat error', e);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
