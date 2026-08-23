const fs = require('fs');
let content = fs.readFileSync('app/admin/canli-mac/page.tsx', 'utf8');

// The original file (which had broken encodings from my first patches) had these:
content = content.replace(/baslik: 's GOL!/g, "baslik: '⚽ GOL!");
content = content.replace(/baslik: '- MA BA\?LADI/g, "baslik: '▶ MAÇ BAŞLADI");
content = content.replace(/baslik: '\? DEVRE ARASI/g, "baslik: '⏸ DEVRE ARASI");
content = content.replace(/baslik: '- KNC YARI/g, "baslik: '▶ İKİNCİ YARI");
content = content.replace(/baslik: 'Y\?\? MA SONA ERD!/g, "baslik: '🏁 MAÇ SONA ERDİ");

// Time tunnel emojis
content = content.replace(/emoji = "Y\? ASST"/g, 'emoji = "🎯 ASİST"');
content = content.replace(/emoji = "Y"" DE\?\?KLK"/g, 'emoji = "🔄 DEĞİŞİKLİK"');
content = content.replace(/emoji = "s GOL!"/g, 'emoji = "⚽ GOL!"');
content = content.replace(/emoji = "Y Sar Kart"/g, 'emoji = "🟨 Sarı Kart"');
content = content.replace(/emoji = "Y Krmz Kart"/g, 'emoji = "🟥 Kırmızı Kart"');

content = content.replace(/mesaj: 'Ma an itibariyle baYlad!'/g, "mesaj: 'Maç an itibariyle başladı!'");
content = content.replace(/`lk yar sona erdi/g, "`İlk yarı sona erdi");
content = content.replace(/manda ikinci yar baYlad!/g, "maçında ikinci yarı başladı!");

// Remove the duplicate canliDurumGuncelle fetch completely safely
const fetchToRemove = /if \(canli\) \{\s*await fetch\("\/api\/send-notification", \{\s*method: "POST",\s*headers: \{ "Content-Type": "application\/json" \},\s*body: JSON\.stringify\(\{\s*baslik: "▶ MAÇ BAŞLADI",\s*mesaj: `\$\{seciliMac\.ev_sahibi\} - \$\{seciliMac\.deplasman\} maçı başladı!`,?\s*\}\),\s*\}\);\s*\}/;

content = content.replace(fetchToRemove, "");

// Since the broken encodings were in the fetchToRemove, I might need to match the broken version too:
const fetchToRemoveBroken = /if \(canli\) \{\s*await fetch\("\/api\/send-notification", \{\s*method: "POST",\s*headers: \{ "Content-Type": "application\/json" \},\s*body: JSON\.stringify\(\{\s*baslik: "[^"]+",\s*mesaj: `[^`]+`\s*\}\),\s*\}\);\s*\}/;
content = content.replace(fetchToRemoveBroken, "");

fs.writeFileSync('app/admin/canli-mac/page.tsx', content);
console.log('Fixed properly');
