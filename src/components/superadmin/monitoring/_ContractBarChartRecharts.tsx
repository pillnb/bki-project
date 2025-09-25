// src/components/superadmin/monitoring/_ContractBarChartRecharts.tsx
"use client";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const BRAND_BLUE = "#193288";
const GRID_BLUE = "#EAF0FF";

export default function _ContractBarChartRecharts({
  loading,
  data,
}: {
  loading?: boolean;
  data: { name: string; value: number }[];
}) {
  return (
    <div className="bg-white rounded-2xl border border-blue-100 shadow-sm">
      <div className="px-4 py-3 rounded-t-2xl bg-blue-900 text-white font-semibold">
        Statistik per Status Pegawai
      </div>

      <div className="h-[320px] px-4 pb-6">
        {loading ? (
          <div className="flex items-center justify-center h-full text-blue-900/60">
            Loading...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barSize={60}>
              <CartesianGrid stroke={GRID_BLUE} vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: "#1e3a8a", fontSize: 12 }}
                axisLine={{ stroke: "#C7D2FE" }}
                tickLine={{ stroke: "#C7D2FE" }}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: "#1e3a8a", fontSize: 12 }}
                axisLine={{ stroke: "#C7D2FE" }}
                tickLine={{ stroke: "#C7D2FE" }}
              />
              <Tooltip
                cursor={{ fill: GRID_BLUE }}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #C7D2FE",
                  boxShadow: "0 6px 20px rgba(25,50,136,0.08)",
                }}
                labelStyle={{ color: "#0f172a" }}
                itemStyle={{ color: BRAND_BLUE }}
              />
              <Bar dataKey="value" fill={BRAND_BLUE} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}