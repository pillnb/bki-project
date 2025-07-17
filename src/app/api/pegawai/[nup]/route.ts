// Mapping status pelatihan agar sesuai enum Prisma
function mapStatusPelatihan(status: string) {
  if (status === 'ON_GOING') return 'ON_GOING';
  if (status === 'EXPIRED') return 'EXPIRED';
  return 'VALID';
}
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// ✅ PERBAIKAN: Await params untuk Next.js 15
export async function GET(req: NextRequest, { params }: { params: Promise<{ nup: string }> }) {
  const { nup } = await params;
  try {
    const pegawai = await prisma.pegawai.findUnique({
      where: { nup },
      include: {
        pengalaman_kerja: true,
        pelatihan: true,
      },
    });

    if (!pegawai) {
      return NextResponse.json({ error: 'Data pegawai tidak ditemukan' }, { status: 404 });
    }

    // Map pengalaman_kerja agar field konsisten dengan schema dan frontend
    const pengalaman_kerja = Array.isArray(pegawai.pengalaman_kerja)
      ? pegawai.pengalaman_kerja.map((exp) => ({
          id: exp.id_pengalaman,
          pengalaman_kerja: exp.pengalaman_kerja, // nama pengalaman/posisi
          perusahaan: exp.perusahaan,
          tahun: exp.tahun,
          lokasi: exp.lokasi,
        }))
      : [];

    const pelatihan = Array.isArray(pegawai.pelatihan) ? pegawai.pelatihan : [];

    const result = {
      ...pegawai,
      pengalaman_kerja,
      pelatihan,
      kualifikasi: pelatihan,
    };
    return NextResponse.json(result);

  } catch (error: unknown) {
    // Log error safely
    if (error instanceof Error) {
      console.error('API Error - Gagal mengambil data pegawai:', error.message, error.stack);
      // Prisma error code check (optional chaining)
      // @ts-ignore
      if (typeof error === 'object' && error !== null && 'code' in error && (error as any).code === 'P2025') {
        return NextResponse.json({ error: 'Data pegawai tidak ditemukan' }, { status: 404 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      console.error('API Error - Gagal mengambil data pegawai:', error);
      return NextResponse.json({ error: 'Gagal mengambil data pegawai dari server.' }, { status: 500 });
    }
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ nup: string }> }) {
  const { nup } = await params;

  try {
    const body = await req.json();

    const pegawaiData: any = {
      nama_pegawai: body.nama_pegawai,
      nik: body.nik,
      email: body.email,
      no_telepon: body.no_telepon,
      tempat_lahir: body.tempat_lahir,
      tanggal_lahir: body.tanggal_lahir ? new Date(body.tanggal_lahir) : null,
      alamat: body.alamat,
      agama: body.agama,
      warga_negara: body.warga_negara,
      jabatan: body.jabatan,
      status_pegawai: body.status_pegawai,
      username: body.username,
      jenjang_pend: body.jenjang_pend,
      pendidikan: body.pendidikan,
      tahun_pend: body.tahun_pend ? parseInt(body.tahun_pend, 10) : null,
    };

    if (body.password) {
      pegawaiData.password = body.password; // Sebaiknya di-hash
    }

    // ✅ PERBAIKAN: Increased timeout and optimized transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Update data utama pegawai
      const updatedPegawai = await tx.pegawai.update({
        where: { nup },
        data: pegawaiData,
        include: {
          pengalaman_kerja: true,
          pelatihan: true,
        },
      });

      // 2. Batch operations for better performance
      const operations = [];

      // Handle Pelatihan Updates
      if (body.pelatihan && Array.isArray(body.pelatihan)) {
        const incomingPelatihan = body.pelatihan;
        
        // Get existing data once
        const existingPelatihan = await tx.pelatihan.findMany({ 
          where: { nup },
          select: { id_pelatihan: true } // Only select needed fields
        });

        const incomingIds = incomingPelatihan.map((p: any) => p.id_pelatihan).filter(Boolean);
        const existingIds = existingPelatihan.map((p) => p.id_pelatihan);

        // Delete operations first
        const toDeleteIds = existingIds.filter((id) => !incomingIds.includes(id));
        if (toDeleteIds.length > 0) {
          operations.push(
            tx.pelatihan.deleteMany({
              where: { id_pelatihan: { in: toDeleteIds } },
            })
          );
        }

        // Create new records
        const toCreate = incomingPelatihan.filter((p: any) => !p.id_pelatihan);
        if (toCreate.length > 0) {
          operations.push(
            tx.pelatihan.createMany({
              data: toCreate.map((pel: any) => ({
                nup,
                nama_pelatihan: pel.nama_pelatihan,
                penyelenggara: pel.penyelenggara,
                lokasi: pel.lokasi,
                nomor_sertifikat: pel.nomor_sertifikat,
                tahun: pel.tahun ? parseInt(pel.tahun, 10) : null,
                tanggal_awal: pel.tanggal_awal ? new Date(pel.tanggal_awal) : null,
                tanggal_akhir: pel.tanggal_akhir ? new Date(pel.tanggal_akhir) : null,
                masa_berlaku: pel.masa_berlaku ? new Date(pel.masa_berlaku) : null,
                status: mapStatusPelatihan(pel.status),
                keterangan_utilisasi: pel.keterangan_utilisasi,
              })),
            })
          );
        }

        // Update existing records
        const toUpdate = incomingPelatihan.filter((p: any) => p.id_pelatihan);
        for (const pel of toUpdate) {
          operations.push(
            tx.pelatihan.update({
              where: { id_pelatihan: pel.id_pelatihan },
              data: {
                nama_pelatihan: pel.nama_pelatihan,
                penyelenggara: pel.penyelenggara,
                lokasi: pel.lokasi,
                nomor_sertifikat: pel.nomor_sertifikat,
                tahun: pel.tahun ? parseInt(pel.tahun, 10) : null,
                tanggal_awal: pel.tanggal_awal ? new Date(pel.tanggal_awal) : null,
                tanggal_akhir: pel.tanggal_akhir ? new Date(pel.tanggal_akhir) : null,
                masa_berlaku: pel.masa_berlaku ? new Date(pel.masa_berlaku) : null,
                status: mapStatusPelatihan(pel.status),
                keterangan_utilisasi: pel.keterangan_utilisasi,
              },
            })
          );
        }
      }
      
      // Handle Pengalaman Kerja Updates
      if (body.pengalaman_kerja && Array.isArray(body.pengalaman_kerja)) {
        const incomingExp = body.pengalaman_kerja;
        
        // Get existing data once
        const existingExp = await tx.pengalaman_kerja.findMany({ 
          where: { nup },
          select: { id_pengalaman: true } // Only select needed fields
        });
        
        const incomingExpIds = incomingExp.map((e: any) => e.id_pengalaman).filter(Boolean);
        const existingExpIds = existingExp.map((e) => e.id_pengalaman);

        // Delete operations
        const expToDeleteIds = existingExpIds.filter((id) => !incomingExpIds.includes(id));
        if (expToDeleteIds.length > 0) {
          operations.push(
            tx.pengalaman_kerja.deleteMany({
              where: { id_pengalaman: { in: expToDeleteIds } },
            })
          );
        }

        // Create new records
        const expToCreate = incomingExp.filter((e: any) => !e.id_pengalaman);
        if (expToCreate.length > 0) {
          operations.push(
            tx.pengalaman_kerja.createMany({
              data: expToCreate.map((exp: any) => ({
                nup,
                pengalaman_kerja: exp.pengalaman_kerja,
                perusahaan: exp.perusahaan,
                tahun: exp.tahun ? parseInt(exp.tahun, 10) : null,
                lokasi: exp.lokasi,
              })),
            })
          );
        }
        
        // Update existing records
        const expToUpdate = incomingExp.filter((e: any) => e.id_pengalaman);
        for (const exp of expToUpdate) {
          operations.push(
            tx.pengalaman_kerja.update({
              where: { id_pengalaman: exp.id_pengalaman },
              data: {
                pengalaman_kerja: exp.pengalaman_kerja,
                perusahaan: exp.perusahaan,
                tahun: exp.tahun ? parseInt(exp.tahun, 10) : null,
                lokasi: exp.lokasi,
              },
            })
          );
        }
      }

      // Execute all operations
      if (operations.length > 0) {
        await Promise.all(operations);
      }

      // Get final result
      const finalResult = await tx.pegawai.findUnique({
        where: { nup },
        include: {
          pengalaman_kerja: true,
          pelatihan: true,
        },
      });

      return finalResult;
    }, {
      timeout: 30000, // 30 seconds timeout
      maxWait: 10000, // 10 seconds max wait
    });

    // Ensure consistent response structure
    const finalResponse = {
      ...result,
      pengalaman_kerja: Array.isArray(result?.pengalaman_kerja) ? result.pengalaman_kerja : [],
      pelatihan: Array.isArray(result?.pelatihan) ? result.pelatihan : [],
      kualifikasi: Array.isArray(result?.pelatihan) ? result.pelatihan : [],
    };
    
    return NextResponse.json(finalResponse);

  } catch (error) {
    console.error('API Error - Gagal update data pegawai:', error);
    
    // Handle specific Prisma errors
    if (error instanceof Error) {
      if (error.message.includes('Unable to start a transaction')) {
        return NextResponse.json({ 
          error: 'Database sedang sibuk, silakan coba lagi dalam beberapa saat.' 
        }, { status: 503 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ error: 'Gagal update data pegawai.' }, { status: 500 });
  }
}

// ✅ PERBAIKAN: Await params untuk Next.js 15
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ nup: string }> }) {
  const { nup } = await params;
  try {
    await prisma.$transaction(async (tx) => {
      await tx.pelatihan.deleteMany({ where: { nup } });
      await tx.pengalaman_kerja.deleteMany({ where: { nup } });
      await tx.pegawai.delete({ where: { nup } });
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Error - Gagal hapus data pegawai:', error);
    return NextResponse.json({ error: 'Gagal hapus data pegawai.' }, { status: 500 });
  }
}