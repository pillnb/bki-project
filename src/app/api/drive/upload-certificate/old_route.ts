// // src/app/api/drive/upload-certificate/route.ts
// import { NextResponse } from "next/server";
// import { google } from "googleapis";
// import { PassThrough } from "stream";

// export const dynamic = "force-dynamic";
// export const runtime = "nodejs";

// // ---------- helpers ----------
// function sanitize(name: string) {
//   return (name || "Unknown")
//     .replace(/[\\/:*?"<>|]+/g, " ")
//     .replace(/\s+/g, " ")
//     .trim();
// }

// function esc(str: string) {
//   return String(str || "").replace(/'/g, "\\'");
// }

// function getEnv(name: string, fallback?: string) {
//   const v = process.env[name] ?? fallback;
//   if (v === undefined) throw new Error(`Missing env ${name}`);
//   return v;
// }

// // Build Google Drive client with Service Account
// async function getDrive() {
//   const email =
//     process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ||
//     process.env.GOOGLE_CLIENT_EMAIL;

//   let key =
//     process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY ||
//     process.env.GOOGLE_PRIVATE_KEY ||
//     "";

//   // Optional: allow passing full JSON creds via env
//   const jsonCred =
//     process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS ||
//     process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
//   if (!key && jsonCred) {
//     try {
//       const parsed = JSON.parse(jsonCred);
//       if (parsed.private_key) key = parsed.private_key;
//     } catch {
//       // ignore
//     }
//   }

//   // Optional: base64 private key
//   const b64 =
//     process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY_BASE64 ||
//     process.env.GOOGLE_PRIVATE_KEY_BASE64;
//   if (!key && b64) {
//     key = Buffer.from(b64, "base64").toString("utf8");
//   }

//   if (!email) throw new Error("Missing service account email env");
//   if (!key) throw new Error("Missing service account private key env");

//   key = key.replace(/\\n/g, "\n").trim();
//   if (!key.includes("BEGIN PRIVATE KEY")) {
//     throw new Error("Service account private key looks malformed");
//   }

//   const auth = new google.auth.JWT({
//     email,
//     key,
//     scopes: ["https://www.googleapis.com/auth/drive"],
//   });

//   return google.drive({ version: "v3", auth });
// }

// async function getOrCreateFolder(drive: any, name: string, parentId: string) {
//   const safe = sanitize(name);
//   const q = [
//     "mimeType='application/vnd.google-apps.folder'",
//     `name='${esc(safe)}'`,
//     `'${parentId}' in parents`,
//     "trashed=false",
//   ].join(" and ");

//   const list = await drive.files.list({
//     q,
//     fields: "files(id,name)",
//     pageSize: 1,
//     includeItemsFromAllDrives: true,
//     supportsAllDrives: true,
//   });

//   if (list.data.files?.length) return list.data.files[0].id as string;

//   const created = await drive.files.create({
//     requestBody: {
//       name: safe,
//       mimeType: "application/vnd.google-apps.folder",
//       parents: [parentId],
//     },
//     fields: "id,name,parents",
//     supportsAllDrives: true,
//   });

//   if (!created.data.id) throw new Error("Gagal membuat folder");
//   return created.data.id as string;
// }

// // ---------- route ----------
// export async function POST(req: Request) {
//   try {
//     const form = await req.formData();

//     const file = form.get("file") as unknown as File | null;
//     const nup = String(form.get("nup") || "");
//     const namaPegawai = String(form.get("namaPegawai") || "");
//     const namaTraining = String(form.get("namaTraining") || "");
//     const penyelenggara = String(form.get("penyelenggara") || "");
//     const tahun = String(form.get("tahun") || "");

//     if (!file) {
//       return NextResponse.json(
//         { error: "File sertifikat wajib diupload" },
//         { status: 400 }
//       );
//     }

//     const rootId = getEnv("GOOGLE_DRIVE_ROOT_FOLDER_ID");

//     const drive = await getDrive();

//     // Struktur: ROOT / SERTIFIKAT / "<Nama Pegawai> (<NUP>)" / "<Nama Training> - <Penyelenggara> - <Tahun>"
//     const sertifikatFolderId = await getOrCreateFolder(drive, "SERTIFIKAT", rootId);
//     const userFolderName = nup
//       ? `${sanitize(namaPegawai)} (${sanitize(nup)})`
//       : sanitize(namaPegawai);
//     const userFolderId = await getOrCreateFolder(drive, userFolderName, sertifikatFolderId);
//     const trainingFolderName = `${sanitize(namaTraining)} - ${sanitize(penyelenggara)} - ${sanitize(tahun)}`;
//     const trainingFolderId = await getOrCreateFolder(drive, trainingFolderName, userFolderId);

//     // Siapkan stream Node valid
//     const arrayBuffer = await file.arrayBuffer();
//     const buffer = Buffer.from(arrayBuffer);
//     const mime = (file as any).type || "application/octet-stream";
//     const name = sanitize(file.name) || `sertifikat-${Date.now()}`;

//     const pt = new PassThrough();
//     pt.end(buffer);

//     const uploaded = await drive.files.create({
//       requestBody: {
//         name,
//         parents: [trainingFolderId],
//         mimeType: mime,
//       },
//       media: {
//         mimeType: mime,
//         body: pt, // Node stream yang punya .pipe()
//       },
//       fields: "id,name,parents,webViewLink,webContentLink",
//       supportsAllDrives: true,
//     });

//     const fileId = uploaded.data.id || "";
//     if (!fileId) {
//       return NextResponse.json(
//         { error: "Gagal mendapatkan ID file dari Google Drive" },
//         { status: 500 }
//       );
//     }

//     // Opsional: jadikan anyone with link bisa view
//     if (process.env.DRIVE_SHARE_ANYONE === "true") {
//       try {
//         await drive.permissions.create({
//           fileId,
//           requestBody: { role: "reader", type: "anyone" },
//           supportsAllDrives: true,
//         });
//       } catch (e) {
//         // non fatal
//         console.error("Gagal set permission anyoneWithLink", e);
//       }
//     }

//     const info = await drive.files.get({
//       fileId,
//       fields: "id,name,parents,webViewLink,webContentLink",
//       supportsAllDrives: true,
//     });

//     return NextResponse.json({
//       id: info.data.id,
//       name: info.data.name,
//       parents: info.data.parents,
//       webViewLink: info.data.webViewLink,
//       webContentLink: info.data.webContentLink,
//       trainingFolderId,
//       userFolderId,
//     });
//   } catch (e: any) {
//     console.error("Upload to Drive failed:", e?.message || e);
//     return NextResponse.json(
//       { error: e?.message || "Gagal upload ke Google Drive" },
//       { status: 500 }
//     );
//   }
// }