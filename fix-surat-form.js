const fs = require('fs');

const filePath = 'src/components/SuratTugas/SuratTugasForm.tsx';

if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace all occurrences of the problematic pattern
  content = content.replace(
    /checked=\{\(formData as unknown\)\[name\]\}/g,
    'checked={(formData as Record<string, unknown>)[name] as boolean}'
  );

  fs.writeFileSync(filePath, content);
  console.log('Updated SuratTugasForm.tsx');
} else {
  console.log('File not found:', filePath);
}

console.log('Done!');
