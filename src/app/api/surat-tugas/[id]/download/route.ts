import { NextRequest } from "next/server";
import path from "path";
import fs from "fs/promises";
import prisma from "@/lib/prisma";

import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";

// Helpers
function formatTanggalID(d?: Date | string | null) {
  if (!d) return "";
  const date = typeof d === "string" ? new Date(d) : d;
  if (isNaN(date.getTime())) return "";
  const bulan = [
    "Januari","Februari","Maret","April","Mei","Juni",
    "Juli","Agustus","September","Oktober","November","Desember"
  ];
  return `${date.getDate()} ${bulan[date.getMonth()]} ${date.getFullYear()}`;
}

function listComma(values?: string[] | null) {
  if (!values || values.length === 0) return "";
  return values.join(", ");
}

function bullets(values?: string[] | null) {
  if (!values || values.length === 0) return "";
  return values.map((v, i) => `${i + 1}. ${v}`).join("\n");
}

function checkbox(on?: boolean) {
  return on ? "☑" : "☐";
}

// API Handler
export async function GET(
  _req: NextRequest,
  ctx: { params: { id: string } }
) {
  try {
    const id = Number(ctx.params.id);
    if (!id || Number.isNaN(id)) {
      return new Response(JSON.stringify({ error: "Param id tidak valid" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Ambil data surat tugas dari DB
    const st = await prisma.suratTugas.findUnique({
      where: { id },
      include: {
        proyek: true,
        koordinator: true,
        leadInspector: true,
      },
    });

    if (!st) {
      return new Response(JSON.stringify({ error: "Surat tugas tidak ditemukan" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Mapping field Prisma -> placeholder template
    const data = {
      klien: st.proyek?.klien ?? "",
      namaProyek: st.proyek?.namaProyek ?? "",
      status_pekerjaan: st.status_pekerjaan ?? "",
      no_service_order: st.no_service_order ?? "",
      spi: st.spi ?? "",
      wbs: st.wbs ?? "",
      bidang_pekerjaan: st.bidang_pekerjaan ?? "",

      peralatan_inspeksi: listComma(st.peralatan_inspeksi),
      kebutuhan_material: bullets(st.kebutuhan_material),
      lokasi: st.proyek?.lokasi ?? "",

      tanggal_berangkat: formatTanggalID(st.tanggal_berangkat),
      tanggal_kembali: formatTanggalID(st.tanggal_kembali),

      cb_kendaraan_operasional: checkbox(st.transportasi_operasional),
      cb_ditanggung_klien: checkbox(st.transportasi_ditanggung_klien),
      cb_transport_asal_tujuan: checkbox(st.transportasi_asal_tujuan),
      cb_transport_dalam_dinas: checkbox(st.transportasi_dinas),
      cb_tiket: checkbox(st.tiket),
      cb_penginapan: checkbox(st.penginapan),

      nopol: st.nomor_plat_kendaraan ?? "",

      created_at: formatTanggalID(st.createdAt), // sudah ada "Balikpapan," di template
      nama_koordinator: st.koordinator?.nama_pegawai ?? "",
      nama_lead: st.leadInspector?.nama_pegawai ?? "",
    };

    // Load template docx
    const templatePath = path.join(process.cwd(), "templates", "template_surattugas.docx");
    const content = await fs.readFile(templatePath, "binary");

    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

    // Inject data
    doc.setData(data);
    doc.render();

    // Generate buffer hasil docx
    const buf = doc.getZip().generate({ type: "nodebuffer" });

    // ✅ Convert Buffer ke Uint8Array (fix TS2345)
    const uint8array = new Uint8Array(buf);

    const filename =
      st.nomor_surat
        ? `Surat_Tugas_${st.nomor_surat}.docx`
        : `Surat_Tugas_${st.id}.docx`;

    return new Response(uint8array, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": String(uint8array.length),
      },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || "Gagal generate surat tugas" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}