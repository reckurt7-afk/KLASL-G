const fs = require('fs');
let page = fs.readFileSync('app/page.tsx', 'utf8');

page = page.replace(
  'muted={isMuted}',
  'muted={isMuted} defaultMuted'
);

fs.writeFileSync('app/page.tsx', page, 'utf8');
console.log('Fixed video autoplay!');
