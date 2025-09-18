import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
	try {
		const body = await req.json();
		const { nup, ...updateData } = body;
		if (!nup) return NextResponse.json({ error: "NUP wajib diisi" }, { status: 400 });

			// Only allow fields that exist in pegawai model
			const allowedFields = [
				"nama_pegawai", "email", "status_pegawai", "jabatan", "tempat_lahir", "tanggal_lahir",
				"agama", "warga_negara", "jenjang_pend", "pendidikan", "tahun_pend"
			];
			const data: Record<string, any> = {};
			for (const key of allowedFields) {
				if (updateData[key] !== undefined) {
					if (key === "tahun_pend" && updateData[key] !== null) {
						data[key] = updateData[key] === "" ? null : Number(updateData[key]);
					} else {
						data[key] = updateData[key];
					}
				}
			}

			const updated = await prisma.pegawai.update({
				where: { nup },
				data,
			});
			return NextResponse.json(updated);
	} catch (e) {
		return NextResponse.json({ error: (e as Error)?.message || "Update data diri gagal" }, { status: 500 });
	}
}
