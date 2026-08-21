"use client";

import { useEffect, useState } from "react";
import { useCityStore } from "@/app/store/cityStore";
import { publicFetch } from "@/lib/supabase";
import OyuncuKarti from "./OyuncuKarti";

type Oyuncu = {
  id: number;
  ad_soyad: string;
  takim: string;
  mevki: string;
  genel_puan: number;
  foto_url?: string;
  gol?: number;
  asist?: number;
  oynanan_mac?: number;
};

export default function TransferBorsasi() {
  const { selectedCityId } = useCityStore();

  const [isOpen, setIsOpen] = useState<boolean | null>(null);
  const [oyuncular, setOyuncular] = useState<Oyuncu[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchBorsaData();
  }, [selectedCityId]);

  async function fetchBorsaData() {
    setLoading(true);

    // 1. Check if Transfer Window is open
    const settings = await publicFetch("ayarlar", "select=*&anahtar=eq.transfer_donemi");
    let acikMi = false;
    if (settings && settings.length > 0) {
      acikMi = settings[0].deger === "acik";
    }
    setIsOpen(acikMi);

    // 2. If open, fetch players and sort by value
    if (acikMi) {
      const data = await publicFetch("oyuncular", "select=*");
      if (data && data.length > 0) {
        
        // Remove duplicates by name
        const map = new Map<string, Oyuncu>();
        data.forEach((o) => {
          const norm = (o.ad_soyad || "").trim().toLowerCase();
          if (!map.has(norm)) {
            map.set(norm, o);
          }
        });

        const uniqueOyuncular = Array.from(map.values());

        // Sort by calculated market value (same formula as OyuncuKarti)
        const getMarketValue = (o: Oyuncu) => {
          const base = (o.genel_puan || 85) * 15000;
          const gol = (o.gol || 0) * 50000;
          const asist = (o.asist || 0) * 30000;
          const mac = (o.oynanan_mac || 0) * 10000;
          
          const fullName = (o.ad_soyad || "").trim();
          const nameSeed = fullName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
          const variation = ((nameSeed * 13 + o.id * 97) % 250) * 10000;
          
          return base + gol + asist + mac + variation;
        };

        const sorted = uniqueOyuncular.sort((a, b) => getMarketValue(b) - getMarketValue(a));
        setOyuncular(sorted);
      }
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center text-white font-black text-xl animate-pulse">
        Borsa Verileri Yükleniyor...
      </div>
    );
  }

  if (!isOpen) {
    return (
      <div className="w-full flex flex-col items-center justify-center min-h-[50vh] text-center p-8 bg-black/40 rounded-3xl border border-white/5 shadow-2xl">
        <div className="text-8xl mb-6 drop-shadow-[0_0_30px_rgba(255,49,49,0.5)] animate-bounce">
          🔒
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
          TRANSFER DÖNEMİ <span className="text-[#ff3131]">KAPALI</span>
        </h2>
        <p className="text-gray-400 text-base md:text-lg max-w-lg font-medium">
          Klas Lig Bursa'da transfer dönemi şu an itibariyle kapalıdır. Pazar tekrar açıldığında yeni rekor bonservis bedelleriyle görüşmek üzere!
        </p>
      </div>
    );
  }

  // Filter for search
  const filteredOyuncular = oyuncular.filter(
    (o) =>
      o.ad_soyad.toLowerCase().includes(search.toLowerCase()) ||
      o.takim.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full max-w-7xl mx-auto my-4 px-2 sm:px-4">
      
      {/* HEADER SECTION */}
      <div className="text-center mb-10">
        <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#ffd700] via-[#fff] to-[#ffaa00] tracking-tight flex items-center justify-center gap-3 drop-shadow-[0_0_20px_rgba(255,215,0,0.5)]">
          💸 TRANSFER BORSASI
        </h2>
        <p className="text-[#ffd700] font-black tracking-[0.2em] text-xs md:text-sm mt-3 uppercase bg-[#ffd700]/10 border border-[#ffd700]/30 py-1.5 px-6 rounded-full inline-block shadow-[0_0_15px_rgba(255,215,0,0.2)] backdrop-blur-md">
          PİYASA DEĞERİNE GÖRE SIRALANMIŞTIR
        </p>
      </div>

      {/* SEARCH BAR */}
      <div className="max-w-xl mx-auto mb-10 relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
        <input
          type="text"
          placeholder="Oyuncu veya takım adı ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-[#111] border-2 border-white/10 rounded-2xl font-bold text-white text-lg focus:border-[#ffd700] focus:bg-black transition-all shadow-xl outline-none"
        />
      </div>

      {/* PLAYERS GRID */}
      {filteredOyuncular.length === 0 ? (
        <div className="text-center py-20 text-gray-500 font-bold text-xl">
          Aranan kriterlere uygun oyuncu bulunamadı.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
          {filteredOyuncular.map((o) => (
            <OyuncuKarti
              key={o.id}
              id={o.id}
              ad={o.ad_soyad}
              soyad=""
              fotograf={o.foto_url}
              mevki={o.mevki || "OS"}
              takimAd={o.takim}
              rating={o.genel_puan || 85}
              golSayisi={o.gol || 0}
              asistSayisi={o.asist || 0}
              macSayisi={o.oynanan_mac || 0}
              kartTipi={o.genel_puan && o.genel_puan >= 90 ? "hero" : "totw"}
            />
          ))}
        </div>
      )}
    </div>
  );
}
