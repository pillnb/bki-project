import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Ambil NUP dari form (fallback tetap terima nik lama kalau masih ada)
    const rawIdentifier = (body.nup ?? body.nik ?? '').toString();
    const password = body.password?.toString() ?? '';

    const identifier = rawIdentifier.trim().toUpperCase();

    if (!identifier || !password) {
      return NextResponse.json(
        { message: 'NUP dan password harus diisi.' },
        { status: 400 }
      );
    }

    // Cari pegawai: prefer NUP, tapi izinkan input berupa NIK juga (transisi aman)
    const user = await prisma.pegawai.findFirst({
      where: {
        OR: [
          { nup: identifier },
          { nik: identifier },
        ],
      },
    });

    if (!user) {
      return NextResponse.json({ message: 'NUP atau Password salah.' }, { status: 401 });
    }

    if (!user.password) {
      return NextResponse.json({ message: 'Akun ini tidak memiliki password.' }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: 'NUP atau Password salah.' }, { status: 401 });
    }

    // Jangan bocorkan hash
    const { password: _hidden, ...userWithoutPassword } = user;

    const response = NextResponse.json({
      message: 'Login berhasil!',
      user: userWithoutPassword,
    });

    // Cookie tetap NIK agar semua koneksi lama tetap jalan
    if (user.nik) {
      response.cookies.set('nik', user.nik, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 86400,
      });
    }

    return response;
  } catch (error) {
    console.error("Error di API Login:", error);
    return NextResponse.json({ message: 'Terjadi kesalahan pada server.' }, { status: 500 });
  }
}
