export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 px-6">
      <div className="bg-white rounded-xl shadow p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-blue-900 mb-2">Akses Ditolak</h1>
        <p className="text-blue-700">Kamu tidak memiliki izin untuk mengakses halaman ini.</p>
      </div>
    </div>
  );
}