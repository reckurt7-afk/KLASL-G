const fs = require('fs');
let content = fs.readFileSync('app/admin/canli-mac/page.tsx', 'utf8');

content = content.replace(
  '<option value="GOL">⚽ Gol</option>',
  '<option value="GOL">⚽ Gol</option>\n                    <option value="ASIST">🎯 Asist</option>'
);

fs.writeFileSync('app/admin/canli-mac/page.tsx', content, 'utf8');
console.log('Added ASIST option!');
