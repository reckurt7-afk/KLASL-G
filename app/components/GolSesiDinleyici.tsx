"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

// Maçkolik tarzı gol sesi
function golSesiCal() {
  try {
    const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    // Kalabalık gürültüsü
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = "bandpass";
    noiseFilter.frequency.value = 800;
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0, now);
    noiseGain.gain.linearRampToValueAtTime(0.5, now + 0.3);
    noiseGain.gain.linearRampToValueAtTime(0, now + 2);
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + 2);

    // Korna sesi
    const korna = ctx.createOscillator();
    const kornaGain = ctx.createGain();
    korna.type = "sawtooth";
    korna.frequency.setValueAtTime(300, now);
    korna.frequency.linearRampToValueAtTime(600, now + 0.5);
    kornaGain.gain.setValueAtTime(0, now);
    kornaGain.gain.linearRampToValueAtTime(0.5, now + 0.1);
    kornaGain.gain.linearRampToValueAtTime(0, now + 1.3);
    korna.connect(kornaGain);
    kornaGain.connect(ctx.destination);
    korna.start(now);
    korna.stop(now + 1.4);

    // Tiz ton
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

    // GOOOL anons
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance("GOOOOOL!");
      u.lang = "tr-TR";
      u.rate = 0.5;
      u.pitch = 1.4;
      u.volume = 1;
      setTimeout(() => window.speechSynthesis.speak(u), 600);
    }
  } catch (e) {
    console.log("Ses çalınamadı:", e);
  }
}

export default function GolSesiDinleyici() {
  const skorlarRef = useRef<Record<number, { ev: number; dep: number }>>({});
  const hazirRef = useRef(false);
  
  // Şov Ekranı State'leri
  const [golVar, setGolVar] = useState(false);
  const [golAtanIsim, setGolAtanIsim] = useState("");
  const [atanTakim, setAtanTakim] = useState("");

  useEffect(() => {
    async function ilkYukle() {
      const { data } = await supabase
        .from("maclar")
        .select("id, ev_skor, dep_skor, canli")
        .eq("canli", true);
      
      if (data) {
        data.forEach((m: any) => {
          skorlarRef.current[m.id] = { ev: m.ev_skor, dep: m.dep_skor };
        });
      }
      hazirRef.current = true;
    }
    ilkYukle();

    const kanal = supabase
      .channel("gol-sesi-kanal")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "maclar",
        },
        (payload) => {
          if (!hazirRef.current) return;
          const yeni = payload.new as any;
          const eski = skorlarRef.current[yeni.id];

          if (eski) {
            if (yeni.ev_skor > eski.ev || yeni.dep_skor > eski.dep) {
              const takim = yeni.ev_skor > eski.ev ? yeni.ev_sahibi : yeni.deplasman;
              const golKral = yeni.durum?.includes("|") ? yeni.durum.split("|")[1] : "BİLİNMEYEN KAHRAMAN";
              
              // Animasyonu ve Sesi Başlat
              golSesiCal();
              setAtanTakim(takim);
              setGolAtanIsim(golKral || "BİLİNMEYEN KAHRAMAN");
              setGolVar(true);

              // 7 Saniye sonra animasyonu kapat
              setTimeout(() => {
                setGolVar(false);
              }, 7000);
            }
          }

          skorlarRef.current[yeni.id] = {
            ev: yeni.ev_skor,
            dep: yeni.dep_skor,
          };
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(kanal);
    };
  }, []);

  if (!golVar) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden pointer-events-none">
      {/* Kırmızı Flaşör Arka Plan */}
      <div className="absolute inset-0 bg-[#ceaa52]/90 animate-gol-flash backdrop-blur-sm" />
      
      {/* Dev GOOOOL Yazısı */}
      <div className="relative z-10 flex flex-col items-center animate-gol-zoom">
        <h1 className="text-[15vw] sm:text-[180px] font-black italic text-white leading-none tracking-tighter drop-shadow-[0_0_40px_rgba(255,255,255,0.8)] m-0">
          GO<span className="text-yellow-400">O</span>O<span className="text-yellow-400">O</span>L!
        </h1>
        
        {/* Atan Takım */}
        <div className="text-2xl sm:text-4xl font-bold text-white/90 tracking-[0.2em] uppercase mt-4 animate-bounce">
          {atanTakim}
        </div>

        {/* Golü Atan Kişi */}
        <div className="mt-6 px-10 py-4 bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 rounded-full shadow-[0_0_50px_rgba(234,179,8,0.5)] border-2 border-white/50 animate-pulse">
          <span className="text-3xl sm:text-5xl font-black text-black tracking-tight">
            ⚽ {golAtanIsim}
          </span>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes gol-flash {
          0%, 100% { opacity: 0.9; }
          50% { opacity: 0.5; background-color: #000; }
        }
        .animate-gol-flash {
          animation: gol-flash 0.5s infinite;
        }
        @keyframes gol-zoom {
          0% { transform: scale(0.1) rotate(-10deg); opacity: 0; }
          40% { transform: scale(1.2) rotate(5deg); opacity: 1; }
          60% { transform: scale(0.9) rotate(-3deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        .animate-gol-zoom {
          animation: gol-zoom 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}} />
    </div>
  );
}
