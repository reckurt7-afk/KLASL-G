"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Trophy, Activity, AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

type Stat = {
  isim: string;
  takim: string;
  skor: number;
};

export default function IstatistiklerPage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"GOL" | "ASIST" | "SARI_KART" | "KIRMIZI_KART">("GOL");
  const [statsData, setStatsData] = useState<Stat[]>([]);

  useEffect(() => {
    async function loadStats() {
      setLoading(true);
      try {
        const { data: olaylar, error } = await supabase
          .from("mac_olaylari")
          .select("tip, oyuncu, takim_yonu, maclar(ev_sahibi, deplasman)");

        if (error) throw error;

        // Hesaplama Sözlüğü
        const map: Record<string, { takim: string; skor: number }> = {};

        olaylar?.forEach((olay: any) => {
          if (olay.tip !== activeTab || !olay.oyuncu) return;

          // Takım adını çıkar
          const takim = olay.takim_yonu === "ev" 
            ? olay.maclar?.ev_sahibi 
            : olay.maclar?.deplasman;

          const key = `${olay.oyuncu.trim().toUpperCase()}_${takim}`;

          if (!map[key]) {
            map[key] = { takim: takim || "Bilinmiyor", skor: 0 };
          }
          map[key].skor += 1;
        });

        // Listeye Çevir ve Sırala
        const list: Stat[] = Object.entries(map).map(([key, val]) => {
          const isim = key.split("_")[0];
          return { isim, takim: val.takim, skor: val.skor };
        });

        list.sort((a, b) => b.skor - a.skor);
        setStatsData(list);
      } catch (err) {
        console.error("İstatistikler yüklenemedi:", err);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-[#070707] text-white pt-24 pb-20 px-4 font-sans selection:bg-[#eab308]/30 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-[#d4af37]/10 via-[#d4af37]/5 to-transparent pointer-events-none" />
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#d4af37] rounded-full blur-[150px] opacity-10 pointer-events-none" />

      <div className="max-w-[1200px] mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-12">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 bg-gradient-to-br from-[#d4af37] to-[#991b1b] rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(212,175,55,0.4)]"
          >
            <Trophy className="w-8 h-8 text-white" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 mb-4 text-center tracking-tight"
          >
            OYUNCU İSTATİSTİKLERİ
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-center max-w-lg mx-auto"
          >
            Pro Lig Bursa'nın en iyileri. Sahada parlayan yıldızlar, golcüler, asist kralları ve hırçınlar.
          </motion.p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
          {[
            { id: "GOL", label: "GOL KRALLIĞI", icon: Trophy, color: "from-yellow-400 to-amber-600", shadow: "rgba(250,204,21,0.4)" },
            { id: "ASIST", label: "ASİST KRALLIĞI", icon: Activity, color: "from-blue-400 to-blue-600", shadow: "rgba(96,165,250,0.4)" },
            { id: "SARI_KART", label: "SARI KART", icon: AlertTriangle, color: "from-yellow-200 to-yellow-400", shadow: "rgba(253,224,71,0.4)" },
            { id: "KIRMIZI_KART", label: "KIRMIZI KART", icon: AlertTriangle, color: "from-red-500 to-red-700", shadow: "rgba(239,68,68,0.4)" },
          ].map((tab, idx) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`relative px-6 py-3 rounded-xl font-bold text-[13px] tracking-wider uppercase transition-all duration-300 flex items-center gap-2 overflow-hidden
                  ${isActive ? 'text-white' : 'text-gray-400 bg-white/5 hover:bg-white/10'}`}
                style={{
                  boxShadow: isActive ? `0 8px 25px ${tab.shadow}` : 'none'
                }}
              >
                {isActive && (
                  <div className={`absolute inset-0 bg-gradient-to-r ${tab.color} opacity-100 z-0`} />
                )}
                <div className="relative z-10 flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </div>
              </button>
            )
          })}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-[#d4af37]/20 border-t-[#d4af37] rounded-full animate-spin" />
          </div>
        )}

        {/* Empty State */}
        {!loading && statsData.length === 0 && (
          <div className="text-center py-20 bg-white/[0.02] rounded-3xl border border-white/5 backdrop-blur-md">
            <Trophy className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-300 mb-2">Henüz Veri Yok</h3>
            <p className="text-gray-500">Bu kategori için yeterli istatistik bulunamadı.</p>
          </div>
        )}

        {/* Content */}
        {!loading && statsData.length > 0 && (
          <div className="animate-in fade-in slide-in-from-bottom-10 duration-700">
            
            {/* FUT Podium (Top 3) */}
            <div className="flex flex-col md:flex-row items-end justify-center gap-6 md:gap-8 mb-16 pt-10">
              {/* Rank 2 (Silver) */}
              {statsData[1] && <PodiumCard rank={2} stat={statsData[1]} type={activeTab} />}
              {/* Rank 1 (Gold) */}
              {statsData[0] && <PodiumCard rank={1} stat={statsData[0]} type={activeTab} />}
              {/* Rank 3 (Bronze) */}
              {statsData[2] && <PodiumCard rank={3} stat={statsData[2]} type={activeTab} />}
            </div>

            {/* List (Rank 4+) */}
            {statsData.length > 3 && (
              <div className="max-w-[800px] mx-auto bg-black/40 backdrop-blur-2xl rounded-3xl border border-white/5 overflow-hidden">
                <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between text-xs font-bold text-gray-500 uppercase tracking-widest">
                  <div className="flex items-center gap-6">
                    <span className="w-8 text-center">Sıra</span>
                    <span>Oyuncu</span>
                  </div>
                  <span>{activeTab.replace("_", " ")}</span>
                </div>
                
                <div className="divide-y divide-white/5">
                  {statsData.slice(3).map((stat, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="px-6 py-4 flex items-center justify-between hover:bg-white/[0.03] transition-colors group"
                    >
                      <div className="flex items-center gap-6">
                        <span className="w-8 text-center font-black text-gray-600 text-lg">{idx + 4}</span>
                        <div>
                          <h4 className="font-bold text-white text-[15px] group-hover:text-[#d4af37] transition-colors">{stat.isim}</h4>
                          <span className="text-xs text-gray-500 font-medium">{stat.takim}</span>
                        </div>
                      </div>
                      <div className="text-2xl font-black text-white/90">
                        {stat.skor}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}

// ----------------------
// Alt Bileşen: Podium Kartı
// ----------------------
function PodiumCard({ rank, stat, type }: { rank: number, stat: Stat, type: string }) {
  const isGold = rank === 1;
  const isSilver = rank === 2;
  
  const height = isGold ? "h-[340px]" : isSilver ? "h-[300px]" : "h-[280px]";
  const bgGradient = isGold 
    ? "from-[#ffd700]/20 via-[#ffd700]/5 to-black/80" 
    : isSilver 
      ? "from-[#c0c0c0]/20 via-[#c0c0c0]/5 to-black/80"
      : "from-[#cd7f32]/20 via-[#cd7f32]/5 to-black/80";
      
  const borderColor = isGold ? "border-[#ffd700]/30" : isSilver ? "border-[#c0c0c0]/30" : "border-[#cd7f32]/30";
  const glow = isGold ? "shadow-[0_0_50px_rgba(255,215,0,0.15)]" : isSilver ? "shadow-[0_0_40px_rgba(192,192,192,0.1)]" : "shadow-[0_0_30px_rgba(205,127,50,0.1)]";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.1, type: "spring" }}
      className={`relative w-full max-w-[280px] md:w-[260px] ${height} rounded-3xl p-[1px] bg-gradient-to-b ${borderColor.replace('border-', 'from-').replace('/30', '/50')} to-transparent ${glow} group perspective-1000`}
      style={{
        zIndex: isGold ? 30 : 20,
        order: isGold ? 2 : isSilver ? 1 : 3
      }}
    >
      <div className={`absolute inset-0 bg-gradient-to-b ${bgGradient} rounded-3xl backdrop-blur-xl`} />
      
      {/* Kart İçeriği */}
      <div className="relative h-full flex flex-col items-center justify-between p-6 overflow-hidden rounded-3xl">
        
        {/* Glow Arkası */}
        <div className={`absolute -top-20 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full blur-[50px] opacity-20 pointer-events-none transition-opacity group-hover:opacity-40
          ${isGold ? "bg-[#ffd700]" : isSilver ? "bg-[#c0c0c0]" : "bg-[#cd7f32]"}`} />

        {/* Sıralama Taçı/Numarası */}
        <div className={`text-5xl font-black italic opacity-20 bg-clip-text text-transparent bg-gradient-to-b ${isGold ? "from-[#ffd700]" : isSilver ? "from-[#c0c0c0]" : "from-[#cd7f32]"} to-transparent`}>
          #{rank}
        </div>

        {/* İsim ve Takım */}
        <div className="text-center w-full mt-auto mb-6 z-10">
          <h3 className="text-xl font-black text-white uppercase tracking-tight mb-1 truncate px-2">{stat.isim}</h3>
          <p className="text-xs text-gray-400 font-medium truncate px-2">{stat.takim}</p>
        </div>

        {/* Skor Kutusu */}
        <div className="w-full relative">
          <div className={`absolute inset-0 bg-gradient-to-r ${isGold ? "from-[#ffd700]" : isSilver ? "from-[#c0c0c0]" : "from-[#cd7f32]"} blur-[20px] opacity-20`} />
          <div className="relative bg-black/50 border border-white/10 rounded-2xl py-4 flex flex-col items-center justify-center backdrop-blur-md">
            <span className="text-4xl font-black text-white">{stat.skor}</span>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
              {type === "GOL" ? "GOL" : type === "ASIST" ? "ASİST" : "KART"}
            </span>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
