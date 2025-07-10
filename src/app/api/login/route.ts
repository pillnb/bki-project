import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nik, password } = body;

    if (!nik || !password) {
      return NextResponse.json({ message: 'NIK dan password harus diisi.' }, { status: 400 });
    }

    // PERBAIKAN: Menggunakan model `pegawai` dan mencari berdasarkan kolom `nik`
    // Menggunakan findFirst karena 'nik' tidak ditandai sebagai @unique di skema Anda
    const user = await prisma.pegawai.findFirst({
      where: {
        nik: nik,
      },
    });

    // Cek jika user tidak ditemukan atau password tidak cocok
    if (!user || user.password !== password) {
      return NextResponse.json({ message: 'NIK atau Password salah.' }, { status: 401 });
    }

    // Login berhasil, siapkan respons JSON
    const response = NextResponse.json({
      message: 'Login berhasil!',
      user: {
        id: user.id,
        nama_pegawai: user.nama_pegawai,
        role: user.role,
        nik: user.nik, 
      },
    });

    // PERBAIKAN: Mengatur cookie 'nik' yang akan digunakan oleh halaman dashboard
    // 'nup' adalah ID unik, tapi karena dashboard Anda mencari berdasarkan NIK di cookie, kita set cookie 'nik' dengan nilai NIK.
    if(user.nik) {
        response.cookies.set('nik', user.nik, {
            path: '/',
            httpOnly: true,
            maxAge: 86400, // Cookie berlaku selama 1 hari
        });
    }


    return response;

  } catch (error) {
    console.error("Error di API Login:", error);
    return NextResponse.json({ message: 'Terjadi kesalahan pada server.' }, { status: 500 });
  }
}