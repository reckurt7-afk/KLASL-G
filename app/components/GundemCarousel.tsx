"use client";

import { useRef, useEffect, useState } from "react";
import { publicFetch } from "../../lib/supabase";

type Haber = {
  id: number;
  baslik: string;
  ozet: string;
  resim: string | null;
  kategori: string;
  created_at: string;
};

const MOCK_FALLBACK: Haber[] = [
  { id: 1, baslik: "Büyük Randevu Bursa'da!", ozet: "Bursa Süper Ligi'nde dev derbi...", resim: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=800", kategori: "Manşet", created_at: new Date().toISOString() },
  { id: 2, baslik: "Halı Saha Takımı Sırbistan Yolcusu", ozet: "Road to Serbia...", resim: "https://images.unsplash.com/photo-1543351611-58f69d7c1781?q=80&w=800", kategori: "Manşet", created_at: new Date().toISOString() },
  { id: 3, baslik: "Hoş Geldin, Yeni Sezon!", ozet: "Yeni sezon başlıyor...", resim: "https://images.unsplash.com/photo-1518605368461-1e12dce38a42?q=80&w=800", kategori: "Duyuru", created_at: new Date().toISOString() },
];

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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [haberler, setHaberler] = useState<Haber[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => { loadHaberler(); }, []);

  async function loadHaberler() {
    try {
      const data = await publicFetch("duyurular", "select=id,baslik,aciklama,renk,aktif,created_at&aktif=eq.true&order=created_at.desc&limit=8");
      const parsed = (data || []).map(parseHaber).filter((h: Haber) => h.baslik);
      setHaberler(parsed.length > 0 ? parsed : MOCK_FALLBACK);
    } catch {
      setHaberler(MOCK_FALLBACK);
    }
  }

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const next = dir === "right" ? Math.min(activeIdx + 1, haberler.length - 1) : Math.max(activeIdx - 1, 0);
    setActiveIdx(next);
    el.scrollTo({ left: next * el.offsetWidth, behavior: "smooth" });
  };

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setActiveIdx(Math.round(el.scrollLeft / (el.offsetWidth || 1)));
  };

  const formatDate = (s: string) => new Date(s).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="w-full bg-white pt-6 pb-4">
      <div className="max-w-[1600px] mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[20px] font-black text-gray-900">Gündem</h2>
          <div className="flex items-center gap-1.5">
            {haberler.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setActiveIdx(i);
                  scrollRef.current?.scrollTo({ left: i * (scrollRef.current?.offsetWidth || 0), behavior: "smooth" });
                }}
                className={`rounded-full transition-all ${i === activeIdx ? "w-6 h-2 bg-[#e60000]" : "w-2 h-2 bg-gray-300"}`}
              />
            ))}
          </div>
        </div>

        {/* Carousel */}
        <div className="relative">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-3 overflow-x-auto snap-x snap-mandatory"
            style={{ scrollbarWidth: "none" }}
          >
            {haberler.map((haber) => (
              <div
                key={haber.id}
                className="relative min-w-[calc(50%-6px)] md:min-w-[calc(33.333%-8px)] lg:min-w-[380px] h-[260px] md:h-[300px] rounded-2xl overflow-hidden shrink-0 snap-start group cursor-pointer"
              >
                {/* Background */}
                {haber.resim ? (
                  <div
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                    style={{ backgroundImage: `url(${haber.resim})` }}
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] to-[#e60000]/80" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="bg-[#e60000] text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white inline-block"></span>
                      {formatDate(haber.created_at)}
                    </span>
                    <span className="text-white text-[10px] font-bold bg-white/20 px-2 py-1 rounded backdrop-blur-sm">
                      ★ {haber.kategori}
                    </span>
                  </div>
                  <h3 className="text-white font-black text-[15px] md:text-[18px] leading-snug mb-1 line-clamp-2">{haber.baslik}</h3>
                  {haber.ozet && <p className="text-gray-300 text-[12px] line-clamp-1">{haber.ozet}</p>}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Arrows */}
          <button
            onClick={() => scroll("left")}
            className="hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white border border-gray-200 rounded-full shadow-md items-center justify-center text-gray-500 hover:bg-gray-50"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <button
            onClick={() => scroll("right")}
            className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-[#e60000] rounded-full shadow-md items-center justify-center text-white hover:bg-[#cc0000]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
