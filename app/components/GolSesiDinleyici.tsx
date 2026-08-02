"use client";

import { useEffect, useRef } from "react";
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
  // Önceki skorları sakla - gol gelince fark et
  const skorlarRef = useRef<Record<number, { ev: number; dep: number }>>({});
  const hazirRef = useRef(false);

  useEffect(() => {
    // İlk yüklemede mevcut skorları kaydet (ses çalmadan)
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

    // Realtime ile maçlar tablosunu dinle
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
            // Skor artmış mı? → GOL!
            if (yeni.ev_skor > eski.ev || yeni.dep_skor > eski.dep) {
              golSesiCal();
            }
          }

          // Yeni skoru kaydet
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

  return null; // Görsel bir şey yok, sadece dinleyici
}
