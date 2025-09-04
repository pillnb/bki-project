import { NextResponse } from "next/server";

export async function POST() {
  // Hapus cookie token (atau cookie auth lain yang lo pake)
  const res = NextResponse.json({ message: "Logged out" });
  res.cookies.set("token", "", { maxAge: 0, path: "/" });
  return res;
}