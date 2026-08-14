"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Mac = {
  id: number;
  ev_sahibi: string;
  deplasman: string;
  ev_skor: number;
  dep_skor: number;
  dakika: number;
  durum: string;
  canli: boolean;
  hakem: string;
};

export default function CanliSkorBandi() {
  const [canliMac, setCanliMac] = useState<Mac | null>(null);

  useEffect(() => {
    async function ilkYukle() {
      const { data } = await supabase
        .from("maclar")
        .select("*")
        .eq("canli", true)
        .limit(1)
        .single();
      
      if (data) {
        setCanliMac(data);
      }
    }
    ilkYukle();

    const kanal = supabase
      .channel("canli-skor-bandi")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "maclar" },
        (payload) => {
          const yeni = payload.new as Mac;
          
          if (yeni.canli) {
            setCanliMac(yeni);
          } else if (canliMac && canliMac.id === yeni.id) {
            // Eğer maç bitirildiyse veya canlıdan çıkarıldıysa bandı kaldır
            setCanliMac(null);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(kanal);
    };
  }, [canliMac]);

  if (!canliMac) return null;

  return (
    <div className="w-full bg-gradient-to-r from-red-700 via-red-600 to-red-800 text-white shadow-[0_4px_20px_rgba(220,38,38,0.4)] border-b-2 border-red-500 overflow-hidden relative z-40">
      {/* Yanıp Sönen Flaşör Efekti Arka Plan İçin */}
      <div className="absolute inset-0 bg-white/10 animate-pulse mix-blend-overlay pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 py-2 sm:py-3 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 relative">
        
        {/* Sol Taraf: Canlı İkonu ve Dakika */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-black/40 px-3 py-1 rounded-full border border-red-400/30">
            <span className="w-2.5 h-2.5 bg-red-400 rounded-full animate-ping" />
            <span className="text-xs font-black tracking-widest text-red-200">CANLI</span>
          </div>
          <div className="font-mono text-xl sm:text-2xl font-black text-yellow-300 drop-shadow-[0_0_10px_rgba(253,224,71,0.5)]">
            {canliMac.dakika}&apos;
          </div>
        </div>

        {/* Orta: Skor Tablosu */}
        <div className="flex items-center justify-center gap-4 sm:gap-8 flex-1 w-full sm:w-auto">
          <div className="text-sm sm:text-lg font-bold text-right truncate max-w-[120px] sm:max-w-[200px] flex-1 text-white/90 uppercase tracking-wide">
            {canliMac.ev_sahibi}
          </div>
          
          <div className="flex items-center gap-3 bg-black/60 px-4 py-1.5 sm:py-2 rounded-xl border border-white/10 shadow-inner">
            <span className="text-2xl sm:text-4xl font-black text-white">{canliMac.ev_skor}</span>
            <span className="text-lg sm:text-xl font-bold text-red-400">-</span>
            <span className="text-2xl sm:text-4xl font-black text-white">{canliMac.dep_skor}</span>
          </div>
          
          <div className="text-sm sm:text-lg font-bold text-left truncate max-w-[120px] sm:max-w-[200px] flex-1 text-white/90 uppercase tracking-wide">
            {canliMac.deplasman}
          </div>
        </div>

        {/* Sağ Taraf: Durum / Hakem (Sadece PC'de) */}
        <div className="hidden md:flex flex-col items-end text-xs text-red-200 font-medium">
          <div className="flex items-center gap-1.5 opacity-80">
            <span>🏟️</span> {canliMac.durum?.split("|")[0]}
          </div>
          {canliMac.hakem && (
            <div className="flex items-center gap-1.5 opacity-70">
              <span>👤</span> Hakem: {canliMac.hakem}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
