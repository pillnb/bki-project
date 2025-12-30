import { PrismaClient } from '@prisma/client'; 
// import * as bcrypt from 'bcrypt'; // Tidak perlu import ini dulu kalau tidak dipakai
// import pegawaiData from './pegawai.json';
// import kualifikasiData from './kualifikasi.json';

const prisma = new PrismaClient();

async function main() {
  
  // ==========================================
  // BAGIAN 1 & 2: DATA LAMA (SKIP / DIBEKUKAN)
  // ==========================================
  // Kita matikan kode ini supaya data yang sudah kamu edit di DB tidak terganggu/terduplikasi.
  
  console.log('⏩ Bagian Pegawai & Kualifikasi di-SKIP (Data sudah ada di DB).');

  /* // --- KODE LAMA DISIMPAN SEBAGAI ARSIP SAJA ---
  
  console.log('🌱 Mulai seeding data pegawai...');
  const hashedPassword = await bcrypt.hash('password123', 10);
  const pegawaiToCreate = pegawaiData.map(p => ({ ... }));
  await prisma.pegawai.createMany({ data: pegawaiToCreate, skipDuplicates: true });

  console.log('🌱 Mulai seeding data kualifikasi...');
  // ... logika looping kualifikasi ...
  */


  // ==========================================
  // BAGIAN 3: HANYA SEED MODULES BARU
  // ==========================================
  console.log('🌱 Mulai seeding module emergent...');

  const modules = [
    {
      name: "Tool Management",
      description: "Manage inventory and tools",
      icon: "Wrench",
      path: "/tools",
      externalUrl: null,
      roles: ["SuperAdmin", "Admin", "User", "Management"],
      isActive: true
    },
    {
      name: "Assignment Letters",
      description: "Create and manage assignment letters",
      icon: "FileText",
      path: "/surat-tugas",
      externalUrl: null,
      roles: ["SuperAdmin", "Admin", "Management"],
      isActive: true
    },
    {
      name: "Curriculum Vitae",
      description: "Employee CV management",
      icon: "User",
      path: "/cv",
      externalUrl: null,
      roles: ["SuperAdmin", "Admin", "User", "Management"],
      isActive: true
    },
    {
      name: "Marketing",
      description: "Marketing campaigns",
      icon: "TrendingUp",
      path: "/marketing",
      externalUrl: null,
      roles: ["SuperAdmin", "Admin", "Management"],
      isActive: false
    },
    {
      name: "KPI Dashboard",
      description: "Key Performance Indicators",
      icon: "BarChart3",
      path: "/kpi",
      externalUrl: null,
      roles: ["SuperAdmin", "Admin", "Management"],
      isActive: false
    }
  ];

  for (const mod of modules) {
    // Cek dulu biar gak duplikat
    const existing = await prisma.moduleAccess.findFirst({
        where: { name: mod.name }
    });

    if (!existing) {
        await prisma.moduleAccess.create({
          data: {
            name: mod.name,
            description: mod.description,
            icon: mod.icon,
            path: mod.path,
            externalUrl: mod.externalUrl,
            roles: mod.roles,
            isActive: mod.isActive
          }
        });
        console.log(`   + Created module: ${mod.name}`);
    } else {
        console.log(`   . Module exists (skip): ${mod.name}`);
    }
  }
  console.log('✅ Seed module emergent selesai.');


  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});