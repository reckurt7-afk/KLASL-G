const fs = require('fs');
let content = fs.readFileSync('app/components/TakimlarListesi.tsx', 'utf8');

content = content.replace('const data = await publicFetch("takimlar"', 'let data = await publicFetch("takimlar"');

fs.writeFileSync('app/components/TakimlarListesi.tsx', content, 'utf8');
console.log('Fixed let/const!');
