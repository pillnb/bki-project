// src/components/superadmin/monitoring/ContractBarChart.tsx
"use client";
import dynamic from "next/dynamic";

const InnerChart = dynamic(() => import("./_ContractBarChartRecharts"), {
  ssr: false,
  loading: () => (
    <div className="bg-white rounded-2xl border border-slate-200 h-[320px] flex items-center justify-center">
      <span className="text-slate-500 text-sm text-blue-900/60">Loading chart...</span>
    </div>
  ),
});

export default function ContractBarChart(props: {
  loading?: boolean;
  data: { name: string; value: number }[];
}) {
  return <InnerChart {...props} />;
}
