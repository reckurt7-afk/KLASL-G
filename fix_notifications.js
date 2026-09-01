const fs = require('fs');
let content = fs.readFileSync('app/admin/canli-mac/page.tsx', 'utf8');

// Match Started
content = content.replace(
  'baslik: "▶️ MAÇ BAŞLADI!",\n                          mesaj: ${seciliMac.ev_sahibi} ile  arasındaki zorlu mücadele başladı!,',
  'baslik: "🏟️ HAKEMİN DÜDÜĞÜYLE MAÇ BAŞLADI!",\n                          mesaj: ${seciliMac.ev_sahibi} -  mücadelesinde heyecan fırtınası başladı. Başarılar!, '
);

// Goal (Ev)
content = content.replace(
  'baslik: ⚽ GOOOL! | ,\n                              mesaj: ${seciliMac.ev_sahibi} ağları havalandırdı!\\nMevcut Skor:  - ,',
  'baslik: ⚽ GOOOL! | ,\n                              mesaj: ${seciliMac.ev_sahibi} aradığı golü buldu! \\n👉 Skor:  - , '
);

// Goal Cancelled (Ev)
content = content.replace(
  'baslik: "❌ GOL İPTAL",\n                          mesaj: ${seciliMac.ev_sahibi} golü iptal edildi! Skor: -,',
  'baslik: "❌ VAR KARARI: GOL İPTAL",\n                          mesaj: ${seciliMac.ev_sahibi} ağlarına giden top gol değeri kazanmadı. \\n👉 Güncel Skor:  - , '
);

// Goal (Dep)
content = content.replace(
  'baslik: ⚽ GOOOL! | ,\n                              mesaj: ${seciliMac.deplasman} ağları havalandırdı!\\nMevcut Skor:  - ,',
  'baslik: ⚽ GOOOL! | ,\n                              mesaj: ${seciliMac.deplasman} aradığı golü buldu! \\n👉 Skor:  - , '
);

// Goal Cancelled (Dep)
content = content.replace(
  'baslik: "❌ GOL İPTAL",\n                          mesaj: ${seciliMac.deplasman} golü iptal edildi! Skor: -,',
  'baslik: "❌ VAR KARARI: GOL İPTAL",\n                          mesaj: ${seciliMac.deplasman} ağlarına giden top gol değeri kazanmadı. \\n👉 Güncel Skor:  - , '
);

// Half Time
content = content.replace(
  'baslik: "⏸️ DEVRE ARASI",\n                        mesaj: İlk yarı sona erdi. Skor:  - ,',
  'baslik: "⏱️ İLK YARI SONUCU",\n                        mesaj: Hakem ilk yarıyı bitiren düdüğü çaldı. Takımlar soyunma odasına gidiyor. \\n👉  - , '
);

// Second Half
content = content.replace(
  'baslik: "▶️ İKİNCİ YARI",\n                        mesaj: ${seciliMac.ev_sahibi} -  maçında ikinci yarı başladı!,',
  'baslik: "🏟️ İKİNCİ YARI BAŞLADI!",\n                        mesaj: ${seciliMac.ev_sahibi} -  maçında ikinci 45 dakika nefesleri kesecek. Top yeniden oyunda!, '
);

// Match Finished
content = content.replace(
  'baslik: "🏁 MAÇ SONA ERDİ!",\n                        mesaj: ${seciliMac.ev_sahibi} - ,',
  'baslik: "🏁 MAÇ SONUCU | 90 DAKİKA TAMAMLANDI",\n                        mesaj: Sahada kıyasıya mücadele sona erdi! \\n👉  - , '
);

// Timeline Events
content = content.replace(
  'case "gol": baslik = "⚽ GOL"; mesaj = ${takim} takımından  şık bir gole imza attı.; break;',
  'case "gol": baslik = "⚽ GOL SESİ!"; mesaj = ${takim} formasıyla , klas bir vuruşla topu ağlara gönderdi!; break;'
);
content = content.replace(
  'case "sari_kart": baslik = "🟨 SARI KART"; mesaj = ${takim} takımından  sarı kart gördü.; break;',
  'case "sari_kart": baslik = "🟨 SARI KART"; mesaj = Hakemin eli cebine gitti!  cephesinden  sarı kart gördü.; break;'
);
content = content.replace(
  'case "kirmizi_kart": baslik = "🟥 KIRMIZI KART"; mesaj = ${takim} takımından  kırmızı kart gördü!; break;',
  'case "kirmizi_kart": baslik = "🟥 KIRMIZI KART! TAKIM EKSİK KALDI"; mesaj = Şok karar!  oyuncusu  kırmızı kartla oyundan ihraç edildi!; break;'
);
content = content.replace(
  'case "degisiklik": baslik = "🔄 OYUNCU DEĞİŞİKLİĞİ"; mesaj = ${takim} takımında  oyuna dahil oldu.; break;',
  'case "degisiklik": baslik = "🔄 OYUNCU DEĞİŞİKLİĞİ"; mesaj = Taktiksel hamle:  takımında  oyuna dahil oluyor.; break;'
);

fs.writeFileSync('app/admin/canli-mac/page.tsx', content, 'utf8');
console.log("Notifications upgraded to Mackolik style!");
