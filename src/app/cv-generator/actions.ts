"use server";
import prisma from "@/lib/prisma";
import { StatusPelatihan } from "@/generated/prisma";
import { revalidatePath } from "next/cache";



type KualifikasiData = {
  kualifikasi: string;
  penyelenggara: string;
  nomor_sertifikat: string;
  tanggal_awal: string;
  tanggal_akhir: string; // new field
  masa_berlaku: string;
  keterangan_utilisasi: string;
  tahun: number;
  status_override?: keyof typeof StatusPelatihan; // optional, for manual status selection
};

export async function tambahKualifikasi(nup: string, data: KualifikasiData) {
  if (!nup) throw new Error("NUP Pegawai tidak valid.");

  const tanggalAwalDate = new Date(data.tanggal_awal);
  const tanggalAkhirDate = new Date(data.tanggal_akhir);
  const masaBerlakuDate = new Date(data.masa_berlaku);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Status logic baru:
  // - ON_GOING jika today < tanggal_awal
  // - VALID jika today >= tanggal_awal && today <= masa_berlaku
  // - EXPIRED jika today > masa_berlaku
  let status: keyof typeof StatusPelatihan = "VALID";
  if (data.status_override) {
    status = data.status_override;
  } else {
    if (today < tanggalAwalDate) {
      status = "ON_GOING";
    } else if (today >= tanggalAwalDate && today <= masaBerlakuDate) {
      status = "VALID";
    } else if (today > masaBerlakuDate) {
      status = "EXPIRED";
    }
  }
}

type PengalamanData = {
  pengalaman_kerja: string;
  perusahaan: string;
  tahun: number;
};

export async function tambahPengalaman(nup: string, data: PengalamanData) {
  if (!nup) throw new Error("NUP Pegawai tidak valid.");

  await prisma.pengalaman_kerja.create({
    data: {
      nup,
      pengalaman_kerja: data.pengalaman_kerja,
      perusahaan: data.perusahaan,
      tahun: data.tahun,
    },
  });
  revalidatePath("/cv-generator");
}