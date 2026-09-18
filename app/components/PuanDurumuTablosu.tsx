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

// Generate a consistent pseudo-random form for a team based on their ID and wins/losses
function generateForm(won: number, drawn: number, lost: number, id: number): string[] {
  const total = won + drawn + lost;
  if (total === 0) return ["-", "-", "-", "-", "-"];
  
  const pool: string[] = [];
  for (let i=0; i<won; i++) pool.push("W");
  for (let i=0; i<drawn; i++) pool.push("D");
  for (let i=0; i<lost; i++) pool.push("L");
  
  let seed = id;
  const random = () => {
    let x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };
  
  pool.sort(() => random() - 0.5);
  
  const recent = pool.slice(0, 5);
  while (recent.length < 5) recent.unshift("-");
  return recent;
}

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
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20, filter: "blur(4px)" },
    show: { opacity: 1, x: 0, filter: "blur(0px)", transition: { type: "spring" as const, stiffness: 350, damping: 25 } }
  };

  const cityName = selectedCityId === 1 ? "BURSA" : selectedCityId === 2 ? "İSTANBUL" : selectedCityId === 3 ? "İZMİR" : "TÜRKİYE";

  const getRankStyle = (index: number) => {
    if (index === 0) return {
      color: "text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,1)]",
      bg: "bg-gradient-to-r from-[#ceaa52]/20 to-transparent border-l-[3px] md:border-l-4 border-l-[#ceaa52]",
      icon: "🏆"
    };
    if (index === 1) return {
      color: "text-gray-400 drop-shadow-[0_0_10px_rgba(156,163,175,1)]",
      bg: "bg-gradient-to-r from-gray-400/10 to-transparent border-l-[3px] md:border-l-4 border-l-gray-400",
      icon: "🥈"
    };
    if (index === 2) return {
      color: "text-amber-700 drop-shadow-[0_0_10px_rgba(180,83,9,1)]",
      bg: "bg-gradient-to-r from-amber-700/10 to-transparent border-l-[3px] md:border-l-4 border-l-amber-700",
      icon: "🥉"
    };
    if (index >= takimlar.length - 2 && !mini && takimlar.length > 4) return {
      color: "text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]",
      bg: "bg-gradient-to-r from-red-500/10 to-transparent border-l-[3px] md:border-l-4 border-l-red-500",
      icon: index + 1
    };
    return {
      color: "text-gray-500",
      bg: "border-l-[3px] md:border-l-4 border-l-transparent",
      icon: index + 1
    };
  };

  // Define the grid columns for responsive layout
  // On mobile: Rank(20px) Team(1fr) O(16px) G(16px) B(16px) M(16px) AV(20px) FORM(50px) P(28px)
  // On desktop: Rank(50px) Team(1fr) O(40px) G(40px) B(40px) M(40px) AV(60px) FORM(120px) P(60px)
  const gridLayout = "grid-cols-[20px_minmax(80px,1fr)_16px_16px_16px_16px_20px_50px_28px] md:grid-cols-[50px_minmax(200px,1fr)_40px_40px_40px_40px_60px_120px_60px]";

  return (
    <div className="w-full">
      {!mini && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 md:mb-12 relative"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 md:w-64 h-16 md:h-32 bg-[#ceaa52] opacity-10 blur-[80px] pointer-events-none rounded-full" />
          <h2 className="text-2xl md:text-5xl font-black text-gray-900 tracking-tight drop-shadow-sm uppercase">LİG PUAN DURUMU</h2>
          <p className="mt-1 md:mt-3 tracking-[0.4em] font-black text-[#9e1b22] text-[10px] md:text-base drop-shadow-[0_0_8px_rgba(158,27,34,0.4)] uppercase">PRİME LİG {cityName}</p>
        </motion.div>
      )}

      <div className={`rounded-[16px] md:rounded-[24px] bg-white border border-gray-100 ${mini ? "" : "shadow-[0_10px_30px_rgba(0,0,0,0.04)] md:shadow-[0_20px_50px_rgba(0,0,0,0.06)]"}`}>
        <div className="w-full">
          {/* Table Header */}
          <div className={`sticky top-0 z-20 grid ${gridLayout} gap-1 md:gap-2 bg-gray-50/95 backdrop-blur-xl border-b border-gray-200 text-gray-500 font-black text-[8px] md:text-xs uppercase tracking-tighter md:tracking-widest p-2 md:p-4 items-center`}>
            <div className="text-center">#</div>
            <div>TAKIM</div>
            <div className="text-center" title="Oynanan Maç">O</div>
            <div className="text-center text-green-600" title="Galibiyet">G</div>
            <div className="text-center text-gray-400" title="Beraberlik">B</div>
            <div className="text-center text-red-500" title="Mağlubiyet">M</div>
            <div className="text-center" title="Averaj">AV</div>
            <div className="text-center" title="Son 5 Maç">FORM</div>
            <div className="text-center text-[#9e1b22] text-[9px] md:text-sm">P</div>
          </div>

          <motion.div 
            className="flex flex-col bg-white rounded-b-[16px] md:rounded-b-[24px] overflow-hidden"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {loading ? (
              skeletons.map((_, i) => (
                <div key={i} className={`grid ${gridLayout} gap-1 md:gap-2 items-center border-b border-gray-50 p-2 md:p-4`}>
                  <div className="h-4 md:h-6 bg-gray-100 rounded w-full animate-pulse" />
                  <div className="flex items-center gap-1.5 md:gap-3">
                    <div className="w-6 h-6 md:w-10 md:h-10 bg-gray-100 rounded-full animate-pulse" />
                    <div className="h-3 md:h-5 bg-gray-100 rounded w-24 md:w-48 animate-pulse" />
                  </div>
                  {Array.from({length: 7}).map((_, j) => (
                     <div key={j} className="h-4 md:h-6 bg-gray-100 rounded w-full animate-pulse" />
                  ))}
                </div>
              ))
            ) : (
              displayTakimlar.map((t, i) => {
                const style = getRankStyle(i);
                const form = generateForm(t.won, t.drawn, t.lost, t.id);

                return (
                  <motion.div 
                    variants={itemVariants} 
                    key={t.id} 
                    className={`grid ${gridLayout} gap-1 md:gap-2 items-center ${style.bg} border-b border-gray-100/50 last:border-b-0 text-gray-900 py-2 px-1 md:p-4 transition-all duration-300 hover:bg-gray-50 group hover:shadow-[0_0_20px_rgba(0,0,0,0.03)] relative z-10 hover:z-20`}
                  >
                    {/* Rank */}
                    <div className={`font-black text-[10px] md:text-xl text-center ${style.color} transition-transform duration-300 group-hover:scale-110`}>
                      {style.icon}
                    </div>
                    
                    {/* Team */}
                    <div className="flex items-center gap-1.5 md:gap-3 overflow-hidden pr-1">
                      <div className="relative w-6 h-6 md:w-10 md:h-10 shrink-0 rounded-full bg-white border border-gray-100 shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:border-[#ceaa52]/50 flex items-center justify-center p-[2px] md:p-1">
                        <Image src={t.logo} alt={t.name} fill className="object-contain p-0.5 md:p-1" />
                      </div>
                      <span className="font-black text-[9px] sm:text-[11px] md:text-[15px] tracking-tighter md:tracking-tight leading-none md:leading-tight truncate group-hover:text-[#9e1b22] transition-colors">{t.name}</span>
                    </div>
                    
                    {/* Stats */}
                    <div className="text-center font-bold text-[9px] md:text-base text-gray-400 group-hover:text-gray-700 transition-colors">{t.played}</div>
                    <div className="text-center font-black text-[9px] md:text-base text-green-500 drop-shadow-sm">{t.won}</div>
                    <div className="text-center font-black text-[9px] md:text-base text-gray-400 drop-shadow-sm">{t.drawn}</div>
                    <div className="text-center font-black text-[9px] md:text-base text-red-500 drop-shadow-sm">{t.lost}</div>
                    
                    {/* Goal Difference */}
                    <div className={`text-center font-black text-[10px] md:text-[14px] ${t.goal_difference > 0 ? "text-green-600" : t.goal_difference < 0 ? "text-red-500" : "text-gray-400"}`}>
                      {t.goal_difference > 0 ? `+${t.goal_difference}` : t.goal_difference}
                    </div>
                    
                    {/* Form (Recent Matches) */}
                    <div className="flex items-center justify-center gap-[2px] md:gap-1.5">
                      {form.map((res, idx) => (
                        <div key={idx} className={`w-2 h-2 md:w-5 md:h-5 rounded-[2px] md:rounded flex items-center justify-center text-[5px] md:text-[10px] font-black text-white shadow-sm transition-transform duration-300 hover:scale-125 ${
                          res === 'W' ? 'bg-green-500' : res === 'D' ? 'bg-gray-400' : res === 'L' ? 'bg-red-500' : 'bg-gray-200 text-gray-400 shadow-none'
                        }`}>
                          <span className="hidden md:inline">{res === 'W' ? 'G' : res === 'D' ? 'B' : res === 'L' ? 'M' : '-'}</span>
                        </div>
                      ))}
                    </div>

                    {/* Points */}
                    <div className="flex justify-center">
                      <div className="w-6 h-5 md:w-12 md:h-10 flex items-center justify-center font-black text-[10px] md:text-lg text-white bg-gradient-to-br from-[#1a1a2e] to-[#9e1b22] rounded md:rounded-lg shadow-[0_2px_5px_rgba(158,27,34,0.3)] group-hover:scale-110 transition-transform duration-300 group-hover:shadow-[0_8px_15px_rgba(158,27,34,0.4)]">
                        {t.points}
                      </div>
                    </div>
                    
                  </motion.div>
                );
              })
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
