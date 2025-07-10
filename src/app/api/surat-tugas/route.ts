import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    console.log('Received body:', body); // Debug log

    // Frontend sends snake_case, so we read snake_case
    const nomor_surat = body.nomor_surat;
    const klien = body.klien;
    const pekerjaan = body.pekerjaan;
    const status_pekerjaan = body.status_pekerjaan;
    const no_service_order = body.no_service_order;
    const spi = body.spi;
    const wbs = body.wbs;
    const bidang_pekerjaan = body.bidang_pekerjaan;
    const peralatan_inspeksi = body.peralatan_inspeksi;
    const kebutuhan_material = body.kebutuhan_material;
    const lokasi_pekerjaan = body.lokasi_pekerjaan;
    const tanggal_berangkat = body.tanggal_berangkat;
    const tanggal_kembali = body.tanggal_kembali;
    const transportasi_operasional = body.transportasi_operasional;
    const transportasi_ditanggung_klien = body.transportasi_ditanggung_klien;
    const transportasi_asal_tujuan = body.transportasi_asal_tujuan;
    const transportasi_dinas = body.transportasi_dinas;
    const tiket = body.tiket;
    const penginapan = body.penginapan;
    const keterangan_lain = body.keterangan_lain;
    const pegawaiNupList = body.pegawaiNupList;
    const status = body.status;

    // Validasi dan filter array agar tidak hanya berisi string kosong
    const lokasi_pekerjaan_valid = Array.isArray(lokasi_pekerjaan) ? lokasi_pekerjaan.filter(l => l && l.trim() !== '') : [];
    const pegawaiNupList_valid = Array.isArray(pegawaiNupList) ? pegawaiNupList.filter(nup => nup && nup.trim() !== '') : [];
    
    console.log('Validation data:', {
      klien,
      pekerjaan,
      lokasi_pekerjaan_valid,
      pegawaiNupList_valid,
      no_service_order,
      spi,
      wbs
    }); // Debug log

    if (!klien || !pekerjaan || lokasi_pekerjaan_valid.length === 0 || pegawaiNupList_valid.length === 0) {
      return NextResponse.json({ error: 'Data wajib tidak boleh kosong.' }, { status: 400 });
    }

    // PERBAIKAN: Validasi "isi salah satu" - fix the validation logic
    const hasServiceOrder = no_service_order && no_service_order !== null && no_service_order.trim() !== '';
    const hasSpi = spi && spi !== null && spi.trim() !== '';
    const hasWbs = wbs && wbs !== null && wbs.trim() !== '';
    
    console.log('Validation check:', { 
      hasServiceOrder, 
      hasSpi, 
      hasWbs, 
      no_service_order, 
      spi, 
      wbs,
      no_service_order_type: typeof no_service_order,
      spi_type: typeof spi,
      wbs_type: typeof wbs
    }); // Debug log
    
    if (!hasServiceOrder && !hasSpi && !hasWbs) {
      return NextResponse.json({ error: 'Salah satu dari No Service Order, SPI, atau WBS harus diisi.' }, { status: 400 });
    }

    const result = await prisma.$transaction(async (tx) => {
      // Build data object without undefined fields
      const suratTugasData: any = {
        klien,
        pekerjaan,
        status_pekerjaan,
        status: status || 'DIAJUKAN', // Gunakan status dari body jika ada, default DIAJUKAN
        no_service_order: hasServiceOrder ? no_service_order : null,
        spi: hasSpi ? spi : null,
        wbs: hasWbs ? wbs : null,
        bidang_pekerjaan,
        peralatan_inspeksi: Array.isArray(peralatan_inspeksi) ? peralatan_inspeksi : [],
        kebutuhan_material: Array.isArray(kebutuhan_material) ? kebutuhan_material.filter(m => m && m.trim() !== '') : [],
        lokasi_pekerjaan: lokasi_pekerjaan_valid,
        transportasi_operasional: !!transportasi_operasional,
        transportasi_ditanggung_klien: !!transportasi_ditanggung_klien,
        transportasi_asal_tujuan: !!transportasi_asal_tujuan,
        transportasi_dinas: !!transportasi_dinas,
        tiket: !!tiket,
        penginapan: !!penginapan,
        keterangan_lain,
      };
      
      if (nomor_surat) suratTugasData.nomor_surat = nomor_surat;
      if (tanggal_berangkat) suratTugasData.tanggal_berangkat = new Date(tanggal_berangkat);
      if (tanggal_kembali) suratTugasData.tanggal_kembali = new Date(tanggal_kembali);

      const newSuratTugas = await tx.suratTugas.create({
        data: suratTugasData,
      });

      const pegawaiSuratTugasData = pegawaiNupList_valid.map((nup: string) => ({
        suratTugasId: newSuratTugas.id,
        pegawaiNup: nup,
      }));

      await tx.pegawaiSuratTugas.createMany({
        data: pegawaiSuratTugasData,
      });

      return newSuratTugas;
    });

    return NextResponse.json({ message: 'Surat tugas berhasil dibuat!', data: result }, { status: 201 });

  } catch (error: any) {
    console.error("Error saat membuat surat tugas:", error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Nomor surat sudah ada.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Terjadi kesalahan pada server.' }, { status: 500 });
  }
}

// Opsional: API untuk mengambil semua surat tugas (GET)
export async function GET() {
    try {
        const allSuratTugas = await prisma.suratTugas.findMany({
            include: {
                pegawai_surat_tugas: {
                    select: {
                        pegawai: {
                            select: {
                                nama_pegawai: true,
                                nup: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return NextResponse.json(allSuratTugas);
    } catch (error) {
        console.error("Error saat mengambil data surat tugas:", error);
        return NextResponse.json({ error: 'Terjadi kesalahan pada server.' }, { status: 500 });
    }
}