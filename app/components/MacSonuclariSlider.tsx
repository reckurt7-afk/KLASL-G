"use client";

import { useRef, useEffect, useState } from "react";
import { useCityStore } from "@/app/store/cityStore";
import { publicFetch, supabase } from "../../lib/supabase";
import { TeamLogo } from "./TeamLogo";

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
    const data = await publicFetch(
      "maclar",
      "select=id,hafta,ev_sahibi,deplasman,ev_skor,dep_skor,oynandi,tarih,saat,canli,durum,dakika&or=(oynandi.eq.true,canli.eq.true)&order=canli.desc,hafta.desc,id.desc&limit=20"
    );
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
      <div className="w-full bg-white py-3 border-b border-gray-100">
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
    <div className="w-full bg-white py-3 border-b border-gray-100">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6">
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto snap-x snap-mandatory"
          style={{ scrollbarWidth: "none" }}
        >
          {maclar.map((match: any) => {
            const dateStr = match.tarih
              ? new Date(match.tarih).toLocaleDateString("tr-TR", { day: "numeric", month: "short" }) + (match.saat ? ` ${match.saat}` : "")
              : match.saat || "";

            return (
              <div
                key={match.id}
                className={`min-w-[210px] sm:min-w-[240px] border ${
                  match.canli ? "border-[#e50914] bg-red-50/10 shadow-[0_4px_12px_rgba(229,9,20,0.1)]" : "border-gray-200 bg-white"
                } rounded-xl p-3 shrink-0 snap-start hover:shadow-md transition-shadow cursor-pointer flex flex-col`}
              >
                {/* Header (Date & Status) */}
                <div className="flex justify-between items-center mb-2.5">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    {dateStr}
                  </span>
                  {match.canli ? (
                    <span className="text-[10px] font-black text-[#e50914] flex items-center gap-1.5 bg-red-50 px-2 py-0.5 rounded">
                      <span className="w-1.5 h-1.5 bg-[#e50914] rounded-full animate-ping"></span>
                      {match.dakika ? `${match.dakika}'` : 'CANLI'}
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-gray-400">
                      {match.durum === "Devre Arası" ? "İY" : "MS"}
                    </span>
                  )}
                </div>

                {/* Teams Layout (Vertical) */}
                <div className="flex flex-col gap-2 flex-1">
                  {/* Home Team Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <TeamLogo name={match.ev_sahibi} logoMap={logoMap} />
                      <span className={`text-[12px] font-semibold truncate ${match.canli ? 'text-gray-900' : 'text-gray-700'}`}>
                        {match.ev_sahibi}
                      </span>
                    </div>
                    <span className={`text-[15px] font-black w-6 text-center ${match.canli ? 'text-[#e50914]' : 'text-gray-900'}`}>
                      {match.ev_skor ?? "-"}
                    </span>
                  </div>
                  
                  {/* Away Team Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <TeamLogo name={match.deplasman} logoMap={logoMap} />
                      <span className={`text-[12px] font-semibold truncate ${match.canli ? 'text-gray-900' : 'text-gray-700'}`}>
                        {match.deplasman}
                      </span>
                    </div>
                    <span className={`text-[15px] font-black w-6 text-center ${match.canli ? 'text-[#e50914]' : 'text-gray-900'}`}>
                      {match.dep_skor ?? "-"}
                    </span>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-3 pt-2 border-t border-gray-100 flex justify-between items-center text-[10px]">
                  <span className="text-gray-400 font-medium">
                    Klas Lig • {match.hafta}. Hafta
                  </span>
                  {match.saha && (
                    <span className="text-gray-400 font-medium truncate max-w-[80px] text-right">
                      {match.saha}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}


