const fs = require('fs');

let page = fs.readFileSync('app/admin/mac-sonucu/page.tsx', 'utf8');

// We need to insert the push notification code into kaydet()
const notificationCode = `
    // MVP Oylamasi Bildirimi Gonder
    try {
      await fetch("/api/send-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          baslik: "🏆 MAÇ BİTTİ! SENCE YILDIZ KİMDİ?",
          mesaj: \`\${ev_sahibi} \${evGol} - \${depGol} \${deplasman} maçı sona erdi. Hemen tıkla, kendi takımından sahanın yıldızını oyla!\`,
          url: \`/mvp-oylama/\${seciliMac.id}\`,
          requireInteraction: true,
          actions: [
            { action: "canli", title: "⭐ MVP OYUNU KULLAN" }
          ]
        })
      });
    } catch(err) {
      console.error("Bildirim gonderilemedi", err);
    }
`;

// Find where to insert it: right before "setMesaj({ tip: "ok", yazi: "Maç kaydedildi ve puan durumu güncellendi!" });"
page = page.replace(
  /setMesaj\(\{ tip: "ok", yazi: "Ma kaydedildi ve puan durumu gǬncellendi!" \}\);/g,
  `${notificationCode}\n    setMesaj({ tip: "ok", yazi: "Maç kaydedildi, puan durumu güncellendi ve MVP oylama bildirimleri gönderildi!" });`
);

// Note: Because of encoding issues with previous characters, let's use a more robust regex for the replace
page = page.replace(
  /setMesaj\(\{\s*tip:\s*"ok",\s*yazi:.*\}\);/g,
  `${notificationCode}\n    setMesaj({ tip: "ok", yazi: "Maç kaydedildi, puan durumu güncellendi ve MVP oylama bildirimleri gönderildi!" });`
);

fs.writeFileSync('app/admin/mac-sonucu/page.tsx', page, 'utf8');
console.log('Updated mac-sonucu page!');
