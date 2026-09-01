const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('app', function(filePath) {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  
  content = content.replace(/bg-red-600/g, 'bg-[#d4af37]');
  content = content.replace(/text-red-600/g, 'text-[#d4af37]');
  content = content.replace(/border-red-600/g, 'border-[#d4af37]');
  
  content = content.replace(/bg-red-500/g, 'bg-[#eab308]');
  content = content.replace(/text-red-500/g, 'text-[#eab308]');
  content = content.replace(/border-red-500/g, 'border-[#eab308]');
  
  content = content.replace(/hover:bg-red-700/g, 'hover:bg-[#b5952f]');
  content = content.replace(/hover:text-red-700/g, 'hover:text-[#b5952f]');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
  }
});
console.log('Fixed Tailwind red classes!');
