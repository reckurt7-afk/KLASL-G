"use client";

import { useEffect, useState } from "react";
import { publicFetch } from "@/lib/supabase";
import Link from "next/link";
import { useCityStore } from "@/app/store/cityStore";
import { motion, AnimatePresence } from "framer-motion";
import { BellRing, ArrowRight, Activity } from "lucide-react";

type Haber = {
  id: number;
  baslik: string;
  ozet: string;
  resim: string | null;
  kategori: string;
  created_at: string;
};

export default function LigMerkezi() {
  const { selectedCityId } = useCityStore();
  const [haberler, setHaberler] = useState<Haber[]>([]);
  const [loading, setLoading] = useState(true);

  const cityName = selectedCityId === 1 ? "Bursa" : selectedCityId === 2 ? "İstanbul" : selectedCityId === 3 ? "İzmir" : "Türkiye";

  useEffect(() => {
    async function fetchHaberler() {
      try {
        const data = await publicFetch("duyurular", "select=*&renk=eq.KAP&order=created_at.desc");
        const parsed = (data || []).map((d: any) => {
          let ozet = d.aciklama || "";
          let resim = "/icons/prime-logo.jpg";
          try {
            const j = JSON.parse(d.aciklama || "{}");
            if (j.ozet !== undefined) {
              ozet = j.ozet;
              if (j.resim) resim = j.resim;
            }
          } catch {}
          return {
            id: d.id,
            baslik: d.baslik,
            ozet,
            resim,
            kategori: d.renk || "KAP",
            created_at: d.created_at
          };
        });
        setHaberler(parsed);
      } catch (err) {
        console.error("Haberler yüklenemedi", err);
      } finally {
        setLoading(false);
      }
    }
    fetchHaberler();
  }, [selectedCityId]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getDate()} ${d.toLocaleString('tr-TR', { month: 'short' }).toUpperCase()} ${d.getFullYear()}`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="w-full flex flex-col fade-in relative min-h-[500px]">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#ceaa52] opacity-5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#9e1b22] opacity-5 rounded-full blur-3xl pointer-events-none" />

      {/* Premium Header Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full overflow-hidden rounded-[20px] mb-8 md:mb-10 shadow-[0_8px_30px_rgba(158,27,34,0.15)] group border border-white/10"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0c10] via-[#1a0507] to-[#801319] z-0" />
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#ceaa52] via-transparent to-transparent z-0" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] opacity-20" />

        <div className="relative z-10 flex items-center p-6 md:p-8 gap-5">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="w-16 h-16 md:w-20 md:h-20 relative bg-black/40 rounded-2xl flex items-center justify-center backdrop-blur-md border border-[#ceaa52]/30 shadow-[0_0_20px_rgba(206,170,82,0.2)] shrink-0 group-hover:border-[#ceaa52]/70 transition-colors"
          >
            <Activity className="w-8 h-8 md:w-10 md:h-10 text-[#ceaa52]" />
          </motion.div>
          
          <div className="flex flex-col justify-center flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ceaa52] animate-pulse shadow-[0_0_8px_rgba(206,170,82,0.8)]" />
              <span className="text-[10px] md:text-[12px] font-bold tracking-[0.25em] text-[#ceaa52] uppercase drop-shadow-md">
                RESMİ BİLDİRİM EKRANI
              </span>
            </div>
            <h1 className="text-[24px] md:text-[32px] font-black text-white leading-tight tracking-tight drop-shadow-lg">
              {cityName} Transfer KAP
            </h1>
          </div>

          <div className="hidden sm:flex flex-col items-center justify-center px-6 border-l border-white/10 ml-auto bg-black/20 rounded-2xl py-3 backdrop-blur-sm group-hover:bg-black/40 transition-colors">
            <motion.span 
              key={haberler.length}
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-[32px] font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 leading-none"
            >
              {haberler.length}
            </motion.span>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1.5">Bildirim</span>
          </div>
        </div>
      </motion.div>

      {/* Content Grid */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full py-24 flex flex-col items-center justify-center gap-6"
          >
            <div className="relative w-20 h-20 flex items-center justify-center">
              <div className="absolute inset-0 border-4 border-gray-100 rounded-full" />
              <div className="absolute inset-0 border-4 border-[#ceaa52] border-t-transparent rounded-full animate-spin" />
              <BellRing className="w-8 h-8 text-gray-300 animate-pulse" />
            </div>
            <span className="text-sm font-bold text-gray-400 animate-pulse tracking-widest uppercase">
              KAP Bildirimleri Yükleniyor...
            </span>
          </motion.div>
        ) : haberler.length === 0 ? (
          <motion.div 
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full py-28 flex flex-col items-center justify-center bg-gray-50/50 rounded-[24px] border border-gray-100 backdrop-blur-sm shadow-inner"
          >
            <div className="w-24 h-24 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center mb-5 hover:scale-105 transition-transform">
              <Activity className="w-10 h-10 text-gray-300" />
            </div>
            <span className="text-gray-500 font-bold text-lg text-center tracking-tight">Henüz güncel bir transfer bildirimi bulunmuyor.</span>
            <span className="text-gray-400 text-sm mt-2 text-center max-w-sm">Yeni transferler ve resmi duyurular yapıldığında burada listelenecektir.</span>
          </motion.div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6"
          >
            {haberler.map((haber) => (
              <motion.div key={haber.id} variants={itemVariants}>
                <Link 
                  href={`/duyuru/${haber.id}`}
                  className="relative w-full aspect-[4/5] sm:aspect-[3/4] rounded-[20px] overflow-hidden group cursor-pointer block bg-[#0f1115] border border-gray-200 hover:border-[#ceaa52]/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)]"
                >
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110" 
                    style={{ backgroundImage: `url(${haber.resim})` }}
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/10 opacity-90 group-hover:opacity-80 transition-opacity duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent opacity-60" />
                  
                  <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
                    <div className="bg-black/50 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg border border-white/10 tracking-widest flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#ceaa52]" />
                      {formatDate(haber.created_at)}
                    </div>
                    <div className="bg-gradient-to-r from-[#9e1b22] to-[#b82029] text-white text-[10px] font-black px-3 py-1.5 rounded-lg tracking-widest shadow-[0_4px_10px_rgba(158,27,34,0.4)] border border-[#ff4d56]/20">
                      {haber.kategori}
                    </div>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-5 md:p-6 flex flex-col z-10 transform transition-transform duration-500 group-hover:translate-y-[-4px]">
                    <h3 className="text-white font-black text-[16px] md:text-[18px] leading-snug line-clamp-2 mb-2.5 group-hover:text-[#ceaa52] transition-colors drop-shadow-md">
                      {haber.baslik}
                    </h3>
                    {haber.ozet && (
                      <p className="text-gray-300 text-[12px] md:text-[13px] line-clamp-2 mb-4 opacity-90 leading-relaxed font-medium">
                        {haber.ozet}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-2 mt-auto w-full pt-4 border-t border-white/10">
                      <span className="text-[#ceaa52] text-[11px] font-black tracking-[0.2em] uppercase group-hover:text-white transition-colors">
                        DETAYLARI İNCELE
                      </span>
                      <div className="w-7 h-7 rounded-full bg-[#ceaa52]/20 flex items-center justify-center group-hover:bg-[#ceaa52] transition-all duration-300 ml-auto group-hover:shadow-[0_0_15px_rgba(206,170,82,0.5)]">
                        <ArrowRight className="w-3.5 h-3.5 text-[#ceaa52] group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
