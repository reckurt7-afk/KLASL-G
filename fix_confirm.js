const fs = require('fs');
let content = fs.readFileSync('app/admin/takim-yonetimi/page.tsx', 'utf8');

content = content.replace(/if \(!window\.confirm.*?return;/g, "if (!window.confirm('DİKKAT: ' + name + ' takımını silmek istediğinize emin misiniz? Bu işlem geri alınamaz!')) return;");

fs.writeFileSync('app/admin/takim-yonetimi/page.tsx', content, 'utf8');
console.log('Fixed syntax error!');
