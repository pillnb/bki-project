// app/api/sertifikat/my-submissions/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/middleware/sertifikatAuth';

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get all submissions dari user ini
    const submissions = await prisma.sertifikat.findMany({
      where: {
        pengajuId: user.userId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      data: submissions
    });

  } catch (error) {
    console.error('Get submissions error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil data' },
      { status: 500 }
    );
  }
}