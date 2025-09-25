import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const nik = cookieStore.get("nik")?.value;

    if (!nik) {
      return NextResponse.json({ error: "No NIK cookie" }, { status: 401 });
    }

    const me = await prisma.pegawai.findFirst({
      where: { nik },
      select: {
        id: true,
        nup: true,
        nama_pegawai: true,
        email: true,
        status_pegawai: true,
        role: true,
      },
    });

    if (!me) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(me, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to load profile" },
      { status: 500 }
    );
  }
}