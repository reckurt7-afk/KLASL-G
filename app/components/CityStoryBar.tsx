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
        setCities(data);
        // Eğer seçili şehir yoksa veya listede yoksa, varsayılan olarak Bursa'yı (1) veya ilk şehri seç
        if (!selectedCityId && data.length > 0) {
          setSelectedCityId(data[0].id);
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
        className="absolute right-1 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-[#e60000] rounded-full shadow-md flex items-center justify-center text-white hover:bg-[#cc0000] transition-colors"
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
                className={`w-[130px] h-[56px] rounded-xl flex items-center justify-start px-3 gap-2 transition-all border ${
                  isSelected
                    ? "border-[#e50914] bg-red-50/30 shadow-[0_2px_10px_rgba(229,9,20,0.1)]"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                }`}
              >
                <div className="w-7 h-7 relative shrink-0">
                  <Image src="/icons/logo.png" alt={city.name} fill className="object-contain" />
                </div>
                <div className="flex flex-col justify-center overflow-hidden">
                  <span className={`text-[12px] font-black leading-none truncate ${isSelected ? "text-[#e50914]" : "text-gray-800"}`}>
                    {city.name}
                  </span>
                  <span className="text-[9px] text-gray-400 font-bold tracking-wider mt-0.5">
                    {city.status === 'AKTIF' ? 'AKTİF' : 'YAKINDA'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
