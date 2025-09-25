"use client";

import { useEffect, useState } from "react";

type Me = {
  id: number;
  nup?: string | null;
  nama_pegawai: string;
  email?: string | null;
  status_pegawai?: string | null;
  role: string[];
};

export default function SuperadminInfoCardClient() {
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    fetch("/api/me", { cache: "no-store" })
      .then(async (r) => {
        if (!r.ok) throw new Error("failed");
        return r.json();
      })
      .then((j) => {
        if (alive) setMe(j);
      })
      .catch(() => {
        if (alive) setMe(null);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="rounded-xl border border-slate-200 p-6 mb-4 flex items-center gap-6" style={{ backgroundColor: '#193288' }}>
      <div className="w-20 h-20 rounded-full bg-yellow-400 flex items-center justify-center text-4xl font-bold text-white border-2 border-white border-solid shadow-md">
        🧑🏽‍💼
      </div>
      <div className="min-w-0">
        <div className="text-sm">Logged in as</div>
        <div className="text-lg font-semibold truncate">
          {loading ? "..." : me?.nama_pegawai ?? "-"}
        </div>
        <div className="text-sm">
          Status:{" "}
          <span className="font-medium">
            {loading ? "..." : me?.status_pegawai ?? "-"}
          </span>
        </div>
        <div className="text-xs">
          Role:{" "}
          {loading ? "..." : me?.role?.length ? me.role.join(", ") : "pegawai"}
        </div>
      </div>
    </div>
  );
}