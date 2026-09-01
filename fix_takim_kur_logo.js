const fs = require('fs');
let content = fs.readFileSync('app/takim-kur/page.tsx', 'utf8');

content = content.replace(/logo_url:\s*logoUrl/g, 'logo: logoUrl');

fs.writeFileSync('app/takim-kur/page.tsx', content, 'utf8');
console.log('Fixed logo_url in takim-kur!');
