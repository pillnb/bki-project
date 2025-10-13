import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  // hapus cookie 'nik' (nama harus sama persis dengan saat set di login)
  res.cookies.set("nik", "", {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0, // penting: expire sekarang
  });
  return res;
}
