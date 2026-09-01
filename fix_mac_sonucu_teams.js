const fs = require('fs');
let content = fs.readFileSync('app/admin/mac-sonucu/page.tsx', 'utf8');

// Replace all takimlar fetch logic to teams
const oldLogic = `    // 2. Tüm takımları publicFetch ile çek (RLS bypass)
    const tumTakimlar = await publicFetch("takimlar", "select=*");

    const normalize = (s: string) =>
      (s || "").trim().replace(/\\s+/g, " ");

    const evTakim = tumTakimlar?.find(
      (t: any) => normalize(t.ad) === normalize(ev_sahibi)
    );
          const depTakim = tumTakimlar?.find(
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

      // 3. Puan hesapla (YENİ SKORLARI EKLE)
    const evAtilan = (evTakim.atilan_gol ?? 0) + evGol;
    const evYenilen = (evTakim.yenilen_gol ?? 0) + depGol;
    const depAtilan = (depTakim.atilan_gol ?? 0) + depGol;
    const depYenilen = (depTakim.yenilen_gol ?? 0) + evGol;

    let evGalibiyet = evTakim.galibiyet ?? 0;
    let evBeraberlik = evTakim.beraberlik ?? 0;
    let evMaglubiyet = evTakim.maglubiyet ?? 0;
    let evPuan = evTakim.puan ?? 0;

    let depGalibiyet = depTakim.galibiyet ?? 0;
    let depBeraberlik = depTakim.beraberlik ?? 0;
    let depMaglubiyet = depTakim.maglubiyet ?? 0;
    let depPuan = depTakim.puan ?? 0;

    if (evGol > depGol) {
      evGalibiyet += 1; evPuan += 3;
      depMaglubiyet += 1;
    } else if (evGol < depGol) {
      depGalibiyet += 1; depPuan += 3;
      evMaglubiyet += 1;
    } else {
      evBeraberlik += 1; evPuan += 1;
      depBeraberlik += 1; depPuan += 1;
    }

    // 4. Puan tablosunu güncelle - AD yerine ID ile (Türkçe karakter sorunu yok)
    await supabase.from("takimlar").update({
      oynanan: (evTakim.oynanan ?? 0) + 1,
      galibiyet: evGalibiyet,
      beraberlik: evBeraberlik,
      maglubiyet: evMaglubiyet,
      atilan_gol: evAtilan,
      yenilen_gol: evYenilen,
      averaj: evAtilan - evYenilen,
      puan: evPuan,
    }).eq("id", evTakim.id);

    await supabase.from("takimlar").update({
      oynanan: (depTakim.oynanan ?? 0) + 1,
      galibiyet: depGalibiyet,
      beraberlik: depBeraberlik,
      maglubiyet: depMaglubiyet,
      atilan_gol: depAtilan,
      yenilen_gol: depYenilen,
      averaj: depAtilan - depYenilen,
      puan: depPuan,
    }).eq("id", depTakim.id);`;

const newLogic = `    // 2. Tüm takımları publicFetch ile çek (RLS bypass)
    const tumTakimlar = await publicFetch("teams", "select=*");

    const normalize = (s: string) =>
      (s || "").trim().replace(/\\s+/g, " ");

    const evTakim = tumTakimlar?.find(
      (t: any) => normalize(t.name) === normalize(ev_sahibi)
    );
    const depTakim = tumTakimlar?.find(
      (t: any) => normalize(t.name) === normalize(deplasman)
    );

    if (!evTakim || !depTakim) {
      const bulunamayan = !evTakim ? ev_sahibi : deplasman;
      const mevcutlar = tumTakimlar?.map((t) => t.name).join(", ") || "";
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
      evTakim.played = (evTakim.played ?? 1) - 1;
      evTakim.goals_for = (evTakim.goals_for ?? 0) - eskiEvGol;
      evTakim.goals_against = (evTakim.goals_against ?? 0) - eskiDepGol;
      if (eskiEvGol > eskiDepGol) { evTakim.won = (evTakim.won ?? 1) - 1; evTakim.points = (evTakim.points ?? 3) - 3; }
      else if (eskiEvGol < eskiDepGol) { evTakim.lost = (evTakim.lost ?? 1) - 1; }
      else { evTakim.drawn = (evTakim.drawn ?? 1) - 1; evTakim.points = (evTakim.points ?? 1) - 1; }

      // Deplasmandan çıkar
      depTakim.played = (depTakim.played ?? 1) - 1;
      depTakim.goals_for = (depTakim.goals_for ?? 0) - eskiDepGol;
      depTakim.goals_against = (depTakim.goals_against ?? 0) - eskiEvGol;
      if (eskiDepGol > eskiEvGol) { depTakim.won = (depTakim.won ?? 1) - 1; depTakim.points = (depTakim.points ?? 3) - 3; }
      else if (eskiDepGol < eskiEvGol) { depTakim.lost = (depTakim.lost ?? 1) - 1; }
      else { depTakim.drawn = (depTakim.drawn ?? 1) - 1; depTakim.points = (depTakim.points ?? 1) - 1; }
    }

    // 3. Puan hesapla (YENİ SKORLARI EKLE)
    const evAtilan = (evTakim.goals_for ?? 0) + evGol;
    const evYenilen = (evTakim.goals_against ?? 0) + depGol;
    const depAtilan = (depTakim.goals_for ?? 0) + depGol;
    const depYenilen = (depTakim.goals_against ?? 0) + evGol;

    let evGalibiyet = evTakim.won ?? 0;
    let evBeraberlik = evTakim.drawn ?? 0;
    let evMaglubiyet = evTakim.lost ?? 0;
    let evPuan = evTakim.points ?? 0;

    let depGalibiyet = depTakim.won ?? 0;
    let depBeraberlik = depTakim.drawn ?? 0;
    let depMaglubiyet = depTakim.lost ?? 0;
    let depPuan = depTakim.points ?? 0;

    if (evGol > depGol) {
      evGalibiyet += 1; evPuan += 3;
      depMaglubiyet += 1;
    } else if (evGol < depGol) {
      depGalibiyet += 1; depPuan += 3;
      evMaglubiyet += 1;
    } else {
      evBeraberlik += 1; evPuan += 1;
      depBeraberlik += 1; depPuan += 1;
    }

    // 4. Puan tablosunu güncelle - AD yerine ID ile (Türkçe karakter sorunu yok)
    await supabase.from("teams").update({
      played: (evTakim.played ?? 0) + 1,
      won: evGalibiyet,
      drawn: evBeraberlik,
      lost: evMaglubiyet,
      goals_for: evAtilan,
      goals_against: evYenilen,
      goal_difference: evAtilan - evYenilen,
      points: evPuan,
    }).eq("id", evTakim.id);

    await supabase.from("teams").update({
      played: (depTakim.played ?? 0) + 1,
      won: depGalibiyet,
      drawn: depBeraberlik,
      lost: depMaglubiyet,
      goals_for: depAtilan,
      goals_against: depYenilen,
      goal_difference: depAtilan - depYenilen,
      points: depPuan,
    }).eq("id", depTakim.id);`;

// Let's replace by slicing since exact match might fail due to spaces/newlines
const startIndex = content.indexOf('// 2. Tüm takımları publicFetch ile çek');
const endIndex = content.indexOf('// 5. Bildirim gönder - herkese');

if (startIndex !== -1 && endIndex !== -1) {
  content = content.slice(0, startIndex) + newLogic + '\n\n    ' + content.slice(endIndex);
  fs.writeFileSync('app/admin/mac-sonucu/page.tsx', content, 'utf8');
  console.log('Fixed mac-sonucu logic directly!');
} else {
  console.log('Could not find start/end index!');
}
