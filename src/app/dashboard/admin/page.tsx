
import InfoAdminCard from './InfoAdminCard';
import AdminDashboardClient from './AdminDashboardClient';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header */}
      <div className="bg-blue-900 rounded-b-xl shadow border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Dashboard Admin</h1>
              <p className="text-blue-100">Manajemen Data Pegawai</p>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Info Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <InfoAdminCard />
      </div>

      {/* Client-side dashboard */}
      <AdminDashboardClient />
    </div>
  );
}