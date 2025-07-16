// src/app/api/download/[templateType]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import ExcelJS from 'exceljs';
import path from 'path';

export async function GET(
  req: NextRequest,
  { params }: { params: { templateType: string } }
) {
  const { templateType } = params;

  if (templateType !== 'fq140' && templateType !== 'fq183') {
    return NextResponse.json({ error: 'Jenis template tidak valid.' }, { status: 400 });
  }

  try {
    const allPegawai = await prisma.pegawai.findMany({
      include: {
        pelatihan: {
          orderBy: {
            nama_pelatihan: 'asc',
          },
        },
      },
      orderBy: {
        nama_pegawai: 'asc',
      },
    });

    const templatePath = path.resolve(process.cwd(), `templates/template_${templateType}.xlsx`);
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(templatePath);

    const worksheet = workbook.worksheets[0];
    if (!worksheet) {
      throw new Error(`Tidak ada worksheet yang ditemukan di dalam file template ${templateType}.xlsx`);
    }

    const startRow = 8;
    
    // ## PERBAIKAN UTAMA: Mendapatkan baris template untuk meniru style ##
    const templateRow = worksheet.getRow(startRow);
    
    // Kumpulkan semua data yang akan dimasukkan
    const dataToInsert: any[][] = [];
    let rowIndex = 0;

    if (templateType === 'fq183') {
      allPegawai.forEach(pegawai => {
        if (pegawai.pelatihan.length > 0) { 
          pegawai.pelatihan.forEach(item => {
            rowIndex++;
            dataToInsert.push([
              rowIndex,
              pegawai.nama_pegawai,
              pegawai.nup,
              pegawai.status_pegawai,
              item.nama_pelatihan,
              item.penyelenggara,
              item.nomor_sertifikat,
              item.tanggal_awal,
              item.masa_berlaku,
              item.keterangan_utilisasi || '-',
            ]);
          });
        }
      });
    } else if (templateType === 'fq140') {
      allPegawai.forEach(pegawai => {
        if (pegawai.pelatihan.length > 0) {
          pegawai.pelatihan.forEach(item => {
            rowIndex++;
            dataToInsert.push([
              rowIndex,
              pegawai.nama_pegawai,
              'Cabang Komersil Balikpapan',
              '-',
              pegawai.jabatan,
              pegawai.status_pegawai,
              pegawai.jenjang_pend,
              pegawai.pendidikan,
              item.nama_pelatihan,
              null, // Kolom "CODING"
              item.penyelenggara,
              item.nomor_sertifikat,
              item.tanggal_awal,
              item.masa_berlaku,
              item.keterangan_utilisasi || '-',
            ]);
          });
        }
      });
    }
    
    // Sisipkan data dan aplikasikan style
    if (dataToInsert.length > 0) {
      worksheet.insertRows(startRow, dataToInsert);

      // Loop untuk menyalin style ke setiap baris & sel yang baru ditambahkan
      for (let i = 0; i < dataToInsert.length; i++) {
        const newRow = worksheet.getRow(startRow + i);
        newRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
          const templateCell = templateRow.getCell(colNumber);
          cell.style = templateCell.style; // Salin semua style (border, font, fill, dll)

          // Jika template cell punya border, pastikan cell baru juga punya
          if (templateCell.border) {
              cell.border = { ...templateCell.border };
          }
        });
      }
    }
    
    // Hapus baris template asli (jika template Anda memiliki baris contoh)
    // Jika baris ke-8 di template Anda kosong (hanya untuk style), baris ini akan menghapusnya.
    // Jika tidak, Anda bisa menghapus baris ini.
    worksheet.spliceRows(startRow + dataToInsert.length, 1);


    const buffer = await workbook.xlsx.writeBuffer();
    
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="Report_${templateType.toUpperCase()}_Personil.xlsx"`,
      },
    });

  } catch (error) {
    console.error(`Gagal membuat file ${templateType}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan tidak diketahui';
    return NextResponse.json({ error: `Gagal membuat file ${templateType}. Detail: ${errorMessage}` }, { status: 500 });
  }
}