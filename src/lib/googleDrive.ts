// /lib/googleDrive.ts
import { google, drive_v3 } from "googleapis";

/**
 * Build Drive client pakai Service Account.
 * Pastikan:
 * - GOOGLE_CLIENT_EMAIL
 * - GOOGLE_PRIVATE_KEY (pakai replace \\n -> \n)
 * - Kalau pakai Service Account, share dulu satu folder My Drive kamu ke SA sebagai Editor.
 */
export function getDriveClient() {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const rawKey = process.env.GOOGLE_PRIVATE_KEY || "";
  if (!clientEmail || !rawKey) {
    throw new Error("Missing GOOGLE_CLIENT_EMAIL or GOOGLE_PRIVATE_KEY");
  }
  const auth = new google.auth.JWT({
    email: clientEmail,
    key: rawKey.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/drive"],
  });
  return google.drive({ version: "v3", auth });
}

/**
 * Ganti karakter berisiko di nama file/folder supaya aman untuk Drive query.
 */
export function sanitizeName(name: string) {
  return (name || "")
    .replace(/[\\/<>:"|?*\u0000-\u001F]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Escape tanda kutip tunggal di Drive search query.
 */
function esc(str: string) {
  return str.replace(/'/g, "\\'");
}

/**
 * Cari child folder dengan nama persis di bawah parent tertentu.
 */
export async function findChildFolderId(
  drive: drive_v3.Drive,
  parentId: string,
  childName: string
): Promise<string | null> {
  const q = [
    `name='${esc(childName)}'`,
    "mimeType='application/vnd.google-apps.folder'",
    `'${parentId}' in parents`,
    "trashed=false",
  ].join(" and ");

  const res = await drive.files.list({
    q,
    fields: "files(id,name)",
    pageSize: 1,
    includeItemsFromAllDrives: true,
    supportsAllDrives: true,
  });

  const found = res.data.files?.[0];
  return found?.id || null;
}

/**
 * Buat child folder di bawah parent.
 */
export async function createChildFolder(
  drive: drive_v3.Drive,
  parentId: string,
  name: string
): Promise<string> {
  const req = await drive.files.create({
    requestBody: {
      name,
      parents: [parentId],
      mimeType: "application/vnd.google-apps.folder",
    },
    fields: "id,name,parents",
    supportsAllDrives: true,
  });
  if (!req.data.id) {
    throw new Error("Failed to create folder");
  }
  return req.data.id;
}

/**
 * Pastikan folder ada. Kalau belum ada, buat.
 */
export async function ensureFolder(
  drive: drive_v3.Drive,
  parentId: string,
  name: string
) {
  const safe = sanitizeName(name);
  const existing = await findChildFolderId(drive, parentId, safe);
  if (existing) return existing;
  return await createChildFolder(drive, parentId, safe);
}

/**
 * Upload file buffer ke folder tertentu.
 * Return id, name, webViewLink, webContentLink.
 */
export async function uploadFileToFolder(
  drive: drive_v3.Drive,
  folderId: string,
  fileName: string,
  mimeType: string,
  buffer: Buffer
) {
  const res = await drive.files.create({
    requestBody: { name: sanitizeName(fileName), parents: [folderId], mimeType },
    media: { mimeType, body: Buffer.from(buffer) },
    fields: "id,name,parents,webViewLink,webContentLink",
    supportsAllDrives: true,
  });
  return res.data;
}

/**
 * Opsional: jadikan bisa diakses siapa saja yang punya link (reader).
 */
export async function setAnyoneWithLinkReader(
  drive: drive_v3.Drive,
  fileId: string
) {
  await drive.permissions.create({
    fileId,
    requestBody: { role: "reader", type: "anyone" },
    supportsAllDrives: true,
  });
}

/**
 * Helper utama untuk kebutuhanmu:
 * - Root folder adalah folder My Drive yang sudah di-share ke Service Account.
 * - Di bawahnya, buat folder <Nama Pegawai>.
 * - Di bawahnya, buat folder "<Nama Training> - <Penyelenggara> - <Tahun>".
 * - Upload file ke sana.
 */
export async function uploadCertificateFlow(params: {
  drive?: drive_v3.Drive;
  rootParentId: string; // folder My Drive yang di-share ke SA
  namaPegawai: string;
  namaTraining: string;
  penyelenggara: string;
  tahun: string | number;
  fileName: string;
  mimeType: string;
  buffer: Buffer;
  makeAnyoneWithLink?: boolean;
}) {
  const {
    rootParentId,
    namaPegawai,
    namaTraining,
    penyelenggara,
    tahun,
    fileName,
    mimeType,
    buffer,
    makeAnyoneWithLink,
  } = params;

  const drive = params.drive || getDriveClient();

  const pegawaiFolderId = await ensureFolder(drive, rootParentId, namaPegawai);
  const subFolderName = `${namaTraining} - ${penyelenggara} - ${tahun}`;
  const trainingFolderId = await ensureFolder(drive, pegawaiFolderId, subFolderName);

  const uploaded = await uploadFileToFolder(
    drive,
    trainingFolderId,
    fileName,
    mimeType || "application/octet-stream",
    buffer
  );

  if (makeAnyoneWithLink && uploaded.id) {
    try {
      await setAnyoneWithLinkReader(drive, uploaded.id);
    } catch (e) {
      // non fatal
      console.error("setAnyoneWithLinkReader failed", e);
    }
  }

  return {
    pegawaiFolderId,
    trainingFolderId,
    file: uploaded,
  };
}