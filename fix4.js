const fs = require('fs');
let content = fs.readFileSync('app/admin/canli-mac/page.tsx', 'utf8');

content = content.replace(
  /case "GOL": baslik = "⚽ GOOOL!"; mesaj = \`.*?\`; golSesiCal\(\); break;/g,
  'case "GOL": baslik = "⚽ GOL SESİ!"; mesaj = `${takim} formasıyla ${olayOyuncu}, ${seciliMac.dakika}. dakikada klas bir vuruşla topu ağlara gönderdi!`; golSesiCal(); break;'
);

content = content.replace(
  /case "SARI_KART": baslik = ".*? SARI KART"; mesaj = \`.*?\`; break;/g,
  'case "SARI_KART": baslik = "🟨 SARI KART"; mesaj = `Hakemin eli cebine gitti! ${takim} cephesinden ${olayOyuncu} sarı kart gördü.`; break;'
);

content = content.replace(
  /case "KIRMIZI_KART": baslik = ".*? KIRMIZI KART"; mesaj = \`.*?\`; break;/g,
  'case "KIRMIZI_KART": baslik = "🟥 KIRMIZI KART! TAKIM EKSİK KALDI"; mesaj = `Şok karar! ${takim} oyuncusu ${olayOyuncu} kırmızı kartla oyundan ihraç edildi!`; break;'
);

content = content.replace(
  /case "DEGISIKLIK": baslik = ".*? OYUNCU DEĞİŞİKLİĞİ"; mesaj = \`.*?\`; break;/g,
  'case "DEGISIKLIK": baslik = "🔄 OYUNCU DEĞİŞİKLİĞİ"; mesaj = `Taktiksel hamle: ${takim} takımında ${olayOyuncu} oyuna dahil oluyor.`; break;'
);

content = content.replace(
  /case "ASIST": baslik = ".*? ASİST"; mesaj = \`.*?\`; break;/g,
  'case "ASIST": baslik = "🎯 ASİST"; mesaj = `Golün mimarı! ${takim} takımından ${olayOyuncu} akıl dolu bir asist yaptı!`; break;'
);

fs.writeFileSync('app/admin/canli-mac/page.tsx', content, 'utf8');
console.log('Done!');
