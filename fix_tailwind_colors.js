const fs = require('fs');
const { execSync } = require('child_process');

const files = execSync('git ls-files').toString().split('\n').filter(Boolean);
const jsTsFiles = files.filter(f => f.endsWith('.ts') || f.endsWith('.tsx'));

let changed = 0;

jsTsFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let orig = content;

  // Replace Tailwind reds with our custom burgundy
  content = content.replace(/bg-red-600/g, 'bg-[#9e1b22]');
  content = content.replace(/bg-red-500/g, 'bg-[#b82029]');
  content = content.replace(/text-red-600/g, 'text-[#9e1b22]');
  content = content.replace(/text-red-500/g, 'text-[#b82029]');
  content = content.replace(/border-red-600/g, 'border-[#9e1b22]');
  content = content.replace(/border-red-500/g, 'border-[#b82029]');
  
  // Install button is currently blue #1e3a8a, let's make it Gold #ceaa52
  content = content.replace(/bg-\[#1e3a8a\]/g, 'bg-[#ceaa52]');
  content = content.replace(/border-\[#1e3a8a\]/g, 'border-[#ceaa52]');
  content = content.replace(/text-\[#1e3a8a\]/g, 'text-[#ceaa52]');

  if (content !== orig) {
    fs.writeFileSync(file, content, 'utf8');
    changed++;
  }
});
console.log(`Updated Tailwind colors in ${changed} files!`);
