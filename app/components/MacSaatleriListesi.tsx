"use client";

import { useEffect, useState } from "react";
import { useCityStore } from "@/app/store/cityStore";
import Image from "next/image";
import { publicFetch } from "@/lib/supabase";

type Mac = {
  id: number;
  hafta: number;
  ev_sahibi: string;
  deplasman: string;
  tarih: string | null;
  saat: string | null;
  saha: string | null;
  durum?: string | null;
};

const TEAM_LOGOS: Record<string, string> = {
  "PS 5": "/logos/ps5.png",
  "Krokodilla FK": "/logos/krokodilla-fc.png",
  "KROKODİLLA FC": "/logos/krokodilla-fc.png",
  "NOVA FC": "/logos/nova-fc.png",
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

export default function MacSaatleriListesi({ mini = false }: { mini?: boolean }) {
  const { selectedCityId } = useCityStore();

  const [maclar, setMaclar] = useState<Mac[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function maclariGetir() {
      const data = await publicFetch(
        "maclar",
        "select=id,hafta,ev_sahibi,deplasman,tarih,saat,saha,durum&order=hafta.asc,saat.asc"
      );
      if (data.length > 0) setMaclar(data);
      setLoading(false);
    }
    maclariGetir();
  }, [selectedCityId]);

  const haftalar = mini
    ? [maclar.length > 0 ? maclar[0].hafta : 1]
    : [...new Set(maclar.map(m => m.hafta))].sort((a, b) => a - b);

  return (
    <div className="w-full">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-black text-white">⏱️ MAÇ SAATLERİ</h2>
        <p className="section-sub mt-2 tracking-[0.3em] font-bold text-[#9e1b22]">PRİME LİG TAKVİMİ</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ceaa52]"></div>
        </div>
      ) : (
        haftalar.map((hafta) => {
          const haftaninMaclari = maclar.filter((m) => m.hafta === hafta);
          if (haftaninMaclari.length === 0) return null;

          return (
            <div key={hafta} className="mb-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-[1px] flex-1 bg-[rgba(255,255,255,0.07)]"></div>
                <h3 className="text-white text-lg md:text-2xl font-black uppercase tracking-wider text-center">
                  {hafta}. Hafta {mini && "Maçları"}
                </h3>
                <div className="h-[1px] flex-1 bg-[rgba(255,255,255,0.07)]"></div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                {haftaninMaclari.map((mac) => (
                  <div
                    key={mac.id}
                    className="card bg-[#111] border border-[rgba(255,255,255,0.07)] hover:border-[#ceaa52]/50 rounded-2xl p-4 md:p-6 transition-all duration-300 flex flex-col"
                  >
                    <div className="flex justify-between items-center mb-4 pb-3 border-b border-[rgba(255,255,255,0.05)]">
                      <div className="flex items-center gap-2 text-gray-400 text-[10px] md:text-xs font-medium">
                        <span>🏟️</span>
                        <span>{mac.saha || "Saha Belli Değil"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400 text-[10px] md:text-xs font-medium">
                        <span>📅</span>
                        <span>{mac.tarih || "Tarih Yok"}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between w-full">
                      <div className="flex flex-col items-center w-[35%] gap-2 text-center">
                        <div className="relative w-12 h-12 md:w-16 md:h-16 drop-shadow-lg">
                          {TEAM_LOGOS[mac.ev_sahibi] ? (
                            <Image src={TEAM_LOGOS[mac.ev_sahibi]} alt={mac.ev_sahibi} fill className="object-contain" />
                          ) : (
                            <div className="w-full h-full bg-black/30 rounded-full flex items-center justify-center text-gray-600 font-black">?</div>
                          )}
                        </div>
                        <span className="text-white font-bold text-[10px] md:text-xs uppercase line-clamp-2 leading-tight">
                          {mac.ev_sahibi}
                        </span>
                      </div>

                      <div className="flex flex-col items-center justify-center w-[30%]">
                        <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1">Başlama</span>
                        <div className="bg-[#070707] border border-[rgba(255,255,255,0.07)] rounded-xl px-2 md:px-4 py-1.5 md:py-2">
                          <span className="text-white font-black text-lg md:text-2xl">
                            {mac.durum === "ERTELENDİ" ? (
                              <span className="text-[#9e1b22] text-sm md:text-base">ERTELENDİ</span>
                            ) : mac.saat ? (
                              mac.saat.substring(0, 5)
                            ) : (
                              "--:--"
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-center w-[35%] gap-2 text-center">
                        <div className="relative w-12 h-12 md:w-16 md:h-16 drop-shadow-lg">
                          {TEAM_LOGOS[mac.deplasman] ? (
                            <Image src={TEAM_LOGOS[mac.deplasman]} alt={mac.deplasman} fill className="object-contain" />
                          ) : (
                            <div className="w-full h-full bg-black/30 rounded-full flex items-center justify-center text-gray-600 font-black">?</div>
                          )}
                        </div>
                        <span className="text-white font-bold text-[10px] md:text-xs uppercase line-clamp-2 leading-tight">
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
  );
}
