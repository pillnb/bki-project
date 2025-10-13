// src/app/api/sertifikat/list-grouped/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const rows = await prisma.sertifikat.findMany({
    where: { 
      status: "APPROVED",
      nomorSertifikat: { not: null }
    },
    orderBy: [{ parentId: 'desc' }, { id: 'asc' }]
  });

  // Group by parentId
  const map = new Map<number, typeof rows>();
  for (const r of rows) {
    const key = r.parentId || r.id;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(r);
  }

  const grouped = Array.from(map.values()).map(group => ({
    parentId: group[0].parentId || group[0].id,
    nomorKontrak: group[0].nomorKontrak,
    kompetensi: group[0].kompetensi,
    pasar: group[0].pasar,
    certificates: group
  }));

  return NextResponse.json(grouped);
}