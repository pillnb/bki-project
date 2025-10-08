// app/api/sertifikat/auth/login/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { SignJWT } from 'jose';

const SECRET_KEY = new TextEncoder().encode(
  process.env.SERTIFIKAT_JWT_SECRET || 'your-secret-key-change-this'
);

export async function POST(request: NextRequest) {
  try {
    const { nup } = await request.json();

    // Validasi input
    if (!nup || typeof nup !== 'string') {
      return NextResponse.json(
        { error: 'NUP wajib diisi' },
        { status: 400 }
      );
    }

    // Cek apakah NUP ada di database
    const pegawai = await prisma.pegawai.findUnique({
      where: { nup: nup.trim() },
      select: {
        id: true,
        nup: true,
        nama_pegawai: true,
        jabatan: true,
        email: true
      }
    });

    if (!pegawai) {
      return NextResponse.json(
        { error: 'NUP tidak ditemukan dalam database' },
        { status: 401 }
      );
    }

    // Generate JWT token untuk session
    const token = await new SignJWT({
      userId: pegawai.id,
      nup: pegawai.nup,
      nama: pegawai.nama_pegawai,
      type: 'sertifikat'
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('8h') // Session 8 jam
      .sign(SECRET_KEY);

    // Set cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: pegawai.id,
        nup: pegawai.nup,
        nama: pegawai.nama_pegawai,
        jabatan: pegawai.jabatan,
        email: pegawai.email
      }
    });

    response.cookies.set('sertifikat_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 8 // 8 hours
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat login' },
      { status: 500 }
    );
  }
}