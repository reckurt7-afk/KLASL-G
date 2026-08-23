"use client";

import { useEffect, useState, useRef } from "react";
import { supabase, publicFetch } from "@/lib/supabase";

type Mac = {
  id: number;
  hafta: number;
  ev_sahibi: string;
  deplasman: string;
  ev_skor: number;
  dep_skor: number;
  dakika: number;
  durum: string;
  canli: boolean;
  hakem: string;
  youtube_link: string;
};

export default function CanliMacPage() {
  const [maclar, setMaclar] = useState<Mac[]>([]);
  const [seciliMac, setSeciliMac] = useState<Mac | null>(null);
  const [sureCalisiyor, setSureCalisiyor] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Olay Ekleme State'leri
  const [olayTipi, setOlayTipi] = useState("GOL");
  const [olayOyuncu, setOlayOyuncu] = useState("");
  const [olayTakimYonu, setOlayTakimYonu] = useState("ev");

  // Olay Ekleme Fonksiyonu
  async function olayEkle() {
    if (!seciliMac || !olayOyuncu) return;
    const { error } = await supabase.from("mac_olaylari").insert({
      mac_id: seciliMac.id,
      dakika: seciliMac.dakika,
      tip: olayTipi,
      oyuncu: olayOyuncu,
      takim_yonu: olayTakimYonu
    });
    if (error) {
      alert("Olay eklenemedi: " + error.message);
    } else {
      alert("Olay başarıyla eklendi!");
      setOlayOyuncu("");
    }
  }

  // 🔊 GOL SESİ - Maçkolik tarzı: kalabalık + korna + yükselen tiz + GOOOL anons
  function golSesiCal() {
    try {
      const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      // 1) KALABALIK GÜRÜLTÜsü (beyaz gürültü - stadyum efekti)
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = "bandpass";
      noiseFilter.frequency.value = 800;
      noiseFilter.Q.value = 0.5;
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0, now);
      noiseGain.gain.linearRampToValueAtTime(0.4, now + 0.3);
      noiseGain.gain.linearRampToValueAtTime(0.6, now + 0.8);
      noiseGain.gain.linearRampToValueAtTime(0, now + 2);
      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start(now);
      noise.stop(now + 2);

      // 2) KORNA SESİ (Maçkolik'in o uzun yükselen tonu)
      const korna = ctx.createOscillator();
      const kornaGain = ctx.createGain();
      korna.type = "sawtooth";
      korna.frequency.setValueAtTime(300, now);
      korna.frequency.linearRampToValueAtTime(600, now + 0.5);
      korna.frequency.linearRampToValueAtTime(550, now + 1.2);
      kornaGain.gain.setValueAtTime(0, now);
      kornaGain.gain.linearRampToValueAtTime(0.5, now + 0.1);
      kornaGain.gain.linearRampToValueAtTime(0.5, now + 1.0);
      kornaGain.gain.linearRampToValueAtTime(0, now + 1.3);
      korna.connect(kornaGain);
      kornaGain.connect(ctx.destination);
      korna.start(now);
      korna.stop(now + 1.4);

      // 3) TİZ GOL SESİ (ikinci korna - Maçkolik tarzı çift ton)
      const tiz = ctx.createOscillator();
      const tizGain = ctx.createGain();
      tiz.type = "square";
      tiz.frequency.setValueAtTime(880, now + 0.15);
      tiz.frequency.linearRampToValueAtTime(1100, now + 0.6);
      tizGain.gain.setValueAtTime(0, now + 0.15);
      tizGain.gain.linearRampToValueAtTime(0.3, now + 0.3);
      tizGain.gain.linearRampToValueAtTime(0, now + 1.0);
      tiz.connect(tizGain);
      tizGain.connect(ctx.destination);
      tiz.start(now + 0.15);
      tiz.stop(now + 1.0);

      // 4) Speech API ile "GOOOOOL!" anons (ses bittikten sonra)
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance("GOOOOOL!");
        utterance.lang = "tr-TR";
        utterance.rate = 0.5;   // Yavaş ve uzun "GOOOL"
        utterance.pitch = 1.4;  // Tiz ve heyecanlı
        utterance.volume = 1;
        setTimeout(() => window.speechSynthesis.speak(utterance), 600);
      }
    } catch (e) {
      console.log("Ses çalınamadı:", e);
    }
  }

  useEffect(() => {
    maclariGetir();
  }, []);

  // Süre otomatik sayacı
  useEffect(() => {
    if (sureCalisiyor && seciliMac) {
      intervalRef.current = setInterval(async () => {
        setSeciliMac(prev => {
          if (!prev) return prev;
          const yeniDakika = prev.dakika + 1;

          // Veritabanını güncelle (arka planda)
          supabase
            .from("maclar")
            .update({ dakika: yeniDakika })
            .eq("id", prev.id)
            .then();

          return { ...prev, dakika: yeniDakika };
        });
      }, 60000); // Her 60 saniyede 1 dakika artar
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [sureCalisiyor]);

  async function maclariGetir() {
    const data = await publicFetch("maclar", "select=*&order=hafta.asc");
    // null olan skorları 0'a çevir
    const normalize = (data || []).map((m: any) => ({
      ...m,
      ev_skor: m.ev_skor ?? 0,
      dep_skor: m.dep_skor ?? 0,
      dakika: m.dakika ?? 0,
      ev_sahibi: m.ev_sahibi || "Ev Sahibi",
      deplasman: m.deplasman || "Deplasman",
    }));
    setMaclar(normalize);
  }

  async function macGuncelle(alan: keyof Mac, deger: any) {
    if (!seciliMac) return;

    const { error } = await supabase
      .from("maclar")
      .update({ [alan]: deger })
      .eq("id", seciliMac.id);

    if (error) {
      alert(error.message);
      return;
    }

    setSeciliMac({ ...seciliMac, [alan]: deger });
  }

  async function canliDurumGuncelle(canli: boolean) {
    if (!seciliMac) return;

    if (canli) {
      await supabase
        .from("maclar")
        .update({ canli: false, durum: "Bekliyor" })
        .neq("id", 0);
    }

    const { error } = await supabase
      .from("maclar")
      .update({ canli, durum: canli ? "Canlı" : "Bekliyor" })
      .eq("id", seciliMac.id);

    if (error) {
      alert(error.message);
      return;
    }

    if (canli) {
      await fetch("/api/send-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          baslik: "▶️ MAÇ BAŞLADI!",
          mesaj: `${seciliMac.ev_sahibi} ile ${seciliMac.deplasman} arasındaki zorlu mücadele başladı!`,
        }),
      });
    }

    setSeciliMac({ ...seciliMac, canli, durum: canli ? "Canlı" : "Bekliyor" });
    maclariGetir();
  }

  const btnStyle = (bg: string) => ({
    height: 50,
    background: bg,
    color: "#fff",
    border: "none",
    borderRadius: 12,
    fontWeight: 800 as const,
    cursor: "pointer" as const,
    fontSize: 14,
    transition: "transform 0.15s",
  });

  const skorBtnStyle = {
    fontSize: 22,
    padding: "8px 18px",
    background: "#222",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 10,
    cursor: "pointer" as const,
    color: "white",
    transition: "background 0.2s",
  };

  return (
    <div className="min-h-screen bg-[#050505] pt-12 pb-24 font-sans relative overflow-hidden text-white">
      {/* Background Glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#e60000] opacity-[0.03] blur-[150px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-[800px] mx-auto px-5 relative z-10">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-[#e60000]/10 border border-[#e60000]/30 rounded-xl flex items-center justify-center text-[#e60000] shadow-[0_0_20px_rgba(230,0,0,0.15)]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <div>
            <h1 className="text-[26px] font-black text-white tracking-tight leading-none mb-1">
              CANLI MAÇ YÖNETİMİ
            </h1>
            <p className="text-[13px] text-gray-400 font-medium">Saha kenarı komuta merkezi</p>
          </div>
        </div>

        <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-gray-800/80 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
          {/* Subtle top red glow */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#e60000] to-transparent opacity-50"></div>

          <div className="relative z-10">
            <select
              value={seciliMac?.id || ''}
              onChange={(e) => {
                const mac = maclar.find((m) => m.id === Number(e.target.value));
                setSeciliMac(mac || null);
                setSureCalisiyor(false);
              }}
              className="w-full h-14 rounded-xl bg-[#141414] text-white px-4 text-[15px] font-medium border border-gray-800 focus:border-[#e60000] focus:ring-1 focus:ring-[#e60000] outline-none transition-all shadow-inner appearance-none"
            >
              <option value="">Maç Seçiniz...</option>
              {maclar.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.hafta}. Hafta | {m.ev_sahibi || 'Ev Sahibi'} - {m.deplasman || 'Deplasman'}
                </option>
              ))}
            </select>
          </div>

          {seciliMac && (
            <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* SKOR TABLOSU */}
              <div className="flex items-center justify-between bg-[#111] rounded-2xl p-6 border border-gray-800/80 mb-6 relative overflow-hidden shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-b from-[#e60000]/5 to-transparent pointer-events-none"></div>
                
                {/* Ev Sahibi */}
                <div className="flex-1 flex flex-col items-center">
                  <span className="text-[11px] text-gray-500 font-black tracking-widest mb-3 uppercase">Ev Sahibi</span>
                  <div className="w-16 h-16 rounded-xl bg-[#1a1a1a] flex items-center justify-center border border-gray-800 mb-3 text-[10px] text-gray-600 text-center leading-tight overflow-hidden">
                    Logo
                  </div>
                  <div className="font-black text-[15px] text-center uppercase tracking-wide leading-tight px-2 text-gray-200">
                    {seciliMac.ev_sahibi}
                  </div>
                  <div className="flex items-center gap-3 mt-4">
                    <button onClick={() => macGuncelle('ev_skor', Math.max(0, (seciliMac.ev_skor || 0) - 1))} className="w-10 h-10 rounded-full bg-[#1a1a1a] hover:bg-[#252525] border border-gray-800 flex items-center justify-center font-bold text-gray-400 transition-colors">-</button>
                    <span className="text-[36px] font-black w-12 text-center text-white drop-shadow-md">{seciliMac.ev_skor || 0}</span>
                    <button onClick={() => { macGuncelle('ev_skor', (seciliMac.ev_skor || 0) + 1); golSesiCal(); }} className="w-10 h-10 rounded-full bg-[#e60000] hover:bg-[#ff3333] flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(230,0,0,0.4)] transition-all transform hover:scale-110">+</button>
                  </div>
                </div>

                {/* Orta (Dakika & Durum) */}
                <div className="flex flex-col items-center justify-center px-4 shrink-0">
                  <div className="text-[12px] font-bold text-[#e60000] tracking-wider mb-2 bg-[#e60000]/10 px-3 py-1 rounded-full border border-[#e60000]/20">
                    {seciliMac.durum}
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2 group">
                    <button onClick={() => macGuncelle('dakika', Math.max(0, (seciliMac.dakika || 0) - 1))} className="text-gray-600 hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                    </button>
                    
                    <div className="text-[42px] font-black text-white leading-none tracking-tighter" style={{ textShadow: '0 0 20px rgba(255,255,255,0.2)' }}>
                      {seciliMac.dakika}'
                    </div>
                    
                    <button onClick={() => macGuncelle('dakika', (seciliMac.dakika || 0) + 1)} className="text-gray-600 hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                    </button>
                  </div>

                  {sureCalisiyor && (
                    <div className="flex items-center gap-1 text-[#16a34a] text-[11px] font-bold mt-1 bg-[#16a34a]/10 px-2 py-1 rounded-md border border-[#16a34a]/20 animate-pulse">
                      <div className="w-2 h-2 rounded-full bg-[#16a34a]"></div>
                      Süre Akıyor
                    </div>
                  )}
                </div>

                {/* Deplasman */}
                <div className="flex-1 flex flex-col items-center">
                  <span className="text-[11px] text-gray-500 font-black tracking-widest mb-3 uppercase">Deplasman</span>
                  <div className="w-16 h-16 rounded-xl bg-[#1a1a1a] flex items-center justify-center border border-gray-800 mb-3 text-[10px] text-gray-600 text-center leading-tight overflow-hidden">
                    Logo
                  </div>
                  <div className="font-black text-[15px] text-center uppercase tracking-wide leading-tight px-2 text-gray-200">
                    {seciliMac.deplasman}
                  </div>
                  <div className="flex items-center gap-3 mt-4">
                    <button onClick={() => { macGuncelle('dep_skor', (seciliMac.dep_skor || 0) + 1); golSesiCal(); }} className="w-10 h-10 rounded-full bg-[#e60000] hover:bg-[#ff3333] flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(230,0,0,0.4)] transition-all transform hover:scale-110">+</button>
                    <span className="text-[36px] font-black w-12 text-center text-white drop-shadow-md">{seciliMac.dep_skor || 0}</span>
                    <button onClick={() => macGuncelle('dep_skor', Math.max(0, (seciliMac.dep_skor || 0) - 1))} className="w-10 h-10 rounded-full bg-[#1a1a1a] hover:bg-[#252525] border border-gray-800 flex items-center justify-center font-bold text-gray-400 transition-colors">-</button>
                  </div>
                </div>
              </div>

              {/* HAKEM & YOUTUBE */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-[#111] p-4 rounded-2xl border border-gray-800/80">
                  <h3 className="text-gray-500 text-[11px] font-black tracking-widest mb-2 uppercase flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    Hakem
                  </h3>
                  <input
                    value={seciliMac.hakem || ''}
                    onChange={(e) => macGuncelle('hakem', e.target.value)}
                    placeholder="Hakem adını giriniz..."
                    className="w-full h-12 bg-[#1a1a1a] text-white px-4 rounded-xl text-[14px] font-medium border border-gray-800 focus:border-[#e60000] outline-none transition-colors"
                  />
                </div>
                
                <div className="bg-[#111] p-4 rounded-2xl border border-gray-800/80">
                  <h3 className="text-gray-500 text-[11px] font-black tracking-widest mb-2 uppercase flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
                    YouTube Linki
                  </h3>
                  <input
                    value={seciliMac.youtube_link || ''}
                    onChange={(e) => macGuncelle('youtube_link', e.target.value)}
                    placeholder="https://youtube.com/..."
                    className="w-full h-12 bg-[#1a1a1a] text-white px-4 rounded-xl text-[14px] font-medium border border-gray-800 focus:border-[#e60000] outline-none transition-colors"
                  />
                </div>
              </div>

              {/* ZAMAN TÜNELİNE OLAY EKLE */}
              <div className="bg-[#1a0f0f] border border-[#e60000]/30 rounded-2xl p-5 mb-8 shadow-[0_0_20px_rgba(230,0,0,0.05)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#e60000]/10 blur-[40px] pointer-events-none"></div>
                
                <h3 className="text-[#e60000] text-[13px] font-black tracking-widest mb-4 uppercase flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                  Zaman Tüneline Olay Ekle
                </h3>
                
                <div className="flex flex-col md:flex-row gap-3 mb-3 relative z-10">
                  <select value={olayTakimYonu} onChange={e => setOlayTakimYonu(e.target.value)} className="flex-1 h-12 bg-[#141414] text-white px-3 rounded-xl border border-gray-800 focus:border-[#e60000] outline-none text-[14px]">
                    <option value="ev">Ev Sahibi ({seciliMac.ev_sahibi})</option>
                    <option value="deplasman">Deplasman ({seciliMac.deplasman})</option>
                  </select>
                  
                  <select value={olayTipi} onChange={e => setOlayTipi(e.target.value)} className="flex-1 h-12 bg-[#141414] text-white px-3 rounded-xl border border-gray-800 focus:border-[#e60000] outline-none text-[14px]">
                    <option value="GOL">⚽ Gol</option>
                    <option value="ASIST">🎯 Asist</option>
                    <option value="SARI_KART">🟨 Sarı Kart</option>
                    <option value="KIRMIZI_KART">🟥 Kırmızı Kart</option>
                    <option value="DEGISIKLIK">🔄 Oyuncu Değişikliği</option>
                  </select>
                </div>
                
                <div className="flex gap-3 relative z-10">
                  <input 
                    value={olayOyuncu} 
                    onChange={e => setOlayOyuncu(e.target.value)} 
                    placeholder="Telsizden gelen oyuncu adını yazın..."
                    className="flex-1 h-12 bg-[#141414] text-white px-4 rounded-xl border border-gray-800 focus:border-[#e60000] outline-none text-[14px]"
                  />
                  <button onClick={olayEkle} className="h-12 px-6 bg-[#e60000] hover:bg-[#ff3333] text-white rounded-xl font-bold text-[14px] shadow-[0_0_15px_rgba(230,0,0,0.3)] transition-colors whitespace-nowrap">
                    Ekle ({seciliMac.dakika}')
                  </button>
                </div>
              </div>

              {/* KONTROL BUTONLARI */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  onClick={() => { canliDurumGuncelle(true); setSureCalisiyor(true); }}
                  className="h-14 bg-[#16a34a]/10 hover:bg-[#16a34a]/20 border border-[#16a34a]/40 text-[#16a34a] rounded-xl font-bold text-[14px] flex items-center justify-center gap-2 transition-colors"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  Başlat
                </button>

                <button
                  onClick={async () => {
                    if (!seciliMac) return;
                    setSureCalisiyor(false);
                    const { error } = await supabase.from('maclar').update({ canli: false, durum: 'Devre Arası' }).eq('id', seciliMac.id);
                    if (!error) {
                      setSeciliMac({ ...seciliMac, canli: false, durum: 'Devre Arası' });
                      await fetch('/api/send-notification', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ baslik: '⏸ DEVRE ARASI', mesaj: `İlk yarı sona erdi. Skor: ${seciliMac.ev_sahibi} ${seciliMac.ev_skor}-${seciliMac.dep_skor} ${seciliMac.deplasman}` }) });
                    }
                  }}
                  className="h-14 bg-[#f59e0b]/10 hover:bg-[#f59e0b]/20 border border-[#f59e0b]/40 text-[#f59e0b] rounded-xl font-bold text-[14px] flex items-center justify-center gap-2 transition-colors"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                  Devre
                </button>

                <button
                  onClick={async () => {
                    if (!seciliMac) return;
                    const { error } = await supabase.from('maclar').update({ canli: true, durum: 'Canlı' }).eq('id', seciliMac.id);
                    if (!error) {
                      setSeciliMac({ ...seciliMac, canli: true, durum: 'Canlı' });
                      setSureCalisiyor(true);
                      await fetch('/api/send-notification', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ baslik: '▶ İKİNCİ YARI', mesaj: `${seciliMac.ev_sahibi} - ${seciliMac.deplasman} maçında ikinci yarı başladı!` }) });
                    }
                  }}
                  className="h-14 bg-[#2563eb]/10 hover:bg-[#2563eb]/20 border border-[#2563eb]/40 text-[#2563eb] rounded-xl font-bold text-[14px] flex items-center justify-center gap-2 transition-colors"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  2.Yarı
                </button>

                <button
                  onClick={async () => {
                    if (!seciliMac) return;
                    setSureCalisiyor(false);
                    const { error } = await supabase.from('maclar').update({ canli: false, durum: 'Maç Sona Erdi' }).eq('id', seciliMac.id);
                    if (!error) {
                      setSeciliMac({ ...seciliMac, canli: false, durum: 'Maç Sona Erdi' });
                      await fetch('/api/send-notification', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ baslik: '🏁 MAÇ SONA ERDİ!', mesaj: `${seciliMac.ev_sahibi} ${seciliMac.ev_skor}-${seciliMac.dep_skor} ${seciliMac.deplasman}` }) });
                    }
                  }}
                  className="h-14 bg-[#dc2626]/10 hover:bg-[#dc2626]/20 border border-[#dc2626]/40 text-[#dc2626] rounded-xl font-bold text-[14px] flex items-center justify-center gap-2 transition-colors"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><rect x="9" y="9" width="6" height="6"/></svg>
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
