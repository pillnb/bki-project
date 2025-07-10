import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { StatusPelatihan } from '@/generated/prisma';

// Fungsi GET untuk mengambil data pelatihan
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const nupParam = searchParams.get('nup');
    
    let nup: string;
    
    if (nupParam) {
      // Jika NUP diberikan sebagai parameter, gunakan itu
      nup = nupParam;
    } else {
      // Jika tidak, ambil dari cookie
      const cookieStore = cookies();
      const nik = cookieStore.get('nik')?.value;

      if (!nik) {
        return NextResponse.json({ error: 'Otentikasi dibutuhkan, NIK tidak ditemukan di cookie.' }, { status: 401 });
      }

      // Cari pegawai berdasarkan NIK untuk mendapatkan NUP
      const pegawai = await prisma.pegawai.findFirst({
        where: { nik: nik },
        select: { nup: true },
      });

      if (!pegawai || !pegawai.nup) {
        return NextResponse.json({ error: 'Pegawai tidak ditemukan atau tidak memiliki NUP.' }, { status: 404 });
      }
      
      nup = pegawai.nup;
    }

    // Ambil semua pelatihan yang cocok dengan NUP pegawai
    const trainings = await prisma.pelatihan.findMany({
      where: { nup: nup },
      orderBy: { tanggal_awal: 'desc' },
    });

    // Map data untuk konsistensi dengan frontend
    const mappedTrainings = trainings.map(training => ({
      id: training.id_pelatihan,
      nama: training.nama_pelatihan,
      penyelenggara: training.penyelenggara,
      tanggalMulai: training.tanggal_awal.toISOString(),
      tanggalSelesaiEstimasi: training.tanggal_akhir.toISOString(),
      tahun: training.tahun,
      status: training.status,
      tanggalSelesaiAktual: training.tanggal_akhir?.toISOString(),
      noSertifikat: training.nomor_sertifikat,
      tanggalKadaluarsa: training.masa_berlaku?.toISOString(),
      file_url: training.file_sertifikat
    }));

    return NextResponse.json(mappedTrainings);

  } catch (error) {
    console.error("API Error - Gagal mengambil data training:", error);
    return NextResponse.json({ error: 'Gagal mengambil data training dari server.' }, { status: 500 });
  }
}

// Fungsi POST untuk menambah pelatihan baru
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nup, nama_pelatihan, penyelenggara, tanggal_awal, tanggal_akhir, masa_berlaku, tahun } = body;

    // Validasi input
    if (!nup || !nama_pelatihan || !penyelenggara || !tanggal_awal || !tanggal_akhir || !tahun) {
      return NextResponse.json({ error: 'Data yang diperlukan tidak lengkap.' }, { status: 400 });
    }

    // Tentukan status berdasarkan tanggal
    const tanggalAwalDate = new Date(tanggal_awal);
    const masaBerlakuDate = new Date(masa_berlaku);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let status: keyof typeof StatusPelatihan = "VALID";
    if (today < tanggalAwalDate) {
      status = "ON_GOING";
    } else if (today >= tanggalAwalDate && today <= masaBerlakuDate) {
      status = "VALID";
    } else if (today > masaBerlakuDate) {
      status = "EXPIRED";
    }

    // Buat pelatihan baru
    const newTraining = await prisma.pelatihan.create({
      data: {
        nup,
        nama_pelatihan,
        penyelenggara,
        tanggal_awal: tanggalAwalDate,
        tanggal_akhir: new Date(tanggal_akhir),
        masa_berlaku: masaBerlakuDate,
        tahun: parseInt(tahun),
        status: StatusPelatihan[status],
      },
    });

    // Map response untuk konsistensi dengan frontend
    const mappedResponse = {
      id: newTraining.id_pelatihan,
      nama: newTraining.nama_pelatihan,
      penyelenggara: newTraining.penyelenggara,
      tanggalMulai: newTraining.tanggal_awal.toISOString(),
      tanggalSelesaiEstimasi: newTraining.tanggal_akhir.toISOString(),
      tahun: newTraining.tahun,
      status: newTraining.status,
      tanggalSelesaiAktual: newTraining.tanggal_akhir?.toISOString(),
      noSertifikat: newTraining.nomor_sertifikat,
      tanggalKadaluarsa: newTraining.masa_berlaku?.toISOString(),
    };

    return NextResponse.json(mappedResponse, { status: 201 });

  } catch (error) {
    console.error("API Error - Gagal menambah training:", error);
    return NextResponse.json({ error: 'Gagal menambah training ke database.' }, { status: 500 });
  }
}

// Fungsi PATCH untuk update pelatihan (menyelesaikan training)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id_pelatihan, data } = body;

    if (!id_pelatihan || !data) {
      return NextResponse.json({ error: 'ID pelatihan dan data update diperlukan.' }, { status: 400 });
    }

    const { nomor_sertifikat, tanggal_akhir, masa_berlaku, file_url } = data;

    // Update pelatihan
    const updatedTraining = await prisma.pelatihan.update({
      where: { id_pelatihan: parseInt(id_pelatihan) },
      data: {
        nomor_sertifikat,
        tanggal_akhir: new Date(tanggal_akhir),
        masa_berlaku: new Date(masa_berlaku),
        status: StatusPelatihan.VALID,
        file_sertifikat: file_url,
      },
    });

    // Map response untuk konsistensi dengan frontend
    const mappedResponse = {
      id: updatedTraining.id_pelatihan,
      nama: updatedTraining.nama_pelatihan,
      penyelenggara: updatedTraining.penyelenggara,
      tanggalMulai: updatedTraining.tanggal_awal.toISOString(),
      tanggalSelesaiEstimasi: updatedTraining.tanggal_akhir.toISOString(),
      tahun: updatedTraining.tahun,
      status: updatedTraining.status,
      tanggalSelesaiAktual: updatedTraining.tanggal_akhir?.toISOString(),
      noSertifikat: updatedTraining.nomor_sertifikat,
      tanggalKadaluarsa: updatedTraining.masa_berlaku?.toISOString(),
    };

    return NextResponse.json(mappedResponse);

  } catch (error) {
    console.error("API Error - Gagal update training:", error);
    return NextResponse.json({ error: 'Gagal update training di database.' }, { status: 500 });
  }
}