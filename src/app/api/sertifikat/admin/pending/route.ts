// app/api/sertifikat/admin/pending/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/middleware/sertifikatAuth';

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const admin = await verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin only' },
        { status: 403 }
      );
    }

    // Get query params untuk filter
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'PENDING_APPROVAL';

    const whereClause: any = {};
    
    if (status === 'all') {
      // Show all statuses
    } else {
      whereClause.status = status;
    }

    // Get all submissions sesuai filter
    const submissions = await prisma.sertifikat.findMany({
      where: whereClause,
      include: {
        pengaju: {
          select: {
            nup: true,
            nama_pegawai: true,
            jabatan: true,
            email: true
          }
        },
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      data: submissions,
      count: submissions.length
    });

  } catch (error) {
    console.error('Get pending approvals error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil data' },
      { status: 500 }
    );
  }
}