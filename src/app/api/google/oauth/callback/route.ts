import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { createOAuthClient } from "@/lib/googleOAuth";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const code = new URL(req.url).searchParams.get("code");
    if (!code) return NextResponse.json({ error: "Missing code" }, { status: 400 });

    const oauth = createOAuthClient();
    const { tokens } = await oauth.getToken(code);
    oauth.setCredentials(tokens);

    // ambil email pemilik dari Drive About, cukup scope drive
    const drive = google.drive({ version: "v3", auth: oauth });
    const about = await drive.about.get({ fields: "user(emailAddress,displayName)" });
    const ownerEmail = about.data.user?.emailAddress;
    if (!ownerEmail) return NextResponse.json({ error: "Cannot determine owner email" }, { status: 400 });

    await prisma.googleOAuthToken.upsert({
      where: { ownerEmail },
      create: {
        ownerEmail,
        accessToken: tokens.access_token || null,
        refreshToken: tokens.refresh_token || null, // first time biasanya ada
        scope: tokens.scope || null,
        tokenType: tokens.token_type || null,
        expiryDate: tokens.expiry_date ? BigInt(tokens.expiry_date) : null,
      },
      update: {
        accessToken: tokens.access_token || null,
        ...(tokens.refresh_token ? { refreshToken: tokens.refresh_token } : {}),
        scope: tokens.scope || null,
        tokenType: tokens.token_type || null,
        expiryDate: tokens.expiry_date ? BigInt(tokens.expiry_date) : null,
      },
    });

    return NextResponse.json({ ok: true, ownerEmail });
  } catch (err: any) {
    console.error("[oauth callback] error:", err?.message || err);
    return NextResponse.json({ error: err?.message || "OAuth callback failed" }, { status: 500 });
  }
}