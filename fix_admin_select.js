const fs = require('fs');
let content = fs.readFileSync('app/admin/canli-mac/page.tsx', 'utf8');

content = content.replace('const [olayTipi, setOlayTipi] = useState("gol");', 'const [olayTipi, setOlayTipi] = useState("GOL");');

content = content.replace('<option value="gol">', '<option value="GOL">');
content = content.replace('<option value="sari_kart">', '<option value="SARI_KART">');
content = content.replace('<option value="kirmizi_kart">', '<option value="KIRMIZI_KART">');
content = content.replace('<option value="degisiklik">', '<option value="DEGISIKLIK">');

fs.writeFileSync('app/admin/canli-mac/page.tsx', content, 'utf8');
console.log('Fixed options!');
