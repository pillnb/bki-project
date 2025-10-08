import Image from "next/image";
import Link from "next/link";

export default function WelcomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50">
      <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center max-w-md w-full">
        <Image
          src="/logo.png"
          alt="Logo BKI"
          width={120}
          height={120}
          className="mb-6"
        />
        <h1 className="text-3xl font-bold text-blue-900 mb-2 text-center">
          Selamat Datang di BKI CV Updater & Generator
        </h1>
        <div className="w-full flex flex-col gap-2 mt-4">
          <a
            href="/login"
            className="w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold py-3 px-4 rounded transition text-center"
          >
            Masuk ke Aplikasi
          </a>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="mt-8 text-center text-xs text-blue-400">
        <p>&copy; {new Date().getFullYear()} PT Biro Klasifikasi Indonesia (Persero). All rights reserved.</p>

        <div className="mt-2 space-x-2">
          <Link href="/privacy-policy" className="hover:underline">
            Privacy Policy
          </Link>
          <span>|</span>
          <a
            href="mailto:bpc@bki.co.id"
            className="hover:underline"
          >
            bpc@bki.co.id
          </a>
          <span>|</span>
          <a
            href="tel:+62542876642-43"
            className="hover:underline"
          >
            (62-542) 876642-43
          </a>
        </div>

        <p className="mt-1 text-gray-400">
          PT. BKI Komersil Balikpapan
        </p>
      </footer>
    </div>
  );
}
