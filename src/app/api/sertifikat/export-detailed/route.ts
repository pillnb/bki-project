// app/api/sertifikat/export-detailed/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminToken } from "@/lib/middleware/sertifikatAuth";
import ExcelJS from "exceljs";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  // Protect route
  const admin = await verifyAdminToken(request);
  if (!admin) {
    return NextResponse.json(
      { error: "Unauthorized - Admin only" },
      { status: 403 }
    );
  }

  try {
    // Fetch all sertifikat with related data
    const rows = await prisma.sertifikat.findMany({
      where: { nomorSertifikat: { not: null } },
      include: {
        pengaju: true,
      },
      orderBy: { createdAt: "asc" },
    });

    // Get all SuratTugas untuk matching dengan nomorKontrak
    const suratTugasList = await prisma.suratTugas.findMany({
      include: {
        proyek: true,
        leadInspector: { select: { nama_pegawai: true } },
        timInspektor: { select: { nama_pegawai: true } },
      },
    });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Sertifikat Detailed");

    // Header
    sheet.addRow([
      "No Urut",
      "No Cert",
      "Kode",
      "Objek",
      "Nama Perusahaan",
      "Lokasi Pekerjaan",
      "Tanggal Mulai",
      "Tanggal Selesai",
      "Tanggal Minta Nomor",
      "Tanggal Diterima",
      "Expired Date",
      "Total Certificate",
      "Total Hari Pekerjaan Selesai",
      "Lama Proses Laporan",
      "Status Laporan",
      "Total Hari Kerja Proses Pekerjaan",
      "Initial Inspector",
      "Initial Asst Inspector",
      "Tgl Kirim Laporan",
      "No. Invoice",
      "No. Contract SAP",
      "Ket",
      "Nilai (Rp)",
    ]);

    for (const r of rows) {
      // Match SuratTugas berdasarkan nomorKontrak dengan no_service_order, spi, atau wbs
      const suratTugas = suratTugasList.find(
        (st) =>
          st.no_service_order === r.nomorKontrak ||
          st.spi === r.nomorKontrak ||
          st.wbs === r.nomorKontrak
      );

      // Format tanggal
      const formatDate = (date: Date | null | undefined) => {
        if (!date) return "";
        return new Date(date).toLocaleDateString("id-ID");
      };

      // Calculate total hari pekerjaan (if both dates available)
      const calculateDays = (
        start: Date | null | undefined,
        end: Date | null | undefined
      ) => {
        if (!start || !end) return "";
        const diff = new Date(end).getTime() - new Date(start).getTime();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return days > 0 ? days.toString() : "";
      };

      // Extract nomor urut dari 4 digit pertama nomor sertifikat
      const getNoUrut = (nomorSertifikat: string | null) => {
        if (!nomorSertifikat) return "";
        const match = nomorSertifikat.match(/^(\d{4})/);
        return match ? match[1] : "";
      };

      sheet.addRow([
        getNoUrut(r.nomorSertifikat), // No Urut (4 digit pertama dari nomor sertifikat)
        r.nomorSertifikat || "", // No Cert
        r.kodeProduksiM || r.kodeProduksiE || "", // Kode
        suratTugas?.proyek?.namaProyek || "", // Objek
        suratTugas?.proyek?.klien || "", // Nama Perusahaan
        suratTugas?.proyek?.lokasi || "", // Lokasi Pekerjaan
        formatDate(suratTugas?.tanggal_berangkat), // Tanggal Mulai
        formatDate(suratTugas?.tanggal_kembali), // Tanggal Selesai
        formatDate(r.createdAt), // Tanggal Minta Nomor
        "", // Tanggal Diterima (manual)
        "", // Expired Date (manual)
        r.jumlahHalaman || 1, // Total Certificate
        calculateDays(
          suratTugas?.tanggal_berangkat,
          suratTugas?.tanggal_kembali
        ), // Total Hari Pekerjaan Selesai
        "", // Lama Proses Laporan (manual)
        "", // Status Laporan (manual)
        "", // Total Hari Kerja Proses Pekerjaan (manual)
        suratTugas?.leadInspector?.nama_pegawai || "", // Initial Inspector
        suratTugas?.timInspektor.map((t) => t.nama_pegawai).join(", ") || "", // Initial Asst Inspector
        "", // Tgl Kirim Laporan (manual)
        "", // No. Invoice (manual)
        suratTugas?.no_service_order ||
          suratTugas?.spi ||
          suratTugas?.wbs ||
          "", // No. Contract SAP
        "", // Ket (manual)
        "", // Nilai (Rp) (manual)
      ]);
    }

    // Style header
    const headerRow = sheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFD3D3D3" },
    };
    headerRow.alignment = { vertical: "middle", horizontal: "center" };

    // Auto width columns
    sheet.columns.forEach((column, index) => {
      let maxLength = 0;
      column.eachCell?.({ includeEmpty: true }, (cell) => {
        const length = cell.value ? cell.value.toString().length : 10;
        if (length > maxLength) maxLength = length;
      });
      column.width = maxLength < 10 ? 10 : maxLength + 2;
    });

    const buffer = await workbook.xlsx.writeBuffer();

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="sertifikat_detailed_export_${new Date()
          .toISOString()
          .slice(0, 10)}.xlsx"`,
      },
    });
  } catch (e) {
    console.error("Export detailed error", e);
    return NextResponse.json(
      { error: "Failed to generate export" },
      { status: 500 }
    );
  }
}
