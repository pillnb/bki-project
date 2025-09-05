// API untuk update Surat Tugas (PUT)
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updateData } = body;
    if (!id) {
      return NextResponse.json({ error: 'ID surat tugas wajib diisi.' }, { status: 400 });
    }

    // Cari surat tugas yang akan diupdate
    const surat = await prisma.suratTugas.findUnique({
      where: { id: id },
      select: { status: true }
    });
    if (!surat) {
      return NextResponse.json({ error: 'Surat tugas tidak ditemukan.' }, { status: 404 });
    }
    if (surat.status !== 'DRAFT') {
      return NextResponse.json({ error: 'Surat tugas hanya bisa diupdate jika status masih DRAFT.' }, { status: 403 });
    }

    // Siapkan data yang boleh diupdate
    const allowedFields = [
      'nomor_surat', 'klien', 'pekerjaan', 'status_pekerjaan', 'no_service_order', 'spi', 'wbs',
      'bidang_pekerjaan', 'peralatan_inspeksi', 'kebutuhan_material', 'lokasi_pekerjaan',
      'tanggal_berangkat', 'tanggal_kembali', 'transportasi_operasional', 'transportasi_ditanggung_klien',
      'transportasi_asal_tujuan', 'transportasi_dinas', 'tiket', 'penginapan', 'keterangan_lain',
      'timInspektor', 'leadInspectorNup'
    ];
    const dataToUpdate: Record<string, unknown> = {};
    for (const key of allowedFields) {
      if (key in updateData) {
        dataToUpdate[key] = updateData[key];
      }
    }

    // Update relasi timInspektor jika ada
    if (dataToUpdate.timInspektor) {
      dataToUpdate.timInspektor = {
        set: [],
        connect: Array.isArray(updateData.timInspektor)
          ? updateData.timInspektor.map((nup: string) => ({ nup }))
          : []
      };
    }

    // Update leadInspector jika ada
    if (dataToUpdate.leadInspectorNup && typeof dataToUpdate.leadInspectorNup === 'string') {
      const leadInspector = await prisma.pegawai.findUnique({ where: { nup: dataToUpdate.leadInspectorNup }, select: { id: true } });
      if (leadInspector) {
        dataToUpdate.leadInspectorId = leadInspector.id;
      }
      delete dataToUpdate.leadInspectorNup;
    }

    // Update proyek jika ada perubahan pekerjaan/klien/lokasi
    if (dataToUpdate.pekerjaan || dataToUpdate.klien || dataToUpdate.lokasi_pekerjaan) {
      // Cari proyek lama
      const suratLama = await prisma.suratTugas.findUnique({ where: { id }, include: { proyek: true } });
      let proyekId = suratLama?.proyek?.id;
      const namaProyek = (typeof dataToUpdate.pekerjaan === 'string' ? dataToUpdate.pekerjaan : null) || suratLama?.proyek?.namaProyek || '';
      const klienProyek = (typeof dataToUpdate.klien === 'string' ? dataToUpdate.klien : null) || suratLama?.proyek?.klien || '';
      const lokasiProyek = Array.isArray(dataToUpdate.lokasi_pekerjaan)
        ? dataToUpdate.lokasi_pekerjaan.join(', ')
        : (suratLama?.proyek?.lokasi || '');
      // Cari proyek yang sesuai
      let proyek = await prisma.proyek.findFirst({ where: { namaProyek } });
      if (!proyek) {
        proyek = await prisma.proyek.create({ data: { namaProyek, klien: klienProyek, lokasi: lokasiProyek } });
      }
      proyekId = proyek.id;
      dataToUpdate.proyekId = proyekId;
    }

    // Update surat tugas
    const updatedSurat = await prisma.suratTugas.update({
      where: { id },
      data: dataToUpdate
    });
    return NextResponse.json({ message: 'Surat tugas berhasil diupdate.', data: updatedSurat });
  } catch (error: unknown) {
    console.error('Error saat update surat tugas:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan pada server.' }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// API untuk membuat Surat Tugas (POST)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Membaca semua data dari body
    const {
      nomor_surat,
      klien,
      pekerjaan, // Ini akan digunakan sebagai namaProyek
      status_pekerjaan,
      no_service_order,
      spi,
      wbs,
      bidang_pekerjaan,
      peralatan_inspeksi,
      kebutuhan_material,
      lokasi_pekerjaan, // Ini akan digunakan sebagai lokasi Proyek
      tanggal_berangkat,
      tanggal_kembali,
      transportasi_operasional,
      transportasi_ditanggung_klien,
      transportasi_asal_tujuan,
      transportasi_dinas,
      tiket,
      penginapan,
      keterangan_lain,
      pegawaiNupList = body.pegawaiNupList || body.timInspektor, // Daftar NUP untuk timInspektor
      leadInspectorNup, // NUP Lead Inspector
      status,
      dibuatOlehId
    } = body;

    // Validasi dan filter array NUP agar tidak ada yang kosong
    const pegawaiNupList_valid = Array.isArray(pegawaiNupList) ? pegawaiNupList.filter((nup: unknown) => nup && typeof nup === 'string' && nup.trim() !== '') : [];
    
    if (!klien || !pekerjaan || pegawaiNupList_valid.length === 0) {
      return NextResponse.json({ error: 'Klien, Pekerjaan, dan Tim Inspektor tidak boleh kosong.' }, { status: 400 });
    }

    // Validasi bahwa salah satu dari No Service Order, SPI, atau WBS harus diisi
    if (!no_service_order && !spi && !wbs) {
      return NextResponse.json({ error: 'Salah satu dari No Service Order, SPI, atau WBS harus diisi.' }, { status: 400 });
    }

    // Cari ID Lead Inspector berdasarkan NUP jika ada
    let leadInspectorId = null;
    if (leadInspectorNup) {
      const leadInspectorData = await prisma.pegawai.findUnique({
        where: { nup: leadInspectorNup },
        select: { id: true }
      });
      if (leadInspectorData) {
        leadInspectorId = leadInspectorData.id;
      }
    }

    // Logika untuk mencari atau membuat proyek
    let proyek = await prisma.proyek.findFirst({
      where: { namaProyek: pekerjaan },
    });

    if (!proyek) {
      proyek = await prisma.proyek.create({
        data: {
          namaProyek: pekerjaan,
          klien: klien,
          // Menggabungkan array lokasi menjadi string tunggal
          lokasi: Array.isArray(lokasi_pekerjaan) ? lokasi_pekerjaan.join(', ') : (lokasi_pekerjaan || "N/A"),
        },
      });
    }

    // Membuat Surat Tugas dan menghubungkan relasi dalam satu operasi create
    const newSuratTugas = await prisma.suratTugas.create({
      data: {
        nomor_surat: nomor_surat || null,
        status_pekerjaan,
        no_service_order: no_service_order || null,
        spi: spi || null,
        wbs: wbs || null,
        bidang_pekerjaan,
        peralatan_inspeksi: Array.isArray(peralatan_inspeksi) ? peralatan_inspeksi : [],
        kebutuhan_material: Array.isArray(kebutuhan_material) ? kebutuhan_material.filter(m => m && m.trim() !== '') : [],
        tanggal_berangkat: tanggal_berangkat ? new Date(tanggal_berangkat) : null,
        tanggal_kembali: tanggal_kembali ? new Date(tanggal_kembali) : null,
        transportasi_operasional: !!transportasi_operasional,
        transportasi_ditanggung_klien: !!transportasi_ditanggung_klien,
        transportasi_asal_tujuan: !!transportasi_asal_tujuan,
        transportasi_dinas: !!transportasi_dinas,
        tiket: !!tiket,
        penginapan: !!penginapan,
        keterangan_lain,
        status: status || 'DRAFT', // Default ke DRAFT jika tidak ada status
        
        // Menghubungkan ke proyek yang sudah ada atau baru dibuat via ID
        proyekId: proyek.id,

        // Menghubungkan lead inspector menggunakan ID
        leadInspectorId: leadInspectorId,
        
        // Menghubungkan tim inspektor langsung menggunakan NUP
        timInspektor: {
          connect: pegawaiNupList_valid.map((nup: string) => ({ nup })),
        },
        
        // Menghubungkan pembuat surat jika ID-nya diberikan
        dibuatOlehId: dibuatOlehId ? parseInt(dibuatOlehId) : null,
        
      },
    });

    return NextResponse.json({ message: 'Surat tugas berhasil dibuat!', data: newSuratTugas }, { status: 201 });

  } catch (error: unknown) {
    console.error("Error saat membuat surat tugas:", error);
    if (typeof error === 'object' && error !== null && 'code' in error) {
      const errorCode = (error as { code: string }).code;
      if (errorCode === 'P2002') {
        return NextResponse.json({ error: 'Nomor surat sudah ada.' }, { status: 409 });
      }
      if (errorCode === 'P2025') {
        return NextResponse.json({ error: 'Satu atau lebih data (pegawai atau pembuat) tidak ditemukan untuk dihubungkan.' }, { status: 404 });
      }
    }
    return NextResponse.json({ error: 'Terjadi kesalahan pada server.' }, { status: 500 });
  }
}

// API untuk mengambil surat tugas dengan filter berdasarkan NUP (GET)
export async function GET(req: NextRequest) {
    try {
        // Ambil NIK dari cookies
        const cookieStore = await cookies();
        const nik = cookieStore.get('nik')?.value;
        
        if (!nik) {
            return NextResponse.json({ error: 'User tidak terautentikasi.' }, { status: 401 });
        }

        //
        const pegawai = await prisma.pegawai.findFirst({ 
            where: { nik }, 
            select: { 
                id: true,
                nup: true,
                nik: true, 
                nama_pegawai: true 
            } 
        });

        if (!pegawai) {
            return NextResponse.json({ error: 'Data pegawai tidak ditemukan.' }, { status: 404 });
        }

        const userId = pegawai.id;
        const userNup = pegawai.nup;

        // Ambil parameter query untuk menentukan jenis filter
        const { searchParams } = new URL(req.url);
        const showAll = searchParams.get('showAll') === 'true'; // Parameter untuk admin/supervisor
        
        let whereCondition = {};
        
        // Jika bukan showAll, filter berdasarkan keterlibatan pegawai yang login
        if (!showAll) {
            whereCondition = {
                OR: [
                    // Pegawai adalah anggota tim inspektor
                    {
                        timInspektor: {
                            some: {
                                nup: userNup
                            }
                        }
                    },
                    // Pegawai adalah lead inspector
                    {
                        leadInspectorId: userId
                    },
                    // Pegawai adalah koordinator
                    {
                        koordinatorId: userId
                    },
                    // Pegawai adalah senior manager
                    {
                        seniorManagerId: userId
                    },
                    // Pegawai adalah kepala cabang
                    {
                        kepalaCabangId: userId
                    },
                    // Pegawai adalah pembuat surat
                    {
                        dibuatOlehId: userId
                    }
                ]
            };
        }

        // Query surat tugas dengan kondisi filter
        const allSuratTugas = await prisma.suratTugas.findMany({
            where: whereCondition,
            include: {
                timInspektor: {
                    select: {
                        id: true,
                        nama_pegawai: true,
                        nup: true
                    }
                },
                proyek: {
                    select: {
                        id: true,
                        namaProyek: true,
                        klien: true,
                        lokasi: true
                    }
                },
                leadInspector: {
                    select: {
                        id: true,
                        nama_pegawai: true,
                        nup: true
                    }
                },
                koordinator: {
                    select: {
                        id: true,
                        nama_pegawai: true,
                        nup: true
                    }
                },
                seniorManager: {
                    select: {
                        id: true,
                        nama_pegawai: true,
                        nup: true
                    }
                },
                kepalaCabang: {
                    select: {
                        id: true,
                        nama_pegawai: true,
                        nup: true
                    }
                },
                dibuatOleh: {
                    select: {
                        id: true,
                        nama_pegawai: true,
                        nup: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Tambahkan informasi peran user dalam setiap surat tugas
        const enrichedSuratTugas = allSuratTugas.map(surat => ({
            ...surat,
            userRole: {
                isTeamMember: surat.timInspektor.some(tim => tim.nup === userNup),
                isLeadInspector: surat.leadInspectorId === userId,
                isKoordinator: surat.koordinatorId === userId,
                isSeniorManager: surat.seniorManagerId === userId,
                isKepalaCabang: surat.kepalaCabangId === userId,
                isPembuat: surat.dibuatOlehId === userId,
                userNup: userNup,
                userId: userId
            }
        }));

        return NextResponse.json({
            data: enrichedSuratTugas,
            totalCount: enrichedSuratTugas.length,
            userInfo: {
                id: userId,
                nup: userNup,
                nama: pegawai.nama_pegawai
            }
        });

    } catch (error) {
        console.error("Error saat mengambil data surat tugas:", error);
        return NextResponse.json({ error: 'Terjadi kesalahan pada server.' }, { status: 500 });
    }
}

// API untuk mengambil semua surat tugas (untuk admin/supervisor)
