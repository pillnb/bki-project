// app/api/sertifikat/submit/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSertifikatForm } from '@/lib/utils/sertifikatUtils';
import { verifyToken } from '@/lib/middleware/sertifikatAuth';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    const {
      nomorKontrak,
      kompetensi,
      pasar,
      kodeProduksiM,
      kodeProduksiE,
      jumlahHalaman,
      linkLaporan
    } = body;

    // Normalize data (trim & uppercase)
    const normalizedData = {
      nomorKontrak: nomorKontrak?.trim() || '',
      kompetensi: kompetensi?.trim().toUpperCase() || '',
      pasar: pasar?.trim().toUpperCase() || '',
      kodeProduksiM: kodeProduksiM?.trim().toUpperCase() || null,
      kodeProduksiE: kodeProduksiE?.trim().toUpperCase() || null,
      jumlahHalaman: jumlahHalaman ? parseInt(String(jumlahHalaman)) : null,
      linkLaporan: linkLaporan?.trim() || ''
    };

    // Validasi form
    const validation = validateSertifikatForm(normalizedData);

    if (!validation.valid) {
      console.error('Validation errors:', validation.errors);
      return NextResponse.json(
        { 
          error: 'Validasi gagal', 
          errors: validation.errors,
          receivedData: normalizedData // untuk debugging
        },
        { status: 400 }
      );
    }

    // Buat record sertifikat
    const sertifikat = await prisma.sertifikat.create({
      data: {
        pengajuId: user.userId,
        nomorKontrak: normalizedData.nomorKontrak,
        kompetensi: normalizedData.kompetensi,
        pasar: normalizedData.pasar,
        kodeProduksiM: normalizedData.kodeProduksiM,
        kodeProduksiE: normalizedData.kodeProduksiE,
        jumlahHalaman: normalizedData.jumlahHalaman,
        linkLaporan: normalizedData.linkLaporan,
        status: 'PENDING_APPROVAL'
      },
      include: {
        pengaju: {
          select: {
            nup: true,
            nama_pegawai: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Pengajuan sertifikat berhasil disubmit',
      data: sertifikat
    }, { status: 201 });

  } catch (error) {
    console.error('Submit sertifikat error:', error);
    return NextResponse.json(
      { 
        error: 'Terjadi kesalahan saat submit sertifikat',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}