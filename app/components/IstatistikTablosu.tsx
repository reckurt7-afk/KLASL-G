"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { publicFetch } from "@/lib/supabase";

type OyuncuStat = {
  id: number;
  ad_soyad: string;
  takim: string;
  mevki?: string;
  gol?: number;
  asist?: number;
  mac?: number;
  foto_url?: string;
  genel_puan?: number;
};

const TEAM_LOGOS: Record<string, string> = {
  "PS 5": "/logos/ps5.jpg",
  "KROKODİLLA FC": "/logos/krokodilla-fc.png",
  "DÜNDAR KÖYÜ": "/logos/dundar-koyu.png",
  "YEŞİL BURSA FC": "/logos/yesil-bursa-fc.png",
  "YEDİYOL BLACK FC": "/logos/yediyol-black-fc.png",
  "GRAVYER FC": "/logos/gravyer-fc.png",
  "BİSKREM FC": "/logos/biskrem-fc.png",
  "DİNAMO NALBANTOĞLU": "/logos/dinamo-nalbantoglu.png",
};

export default function IstatistikTablosu() {
  const [tab, setTab] = useState<"gol" | "asist" | "kaleci">("gol");
  const [oyuncular, setOyuncular] = useState<OyuncuStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function istatistikleriGetir() {
      setLoading(true);
      // Fetch players with stats
      const data = await publicFetch("oyuncular", "select=*");
      if (data && data.length > 0) {
        setOyuncular(data);
      }
      setLoading(false);
    }
    istatistikleriGetir();
  }, []);

  // Filter & Sort based on active tab
  const filteredOyuncular = [...oyuncular]
    .sort((a, b) => {
      if (tab === "gol") {
        return (b.gol || 0) - (a.gol || 0);
      } else if (tab === "asist") {
        return (b.asist || 0) - (a.asist || 0);
      } else {
        // Kaleci filter by position or rating
        const isA = a.mevki?.toLowerCase().includes("kale") || a.mevki?.toLowerCase().includes("kl");
        const isB = b.mevki?.toLowerCase().includes("kale") || b.mevki?.toLowerCase().includes("kl");
        if (isA && !isB) return -1;
        if (!isA && isB) return 1;
        return (b.genel_puan || 0) - (a.genel_puan || 0);
      }
    })
    .slice(0, 8);

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* SECTION HEADER */}
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
          ⚡ İSTATİSTİK LİDERLERİ
        </h2>
        <p className="text-[#ff3131] font-bold tracking-[0.3em] text-xs md:text-sm mt-2 uppercase">
          SEZONUN EN İYİLERİ
        </p>
      </div>

      {/* TABS BUTTONS */}
      <div className="flex justify-center items-center gap-2 md:gap-4 mb-8 bg-[#0f0f0f]/90 p-2 rounded-2xl border border-white/10 backdrop-blur-md max-w-md mx-auto">
        <button
          onClick={() => setTab("gol")}
          className={`flex-1 py-3 px-4 rounded-xl font-black text-xs md:text-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
            tab === "gol"
              ? "bg-[#ff3131] text-white shadow-[0_0_15px_rgba(255,49,49,0.5)] scale-[1.02]"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <span>⚽</span> GOL KRALLIĞI
        </button>
        <button
          onClick={() => setTab("asist")}
          className={`flex-1 py-3 px-4 rounded-xl font-black text-xs md:text-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
            tab === "asist"
              ? "bg-[#ff3131] text-white shadow-[0_0_15px_rgba(255,49,49,0.5)] scale-[1.02]"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <span>🎯</span> ASİST KRALLIĞI
        </button>
        <button
          onClick={() => setTab("kaleci")}
          className={`flex-1 py-3 px-4 rounded-xl font-black text-xs md:text-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
            tab === "kaleci"
              ? "bg-[#ff3131] text-white shadow-[0_0_15px_rgba(255,49,49,0.5)] scale-[1.02]"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <span>🧤</span> PANTERLER
        </button>
      </div>

      {/* LEADERBOARD CARDS / LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-[#111] p-4 rounded-2xl border border-white/5 animate-pulse flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-full" />
                <div>
                  <div className="w-32 h-4 bg-white/10 rounded mb-2" />
                  <div className="w-20 h-3 bg-white/10 rounded" />
                </div>
              </div>
              <div className="w-10 h-8 bg-white/10 rounded" />
            </div>
          ))
        ) : filteredOyuncular.length === 0 ? (
          <div className="col-span-2 text-center text-gray-400 py-12">
            Henüz istatistik verisi bulunmuyor.
          </div>
        ) : (
          filteredOyuncular.map((o, idx) => {
            const teamLogo = TEAM_LOGOS[o.takim];
            const statValue =
              tab === "gol"
                ? o.gol || 0
                : tab === "asist"
                ? o.asist || 0
                : o.genel_puan || 85;

            // Medals for top 3
            const rankBadge =
              idx === 0
                ? "👑"
                : idx === 1
                ? "🥈"
                : idx === 2
                ? "🥉"
                : `#${idx + 1}`;

            const rankStyle =
              idx === 0
                ? "text-yellow-400 bg-yellow-400/10 border-yellow-400/30"
                : idx === 1
                ? "text-gray-300 bg-gray-300/10 border-gray-300/30"
                : idx === 2
                ? "text-amber-600 bg-amber-600/10 border-amber-600/30"
                : "text-gray-400 bg-white/5 border-white/10";

            return (
              <Link
                key={o.id || idx}
                href={`/oyuncu/${o.id}`}
                className="group relative bg-[#0f0f0f]/80 hover:bg-[#151515] border border-white/10 hover:border-[#ff3131]/40 rounded-2xl p-4 transition-all duration-300 flex items-center justify-between backdrop-blur-md shadow-lg"
              >
                {/* LEFT: RANK & PLAYER INFO */}
                <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                  {/* Rank Badge */}
                  <div
                    className={`w-9 h-9 rounded-xl border flex items-center justify-center font-black text-sm shrink-0 ${rankStyle}`}
                  >
                    {rankBadge}
                  </div>

                  {/* Player Image / Avatar */}
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border border-white/10 shrink-0 bg-white/5 group-hover:scale-105 transition-transform">
                    {o.foto_url ? (
                      <Image
                        src={o.foto_url}
                        alt={o.ad_soyad}
                        fill
                        className="object-cover object-top"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl">
                        ⚽
                      </div>
                    )}
                  </div>

                  {/* Names */}
                  <div className="min-w-0">
                    <h4 className="text-white font-black text-base md:text-lg group-hover:text-[#ff3131] transition-colors truncate">
                      {o.ad_soyad}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      {teamLogo && (
                        <div className="relative w-4 h-4 shrink-0">
                          <Image src={teamLogo} alt={o.takim} fill className="object-contain" />
                        </div>
                      )}
                      <span className="text-gray-400 text-xs font-semibold truncate">
                        {o.takim}
                      </span>
                    </div>
                  </div>
                </div>

                {/* RIGHT: STAT COUNT */}
                <div className="flex flex-col items-end shrink-0 pl-3">
                  <span className="text-2xl md:text-3xl font-black text-white group-hover:text-[#ff3131] transition-colors leading-none">
                    {statValue}
                  </span>
                  <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider mt-1">
                    {tab === "gol" ? "GOL" : tab === "asist" ? "ASİST" : "RATING"}
                  </span>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
