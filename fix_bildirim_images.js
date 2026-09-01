const fs = require('fs');
let content = fs.readFileSync('app/takim-kur/page.tsx', 'utf8');

const regex = /icon: logoUrl \|\| "https:\/\/klaslig\.vercel\.app\/icons\/icon-192x192\.png",/;
content = content.replace(regex, 'icon: "https://klaslig.vercel.app/icons/icon-192x192.png",\n            image: logoUrl || undefined,');

fs.writeFileSync('app/takim-kur/page.tsx', content, 'utf8');
console.log('Fixed push images!');
