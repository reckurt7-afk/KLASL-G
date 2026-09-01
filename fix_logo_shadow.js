const fs = require('fs');
let content = fs.readFileSync('app/components/TakimlarListesi.tsx', 'utf8');

content = content.replace(/className="object-contain drop-shadow-\[0_5px_15px_rgba\(0,0,0,0\.8\)\]"/g, 'className="object-contain"');

fs.writeFileSync('app/components/TakimlarListesi.tsx', content, 'utf8');
console.log('Fixed shadow in TakimlarListesi!');
