const fs = require('fs');

// Mari saya buat script yang lebih comprehensive untuk fix file ini
const filePath = 'src/app/api/pegawai/[nup]/route.ts';

if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix all remaining 'unknown' type issues
  const fixes = [
    {
      search: /const toUpdate = incomingPelatihan\.filter\(\(p: unknown\) => p\.id_pelatihan\);/,
      replace: 'const toUpdate = incomingPelatihan.filter((p: unknown) => (p as { id_pelatihan?: number }).id_pelatihan);'
    },
    {
      search: /const incomingExpIds = incomingExp\.map\(\(e: unknown\) => e\.id_pengalaman\)\.filter\(Boolean\);/,
      replace: 'const incomingExpIds = incomingExp.map((e: unknown) => (e as { id_pengalaman?: number }).id_pengalaman).filter(Boolean);'
    },
    {
      search: /const expToCreate = incomingExp\.filter\(\(e: unknown\) => !e\.id_pengalaman\);/,
      replace: 'const expToCreate = incomingExp.filter((e: unknown) => !(e as { id_pengalaman?: number }).id_pengalaman);'
    },
    {
      search: /data: expToCreate\.map\(\(exp: unknown\) => \(\{[\s\S]*?\}\)\),/,
      replace: `data: expToCreate.map((exp: unknown) => {
                const expData = exp as {
                  pengalaman_kerja?: string;
                  perusahaan?: string;
                  tahun?: string | number;
                  lokasi?: string;
                };
                return {
                  nup,
                  pengalaman_kerja: expData.pengalaman_kerja,
                  perusahaan: expData.perusahaan,
                  tahun: expData.tahun ? parseInt(String(expData.tahun), 10) : null,
                  lokasi: expData.lokasi,
                };
              }),`
    },
    {
      search: /const expToUpdate = incomingExp\.filter\(\(e: unknown\) => e\.id_pengalaman\);/,
      replace: 'const expToUpdate = incomingExp.filter((e: unknown) => (e as { id_pengalaman?: number }).id_pengalaman);'
    }
  ];

  fixes.forEach(({ search, replace }) => {
    if (search instanceof RegExp && search.test(content)) {
      content = content.replace(search, replace);
      console.log('Applied regex fix');
    } else if (typeof search === 'string' && content.includes(search)) {
      content = content.replace(search, replace);
      console.log('Applied string fix');
    }
  });

  fs.writeFileSync(filePath, content);
  console.log('Updated pegawai/[nup]/route.ts');
} else {
  console.log('File not found:', filePath);
}

console.log('Done!');
