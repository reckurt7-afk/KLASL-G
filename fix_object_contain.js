const fs = require('fs');
let content = fs.readFileSync('app/components/TakimlarListesi.tsx', 'utf8');

content = content.replace('object-cover p-2', 'object-contain p-2');

fs.writeFileSync('app/components/TakimlarListesi.tsx', content, 'utf8');
console.log('Fixed to object-contain!');
