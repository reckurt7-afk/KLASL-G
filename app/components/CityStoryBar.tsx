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
              className="flex flex-col items-center gap-1.5 snap-start shrink-0 cursor-pointer group"
              onClick={() => setSelectedCityId(city.id)}
            >
              {/* Card - Pill Design */}
              <div
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full transition-all duration-300 border-2 ${
                  isSelected
                    ? "border-[#e60000] bg-gradient-to-r from-red-50 to-white shadow-[0_4px_12px_rgba(230,0,0,0.12)] scale-[1.02]"
                    : "border-gray-100 bg-white hover:bg-gray-50 hover:border-gray-200"
                }`}
              >
                <div className={`w-7 h-7 relative shrink-0 ${isSelected ? "scale-110" : "grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100"} transition-all duration-300`}>
                  <Image src="/icons/logo.png" alt={city.name} fill className="object-contain" />
                </div>
                <div className="flex flex-col justify-center">
                  <span className={`text-[13px] md:text-[14px] font-black leading-none tracking-tight ${isSelected ? "text-[#e60000]" : "text-gray-700"}`}>
                    {city.name}
                  </span>
                  {isSelected && (
                    <span className="text-[9px] text-[#e60000]/70 font-bold mt-1 tracking-wider uppercase">
                      {city.status === 'AKTIF' ? 'AKTİF' : 'BEKLEMEDE'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

