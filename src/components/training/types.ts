export type TrainingStatus = "ON_GOING" | "VALID" | "EXPIRED";

export interface Training {
  id: number;
  nama: string;
  penyelenggara: string;
  tanggalMulai: string;
  tanggalSelesaiEstimasi: string;
  tahun: number;
  status: TrainingStatus;
  tanggalSelesaiAktual?: string;
  noSertifikat?: string;
  file?: File | string;
  fileUrl?: string;
  tanggalKadaluarsa?: string;
  file_sertifikat?: string;
  nomor_sertifikat?: string;
  webViewLink?: string;
  webContentLink?: string;
  matrixCategory: string | null;
}

export interface AddFormData {
  matrixCategory: string;
  nama: string;
  penyelenggara: string;
  tanggalMulai: string;
  tanggalSelesaiEstimasi: string;
  tahun: string;
  sudahSelesai?: boolean;
  tanggalSelesaiAktual?: string;
  noSertifikat?: string;
  tanggalKadaluarsa?: string;
  file?: File | null;
}

export interface CompleteFormData {
  id: number | null;
  tanggalSelesaiAktual: string;
  noSertifikat: string;
  file: File | null;
  tanggalKadaluarsa: string;
}

export type PegawaiLite = {
  id?: number;
  nama_pegawai?: string | null;
  status_pegawai?: string | null;
  nup?: string | null;
} | null;
