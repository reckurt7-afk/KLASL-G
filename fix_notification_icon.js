const fs = require('fs');
let content = fs.readFileSync('app/takim-kur/page.tsx', 'utf8');
content = content.replace(/https:\/\/klaslig\.vercel\.app\/icons\/icon-192x192\.png/g, 'https://klaslig.vercel.app/icons/logo.png');
fs.writeFileSync('app/takim-kur/page.tsx', content, 'utf8');
console.log('Fixed notification icon!');
