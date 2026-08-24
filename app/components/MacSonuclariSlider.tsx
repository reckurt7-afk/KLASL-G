"use client";

import { useRef, useEffect, useState } from "react";
import { useCityStore } from "@/app/store/cityStore";
import { publicFetch, supabase } from "../../lib/supabase";
import { TeamLogo } from "./TeamLogo";

type Mac = {
  id: number;
  canli?: boolean;
  durum?: string;
  hafta: number;
  ev_sahibi: string;
  deplasman: string;
  ev_skor: number | null;
  dep_skor: number | null;
  oynandi: boolean;
  tarih: string | null;
  saat: string | null;
};

type TeamMap = Record<string, string>; // name -> logo path

export default function MacSonuclariSlider() {
  const { selectedCityId } = useCityStore();

  const scrollRef = useRef<HTMLDivElement>(null);
  const [maclar, setMaclar] = useState<Mac[]>([]);
  const [logoMap, setLogoMap] = useState<TeamMap>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([loadMatches(), loadTeams()]).finally(() => setLoading(false));
  }, [selectedCityId]);

  async function loadMatches() {
    // Try played/live first, fallback to any recent matches with scores
    let data = await publicFetch(
      "maclar",
      "select=id,hafta,ev_sahibi,deplasman,ev_skor,dep_skor,oynandi,tarih,saat,canli,durum,dakika&or=(oynandi.eq.true,canli.eq.true)&order=canli.desc,hafta.desc,id.desc&limit=20"
    );
    // Fallback: show any matches that have scores
    if (!data || data.length === 0) {
      data = await publicFetch(
        "maclar",
        "select=id,hafta,ev_sahibi,deplasman,ev_skor,dep_skor,oynandi,tarih,saat,canli,durum,dakika&ev_skor=not.is.null&order=hafta.desc,id.desc&limit=20"
      );
    }
    setMaclar(data || []);
  }

  async function loadTeams() {
    const data = await publicFetch("takimlar", "select=ad,logo");
    const map: TeamMap = {};
    for (const t of data || []) {
      if (t.ad && t.logo) map[t.ad] = t.logo;
    }
    setLogoMap(map);
  }

  useEffect(() => {
    const channel = supabase
      .channel("slider-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "maclar" }, () => {
        loadMatches();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return (
      <div className="w-full bg-white py-8">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6 flex gap-3 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="min-w-[240px] h-[110px] border border-gray-100 rounded-xl bg-gray-50 animate-pulse shrink-0" />
          ))}
        </div>
      </div>
    );
  }

  if (maclar.length === 0) return null;

  return (
    <div className="w-full bg-white py-4">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6">
        <div
          ref={scrollRef}
          
          className="flex gap-5 overflow-x-auto snap-x snap-mandatory px-0 pb-4 pt-2"
          style={{ scrollbarWidth: "none" }}
        >
          {maclar.map((match) => {
            let dateStr = "";
            if (match.tarih) {
              const parts = match.tarih.includes('/') ? match.tarih.split('/') : match.tarih.includes('.') ? match.tarih.split('.') : null;
              if (parts && parts.length === 3) {
                const d = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
                if (!isNaN(d.getTime())) {
                  dateStr = d.toLocaleDateString("tr-TR", { day: "numeric", month: "long" });
                  if (match.saat) dateStr += ' ' + match.saat.slice(0, 5);
                }
              } else {
                dateStr = match.tarih;
              }
            }
            return (
              <div
                key={match.id}
                className={`min-w-[85vw] sm:min-w-[300px] md:min-w-[320px] bg-white rounded-2xl p-5 shrink-0 snap-start shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-gray-100 hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 cursor-pointer relative overflow-hidden`}
              >
                {/* Top decorative line */}
                <div className={`absolute top-0 left-0 right-0 h-[4px] ${["bg-red-500", "bg-blue-500", "bg-green-500", "bg-purple-500", "bg-orange-500"][match.id % 5]}`}></div>
                
                {/* Header (Status & Date) */}
                <div className="flex items-center justify-between mb-4">
                  {match.canli ? (
                    <span className="text-[11px] font-black text-white bg-red-600 px-2.5 py-1 rounded-md animate-pulse shadow-[0_0_8px_rgba(220,38,38,0.6)] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                      CANLI
                    </span>
                  ) : match.durum === 'Ertelendi' ? (
                    <span className="text-[11px] font-black text-white bg-orange-500 px-2.5 py-1 rounded-md">
                      ERTELENDİ
                    </span>
                  ) : (
                    <span className="text-[11px] font-black text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md">
                      {match.durum === 'Bitti' ? 'Maç Sonucu' : 'Yaklaşıyor'}
                    </span>
                  )}
                  <span className="text-[11px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-md">{dateStr}</span>
                </div>

                {/* Teams & Score */}
                <div className="flex items-center justify-between">
                  {/* Home Team */}
                  <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
                    <div className="w-12 h-12 relative flex items-center justify-center p-1 bg-gray-50 rounded-full border border-gray-100">
                      <TeamLogo name={match.ev_sahibi} logoMap={logoMap} />
                    </div>
                    <span className="text-[11px] md:text-[12px] font-black text-gray-800 text-center leading-tight truncate w-full px-1">
                      {match.ev_sahibi}
                    </span>
                  </div>

                  {/* Score */}
                  <div className="flex items-center gap-2 px-3 shrink-0">
                    <span className={`text-[28px] font-black leading-none tracking-tighter ${match.canli ? 'text-red-600' : 'text-[#1a1a2e]'}`}>{match.ev_skor ?? 0}</span>
                    <span className="text-gray-300 font-black text-[18px] mb-1">-</span>
                    <span className={`text-[28px] font-black leading-none tracking-tighter ${match.canli ? 'text-red-600' : 'text-[#1a1a2e]'}`}>{match.dep_skor ?? 0}</span>
                  </div>

                  {/* Away Team */}
                  <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
                    <div className="w-12 h-12 relative flex items-center justify-center p-1 bg-gray-50 rounded-full border border-gray-100">
                      <TeamLogo name={match.deplasman} logoMap={logoMap} />
                    </div>
                    <span className="text-[11px] md:text-[12px] font-black text-gray-800 text-center leading-tight truncate w-full px-1">
                      {match.deplasman}
                    </span>
                  </div>
                </div>

                {/* Footer (League & Week) */}
                <div className="text-[10px] font-black mt-4 text-center border-t border-gray-100 pt-2 flex justify-center items-center gap-1.5 uppercase tracking-wide">
                  {match.canli && <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></div>}
                  <span className={match.canli ? "text-red-500" : "text-gray-400"}>Klas Lig • {match.hafta}. HAFTA</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );






}