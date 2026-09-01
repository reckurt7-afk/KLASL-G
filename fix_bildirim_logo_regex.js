const fs = require('fs');
let content = fs.readFileSync('app/takim-kur/page.tsx', 'utf8');

const regex = /url: "\/genel-bakis"/;
content = content.replace(regex, 'icon: logoUrl || "https://klaslig.vercel.app/icons/icon-192x192.png",\n            url: "/genel-bakis"');

fs.writeFileSync('app/takim-kur/page.tsx', content, 'utf8');
console.log('Fixed via regex!');
