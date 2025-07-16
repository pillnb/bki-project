import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Pastikan path ini benar

export async function GET() {
  try {
    const pegawai = await prisma.pegawai.findMany({
      where: {
        role: 'pegawai',
      },
      orderBy: {
        nama_pegawai: 'asc',
      },
    });
    return NextResponse.json(pegawai);
  } catch (error) {
    console.error("API Error - Gagal mengambil data pegawai:", error);
    return NextResponse.json(
      { error: 'Gagal mengambil data pegawai dari server.' },
      { status: 500 }
    );
  }
}

// POST: Tambah pegawai baru
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Destructure and sanitize input
    const {
      nama_pegawai, nik, tempat_lahir, tanggal_lahir, alamat, no_telepon, email, agama, warga_negara,
      nup, jabatan, status_pegawai,
      jenjang_pend, pendidikan, tahun_pend,
      pengalaman_kerja = [], pelatihan = [],
      username, password, role
    } = body;

    // Basic validation
    if (!nama_pegawai || !nik || !nup || !jabatan || !status_pegawai || !username || !password) {
      return NextResponse.json({ error: 'Data wajib tidak boleh kosong.' }, { status: 400 });
    }

    // Create pegawai
    const newPegawai = await prisma.pegawai.create({
      data: {
        nama_pegawai,
        nik,
        tempat_lahir,
        tanggal_lahir: tanggal_lahir ? new Date(tanggal_lahir) : null,
        alamat,
        no_telepon,
        email,
        agama,
        warga_negara,
        nup,
        jabatan,
        status_pegawai,
        jenjang_pend,
        pendidikan,
        tahun_pend: tahun_pend ? parseInt(tahun_pend) : null,
        username,
        password,
        role: role || 'pegawai',
        // Relasi pengalaman_kerja dan pelatihan
        pengalaman_kerja: {
          create: (Array.isArray(pengalaman_kerja) ? pengalaman_kerja : []).map((exp) => ({
            tahun: exp.tahun ? parseInt(exp.tahun) : null,
            pengalaman_kerja: exp.pengalaman_kerja,
            perusahaan: exp.perusahaan,
            lokasi: exp.lokasi,
          })),
        },
        pelatihan: {
          create: (Array.isArray(pelatihan) ? pelatihan : []).map((pel) => ({
            nama_pelatihan: pel.nama_pelatihan,
            penyelenggara: pel.penyelenggara,
            lokasi: pel.lokasi,
            nomor_sertifikat: pel.nomor_sertifikat,
            tanggal_awal: pel.tanggal_awal ? new Date(pel.tanggal_awal) : null,
            tanggal_akhir: pel.tanggal_akhir ? new Date(pel.tanggal_akhir) : null,
            masa_berlaku: pel.masa_berlaku ? new Date(pel.masa_berlaku) : null,
            status: pel.status,
            keterangan_utilisasi: pel.keterangan_utilisasi,
            tahun: pel.tahun ? parseInt(pel.tahun) : null,
          })),
        },
      },
      include: {
        pengalaman_kerja: true,
        pelatihan: true,
      },
    });

    return NextResponse.json(newPegawai, { status: 201 });
  } catch (error) {
    console.error('API Error - Gagal menambah pegawai:', error);
    return NextResponse.json({ error: 'Gagal menambah pegawai ke database.' }, { status: 500 });
  }
}