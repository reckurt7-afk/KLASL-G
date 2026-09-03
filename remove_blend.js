const fs = require('fs');
let page = fs.readFileSync('app/page.tsx', 'utf8');

page = page.replace(
  'bg-transparent mix-blend-screen',
  'bg-black'
);

fs.writeFileSync('app/page.tsx', page, 'utf8');
