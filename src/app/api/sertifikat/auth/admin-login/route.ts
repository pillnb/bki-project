// app/api/sertifikat/auth/admin-login/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { verifyAdminLogin } from '@/lib/middleware/sertifikatAuth';

const SECRET_KEY = new TextEncoder().encode(
  process.env.SERTIFIKAT_JWT_SECRET || 'your-secret-key-change-this'
);

export async function POST(request: NextRequest) {
  try {
    const { nup, password } = await request.json();

    // Validasi input
    if (!nup || !password) {
      return NextResponse.json(
        { error: 'NUP dan password wajib diisi' },
        { status: 400 }
      );
    }

    // Verify admin credentials
    const isValid = await verifyAdminLogin(nup, password);

    if (!isValid) {
      return NextResponse.json(
        { error: 'NUP atau password admin salah' },
        { status: 401 }
      );
    }

    // Generate JWT token untuk admin
    const token = await new SignJWT({
      userId: -1, // Admin ID khusus
      nup: nup,
      nama: 'Administrator Sertifikat',
      type: 'sertifikat'
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('8h')
      .sign(SECRET_KEY);

    // Set cookie
    const response = NextResponse.json({
      success: true,
      user: {
        nup: nup,
        nama: 'Administrator Sertifikat',
        role: 'admin'
      }
    });

    response.cookies.set('sertifikat_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 8
    });

    return response;

  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat login' },
      { status: 500 }
    );
  }
}