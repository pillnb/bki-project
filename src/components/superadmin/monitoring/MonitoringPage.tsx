"use client";
import { useStats, useCsv } from "@/components/superadmin/hooks";
import StatCards from "@/components/superadmin/monitoring/Statcards";
import ContractBarChart from "@/components/superadmin/monitoring/ContractBarChart";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";

export default function MonitoringPage() {
  const { data, loading, error } = useStats();
  const { exportCsv, loading: exporting } = useCsv();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-blue-900">Monitoring & Laporan</h2>
        <Button
          variant="outline"
          className="rounded-xl"
          onClick={async () => {
            try {
              await exportCsv({});
              toast.success("Export CSV dimulai");
            } catch {
              toast.error("Export gagal");
            }
          }}
        >
          <Download className="h-4 w-4 mr-2" /> Export CSV
        </Button>
      </div>

      <StatCards
        loading={loading}
        total={data?.total ?? 0}
        // aktif={data?.aktif ?? 0}
        // nonaktif={data?.nonaktif ?? 0}
      />

      <ContractBarChart
        loading={loading}
        data={(data?.byStatus ?? []).map((d: any) => ({
          name: d.status_pegawai ?? "-",
          value: d.count,
        }))}
      />

      {error && <div className="text-sm text-red-600">{String(error)}</div>}
    </div>
  );
}