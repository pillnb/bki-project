// lib/services/googleDriveService.ts

import { getDriveForOwner } from '@/lib/getDrive';
import { Readable } from 'stream';

interface QRCodeData {
  nomorSertifikat: string;
  createdAt: Date;
  linkLaporan: string;
}

export class GoogleDriveService {
  private static FOLDER_ID = process.env.GOOGLE_DRIVE_QR_FOLDER_ID!;
  private static OWNER_EMAIL = process.env.GOOGLE_OAUTH_OWNER_EMAIL || 'bpcoperasi@gmail.com';

  /**
   * Generate QR Code content string
   */
  private static generateQRContent(data: QRCodeData): string {
    const formattedDate = new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(data.createdAt);

    return `Nomor Sertifikat: ${data.nomorSertifikat}

Diterbitkan oleh PT. Biro Klasifikasi Indonesia (Persero) pada tanggal ${formattedDate}

Link laporan inspeksi: ${data.linkLaporan}`;
  }

  /**
   * Generate QR Code image from external API
   */
  // Return raw bytes (Uint8Array) instead of relying on global Buffer
  private static async generateQRCodeImage(content: string): Promise<Uint8Array> {
    const primaryUrl = `https://api.qrserver.com/v1/create-qr-code/?size=512x512&data=${encodeURIComponent(content)}`;

    try {
      const response = await fetch(primaryUrl);
      if (response.ok) {
        const ab = await response.arrayBuffer();
        return new Uint8Array(ab);
      }
    } catch (error) {
      console.warn('Primary QR service failed, trying fallback...', error);
    }

    // Fallback to alternative service
    const fallbackUrl = `https://quickchart.io/qr?size=512&text=${encodeURIComponent(content)}`;
    const response = await fetch(fallbackUrl);

    if (!response.ok) {
      throw new Error(`QR Code generation failed: ${response.statusText}`);
    }

    const ab = await response.arrayBuffer();
    return new Uint8Array(ab);
  }

  /**
   * Create safe filename from nomor sertifikat
   */
  private static sanitizeFilename(nomorSertifikat: string): string {
    return nomorSertifikat
      .replace(/[^\w\-./]+/g, '_')
      .slice(0, 150) + '.png';
  }

  /**
   * Upload QR Code to Google Drive menggunakan helper yang sudah ada
   */
  static async uploadQRCode(data: QRCodeData): Promise<{
    fileId: string;
    viewUrl: string;
    imageUrl: string;
  }> {
    try {
      console.log('[gdrive] uploadQRCode start for', data.nomorSertifikat);
      const drive = await getDriveForOwner(this.OWNER_EMAIL);
      console.log('[gdrive] obtained drive client for owner=', this.OWNER_EMAIL, 'driveExists=', !!drive);

      const qrContent = this.generateQRContent(data);
      const imageBuffer = await this.generateQRCodeImage(qrContent);
      console.log('[gdrive] generated QR image bytes:', imageBuffer?.byteLength ?? null);

      const fileName = this.sanitizeFilename(data.nomorSertifikat);

      // Upload langsung dengan drive.files.create
      console.log('[gdrive] Readable.from available=', typeof Readable?.from === 'function');
      const stream = Readable.from(imageBuffer);
      console.log('[gdrive] created Readable stream from Uint8Array');

      let uploaded: any = null;
      try {
        uploaded = await drive.files.create({
          requestBody: {
            name: fileName,
            parents: [this.FOLDER_ID],
            mimeType: 'image/png'
          },
          media: {
            mimeType: 'image/png',
            body: stream
          },
          fields: 'id,name,webViewLink',
          supportsAllDrives: true
        });
        console.log('[gdrive] drive.files.create returned, data.id=', uploaded?.data?.id);
      } catch (upErr) {
        console.error('[gdrive] drive.files.create error:', upErr && (upErr as Error).message, upErr);
        throw upErr;
      }

      if (!uploaded?.data?.id) {
        throw new Error('Upload failed: no file ID returned');
      }

      const fileId = uploaded.data.id;

      // Make publicly accessible
      try {
        await drive.permissions.create({
          fileId,
          requestBody: { role: 'reader', type: 'anyone' },
          supportsAllDrives: true
        });
        console.log('[gdrive] permissions.create succeeded for fileId=', fileId);
      } catch (permErr) {
        console.error('[gdrive] permissions.create failed:', permErr && (permErr as Error).message, permErr);
        // continue even if permission fails
      }

      console.log('[gdrive] uploadQRCode success for', data.nomorSertifikat, 'fileId=', fileId);

      return {
        fileId,
        viewUrl: `https://drive.google.com/file/d/${fileId}/view`,
        imageUrl: `https://drive.google.com/uc?export=download&id=${fileId}`
      };

    } catch (error) {
      console.error('[gdrive] Failed to upload QR Code to Drive:', error && (error as Error).message, error);
      // rethrow original error so caller sees it
      throw error;
    }
  }

  /**
   * Delete QR Code from Drive (optional, for cleanup)
   */
  static async deleteQRCode(fileId: string): Promise<void> {
    try {
      const drive = await getDriveForOwner(this.OWNER_EMAIL);
      await drive.files.delete({ fileId });
    } catch (error) {
      console.error('Failed to delete QR Code from Drive:', error);
      // Non-critical, don't throw
    }
  }
}