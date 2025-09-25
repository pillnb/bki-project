"use client";
import { Menu, ChevronLeft, ChevronRight } from "lucide-react";

export default function Topbar({
  onMenu,
  onToggleCollapse,
  collapsed,
}: {
  onMenu: () => void;
  onToggleCollapse?: () => void;
  collapsed?: boolean;
}) {
  return (
    <div className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center gap-3">
        {/* mobile menu */}
        <button
          className="md:hidden p-2 rounded-xl border border-slate-200"
          onClick={onMenu}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* desktop collapse toggle */}
        <button
          className="hidden md:inline-flex p-2 rounded-xl border border-slate-200 hover:bg-slate-50"
          onClick={onToggleCollapse}
          aria-label="Toggle sidebar"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>

        <div className="font-semibold text-blue-900">Superadmin</div>

        <div className="ml-auto">
          <button
            className="px-3 py-2 bg-blue-600 text-white rounded-xl flex items-center gap-2"
            onClick={() => {
              // Hapus token autentikasi dari localStorage
              if (typeof window !== "undefined") {
                localStorage.removeItem("token");
              }
              // Redirect ke halaman login
              window.location.href = "/login";
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
