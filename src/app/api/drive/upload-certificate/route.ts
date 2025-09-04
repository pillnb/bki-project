import { NextResponse } from "next/server";
import { PassThrough } from "stream";
import { getDriveForOwner } from "@/lib/getDrive";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function sanitize(name: string) {
  return (name || "Unknown").replace(/[\\/:*?"<>|]+/g, " ").replace(/\s+/g, " ").trim();
}
function esc(str: string) {
  return String(str || "").replace(/'/g, "\\'");
}

async function getOrCreateFolder(drive: any, name: string, parentId: string) {
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

export async function POST(req: Request) {
  try {
    const form = await req.formData();

    const file = form.get("file") as unknown as File | null;
    const nup = String(form.get("nup") || "");
    const namaPegawai = String(form.get("namaPegawai") || "");
    const namaTraining = String(form.get("namaTraining") || "");
    const penyelenggara = String(form.get("penyelenggara") || "");
    const tahun = String(form.get("tahun") || "");

    if (!file) return NextResponse.json({ error: "File sertifikat wajib diupload" }, { status: 400 });

    const rootId = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID;
    if (!rootId) return NextResponse.json({ error: "GOOGLE_DRIVE_ROOT_FOLDER_ID belum diset" }, { status: 500 });

    // pilih owner yang tokennya sudah tersimpan di DB
    const ownerEmail = process.env.GOOGLE_OAUTH_OWNER_EMAIL!;
    const drive = await getDriveForOwner(ownerEmail);

    // ROOT / "<Nama Pegawai> (<NUP>)" / "<Nama Training> - <Penyelenggara> - <Tahun>"
    const userFolderName = nup ? `${sanitize(namaPegawai)} (${sanitize(nup)})` : sanitize(namaPegawai);
    const userFolderId = await getOrCreateFolder(drive, userFolderName, rootId);
    const trainingFolderName = `${sanitize(namaTraining)} - ${sanitize(penyelenggara)} - ${sanitize(tahun)}`;
    const trainingFolderId = await getOrCreateFolder(drive, trainingFolderName, userFolderId);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mime = (file as any).type || "application/pdf";
    const name = sanitize(file.name) || `sertifikat-${Date.now()}.pdf`;

    const pt = new PassThrough();
    pt.end(buffer);

    const uploaded = await drive.files.create({
      requestBody: { name, parents: [trainingFolderId], mimeType: mime },
      media: { mimeType: mime, body: pt },
      fields: "id,name,parents,webViewLink,webContentLink",
    });

    const fileId = uploaded.data.id || "";
    if (!fileId) return NextResponse.json({ error: "Gagal mendapatkan ID file dari Google Drive" }, { status: 500 });

    if (process.env.DRIVE_SHARE_ANYONE === "true") {
      try {
        await drive.permissions.create({
          fileId,
          requestBody: { role: "reader", type: "anyone" },
        });
      } catch (e) {
        console.error("Gagal set permission anyoneWithLink", e);
      }
    }

    const info = await drive.files.get({
      fileId,
      fields: "id,name,parents,webViewLink,webContentLink",
    });

    return NextResponse.json({
      id: info.data.id,
      name: info.data.name,
      parents: info.data.parents,
      webViewLink: info.data.webViewLink,
      webContentLink: info.data.webContentLink,
      trainingFolderId,
      userFolderId,
    });
  } catch (e: any) {
    console.error("Upload to Drive failed:", e?.message || e);
    return NextResponse.json({ error: e?.message || "Gagal upload ke Google Drive" }, { status: 500 });
  }
}