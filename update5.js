const fs = require('fs');
let text = fs.readFileSync('app/admin/canli-mac/page.tsx', 'utf8');

text = text.replace(/const golAtan = prompt.+/g, '');
text = text.replace(/durum: \`Canlı\|.*?\`/g, 'durum: "Canlı"');
text = text.replace(/mesaj: golAtan[\s\S]*?\?\s*\`.+Skor: \$\{yeniSkor\}-\$\{seciliMac\.dep_skor\}\`[\s\S]*?:\s*\`/g, 'mesaj: \`');
text = text.replace(/mesaj: golAtan[\s\S]*?\?\s*\`.+Skor: \$\{seciliMac\.ev_skor\}-\$\{yeniSkor\}\`[\s\S]*?:\s*\`/g, 'mesaj: \`');

fs.writeFileSync('app/admin/canli-mac/page.tsx', text);
console.log('Regex fix done');
