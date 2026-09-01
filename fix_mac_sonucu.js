const fs = require('fs');
let content = fs.readFileSync('app/admin/mac-sonucu/page.tsx', 'utf8');

const replacement = `      const depTakim = tumTakimlar?.find(
        (t: any) => normalize(t.ad) === normalize(deplasman)
      );

      if (!evTakim || !depTakim) {
        const bulunamayan = !evTakim ? ev_sahibi : deplasman;
        const mevcutlar = tumTakimlar?.map((t) => t.ad).join(", ") || "";
        setMesaj({
          tip: "hata",
          yazi: \`"\${bulunamayan}" puan tablosunda bulunamadı. Mevcut takımlar: \${mevcutlar}\`,
        });
        setIsSaving(false);
        return;
      }

      // EğER GÜNCELLEME İŞLEMİYSE, ESKİ VERİLERİ GERİ AL (ÇIKART)
      if (seciliMac.oynandi) {
        const eskiEvGol = seciliMac.ev_skor ?? 0;
        const eskiDepGol = seciliMac.dep_skor ?? 0;
        
        // Ev sahibinden çıkar
        evTakim.oynanan = (evTakim.oynanan ?? 1) - 1;
        evTakim.atilan_gol = (evTakim.atilan_gol ?? 0) - eskiEvGol;
        evTakim.yenilen_gol = (evTakim.yenilen_gol ?? 0) - eskiDepGol;
        if (eskiEvGol > eskiDepGol) { evTakim.galibiyet = (evTakim.galibiyet ?? 1) - 1; evTakim.puan = (evTakim.puan ?? 3) - 3; }
        else if (eskiEvGol < eskiDepGol) { evTakim.maglubiyet = (evTakim.maglubiyet ?? 1) - 1; }
        else { evTakim.beraberlik = (evTakim.beraberlik ?? 1) - 1; evTakim.puan = (evTakim.puan ?? 1) - 1; }

        // Deplasmandan çıkar
        depTakim.oynanan = (depTakim.oynanan ?? 1) - 1;
        depTakim.atilan_gol = (depTakim.atilan_gol ?? 0) - eskiDepGol;
        depTakim.yenilen_gol = (depTakim.yenilen_gol ?? 0) - eskiEvGol;
        if (eskiDepGol > eskiEvGol) { depTakim.galibiyet = (depTakim.galibiyet ?? 1) - 1; depTakim.puan = (depTakim.puan ?? 3) - 3; }
        else if (eskiDepGol < eskiEvGol) { depTakim.maglubiyet = (depTakim.maglubiyet ?? 1) - 1; }
        else { depTakim.beraberlik = (depTakim.beraberlik ?? 1) - 1; depTakim.puan = (depTakim.puan ?? 1) - 1; }
      }

      // 3. Puan hesapla (YENİ SKORLARI EKLE)`;

content = content.replace(/const depTakim = tumTakimlar\?\.find\([\s\S]*?\/\/ 3\. Puan hesapla/, replacement);

fs.writeFileSync('app/admin/mac-sonucu/page.tsx', content, 'utf8');
console.log('Fixed mac sonucu updater!');
