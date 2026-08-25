"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { motion } from "framer-motion";

export default function CalismaEkibiPage() {
  const [ekip, setEkip] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getir() {
      const { data } = await supabase.from("calisma_ekibi").select("*").order("sira", { ascending: true });
      setEkip(data || []);
      setLoading(false);
    }
    getir();
  }, []);

  const GoldCard = ({ role, person, delay }: { role: string, person: any, delay: number }) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="flex flex-col items-center p-4 border border-[#d4af37] rounded-xl bg-gradient-to-b from-[#1a1505] to-[#050505] shadow-[0_0_15px_rgba(212,175,55,0.1)] relative w-full"
    >
      <div className="text-[#d4af37] text-[10px] md:text-xs font-black text-center mb-4 min-h-[32px] flex items-center justify-center uppercase tracking-widest leading-tight">
        {role}
      </div>
      
      <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-[#d4af37] p-1 mb-4 relative overflow-hidden bg-[#0a0a0a]">
        <div className="w-full h-full rounded-full overflow-hidden relative bg-[#151515] flex items-center justify-center">
          {person?.foto_url ? (
            <Image src={person.foto_url} alt={person.ad_soyad} fill className="object-cover" />
          ) : (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="#d4af37" opacity="0.3"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
          )}
        </div>
      </div>

      <div className="w-full h-8 border border-[#d4af37] rounded-lg bg-black/50 flex items-center justify-center px-2">
        <span className="text-[#d4af37] text-[10px] md:text-xs font-bold truncate">
          {person?.ad_soyad || ""}
        </span>
      </div>
    </motion.div>
  );

  const ortaklar = ekip.filter(k => k.sira === 1 || k.gorev.toLowerCase().includes("ortak") || k.gorev.toLowerCase().includes("kurucu"));
  const diger = ekip.filter(k => !(k.sira === 1 || k.gorev.toLowerCase().includes("ortak") || k.gorev.toLowerCase().includes("kurucu")));

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-20 relative overflow-hidden font-sans">
      
      {/* BACKGROUND EFFECTS */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#d4af37]/10 to-transparent pointer-events-none"></div>
      
      <div className="max-w-[1200px] mx-auto px-2 md:px-6 relative z-10">
        
        {/* HEADER */}
        <div className="text-center mb-12">
          <svg className="w-12 h-12 md:w-16 md:h-16 mx-auto text-[#d4af37] mb-2 drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"/>
          </svg>
          <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#bf953f] via-[#fcf6ba] to-[#b38728] uppercase tracking-widest drop-shadow-lg mb-2">
            KLAS LİG
          </h1>
          <h2 className="text-xl md:text-2xl font-medium text-white tracking-[0.3em] uppercase">
            Çalışma Ekibi
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="w-12 h-12 border-4 border-[#d4af37]/20 border-t-[#d4af37] rounded-full animate-spin"></div></div>
        ) : ekip.length === 0 ? (
          <div className="text-center text-[#d4af37]/50 py-12 border border-[#d4af37]/20 rounded-2xl bg-black/40">
            Henüz kimse eklenmemiş. Admin panelinden çalışma ekibini ekleyebilirsiniz.
          </div>
        ) : (
          <>
            {/* ORTAKLAR SECTION */}
            {ortaklar.length > 0 && (
              <>
                <div className="flex justify-center mb-8">
                  <div className="bg-[#d4af37] text-black px-8 py-1 rounded-full font-black text-sm tracking-widest z-10 relative">
                    YÖNETİM
                  </div>
                </div>
                
                <div className="flex justify-center mb-12 relative">
                  {/* Bağlantı Çizgileri */}
                  <div className="absolute top-[-32px] bottom-[-24px] w-px bg-[#d4af37]"></div>
                  {diger.length > 0 && (
                    <>
                      <div className="absolute bottom-[-24px] w-[50%] md:w-[60%] h-px bg-[#d4af37]"></div>
                      <div className="absolute bottom-[-48px] w-px h-[24px] bg-[#d4af37]"></div>
                    </>
                  )}
                  
                  <div className="border border-[#d4af37] rounded-3xl p-6 md:p-8 flex flex-wrap justify-center gap-4 md:gap-16 bg-black/40 backdrop-blur-sm z-10">
                    {ortaklar.map((kisi, idx) => (
                      <div key={kisi.id} className="w-[140px] md:w-[160px]">
                        <GoldCard role={kisi.gorev} person={kisi} delay={0.1 * idx} />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ÇALIŞMA EKİBİ SECTION */}
            {diger.length > 0 && (
              <>
                <div className="flex justify-center mb-8 relative pt-6">
                  <div className="bg-[#d4af37] text-black px-8 py-1 rounded-full font-black text-sm tracking-widest z-10">
                    ÇALIŞMA EKİBİ
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 relative z-10">
                  {diger.map((kisi, idx) => (
                    <GoldCard key={kisi.id} role={kisi.gorev} person={kisi} delay={0.2 + (idx * 0.05)} />
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {/* FOOTER BADGE */}
        <div className="mt-16 flex flex-col items-center opacity-80">
          <div className="w-16 h-20 border border-[#d4af37] rounded-lg p-2 mb-4 flex items-center justify-center flex-col">
            <span className="text-[#d4af37] text-[10px] font-black uppercase">Klas Lig</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/></svg>
          </div>
          <div className="text-[#d4af37] text-xs font-black tracking-[0.4em] uppercase">
            Birlikte Daha Güçlüyüz!
          </div>
        </div>

      </div>
    </div>
  );
}
