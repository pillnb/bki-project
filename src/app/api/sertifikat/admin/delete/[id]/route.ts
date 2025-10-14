import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/middleware/sertifikatAuth';

export const runtime = 'nodejs';

/**
 * Deletes a Sertifikat by id (admin only) and resets the SertifikatCounter
 * so the next getNextSequence() will return the deleted sequence number.
 */
export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const admin = await verifyAdminToken(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  try {
    const { id } = await context.params;
    const sid = Number(id);
    if (isNaN(sid)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

    const cert = await prisma.sertifikat.findUnique({ where: { id: sid } });
    if (!cert) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Try to parse seq4 and tahun from nomorSertifikat
    // nomorSertifikat format: {seq4}-01-BPC/{nomorKontrak}/{kode}-{kompetensi}/{pasar}/{tahun}(-page-pageTotal)?
    let seqNum: number | null = null;
    let tahun = String(new Date().getFullYear());
    if (cert.nomorSertifikat) {
      const parts = cert.nomorSertifikat.split('-');
      if (parts.length > 0) {
        const seqPart = parts[0];
        const parsed = Number(seqPart);
        if (!isNaN(parsed)) seqNum = parsed;
      }

      // tahun is after last '/'
      const afterSlash = cert.nomorSertifikat.split('/');
      if (afterSlash.length > 0) {
        const possibleTahun = afterSlash[afterSlash.length - 1];
        const yearMatch = possibleTahun.match(/(20\d{2})/);
        if (yearMatch) tahun = yearMatch[1];
      }
    }

    // Delete the sertifikat
    await prisma.sertifikat.delete({ where: { id: sid } });

    // If we parsed a seq number, set the counter to seqNum - 1 so next getNextSequence returns seqNum
    if (seqNum && seqNum > 0) {
      const storedSeq = Math.max(0, seqNum - 1);
      await prisma.sertifikatCounter.upsert({
        where: { tahun },
        update: { sequence: storedSeq },
        create: { tahun, sequence: storedSeq }
      });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Delete sertifikat error', e);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
