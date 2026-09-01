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
  
  // Sadece metinleri değiştirelim
  
  // Ana parlak kırmızı -> Altın Sarısı
  content = content.replace(/#ff3131/g, '#d4af37');
  
  // Koyu Kırmızı (Vurgu) -> Koyu Mavi (Logodaki diğer ana renk)
  content = content.replace(/#e60000/g, '#1e3a8a');
  
  // Daha da Koyu Kırmızı (Gradient) -> Koyu Altın
  content = content.replace(/#a11212/g, '#8c7324');
  
  // rgba(255,49,49,...) -> rgba(212,175,55,...) for drop-shadows
  content = content.replace(/rgba\(255,49,49,/g, 'rgba(212,175,55,');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
  }
});
console.log('Updated theme colors!');
