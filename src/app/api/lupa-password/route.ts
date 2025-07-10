import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: 'Email harus diisi.' }, { status: 400 });
    }

    // Cari pengguna berdasarkan email
    const user = await prisma.pegawai.findFirst({
      where: {
        email: email,
      },
    });

    // PENTING: Jangan beritahu jika email tidak ada.
    // Ini untuk mencegah orang lain menebak-nebak email yang terdaftar.
    if (user) {
      // Di aplikasi nyata, di sinilah Anda akan:
      // 1. Membuat token reset yang unik dan acak.
      // 2. Menyimpan token tersebut di database beserta waktu kadaluarsanya.
      // 3. Mengirim email ke 'user.email' berisi link reset password dengan token tadi.
      console.log(`Permintaan reset password untuk: ${email}. Di aplikasi nyata, email akan dikirim.`);
    } else {
      console.log(`Permintaan reset password untuk email tidak terdaftar: ${email}.`);
    }

    // Selalu kembalikan pesan sukses yang sama.
    return NextResponse.json(
      { message: 'Jika akun Anda terdaftar, instruksi pemulihan telah dikirim ke email Anda.' },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error di API Lupa Password:", error);
    return NextResponse.json({ message: 'Terjadi kesalahan pada server.' }, { status: 500 });
  }
}