import type { ReactNode } from "react";
import AdminNavbar from "@/components/admin/AdminNavbar";

export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-blue-50">
      <AdminNavbar />
      <main className="mx-auto max-w-7xl sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
}