"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Mac = {
  id: number;
  hafta: number;
  ev_sahibi: string;
  deplasman: string;
  tarih: string | null;
  saat: string | null;
  saha: string | null;
};

export default function MacSaatleriPage() {
  const [maclar, setMaclar] = useState<Mac[]>([]);

  useEffect(() => {
    maclariGetir();
  }, []);

  async function maclariGetir() {
    const { data, error } = await supabase
      .from("maclar")
      .select("id,hafta,ev_sahibi,deplasman,tarih,saat,saha")
      .order("hafta", { ascending: true });

    if (error) {
      alert(error.message);
      return;
    }

    setMaclar(data || []);
  }

  const haftalar = [...new Set(maclar.map((m) => m.hafta))];

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed relative" style={{ backgroundImage: "url('/images/stadium.jpg')" }}>
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#070707]/90 via-[#070707]/80 to-[#070707]/95"></div>

      <div className="relative z-10 w-full max-w-[1200px] mx-auto pt-[40px] px-4 pb-24">
        
        {/* Başlık Alanı */}
        <div className="bg-[#151515]/60 backdrop-blur-xl border border-[#ff3131]/20 rounded-3xl p-6 mb-10 text-center shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          <h1 className="text-white text-3xl md:text-4xl font-black m-0 drop-shadow-[0_0_15px_rgba(255,49,49,0.4)]">
            ⏰ MAÇ SAATLERİ
          </h1>
          <div className="text-[#ff3131] mt-2 text-xs md:text-sm tracking-[0.4em] font-black uppercase">
            Klas Lig Fikstür Takvimi
          </div>
        </div>

        {haftalar.map((hafta) => (
          <div key={hafta} className="mb-12">
            
            {/* Hafta Başlığı */}
            <div className="flex items-center gap-4 mb-6">
              <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent to-[#ff3131]/50"></div>
              <h2 className="text-white text-2xl md:text-3xl font-black italic drop-shadow-[0_0_10px_rgba(255,49,49,0.5)]">
                {hafta}. HAFTA
              </h2>
              <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent to-[#ff3131]/50"></div>
            </div>

            {/* Maç Kartları Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {maclar
                .filter((m) => m.hafta === hafta)
                .map((mac) => (
                  <div
                    key={mac.id}
                    className="group relative bg-[#151515]/70 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-[#ff3131]/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(255,49,49,0.15)] flex flex-col md:flex-row items-center justify-between gap-6"
                  >
                    {/* Hover Glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#ff3131]/0 via-[#ff3131]/5 to-[#ff3131]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"></div>

                    {/* Maç Bilgileri (Sol/Üst) */}
                    <div className="flex flex-col items-center md:items-start text-gray-300 text-sm gap-2 w-full md:w-auto">
                      <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-lg border border-white/5 w-full md:w-auto">
                        <span className="text-[#ff3131] text-lg">🏟</span> 
                        <span className="font-semibold">{mac.saha || "Saha Belirlenmedi"}</span>
                      </div>
                      
                      <div className="flex gap-2 w-full">
                        <div className="flex flex-1 md:flex-none items-center justify-center md:justify-start gap-2 bg-black/40 px-3 py-1.5 rounded-lg border border-white/5">
                          <span className="text-blue-400 text-lg">📅</span> 
                          <span className="font-semibold">{mac.tarih || "Tarih Belli Değil"}</span>
                        </div>
                        
                        <div className="flex flex-1 md:flex-none items-center justify-center md:justify-start gap-2 bg-black/40 px-3 py-1.5 rounded-lg border border-[#ff3131]/20 group-hover:border-[#ff3131]/50 transition-colors">
                          <span className="text-[#ff3131] text-lg">⏰</span> 
                          <span className="font-bold text-white">{mac.saat || "Saat Belli Değil"}</span>
                        </div>
                      </div>
                    </div>

                    {/* VS Bölümü (Takımlar) */}
                    <div className="flex items-center justify-center w-full md:flex-1 gap-2 md:gap-4 mt-2 md:mt-0">
                      
                      <div className="flex-1 text-right text-white font-black text-lg md:text-xl uppercase tracking-wide group-hover:text-gray-200 transition-colors">
                        {mac.ev_sahibi}
                      </div>

                      <div className="flex flex-col items-center justify-center px-3">
                        <div className="text-[#ff3131] font-black text-2xl italic drop-shadow-[0_0_8px_rgba(255,49,49,0.8)]">VS</div>
                      </div>

                      <div className="flex-1 text-left text-white font-black text-lg md:text-xl uppercase tracking-wide group-hover:text-gray-200 transition-colors">
                        {mac.deplasman}
                      </div>

                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}