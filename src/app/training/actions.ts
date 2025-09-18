"use server";
import prisma from "@/lib/prisma";
import { StatusPelatihan } from "@/generated/prisma";
import { revalidatePath } from "next/cache";

// 1. Tipe TrainingForm diperbarui
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
  matrixCategory?: string; // <-- Ditambahkan
};

export async function getTrainingsByNup(nup: string) {
  return await prisma.pelatihan.findMany({
    where: { nup },
    orderBy: { tanggal_awal: "desc" },
  });
}

// 2. Fungsi addTraining diperbarui
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
      matrixCategory: data.matrixCategory, // <-- Ditambahkan
    },
  });
  revalidatePath("/training");
}

// 3. Fungsi updateTraining ditambahkan untuk EditTrainingModal
export async function updateTraining(id_pelatihan: number, data: Partial<TrainingForm>) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: Record<string, any> = {};

    // Map fields that exist in the partial data
    if (data.nama_pelatihan !== undefined) updateData.nama_pelatihan = data.nama_pelatihan;
    if (data.penyelenggara !== undefined) updateData.penyelenggara = data.penyelenggara;
    if (data.tanggal_awal) updateData.tanggal_awal = new Date(data.tanggal_awal);
    if (data.tanggal_akhir) updateData.tanggal_akhir = new Date(data.tanggal_akhir);
    if (data.masa_berlaku) updateData.masa_berlaku = new Date(data.masa_berlaku);
    if (data.nomor_sertifikat !== undefined) updateData.nomor_sertifikat = data.nomor_sertifikat;
    if (data.file_url !== undefined) updateData.file_sertifikat = data.file_url;
    if (data.matrixCategory !== undefined) updateData.matrixCategory = data.matrixCategory;

    // Recalculate status if dates are provided
    if (data.tanggal_awal && data.masa_berlaku) {
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
        updateData.status = StatusPelatihan[status];
    }
    
    await prisma.pelatihan.update({
        where: { id_pelatihan },
        data: updateData,
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