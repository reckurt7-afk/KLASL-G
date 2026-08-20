"use client";

import { useRef } from "react";
import { useCityStore } from "../store/cityStore";
import Image from "next/image";

const MOCK_CITIES = [
  { id: 1, name: "İstanbul", teams: 18, players: 419 },
  { id: 2, name: "Bursa", teams: 21, players: 279 },
  { id: 3, name: "İzmir", teams: 14, players: 147 },
  { id: 4, name: "Antalya", teams: 22, players: 321 },
  { id: 5, name: "Ankara", teams: 45, players: 880 },
  { id: 6, name: "Gaziantep", teams: 34, players: 413 },
  { id: 7, name: "Mersin", teams: 110, players: 1617 },
  { id: 8, name: "Kocaeli", teams: 37, players: 590 },
  { id: 9, name: "Trabzon", teams: 85, players: 1006 },
  { id: 10, name: "Samsun", teams: 28, players: 512 },
  { id: 11, name: "Konya", teams: 19, players: 310 },
  { id: 12, name: "Adana", teams: 26, players: 395 },
];

export default function CityStoryBar() {
  const { selectedCityId, setSelectedCityId } = useCityStore();
  const scrollRef = useRef<HTMLDivElement>(null);

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
        {MOCK_CITIES.map((city) => {
          const isSelected = selectedCityId === city.id;
          return (
            <div
              key={city.id}
              className="flex flex-col items-center gap-1.5 snap-start shrink-0 cursor-pointer"
              onClick={() => setSelectedCityId(city.id)}
            >
              {/* Card */}
              <div
                className={`w-[100px] h-[80px] rounded-2xl flex flex-col items-center justify-center gap-1 transition-all border-2 ${
                  isSelected
                    ? "border-[#3b5bdb] bg-[#eef2ff] shadow-md"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                }`}
              >
                <div className="w-8 h-8 relative">
                  <Image src="/icons/logo.png" alt={city.name} fill className="object-contain" />
                </div>
                <span className={`text-[11px] font-bold leading-tight text-center ${isSelected ? "text-[#3b5bdb]" : "text-gray-700"}`}>
                  {city.name}
                </span>
                <span className="text-[9px] text-gray-400 font-medium">
                  O:{city.teams}&nbsp;
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="inline-block"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  {city.players}
                </span>
              </div>
              {/* Heart */}
              <button className="text-gray-300 hover:text-red-500 transition-colors" aria-label="Favori">
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
