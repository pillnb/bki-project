import { google } from "googleapis";
import { createOAuthClient } from "./googleOAuth";
import prisma from "./prisma";

export async function getDriveForOwner(ownerEmail: string) {
  const row = await prisma.googleOAuthToken.findUnique({ where: { ownerEmail } });
  if (!row) throw new Error("OAuth tokens not found for this ownerEmail");

  const oauth = createOAuthClient();
  oauth.setCredentials({
    access_token: row.accessToken || undefined,
    refresh_token: row.refreshToken || undefined,
    scope: row.scope || undefined,
    token_type: row.tokenType || undefined,
    expiry_date: row.expiryDate ? Number(row.expiryDate) : undefined,
  });

  // simpan token refresh yang baru jika Google kasih token baru
  oauth.on("tokens", async (t) => {
    try {
      await prisma.googleOAuthToken.update({
        where: { ownerEmail },
        data: {
          accessToken: t.access_token ?? row.accessToken,
          // jangan timpa refresh kalau tidak ada
          ...(t.refresh_token ? { refreshToken: t.refresh_token } : {}),
          expiryDate: t.expiry_date ? BigInt(t.expiry_date) : row.expiryDate,
          scope: t.scope ?? row.scope,
          tokenType: t.token_type ?? row.tokenType,
        },
      });
    } catch {
      // non fatal
    }
  });

  return google.drive({ version: "v3", auth: oauth });
}