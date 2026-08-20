"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { publicFetch } from "@/lib/supabase";

type Oyuncu = {
  id: number;
  ad_soyad: string;
  takim: string;
  mevki: string;
  foto_url?: string;
  genel_puan?: number;
};

const TEAM_LOGOS: Record<string, string> = {
  "PS 5": "/logos/ps5.png",
  "KROKODİLLA FC": "/logos/krokodilla-fc.png",
  "NOVA FC": "/logos/nova-fc.png",
  "YEŞİL BURSA FC": "/logos/yesil-bursa-fc.png",
  "YEDİYOL BLACK FC": "/logos/yediyol-black-fc.png",
  "GRAVYER FC": "/logos/gravyer-fc.png",
  "BİSKREM FC": "/logos/biskrem-fc.png",
  "DİNAMO NALBANTOĞLU": "/logos/dinamo-nalbantoglu.png",
};

export default function HaftaninYedisi() {
  const [kadro, setKadro] = useState<Oyuncu[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function kadroGetir() {
      const data = await publicFetch("oyuncular", "select=*");
      if (data && data.length > 0) {
        // 1. Prioritize players selected by admin in /admin/haftanin-yedisi (using is_premium field)
        const adminSelected = data.filter((o) => o.is_premium);
        if (adminSelected.length > 0) {
          // Sort by mevki (KL -> DEF -> OS -> FOR)
          const order: Record<string, number> = { "KL": 1, "DEF": 2, "OS": 3, "FOR": 4 };
          const sortedByPos = [...adminSelected].sort(
            (a, b) => (order[a.mevki] || 99) - (order[b.mevki] || 99)
          );
          setKadro(sortedByPos.slice(0, 7));
        } else {
          // 2. Fallback to top rating players
          const sorted = [...data].sort(
            (a, b) => (b.genel_puan || 85) - (a.genel_puan || 85)
          );
          setKadro(sorted.slice(0, 7));
        }
      }
      setLoading(false);
    }
    kadroGetir();
  }, []);

  const defaultPlayers: Oyuncu[] = [
    { id: 1, ad_soyad: "Ahmet Yılmaz", takim: "YEŞİL BURSA FC", mevki: "KL", genel_puan: 89 },
    { id: 2, ad_soyad: "Mehmet Demir", takim: "YEDİYOL BLACK FC", mevki: "DEF", genel_puan: 87 },
    { id: 3, ad_soyad: "Caner Erkin", takim: "KROKODİLLA FC", mevki: "DEF", genel_puan: 86 },
    { id: 4, ad_soyad: "Emre Belözoğlu", takim: "NOVA FC", mevki: "OS", genel_puan: 91 },
    { id: 5, ad_soyad: "Alex de Souza", takim: "GRAVYER FC", mevki: "OS", genel_puan: 94 },
    { id: 6, ad_soyad: "Gökdeniz Karadeniz", takim: "DİNAMO NALBANTOĞLU", mevki: "OS", genel_puan: 88 },
    { id: 7, ad_soyad: "Burak Yılmaz", takim: "PS 5", mevki: "FOR", genel_puan: 92 },
  ];

  const displayKadro = kadro.length >= 7 ? kadro : defaultPlayers;

  const positions = [
    { title: "KL", player: displayKadro[0], posClass: "bottom-[2%] left-1/2 -translate-x-1/2" },
    { title: "DEF", player: displayKadro[1], posClass: "bottom-[22%] left-[25%] -translate-x-1/2" },
    { title: "DEF", player: displayKadro[2], posClass: "bottom-[22%] left-[75%] -translate-x-1/2" },
    { title: "OS", player: displayKadro[3], posClass: "bottom-[48%] left-[18%] -translate-x-1/2" },
    { title: "OS", player: displayKadro[4], posClass: "bottom-[54%] left-1/2 -translate-x-1/2" },
    { title: "OS", player: displayKadro[5], posClass: "bottom-[48%] left-[82%] -translate-x-1/2" },
    { title: "FOR", player: displayKadro[6], posClass: "top-[6%] left-1/2 -translate-x-1/2" },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto my-6 px-2 sm:px-4">
      {/* CANLI PARLAK BAŞLIK */}
      <div className="text-center mb-6">
        <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#ffd700] via-[#fff] to-[#ffaa00] tracking-tight flex items-center justify-center gap-3 drop-shadow-[0_0_20px_rgba(255,215,0,0.5)]">
          <span>🌟</span> HAFTANIN 7'Sİ (İDEAL KADRO)
        </h2>
        <p className="text-[#ffd700] font-black tracking-[0.3em] text-xs md:text-sm mt-2 uppercase bg-[#ffd700]/10 border border-[#ffd700]/30 py-1 px-4 rounded-full inline-block shadow-[0_0_15px_rgba(255,215,0,0.2)]">
          3. HAFTANIN ALTIN KARMA KADROSU (2-3-1)
        </p>
      </div>

      {/* CANLI CANLI YEŞİL SAHA GÖRSELİ */}
      <div className="relative w-full max-w-[480px] mx-auto aspect-[2/3] md:aspect-[3/4] bg-gradient-to-b from-[#0e441f] via-[#155a2b] to-[#0e441f] rounded-[40px] border-[6px] border-[#00ff66]/40 shadow-[0_0_80px_rgba(0,255,102,0.3)] overflow-hidden p-4">
        
        {/* ÇİM ÇİZGİLERİ VE IŞILDAMA */}
        <div className="absolute inset-4 border-2 border-white/40 rounded-2xl pointer-events-none shadow-[inset_0_0_30px_rgba(255,255,255,0.1)]">
          {/* Saha Orta Çizgisi */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-white/40 -translate-y-1/2" />
          {/* Orta Saha Yuvarlağı */}
          <div className="absolute top-1/2 left-1/2 w-36 h-36 md:w-56 md:h-56 border-2 border-white/40 rounded-full -translate-x-1/2 -translate-y-1/2" />
          {/* Üst Ceza Sahası */}
          <div className="absolute top-0 left-1/2 w-52 sm:w-72 h-28 border-b-2 border-x-2 border-white/40 -translate-x-1/2 rounded-b-xl" />
          {/* Alt Ceza Sahası */}
          <div className="absolute bottom-0 left-1/2 w-52 sm:w-72 h-28 border-t-2 border-x-2 border-white/40 -translate-x-1/2 rounded-t-xl" />
        </div>

        {/* PARLAK YEŞİL ÇİM EFEKTİ */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#00ff66]/20 via-transparent to-black/80 pointer-events-none" />

        {/* SAHADAKİ EA FC OYUNCU KARTLARI */}
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center text-white font-black text-lg">
            Kadro Hazırlanıyor...
          </div>
        ) : (
          positions.map((item, idx) => {
            const p = item.player;
            const logo = TEAM_LOGOS[p?.takim || ""];

            return (
              <Link
                key={idx}
                href={p ? `/oyuncu/${p.id}` : "#"}
                className={`absolute ${item.posClass} flex flex-col items-center group transition-all duration-300 hover:scale-115 z-10`}
              >
                {/* CANLI PARLAK EA FC KARTI */}
                <div className="relative w-16 h-22 sm:w-22 sm:h-30 md:w-28 md:h-36 bg-gradient-to-b from-[#ffe066] via-[#d49b00] to-[#594000] border-2 border-yellow-200 rounded-xl sm:rounded-2xl p-1.5 flex flex-col items-center justify-between shadow-[0_8px_25px_rgba(255,215,0,0.6)] group-hover:shadow-[0_0_30px_rgba(255,215,0,0.9)] group-hover:border-white transition-all">
                  
                  {/* TOP RATING & MEVKİ */}
                  <div className="w-full flex justify-between items-center text-[11px] sm:text-sm font-black text-black leading-none drop-shadow-sm">
                    <span className="bg-black/20 px-1 rounded text-white font-extrabold">{p?.genel_puan || 85}</span>
                    <span className="text-black font-black uppercase">{item.title}</span>
                  </div>

                  {/* PLAYER AVATAR */}
                  <div className="relative w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-white/60 bg-black/30 my-0.5 shadow-md">
                    {p?.foto_url ? (
                      <Image
                        src={p.foto_url}
                        alt={p.ad_soyad}
                        fill
                        className="object-cover object-top"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sm sm:text-xl">
                        ⚽
                      </div>
                    )}
                  </div>

                  {/* TEAM LOGO MINI */}
                  {logo && (
                    <div className="relative w-4 h-4 sm:w-5 sm:h-5 drop-shadow">
                      <Image src={logo} alt={p?.takim || ""} fill className="object-contain" />
                    </div>
                  )}
                </div>

                {/* OYUNCU İSİM ROZETİ */}
                <div className="mt-1 bg-gradient-to-r from-black via-[#111] to-black border border-[#ffd700]/60 px-2.5 py-0.5 rounded-full text-center max-w-[100px] sm:max-w-[140px] shadow-[0_4px_10px_rgba(0,0,0,0.8)] group-hover:border-[#ffd700]">
                  <p className="text-[#ffd700] font-black text-[10px] sm:text-xs truncate tracking-tight">
                    {p?.ad_soyad || "Oyuncu"}
                  </p>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
