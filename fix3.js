const fs = require('fs');
let content = fs.readFileSync('app/admin/canli-mac/page.tsx', 'utf8');

// Second Half
content = content.replace(
  /baslik: "▶️ İKİNCİ YARI",\s*mesaj: \`.*?\`,/g,
  'baslik: "🏟️ İKİNCİ YARI BAŞLADI!",\n                        mesaj: `${seciliMac.ev_sahibi} - ${seciliMac.deplasman} maçında ikinci 45 dakika nefesleri kesecek. Top yeniden oyunda!`,'
);

// Timeline Events
content = content.replace(
  /case "gol": baslik = "⚽ GOL"; mesaj = \`\$\{takim\} takımından \$\{olayOyuncu\} .*?\`; break;/g,
  'case "gol": baslik = "⚽ GOL SESİ!"; mesaj = `${takim} formasıyla ${olayOyuncu}, klas bir vuruşla topu ağlara gönderdi!`; break;'
);
content = content.replace(
  /case "sari_kart": baslik = "🟨 SARI KART"; mesaj = \`\$\{takim\} takımından \$\{olayOyuncu\} .*?\`; break;/g,
  'case "sari_kart": baslik = "🟨 SARI KART"; mesaj = `Hakemin eli cebine gitti! ${takim} cephesinden ${olayOyuncu} sarı kart gördü.`; break;'
);
content = content.replace(
  /case "kirmizi_kart": baslik = "🟥 KIRMIZI KART"; mesaj = \`\$\{takim\} takımından \$\{olayOyuncu\} .*?\`; break;/g,
  'case "kirmizi_kart": baslik = "🟥 KIRMIZI KART! TAKIM EKSİK KALDI"; mesaj = `Şok karar! ${takim} oyuncusu ${olayOyuncu} kırmızı kartla oyundan ihraç edildi!`; break;'
);
content = content.replace(
  /case "degisiklik": baslik = "🔄 OYUNCU DEĞİŞİKLİĞİ"; mesaj = \`\$\{takim\} takımında \$\{olayOyuncu\} .*?\`; break;/g,
  'case "degisiklik": baslik = "🔄 OYUNCU DEĞİŞİKLİĞİ"; mesaj = `Taktiksel hamle: ${takim} takımında ${olayOyuncu} oyuna dahil oluyor.`; break;'
);

fs.writeFileSync('app/admin/canli-mac/page.tsx', content, 'utf8');
console.log('Done!');
