const fs = require('fs');
const path = require('path');

// Mapping of commonly used icons and their files
const iconMappings = {
  'ArrowLeft': 'lucide-react',
  'Edit': 'lucide-react',
  'Trash2': 'lucide-react',
  'User': 'lucide-react',
  'Award': 'lucide-react',
  'Briefcase': 'lucide-react',
  'Loader2': 'lucide-react',
  'Download': 'lucide-react',
  'FileText': 'lucide-react',
  'File': 'lucide-react',
  'Mail': 'lucide-react',
  'Phone': 'lucide-react',
  'Plus': 'lucide-react',
  'X': 'lucide-react',
  'Save': 'lucide-react',
  'PlusCircle': 'lucide-react',
  'CheckCircle': 'lucide-react',
  'XCircle': 'lucide-react',
  'Eye': 'lucide-react',
  'Search': 'lucide-react'
};

function addMissingIcons(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Find all icon references in JSX
  const iconRegex = /<(\w+)(?:\s|\/)/g;
  const iconMatches = content.match(iconRegex);
  
  if (!iconMatches) return;

  const usedIcons = new Set();
  iconMatches.forEach(match => {
    const iconName = match.replace(/<(\w+).*/, '$1');
    if (iconMappings[iconName]) {
      usedIcons.add(iconName);
    }
  });

  if (usedIcons.size === 0) return;

  // Check if lucide-react import exists
  const hasLucideImport = content.includes('from \'lucide-react\'') || content.includes('from "lucide-react"');
  
  if (!hasLucideImport) {
    // Add new import
    const iconsArray = Array.from(usedIcons).sort();
    const importStatement = `import { ${iconsArray.join(', ')} } from 'lucide-react';\n`;
    
    // Find the best place to insert the import (after other imports)
    const importRegex = /^import.*from.*['"];?\s*$/gm;
    const imports = content.match(importRegex) || [];
    
    if (imports.length > 0) {
      const lastImport = imports[imports.length - 1];
      const lastImportIndex = content.lastIndexOf(lastImport) + lastImport.length;
      content = content.slice(0, lastImportIndex) + '\n' + importStatement + content.slice(lastImportIndex);
      changed = true;
    } else {
      // If no imports found, add at the beginning after use client directive
      const useClientMatch = content.match(/["']use client["'];\s*/);
      if (useClientMatch) {
        const insertIndex = useClientMatch.index + useClientMatch[0].length;
        content = content.slice(0, insertIndex) + '\n' + importStatement + content.slice(insertIndex);
        changed = true;
      }
    }
  } else {
    // Update existing import
    const importMatch = content.match(/import\s*\{\s*([^}]*)\s*\}\s*from\s*['"]lucide-react['"];?/);
    if (importMatch) {
      const existingIcons = importMatch[1].split(',').map(icon => icon.trim()).filter(Boolean);
      const allIcons = new Set([...existingIcons, ...usedIcons]);
      const newImportList = Array.from(allIcons).sort().join(', ');
      
      if (newImportList !== existingIcons.sort().join(', ')) {
        const newImport = `import { ${newImportList} } from 'lucide-react';`;
        content = content.replace(importMatch[0], newImport);
        changed = true;
      }
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed missing icons in: ${filePath}`);
  }
}

function findFilesWithErrors(dir) {
  const files = [];
  
  function walk(currentPath) {
    const items = fs.readdirSync(currentPath);
    
    for (const item of items) {
      const fullPath = path.join(currentPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        walk(fullPath);
      } else if (stat.isFile() && (item.endsWith('.tsx'))) {
        files.push(fullPath);
      }
    }
  }
  
  walk(dir);
  return files;
}

// Main execution
const srcDir = path.join(__dirname, 'src');
const tsxFiles = findFilesWithErrors(srcDir);

console.log(`Checking ${tsxFiles.length} TSX files for missing icon imports...`);

tsxFiles.forEach(addMissingIcons);

console.log('✅ All files processed!');
