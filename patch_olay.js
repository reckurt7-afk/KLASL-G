const fs = require('fs');

let content = fs.readFileSync('app/admin/canli-mac/page.tsx', 'utf8');

const targetOlay = `    if (error) {
      alert("Olay eklenemedi: " + error.message);
    } else {
      alert("Olay başarıyla eklendi!");
      setOlayOyuncu("");
    }`;

const replaceOlay = `    if (error) {
      alert("Olay eklenemedi: " + error.message);
    } else {
      alert("Olay başarıyla eklendi!");
      
      // Bildirim gönder
      let emoji = "🔔";
      if (olayTipi === "GOL") emoji = "⚽ GOL!";
      if (olayTipi === "SARI_KART") emoji = "🟨 SARI KART";
      if (olayTipi === "KIRMIZI_KART") emoji = "🟥 KIRMIZI KART";
      if (olayTipi === "ASIST") emoji = "🎯 ASİST";
      if (olayTipi === "DEGISIKLIK") emoji = "🔄 DEĞİŞİKLİK";

      const takimAdi = olayTakimYonu === "ev" ? seciliMac.ev_sahibi : seciliMac.deplasman;
      
      fetch('/api/send-notification', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ 
          baslik: emoji + ' | ' + takimAdi, 
          mesaj: seciliMac.dakika + ". Dakika - Oyuncu: " + olayOyuncu, 
          url: "/" 
        }) 
      });

      setOlayOyuncu("");
    }`;

// G-fallback for matching due to encoding issues with ş, ı
const olayRegex = /if \(error\) \{\s*alert\("Olay eklenemedi: " \+ error\.message\);\s*\} else \{\s*alert\("Olay ba[^"]+"[^;]*;\s*setOlayOyuncu\(""\);\s*\}/;

if(content.match(olayRegex)) {
    content = content.replace(olayRegex, replaceOlay);
    fs.writeFileSync('app/admin/canli-mac/page.tsx', content);
    console.log('OlayEkle patched');
} else {
    console.log('Regex not found');
}
