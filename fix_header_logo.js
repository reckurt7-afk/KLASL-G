const fs = require('fs');
let content = fs.readFileSync('app/components/Header.tsx', 'utf8');

content = content.replace(/className="object-contain drop-shadow-sm"/, 'className="object-contain drop-shadow-sm rounded-full"');

fs.writeFileSync('app/components/Header.tsx', content, 'utf8');
console.log('Fixed header logo to be rounded!');
