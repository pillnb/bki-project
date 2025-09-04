import type { drive_v3 } from "googleapis";

export function sanitize(name: string) {
  return (name || "Unknown").replace(/[\\/:*?"<>|]+/g, " ").replace(/\s+/g, " ").trim();
}
export function esc(str: string) {
  return String(str || "").replace(/'/g, "\\'");
}

export async function getOrCreateFolder(drive: drive_v3.Drive, name: string, parentId: string) {
  const safe = sanitize(name);
  const q = [
    "mimeType='application/vnd.google-apps.folder'",
    `name='${esc(safe)}'`,
    `'${parentId}' in parents`,
    "trashed=false",
  ].join(" and ");

  const list = await drive.files.list({
    q,
    fields: "files(id,name)",
    pageSize: 1,
  });
  if (list.data.files?.length) return list.data.files[0].id as string;

  const created = await drive.files.create({
    requestBody: { name: safe, mimeType: "application/vnd.google-apps.folder", parents: [parentId] },
    fields: "id,name,parents",
  });
  if (!created.data.id) throw new Error("Gagal membuat folder");
  return created.data.id as string;
}