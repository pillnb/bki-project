// app/api/status-personel/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface PersonnelStatus {
  id: string;
  nama_pegawai: string;
  nup: string;
  status: 'ON_DUTY' | 'READY';
  tanggal_berangkat: string | null;
  tanggal_kembali: string | null;
  lokasi_pekerjaan: string | null;
  nomor_surat: string | null;
  pekerjaan: string;
  klien: string;
  surat_tugas_id: number;
  days_remaining?: number | null;
}

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const nik = cookieStore.get('nik')?.value;
    
    if (!nik) {
      return NextResponse.json({ error: 'User tidak terautentikasi.' }, { status: 401 });
    }

    // Verify user exists
    const currentUser = await prisma.pegawai.findFirst({ 
      where: { nik }, 
      select: { id: true, nup: true, nama_pegawai: true } 
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'Data user tidak ditemukan.' }, { status: 404 });
    }

    // Get current date for status calculation
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Reset time to start of day

    // Get all surat tugas with personnel information
    const suratTugasList = await prisma.suratTugas.findMany({
      where: {
        // Only get surat tugas that are approved/active
        status: {
          in: ['DISETUJUI', 'BERJALAN', 'MENUNGGU_LEAD', 'MENUNGGU_KOORDINATOR', 'MENUNGGU_SM', 'MENUNGGU_KACAB']
        },
        // Include surat tugas with dates
        tanggal_berangkat: { not: null },
        tanggal_kembali: { not: null }
      },
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
        }
      },
      orderBy: { tanggal_berangkat: 'desc' }
    });

    // Process personnel status
    const personnelStatusMap = new Map<string, PersonnelStatus>();

    for (const suratTugas of suratTugasList) {
      const { tanggal_berangkat, tanggal_kembali } = suratTugas;
      
      if (!tanggal_berangkat || !tanggal_kembali) continue;

      const departureDate = new Date(tanggal_berangkat);
      const returnDate = new Date(tanggal_kembali);
      
      // Reset time to start of day for accurate comparison
      departureDate.setHours(0, 0, 0, 0);
      returnDate.setHours(23, 59, 59, 999); // End of return day

      // Determine if this assignment is currently active
      const isCurrentlyActive = currentDate >= departureDate && currentDate <= returnDate;
      
      // Calculate days remaining (only for active assignments)
      let daysRemaining: number | null = null;
      if (isCurrentlyActive) {
        const timeDiff = returnDate.getTime() - currentDate.getTime();
        daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      }

      // Process all team members including lead inspector
      const allPersonnel = [...suratTugas.timInspektor];
      if (suratTugas.leadInspector && !allPersonnel.find(p => p.nup === suratTugas.leadInspector?.nup)) {
        allPersonnel.push(suratTugas.leadInspector);
      }

      for (const pegawai of allPersonnel) {
        const personnelKey = pegawai.nup;
        
        // Check if we already have a more recent assignment for this person
        const existingStatus = personnelStatusMap.get(personnelKey);
        
        // Priority: Active assignments over completed ones, more recent assignments over older ones
        const shouldUpdate = !existingStatus || 
          (isCurrentlyActive && existingStatus.status === 'READY') ||
          (isCurrentlyActive === (existingStatus.status === 'ON_DUTY') && 
           new Date(tanggal_berangkat) > new Date(existingStatus.tanggal_berangkat || '1970-01-01'));

        if (shouldUpdate) {
          const status: 'ON_DUTY' | 'READY' = isCurrentlyActive ? 'ON_DUTY' : 'READY';
          
          personnelStatusMap.set(personnelKey, {
            id: pegawai.id.toString(),
            nama_pegawai: pegawai.nama_pegawai,
            nup: pegawai.nup,
            status,
            tanggal_berangkat: tanggal_berangkat.toISOString(),
            tanggal_kembali: tanggal_kembali.toISOString(),
            lokasi_pekerjaan: suratTugas.proyek?.lokasi || null,
            nomor_surat: suratTugas.nomor_surat,
            pekerjaan: suratTugas.proyek?.namaProyek || 'N/A',
            klien: suratTugas.proyek?.klien || 'N/A',
            surat_tugas_id: suratTugas.id,
            days_remaining: status === 'ON_DUTY' ? daysRemaining : null
          });
        }
      }
    }

    // Convert map to array
    const personnelStatusList = Array.from(personnelStatusMap.values());

    // Sort by status (ON_DUTY first) then by name
    personnelStatusList.sort((a, b) => {
      if (a.status !== b.status) {
        return a.status === 'ON_DUTY' ? -1 : 1;
      }
      return a.nama_pegawai.localeCompare(b.nama_pegawai);
    });

    // Calculate summary statistics
    const summary = {
      total: personnelStatusList.length,
      on_duty: personnelStatusList.filter(p => p.status === 'ON_DUTY').length,
      ready: personnelStatusList.filter(p => p.status === 'READY').length
    };

    return NextResponse.json({
      success: true,
      data: personnelStatusList,
      summary,
      updated_at: new Date().toISOString()
    });

  } catch (error: unknown) {
    console.error("Error fetching personnel status:", error);
    return NextResponse.json({ 
      error: 'Terjadi kesalahan pada server.',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Optional: Add endpoint to get status for specific personnel
export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const nik = cookieStore.get('nik')?.value;
    
    if (!nik) {
      return NextResponse.json({ error: 'User tidak terautentikasi.' }, { status: 401 });
    }

    const body = await req.json();
    const { nup_list } = body;

    if (!Array.isArray(nup_list) || nup_list.length === 0) {
      return NextResponse.json({ error: 'NUP list tidak valid.' }, { status: 400 });
    }

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // Get surat tugas for specific personnel
    const suratTugasList = await prisma.suratTugas.findMany({
      where: {
        OR: [
          { timInspektor: { some: { nup: { in: nup_list } } } },
          { leadInspector: { nup: { in: nup_list } } }
        ],
        status: {
          in: ['DISETUJUI', 'BERJALAN', 'MENUNGGU_LEAD', 'MENUNGGU_KOORDINATOR', 'MENUNGGU_SM', 'MENUNGGU_KACAB']
        },
        tanggal_berangkat: { not: null },
        tanggal_kembali: { not: null }
      },
      include: {
        timInspektor: {
          where: { nup: { in: nup_list } },
          select: { id: true, nama_pegawai: true, nup: true }
        },
        proyek: {
          select: { namaProyek: true, klien: true, lokasi: true }
        },
        leadInspector: {
          select: { id: true, nama_pegawai: true, nup: true }
        }
      },
      orderBy: { tanggal_berangkat: 'desc' }
    });

    const personnelStatusMap = new Map<string, PersonnelStatus>();

    // Process the same way as GET request
    for (const suratTugas of suratTugasList) {
      const { tanggal_berangkat, tanggal_kembali } = suratTugas;
      
      if (!tanggal_berangkat || !tanggal_kembali) continue;

      const departureDate = new Date(tanggal_berangkat);
      const returnDate = new Date(tanggal_kembali);
      
      departureDate.setHours(0, 0, 0, 0);
      returnDate.setHours(23, 59, 59, 999);

      const isCurrentlyActive = currentDate >= departureDate && currentDate <= returnDate;
      
      let daysRemaining: number | null = null;
      if (isCurrentlyActive) {
        const timeDiff = returnDate.getTime() - currentDate.getTime();
        daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      }

      const allPersonnel = [...suratTugas.timInspektor];
      if (suratTugas.leadInspector && nup_list.includes(suratTugas.leadInspector.nup)) {
        if (!allPersonnel.find(p => p.nup === suratTugas.leadInspector?.nup)) {
          allPersonnel.push(suratTugas.leadInspector);
        }
      }

      for (const pegawai of allPersonnel) {
        const personnelKey = pegawai.nup;
        const existingStatus = personnelStatusMap.get(personnelKey);
        
        const shouldUpdate = !existingStatus || 
          (isCurrentlyActive && existingStatus.status === 'READY') ||
          (isCurrentlyActive === (existingStatus.status === 'ON_DUTY') && 
           new Date(tanggal_berangkat) > new Date(existingStatus.tanggal_berangkat || '1970-01-01'));

        if (shouldUpdate) {
          const status: 'ON_DUTY' | 'READY' = isCurrentlyActive ? 'ON_DUTY' : 'READY';
          
          personnelStatusMap.set(personnelKey, {
            id: pegawai.id.toString(),
            nama_pegawai: pegawai.nama_pegawai,
            nup: pegawai.nup,
            status,
            tanggal_berangkat: tanggal_berangkat.toISOString(),
            tanggal_kembali: tanggal_kembali.toISOString(),
            lokasi_pekerjaan: suratTugas.proyek?.lokasi || null,
            nomor_surat: suratTugas.nomor_surat,
            pekerjaan: suratTugas.proyek?.namaProyek || 'N/A',
            klien: suratTugas.proyek?.klien || 'N/A',
            surat_tugas_id: suratTugas.id,
            days_remaining: status === 'ON_DUTY' ? daysRemaining : null
          });
        }
      }
    }

    const personnelStatusList = Array.from(personnelStatusMap.values());
    
    return NextResponse.json({
      success: true,
      data: personnelStatusList
    });

  } catch (error: unknown) {
    console.error("Error fetching specific personnel status:", error);
    return NextResponse.json({ 
      error: 'Terjadi kesalahan pada server.',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}