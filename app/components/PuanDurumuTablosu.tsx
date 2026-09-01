"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { publicFetch } from "@/lib/supabase";
import { useCityStore } from "@/app/store/cityStore";
import { motion } from "framer-motion";

type Takim = {
  id: number;
  name: string;
  logo: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goal_difference: number;
  points: number;
};

export default function PuanDurumuTablosu({ mini = false }: { mini?: boolean }) {
  const { selectedCityId } = useCityStore();
  const [takimlar, setTakimlar] = useState<Takim[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    async function takimlariGetir() {
      const data = await publicFetch(
        "teams",
        "select=*&order=points.desc,goal_difference.desc"
      );
      if (data.length > 0) setTakimlar(data);
      setLoading(false);
    }
    takimlariGetir();
  }, [selectedCityId]);

  const skeletons = Array.from({ length: mini ? 4 : 8 });
  const displayTakimlar = mini ? takimlar.slice(0, 4) : takimlar;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  const cityName = selectedCityId === 1 ? "BURSA" : selectedCityId === 2 ? "İSTANBUL" : selectedCityId === 3 ? "İZMİR" : "TÜRKİYE";

  return (
    <div className="w-full">
      {!mini && (
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="section-title">LİG PUAN DURUMU</h2>
          <p className="section-sub mt-2 tracking-[0.3em] font-bold text-[#e50914]">PRO LİG {cityName}</p>
        </div>
      )}

      <div className={`card overflow-hidden p-0 border-0 ${mini ? "" : "shadow-[0_10px_30px_rgba(0,0,0,0.5)]"}`}>
        <div className="w-full overflow-x-auto">
          <div className="min-w-[320px]">
            <div className="sticky top-0 z-20 grid grid-cols-[28px_minmax(100px,1fr)_20px_20px_20px_20px_32px_32px] sm:grid-cols-[40px_minmax(200px,1fr)_40px_40px_40px_40px_50px_50px] gap-1 sm:gap-2 bg-white/95 border-b border-gray-100 backdrop-blur-md border-b border-gray-200 text-gray-500 font-bold text-[10px] sm:text-xs uppercase tracking-wider p-2 sm:p-4 items-center">
              <div className="text-center">S</div>
              <div>TAKIM</div>
              <div className="text-center">O</div>
              <div className="text-center">G</div>
              <div className="text-center">B</div>
              <div className="text-center">M</div>
              <div className="text-center">AV</div>
              <div className="text-center text-gray-900">P</div>
            </div>

            <motion.div 
              className="flex flex-col bg-white"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {loading ? (
                skeletons.map((_, i) => (
                  <div key={i} className="grid grid-cols-[28px_minmax(100px,1fr)_20px_20px_20px_20px_32px_32px] sm:grid-cols-[40px_minmax(200px,1fr)_40px_40px_40px_40px_50px_50px] gap-1 sm:gap-2 items-center border-b border-gray-100 p-2 sm:p-4">
                    <div className="skeleton h-4 sm:h-6 w-full rounded"></div>
                    <div className="flex items-center gap-2">
                      <div className="skeleton w-[24px] h-[24px] sm:w-[40px] sm:h-[40px] rounded-full shrink-0"></div>
                      <div className="skeleton h-4 sm:h-6 w-3/4 rounded"></div>
                    </div>
                    <div className="skeleton h-4 sm:h-6 w-full rounded"></div>
                    <div className="skeleton h-4 sm:h-6 w-full rounded"></div>
                    <div className="skeleton h-4 sm:h-6 w-full rounded"></div>
                    <div className="skeleton h-4 sm:h-6 w-full rounded"></div>
                    <div className="skeleton h-4 sm:h-6 w-full rounded"></div>
                    <div className="skeleton h-6 sm:h-8 w-full rounded"></div>
                  </div>
                ))
              ) : (
                displayTakimlar.map((t, i) => {
                  let rankColor = "text-gray-500";
                  let rowBg = "bg-white";
                  let medal: React.ReactNode = i + 1;
                  
                  if (i === 0) {
                    rankColor = "text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]";
                    rowBg = "bg-gradient-to-r from-yellow-500/10 to-transparent border-l-[3px] border-l-yellow-500";
                    medal = "🥇";
                  } else if (i === 1) {
                    rankColor = "text-gray-600 drop-shadow-[0_0_8px_rgba(209,213,219,0.5)]";
                    rowBg = "bg-gradient-to-r from-gray-400/10 to-transparent border-l-[3px] border-l-gray-300";
                    medal = "🥈";
                  } else if (i === 2) {
                    rankColor = "text-amber-600 drop-shadow-[0_0_8px_rgba(217,119,6,0.5)]";
                    rowBg = "bg-gradient-to-r from-amber-600/10 to-transparent border-l-[3px] border-l-amber-600";
                    medal = "🥉";
                  } else if (i >= takimlar.length - 2 && !mini) {
                    rankColor = "text-[#eab308] drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]";
                    rowBg = "bg-gradient-to-r from-red-500/10 to-transparent border-l-[3px] border-l-red-500";
                  } else {
                    rowBg = "border-l-[3px] border-l-transparent";
                  }

                  return (
                    <motion.div variants={itemVariants} key={t.id} className={`grid grid-cols-[28px_minmax(100px,1fr)_20px_20px_20px_20px_32px_32px] sm:grid-cols-[40px_minmax(200px,1fr)_40px_40px_40px_40px_50px_50px] gap-1 sm:gap-2 items-center ${rowBg} border-b border-gray-100 last:border-b-0 text-gray-900 p-2 sm:p-4 transition-all duration-300 hover:bg-gray-50 group text-[11px] sm:text-sm`}>
                      <div className={`font-black text-[13px] sm:text-lg text-center ${rankColor} transition-transform group-hover:scale-110`}>
                        {medal}
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
                        <div className="relative w-[24px] h-[24px] sm:w-[40px] sm:h-[40px] shrink-0 rounded-full overflow-hidden bg-gray-100 border border-[rgba(255,255,255,0.1)] group-hover:border-[#d4af37]/70 transition-colors flex items-center justify-center shadow-lg">
                          <Image src={t.logo} alt={t.name} fill className="object-contain p-[2px] sm:p-1" />
                        </div>
                        <span className="font-bold text-[11px] sm:text-base leading-tight truncate group-hover:text-[#d4af37] transition-colors">{t.name}</span>
                      </div>
                      <div className="text-center text-gray-500">{t.played}</div>
                      <div className="text-center font-medium text-green-500 drop-shadow-md">{t.won}</div>
                      <div className="text-center font-medium text-gray-500 drop-shadow-md">{t.drawn}</div>
                      <div className="text-center font-medium text-[#eab308] drop-shadow-md">{t.lost}</div>
                      <div className="text-center font-bold text-gray-600">{t.goal_difference > 0 ? `+${t.goal_difference}` : t.goal_difference}</div>
                      <div className="text-center font-black text-[12px] sm:text-base text-gray-900 bg-gradient-to-br from-[#d4af37] to-[#8c7324] rounded-[4px] sm:rounded-md py-1 shadow-[0_0_15px_rgba(212,175,55,0.3)]">{t.points}</div>
                    </motion.div>
                  );
                })
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
