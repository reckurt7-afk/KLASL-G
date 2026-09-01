const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const ignoreDirs = ['node_modules', '.next', '.git'];

walkDir('app', function(filePath) {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  
  // Sadece metinleri değiştirelim, linklerdeki klaslig vercel domainini şimdilik bozmayalım
  // İstisnalar için klaslig.vercel.app'i bir değişkene saklayalım
  const placeholder = '___VERCEL_DOMAIN___';
  content = content.replace(/klaslig\.vercel\.app/g, placeholder);
  
  // Değiştirmeler
  content = content.replace(/KLAS LİG/g, 'PRO LİG');
  content = content.replace(/Klas Lig/g, 'Pro Lig');
  content = content.replace(/klas lig/g, 'pro lig');
  
  // Geri yükle
  content = content.replace(new RegExp(placeholder, 'g'), 'klaslig.vercel.app');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated:', filePath);
  }
});
