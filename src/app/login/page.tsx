"use client";

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Cookies from 'js-cookie'; // <-- 1. Import Cookies

export default function LoginPage() {
  const [nik, setNik] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nik, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Gagal untuk login');
      }

      if (data.user && data.user.role) {
        // 2. Simpan NIK ke dalam cookie setelah login berhasil
        // Cookie akan berlaku selama 1 hari
        Cookies.set('nik', data.user.nik, { expires: 1 });

        // 3. Arahkan ke dashboard yang sesuai
        if (data.user.role === 'admin') {
          router.push('/dashboard/admin');
        } else if (data.user.role === 'pegawai') {
          router.push('/dashboard/pegawai');
        } else {
          setError('Role pengguna tidak valid.');
        }
      } else {
        setError('Gagal mendapatkan data pengguna.');
      }
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // ... sisa kode JSX Anda tidak berubah ...
    <div className="flex h-screen bg-white">
      {/* Kolom Kiri - Form Login */}
      <div className="flex flex-col justify-center w-full lg:w-1/2 px-8 sm:px-16 md:px-24">
        <div className="max-w-md w-full mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Login</h1>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nik">
                NIK
              </label>
              <input
                id="nik"
                type="text"
                value={nik}
                onChange={(e) => setNik(e.target.value)}
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline pr-12"
                  required
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  <img
                    src="/eye.png"
                    alt={showPassword ? "Hide password" : "Show password"}
                    className={`w-6 h-6 opacity-70 cursor-pointer ${showPassword ? '' : ''}`}
                  />
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center text-sm text-gray-600">
                <input className="mr-2" type="checkbox" />
                Remember me
              </label>
              <Link href="/lupa-password" className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
                Lupa Password?
              </Link>
            </div>

            {error && <p className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</p>}

            <div className="mb-6">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-blue-400"
              >
                {isLoading ? 'Redirecting...' : 'Sign In'}
              </button>
            </div>

            <p className="text-center text-sm text-gray-600">
              Akun tidak terdaftar? <a href="#" className="font-bold text-blue-900 hover:underline">Hubungi Admin</a>
            </p>
          </form>
        </div>
      </div>

      {/* Kolom Kanan - Gambar */}
      <div 
        className="hidden lg:block w-1/2 bg-cover bg-center" 
        style={{ backgroundImage: "url('/background-image.jpg')" }}
      >
        <div className="flex items-center justify-center h-full w-full bg-blue-900 bg-opacity-80">
          <div className="text-center">
            <h2 className="text-white text-4xl font-bold">CV Updater</h2>
            <h2 className="text-white text-4xl font-bold">& Generator</h2>
          </div>
        </div>
      </div>
    </div>
  );
}