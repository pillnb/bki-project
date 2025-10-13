import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/middleware/sertifikatAuth';

export async function GET(request: NextRequest) {
  try {
    const user = await verifyToken(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const pegawai = await prisma.pegawai.findUnique({
      where: { nup: user.nup },
      select: {
        nup: true,
        nama_pegawai: true,
        jabatan: true,
        email: true,
      },
    });

    if (!pegawai) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json({ data: pegawai });
  } catch (error) {
    console.error('Get current pengaju error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
