// app/superadmin/detail-pegawai/[nup]/page.tsx
"use client";
import { useParams } from "next/navigation";
import SuperadminPegawaiDetailPage from "@/components/superadmin/pegawai-detail/SuperadminPegawaiDetailPage";

export default function Page() {
  const params = useParams();
  const nup = Array.isArray(params?.nup)
    ? params.nup[0]
    : (params?.nup as string);
  return <SuperadminPegawaiDetailPage nup={nup} />;
}