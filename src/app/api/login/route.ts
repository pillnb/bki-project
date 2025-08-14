import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs'; // 1. Import library bcryptjs

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nik, password } = body;

    if (!nik || !password) {
      return NextResponse.json({ message: 'NIK dan password harus diisi.' }, { status: 400 });
    }

    // Cari pegawai berdasarkan NIK
    const user = await prisma.pegawai.findFirst({
      where: {
        nik: nik,
      },
    });

    // Jika user tidak ditemukan, langsung kembalikan error
    if (!user) {
      return NextResponse.json({ message: 'NIK atau Password salah.' }, { status: 401 });
    }
    
    // Pastikan user memiliki password sebelum membandingkan
    if (!user.password) {
        return NextResponse.json({ message: 'Akun ini tidak memiliki password.' }, { status: 401 });
    }

    // 2. Bandingkan password yang diinput dengan hash di database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // Jika password tidak valid, kembalikan error
    if (!isPasswordValid) {
      return NextResponse.json({ message: 'NIK atau Password salah.' }, { status: 401 });
    }

    // PENTING: Jangan kirim password hash ke client
    const { password: _, ...userWithoutPassword } = user;

    // Login berhasil, siapkan respons JSON
    const response = NextResponse.json({
      message: 'Login berhasil!',
      user: userWithoutPassword, // 3. Kirim data user tanpa password
    });

    // Mengatur cookie 'nik' yang akan digunakan oleh halaman dashboard
    if(user.nik) {
        response.cookies.set('nik', user.nik, {
            path: '/',
            httpOnly: true, // Cookie tidak bisa diakses dari JavaScript sisi client
            secure: process.env.NODE_ENV === 'production', // Hanya kirim via HTTPS di production
            sameSite: 'strict',
            maxAge: 86400, // Cookie berlaku selama 1 hari (dalam detik)
        });
    }

    return response;

  } catch (error) {
    console.error("Error di API Login:", error);
    return NextResponse.json({ message: 'Terjadi kesalahan pada server.' }, { status: 500 });
  }
}