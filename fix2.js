const fs = require('fs');
let content = fs.readFileSync('app/admin/canli-mac/page.tsx', 'utf8');

// Match Started
content = content.replace(
  /baslik: ".*? MA.*? BA.*?LADI!",\s*mesaj: `.*?`,/g,
  'baslik: "🏟️ HAKEMİN DÜDÜĞÜYLE MAÇ BAŞLADI!",\n            mesaj: `${seciliMac.ev_sahibi} - ${seciliMac.deplasman} mücadelesinde heyecan fırtınası başladı. Başarılar!`,'
);

// Goal (Ev)
content = content.replace(
  /baslik: \`.*? GOOOL! \| \$\{seciliMac\.ev_sahibi\}\`,\s*mesaj: \`\$\{seciliMac\.ev_sahibi\} .*?\`,\s*url/g,
  'baslik: `⚽ GOOOL! | ${seciliMac.ev_sahibi}`,\n                              mesaj: `${seciliMac.ev_sahibi} aradığı golü buldu! \\n👉 Skor: ${seciliMac.ev_sahibi} ${yeniSkor}-${seciliMac.dep_skor} ${seciliMac.deplasman}`,\n                              url'
);

// Goal (Dep)
content = content.replace(
  /baslik: \`.*? GOOOL! \| \$\{seciliMac\.deplasman\}\`,\s*mesaj: \`\$\{seciliMac\.deplasman\} .*?\`,\s*url/g,
  'baslik: `⚽ GOOOL! | ${seciliMac.deplasman}`,\n                              mesaj: `${seciliMac.deplasman} aradığı golü buldu! \\n👉 Skor: ${seciliMac.ev_sahibi} ${seciliMac.ev_skor}-${yeniSkor} ${seciliMac.deplasman}`,\n                              url'
);

// Goal Cancelled (Ev)
content = content.replace(
  /baslik: ".*? GOL .*?PTAL",\s*mesaj: \`\$\{seciliMac\.ev_sahibi\} .*?\`,/g,
  'baslik: "❌ VAR KARARI: GOL İPTAL",\n                          mesaj: `${seciliMac.ev_sahibi} ağlarına giden top gol değeri kazanmadı. \\n👉 Güncel Skor: ${seciliMac.ev_sahibi} ${yeniSkor}-${seciliMac.dep_skor} ${seciliMac.deplasman}`,'
);

// Goal Cancelled (Dep)
content = content.replace(
  /baslik: ".*? GOL .*?PTAL",\s*mesaj: \`\$\{seciliMac\.deplasman\} .*?\`,/g,
  'baslik: "❌ VAR KARARI: GOL İPTAL",\n                          mesaj: `${seciliMac.deplasman} ağlarına giden top gol değeri kazanmadı. \\n👉 Güncel Skor: ${seciliMac.ev_sahibi} ${seciliMac.ev_skor}-${yeniSkor} ${seciliMac.deplasman}`,'
);

// Half Time
content = content.replace(
  /baslik: ".*? DEVRE ARASI",\s*mesaj: \`.*?\`,/g,
  'baslik: "⏱️ İLK YARI SONUCU",\n                        mesaj: `Hakem ilk yarıyı bitiren düdüğü çaldı. Takımlar soyunma odasına gidiyor. \\n👉 ${seciliMac.ev_sahibi} ${seciliMac.ev_skor}-${seciliMac.dep_skor} ${seciliMac.deplasman}`,'
);

// Second Half
content = content.replace(
  /baslik: ".*? K.*?NC.*? YARI",\s*mesaj: \`.*?\`,/g,
  'baslik: "🏟️ İKİNCİ YARI BAŞLADI!",\n                        mesaj: `${seciliMac.ev_sahibi} - ${seciliMac.deplasman} maçında ikinci 45 dakika nefesleri kesecek. Top yeniden oyunda!`,'
);

// Match Finished
content = content.replace(
  /baslik: ".*? MA.*? SONA ERD.*?",\s*mesaj: \`.*?\`,/g,
  'baslik: "🏁 MAÇ SONUCU | 90 DAKİKA TAMAMLANDI",\n                        mesaj: `Sahada kıyasıya mücadele sona erdi! \\n👉 ${seciliMac.ev_sahibi} ${seciliMac.ev_skor}-${seciliMac.dep_skor} ${seciliMac.deplasman}`,'
);

// Timeline Events
content = content.replace(
  /case "gol": baslik = ".*? GOL"; mesaj = \`\$\{takim\} takımından \$\{olayOyuncu\} .*?\`; break;/g,
  'case "gol": baslik = "⚽ GOL SESİ!"; mesaj = `${takim} formasıyla ${olayOyuncu}, klas bir vuruşla topu ağlara gönderdi!`; break;'
);
content = content.replace(
  /case "sari_kart": baslik = ".*? SARI KART"; mesaj = \`\$\{takim\} takımından \$\{olayOyuncu\} .*?\`; break;/g,
  'case "sari_kart": baslik = "🟨 SARI KART"; mesaj = `Hakemin eli cebine gitti! ${takim} cephesinden ${olayOyuncu} sarı kart gördü.`; break;'
);
content = content.replace(
  /case "kirmizi_kart": baslik = ".*? KIRMIZI KART"; mesaj = \`\$\{takim\} takımından \$\{olayOyuncu\} .*?\`; break;/g,
  'case "kirmizi_kart": baslik = "🟥 KIRMIZI KART! TAKIM EKSİK KALDI"; mesaj = `Şok karar! ${takim} oyuncusu ${olayOyuncu} kırmızı kartla oyundan ihraç edildi!`; break;'
);
content = content.replace(
  /case "degisiklik": baslik = ".*? OYUNCU DEĞİŞİKLİĞİ"; mesaj = \`\$\{takim\} takımında \$\{olayOyuncu\} .*?\`; break;/g,
  'case "degisiklik": baslik = "🔄 OYUNCU DEĞİŞİKLİĞİ"; mesaj = `Taktiksel hamle: ${takim} takımında ${olayOyuncu} oyuna dahil oluyor.`; break;'
);

fs.writeFileSync('app/admin/canli-mac/page.tsx', content, 'utf8');
console.log('Done!');
