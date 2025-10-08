// app/privacy-policy/page.tsx

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12 text-gray-800 leading-relaxed">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy – BKI Project System</h1>
      <p className="text-sm text-gray-500 mb-8">Terakhir diperbarui: 8 Oktober 2025</p>

      <section className="space-y-6">
        <p>
          PT Biro Klasifikasi Indonesia (Persero) Balikpapan, menghormati privasi setiap pengguna yang mengakses dan
          menggunakan sistem <strong>BKI Project System</strong> (“Sistem”). Kebijakan privasi ini menjelaskan bagaimana kami
          mengumpulkan, menggunakan, dan melindungi data pribadi yang diproses melalui Sistem ini.
        </p>

        <div>
          <h2 className="text-xl font-semibold mb-2">1. Data yang Kami Kumpulkan</h2>
          <p>Kami hanya mengumpulkan data yang diperlukan untuk mendukung kegiatan operasional internal, antara lain:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Data pegawai: nama, NUP, jabatan, cabang, dan tanda tangan digital.</li>
            <li>Data pelatihan: nama pelatihan, penyelenggara, tahun, dan sertifikat yang diunggah.</li>
            <li>Data proyek: nomor kontrak, jenis kompetensi, dan dokumen laporan inspeksi.</li>
            <li>Data login: alamat email kantor, role pengguna (admin, staff, superadmin), dan waktu aktivitas.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">2. Tujuan Penggunaan Data</h2>
          <p>Data yang dikumpulkan digunakan untuk:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Mendukung proses administrasi proyek, pelatihan, dan sertifikasi internal.</li>
            <li>Menghasilkan dokumen digital seperti CV, sertifikat, atau surat tugas.</li>
            <li>Meningkatkan efisiensi dan akurasi proses internal BKI.</li>
            <li>Memastikan keamanan sistem dan mengelola hak akses pengguna.</li>
          </ul>
          <p className="mt-2">
            Kami <strong>tidak menjual, menyewakan, atau membagikan data pribadi</strong> kepada pihak luar kecuali diwajibkan
            oleh hukum atau atas persetujuan resmi manajemen BKI.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">3. Penyimpanan dan Keamanan Data</h2>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Data disimpan dengan aman di server internal dan/atau layanan cloud yang digunakan oleh BKI.</li>
            <li>Setiap akses ke sistem dilindungi dengan autentikasi token dan izin berbasis peran.</li>
            <li>Kami menggunakan enkripsi untuk melindungi dokumen dan data pribadi lainnya</li>
            <li>Backup data dilakukan secara berkala untuk mencegah kehilangan informasi penting.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">4. Akses dan Kontrol Data</h2>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Pegawai dapat melihat dan memperbarui data pribadinya melalui menu profil.</li>
            <li>Pegawai dapat meminta penghapusan atau koreksi data kepada administrator sistem.</li>
            <li>Pengguna dapat mengunduh dokumen (sertifikat, CV) sesuai hak akses yang diberikan.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">5. Penggunaan Pihak Ketiga</h2>
          <p>Sistem ini dapat menggunakan layanan pihak ketiga untuk mendukung operasional, seperti:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Google Drive API – untuk penyimpanan file</li>
            <li>Firebase Authentication atau sistem login internal – untuk manajemen akun pengguna.</li>
          </ul>
          <p className="mt-2">
            Layanan pihak ketiga tersebut diatur oleh kebijakan privasi masing-masing penyedia layanan.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">6. Perubahan atas Kebijakan Privasi</h2>
          <p>
            Kebijakan ini dapat diperbarui dari waktu ke waktu sesuai kebutuhan operasional atau regulasi yang berlaku.
            Versi terbaru akan selalu tersedia di halaman ini, dan perubahan signifikan akan diinformasikan kepada pengguna
            melalui sistem.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">7. Kontak</h2>
          <p>
            Untuk pertanyaan atau permintaan terkait data pribadi, hubungi:<br />
            <strong>Operations Division BKI Balikpapan</strong><br />
            Email: <a href="mailto:bpcoperasi@gmail.com" className="text-blue-600 hover:underline">bpcoperasi@gmail.com</a><br />
            Telepon: (62-542) 876642-43
          </p>
        </div>
      </section>
    </main>
  );
}
