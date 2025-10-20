// lib/utils/sertifikatUtils.ts

import { prisma } from '@/lib/prisma';

const FIX_KODE_DOKUMEN = '01';
const FIX_UNIT = 'BPC';

// Kode Produksi E yang memicu field Halaman
export const KODE_E_MULTIPAGE = ['E10', 'E17', 'E25', 'E46', 'E47', 'E48'];

export function requiresHalamanField(kodeProduksiE: string | null): boolean {
  if (!kodeProduksiE) return false;
  return KODE_E_MULTIPAGE.includes(kodeProduksiE.toUpperCase());
}

export async function getNextSequence(tahun: string): Promise<number> {
  const counter = await prisma.sertifikatCounter.upsert({
    where: { tahun },
    update: {
      sequence: { increment: 1 }
    },
    create: {
      tahun,
      sequence: 1
    }
  });

  return counter.sequence;
}

export async function generateNomorSertifikat(data: {
  nomorKontrak: string;
  kodeProduksiM?: string | null;
  kodeProduksiE?: string | null;
  kompetensi: string;
  pasar: string;
  tahun: string;
  pageNumber?: number;
  totalPages?: number;
  /**
   * Optional: supply a fixed sequence (number) so multiple pages for the same parent
   * will reuse the same seq4 value. If not provided, a next sequence is fetched.
   */
  fixedSequence?: number;
}): Promise<string> {
  // Get sequence untuk tahun ini
  const sequence = typeof data.fixedSequence === 'number' ? data.fixedSequence : await getNextSequence(data.tahun);
  const seq4 = String(sequence).padStart(4, '0');

  // Pilih kode produksi (prioritas M, fallback E)
  const kodeProduksi = data.kodeProduksiM || data.kodeProduksiE;
  if (!kodeProduksi) {
    throw new Error('Kode Produksi M atau E harus diisi');
  }

  // Format base nomor
  const baseNomor = `${seq4}-${FIX_KODE_DOKUMEN}-${FIX_UNIT}/${data.nomorKontrak}/${kodeProduksi}-${data.kompetensi}/${data.pasar}/${data.tahun}`;

  // Tambahkan suffix halaman jika multipage
  if (data.totalPages && data.totalPages > 1 && data.pageNumber) {
    const pageStr = String(data.pageNumber).padStart(2, '0');
    const totalStr = String(data.totalPages).padStart(2, '0');
    return `${baseNomor}-${pageStr}-${totalStr}`;
  }

  return baseNomor;
}

export function validateGoogleDriveLink(url: string): boolean {
  const patterns = [
    // Google Drive file/view URLs
    /^https:\/\/drive\.google\.com\/file\/d\/[A-Za-z0-9_-]+/,
    // Google Docs / Sheets / Slides
    /^https:\/\/docs\.google\.com\/(document|spreadsheets|presentation)\/d\/[A-Za-z0-9_-]+/,
    // Legacy open?id= links
    /^https:\/\/drive\.google\.com\/open\?id=[A-Za-z0-9_-]+/,
    // Google Drive folder links
    /^https:\/\/drive\.google\.com\/drive\/folders\/[A-Za-z0-9_-]+/,
    /^https:\/\/drive\.google\.com\/drive\/u\/\d+\/folders\/[A-Za-z0-9_-]+/,
    // OneDrive / SharePoint common short and full share links
    /^https:\/\/1drv\.ms\//,
    /^https:\/\/[A-Za-z0-9-]+\.sharepoint\.com\/[:A-Za-z0-9_\-@\/\.\?=,&%]+/,
    /^https:\/\/[A-Za-z0-9-]+\-my\.sharepoint\.com\/[:A-Za-z0-9_\-@\/\.\?=,&%]+/
  ];

  return patterns.some(pattern => pattern.test(url));
}

export function extractKodeProduksi(input: string, type: 'M' | 'E'): string | null {
  const regex = new RegExp(`\\b${type}\\d{2}\\b`, 'i');
  const match = input.toUpperCase().match(regex);
  return match ? match[0] : null;
}


export function extractKompetensi(input: string): string | null {
  const match = input.toUpperCase().match(/\bL\d{2}\b/);
  return match ? match[0] : null;
}

export function extractPasar(input: string): string | null {
  const match = input.toUpperCase().match(/\bP\d+\b/);
  return match ? match[0] : null;
}

export function validateSertifikatForm(data: {
  nomorKontrak: string;
  kompetensi: string;
  pasar: string;
  kodeProduksiM?: string | null;
  kodeProduksiE?: string | null;
  jumlahHalaman?: number | null;
  linkLaporan: string;
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Nomor Kontrak wajib
  if (!data.nomorKontrak?.trim()) {
    errors.push('Nomor PO/WO/SO/KONTRAK wajib diisi');
  }

  // Kompetensi wajib dan harus format L##
  const kompetensiTrimmed = data.kompetensi?.trim().toUpperCase();
  if (!kompetensiTrimmed || !/^L\d{2}$/.test(kompetensiTrimmed)) {
    errors.push('Kompetensi wajib diisi dengan format L01-L13');
  }

  // Pasar wajib dan harus format P#
  const pasarTrimmed = data.pasar?.trim().toUpperCase();
  if (!pasarTrimmed || !/^P\d+$/.test(pasarTrimmed)) {
    errors.push('Pasar wajib diisi dengan format P1-P9');
  }

  // Trim dan uppercase kode produksi
  const kodeProduksiM = data.kodeProduksiM?.trim().toUpperCase() || '';
  const kodeProduksiE = data.kodeProduksiE?.trim().toUpperCase() || '';

  // Salah satu kode produksi harus diisi
  if (!kodeProduksiM && !kodeProduksiE) {
    errors.push('Kode Produksi M atau E harus dipilih');
  }

  // Tidak boleh isi keduanya
  if (kodeProduksiM && kodeProduksiE) {
    errors.push('Pilih salah satu Kode Produksi M atau E saja');
  }

  // Validasi jumlah halaman HANYA untuk kode E tertentu
  if (kodeProduksiE && requiresHalamanField(kodeProduksiE)) {
    if (!data.jumlahHalaman || data.jumlahHalaman < 1 || data.jumlahHalaman > 200) {
      errors.push('Jumlah Halaman wajib diisi (1-200) untuk kode produksi ini');
    }
  }

  // Link laporan wajib dan harus valid
  if (!data.linkLaporan?.trim()) {
    errors.push('Link Laporan Inspeksi wajib diisi');
  } else if (!validateGoogleDriveLink(data.linkLaporan)) {
    errors.push('Link Laporan harus berupa Google Drive/Docs URL yang valid');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

export function formatTanggalIndonesia(date: Date): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
}