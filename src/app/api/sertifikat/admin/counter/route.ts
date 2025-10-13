import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/middleware/sertifikatAuth';

export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAdminToken(request);
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const tahun = searchParams.get('tahun') || String(new Date().getFullYear());

    const counter = await prisma.sertifikatCounter.findUnique({ where: { tahun } });
    return NextResponse.json({ tahun, sequence: counter?.sequence ?? 0 });
  } catch (e) {
    console.error('Get counter error', e);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await verifyAdminToken(request);
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    const body = await request.json().catch(() => ({}));
    const tahun = String(body.tahun || new Date().getFullYear());
    const seq = Number(body.sequence);
    const useAsNext = Boolean(body.useAsNext);
    if (!Number.isFinite(seq) || seq < 0) {
      return NextResponse.json({ error: 'sequence harus angka >= 0' }, { status: 400 });
    }

    // If admin wants the provided number to be the NEXT issued number,
    // we need to store seq-1 in DB because getNextSequence increments before returning.
    const storedSeq = useAsNext ? Math.max(0, seq - 1) : seq;

    // Upsert with explicit sequence value
    const updated = await prisma.sertifikatCounter.upsert({
      where: { tahun },
      update: { sequence: storedSeq },
      create: { tahun, sequence: storedSeq }
    });

    return NextResponse.json({ success: true, data: { tahun: updated.tahun, sequence: updated.sequence } });
  } catch (e) {
    console.error('Set counter error', e);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
