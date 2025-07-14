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