"use client";


import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Takim = {
  id: number;
  ad: string;
  logo: string;
  oynanan: number;
  galibiyet: number;
  beraberlik: number;
  maglubiyet: number;
  averaj: number;
  puan: number;
};

export default function PuanDurumuPage() {
  const [takimlar, setTakimlar] = useState<Takim[]>([]);


  
useEffect(() => {
  async function takimlariGetir() {
    const { data, error } = await supabase
      .from("takimlar")
      .select("*")
      .order("puan", { ascending: false })
      .order("averaj", { ascending: false });

    console.log(data);

    if (error) {
      alert(error.message);
      return;
    }

    setTakimlar(data || []);
  }

  takimlariGetir();
}, []);
  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed relative" style={{ backgroundImage: "url('/images/stadium.jpg')" }}>
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#070707]/90 via-[#070707]/70 to-[#070707]/95"></div>

      <div className="relative z-10 w-full max-w-[1200px] mx-auto pt-[40px] px-4 pb-24">
        
        {/* Başlık Alanı */}
        <div className="bg-[#151515]/60 backdrop-blur-xl border border-[#ff3131]/20 rounded-3xl p-6 mb-8 text-center shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          <h1 className="text-white text-3xl md:text-4xl font-black m-0 drop-shadow-[0_0_15px_rgba(255,49,49,0.4)]">
            🏆 PUAN DURUMU
          </h1>
          <div className="text-[#ff3131] mt-2 text-xs md:text-sm tracking-[0.4em] font-black">
            KLAS LİG BURSA
          </div>
        </div>

        {/* Tablo Konteyneri (Mobil İçin Sıkıştırılmış) */}
        <div className="w-full">
          <div className="w-full">
            {/* Tablo Başlıkları */}
            <div className="grid grid-cols-[20px_minmax(90px,1fr)_15px_15px_15px_15px_25px_25px] sm:grid-cols-[40px_minmax(200px,1fr)_40px_40px_40px_40px_50px_50px] gap-1 sm:gap-2 bg-[#1a1a1a]/80 backdrop-blur-md border-b-2 border-[#ff3131] text-[#ff3131] font-black text-[9px] sm:text-sm p-2 sm:p-4 rounded-t-2xl shadow-[0_5px_15px_rgba(0,0,0,0.3)] items-center">
              <div className="text-center">S</div>
              <div>TAKIM</div>
              <div className="text-center">O</div>
              <div className="text-center">G</div>
              <div className="text-center">B</div>
              <div className="text-center">M</div>
              <div className="text-center">AV</div>
              <div className="text-center text-white">P</div>
            </div>

            {/* Tablo Satırları */}
            <div className="bg-[#151515]/60 backdrop-blur-md border border-[#ff3131]/10 rounded-b-2xl p-1 sm:p-2 shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex flex-col gap-1 sm:gap-1.5">
              {takimlar.map((t, i) => {
                // Şampiyon, İkinci, Üçüncü Renkleri
                let rankColor = "text-gray-400";
                let borderColor = "border-transparent";
                let bgGradient = "bg-[#1f1f1f]/80";
                let medal = i + 1;
                
                if (i === 0) {
                  rankColor = "text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.8)]";
                  borderColor = "border-l-yellow-400";
                  bgGradient = "bg-gradient-to-r from-yellow-500/20 to-[#1f1f1f]/80";
                  medal = "👑" as any;
                } else if (i === 1) {
                  rankColor = "text-gray-300 drop-shadow-[0_0_5px_rgba(209,213,219,0.8)]";
                  borderColor = "border-l-gray-300";
                  bgGradient = "bg-gradient-to-r from-gray-400/10 to-[#1f1f1f]/80";
                  medal = "🥈" as any;
                } else if (i === 2) {
                  rankColor = "text-amber-600 drop-shadow-[0_0_5px_rgba(217,119,6,0.8)]";
                  borderColor = "border-l-amber-600";
                  bgGradient = "bg-gradient-to-r from-amber-600/10 to-[#1f1f1f]/80";
                  medal = "🥉" as any;
                }

                return (
                  <div
                    key={t.ad}
                    className={`grid grid-cols-[20px_minmax(90px,1fr)_15px_15px_15px_15px_25px_25px] sm:grid-cols-[40px_minmax(200px,1fr)_40px_40px_40px_40px_50px_50px] gap-1 sm:gap-2 items-center ${bgGradient} border-l-2 sm:border-l-4 ${borderColor} text-white p-1.5 sm:p-3 rounded-xl transition-all duration-300 hover:scale-[1.01] hover:bg-[#252525] hover:shadow-[0_5px_15px_rgba(255,49,49,0.2)] group cursor-default text-[10px] sm:text-base`}
                  >
                    {/* Sıralama / Madalya */}
                    <div className={`font-black text-[12px] sm:text-xl text-center ${rankColor} transition-transform group-hover:scale-110`}>
                      {medal}
                    </div>

                    {/* Takım Bilgisi */}
                    <div className="flex items-center gap-1.5 sm:gap-3 overflow-hidden">
                      <div className="relative w-[18px] h-[18px] sm:w-[42px] sm:h-[42px] shrink-0 rounded-full overflow-hidden border border-white/20 group-hover:border-[#ff3131]/50 bg-[#111] shadow-[0_0_10px_rgba(0,0,0,0.5)] flex items-center justify-center">
                        <Image
                          src={t.logo}
                          alt={t.ad}
                          fill
                          className="object-contain p-[2px] sm:p-1"
                        />
                      </div>
                      <span className="font-bold text-[9px] sm:text-base leading-tight truncate group-hover:text-[#ff3131] transition-colors">
                        {t.ad}
                      </span>
                    </div>

                    {/* İstatistikler */}
                    <div className="text-center font-semibold text-gray-300">{t.oynanan}</div>
                    <div className="text-center font-bold text-green-400">{t.galibiyet}</div>
                    <div className="text-center font-bold text-gray-400">{t.beraberlik}</div>
                    <div className="text-center font-bold text-red-400">{t.maglubiyet}</div>
                    
                    <div className="text-center font-black bg-white/5 rounded-[4px] sm:rounded-md py-0.5 sm:py-1">
                      {t.averaj > 0 ? `+${t.averaj}` : t.averaj}
                    </div>
                    
                    <div className="text-center font-black text-[11px] sm:text-lg text-white bg-[#ff3131]/20 rounded-[4px] sm:rounded-md py-0.5 sm:py-1 border border-[#ff3131]/30 group-hover:bg-[#ff3131] transition-colors">
                      {t.puan}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}