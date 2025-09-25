// src/app/superadmin/SuperAdminContent.tsx
"use client";

import { useSearchParams } from "next/navigation";
import SuperadminLayout from "@/components/superadmin/layout/SuperadminLayout";
import MonitoringPage from "@/components/superadmin/monitoring/MonitoringPage";
import SuperadminManage from "@/components/superadmin/users/SuperadminManage";

export default function SuperAdminContent() {
  const sp = useSearchParams();
  const tab = sp.get("tab") === "monitor" ? "monitor" : "manage";
  
  return (
    <SuperadminLayout>
      {tab === "monitor" ? <MonitoringPage /> : <SuperadminManage />}
    </SuperadminLayout>
  );
}