// app/api/sertifikat/admin/approve/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/middleware/sertifikatAuth';
import { generateNomorSertifikat } from '@/lib/utils/sertifikatUtils';
import { GoogleDriveService } from '@/lib/services/googleDriveService';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin authentication
    const admin = await verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin only' },
        { status: 403 }
      );
    }

    const { keterangan } = await request.json()
    const { id } = await context.params              // await dulu
    const sertifikatId = Number(id)

    if (isNaN(sertifikatId)) {
      return NextResponse.json(
        { error: 'ID sertifikat tidak valid' },
        { status: 400 }
      );
    }

    // Get sertifikat data
    const sertifikat = await prisma.sertifikat.findUnique({
      where: { id: sertifikatId }
    });

    if (!sertifikat) {
      return NextResponse.json(
        { error: 'Sertifikat tidak ditemukan' },
        { status: 404 }
      );
    }

    if (sertifikat.status !== 'PENDING_APPROVAL') {
      return NextResponse.json(
        { error: 'Sertifikat sudah diproses sebelumnya' },
        { status: 400 }
      );
    }

    const tahun = new Date().getFullYear().toString();
    const jumlahHalaman = sertifikat.jumlahHalaman || 1;
    const results: any[] = [];

     let parentId: number | null = null;
    // Jika multipage, ambil satu sequence saja untuk digunakan oleh semua halaman
    let fixedSequence: number | undefined = undefined;
    if (jumlahHalaman > 1) {
      // gunakan util untuk ambil sequence tapi tanpa mengubah logic getNextSequence di util
      // getNextSequence tersedia di utils; import ulang minimal dengan dynamic require
      const { getNextSequence } = await import('@/lib/utils/sertifikatUtils');
      fixedSequence = await getNextSequence(String(new Date().getFullYear()));
    }
    // Loop untuk generate multiple pages jika perlu
    for (let page = 1; page <= jumlahHalaman; page++) {
      try {
        // Generate nomor sertifikat
        const nomorSertifikat = await generateNomorSertifikat({
          nomorKontrak: sertifikat.nomorKontrak,
          kodeProduksiM: sertifikat.kodeProduksiM,
          kodeProduksiE: sertifikat.kodeProduksiE,
          kompetensi: sertifikat.kompetensi,
          pasar: sertifikat.pasar,
          tahun,
          pageNumber: jumlahHalaman > 1 ? page : undefined,
          totalPages: jumlahHalaman > 1 ? jumlahHalaman : undefined,
          fixedSequence: fixedSequence,
        });

        // Generate & upload QR Code
        const qrData = await GoogleDriveService.uploadQRCode({
          nomorSertifikat,
          createdAt: new Date(),
          linkLaporan: sertifikat.linkLaporan
        });

        // Create new sertifikat record for this page
        const newSertifikat = await prisma.sertifikat.create({
          data: {
            pengajuId: sertifikat.pengajuId,
            parentId: sertifikat.parentId || null,
            nomorKontrak: sertifikat.nomorKontrak,
            kompetensi: sertifikat.kompetensi,
            pasar: sertifikat.pasar,
            kodeProduksiM: sertifikat.kodeProduksiM,
            kodeProduksiE: sertifikat.kodeProduksiE,
            jumlahHalaman: 1, // Each record represents 1 page
            linkLaporan: sertifikat.linkLaporan,
            nomorSertifikat,
            qrCodeDriveId: qrData.fileId,
            qrCodeUrl: qrData.viewUrl,
            qrCodeImageUrl: qrData.imageUrl,
            status: 'APPROVED',
            approvedAt: new Date(),
            keterangan
          }
        });

        results.push(newSertifikat);

        // Set parentId ke halaman pertama untuk halaman berikutnya
        if (parentId === null) {
          parentId = newSertifikat.id;
        }

      } catch (error) {
        console.error(`Failed to generate page ${page}:`, error);
        // Rollback: delete previously created sertifikats
        if (results.length > 0) {
          await prisma.sertifikat.deleteMany({
            where: {
              id: { in: results.map(r => r.id) }
            }
          });
        }
        throw error;
      }
    }

    // Update original sertifikat to APPROVED (as parent reference)
    // Jika ada hasil, tetapkan parentId ke semua halaman yang baru dibuat
    const createdIds = results.map(r => r.id);
    const parentRefId = results[0]?.id ?? null;

    if (parentRefId && createdIds.length > 0) {
      await prisma.sertifikat.updateMany({
        where: { id: { in: createdIds } },
        data: { parentId: parentRefId },
      });
    }

    // Update original sertifikat to APPROVED (as parent reference)
    await prisma.sertifikat.update({
      where: { id: sertifikatId },
      data: {
        status: 'APPROVED',
        parentId: parentRefId,
        approvedAt: new Date(),
        keterangan: `Parent record - Generated ${jumlahHalaman} sertifikat(s). ${keterangan || ''}`
      }
    });

    // Ambil ulang data hasil yang sudah diperbarui supaya response mengandung parentId
    const updatedResults = await prisma.sertifikat.findMany({
      where: { id: { in: createdIds } },
    });

    return NextResponse.json({
      success: true,
      message: `Berhasil approve dan generate ${jumlahHalaman} sertifikat`,
      data: updatedResults
    });

  } catch (error) {
    console.error('Approve sertifikat error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat approve sertifikat' },
      { status: 500 }
    );
  }
}