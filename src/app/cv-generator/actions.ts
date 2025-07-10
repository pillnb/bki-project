"use server";
import prisma from "@/lib/prisma";
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
  status_override?: string; // optional, for manual status selection
};


export async function tambahKualifikasi(nup: string, data: KualifikasiData) {
  if (!nup) throw new Error("NUP Pegawai tidak valid.");

  const tanggalAwalDate = new Date(data.tanggal_awal);
  const tanggalAkhirDate = new Date(data.tanggal_akhir);
  const masaBerlakuDate = new Date(data.masa_berlaku);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Status logic:
  // - "Belum Berlaku" jika today < tanggal_awal
  // - "Sedang Berlangsung" jika today >= tanggal_awal && today <= tanggal_akhir
  // - "Valid" jika today > tanggal_akhir && today <= masa_berlaku
  // - "Expired" jika today > masa_berlaku
  let status = "Valid";
  if (data.status_override) {
    status = data.status_override;
  } else {
    if (today < tanggalAwalDate) {
      status = "Belum Berlaku";
    } else if (today >= tanggalAwalDate && today <= tanggalAkhirDate) {
      status = "Sedang Berlangsung";
    } else if (today > tanggalAkhirDate && today <= masaBerlakuDate) {
      status = "Valid";
    } else if (today > masaBerlakuDate) {
      status = "Expired";
    }
  }

  await prisma.pelatihan.create({
    data: {
      nup,
      kualifikasi: data.kualifikasi,
      penyelenggara: data.penyelenggara,
      nomor_sertifikat: data.nomor_sertifikat,
      tanggal_awal: tanggalAwalDate,
      tanggal_akhir: tanggalAkhirDate,
      masa_berlaku: masaBerlakuDate,
      status: status,
      keterangan_utilisasi: data.keterangan_utilisasi,
      tahun: data.tahun,
    },
  });
  revalidatePath("/cv-generator");
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