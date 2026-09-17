"use client";

import { useRef, useEffect, useState } from "react";
import { useCityStore } from "@/app/store/cityStore";
import { publicFetch } from "../../lib/supabase";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, ChevronLeft } from "lucide-react";

type Haber = {
  id: number;
  baslik: string;
  ozet: string;
  resim: string | null;
  kategori: string;
  created_at: string;
};

function parseHaber(h: any): Haber {
  let ozet = h.aciklama || "";
  let resim: string | null = null;
  try {
    const parsed = JSON.parse(h.aciklama || "{}");
    if (parsed.ozet !== undefined) { ozet = parsed.ozet; resim = parsed.resim || null; }
  } catch {}
  return { id: h.id, baslik: h.baslik, ozet, resim, kategori: h.renk || "Manşet", created_at: h.created_at };
}

export default function GundemCarousel() {
  const { selectedCityId } = useCityStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [haberler, setHaberler] = useState<Haber[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => { loadHaberler(); }, [selectedCityId]);

  async function loadHaberler() {
    try {
      const data = await publicFetch("duyurular", "select=id,baslik,aciklama,renk,aktif,created_at&aktif=eq.true&order=created_at.desc&limit=8");
      const parsed = (data || []).map(parseHaber).filter((h: Haber) => h.baslik && h.kategori !== "KAP");
      setHaberler(parsed);
    } catch {
      setHaberler([]);
    }
  }

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardW = el.querySelector("a")?.offsetWidth || 300;
    el.scrollBy({ left: dir === "right" ? cardW + 20 : -(cardW + 20), behavior: "smooth" });
  };

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const cardW = el.querySelector("a")?.offsetWidth || 300;
    setActiveIdx(Math.round(el.scrollLeft / (cardW + 20)));
  };

  const formatDate = (s: string) => new Date(s).toLocaleDateString("tr-TR", { day: "numeric", month: "long" });

  if (haberler.length === 0) return null;

  return (
    <div className="w-full bg-[#fcfcfc] pt-8 pb-8 relative overflow-hidden">
      {/* Background elegant accents */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none hidden md:block" />
      <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none hidden md:block" />

      <div className="max-w-[1440px] mx-auto relative z-20">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6 px-4 md:px-6">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-8 bg-gradient-to-b from-[#9e1b22] to-[#ceaa52] rounded-full shadow-[0_0_10px_rgba(158,27,34,0.4)]" />
            <h2 className="text-[26px] font-black text-gray-900 tracking-tight flex items-center gap-2">
              Gündem
              <div className="w-2 h-2 rounded-full bg-[#9e1b22] shadow-[0_0_8px_rgba(158,27,34,0.6)] animate-pulse" />
            </h2>
          </div>
          {/* Dot indicators */}
          <div className="flex items-center gap-2">
            {haberler.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setActiveIdx(i);
                  const el = scrollRef.current;
                  if (!el) return;
                  const cardW = el.querySelector("a")?.offsetWidth || 300;
                  el.scrollTo({ left: i * (cardW + 20), behavior: "smooth" });
                }}
                className={`rounded-full transition-all duration-500 ease-out ${i === activeIdx ? "w-8 h-2 bg-[#9e1b22] shadow-[0_0_8px_rgba(158,27,34,0.5)]" : "w-2 h-2 bg-gray-200 hover:bg-gray-400"}`}
              />
            ))}
          </div>
        </div>

        {/* Carousel */}
        <div className="relative group/carousel">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-6 px-4 md:px-6"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {haberler.map((haber, idx) => (
              <motion.div
                key={haber.id}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="shrink-0 snap-start relative"
              >
                <Link
                  href={`/duyuru/${haber.id}`}
                  className="relative group block rounded-[24px] overflow-hidden w-[85vw] sm:w-[60vw] md:w-[400px] h-[280px] md:h-[340px] shadow-[0_10px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)] transition-shadow duration-500 border border-gray-100"
                >
                  {/* Background Image */}
                  {haber.resim ? (
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                      style={{ backgroundImage: `url(${haber.resim})` }}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] via-[#2d0a0e] to-[#9e1b22]" />
                  )}

                  {/* Elegant Gradients */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent opacity-50" />

                  {/* Featured Badge for first card */}
                  {idx === 0 && (
                    <div className="absolute top-5 left-5 flex items-center gap-2 bg-[#9e1b22] text-white text-[11px] font-black px-4 py-2 rounded-xl shadow-lg border border-white/20">
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      MANŞET
                    </div>
                  )}

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 transform transition-transform duration-500 group-hover:-translate-y-2">
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <span className="text-white text-[10px] font-bold bg-white/20 px-3 py-1.5 rounded-lg backdrop-blur-md border border-white/10 uppercase tracking-widest shadow-sm">
                        {haber.kategori}
                      </span>
                      <span className="text-[#ceaa52] text-[10px] font-bold bg-black/40 px-3 py-1.5 rounded-lg backdrop-blur-md border border-[#ceaa52]/20 uppercase tracking-widest">
                        {formatDate(haber.created_at)}
                      </span>
                    </div>
                    
                    <h3 className="text-white font-black leading-snug line-clamp-2 drop-shadow-lg text-[18px] md:text-[22px] group-hover:text-[#ceaa52] transition-colors duration-300">
                      {haber.baslik}
                    </h3>
                    
                    {haber.ozet && (
                      <p className="text-gray-300 text-[13px] md:text-[14px] line-clamp-2 mt-2.5 opacity-90 leading-relaxed font-medium">
                        {haber.ozet}
                      </p>
                    )}
                  </div>

                  {/* Hover Arrow Indicator */}
                  <div className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                    <ChevronRight className="w-5 h-5 text-white" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Desktop Arrow Buttons */}
          <button
            onClick={() => scroll("left")}
            className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full shadow-[0_8px_20px_rgba(0,0,0,0.1)] items-center justify-center text-gray-700 hover:bg-[#9e1b22] hover:text-white hover:border-[#9e1b22] hover:scale-110 transition-all duration-300 opacity-0 group-hover/carousel:opacity-100 -translate-x-4 group-hover/carousel:translate-x-0"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-[#9e1b22] border border-[#9e1b22] rounded-full shadow-[0_8px_20px_rgba(158,27,34,0.3)] items-center justify-center text-white hover:bg-[#ceaa52] hover:border-[#ceaa52] hover:scale-110 transition-all duration-300 opacity-0 group-hover/carousel:opacity-100 translate-x-4 group-hover/carousel:translate-x-0"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
