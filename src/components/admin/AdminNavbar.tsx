"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ClipboardList, CheckSquare, LogOut } from "lucide-react";
import React from "react";

type Item = {
  href: string;
  label: string;
  icon: React.ReactNode;
  match: (path: string) => boolean;
};

function cls(...xs: Array<string | false | undefined>) {
  return xs.filter(Boolean).join(" ");
}

export default function AdminNavbar() {
  const pathname = usePathname();

  const items: Item[] = [
    {
      href: "/dashboard/admin",
      label: "Dashboard",
      icon: <LayoutDashboard className="w-4 h-4" />,
      match: (p) => p === "/dashboard/admin",
    },
    {
      href: "/dashboard/admin/monitoring",
      label: "Monitoring Surat Tugas",
      icon: <ClipboardList className="w-4 h-4" />,
      match: (p) => p.startsWith("/dashboard/admin/monitoring"),
    },
    {
      href: "/dashboard/admin/approval",
      label: "Approval Surat Tugas",
      icon: <CheckSquare className="w-4 h-4" />,
      match: (p) => p.startsWith("/dashboard/admin/approval"),
    },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-blue-800 bg-blue-900 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          {/* Kiri: Judul */}
          <h1 className="text-lg font-bold text-white">Dashboard Admin</h1>

          {/* Tengah: Menu */}
          <ul className="flex items-center gap-1">
            {items.map((it) => {
              const active = it.match(pathname || "");
              return (
                <li key={it.href}>
                  <Link
                    href={it.href}
                    className={cls(
                      "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
                      active
                        ? "bg-white text-blue-900"
                        : "text-white hover:bg-blue-800"
                    )}
                  >
                    {it.icon}
                    <span>{it.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Kanan: Logout */}
          <button
            onClick={() => {
              // TODO: tambahin logic logout sesuaikan sama auth system lo
              document.cookie = "token=; Max-Age=0; path=/;";
              window.location.href = "/login";
            }}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-white hover:bg-blue-800"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}