"use client";

import { useEffect, useState } from "react";
import { useCityStore } from "../store/cityStore";
import { supabase } from "@/lib/supabase";

const DEFAULT_PLAYERS = [
  { id: "p1", name: "Ahmet Yılmaz", team: "Gravyer FC", pos: "KL", rating: 92, top: "88%", left: "50%" },
  { id: "p2", name: "Burak Demir", team: "Krokodilla", pos: "SĞB", rating: 89, top: "68%", left: "22%" },
  { id: "p3", name: "Can Kaya", team: "PS 5", pos: "ST", rating: 88, top: "72%", left: "50%" },
  { id: "p4", name: "Hasan Can", team: "Yediyol", pos: "SLB", rating: 87, top: "68%", left: "78%" },
  { id: "p5", name: "Ali Vefa", team: "Yeşil Bursa", pos: "SĞA", rating: 94, top: "42%", left: "22%" },
  { id: "p6", name: "Kemal Sun", team: "Gravyer FC", pos: "MO", rating: 95, top: "46%", left: "50%" },
  { id: "p7", name: "Emre Can", team: "Biskrem M.", pos: "SLA", rating: 90, top: "42%", left: "78%" },
  { id: "p8", name: "Mustafa S.", team: "Krokodilla", pos: "SNT", rating: 97, top: "16%", left: "50%" }
];

export default function GenelBakis() {
  const { selectedCityId } = useCityStore();
  const [players, setPlayers] = useState<any[]>(DEFAULT_PLAYERS);
  const cityName = selectedCityId === 1 ? "Bursa" : selectedCityId === 2 ? "İstanbul" : selectedCityId === 3 ? "İzmir" : "Türkiye";

  useEffect(() => {
    async function loadData() {
      try {
        const { data } = await supabase
          .from("ayarlar")
          .select("deger")
          .eq("anahtar", "altin_sekiz_oyuncular")
          .single();

        if (data && data.deger) {
          const parsed = JSON.parse(data.deger);
          if (Array.isArray(parsed) && parsed.length === 8) {
            setPlayers(parsed);
          }
        }
      } catch (err) {
        // Fallback to default
      }
    }
    loadData();
  }, []);

  return (
    <div className="w-full flex flex-col fade-in pb-10">
       {/* Header */}
      <div className="flex items-center gap-4 mb-6 bg-white h-[70px] rounded-xl border border-gray-100 shadow-sm px-4 relative overflow-hidden">
         {/* Gold Accent Line */}
         <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-300 via-yellow-500 to-amber-600"></div>
         
         <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-xl flex items-center justify-center text-white shadow-md shrink-0">
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
         </div>
         <div className="flex flex-col justify-center">
           <h1 className="text-[15px] md:text-[18px] font-black text-[#1a1a2e] leading-none mb-1">HAFTANIN ALTIN 8'İ</h1>
           <p className="text-[11px] md:text-[13px] text-gray-500 font-bold leading-none">{cityName} - 4. Hafta En İyileri</p>
         </div>
      </div>

      {/* Football Pitch Container */}
      <div className="w-full max-w-[700px] mx-auto relative rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-4 border-gray-900 bg-[#1e4d2b] select-none" style={{ aspectRatio: '3/4' }}>
          {/* Pitch Stripes (Repeating background) */}
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_10%,rgba(255,255,255,0.04)_10%,rgba(255,255,255,0.04)_20%)]"></div>
          
          {/* Pitch Lines - Outer border */}
          <div className="absolute inset-4 border-[3px] border-white/40"></div>
          
          {/* Center line */}
          <div className="absolute top-1/2 left-4 right-4 border-t-[3px] border-white/40 -translate-y-1/2"></div>
          
          {/* Center circle & spot */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-[3px] border-white/40 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white/50 rounded-full"></div>
          
          {/* Top Penalty Area */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[55%] h-[16%] border-x-[3px] border-b-[3px] border-white/40"></div>
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[25%] h-[6%] border-x-[3px] border-b-[3px] border-white/40"></div>
          <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-16 h-8 border-b-[3px] border-white/40 rounded-b-full opacity-70"></div>
          <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white/50 rounded-full"></div> {/* Penalty spot */}

          {/* Bottom Penalty Area */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[55%] h-[16%] border-x-[3px] border-t-[3px] border-white/40"></div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[25%] h-[6%] border-x-[3px] border-t-[3px] border-white/40"></div>
          <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 w-16 h-8 border-t-[3px] border-white/40 rounded-t-full opacity-70"></div>
          <div className="absolute bottom-[15%] left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white/50 rounded-full"></div> {/* Penalty spot */}
          
          {/* Corner arcs */}
          <div className="absolute top-4 left-4 w-5 h-5 border-r-[3px] border-b-[3px] border-white/40 rounded-br-full"></div>
          <div className="absolute top-4 right-4 w-5 h-5 border-l-[3px] border-b-[3px] border-white/40 rounded-bl-full"></div>
          <div className="absolute bottom-4 left-4 w-5 h-5 border-r-[3px] border-t-[3px] border-white/40 rounded-tr-full"></div>
          <div className="absolute bottom-4 right-4 w-5 h-5 border-l-[3px] border-t-[3px] border-white/40 rounded-tl-full"></div>

          {/* Players Overlay */}
          <div className="absolute inset-0 z-10">
             {players.map((p) => (
               <PlayerCard key={p.id} name={p.name} team={p.team} pos={p.pos} rating={p.rating} top={p.top} left={p.left} />
             ))}
          </div>
      </div>
    </div>
  );
}

function PlayerCard({ name, team, pos, rating, top, left }: { name: string, team: string, pos: string, rating: number, top: string, left: string }) {
  return (
    <div 
      className="absolute flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2 group cursor-pointer hover:z-50"
      style={{ top, left }}
    >
      {/* Player Badge / Card Design (FUT Style) */}
      <div className="relative w-14 h-[68px] md:w-16 md:h-[76px] mb-1.5 transition-transform group-hover:scale-125 duration-300 z-10">
        {/* Outer Gold Border */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-yellow-200 via-yellow-500 to-amber-700 drop-shadow-[0_5px_10px_rgba(0,0,0,0.6)]"
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% 75%, 50% 100%, 0 75%)' }}
        >
          {/* Inner Dark Card */}
          <div 
            className="absolute inset-[2px] bg-gradient-to-br from-gray-900 via-black to-gray-800 flex flex-col items-center pt-1.5 md:pt-2"
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% 74%, 50% 98%, 0 74%)' }}
          >
            <div className="text-yellow-500 text-[9px] md:text-[10px] font-black uppercase tracking-wider mb-0.5">{pos}</div>
            <div className="text-yellow-400 text-[18px] md:text-[22px] font-black leading-none">{rating}</div>
            {/* Star icon */}
            <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-600 mt-1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
        </div>
      </div>
      
      {/* Player Info Box */}
      <div className="bg-[#111]/90 backdrop-blur-md px-2.5 py-1.5 rounded-md border border-white/10 shadow-[0_4px_15px_rgba(0,0,0,0.4)] flex flex-col items-center min-w-[85px] z-20 group-hover:bg-[#1a1a2e] transition-colors">
        <span className="text-white text-[10px] md:text-[12px] font-black whitespace-nowrap drop-shadow-sm leading-tight">{name}</span>
        <span className="text-amber-400 text-[8px] md:text-[9px] font-bold whitespace-nowrap uppercase tracking-widest leading-tight mt-0.5">{team}</span>
      </div>
    </div>
  )
}
