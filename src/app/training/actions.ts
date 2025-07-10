"use server";
import prisma from "@/lib/prisma";
import { StatusPelatihan } from "@/generated/prisma";
import { revalidatePath } from "next/cache";

export type TrainingForm = {
  nama_pelatihan: string;
  penyelenggara: string;
  tanggal_awal: string;
  tanggal_akhir: string;
  masa_berlaku: string;
  nomor_sertifikat?: string;
  keterangan_utilisasi?: string;
  tahun: number;
  file_url?: string;
};

export async function getTrainingsByNup(nup: string) {
  return await prisma.pelatihan.findMany({
    where: { nup },
    orderBy: { tanggal_awal: "desc" },
  });
}

export async function addTraining(nup: string, data: TrainingForm) {
  const tanggalAwalDate = new Date(data.tanggal_awal);
  const masaBerlakuDate = new Date(data.masa_berlaku);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let status: keyof typeof StatusPelatihan = "VALID";
  if (today < tanggalAwalDate) {
    status = "ON_GOING";
  } else if (today >= tanggalAwalDate && today <= masaBerlakuDate) {
    status = "VALID";
  } else if (today > masaBerlakuDate) {
    status = "EXPIRED";
  }
  await prisma.pelatihan.create({
    data: {
      nup,
      nama_pelatihan: data.nama_pelatihan,
      penyelenggara: data.penyelenggara,
      tanggal_awal: tanggalAwalDate,
      tanggal_akhir: new Date(data.tanggal_akhir),
      masa_berlaku: masaBerlakuDate,
      nomor_sertifikat: data.nomor_sertifikat,
      keterangan_utilisasi: data.keterangan_utilisasi,
      tahun: data.tahun,
      status: StatusPelatihan[status],
      file_sertifikat: data.file_url,
    },
  });
  revalidatePath("/training");
}

export async function completeTraining(id_pelatihan: number, data: { nomor_sertifikat: string; tanggal_akhir: string; masa_berlaku: string; file_url?: string; }) {
  await prisma.pelatihan.update({
    where: { id_pelatihan },
    data: {
      nomor_sertifikat: data.nomor_sertifikat,
      tanggal_akhir: new Date(data.tanggal_akhir),
      masa_berlaku: new Date(data.masa_berlaku),
      status: StatusPelatihan["VALID"],
      file_sertifikat: data.file_url,
    },
  });
  revalidatePath("/training");
}
