import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getPegawaiByNik } from "../../dashboard/pegawai/data-diri";
import { getKualifikasiByNup, getPengalamanKerjaByNup } from "../../cv-generator/data-cv";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const nik = cookieStore.get("nik")?.value;

        if (!nik) {
            return NextResponse.json({ error: "Otentikasi dibutuhkan" }, { status: 401 });
        }
    
        const dataDiri = await getPegawaiByNik(nik);
        const nup = dataDiri?.nup ?? "";
        
        const dataKualifikasi = nup ? await getKualifikasiByNup(nup) : [];
        const dataPengalaman = nup ? await getPengalamanKerjaByNup(nup) : [];
        
        return NextResponse.json({
            dataDiri,
            dataKualifikasi,
            dataPengalaman,
            nup
        });

    } catch (error) {
        console.error("API cv-data error:", error);
        return NextResponse.json({ error: "Gagal mengambil data CV" }, { status: 500 });
    }
}