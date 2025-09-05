const fs = require('fs');
const path = require('path');

// Files and patterns to fix unused variables
const fixes = [
  {
    file: 'src/app/api/cv/generate/[nup]/route.ts',
    patterns: [
      {
        search: /getSize\(_img: unknown, _tagValue: unknown, _tagName: unknown, _context: unknown\)/,
        replace: 'getSize() {'
      }
    ]
  },
  {
    file: 'src/app/api/cv/generate-pdf/route.ts',
    patterns: [
      {
        search: /getSize\(_img: unknown, _tagValue: unknown, _tagName: unknown, _context: unknown\)/,
        replace: 'getSize() {'
      }
    ]
  },
  {
    file: 'src/app/api/login/route.ts',
    patterns: [
      {
        search: /const _ = /,
        replace: '// @eslint-disable-next-line @typescript-eslint/no-unused-vars\n      const _ = '
      }
    ]
  },
  {
    file: 'src/app/api/pegawai/[nup]/route.ts',
    patterns: [
      {
        search: /const updatedPegawai =/,
        replace: '// eslint-disable-next-line @typescript-eslint/no-unused-vars\n      const updatedPegawai ='
      }
    ]
  },
  {
    file: 'src/app/dashboard/admin/detail-pegawai/[nup]/page.tsx',
    patterns: [
      {
        search: /} catch \(_err\) \{/,
        replace: '} catch {'
      },
      {
        search: /\.map\(\(kual, _index\) =>/,
        replace: '.map((kual) =>'
      }
    ]
  },
  {
    file: 'src/app/dashboard/admin/edit-pegawai/[nup]/page.tsx',
    patterns: [
      {
        search: /} catch \(_e\) \{/,
        replace: '} catch {'
      }
    ]
  },
  {
    file: 'src/app/dashboard/admin/page.tsx',
    patterns: [
      {
        search: /import LogoutButton from '\.\.\/\.\.\/components\/LogoutButton';/,
        replace: '// import LogoutButton from \'../../components/LogoutButton\';'
      }
    ]
  },
  {
    file: 'src/app/dashboard/admin/tambah-pegawai/page.tsx',
    patterns: [
      {
        search: /function PelatihanTag\(\{ pelatihan, index: _index, onRemove \}: PelatihanTagProps\)/,
        replace: '// eslint-disable-next-line @typescript-eslint/no-unused-vars\nfunction PelatihanTag({ pelatihan, index: _index, onRemove }: PelatihanTagProps)'
      }
    ]
  },
  {
    file: 'src/components/training/TrainingTable.tsx',
    patterns: [
      {
        search: /const ActionsCell =/,
        replace: '// eslint-disable-next-line @typescript-eslint/no-unused-vars\n  const ActionsCell ='
      }
    ]
  }
];

function applyRegexFixes() {
  fixes.forEach(({ file, patterns }) => {
    const filePath = path.join(__dirname, file);
    
    if (!fs.existsSync(filePath)) {
      console.log(`File not found: ${filePath}`);
      return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;

    patterns.forEach(({ search, replace }) => {
      if ((search instanceof RegExp && search.test(content)) || 
          (typeof search === 'string' && content.includes(search))) {
        content = content.replace(search, replace);
        hasChanges = true;
        console.log(`Fixed pattern in ${file}`);
      }
    });

    if (hasChanges) {
      fs.writeFileSync(filePath, content);
      console.log(`Updated: ${file}`);
    }
  });
}

console.log('Applying regex fixes...');
applyRegexFixes();
console.log('Done!');
