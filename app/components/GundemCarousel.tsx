"use client";

import { useRef, useEffect, useState } from "react";
import { useCityStore } from "@/app/store/cityStore";
import { publicFetch } from "../../lib/supabase";
import Link from "next/link";

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
    <div className="w-full bg-white pt-6 pb-6">
      <div className="max-w-[1440px] mx-auto">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-5 px-4 md:px-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-7 bg-gradient-to-b from-[#9e1b22] to-[#ceaa52] rounded-full" />
            <h2 className="text-[22px] font-black text-gray-900 tracking-tight">Gündem</h2>
          </div>
          {/* Dot indicators */}
          <div className="flex items-center gap-1.5">
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
                className={`rounded-full transition-all duration-300 ${i === activeIdx ? "w-6 h-2 bg-[#9e1b22]" : "w-2 h-2 bg-gray-200 hover:bg-gray-400"}`}
              />
            ))}
          </div>
        </div>

        {/* Carousel */}
        <div className="relative">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 px-4 md:px-6"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {haberler.map((haber, idx) => (
              <Link
                key={haber.id}
                href={`/duyuru/${haber.id}`}
                className={`relative shrink-0 snap-start group cursor-pointer block rounded-2xl overflow-hidden
                  transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl
                  ${idx === 0
                    ? "w-[85vw] sm:w-[60vw] md:w-[520px] h-[320px] md:h-[380px]"
                    : "w-[72vw] sm:w-[50vw] md:w-[360px] h-[260px] md:h-[300px]"
                  }
                `}
                style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.10)" }}
              >
                {/* Background Image */}
                {haber.resim ? (
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url(${haber.resim})` }}
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] via-[#2d0a0e] to-[#9e1b22]" />
                )}

                {/* Gradient Overlay - only bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                {/* Featured Badge for first card */}
                {idx === 0 && (
                  <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-[#9e1b22] text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse inline-block" />
                    MANŞET
                  </div>
                )}

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-[#ceaa52] text-[10px] font-bold bg-black/30 px-2 py-1 rounded-full backdrop-blur-sm">
                      {formatDate(haber.created_at)}
                    </span>
                    {idx !== 0 && (
                      <span className="text-white text-[10px] font-bold bg-white/15 px-2 py-1 rounded-full backdrop-blur-sm">
                        ★ {haber.kategori}
                      </span>
                    )}
                  </div>
                  <h3 className={`text-white font-black leading-snug line-clamp-2 drop-shadow-md ${
                    idx === 0 ? "text-[18px] md:text-[22px]" : "text-[14px] md:text-[16px]"
                  }`}>
                    {haber.baslik}
                  </h3>
                  {haber.ozet && idx === 0 && (
                    <p className="text-gray-300 text-[12px] md:text-[13px] line-clamp-1 mt-1 opacity-90">
                      {haber.ozet}
                    </p>
                  )}
                </div>

                {/* Hover arrow indicator */}
                <div className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>

          {/* Desktop Arrow Buttons */}
          <button
            onClick={() => scroll("left")}
            className="hidden md:flex absolute -left-1 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-lg items-center justify-center text-gray-600 hover:bg-[#9e1b22] hover:text-white hover:border-[#9e1b22] transition-all duration-200"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <button
            onClick={() => scroll("right")}
            className="hidden md:flex absolute -right-1 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-[#9e1b22] rounded-full shadow-lg items-center justify-center text-white hover:bg-[#ceaa52] transition-all duration-200"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
