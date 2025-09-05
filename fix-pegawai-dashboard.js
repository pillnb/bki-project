const fs = require('fs');

const filePath = 'src/app/dashboard/pegawai/page.tsx';

if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix the incomplete map function first
  content = content.replace(
    /dataKualifikasi\.map\(\(k: unknown, idx: number\) => \{\s+const kual = k as \{[\s\S]*?\};[\s\S]*?{kual\.status === "ON_GOING" && \(/,
    `dataKualifikasi.map((k: unknown, idx: number) => {
                    const kual = k as {
                      nama_pelatihan?: string;
                      penyelenggara?: string;
                      nomor_sertifikat?: string;
                      tahun?: number;
                      tanggal_awal?: string;
                      tanggal_akhir?: string;
                      masa_berlaku?: string;
                      status?: string;
                      keterangan_utilisasi?: string;
                    };
                    return (
                    <tr key={idx} className="border-b last:border-b-0">
                      <td className="py-2 px-3 text-black">{idx + 1}</td>
                      <td className="py-2 px-3 text-black">{kual.nama_pelatihan}</td>
                      <td className="py-2 px-3 text-black">{kual.penyelenggara}</td>
                      <td className="py-2 px-3 text-black">{kual.nomor_sertifikat}</td>
                      <td className="py-2 px-3 text-black">{kual.tahun}</td>
                      <td className="py-2 px-3 text-black">{kual.tanggal_awal ? formatDate(kual.tanggal_awal) : "-"}</td>
                      <td className="py-2 px-3 text-black">{kual.tanggal_akhir ? formatDate(kual.tanggal_akhir) : "-"}</td>
                      <td className="py-2 px-3 text-black">{kual.masa_berlaku ? formatDate(kual.masa_berlaku) : "-"}</td>
                      <td className="py-2 px-3 text-black whitespace-nowrap">
                        {kual.status === "ON_GOING" && (`
  );

  // Fix remaining k.status references
  content = content.replace(/k\.status/g, 'kual.status');
  content = content.replace(/k\.keterangan_utilisasi/g, 'kual.keterangan_utilisasi');
  
  // Fix pengalaman kerja mapping
  content = content.replace(
    /dataPengalaman\.map\(\(p: unknown, idx: number\) => \(/,
    `dataPengalaman.map((p: unknown, idx: number) => {
                    const peng = p as {
                      pengalaman_kerja?: string;
                      perusahaan?: string;
                      tahun?: number;
                    };
                    return (`
  );
  
  content = content.replace(/p\.pengalaman_kerja/g, 'peng.pengalaman_kerja');
  content = content.replace(/p\.perusahaan/g, 'peng.perusahaan');
  content = content.replace(/p\.tahun/g, 'peng.tahun');
  
  // Add closing brace for pengalaman mapping
  content = content.replace(
    /(                    <\/tr>\s*)\)\)/,
    '$1    );\n                  })'
  );
  
  // Fix surat tugas mapping
  content = content.replace(
    /dataSuratTugas\.map\(\(surat: unknown, idx: number\) => \{/,
    `dataSuratTugas.map((surat: unknown, idx: number) => {
                const suratData = surat as {
                  id?: number;
                  proyek?: { klien?: string; namaProyek?: string };
                  klien?: string;
                  pekerjaan?: string;
                  createdAt?: string;
                  nomor_surat?: string;
                  status?: string;
                };`
  );
  
  content = content.replace(/const klien = surat\?\.proyek\?\.klien \?\? surat\?\.klien \?\? "-";/, 'const klien = suratData?.proyek?.klien ?? suratData?.klien ?? "-";');
  content = content.replace(/const pekerjaan = surat\?\.proyek\?\.namaProyek \?\? surat\?\.pekerjaan \?\? "-";/, 'const pekerjaan = suratData?.proyek?.namaProyek ?? suratData?.pekerjaan ?? "-";');
  content = content.replace(/surat\.id/g, 'suratData.id');
  content = content.replace(/surat\.createdAt/g, 'suratData.createdAt');
  content = content.replace(/surat\.nomor_surat/g, 'suratData.nomor_surat');
  content = content.replace(/surat\.status/g, 'suratData.status');
  
  // Fix training mapping
  content = content.replace(
    /dataTraining\.map\(\(training: unknown, idx: number\) => \(/,
    `dataTraining.map((training: unknown, idx: number) => {
                const trainingData = training as {
                  id_pelatihan?: number;
                  nama_pelatihan?: string;
                  penyelenggara?: string;
                  tanggal_awal?: string;
                  tanggal_akhir?: string;
                  status?: string;
                };
                return (`
  );
  
  content = content.replace(/training\.id_pelatihan/g, 'trainingData.id_pelatihan');
  content = content.replace(/training\.nama_pelatihan/g, 'trainingData.nama_pelatihan');
  content = content.replace(/training\.penyelenggara/g, 'trainingData.penyelenggara');
  content = content.replace(/training\.tanggal_awal/g, 'trainingData.tanggal_awal');
  content = content.replace(/training\.tanggal_akhir/g, 'trainingData.tanggal_akhir');
  content = content.replace(/training\.status/g, 'trainingData.status');

  fs.writeFileSync(filePath, content);
  console.log('Updated pegawai dashboard page');
} else {
  console.log('File not found:', filePath);
}

console.log('Done!');
