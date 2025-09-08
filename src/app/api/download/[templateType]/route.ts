import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import ExcelJS from 'exceljs';
import path from 'path';

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// --- START: Konfigurasi untuk Matrix Personel ---
const MATRIX_CATEGORIES = [
    'WI', 'PV', 'ST', 'RE', 'EL', 'PSV', 'CRN', 'IABA', 'MET', 'PF', 'RIG', 'PL',
    'INS', '570', 'PUBT', 'PAA', 'PTP', 'ELT', 'ELV', 'PEM', 'AKU', 'AUD',
    'MS', 'ISM C', 'ASD', 'NES', 'LCS', 'OVID', 'UT', 'MT', 'PT', 'AR', 'OR',
    'PPR', 'PAUT', 'ECT'
];

const columnMapping: { [key: string]: string } = {
    'WI': 'C', 'PV': 'D', 'ST': 'E', 'RE': 'F', 'EL': 'G', 'PSV': 'H', 'CRN': 'I',
    'IABA': 'J', 'MET': 'K', 'PF': 'L', 'RIG': 'M', 'PL': 'N', 'INS': 'O', '570': 'P',
    'PUBT': 'R', 'PAA': 'S', 'PTP': 'T', 'ELT': 'U', 'ELV': 'V', 'PEM': 'W', 'AKU': 'X',
    'AUD': 'Y', 'MS': 'AA', 'ISM C': 'AB', 'ASD': 'AC', 'NES': 'AD', 'LCS': 'AE', 'OVID': 'AF',
    'UT': 'AH', 'MT': 'AI', 'PT': 'AJ', 'AR': 'AK', 'OR': 'AL', 'PPR': 'AM', 'PAUT': 'AN', 'ECT': 'AO'
};
// --- END: Konfigurasi untuk Matrix Personel ---

async function handleMatrixPersonel() {
    const allPegawai = await prisma.pegawai.findMany({
        select: {
            nama_pegawai: true,
            pelatihan: {
                select: {
                    status: true,
                    matrixCategory: true,
                }
            }
        },
        orderBy: {
            nama_pegawai: 'asc',
        },
    });

    // **DEBUG LOG 1**: Cek data yang diambil dari database
    console.log("Total pegawai yang diproses:", allPegawai.length);
    if (allPegawai.length > 0) {
        console.log("Contoh data pelatihan pegawai pertama:", JSON.stringify(allPegawai[0].pelatihan, null, 2));
    }

    const templatePath = path.resolve(process.cwd(), `templates/template_matrixpersonel.xlsx`);
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(templatePath);

    const worksheet = workbook.worksheets[0];
    if (!worksheet) {
        throw new Error(`Worksheet tidak ditemukan di template_matrixpersonel.xlsx`);
    }

    const startRow = 5;
    const templateRow = worksheet.getRow(startRow);

    const summary = {
        valid: Object.fromEntries(MATRIX_CATEGORIES.map(cat => [cat, 0])),
        expired: Object.fromEntries(MATRIX_CATEGORIES.map(cat => [cat, 0])),
    };

    // --- START PERBAIKAN UTAMA ---
    // 1. Siapkan semua data untuk disisipkan sekaligus
    const rowsToInsert = allPegawai.map((pegawai, index) => {
        return [index + 1, pegawai.nama_pegawai];
    });

    // 2. Sisipkan semua baris data nama & no dalam satu operasi
    if (rowsToInsert.length > 0) {
        worksheet.insertRows(startRow, rowsToInsert);
    }

    // 3. Loop lagi untuk mengisi "V"/"E" dan menyalin style
    allPegawai.forEach((pegawai, index) => {
        const currentRowIndex = startRow + index;
        const newRow = worksheet.getRow(currentRowIndex);

        // Salin style dari baris template
        newRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
            const templateCell = templateRow.getCell(colNumber);
            cell.style = { ...templateCell.style }; // Salin style dengan cara yang lebih aman
        });

        // Isi data V/E
        MATRIX_CATEGORIES.forEach(category => {
            const relevantTraining = pegawai.pelatihan.find(t => t.matrixCategory?.trim() === category);
            
            if (relevantTraining) {
                // **DEBUG LOG 2**: Cek jika ada training yang cocok
                console.log(`Pegawai: ${pegawai.nama_pegawai}, Kategori: ${category}, Status: ${relevantTraining.status}`);

                const col = columnMapping[category];
                if (col) {
                    let statusChar = '';
                    if (relevantTraining.status === 'VALID') {
                        statusChar = 'V';
                        summary.valid[category]++;
                    } else if (relevantTraining.status === 'EXPIRED') {
                        statusChar = 'E';
                        summary.expired[category]++;
                    }
                    
                    if (statusChar) {
                        newRow.getCell(col).value = statusChar;
                    }
                }
            }
        });
    });
    // --- END PERBAIKAN UTAMA ---

    worksheet.spliceRows(startRow + allPegawai.length, 1);

    const summaryStartRow = startRow + allPegawai.length;
    const totalRow = worksheet.getRow(summaryStartRow);
    const validRow = worksheet.getRow(summaryStartRow + 1);
    const expiredRow = worksheet.getRow(summaryStartRow + 2);
    
    MATRIX_CATEGORIES.forEach(category => {
        const col = columnMapping[category];
        if (col) {
            const validCount = summary.valid[category] || 0;
            const expiredCount = summary.expired[category] || 0;

            totalRow.getCell(col).value = validCount + expiredCount;
            validRow.getCell(col).value = validCount;
            expiredRow.getCell(col).value = expiredCount;
        }
    });

    return workbook;
}

// ... Sisa kode GET request tidak berubah ...
export async function GET(req: NextRequest, props: { params: Promise<{ templateType: string }> }) {
    const params = await props.params;
    const { templateType } = params;

    if (templateType !== 'fq140' && templateType !== 'fq183' && templateType !== 'matrixpersonel') {
        return NextResponse.json({ error: 'Jenis template tidak valid.' }, { status: 400 });
    }

    try {
        let workbook: ExcelJS.Workbook;
        let fileName: string;

        if (templateType === 'matrixpersonel') {
            workbook = await handleMatrixPersonel();
            fileName = `Report_Matrix_Personel.xlsx`;
        } else {
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
            workbook = new ExcelJS.Workbook();
            await workbook.xlsx.readFile(templatePath);

            const worksheet = workbook.worksheets[0];
            if (!worksheet) throw new Error(`Worksheet tidak ditemukan di template ${templateType}.xlsx`);
            
            const startRow = 8;
            const templateRow = worksheet.getRow(startRow);
            const dataToInsert: unknown[][] = [];
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
                                null, // CODING
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

            if (dataToInsert.length > 0) {
                worksheet.insertRows(startRow, dataToInsert);
                for (let i = 0; i < dataToInsert.length; i++) {
                    const newRow = worksheet.getRow(startRow + i);
                    newRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                        const templateCell = templateRow.getCell(colNumber);
                        cell.style = { ...templateCell.style };
                         if (templateCell.border) {
                            cell.border = { ...templateCell.border };
                        }
                    });
                }
            }
            
            worksheet.spliceRows(startRow + dataToInsert.length, 1);
            fileName = `Report_${templateType.toUpperCase()}_Personil.xlsx`;
        }

        const buffer = await workbook.xlsx.writeBuffer();

        return new NextResponse(buffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': `attachment; filename="${fileName}"`,
            },
        });

    } catch (error) {
        console.error(`Gagal membuat file ${templateType}:`, error);
        const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan tidak diketahui';
        return NextResponse.json({ error: `Gagal membuat file ${templateType}. Detail: ${errorMessage}` }, { status: 500 });
    }
}