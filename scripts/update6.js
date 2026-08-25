const fs = require('fs');
let text = fs.readFileSync('app/admin/canli-mac/page.tsx', 'utf8');

const replacement = `      const takim = olayTakimYonu === "ev" ? seciliMac.ev_sahibi : seciliMac.deplasman;
      let baslik = "";
      let mesaj = "";
      switch (olayTipi) {
        case "GOL": baslik = "⚽ GOOOL!"; mesaj = \`\${takim} adına \${olayOyuncu} \${seciliMac.dakika}. dakikada topu ağlara gönderdi! Skor: \${seciliMac.ev_skor}-\${seciliMac.dep_skor}\`; golSesiCal(); break;
        case "ASIST": baslik = "👟 ASİST"; mesaj = \`\${takim} takımından \${olayOyuncu} şık bir asiste imza attı!\`; break;
        case "SARI_KART": baslik = "🟨 SARI KART"; mesaj = \`\${takim} takımından \${olayOyuncu} sarı kart gördü.\`; break;
        case "KIRMIZI_KART": baslik = "🟥 KIRMIZI KART"; mesaj = \`\${takim} takımından \${olayOyuncu} kırmızı kart gördü!\`; break;
        case "DEGISIKLIK": baslik = "🔄 OYUNCU DEĞİŞİKLİĞİ"; mesaj = \`\${takim} takımında \${olayOyuncu} oyuna dahil oldu.\`; break;
        default: baslik = "⚡ MAÇ OLAYI"; mesaj = \`\${takim} takımından \${olayOyuncu} ile ilgili yeni bir gelişme var.\`;
      }
      await fetch("/api/send-notification", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ baslik, mesaj, url: "/" }) });
      alert("Olay başarıyla eklendi!");`;

text = text.replace(/alert\("Olay ba.+?ar.+?yla eklendi!"\);/, replacement);

fs.writeFileSync('app/admin/canli-mac/page.tsx', text);
console.log('Regex olayEkle done');
