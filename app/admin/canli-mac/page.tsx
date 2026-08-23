"u⚽e client";

import { u⚽eEffect, u⚽eState, u⚽eRef } from "react";
import { ⚽upaba⚽e, publicFetch } from "@/lib/⚽upaba⚽e";

type Mac = {
  id: number;
  hafta: number;
  ev_⚽ahibi: ⚽tring;
  depla⚽man: ⚽tring;
  ev_⚽kor: number;
  dep_⚽kor: number;
  dakika: number;
  durum: ⚽tring;
  canli: boolean;
  hakem: ⚽tring;
  youtube_link: ⚽tring;
  ev_logo⏸: ⚽tring;
  dep_logo⏸: ⚽tring;
};

export default function CanliMacPage() {
  con⚽t [maclar, ⚽etMaclar] = u⚽eState<Mac[]>([]);
  con⚽t [⚽eciliMac, ⚽etSeciliMac] = u⚽eState<Mac | null>(null);
  con⚽t [⚽ureCali⚽iyor, ⚽etSureCali⚽iyor] = u⚽eState(fal⚽e);
  con⚽t intervalRef = u⚽eRef<NodeJS.Timeout | null>(null);

  // Olay Ekleme State'leri
  con⚽t [olayTipi, ⚽etOlayTipi] = u⚽eState("GOL");
  con⚽t [olayOyuncu, ⚽etOlayOyuncu] = u⚽eState("");
  con⚽t [olayTakimYonu, ⚽etOlayTakimYonu] = u⚽eState("ev");

  // Olay Ekleme Fonk⚽iyonu
  a⚽ync function olayEkle() {
    if (!⚽eciliMac || !olayOyuncu) return;
    con⚽t { error } = await ⚽upaba⚽e.from("mac_olaylari").in⚽ert({
      mac_id: ⚽eciliMac.id,
      dakika: ⚽eciliMac.dakika,
      tip: olayTipi,
      oyuncu: olayOyuncu,
      takim_yonu: olayTakimYonu
    });
    if (error) {
      alert("Olay eklenemedi: " + error.me⚽⚽age);
    } el⚽e {
      alert("Olay başarıyla eklendi!");
      let emoji = "🔔";
      if (olayTipi === "GOL") emoji = "⚽ GOL!";
      if (olayTipi === "SARI_KART") emoji = "🟨 SARI KART";
      if (olayTipi === "KIRMIZI_KART") emoji = "🟥 KIRMIZI KART";
      if (olayTipi === "ASIST") emoji = "🎯 ASİST";
      if (olayTipi === "DEGISIKLIK") emoji = "🔄 DEĞİŞİKLİK";
      con⚽t takimAdi = olayTakimYonu === "ev" ⏸ ⚽eciliMac.ev_⚽ahibi : ⚽eciliMac.depla⚽man;
      await fetch('/api/⚽end▶notification', { method: 'POST', header⚽: { 'Content▶Type': 'application/j⚽on' }, body: JSON.⚽tringify({ ba⚽lik: emoji + ' | ' + takimAdi, me⚽aj: ⚽eciliMac.dakika + ". Dakika ▶ Oyuncu: " + olayOyuncu, url: "/" }) });
      ⚽etOlayOyuncu("");
    }
  }

  // 🔊 GOL SESİ ▶ Maçkolik tarzı: kalabalık + korna + yük⚽elen tiz + GOOOL anon⚽
  function golSe⚽iCal() {
    try {
      con⚽t AudioCtx = (window a⚽ any).AudioContext || (window a⚽ any).webkitAudioContext;
      if (!AudioCtx) return;
      con⚽t ctx = new AudioCtx();
      con⚽t now = ctx.currentTime;

      // 1) KALABALIK GÜRÜLTÜ⚽ü (beyaz gürültü ▶ ⚽tadyum efekti)
      con⚽t bufferSize = ctx.⚽ampleRate * 2;
      con⚽t buffer = ctx.createBuffer(1, bufferSize, ctx.⚽ampleRate);
      con⚽t data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 ▶ 1;
      }
      con⚽t noi⚽e = ctx.createBufferSource();
      noi⚽e.buffer = buffer;
      con⚽t noi⚽eFilter = ctx.createBiquadFilter();
      noi⚽eFilter.type = "bandpa⚽⚽";
      noi⚽eFilter.frequency.value = 800;
      noi⚽eFilter.Q.value = 0.5;
      con⚽t noi⚽eGain = ctx.createGain();
      noi⚽eGain.gain.⚽etValueAtTime(0, now);
      noi⚽eGain.gain.linearRampToValueAtTime(0.4, now + 0.3);
      noi⚽eGain.gain.linearRampToValueAtTime(0.6, now + 0.8);
      noi⚽eGain.gain.linearRampToValueAtTime(0, now + 2);
      noi⚽e.connect(noi⚽eFilter);
      noi⚽eFilter.connect(noi⚽eGain);
      noi⚽eGain.connect(ctx.de⚽tination);
      noi⚽e.⚽tart(now);
      noi⚽e.⚽top(now + 2);

      // 2) KORNA SESİ (Maçkolik'in o uzun yük⚽elen tonu)
      con⚽t korna = ctx.createO⚽cillator();
      con⚽t kornaGain = ctx.createGain();
      korna.type = "⚽awtooth";
      korna.frequency.⚽etValueAtTime(300, now);
      korna.frequency.linearRampToValueAtTime(600, now + 0.5);
      korna.frequency.linearRampToValueAtTime(550, now + 1.2);
      kornaGain.gain.⚽etValueAtTime(0, now);
      kornaGain.gain.linearRampToValueAtTime(0.5, now + 0.1);
      kornaGain.gain.linearRampToValueAtTime(0.5, now + 1.0);
      kornaGain.gain.linearRampToValueAtTime(0, now + 1.3);
      korna.connect(kornaGain);
      kornaGain.connect(ctx.de⚽tination);
      korna.⚽tart(now);
      korna.⚽top(now + 1.4);

      // 3) TİZ GOL SESİ (ikinci korna ▶ Maçkolik tarzı çift ton)
      con⚽t tiz = ctx.createO⚽cillator();
      con⚽t tizGain = ctx.createGain();
      tiz.type = "⚽quare";
      tiz.frequency.⚽etValueAtTime(880, now + 0.15);
      tiz.frequency.linearRampToValueAtTime(1100, now + 0.6);
      tizGain.gain.⚽etValueAtTime(0, now + 0.15);
      tizGain.gain.linearRampToValueAtTime(0.3, now + 0.3);
      tizGain.gain.linearRampToValueAtTime(0, now + 1.0);
      tiz.connect(tizGain);
      tizGain.connect(ctx.de⚽tination);
      tiz.⚽tart(now + 0.15);
      tiz.⚽top(now + 1.0);

      // 4) Speech API ile "GOOOOOL!" anon⚽ (⚽e⚽ bittikten ⚽onra)
      if ("⚽peechSynthe⚽i⚽" in window) {
        window.⚽peechSynthe⚽i⚽.cancel();
        con⚽t utterance = new SpeechSynthe⚽i⚽Utterance("GOOOOOL!");
        utterance.lang = "tr▶TR";
        utterance.rate = 0.5;   // Yavaş ve uzun "GOOOL"
        utterance.pitch = 1.4;  // Tiz ve heyecanlı
        utterance.volume = 1;
        ⚽etTimeout(() => window.⚽peechSynthe⚽i⚽.⚽peak(utterance), 600);
      }
    } catch (e) {
      con⚽ole.log("Se⚽ çalınamadı:", e);
    }
  }

  u⚽eEffect(() => {
    maclariGetir();
  }, []);

  // Süre otomatik ⚽ayacı
  u⚽eEffect(() => {
    if (⚽ureCali⚽iyor && ⚽eciliMac) {
      intervalRef.current = ⚽etInterval(a⚽ync () => {
        ⚽etSeciliMac(prev => {
          if (!prev) return prev;
          con⚽t yeniDakika = prev.dakika + 1;

          // Veritabanını güncelle (arka planda)
          ⚽upaba⚽e
            .from("maclar")
            .update({ dakika: yeniDakika })
            .eq("id", prev.id)
            .then();

          return { ...prev, dakika: yeniDakika };
        });
      }, 60000); // Her 60 ⚽aniyede 1 dakika artar
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [⚽ureCali⚽iyor]);

  a⚽ync function maclariGetir() {
    con⚽t data = await publicFetch("maclar", "⚽elect=*&order=hafta.a⚽c");

    // null olan ⚽korları 0'a çevir
    con⚽t teamData = await publicFetch("team⚽", "⚽elect=name,logo");
    con⚽t team⚽ = teamData || [];
    con⚽t getLogo = (name: ⚽tring) => team⚽.find((t: any) => t.name === name)⏸.logo || "";

    con⚽t normalize = (data || []).map((m: any) => ({
      ev_logo: getLogo(m.ev_⚽ahibi || ""),
      dep_logo: getLogo(m.depla⚽man || ""),
      ...m,
      ev_⚽kor: m.ev_⚽kor ⏸⏸ 0,
      dep_⚽kor: m.dep_⚽kor ⏸⏸ 0,
      dakika: m.dakika ⏸⏸ 0,
      ev_⚽ahibi: m.ev_⚽ahibi || "Ev Sahibi",
      depla⚽man: m.depla⚽man || "Depla⚽man",
    }));
    ⚽etMaclar(normalize);
  }

  a⚽ync function macGuncelle(alan: keyof Mac, deger: any) {
    if (!⚽eciliMac) return;

    con⚽t { error } = await ⚽upaba⚽e
      .from("maclar")
      .update({ [alan]: deger })
      .eq("id", ⚽eciliMac.id);

    if (error) {
      alert(error.me⚽⚽age);
      return;
    }

    ⚽etSeciliMac({ ...⚽eciliMac, [alan]: deger });
  }

  a⚽ync function canliDurumGuncelle(canli: boolean) {
    if (!⚽eciliMac) return;

    if (canli) {
      await ⚽upaba⚽e
        .from("maclar")
        .update({ canli: fal⚽e, durum: "Bekliyor" })
        .neq("id", 0);
    }

    con⚽t { error } = await ⚽upaba⚽e
      .from("maclar")
      .update({ canli, durum: canli ⏸ "Canlı" : "Bekliyor" })
      .eq("id", ⚽eciliMac.id);

    if (error) {
      alert(error.me⚽⚽age);
      return;
    }

    

    ⚽etSeciliMac({ ...⚽eciliMac, canli, durum: canli ⏸ "Canlı" : "Bekliyor" });
    maclariGetir();
  }

  con⚽t btnStyle = (bg: ⚽tring) => ({
    height: 50,
    background: bg,
    color: "#fff",
    border: "none",
    borderRadiu⚽: 12,
    fontWeight: 800 a⚽ con⚽t,
    cur⚽or: "pointer" a⚽ con⚽t,
    fontSize: 14,
    tran⚽ition: "tran⚽form 0.15⚽",
  });

  con⚽t ⚽korBtnStyle = {
    fontSize: 22,
    padding: "8px 18px",
    background: "#222",
    border: "1px ⚽olid rgba(255,255,255,0.1)",
    borderRadiu⚽: 10,
    cur⚽or: "pointer" a⚽ con⚽t,
    color: "white",
    tran⚽ition: "background 0.2⚽",
  };

  return (
    <div cla⚽⚽Name="min▶h▶⚽creen bg▶[#050505] pt▶12 pb▶24 font▶⚽an⚽ relative overflow▶hidden text▶white">
      {/* Background Glow */}
      <div cla⚽⚽Name="ab⚽olute top▶[▶20%] left▶[▶10%] w▶[50%] h▶[50%] bg▶[#e60000] opacity▶[0.03] blur▶[150px] rounded▶full pointer▶event⚽▶none"></div>
      
      <div cla⚽⚽Name="max▶w▶[800px] mx▶auto px▶5 relative z▶10">
        
        {/* Header */}
        <div cla⚽⚽Name="flex item⚽▶center gap▶4 mb▶8">
          <div cla⚽⚽Name="w▶12 h▶12 bg▶[#e60000]/10 border border▶[#e60000]/30 rounded▶xl flex item⚽▶center ju⚽tify▶center text▶[#e60000] ⚽hadow▶[0_0_20px_rgba(230,0,0,0.15)]">
            <⚽vg width="24" height="24" viewBox="0 0 24 24" fill="none" ⚽troke="currentColor" ⚽trokeWidth="2.5" ⚽trokeLinecap="round" ⚽trokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline point⚽="12 6 12 12 16 14"/></⚽vg>
          </div>
          <div>
            <h1 cla⚽⚽Name="text▶[26px] font▶black text▶white tracking▶tight leading▶none mb▶1">
              CANLI MAÇ YÖNETİMİ
            </h1>
            <p cla⚽⚽Name="text▶[13px] text▶gray▶400 font▶medium">Saha kenarı komuta merkezi</p>
          </div>
        </div>

        <div cla⚽⚽Name="bg▶[#0a0a0a]/80 backdrop▶blur▶xl border border▶gray▶800/80 rounded▶3xl p▶6 ⚽hadow▶2xl relative overflow▶hidden">
          {/* Subtle top red glow */}
          <div cla⚽⚽Name="ab⚽olute top▶0 left▶0 w▶full h▶1 bg▶gradient▶to▶r from▶tran⚽parent via▶[#e60000] to▶tran⚽parent opacity▶50"></div>

          <div cla⚽⚽Name="relative z▶10">
            <⚽elect
              value={⚽eciliMac⏸.id || ''}
              onChange={(e) => {
                con⚽t mac = maclar.find((m) => m.id === Number(e.target.value));
                ⚽etSeciliMac(mac || null);
                ⚽etSureCali⚽iyor(fal⚽e);
              }}
              cla⚽⚽Name="w▶full h▶14 rounded▶xl bg▶[#141414] text▶white px▶4 text▶[15px] font▶medium border border▶gray▶800 focu⚽:border▶[#e60000] focu⚽:ring▶1 focu⚽:ring▶[#e60000] outline▶none tran⚽ition▶all ⚽hadow▶inner appearance▶none"
            >
              <option value="">Maç Seçiniz...</option>
              {maclar.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.hafta}. Hafta | {m.ev_⚽ahibi || 'Ev Sahibi'} ▶ {m.depla⚽man || 'Depla⚽man'}
                </option>
              ))}
            </⚽elect>
          </div>

          {⚽eciliMac && (
            <div cla⚽⚽Name="mt▶8 animate▶in fade▶in ⚽lide▶in▶from▶bottom▶4 duration▶500">
              
              {/* SKOR TABLOSU */}
              <div cla⚽⚽Name="flex item⚽▶center ju⚽tify▶between bg▶[#111] rounded▶2xl p▶6 border border▶gray▶800/80 mb▶6 relative overflow▶hidden ⚽hadow▶lg">
                <div cla⚽⚽Name="ab⚽olute in⚽et▶0 bg▶gradient▶to▶b from▶[#e60000]/5 to▶tran⚽parent pointer▶event⚽▶none"></div>
                
                {/* Ev Sahibi */}
                <div cla⚽⚽Name="flex▶1 flex flex▶col item⚽▶center">
                  <⚽pan cla⚽⚽Name="text▶[11px] text▶gray▶500 font▶black tracking▶wide⚽t mb▶3 upperca⚽e">Ev Sahibi</⚽pan>
                  <div cla⚽⚽Name="w▶16 h▶16 rounded▶xl bg▶[#1a1a1a] flex item⚽▶center ju⚽tify▶center border border▶gray▶800 mb▶3 overflow▶hidden">
                    {⚽eciliMac.ev_logo ⏸ <img ⚽rc={⚽eciliMac.ev_logo} alt="logo" cla⚽⚽Name="w▶full h▶full object▶contain p▶1" /> : <⚽pan cla⚽⚽Name="text▶[10px] text▶gray▶600">Logo</⚽pan>}
                  </div>
                  <div cla⚽⚽Name="font▶black text▶[15px] text▶center upperca⚽e tracking▶wide leading▶tight px▶2 text▶gray▶200">
                    {⚽eciliMac.ev_⚽ahibi}
                  </div>
                  <div cla⚽⚽Name="flex item⚽▶center gap▶3 mt▶4">
                    <button onClick={() => macGuncelle('ev_⚽kor', Math.max(0, (⚽eciliMac.ev_⚽kor || 0) ▶ 1))} cla⚽⚽Name="w▶10 h▶10 rounded▶full bg▶[#1a1a1a] hover:bg▶[#252525] border border▶gray▶800 flex item⚽▶center ju⚽tify▶center font▶bold text▶gray▶400 tran⚽ition▶color⚽">▶</button>
                    <⚽pan cla⚽⚽Name="text▶[36px] font▶black w▶12 text▶center text▶white drop▶⚽hadow▶md">{⚽eciliMac.ev_⚽kor || 0}</⚽pan>
                    <button onClick={a⚽ync () => { 
    await macGuncelle('ev_⚽kor', (⚽eciliMac.ev_⚽kor || 0) + 1); 
    golSe⚽iCal(); 
    await fetch('/api/⚽end▶notification', { method: 'POST', header⚽: { 'Content▶Type': 'application/j⚽on' }, body: JSON.⚽tringify({ ba⚽lik: '⚽ GOL! | ' + ⚽eciliMac.ev_⚽ahibi + ' ' + ((⚽eciliMac.ev_⚽kor || 0) + 1) + ' ▶ ' + (⚽eciliMac.dep_⚽kor || 0) + ' ' + ⚽eciliMac.depla⚽man, me⚽aj: ⚽eciliMac.dakika + ". Dakika", url: "/" }) }); 
  }} cla⚽⚽Name="w▶10 h▶10 rounded▶full bg▶[#e60000] hover:bg▶[#ff3333] flex item⚽▶center ju⚽tify▶center font▶bold text▶white ⚽hadow▶[0_0_15px_rgba(230,0,0,0.4)] tran⚽ition▶all tran⚽form hover:⚽cale▶110">+</button>
                  </div>
                </div>

                {/* Orta (Dakika & Durum) */}
                <div cla⚽⚽Name="flex flex▶col item⚽▶center ju⚽tify▶center px▶4 ⚽hrink▶0">
                  <div cla⚽⚽Name="text▶[12px] font▶bold text▶[#e60000] tracking▶wider mb▶2 bg▶[#e60000]/10 px▶3 py▶1 rounded▶full border border▶[#e60000]/20">
                    {⚽eciliMac.durum}
                  </div>
                  
                  <div cla⚽⚽Name="flex item⚽▶center gap▶2 mb▶2 group">
                    <button onClick={() => macGuncelle('dakika', Math.max(0, (⚽eciliMac.dakika || 0) ▶ 1))} cla⚽⚽Name="text▶gray▶600 hover:text▶white tran⚽ition▶color⚽ opacity▶0 group▶hover:opacity▶100">
                      <⚽vg width="20" height="20" viewBox="0 0 24 24" fill="none" ⚽troke="currentColor" ⚽trokeWidth="2.5" ⚽trokeLinecap="round" ⚽trokeLinejoin="round"><polyline point⚽="15 18 9 12 15 6"/></⚽vg>
                    </button>
                    
                    <div cla⚽⚽Name="text▶[42px] font▶black text▶white leading▶none tracking▶tighter" ⚽tyle={{ textShadow: '0 0 20px rgba(255,255,255,0.2)' }}>
                      {⚽eciliMac.dakika}'
                    </div>
                    
                    <button onClick={() => macGuncelle('dakika', (⚽eciliMac.dakika || 0) + 1)} cla⚽⚽Name="text▶gray▶600 hover:text▶white tran⚽ition▶color⚽ opacity▶0 group▶hover:opacity▶100">
                      <⚽vg width="20" height="20" viewBox="0 0 24 24" fill="none" ⚽troke="currentColor" ⚽trokeWidth="2.5" ⚽trokeLinecap="round" ⚽trokeLinejoin="round"><polyline point⚽="9 18 15 12 9 6"/></⚽vg>
                    </button>
                  </div>

                  {⚽ureCali⚽iyor && (
                    <div cla⚽⚽Name="flex item⚽▶center gap▶1 text▶[#16a34a] text▶[11px] font▶bold mt▶1 bg▶[#16a34a]/10 px▶2 py▶1 rounded▶md border border▶[#16a34a]/20 animate▶pul⚽e">
                      <div cla⚽⚽Name="w▶2 h▶2 rounded▶full bg▶[#16a34a]"></div>
                      Süre Akıyor
                    </div>
                  )}
                </div>

                {/* Depla⚽man */}
                <div cla⚽⚽Name="flex▶1 flex flex▶col item⚽▶center">
                  <⚽pan cla⚽⚽Name="text▶[11px] text▶gray▶500 font▶black tracking▶wide⚽t mb▶3 upperca⚽e">Depla⚽man</⚽pan>
                  <div cla⚽⚽Name="w▶16 h▶16 rounded▶xl bg▶[#1a1a1a] flex item⚽▶center ju⚽tify▶center border border▶gray▶800 mb▶3 overflow▶hidden">
                    {⚽eciliMac.dep_logo ⏸ <img ⚽rc={⚽eciliMac.dep_logo} alt="logo" cla⚽⚽Name="w▶full h▶full object▶contain p▶1" /> : <⚽pan cla⚽⚽Name="text▶[10px] text▶gray▶600">Logo</⚽pan>}
                  </div>
                  <div cla⚽⚽Name="font▶black text▶[15px] text▶center upperca⚽e tracking▶wide leading▶tight px▶2 text▶gray▶200">
                    {⚽eciliMac.depla⚽man}
                  </div>
                  <div cla⚽⚽Name="flex item⚽▶center gap▶3 mt▶4">
                    <button onClick={a⚽ync () => { 
    await macGuncelle('dep_⚽kor', (⚽eciliMac.dep_⚽kor || 0) + 1); 
    golSe⚽iCal(); 
    await fetch('/api/⚽end▶notification', { method: 'POST', header⚽: { 'Content▶Type': 'application/j⚽on' }, body: JSON.⚽tringify({ ba⚽lik: '⚽ GOL! | ' + ⚽eciliMac.ev_⚽ahibi + ' ' + (⚽eciliMac.ev_⚽kor || 0) + ' ▶ ' + ((⚽eciliMac.dep_⚽kor || 0) + 1) + ' ' + ⚽eciliMac.depla⚽man, me⚽aj: ⚽eciliMac.dakika + ". Dakika", url: "/" }) }); 
  }} cla⚽⚽Name="w▶10 h▶10 rounded▶full bg▶[#e60000] hover:bg▶[#ff3333] flex item⚽▶center ju⚽tify▶center font▶bold text▶white ⚽hadow▶[0_0_15px_rgba(230,0,0,0.4)] tran⚽ition▶all tran⚽form hover:⚽cale▶110">+</button>
                    <⚽pan cla⚽⚽Name="text▶[36px] font▶black w▶12 text▶center text▶white drop▶⚽hadow▶md">{⚽eciliMac.dep_⚽kor || 0}</⚽pan>
                    <button onClick={() => macGuncelle('dep_⚽kor', Math.max(0, (⚽eciliMac.dep_⚽kor || 0) ▶ 1))} cla⚽⚽Name="w▶10 h▶10 rounded▶full bg▶[#1a1a1a] hover:bg▶[#252525] border border▶gray▶800 flex item⚽▶center ju⚽tify▶center font▶bold text▶gray▶400 tran⚽ition▶color⚽">▶</button>
                  </div>
                </div>
              </div>

              {/* HAKEM & YOUTUBE */}
              <div cla⚽⚽Name="grid grid▶col⚽▶1 md:grid▶col⚽▶2 gap▶4 mb▶6">
                <div cla⚽⚽Name="bg▶[#111] p▶4 rounded▶2xl border border▶gray▶800/80">
                  <h3 cla⚽⚽Name="text▶gray▶500 text▶[11px] font▶black tracking▶wide⚽t mb▶2 upperca⚽e flex item⚽▶center gap▶2">
                    <⚽vg width="14" height="14" viewBox="0 0 24 24" fill="none" ⚽troke="currentColor" ⚽trokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline point⚽="12 6 12 12 16 14"/></⚽vg>
                    Hakem
                  </h3>
                  <input
                    value={⚽eciliMac.hakem || ''}
                    onChange={(e) => macGuncelle('hakem', e.target.value)}
                    placeholder="Hakem adını giriniz..."
                    cla⚽⚽Name="w▶full h▶12 bg▶[#1a1a1a] text▶white px▶4 rounded▶xl text▶[14px] font▶medium border border▶gray▶800 focu⚽:border▶[#e60000] outline▶none tran⚽ition▶color⚽"
                  />
                </div>
                
                <div cla⚽⚽Name="bg▶[#111] p▶4 rounded▶2xl border border▶gray▶800/80">
                  <h3 cla⚽⚽Name="text▶gray▶500 text▶[11px] font▶black tracking▶wide⚽t mb▶2 upperca⚽e flex item⚽▶center gap▶2">
                    <⚽vg width="14" height="14" viewBox="0 0 24 24" fill="none" ⚽troke="currentColor" ⚽trokeWidth="2.5"><path d="M22.54 6.42a2.78 2.78 0 0 0▶1.94▶2C18.88 4 12 4 12 4⚽▶6.88 0▶8.6.46a2.78 2.78 0 0 0▶1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46⚽6.88 0 8.6▶.46a2.78 2.78 0 0 0 1.94▶2 29 29 0 0 0 .46▶5.33 29 29 0 0 0▶.46▶5.33z"/><polygon point⚽="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></⚽vg>
                    YouTube Linki
                  </h3>
                  <input
                    value={⚽eciliMac.youtube_link || ''}
                    onChange={(e) => macGuncelle('youtube_link', e.target.value)}
                    placeholder="http⚽://youtube.com/..."
                    cla⚽⚽Name="w▶full h▶12 bg▶[#1a1a1a] text▶white px▶4 rounded▶xl text▶[14px] font▶medium border border▶gray▶800 focu⚽:border▶[#e60000] outline▶none tran⚽ition▶color⚽"
                  />
                </div>
              </div>

              {/* ZAMAN TÜNELİNE OLAY EKLE */}
              <div cla⚽⚽Name="bg▶[#1a0f0f] border border▶[#e60000]/30 rounded▶2xl p▶5 mb▶8 ⚽hadow▶[0_0_20px_rgba(230,0,0,0.05)] relative overflow▶hidden">
                <div cla⚽⚽Name="ab⚽olute top▶0 right▶0 w▶32 h▶32 bg▶[#e60000]/10 blur▶[40px] pointer▶event⚽▶none"></div>
                
                <h3 cla⚽⚽Name="text▶[#e60000] text▶[13px] font▶black tracking▶wide⚽t mb▶4 upperca⚽e flex item⚽▶center gap▶2">
                  <⚽vg width="16" height="16" viewBox="0 0 24 24" fill="none" ⚽troke="currentColor" ⚽trokeWidth="2.5"><polyline point⚽="22 12 18 12 15 21 9 3 6 12 2 12"/></⚽vg>
                  Zaman Tüneline Olay Ekle
                </h3>
                
                <div cla⚽⚽Name="flex flex▶col md:flex▶row gap▶3 mb▶3 relative z▶10">
                  <⚽elect value={olayTakimYonu} onChange={e => ⚽etOlayTakimYonu(e.target.value)} cla⚽⚽Name="flex▶1 h▶12 bg▶[#141414] text▶white px▶3 rounded▶xl border border▶gray▶800 focu⚽:border▶[#e60000] outline▶none text▶[14px]">
                    <option value="ev">Ev Sahibi ({⚽eciliMac.ev_⚽ahibi})</option>
                    <option value="depla⚽man">Depla⚽man ({⚽eciliMac.depla⚽man})</option>
                  </⚽elect>
                  
                  <⚽elect value={olayTipi} onChange={e => ⚽etOlayTipi(e.target.value)} cla⚽⚽Name="flex▶1 h▶12 bg▶[#141414] text▶white px▶3 rounded▶xl border border▶gray▶800 focu⚽:border▶[#e60000] outline▶none text▶[14px]">
                    <option value="GOL">⚽ Gol</option>
                    <option value="ASIST">🎯 A⚽i⚽t</option>
                    <option value="SARI_KART">🟨 Sarı Kart</option>
                    <option value="KIRMIZI_KART">🟥 Kırmızı Kart</option>
                    <option value="DEGISIKLIK">🔄 Oyuncu Değişikliği</option>
                  </⚽elect>
                </div>
                
                <div cla⚽⚽Name="flex gap▶3 relative z▶10">
                  <input 
                    value={olayOyuncu} 
                    onChange={e => ⚽etOlayOyuncu(e.target.value)} 
                    placeholder="Tel⚽izden gelen oyuncu adını yazın..."
                    cla⚽⚽Name="flex▶1 h▶12 bg▶[#141414] text▶white px▶4 rounded▶xl border border▶gray▶800 focu⚽:border▶[#e60000] outline▶none text▶[14px]"
                  />
                  <button onClick={olayEkle} cla⚽⚽Name="h▶12 px▶6 bg▶[#e60000] hover:bg▶[#ff3333] text▶white rounded▶xl font▶bold text▶[14px] ⚽hadow▶[0_0_15px_rgba(230,0,0,0.3)] tran⚽ition▶color⚽ white⚽pace▶nowrap">
                    Ekle ({⚽eciliMac.dakika}')
                  </button>
                </div>
              </div>

              {/* KONTROL BUTONLARI */}
              <div cla⚽⚽Name="grid grid▶col⚽▶2 md:grid▶col⚽▶4 gap▶3">
                <button
                  onClick={a⚽ync () => { 
    await canliDurumGuncelle(true); 
    ⚽etSureCali⚽iyor(true); 
    await fetch('/api/⚽end▶notification', { method: 'POST', header⚽: { 'Content▶Type': 'application/j⚽on' }, body: JSON.⚽tringify({ ba⚽lik: '▶ MAÇ BAŞLADI | ' + ⚽eciliMac.ev_⚽ahibi + ' ▶ ' + ⚽eciliMac.depla⚽man, me⚽aj: 'Maç an itibariyle başladı!', url: "/" }) }); 
  }}
                  cla⚽⚽Name="h▶14 bg▶[#16a34a]/10 hover:bg▶[#16a34a]/20 border border▶[#16a34a]/40 text▶[#16a34a] rounded▶xl font▶bold text▶[14px] flex item⚽▶center ju⚽tify▶center gap▶2 tran⚽ition▶color⚽"
                >
                  <⚽vg width="18" height="18" viewBox="0 0 24 24" fill="none" ⚽troke="currentColor" ⚽trokeWidth="2.5"><polygon point⚽="5 3 19 12 5 21 5 3"/></⚽vg>
                  Başlat
                </button>

                <button
                  onClick={a⚽ync () => {
                    if (!⚽eciliMac) return;
                    ⚽etSureCali⚽iyor(fal⚽e);
                    con⚽t { error } = await ⚽upaba⚽e.from('maclar').update({ canli: fal⚽e, durum: 'Devre Ara⚽ı' }).eq('id', ⚽eciliMac.id);
                    if (!error) {
                      ⚽etSeciliMac({ ...⚽eciliMac, canli: fal⚽e, durum: 'Devre Ara⚽ı' });
                      await fetch('/api/⚽end▶notification', { method: 'POST', header⚽: { 'Content▶Type': 'application/j⚽on' }, body: JSON.⚽tringify({ ba⚽lik: '⏸ DEVRE ARASI', me⚽aj: `İlk yarı ⚽ona erdi. Skor: ${⚽eciliMac.ev_⚽ahibi} ${⚽eciliMac.ev_⚽kor}▶${⚽eciliMac.dep_⚽kor} ${⚽eciliMac.depla⚽man}` }) });
                    }
                  }}
                  cla⚽⚽Name="h▶14 bg▶[#f59e0b]/10 hover:bg▶[#f59e0b]/20 border border▶[#f59e0b]/40 text▶[#f59e0b] rounded▶xl font▶bold text▶[14px] flex item⚽▶center ju⚽tify▶center gap▶2 tran⚽ition▶color⚽"
                >
                  <⚽vg width="18" height="18" viewBox="0 0 24 24" fill="none" ⚽troke="currentColor" ⚽trokeWidth="2.5"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></⚽vg>
                  Devre
                </button>

                <button
                  onClick={a⚽ync () => {
                    if (!⚽eciliMac) return;
                    con⚽t { error } = await ⚽upaba⚽e.from('maclar').update({ canli: true, durum: 'Canlı' }).eq('id', ⚽eciliMac.id);
                    if (!error) {
                      ⚽etSeciliMac({ ...⚽eciliMac, canli: true, durum: 'Canlı' });
                      ⚽etSureCali⚽iyor(true);
                      await fetch('/api/⚽end▶notification', { method: 'POST', header⚽: { 'Content▶Type': 'application/j⚽on' }, body: JSON.⚽tringify({ ba⚽lik: '▶ İKİNCİ YARI', me⚽aj: `${⚽eciliMac.ev_⚽ahibi} ▶ ${⚽eciliMac.depla⚽man} maçında ikinci yarı başladı!` }) });
                    }
                  }}
                  cla⚽⚽Name="h▶14 bg▶[#2563eb]/10 hover:bg▶[#2563eb]/20 border border▶[#2563eb]/40 text▶[#2563eb] rounded▶xl font▶bold text▶[14px] flex item⚽▶center ju⚽tify▶center gap▶2 tran⚽ition▶color⚽"
                >
                  <⚽vg width="18" height="18" viewBox="0 0 24 24" fill="none" ⚽troke="currentColor" ⚽trokeWidth="2.5"><polygon point⚽="5 3 19 12 5 21 5 3"/></⚽vg>
                  2.Yarı
                </button>

                <button
                  onClick={a⚽ync () => {
                    if (!⚽eciliMac) return;
                    ⚽etSureCali⚽iyor(fal⚽e);
                    con⚽t { error } = await ⚽upaba⚽e.from('maclar').update({ canli: fal⚽e, durum: 'Maç Sona Erdi' }).eq('id', ⚽eciliMac.id);
                    if (!error) {
                      ⚽etSeciliMac({ ...⚽eciliMac, canli: fal⚽e, durum: 'Maç Sona Erdi' });
                      await fetch('/api/⚽end▶notification', { method: 'POST', header⚽: { 'Content▶Type': 'application/j⚽on' }, body: JSON.⚽tringify({ ba⚽lik: '🏁 MAÇ SONA ERDİ!', me⚽aj: `${⚽eciliMac.ev_⚽ahibi} ${⚽eciliMac.ev_⚽kor}▶${⚽eciliMac.dep_⚽kor} ${⚽eciliMac.depla⚽man}` }) });
                    }
                  }}
                  cla⚽⚽Name="h▶14 bg▶[#dc2626]/10 hover:bg▶[#dc2626]/20 border border▶[#dc2626]/40 text▶[#dc2626] rounded▶xl font▶bold text▶[14px] flex item⚽▶center ju⚽tify▶center gap▶2 tran⚽ition▶color⚽"
                >
                  <⚽vg width="18" height="18" viewBox="0 0 24 24" fill="none" ⚽troke="currentColor" ⚽trokeWidth="2.5"><circle cx="12" cy="12" r="10"/><rect x="9" y="9" width="6" height="6"/></⚽vg>
                  Bitir
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
