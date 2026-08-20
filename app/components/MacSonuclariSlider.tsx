"use client";

import { useRef, useEffect, useState } from "react";
import { publicFetch } from "../../lib/supabase";

type Mac = {
  id: number;
  hafta: number;
  ev_sahibi: string;
  deplasman: string;
  ev_skor: number | null;
  dep_skor: number | null;
  oynandi: boolean;
  tarih: string | null;
  saat: string | null;
  home_team?: { logo_url?: string };
  away_team?: { logo_url?: string };
};

export default function MacSonuclariSlider() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [maclar, setMaclar] = useState<Mac[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMatches();
  }, []);

  async function loadMatches() {
    try {
      // Oynanan son maçları getir (desc hafta ile en son haftalar önce)
      const data = await publicFetch(
        "maclar",
        "select=id,hafta,ev_sahibi,deplasman,ev_skor,dep_skor,oynandi,tarih,saat&oynandi=eq.true&order=hafta.desc,id.desc&limit=20"
      );
      setMaclar(data || []);
    } catch {
      setMaclar([]);
    } finally {
      setLoading(false);
    }
  }

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === "right" ? 260 : -260, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="w-full bg-white py-3 border-b border-gray-100">
        <div className="max-w-[1600px] mx-auto px-4 flex gap-3 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="min-w-[240px] h-[110px] border border-gray-100 rounded-xl bg-gray-50 animate-pulse shrink-0" />
          ))}
        </div>
      </div>
    );
  }

  // Fallback: eğer henüz hiç maç oynanmamışsa yaklaşan maçları göster
  if (maclar.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-white py-3 border-b border-gray-100">
      <div className="max-w-[1600px] mx-auto px-4 relative">
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {maclar.map((match) => {
            const dateStr = match.tarih
              ? new Date(match.tarih).toLocaleDateString("tr-TR", { day: "numeric", month: "kısa" as any }) + (match.saat ? ` ${match.saat}` : "")
              : match.saat || "";
            return (
              <div
                key={match.id}
                className="min-w-[240px] border border-gray-100 rounded-xl bg-white p-3 shrink-0 snap-start shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                {/* Status & Date */}
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">Bitti</span>
                  <span className="text-[10px] font-medium text-gray-400">{dateStr}</span>
                </div>

                {/* Teams */}
                <div className="flex items-center justify-between">
                  {/* Home */}
                  <div className="flex flex-col items-center gap-1 flex-1 min-w-0">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    </div>
                    <span className="text-[10px] font-bold text-gray-700 text-center leading-tight line-clamp-2 w-full px-1">
                      {match.ev_sahibi}
                    </span>
                  </div>

                  {/* Score */}
                  <div className="flex items-center gap-2 px-3 shrink-0">
                    <span className="text-[22px] font-black text-[#e60000] leading-none">{match.ev_skor ?? 0}</span>
                    <span className="text-gray-300 font-bold">–</span>
                    <span className="text-[22px] font-black text-gray-800 leading-none">{match.dep_skor ?? 0}</span>
                  </div>

                  {/* Away */}
                  <div className="flex flex-col items-center gap-1 flex-1 min-w-0">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    </div>
                    <span className="text-[10px] font-bold text-gray-700 text-center leading-tight line-clamp-2 w-full px-1">
                      {match.deplasman}
                    </span>
                  </div>
                </div>

                {/* Footer */}
                <div className="text-[9px] text-gray-400 font-bold mt-2.5 text-center border-t border-gray-100 pt-1.5">
                  Klas Lig • {match.hafta}. HAFTA
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
