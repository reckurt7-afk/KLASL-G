const fs = require('fs');
let content = fs.readFileSync('app/admin/canli-mac/page.tsx', 'utf8');

// Fix state
content = content.replace('const [olayTipi, setOlayTipi] = useState("gol");', 'const [olayTipi, setOlayTipi] = useState("GOL");');

// Fix options
content = content.replace('<option value="gol">⚽ Gol</option>', '<option value="GOL">⚽ Gol</option>\n                    <option value="ASIST">🎯 Asist</option>');
content = content.replace('<option value="sari_kart">🟨 Sarı Kart</option>', '<option value="SARI_KART">🟨 Sarı Kart</option>');
content = content.replace('<option value="kirmizi_kart">🟥 Kırmızı Kart</option>', '<option value="KIRMIZI_KART">🟥 Kırmızı Kart</option>');
content = content.replace('<option value="degisiklik">🔄 Oyuncu Değişikliği</option>', '<option value="DEGISIKLIK">🔄 Oyuncu Değişikliği</option>');

fs.writeFileSync('app/admin/canli-mac/page.tsx', content, 'utf8');
console.log('Fixed options and state!');
