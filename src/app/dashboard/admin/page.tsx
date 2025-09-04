
import InfoAdminCard from './InfoAdminCard';
import AdminDashboardClient from './AdminDashboardClient';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import LogoutButton from './LogoutButton';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-blue-50">

      {/* Admin Info Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <InfoAdminCard />
      </div>

      {/* Client-side dashboard */}
      <AdminDashboardClient />
    </div>
  );
}