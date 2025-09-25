"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StatCards({
  loading,
  total,
  // aktif,
  // nonaktif,
}: {
  loading?: boolean;
  total: number;
  // aktif: number;
  // nonaktif: number;
}) 

{
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4" >
      <Card className="rounded-2xl border border-blue-100 bg-white shadow-sm p-4">
        <CardHeader className="pb-2">
          <CardTitle>Total User</CardTitle>
        </CardHeader>
        <CardContent className="text-3xl font-bold text-blue-900">
          {loading ? "-" : total}
        </CardContent>
      </Card>
      {/* <Card className="rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle>Aktif</CardTitle>
        </CardHeader>
        <CardContent className="text-3xl font-bold text-blue-900">
          {loading ? "-" : aktif}
        </CardContent>
      </Card>
      <Card className="rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle>Nonaktif</CardTitle>
        </CardHeader>
        <CardContent className="text-3xl font-bold text-blue-900">
          {loading ? "-" : nonaktif}
        </CardContent>
      </Card> */}
    </div>
  );
}