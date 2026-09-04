"use client";

import { useEffect, useRef, useState } from "react";
import { useCityStore } from "../store/cityStore";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

export default function CityStoryBar() {
  const { selectedCityId, setSelectedCityId } = useCityStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [cities, setCities] = useState<any[]>([]);

  useEffect(() => {
    async function fetchCities() {
      const { data } = await supabase.from("cities").select("*").order("id", { ascending: true });
      if (data) {
          // Özel Sıralama: ID 8'i (4. Sezon) ikinci sıraya (index 1) al
          
          const sorted = [...data];
          
          // 1. Karacabey'i en başa (1. sıraya) al
          const indexKaracabey = sorted.findIndex(c => c.name && c.name.toLowerCase().includes("karacabey"));
          if (indexKaracabey > -1) {
             const itemKaracabey = sorted.splice(indexKaracabey, 1)[0];
             sorted.unshift(itemKaracabey);
          }

          // 2. ID 8'i (4. Sezon vb) 2. sıraya (index 1) al
          const index8 = sorted.findIndex(c => c.id === 8);
          if (index8 > -1) {
             const item8 = sorted.splice(index8, 1)[0];
             sorted.splice(1, 0, item8);
          }

          setCities(sorted);
          if (!selectedCityId && sorted.length > 0) {
            setSelectedCityId(sorted[0].id);
          }
        }
    }
    fetchCities();
  }, []);

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === "right" ? 240 : -240, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full bg-white border-b border-gray-100 py-4 relative">
      {/* Left Arrow */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-1 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-white border border-gray-200 rounded-full shadow-md flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
        aria-label="Sola kaydır"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>

      {/* Right Arrow */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-1 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-[#ceaa52] rounded-full shadow-md flex items-center justify-center text-white hover:bg-[#9e1b22] transition-colors"
        aria-label="Sağa kaydır"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>

      {/* Scrollable Row */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto hide-scrollbar snap-x snap-mandatory px-10"
        style={{ scrollbarWidth: "none" }}
      >
        {cities.map((city) => {
          const isSelected = selectedCityId === city.id;
          return (
            <div
              key={city.id}
              className="flex flex-col items-center gap-1.5 snap-start shrink-0 cursor-pointer"
              onClick={() => setSelectedCityId(city.id)}
            >
              {/* Card */}
              <div
                className={`w-[135px] h-[105px] md:w-[145px] md:h-[110px] rounded-2xl flex flex-col items-center justify-center gap-1 transition-all border-2 ${
                  isSelected
                    ? "border-[#ceaa52] bg-red-50 shadow-md"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                }`}
              >
                <div className="w-10 h-10 md:w-11 md:h-11 relative">
                  <Image src="/icons/prime-logo.jpg" alt={city.name} fill className="rounded-full object-cover scale-[1.4] drop-shadow-sm" />
                </div>
                <span className={`text-[11px] md:text-[12px] font-black leading-snug text-center break-words w-full px-2 ${isSelected ? "text-[#ceaa52]" : "text-gray-700"}`}>
                  {city.name}
                </span>
                <span className="text-[9px] md:text-[10px] tracking-widest text-gray-400 font-bold whitespace-nowrap overflow-hidden text-ellipsis w-full text-center px-1">
                  {city.status === 'AKTIF' ? 'AKTİF' : 'BEKLEMEDE'}
                </span>
              </div>
              {/* Heart */}
              <button className="text-gray-300 hover:text-[#eab308] transition-colors" aria-label="Favori">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

