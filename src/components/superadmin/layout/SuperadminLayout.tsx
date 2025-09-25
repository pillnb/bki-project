"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "@/components/superadmin/layout/Sidebar";
import Topbar from "@/components/superadmin/layout/Topbar";

export default function SuperadminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false); // mobile drawer
  const [collapsed, setCollapsed] = useState(false); // desktop minimize

  useEffect(() => {
    const v = localStorage.getItem("sa_sidebar_collapsed");
    if (v === "1") setCollapsed(true);
  }, []);
  const toggleCollapse = () => {
    setCollapsed((v) => {
      const next = !v;
      localStorage.setItem("sa_sidebar_collapsed", next ? "1" : "0");
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Topbar
        onMenu={() => setOpen(true)}
        onToggleCollapse={toggleCollapse}
        collapsed={collapsed}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex">
        <aside
          className={`hidden md:block shrink-0 py-6 pr-6 transition-all duration-200 ${
            collapsed ? "w-16" : "w-64"
          }`}
        >
          <Sidebar collapsed={collapsed} />
        </aside>

        {open && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div
              className="absolute inset-0 bg-black/30"
              onClick={() => setOpen(false)}
            />
            <div className="absolute left-0 top-0 h-full w-80 bg-white shadow-xl p-4">
              <Sidebar onNavigate={() => setOpen(false)} collapsed={false} />
            </div>
          </div>
        )}

        <main className="flex-1 py-6">{children}</main>
      </div>
    </div>
  );
}
