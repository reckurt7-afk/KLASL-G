const fs = require('fs');
let content = fs.readFileSync('app/admin/canli-mac/page.tsx', 'utf8');

content = content.replace(
  'canli: boolean;\r\n  hakem: string;',
  'canli: boolean;\r\n  oynandi?: boolean;\r\n  hakem: string;'
);

content = content.replace(
  'canli: boolean;\n  hakem: string;',
  'canli: boolean;\n  oynandi?: boolean;\n  hakem: string;'
);

content = content.replace(
  /update\(\{ canli: false, durum: "Devre Arası" \}\)/g,
  'update({ oynandi: true, canli: false, durum: "Devre Arası" })'
);

content = content.replace(
  /setSeciliMac\(\{ \.\.\.seciliMac, canli: false, durum: "Devre Arası" \}\)/g,
  'setSeciliMac({ ...seciliMac, oynandi: true, canli: false, durum: "Devre Arası" })'
);

content = content.replace(
  /update\(\{ canli: false, durum: "Maç Sona Erdi" \}\)/g,
  'update({ oynandi: true, canli: false, durum: "Maç Sona Erdi" })'
);

content = content.replace(
  /setSeciliMac\(\{ \.\.\.seciliMac, canli: false, durum: "Maç Sona Erdi" \}\)/g,
  'setSeciliMac({ ...seciliMac, oynandi: true, canli: false, durum: "Maç Sona Erdi" })'
);

fs.writeFileSync('app/admin/canli-mac/page.tsx', content, 'utf8');
console.log('Fixed using Node.js!');
