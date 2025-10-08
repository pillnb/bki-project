// lib/middleware/sertifikatAuth.ts

import { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(
  process.env.SERTIFIKAT_JWT_SECRET || "your-secret-key-change-this"
);

const ADMIN_NUP = process.env.SERTIFIKAT_ADMIN_NUP || "ADMIN001"; // Set di .env

interface TokenPayload {
  userId: number;
  nup: string;
  nama: string;
  type: string;
}

/**
 * Verify user token dari cookie
 */
export async function verifyToken(
  request: NextRequest
): Promise<TokenPayload | null> {
  try {
    const token = request.cookies.get("sertifikat_token")?.value;

    if (!token) {
      return null;
    }

    const verified = await jwtVerify(token, SECRET_KEY);
    const payload = verified.payload as any;

    if (payload.type !== "sertifikat") {
      return null;
    }

    return {
      userId: payload.userId,
      nup: payload.nup,
      nama: payload.nama,
      type: payload.type,
    };
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

/**
 * Verify admin token (hanya NUP khusus yang bisa)
 */
export async function verifyAdminToken(
  request: NextRequest
): Promise<TokenPayload | null> {
  const user = await verifyToken(request);

  if (!user) {
    return null;
  }

  // Check jika NUP adalah admin
  if (user.nup !== ADMIN_NUP) {
    return null;
  }

  return user;
}

/**
 * Admin login dengan NUP + password khusus
 */
export async function verifyAdminLogin(
  nup: string,
  password: string
): Promise<boolean> {
  const adminNup = process.env.SERTIFIKAT_ADMIN_NUP || "ADMIN001";
  const adminPassword = process.env.SERTIFIKAT_ADMIN_PASSWORD || "admin123";

  return nup === adminNup && password === adminPassword;
}