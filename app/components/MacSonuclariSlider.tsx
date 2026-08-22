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
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory"
          style={{ scrollbarWidth: "none" }}
        >
          {maclar.map((match: any) => {
            const dateStr = match.tarih
              ? new Date(match.tarih).toLocaleDateString("tr-TR", { day: "numeric", month: "short" }) + (match.saat ? ` ${match.saat}` : "")
              : match.saat || "";

            return (
              <div
                key={match.id}
                className={`min-w-[240px] border ${match.canli ? 'border-red-500 bg-red-50/30' : 'border-gray-100 bg-white'} rounded-xl p-3 shrink-0 snap-start shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer`}
              >
                {/* Status & Date */}
                <div className="flex items-center justify-between mb-2">
                  {match.canli ? (
                    <span className="text-[10px] font-bold text-white bg-red-600 px-2 py-0.5 rounded animate-pulse shadow-[0_0_8px_rgba(220,38,38,0.6)]">
                      CANLI {match.dakika ? `${match.dakika}'` : ''}
                    </span>
                  ) : match.durum === "Devre Arası" ? (
                    <span className="text-[10px] font-bold text-white bg-orange-500 px-2 py-0.5 rounded">
                      DEVRE ARASI
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                      Bitti
                    </span>
                  )}
                  <span className="text-[10px] font-medium text-gray-400">{dateStr}</span>
                </div>

                {/* Teams */}
                <div className="flex items-center justify-between">
                  {/* Home */}
                  <div className="flex flex-col items-center gap-1 flex-1 min-w-0">
                    <TeamLogo name={match.ev_sahibi} logoMap={logoMap} />
                    <span className="text-[10px] font-bold text-gray-700 text-center leading-tight line-clamp-2 w-full px-1">
                      {match.ev_sahibi}
                    </span>
                  </div>

                  {/* Score */}
                  <div className="flex items-center gap-1.5 px-2 shrink-0">
                    <span className={`text-[22px] font-black leading-none ${match.canli ? 'text-red-600' : 'text-[#e60000]'}`}>{match.ev_skor ?? 0}</span>
                    <span className="text-gray-300 font-bold">-</span>
                    <span className={`text-[22px] font-black leading-none ${match.canli ? 'text-red-600' : 'text-gray-800'}`}>{match.dep_skor ?? 0}</span>
                  </div>

                  {/* Away */}
                  <div className="flex flex-col items-center gap-1 flex-1 min-w-0">
                    <TeamLogo name={match.deplasman} logoMap={logoMap} />
                    <span className="text-[10px] font-bold text-gray-700 text-center leading-tight line-clamp-2 w-full px-1">
                      {match.deplasman}
                    </span>
                  </div>
                </div>

                {/* Footer */}
                <div className="text-[9px] font-bold mt-2 text-center border-t border-gray-100 pt-1.5 flex justify-center items-center gap-1">
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



