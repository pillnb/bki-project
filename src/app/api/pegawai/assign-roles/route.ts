import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Utils
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function okJson(data: any, init: ResponseInit = {}) {
  return NextResponse.json(data, { headers: corsHeaders, ...init });
}

function badRequest(msg: string) {
  return okJson({ error: msg }, { status: 400 });
}

function toInt(v: string | null, fallback: number) {
  if (!v) return fallback;
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

function sanitizeRole(input: string) {
  return String(input).trim();
}

function sanitizeRoles(input: unknown): string[] {
  if (Array.isArray(input)) return input.map(sanitizeRole).filter(Boolean);
  if (typeof input === "string") return [sanitizeRole(input)].filter(Boolean);
  return [];
}

function rowsToCSV(
  rows: Array<{
    id: number;
    nup: string | null;
    nama_pegawai: string;
    email: string | null;
    role: string[];
    status_pegawai: string | null;
  }>
) {
  const header = ["ID", "NUP", "Nama", "Email", "Role", "StatusPegawai"];
  const esc = (v: any) => {
    const s = v == null ? "" : String(v);
    return s.includes(",") || s.includes("\n") || s.includes('"')
      ? `"${s.replace(/"/g, '""')}"`
      : s;
  };
  const lines = [header.join(",")].concat(
    rows.map((r) =>
      [
        r.id,
        r.nup ?? "",
        r.nama_pegawai,
        r.email ?? "",
        r.role && r.role.length ? r.role.join("|") : "pegawai",
        r.status_pegawai ?? "",
      ]
        .map(esc)
        .join(",")
    )
  );
  return lines.join("\n");
}

// CORS
export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

// GET
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get("mode"); // "stats" | null
    const doExportCSV = searchParams.get("export") === "csv";

    // filters
    const q = searchParams.get("q")?.trim() || "";
    const roleParams = searchParams
      .getAll("role")
      .map(sanitizeRole)
      .filter(Boolean);
    const statusParams = searchParams
      .getAll("status")
      .map((s) => s.trim())
      .filter(Boolean);

    // pagination & sorting
    const page = toInt(searchParams.get("page"), 1);
    const pageSize = Math.min(200, toInt(searchParams.get("pageSize"), 20));
    const orderByParam = (searchParams.get("orderBy") || "id").toLowerCase();
    const orderParam = (searchParams.get("order") || "asc").toLowerCase();
    const order = orderParam === "desc" ? "desc" : "asc";

    // build where
    const where: any = {};

    if (q) {
      // id exact match if number, or partial on nup/nama/email
      const idNum = Number(q);
      const or: any[] = [
        { nup: { contains: q, mode: "insensitive" } },
        { nama_pegawai: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
      ];
      if (Number.isFinite(idNum)) {
        or.unshift({ id: idNum });
      }
      where.OR = or;
    }

    if (roleParams.length > 0) {
      // match any of roles
      where.role = { hasSome: roleParams };
    }

    if (statusParams.length > 0) {
      where.status_pegawai = { in: statusParams };
    }

    // ordering
    let orderBy: any = { id: order };
    if (orderByParam === "nup") orderBy = { nup: order };
    else if (orderByParam === "nama") orderBy = { nama_pegawai: order };
    else if (orderByParam === "email") orderBy = { email: order };
    else if (orderByParam === "status") orderBy = { status_pegawai: order };

    // stats mode
    if (mode === "stats") {
      const total = await prisma.pegawai.count({ where });

      const aktif = await prisma.pegawai.count({
        where: { ...where, status_pegawai: "aktif" },
      });
      const nonaktif = await prisma.pegawai.count({
        where: { ...where, status_pegawai: "nonaktif" },
      });

      const byStatus = await prisma.pegawai.groupBy({
        by: ["status_pegawai"],
        where,
        _count: { _all: true },
      });

      // hitung role secara manual dari sample (karena Prisma belum support groupBy pada field list)
      const sample = await prisma.pegawai.findMany({
        where,
        select: { role: true },
        take: 5000, // batasi biar aman
      });
      const roleCounter: Record<string, number> = {};
      for (const s of sample) {
        for (const r of s.role || []) {
          roleCounter[r] = (roleCounter[r] || 0) + 1;
        }
      }

      return okJson({
        total,
        aktif,
        nonaktif,
        byStatus: byStatus.map((r) => ({
          status_pegawai: r.status_pegawai,
          count: r._count._all,
        })),
        byRole: Object.entries(roleCounter).map(([role, count]) => ({
          role,
          count,
        })),
      });
    }

    // list / export
    const [total, data] = await Promise.all([
      prisma.pegawai.count({ where }),
      prisma.pegawai.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          nup: true,
          nama_pegawai: true,
          email: true,
          role: true,
          status_pegawai: true,
        },
      }),
    ]);

    if (doExportCSV) {
      const full = await prisma.pegawai.findMany({
        where,
        orderBy,
        select: {
          id: true,
          nup: true,
          nama_pegawai: true,
          email: true,
          role: true,
          status_pegawai: true,
        },
        take: 20000, // hard cap export
      });
      const csv = rowsToCSV(full);
      return new NextResponse(csv, {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="pegawai-${new Date()
            .toISOString()
            .slice(0, 10)}.csv"`,
        },
      });
    }

    return okJson({
      data,
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.max(1, Math.ceil(total / pageSize)),
      },
    });
  } catch (e) {
    console.error(e);
    return okJson({ error: "Failed to fetch" }, { status: 500 });
  }
}

// POST assign roles (bulk)
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const userIdsRaw: Array<number | string> = Array.isArray(body?.userIds)
      ? body.userIds
      : [];
    if (userIdsRaw.length === 0)
      return badRequest("userIds kosong / tidak valid");

    const ids = userIdsRaw
      .map((x) => Number(x))
      .filter((n) => Number.isInteger(n));
    if (ids.length === 0) return badRequest("userIds harus berupa integer");

    const mode: "set" | "push" | "remove" | "clear" = [
      "set",
      "push",
      "remove",
      "clear",
    ].includes(body?.mode)
      ? body.mode
      : "set";

    const rolesFromBody = sanitizeRoles(body?.roles);
    const singleRole =
      typeof body?.role === "string" ? sanitizeRole(body.role) : null;

    if (mode === "clear") {
      await prisma.pegawai.updateMany({
        where: { id: { in: ids } },
        data: { role: { set: [] } },
      });
      return okJson({ success: true, mode: "clear", updatedIds: ids });
    }

    if (mode === "set") {
      const setRoles =
        rolesFromBody.length > 0
          ? rolesFromBody
          : singleRole
          ? [singleRole]
          : null;
      if (!setRoles)
        return badRequest("Untuk mode=set, sertakan role atau roles");

      await prisma.pegawai.updateMany({
        where: { id: { in: ids } },
        data: { role: { set: setRoles } },
      });
      return okJson({
        success: true,
        mode: "set",
        set: setRoles,
        updatedIds: ids,
      });
    }

    // ... di dalam POST handler

    if (mode === "push") {
      if (!singleRole)
        return badRequest("Untuk mode=push, sertakan role tunggal");

      // 1) ambil data dulu
      const rows = await prisma.pegawai.findMany({
        where: { id: { in: ids } },
        select: { id: true, role: true },
      });

      // 2) build daftar update tanpa duplikasi
      const ops = rows
        .filter(
          (r) => !(Array.isArray(r.role) ? r.role : []).includes(singleRole)
        )
        .map((r) => {
          const current = Array.isArray(r.role) ? r.role : [];
          const next = [...current, singleRole];
          return prisma.pegawai.update({
            where: { id: r.id },
            data: { role: { set: next } },
          });
        });

      if (ops.length > 0) {
        // 3) jalankan batched transaction (bukan callback)
        await prisma.$transaction(ops);
      }
      return okJson({
        success: true,
        mode: "push",
        role: singleRole,
        updatedIds: ids,
      });
    }

    if (mode === "remove") {
      if (!singleRole)
        return badRequest("Untuk mode=remove, sertakan role tunggal");

      const rows = await prisma.pegawai.findMany({
        where: { id: { in: ids } },
        select: { id: true, role: true },
      });

      const ops = rows
        .map((r) => {
          const current = Array.isArray(r.role) ? r.role : [];
          const next = current.filter((x) => x !== singleRole);
          // kalau tidak berubah, skip
          if (next.length === current.length) return null;
          return prisma.pegawai.update({
            where: { id: r.id },
            data: { role: { set: next } },
          });
        })
        .filter(Boolean) as ReturnType<typeof prisma.pegawai.update>[];

      if (ops.length > 0) {
        await prisma.$transaction(ops);
      }
      return okJson({
        success: true,
        mode: "remove",
        role: singleRole,
        updatedIds: ids,
      });
    }

    return badRequest("Mode tidak dikenal");
  } catch (e) {
    console.error(e);
    return okJson({ error: "Failed to assign roles" }, { status: 500 });
  }
}
