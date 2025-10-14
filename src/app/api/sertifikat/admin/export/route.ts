import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/middleware/sertifikatAuth';
import ExcelJS from 'exceljs';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  // Protect route
  const admin = await verifyAdminToken(request);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized - Admin only' }, { status: 403 });
  }

  try {
    // Fetch all sertifikat that have nomorSertifikat generated (approved)
    const rows = await prisma.sertifikat.findMany({
      where: { nomorSertifikat: { not: null } },
      include: { pengaju: true },
      orderBy: { createdAt: 'asc' }
    });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Sertifikat');

    // Header
    sheet.addRow([
      'Timestamp',
      'Kompetensi',
      'Pasar',
      'Kode Produksi (M)',
      'Kode Produksi (E)',
      'Nomor PO/WO/SO/KONTRAK',
      'Nomor Sertifikat',
      'QR URL'
    ]);

    for (const r of rows) {
      sheet.addRow([
        r.createdAt ? r.createdAt.toISOString() : '',
        r.kompetensi || '',
        r.pasar || '',
        r.kodeProduksiM || '',
        r.kodeProduksiE || '',
        r.nomorKontrak || '',
        r.nomorSertifikat || '',
        r.qrCodeUrl || ''
      ]);
    }

    // Style header bold
    sheet.getRow(1).font = { bold: true } as any;

    const buffer = await workbook.xlsx.writeBuffer();

    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="sertifikat_export_${new Date().toISOString().slice(0,10)}.xlsx"`
      }
    });
  } catch (e) {
    console.error('Export error', e);
    return NextResponse.json({ error: 'Failed to generate export' }, { status: 500 });
  }
}
