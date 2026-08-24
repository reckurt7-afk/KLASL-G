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
  const [olayTipi, setOlayTipi] = useState("gol");
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
            const takim = olayTakimYonu === "ev" ? seciliMac.ev_sahibi : seciliMac.deplasman;
      let baslik = "";
      let mesaj = "";
      switch (olayTipi) {
        case "GOL": baslik = "⚽ GOOOL!"; mesaj = `${takim} adına ${olayOyuncu} ${seciliMac.dakika}. dakikada topu ağlara gönderdi! Skor: ${seciliMac.ev_skor}-${seciliMac.dep_skor}`; golSesiCal(); break;
        case "ASIST": baslik = "👟 ASİST"; mesaj = `${takim} takımından ${olayOyuncu} şık bir asiste imza attı!`; break;
        case "SARI_KART": baslik = "🟨 SARI KART"; mesaj = `${takim} takımından ${olayOyuncu} sarı kart gördü.`; break;
        case "KIRMIZI_KART": baslik = "🟥 KIRMIZI KART"; mesaj = `${takim} takımından ${olayOyuncu} kırmızı kart gördü!`; break;
        case "DEGISIKLIK": baslik = "🔄 OYUNCU DEĞİŞİKLİĞİ"; mesaj = `${takim} takımında ${olayOyuncu} oyuna dahil oldu.`; break;
        default: baslik = "⚡ MAÇ OLAYI"; mesaj = `${takim} takımından ${olayOyuncu} ile ilgili yeni bir gelişme var.`;
      }
      await fetch("/api/send-notification", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ baslik, mesaj, url: "/" }) });
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
    <div style={{ minHeight: "100vh", background: "#0b0b0b", color: "#fff", padding: "90px 20px" }}>
      <h1 style={{ textAlign: "center", color: "#ff3131", marginBottom: 30, fontWeight: 900, fontSize: 28 }}>
        🔴 CANLI MAÇ YÖNETİMİ
      </h1>

      <div style={{ maxWidth: 700, margin: "0 auto", background: "#151515", borderRadius: 20, padding: 24, border: "1px solid rgba(255,49,49,0.15)" }}>
        <select
          value={seciliMac?.id || ""}
          onChange={(e) => {
            const mac = maclar.find((m) => m.id === Number(e.target.value));
            setSeciliMac(mac || null);
            setSureCalisiyor(false);
          }}
          style={{
            width: "100%",
            height: 55,
            borderRadius: 12,
            background: "#222",
            color: "#fff",
            padding: "0 15px",
            fontSize: 16,
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <option value="">Maç Seçiniz</option>
          {maclar.map((m) => (
            <option key={m.id} value={m.id}>
              {m.hafta}. Hafta | {m.ev_sahibi || "Ev Sahibi"} - {m.deplasman || "Deplasman"}
            </option>
          ))}
        </select>

        {seciliMac && (
          <>
            {/* Maç Başlığı */}
            <div style={{ textAlign: "center", marginTop: 30, marginBottom: 10 }}>
              <div style={{ fontSize: 13, color: "#ff3131", fontWeight: 700, letterSpacing: 3, marginBottom: 8 }}>
                {seciliMac.hafta}. HAFTA
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 900, margin: 0 }}>
                {seciliMac.ev_sahibi || "Ev Sahibi"} 🆚 {seciliMac.deplasman || "Deplasman"}
              </h2>
              {seciliMac.canli && (
                <div style={{
                  display: "inline-block",
                  background: "rgba(255,49,49,0.15)",
                  border: "1px solid rgba(255,49,49,0.4)",
                  color: "#ff3131",
                  padding: "4px 14px",
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 800,
                  marginTop: 10,
                  animation: "pulse 1.5s infinite",
                }}>
                  🔴 CANLI
                </div>
              )}
            </div>

            {/* SKOR */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr auto 1fr",
              alignItems: "center",
              textAlign: "center",
              gap: 15,
              marginTop: 20,
              background: "#0d0d0d",
              borderRadius: 16,
              padding: "20px 10px",
              border: "1px solid rgba(255,255,255,0.06)",
            }}>
              <div>
                <div style={{ fontSize: 12, color: "#888", fontWeight: 700, marginBottom: 8 }}>{seciliMac.ev_sahibi}</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                  <button onClick={async () => {
                    const yeniSkor = Math.max(0, seciliMac.ev_skor - 1);
                    if (yeniSkor < seciliMac.ev_skor) {
                      await macGuncelle("ev_skor", yeniSkor);
                      await fetch("/api/send-notification", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          baslik: "❌ GOL İPTAL",
                          mesaj: `${seciliMac.ev_sahibi} golü iptal edildi! Skor: ${yeniSkor}-${seciliMac.dep_skor}`,
                        }),
                      });
                    }
                  }} style={skorBtnStyle}>➖</button>

                  <h1 style={{ fontSize: 48, margin: 0, fontWeight: 900, color: "#fff" }}>{seciliMac.ev_skor}</h1>

                  <button onClick={async () => {
                    
                    const yeniSkor = seciliMac.ev_skor + 1;
                    golSesiCal(); // 🔊 GOOOL sesi (sadece adminde de çalar)
                    
                    // İki alanı aynı anda güncelle (İsim bilgisini durum sütununa gizliyoruz)
                    const { error } = await supabase
                      .from("maclar")
                      .update({ ev_skor: yeniSkor, durum: "Canlı" })
                      .eq("id", seciliMac.id);
                      
                    if (!error) {
                      setSeciliMac({ ...seciliMac, ev_skor: yeniSkor });
                      await fetch("/api/send-notification", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          baslik: "⚽ GOOOL!",
                          mesaj: `${seciliMac.ev_sahibi} gol attı! Skor: ${yeniSkor}-${seciliMac.dep_skor}`,
                        }),
                      });
                    }
                  }} style={{ ...skorBtnStyle, background: "#16a34a", border: "none" }}>⚽</button>
                </div>
              </div>

              <h1 style={{ fontSize: 36, color: "#555", margin: 0 }}>-</h1>

              <div>
                <div style={{ fontSize: 12, color: "#888", fontWeight: 700, marginBottom: 8 }}>{seciliMac.deplasman}</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                  <button onClick={async () => {
                    const yeniSkor = Math.max(0, seciliMac.dep_skor - 1);
                    if (yeniSkor < seciliMac.dep_skor) {
                      await macGuncelle("dep_skor", yeniSkor);
                      await fetch("/api/send-notification", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          baslik: "❌ GOL İPTAL",
                          mesaj: `${seciliMac.deplasman} golü iptal edildi! Skor: ${seciliMac.ev_skor}-${yeniSkor}`,
                        }),
                      });
                    }
                  }} style={skorBtnStyle}>➖</button>

                  <h1 style={{ fontSize: 48, margin: 0, fontWeight: 900, color: "#fff" }}>{seciliMac.dep_skor}</h1>

                  <button onClick={async () => {
                    
                    const yeniSkor = seciliMac.dep_skor + 1;
                    golSesiCal(); // 🔊 GOOOL sesi!
                    
                    const { error } = await supabase
                      .from("maclar")
                      .update({ dep_skor: yeniSkor, durum: "Canlı" })
                      .eq("id", seciliMac.id);
                      
                    if (!error) {
                      setSeciliMac({ ...seciliMac, dep_skor: yeniSkor });
                      await fetch("/api/send-notification", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          baslik: "⚽ GOOOL!",
                          mesaj: `${seciliMac.deplasman} gol attı! Skor: ${seciliMac.ev_skor}-${yeniSkor}`,
                        }),
                      });
                    }
                  }} style={{ ...skorBtnStyle, background: "#16a34a", border: "none" }}>⚽</button>
                </div>
              </div>
            </div>

            {/* DAKİKA + SÜRE BAŞLAT */}
            <div style={{ marginTop: 24, background: "#0d0d0d", borderRadius: 16, padding: "20px", border: "1px solid rgba(255,255,255,0.06)" }}>
              <h3 style={{ textAlign: "center", color: "#888", fontSize: 13, fontWeight: 700, letterSpacing: 2, margin: "0 0 12px" }}>DAKİKA</h3>
              <div style={{ display: "flex", justifyContent: "center", gap: 12, alignItems: "center" }}>
                <button onClick={() => macGuncelle("dakika", Math.max(0, seciliMac.dakika - 1))} style={skorBtnStyle}>➖</button>
                <h2 style={{ fontSize: 40, margin: 0, fontWeight: 900, minWidth: 80, textAlign: "center" }}>{seciliMac.dakika}&apos;</h2>
                <button onClick={() => macGuncelle("dakika", seciliMac.dakika + 1)} style={skorBtnStyle}>➕</button>
              </div>

              <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 16 }}>
                <button
                  onClick={() => {
                    if (sureCalisiyor) {
                      setSureCalisiyor(false);
                    } else {
                      setSureCalisiyor(true);
                    }
                  }}
                  style={{
                    padding: "12px 28px",
                    background: sureCalisiyor
                      ? "linear-gradient(135deg, #dc2626, #991b1b)"
                      : "linear-gradient(135deg, #16a34a, #15803d)",
                    color: "#fff",
                    border: "none",
                    borderRadius: 12,
                    fontSize: 15,
                    fontWeight: 800,
                    cursor: "pointer",
                    boxShadow: sureCalisiyor
                      ? "0 4px 15px rgba(220,38,38,0.4)"
                      : "0 4px 15px rgba(22,163,74,0.4)",
                  }}
                >
                  {sureCalisiyor ? "⏸️ Süreyi Durdur" : "⏱️ Süreyi Başlat"}
                </button>

                <button
                  onClick={() => {
                    setSureCalisiyor(false);
                    macGuncelle("dakika", 0);
                  }}
                  style={{
                    padding: "12px 20px",
                    background: "#333",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 12,
                    fontSize: 15,
                    fontWeight: 800,
                    cursor: "pointer",
                  }}
                >
                  🔄 Sıfırla
                </button>
              </div>

              {sureCalisiyor && (
                <div style={{ textAlign: "center", marginTop: 10, color: "#16a34a", fontSize: 12, fontWeight: 700 }}>
                  ✅ Süre otomatik olarak ilerliyor (dakikada 1 artıyor)
                </div>
              )}
            </div>

            {/* HAKEM */}
            <div style={{ marginTop: 20 }}>
              <h3 style={{ color: "#888", fontSize: 13, fontWeight: 700, letterSpacing: 2, marginBottom: 8 }}>HAKEM</h3>
              <input
                value={seciliMac.hakem || ""}
                onChange={(e) => macGuncelle("hakem", e.target.value)}
                placeholder="Hakem adı"
                style={{
                  width: "100%",
                  height: 48,
                  padding: "0 15px",
                  borderRadius: 12,
                  background: "#0d0d0d",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.1)",
                  fontSize: 15,
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* YOUTUBE */}
            <div style={{ marginTop: 16 }}>
              <h3 style={{ color: "#888", fontSize: 13, fontWeight: 700, letterSpacing: 2, marginBottom: 8 }}>YOUTUBE YAYIN LİNKİ</h3>
              <input
                value={seciliMac.youtube_link || ""}
                onChange={(e) => macGuncelle("youtube_link", e.target.value)}
                placeholder="https://youtube.com/..."
                style={{
                  width: "100%",
                  height: 48,
                  padding: "0 15px",
                  borderRadius: 12,
                  background: "#0d0d0d",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.1)",
                  fontSize: 15,
                  boxSizing: "border-box",
                }}
              />
            </div>
            {/* OLAY EKLEME (ZAMAN TÜNELİ) */}
            <div style={{ marginTop: 24, background: "#0d0d0d", borderRadius: 16, padding: "20px", border: "1px solid rgba(255,49,49,0.3)" }}>
              <h3 style={{ color: "#ff3131", fontSize: 13, fontWeight: 800, letterSpacing: 2, marginBottom: 12 }}>⚡ ZAMAN TÜNELİNE OLAY EKLE</h3>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                <select value={olayTakimYonu} onChange={e => setOlayTakimYonu(e.target.value)} style={{ padding: 10, background: "#222", color: "#fff", borderRadius: 8, border: "none" }}>
                  <option value="ev">Ev Sahibi ({seciliMac.ev_sahibi})</option>
                  <option value="deplasman">Deplasman ({seciliMac.deplasman})</option>
                </select>
                
                <select value={olayTipi} onChange={e => setOlayTipi(e.target.value)} style={{ padding: 10, background: "#222", color: "#fff", borderRadius: 8, border: "none" }}>
                  <option value="gol">⚽ Gol</option>
                  <option value="sari_kart">🟨 Sarı Kart</option>
                  <option value="kirmizi_kart">🟥 Kırmızı Kart</option>
                  <option value="degisiklik">🔄 Oyuncu Değişikliği</option>
                </select>
              </div>
              
              <div style={{ display: "flex", gap: 10 }}>
                <input 
                  value={olayOyuncu} 
                  onChange={e => setOlayOyuncu(e.target.value)} 
                  placeholder="Oyuncu adı..."
                  style={{ flex: 1, padding: "10px 15px", background: "#222", color: "#fff", borderRadius: 8, border: "none" }}
                />
                <button onClick={olayEkle} style={{ padding: "10px 20px", background: "#ff3131", color: "#fff", borderRadius: 8, fontWeight: "bold", border: "none", cursor: "pointer" }}>
                  Ekle ({seciliMac.dakika}')
                </button>
              </div>
            </div>

            {/* KONTROL BUTONLARI */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginTop: 28 }}>
              <button
                onClick={() => {
                  canliDurumGuncelle(true);
                  setSureCalisiyor(true);
                }}
                style={btnStyle("#16a34a")}
              >
                ▶️ Başlat
              </button>

              <button
                onClick={async () => {
                  if (!seciliMac) return;
                  setSureCalisiyor(false);
                  const { error } = await supabase
                    .from("maclar")
                    .update({ canli: false, durum: "Devre Arası" })
                    .eq("id", seciliMac.id);
                  if (!error) {
                    setSeciliMac({ ...seciliMac, canli: false, durum: "Devre Arası" });
                    await fetch("/api/send-notification", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        baslik: "⏸️ DEVRE ARASI",
                        mesaj: `İlk yarı sona erdi. Skor: ${seciliMac.ev_sahibi} ${seciliMac.ev_skor}-${seciliMac.dep_skor} ${seciliMac.deplasman}`,
                      }),
                    });
                  }
                }}
                style={btnStyle("#f59e0b")}
              >
                ⏸️ Devre
              </button>

              <button
                onClick={async () => {
                  if (!seciliMac) return;
                  const { error } = await supabase
                    .from("maclar")
                    .update({ canli: true, durum: "Canlı" })
                    .eq("id", seciliMac.id);
                  if (!error) {
                    setSeciliMac({ ...seciliMac, canli: true, durum: "Canlı" });
                    setSureCalisiyor(true);
                    await fetch("/api/send-notification", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        baslik: "▶️ İKİNCİ YARI",
                        mesaj: `${seciliMac.ev_sahibi} - ${seciliMac.deplasman} maçında ikinci yarı başladı!`,
                      }),
                    });
                  }
                }}
                style={btnStyle("#2563eb")}
              >
                ▶️ 2.Yarı
              </button>

              <button
                onClick={async () => {
                  if (!seciliMac) return;
                  setSureCalisiyor(false);
                  const { error } = await supabase
                    .from("maclar")
                    .update({ canli: false, durum: "Maç Sona Erdi" })
                    .eq("id", seciliMac.id);
                  if (!error) {
                    setSeciliMac({ ...seciliMac, canli: false, durum: "Maç Sona Erdi" });
                    await fetch("/api/send-notification", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        baslik: "🏁 MAÇ SONA ERDİ!",
                        mesaj: `${seciliMac.ev_sahibi} ${seciliMac.ev_skor}-${seciliMac.dep_skor} ${seciliMac.deplasman}`,
                      }),
                    });
                  }
                }}
                style={btnStyle("#dc2626")}
              >
                🏁 Bitir
              </button>
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}