"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { publicFetch } from "@/lib/supabase";
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
  const [takimlar, setTakimlar] = useState<Takim[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function takimlariGetir() {
      const data = await publicFetch(
        "teams",
        "select=*&order=points.desc,goal_difference.desc"
      );
      if (data.length > 0) setTakimlar(data);
      setLoading(false);
    }
    takimlariGetir();
  }, []);

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

  return (
    <div className="w-full">
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="section-title">🏆 PUAN DURUMU</h2>
        <p className="section-sub mt-2 tracking-[0.3em] font-bold text-[#ff3131]">KLAS LİG BURSA</p>
      </div>

      <div className="card overflow-hidden p-0 border-0 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <div className="w-full overflow-x-auto">
          <div className="min-w-[320px]">
            <div className="sticky top-0 z-20 grid grid-cols-[28px_minmax(100px,1fr)_20px_20px_20px_20px_32px_32px] sm:grid-cols-[40px_minmax(200px,1fr)_40px_40px_40px_40px_50px_50px] gap-1 sm:gap-2 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-[rgba(255,255,255,0.07)] text-gray-400 font-bold text-[10px] sm:text-xs uppercase tracking-wider p-2 sm:p-4 items-center">
              <div className="text-center">S</div>
              <div>TAKIM</div>
              <div className="text-center">O</div>
              <div className="text-center">G</div>
              <div className="text-center">B</div>
              <div className="text-center">M</div>
              <div className="text-center">AV</div>
              <div className="text-center text-white">P</div>
            </div>

            <motion.div 
              className="flex flex-col bg-transparent"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {loading ? (
                skeletons.map((_, i) => (
                  <div key={i} className="grid grid-cols-[28px_minmax(100px,1fr)_20px_20px_20px_20px_32px_32px] sm:grid-cols-[40px_minmax(200px,1fr)_40px_40px_40px_40px_50px_50px] gap-1 sm:gap-2 items-center border-b border-[rgba(255,255,255,0.03)] p-2 sm:p-4">
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
                  let rowBg = "bg-transparent";
                  let medal: React.ReactNode = i + 1;
                  
                  if (i === 0) {
                    rankColor = "text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]";
                    rowBg = "bg-gradient-to-r from-yellow-500/10 to-transparent border-l-[3px] border-l-yellow-500";
                    medal = "🥇";
                  } else if (i === 1) {
                    rankColor = "text-gray-300 drop-shadow-[0_0_8px_rgba(209,213,219,0.5)]";
                    rowBg = "bg-gradient-to-r from-gray-400/10 to-transparent border-l-[3px] border-l-gray-300";
                    medal = "🥈";
                  } else if (i === 2) {
                    rankColor = "text-amber-600 drop-shadow-[0_0_8px_rgba(217,119,6,0.5)]";
                    rowBg = "bg-gradient-to-r from-amber-600/10 to-transparent border-l-[3px] border-l-amber-600";
                    medal = "🥉";
                  } else if (i >= takimlar.length - 2 && !mini) {
                    rankColor = "text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]";
                    rowBg = "bg-gradient-to-r from-red-500/10 to-transparent border-l-[3px] border-l-red-500";
                  } else {
                    rowBg = "border-l-[3px] border-l-transparent";
                  }

                  return (
                    <motion.div variants={itemVariants} key={t.id} className={`grid grid-cols-[28px_minmax(100px,1fr)_20px_20px_20px_20px_32px_32px] sm:grid-cols-[40px_minmax(200px,1fr)_40px_40px_40px_40px_50px_50px] gap-1 sm:gap-2 items-center ${rowBg} border-b border-[rgba(255,255,255,0.03)] last:border-b-0 text-white p-2 sm:p-4 transition-all duration-300 hover:bg-white/[0.04] group text-[11px] sm:text-sm`}>
                      <div className={`font-black text-[13px] sm:text-lg text-center ${rankColor} transition-transform group-hover:scale-110`}>
                        {medal}
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
                        <div className="relative w-[24px] h-[24px] sm:w-[40px] sm:h-[40px] shrink-0 rounded-full overflow-hidden bg-[#070707] border border-[rgba(255,255,255,0.1)] group-hover:border-[#ff3131]/70 transition-colors flex items-center justify-center shadow-lg">
                          <Image src={t.logo} alt={t.name} fill className="object-contain p-[2px] sm:p-1" />
                        </div>
                        <span className="font-bold text-[11px] sm:text-base leading-tight truncate group-hover:text-[#ff3131] transition-colors">{t.name}</span>
                      </div>
                      <div className="text-center text-gray-400">{t.played}</div>
                      <div className="text-center font-medium text-green-500 drop-shadow-md">{t.won}</div>
                      <div className="text-center font-medium text-gray-500 drop-shadow-md">{t.drawn}</div>
                      <div className="text-center font-medium text-red-500 drop-shadow-md">{t.lost}</div>
                      <div className="text-center font-bold text-gray-300">{t.goal_difference > 0 ? `+${t.goal_difference}` : t.goal_difference}</div>
                      <div className="text-center font-black text-[12px] sm:text-base text-white bg-gradient-to-br from-[#ff3131] to-[#a11212] rounded-[4px] sm:rounded-md py-1 shadow-[0_0_15px_rgba(255,49,49,0.3)]">{t.points}</div>
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
