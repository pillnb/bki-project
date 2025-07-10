
import Image from "next/image";

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
        <h1 className="text-3xl font-bold text-blue-900 mb-2 text-center">Selamat Datang di BKI CV Updater & Generator</h1>
        <div className="w-full flex flex-col gap-2 mt-4">
          <a
            href="/login"
            className="w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold py-3 px-4 rounded transition text-center"
          >
            Masuk ke Aplikasi
          </a>
        </div>
      </div>
      <footer className="mt-8 text-blue-400 text-xs text-center">
        &copy; {new Date().getFullYear()} BKI. All rights reserved.
      </footer>
    </div>
  );
}