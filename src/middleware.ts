import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPaths = ["/", "/login", "/privacy-policy", "/favicon.ico"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const nik = req.cookies.get("nik")?.value;

  const isPublic = publicPaths.some((p) => {
    if (p === "/") return pathname === "/"; 
    return pathname === p || pathname.startsWith(p + "/");
  });

  // kalau sudah login tapi buka /login, arahkan ke dashboard
  if (nik && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // kalau belum login dan bukan halaman public, arahkan ke /login
  if (!nik && !isPublic) {
    const url = new URL("/login", req.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|assets|api|.*\\.png$|.*\\.jpg$|.*\\.svg$|.*\\.ico$).*)"],
};
