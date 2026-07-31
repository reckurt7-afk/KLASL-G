"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
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

const TEAM_LOGOS: Record<string, string> = {
  "Alaçam Spor": "/logos/alacam-spor.png",
  "ALAÇAM SPOR": "/logos/alacam-spor.png",
  "Krokodilla FK": "/logos/krokodilla-fc.png",
  "KROKODİLLA FC": "/logos/krokodilla-fc.png",
  "Dündar Köyü": "/logos/dundar-koyu.png",
  "DÜNDAR KÖYÜ": "/logos/dundar-koyu.png",
  "Yeşil Bursa FC": "/logos/yesil-bursa-fc.png",
  "YEŞİL BURSA FC": "/logos/yesil-bursa-fc.png",
  "Yediyol Black FC": "/logos/yediyol-black-fc.png",
  "YEDİYOL BLACK FC": "/logos/yediyol-black-fc.png",
  "Gravyer FC": "/logos/gravyer-fc.png",
  "GRAVYER FC": "/logos/gravyer-fc.png",
  "BİSKREM FC": "/logos/biskrem-fc.png",
  "Dinamo Nalbantoğlu": "/logos/dinamo-nalbantoglu.png",
  "DİNAMO NALBANTOĞLU": "/logos/dinamo-nalbantoglu.png",
};

export default function MacSaatleriPage() {
  const [maclar, setMaclar] = useState<Mac[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function maclariGetir() {
      const { data, error } = await supabase
        .from("maclar")
        .select("id,hafta,ev_sahibi,deplasman,tarih,saat,saha")
        .order("hafta", { ascending: true });

      if (error) {
        console.error(error);
      } else {
        setMaclar(data || []);
      }
      setLoading(false);
    }
    maclariGetir();
  }, []);

  const haftalar = [2, 3, 4, 5, 6, 7];

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed relative" style={{ backgroundImage: "url('/images/stadium.jpg')" }}>
      {/* Koyu Arkaplan Filtresi */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/95 via-[#0a0a0a]/85 to-[#050505]/95"></div>

      <div className="relative z-10 w-full max-w-[1200px] mx-auto pt-[90px] px-4 pb-24">
        
        {/* Süslü Başlık */}
        <div className="bg-[#111]/70 backdrop-blur-xl border border-[#ff3131]/30 rounded-[30px] p-8 mb-12 text-center shadow-[0_15px_40px_rgba(255,49,49,0.15)] relative overflow-hidden">
          {/* Animasyonlu Arkaplan Işığı */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#ff3131]/20 rounded-full blur-[60px] animate-pulse"></div>
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#ff3131]/20 rounded-full blur-[60px] animate-pulse" style={{ animationDelay: "1s" }}></div>
          
          <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-[#ff3131] text-4xl md:text-5xl font-black m-0 drop-shadow-[0_0_20px_rgba(255,49,49,0.3)]">
            MAÇ TAKVİMİ
          </h1>
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#ff3131]"></div>
            <div className="text-[#ff3131] text-xs md:text-sm tracking-[0.4em] font-black uppercase">
              Klas Lig Saatleri
            </div>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#ff3131]"></div>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-white font-bold animate-pulse text-xl">Yükleniyor...</div>
        ) : (
          haftalar.map((hafta) => {
            const haftaninMaclari = maclar.filter((m) => m.hafta === hafta);
            
            if (haftaninMaclari.length === 0) return null;

            return (
              <div key={hafta} className="mb-16">
                
                {/* Estetik Hafta Başlığı */}
                <div className="flex flex-col items-center mb-8 relative">
                  <div className="text-[80px] md:text-[120px] font-black absolute -top-10 md:-top-16 opacity-[0.03] text-white select-none pointer-events-none">
                    HAFTA {hafta}
                  </div>
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="h-[2px] w-16 md:w-32 bg-gradient-to-r from-transparent to-[#ff3131]/80 rounded-full"></div>
                    <h2 className="text-white text-2xl md:text-3xl font-black drop-shadow-[0_0_10px_rgba(255,49,49,0.5)]">
                      {hafta}. HAFTA
                    </h2>
                    <div className="h-[2px] w-16 md:w-32 bg-gradient-to-l from-transparent to-[#ff3131]/80 rounded-full"></div>
                  </div>
                </div>

                {/* Grid Yapısı */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {haftaninMaclari.map((mac) => (
                    <div
                      key={mac.id}
                      className="group relative bg-gradient-to-br from-[#151515]/90 to-[#0a0a0a]/90 backdrop-blur-xl rounded-[24px] p-6 border border-white/5 hover:border-[#ff3131]/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(255,49,49,0.15)] flex flex-col"
                    >
                      {/* Glow Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-b from-[#ff3131]/0 via-[#ff3131]/[0.03] to-[#ff3131]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[24px]"></div>

                      {/* Üst Kısım: Saha Bilgisi */}
                      <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/5">
                        <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-lg border border-white/5 group-hover:border-white/10 transition-colors">
                          <span className="text-xl">🏟️</span>
                          <span className="text-gray-300 font-semibold text-xs md:text-sm">{mac.saha || "Saha Belli Değil"}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-lg border border-white/5 group-hover:border-[#ff3131]/30 transition-colors">
                          <span className="text-xl">📅</span>
                          <span className="text-gray-300 font-semibold text-xs md:text-sm">{mac.tarih || "Tarih Yok"}</span>
                        </div>
                      </div>

                      {/* Orta Kısım: Takımlar ve Saat */}
                      <div className="flex items-center justify-between w-full mt-2 mb-4">
                        
                        {/* Ev Sahibi */}
                        <div className="flex flex-col items-center w-[35%] gap-3">
                          <div className="relative w-[60px] h-[60px] md:w-[85px] md:h-[85px] group-hover:scale-110 transition-all duration-500 drop-shadow-[0_0_15px_rgba(255,49,49,0.3)]">
                            {TEAM_LOGOS[mac.ev_sahibi] ? (
                              <Image src={TEAM_LOGOS[mac.ev_sahibi]} alt={mac.ev_sahibi} fill className="object-contain" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-600 font-black">?</div>
                            )}
                          </div>
                          <span className="text-white font-bold text-xs md:text-sm text-center uppercase tracking-wide">
                            {mac.ev_sahibi}
                          </span>
                        </div>

                        {/* Saat (Merkez) */}
                        <div className="flex flex-col items-center justify-center w-[30%]">
                          <div className="text-gray-500 text-[10px] font-black tracking-widest mb-1 uppercase">BAŞLAMA SAATİ</div>
                          <div className="bg-gradient-to-b from-[#1a1a1a] to-black border border-[#ff3131]/20 group-hover:border-[#ff3131]/60 rounded-xl px-4 py-3 shadow-inner transition-colors duration-300">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 font-black text-2xl md:text-3xl tracking-wider">
                              {mac.saat ? mac.saat.substring(0, 5) : "--:--"}
                            </span>
                          </div>
                        </div>

                        {/* Deplasman */}
                        <div className="flex flex-col items-center w-[35%] gap-3">
                          <div className="relative w-[60px] h-[60px] md:w-[85px] md:h-[85px] group-hover:scale-110 transition-all duration-500 drop-shadow-[0_0_15px_rgba(255,49,49,0.3)]">
                            {TEAM_LOGOS[mac.deplasman] ? (
                              <Image src={TEAM_LOGOS[mac.deplasman]} alt={mac.deplasman} fill className="object-contain" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-600 font-black">?</div>
                            )}
                          </div>
                          <span className="text-white font-bold text-xs md:text-sm text-center uppercase tracking-wide">
                            {mac.deplasman}
                          </span>
                        </div>

                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}