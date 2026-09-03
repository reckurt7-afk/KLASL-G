"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import OyuncuKarti from "@/app/components/OyuncuKarti";
import { motion } from "framer-motion";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { LogOut, Share2, Download, Trophy } from "lucide-react";

export default function HesabimPage() {
  const { user, profil, loading, cikisYap } = useAuth();
  const router = useRouter();

  // Sabit veya mock veriler (İleride Supabase'den çekilecek)
  const mockStats = {
    hiz: 85,
    sut: 78,
    pas: 82,
    dribling: 88,
    defans: 60,
    fizik: 75,
  };

  const chartData = [
    { subject: "HIZ", A: mockStats.hiz, fullMark: 99 },
    { subject: "ŞUT", A: mockStats.sut, fullMark: 99 },
    { subject: "PAS", A: mockStats.pas, fullMark: 99 },
    { subject: "DRB", A: mockStats.dribling, fullMark: 99 },
    { subject: "DEF", A: mockStats.defans, fullMark: 99 },
    { subject: "FİZ", A: mockStats.fizik, fullMark: 99 },
  ];

  useEffect(() => {
    if (!loading && !user) {
      router.push("/giris");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070707] text-white">
        <div className="animate-spin text-[#ceaa52] text-4xl">⚽</div>
      </div>
    );
  }

  const [ad, soyad] = (profil?.ad_soyad || "Oyuncu İsim").split(" ");

  return (
    <main className="min-h-screen bg-[#070707] text-white pt-24 pb-24 px-4 overflow-hidden relative">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#ceaa52]/10 via-[#070707]/90 to-[#070707]" />
      
      <div className="max-w-[1200px] mx-auto relative z-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
            OYUNCU <span className="text-[#ceaa52]">PORTALI</span>
          </h1>
          <button 
            onClick={cikisYap}
            className="flex items-center gap-2 bg-white/10 hover:bg-[#ceaa52]/80 text-white px-4 py-2 rounded-xl transition-colors font-bold text-sm"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Çıkış Yap</span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start">
          
          {/* OYUNCU KARTI (SOL TARAF) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", duration: 0.8 }}
            className="w-full lg:w-auto flex flex-col items-center gap-6"
          >
            {/* 3D Hologram wrapper for the card */}
            <div className="relative group perspective-[1000px]">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#ceaa52] to-[#ffd700] blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
              <div className="transform-gpu transition-transform duration-500 group-hover:rotate-y-12 group-hover:rotate-x-12 cursor-pointer">
                <OyuncuKarti 
                  id={1}
                  ad={ad || "Kayıtsız"}
                  soyad={soyad || ""}
                  fotograf={profil?.avatar_url || ""}
                  takimAd={profil?.takim || "Takımsız"}
                  rating={82}
                  golSayisi={5}
                  asistSayisi={3}
                  macSayisi={12}
                  stats={mockStats}
                  kartTipi="totw"
                />
              </div>
            </div>

            <div className="flex gap-4 w-full">
              <button className="flex-1 bg-gradient-to-r from-[#ceaa52] to-[#8c7324] text-white py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(212,175,55,0.4)] hover:scale-105 transition-transform">
                <Share2 size={18} /> Paylaş
              </button>
              <button className="flex-1 bg-[#1a1c29] border border-white/20 text-white py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 hover:bg-white/10 hover:scale-105 transition-transform">
                <Download size={18} /> İndir
              </button>
            </div>
          </motion.div>

          {/* İSTATİSTİKLER VE GRAFİK (SAĞ TARAF) */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full flex-1 flex flex-col gap-6"
          >
            {/* Radar Chart (Yetenek Altıgeni) */}
            <div className="bg-[#0c0c0c]/90 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#ceaa52]/10 blur-[50px] rounded-full" />
              <h2 className="text-xl font-black text-white mb-6 flex items-center gap-2">
                <Trophy className="text-[#ffd700]" />
                YETENEK ANALİZİ
              </h2>
              
              <div className="w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                    <PolarGrid stroke="rgba(255,255,255,0.1)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 'bold' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                      name="Yetenek"
                      dataKey="A"
                      stroke="#ceaa52"
                      strokeWidth={3}
                      fill="#ceaa52"
                      fillOpacity={0.4}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Kupa & Rozetler */}
            <div className="bg-[#0c0c0c]/90 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-2xl">
              <h2 className="text-xl font-black text-white mb-4">KARİYER ÖZETİ</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-black/50 border border-white/5 rounded-xl p-4 flex flex-col items-center text-center">
                  <div className="text-3xl mb-2">🏅</div>
                  <div className="text-gray-400 text-xs font-bold uppercase">Maçın Adamı</div>
                  <div className="text-white font-black text-lg">2 Kez</div>
                </div>
                <div className="bg-black/50 border border-white/5 rounded-xl p-4 flex flex-col items-center text-center">
                  <div className="text-3xl mb-2">⚽</div>
                  <div className="text-gray-400 text-xs font-bold uppercase">Haftanın 7'si</div>
                  <div className="text-white font-black text-lg">1 Kez</div>
                </div>
                <div className="bg-black/50 border border-white/5 rounded-xl p-4 flex flex-col items-center text-center">
                  <div className="text-3xl mb-2">🔥</div>
                  <div className="text-gray-400 text-xs font-bold uppercase">Skor Tahmini</div>
                  <div className="text-[#4ade80] font-black text-lg">450 Puan</div>
                </div>
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </main>
  );
}
