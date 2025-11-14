import { NextRequest } from "next/server";
import path from "path";
import fs from "fs/promises";
import prisma from "@/lib/prisma";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";

// ===== Helpers =====
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

function buildAkomodasi(st: any) {
  const parts: string[] = [];
  if (st.transportasi_operasional) parts.push("Kendaraan Operasional");
  if (st.transportasi_asal_tujuan) parts.push("Transport Asal–Tujuan");
  if (st.transportasi_dinas) parts.push("Transport Dinas");
  if (st.transportasi_ditanggung_klien) parts.push("Ditanggung Klien");
  if (st.tiket) parts.push("Tiket");
  if (st.penginapan) parts.push("Penginapan");
  if (st.nomor_plat_kendaraan) parts.push(`Nopol ${st.nomor_plat_kendaraan}`);
  return parts.length ? parts.join(", ") : "-";
}

// ===== Handler =====
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id = Number(idStr);
    if (!id || Number.isNaN(id)) {
      return new Response(JSON.stringify({ error: "Param id tidak valid" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Ambil data lengkap untuk final ST
    const st = await prisma.suratTugas.findUnique({
      where: { id },
      include: {
        proyek: true,
        timInspektor: { select: { nama_pegawai: true, nup: true } },
        kepalaCabang: { select: { nama_pegawai: true, nup: true } },
        seniorManager: { select: { nama_pegawai: true, nup: true } },
        leadInspector: { select: { nama_pegawai: true, nup: true, id: true } },
      },
    });

    if (!st) {
      return new Response(JSON.stringify({ error: "Surat tugas tidak ditemukan" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Siapkan data untuk template
    const tim_inspektor = Array.isArray(st.timInspektor)
      ? st.timInspektor.map((p) => ({
          nama_inspektor: p.nama_pegawai || p.nup || "-",
        }))
      : [];

    const data = {
      // Loop section
      tim_inspektor,

      // Field tunggal
      lokasi: st.proyek?.lokasi ?? "-",
      namaProyek: st.proyek?.namaProyek ?? "-",
      tanggal_berangkat: formatTanggalID(st.tanggal_berangkat),
      tanggal_kembali: formatTanggalID(st.tanggal_kembali),
      akomodasi: buildAkomodasi(st),
      created_at: formatTanggalID(st.createdAt),

    //   kepala_cabang_nama: st.kepalaCabang?.nama_pegawai ?? "",
    //   kepala_cabang_nup: st.kepalaCabang?.nup ?? "",
    //   senior_manager_nama: st.seniorManager?.nama_pegawai ?? "",
    //   senior_manager_nup: st.seniorManager?.nup ?? "",

      // Kalau mau pakai nomor surat
      nomor_surat: st.nomor_surat ?? "",
    };

    // Load template docx final
    const templatePath = path.join(process.cwd(),
      "templates","template_final_surattugas.docx");
    const content = await fs.readFile(templatePath, "binary");

    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

    doc.setData(data);
    doc.render();

    const buffer = doc.getZip().generate({ type: "nodebuffer" });
    const uint8array = new Uint8Array(buffer);

    const filename = st.nomor_surat
      ? `Surat_Tugas_FINAL_${st.nomor_surat}.docx`
      : `Surat_Tugas_FINAL_${st.id}.docx`;

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
    console.error("Generate ST FINAL error:", err);
    return new Response(
      JSON.stringify({ error: err?.message || "Gagal generate surat tugas final" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
