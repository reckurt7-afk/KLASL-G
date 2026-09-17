"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { Radio } from "lucide-react";

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
            setCanliMac(null);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(kanal);
    };
  }, [canliMac]);

  return (
    <AnimatePresence>
      {canliMac && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="w-full bg-gradient-to-r from-[#0a0000] via-[#4a0a0f] to-[#0a0000] border-b border-[#ff3333]/30 overflow-hidden relative z-[60] shadow-[0_5px_20px_rgba(220,38,38,0.2)]"
        >
          {/* Animated Background Overlay */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay pointer-events-none" />
          
          <div className="max-w-[1440px] mx-auto px-4 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3 relative">
            
            {/* Left: LIVE Badge & Minute */}
            <div className="flex items-center gap-4 w-full md:w-[200px]">
              <div className="flex items-center gap-1.5 bg-black/60 px-3 py-1 rounded-md border border-[#ff3333]/40 shadow-[0_0_15px_rgba(255,51,51,0.2)]">
                <Radio className="w-3.5 h-3.5 text-[#ff4444] animate-pulse" />
                <span className="text-[11px] font-black tracking-[0.2em] text-[#ff4444] mt-0.5">CANLI</span>
              </div>
              <div className="font-mono text-xl md:text-2xl font-black text-[#ceaa52] drop-shadow-[0_0_8px_rgba(206,170,82,0.6)]">
                {canliMac.dakika}&apos;
              </div>
            </div>

            {/* Center: Score Board */}
            <div className="flex items-center justify-center gap-4 md:gap-8 flex-1 w-full">
              <div className="text-[13px] md:text-[16px] font-black text-right truncate flex-1 text-white uppercase tracking-wider drop-shadow-md">
                {canliMac.ev_sahibi}
              </div>
              
              <div className="flex items-center gap-3 bg-black/80 px-5 py-1.5 rounded-lg border border-white/10 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">
                <motion.span 
                  key={`ev-${canliMac.ev_skor}`}
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-2xl md:text-3xl font-black text-white"
                >
                  {canliMac.ev_skor}
                </motion.span>
                <span className="text-xl font-bold text-[#ff3333]">-</span>
                <motion.span 
                  key={`dep-${canliMac.dep_skor}`}
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-2xl md:text-3xl font-black text-white"
                >
                  {canliMac.dep_skor}
                </motion.span>
              </div>
              
              <div className="text-[13px] md:text-[16px] font-black text-left truncate flex-1 text-white uppercase tracking-wider drop-shadow-md">
                {canliMac.deplasman}
              </div>
            </div>

            {/* Right: Info */}
            <div className="hidden md:flex flex-col items-end text-[10px] text-gray-300 font-semibold tracking-wider uppercase w-[200px]">
              <div className="flex items-center gap-1.5 opacity-80 mb-0.5">
                <span className="text-[#ceaa52]">YAYIN:</span> 
                {canliMac.durum?.split("|")[0] || "PRİME LİG TV"}
              </div>
              {canliMac.hakem && (
                <div className="flex items-center gap-1.5 opacity-70">
                  <span className="text-[#ceaa52]">HAKEM:</span> 
                  {canliMac.hakem}
                </div>
              )}
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
