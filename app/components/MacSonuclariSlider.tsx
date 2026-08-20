"use client";

import { useRef } from "react";
import Image from "next/image";

const MOCK_MATCHES = [
  { id: 1, teamA: "YENİLMEZ AR.", teamB: "SÜRÜCÜ", logoA: "/icons/logo.png", logoB: "/icons/logo.png", scoreA: 3, scoreB: 0, status: "Bitti", date: "6 Ara 22:00", week: "17. HAFTA" },
  { id: 2, teamA: "KOMODOR FC", teamB: "VİCTHİA SİG.", logoA: "/icons/logo.png", logoB: "/icons/logo.png", scoreA: 3, scoreB: 0, status: "Bitti", date: "29 Kas 22:00", week: "17. HAFTA" },
  { id: 3, teamA: "HARBİ MİLAN", teamB: "KARADENİZ FC", logoA: "/icons/logo.png", logoB: "/icons/logo.png", scoreA: 12, scoreB: 2, status: "Bitti", date: "29 Kas 22:00", week: "17. HAFTA" },
  { id: 4, teamA: "EVA İNŞAAT", teamB: "ANADOLU AS.", logoA: "/icons/logo.png", logoB: "/icons/logo.png", scoreA: 0, scoreB: 3, status: "Bitti", date: "29 Kas 22:00", week: "17. HAFTA" },
  { id: 5, teamA: "AMSTERDAM FC", teamB: "ALTINKÖY", logoA: "/icons/logo.png", logoB: "/icons/logo.png", scoreA: 0, scoreB: 3, status: "Bitti", date: "29 Kas 22:00", week: "17. HAFTA" },
  { id: 6, teamA: "DARICILI MAT.", teamB: "KARATEKİR D.", logoA: "/icons/logo.png", logoB: "/icons/logo.png", scoreA: 3, scoreB: 0, status: "Bitti", date: "29 Kas 22:00", week: "17. HAFTA" },
];

export default function MacSonuclariSlider() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === "right" ? 280 : -280, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full bg-white py-3 border-b border-gray-100">
      <div className="max-w-[1600px] mx-auto px-4 relative">
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto hide-scrollbar snap-x snap-mandatory"
          style={{ scrollbarWidth: "none" }}
        >
          {MOCK_MATCHES.map((match) => (
            <div
              key={match.id}
              className="min-w-[240px] border border-gray-100 rounded-xl bg-white p-3 shrink-0 snap-start shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              {/* Status & Date */}
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{match.status}</span>
                <span className="text-[10px] font-medium text-gray-400">{match.date}</span>
              </div>

              {/* Teams */}
              <div className="flex items-center justify-between">
                {/* Home */}
                <div className="flex flex-col items-center gap-1 w-[75px]">
                  <div className="w-8 h-8 relative">
                    <Image src={match.logoA} alt={match.teamA} fill className="object-contain" />
                  </div>
                  <span className="text-[10px] font-bold text-gray-700 text-center leading-tight line-clamp-2">{match.teamA}</span>
                </div>

                {/* Score */}
                <div className="flex items-center gap-2 px-2">
                  <span className="text-[22px] font-black text-[#e60000] leading-none">{match.scoreA}</span>
                  <span className="text-gray-300 font-bold text-lg">-</span>
                  <span className="text-[22px] font-black text-gray-800 leading-none">{match.scoreB}</span>
                </div>

                {/* Away */}
                <div className="flex flex-col items-center gap-1 w-[75px]">
                  <div className="w-8 h-8 relative">
                    <Image src={match.logoB} alt={match.teamB} fill className="object-contain" />
                  </div>
                  <span className="text-[10px] font-bold text-gray-700 text-center leading-tight line-clamp-2">{match.teamB}</span>
                </div>
              </div>

              {/* Footer */}
              <div className="text-[9px] text-gray-400 font-bold mt-2.5 text-center border-t border-gray-100 pt-1.5">
                Klas Lig Bursa • {match.week}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
