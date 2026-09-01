const fs = require('fs');
let content = fs.readFileSync('app/takim-kur/page.tsx', 'utf8');

content = content.replace(/baslik: "🔥 SAVAŞA YENİ BİR TAKIM KATILDI!"/g, 'baslik: "🔥 KLAS LİG\'E YENİ BİR TAKIM KATILDI!"');

fs.writeFileSync('app/takim-kur/page.tsx', content, 'utf8');
console.log('Fixed title!');
