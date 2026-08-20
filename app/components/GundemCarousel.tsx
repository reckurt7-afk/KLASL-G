"use client";

import { useRef, useState } from "react";

const NEWS = [
  {
    id: 1,
    date: "20 Ağustos 2026",
    tag: "Manşet",
    title: "Büyük Randevu Bursa'da!",
    desc: "Bursa Süper Ligi'nde dev derbi...",
    img: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=800",
  },
  {
    id: 2,
    date: "19 Ağustos 2026",
    tag: "Manşet",
    title: "Milli Takımımızın Giyim Sponsoru Divane Spor!",
    desc: "Halı saha milli takımı...",
    img: "https://images.unsplash.com/photo-1518605368461-1e12dce38a42?q=80&w=800",
  },
  {
    id: 3,
    date: "18 Ağustos 2026",
    tag: "Röportaj",
    title: "Hoş Geldin Cihan Özdemir",
    desc: "Yeni antrenörümüz ile özel röportaj...",
    img: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800",
  },
  {
    id: 4,
    date: "17 Ağustos 2026",
    tag: "Manşet",
    title: "Halı Saha Takımı Sırbistan Yolcusu",
    desc: "Road to Serbia...",
    img: "https://images.unsplash.com/photo-1543351611-58f69d7c1781?q=80&w=800",
  },
];

export default function GundemCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardW = el.offsetWidth;
    const next = dir === "right"
      ? Math.min(activeIdx + 1, NEWS.length - 1)
      : Math.max(activeIdx - 1, 0);
    setActiveIdx(next);
    el.scrollTo({ left: next * cardW, behavior: "smooth" });
  };

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / el.offsetWidth);
    setActiveIdx(idx);
  };

  return (
    <div className="w-full bg-white pt-6 pb-4">
      <div className="max-w-[1600px] mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[20px] font-black text-gray-900">Gündem</h2>
          <div className="flex items-center gap-1.5">
            {NEWS.map((_, i) => (
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
            className="flex gap-3 overflow-x-auto hide-scrollbar snap-x snap-mandatory"
            style={{ scrollbarWidth: "none" }}
          >
            {NEWS.map((news) => (
              <div
                key={news.id}
                className="relative min-w-[calc(50%-6px)] md:min-w-[calc(33.333%-8px)] lg:min-w-[380px] h-[260px] md:h-[300px] rounded-2xl overflow-hidden shrink-0 snap-start group cursor-pointer"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                  style={{ backgroundImage: `url(${news.img})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="bg-[#e60000] text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse inline-block"></span>
                      {news.date}
                    </span>
                    <span className="text-white text-[10px] font-bold bg-white/20 px-2 py-1 rounded backdrop-blur-sm">
                      ★ {news.tag}
                    </span>
                  </div>
                  <h3 className="text-white font-black text-[16px] md:text-[18px] leading-snug mb-1">{news.title}</h3>
                  <p className="text-gray-300 text-[12px]">{news.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Arrows */}
          <button
            onClick={() => scroll("left")}
            className="hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white border border-gray-200 rounded-full shadow-md items-center justify-center text-gray-500 hover:bg-gray-50"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <button
            onClick={() => scroll("right")}
            className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-[#e60000] rounded-full shadow-md items-center justify-center text-white hover:bg-[#cc0000]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
