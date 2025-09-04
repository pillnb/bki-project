import { NextResponse } from "next/server";
import { createOAuthClient } from "@/lib/googleOAuth";

export const runtime = "nodejs";

export async function GET() {
  const oauth = createOAuthClient();
  const url = oauth.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: ["https://www.googleapis.com/auth/drive"],
  });
  return NextResponse.redirect(url);
}