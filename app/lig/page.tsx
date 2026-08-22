"use client";

import { useCityStore } from "../store/cityStore";
import { useEffect, useState } from "react";
import { publicFetch } from "@/lib/supabase";
import Link from "next/link";

type Haber = {
  id: number;
  baslik: string;
  ozet: string;
  resim: string | null;
  kategori: string;
  created_at: string;
};

export default function LigMerkezi() {
  const { selectedCityId } = useCityStore();
  const [haberler, setHaberler] = useState<Haber[]>([]);
  const [loading, setLoading] = useState(true);

  // Selected city name can be derived from ID. For now just mock.
  const cityName = selectedCityId === 1 ? "Bursa" : selectedCityId === 2 ? "İstanbul" : selectedCityId === 3 ? "İzmir" : "Türkiye";

  useEffect(() => {
    async function fetchHaberler() {
      try {
        const data = await publicFetch("duyurular", "select=*&renk=eq.KAP&order=created_at.desc");
        const parsed = data.map((d: any) => {
          let ozet = d.aciklama || "";
          let resim = "/images/default-kap.jpg";
          try {
            const j = JSON.parse(d.aciklama || "{}");
            if (j.ozet !== undefined) {
              ozet = j.ozet;
              if (j.resim) resim = j.resim;
            }
          } catch {}
          return {
            id: d.id,
            baslik: d.baslik,
            ozet,
            resim,
            kategori: d.renk || "HABER",
            created_at: d.created_at
          };
        });
        setHaberler(parsed);
      } catch (err) {
        console.error("Haberler yüklenemedi", err);
      } finally {
        setLoading(false);
      }
    }
    fetchHaberler();
  }, [selectedCityId]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getDate()} ${d.toLocaleString('tr-TR', { month: 'short' }).toUpperCase()} ${d.getFullYear()}`;
  };

  return (
    <div className="w-full flex flex-col fade-in">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-5 bg-white h-[70px] rounded-xl border border-gray-100 shadow-sm px-4">
         <div className="w-12 h-12 bg-[#e50914] rounded-xl flex items-center justify-center text-white shadow-sm shrink-0">
           <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg>
         </div>
         <div className="flex flex-col justify-center">
           <h1 className="text-[15px] md:text-[17px] font-black text-[#1a1a2e] leading-none mb-1">{cityName} Haberleri</h1>
           <p className="text-[11px] md:text-[12px] text-gray-500 font-medium leading-none">Şehrin son gelişmeleri ve haberler</p>
         </div>
         <div className="ml-auto w-7 h-7 bg-red-50 text-[#e50914] rounded-full flex items-center justify-center text-[11px] font-black shrink-0">
            {haberler.length}
         </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="w-full py-12 flex justify-center"><div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div></div>
      ) : haberler.length === 0 ? (
        <div className="w-full py-12 text-center text-gray-500 font-bold">Henüz haber bulunmuyor.</div>
      ) : (
        <div className="flex flex-wrap gap-3 md:gap-4 w-full">
          {haberler.map((haber) => (
            <Link 
              key={haber.id} 
              href={`/duyuru/${haber.id}`}
              className="relative w-[150px] h-[210px] md:w-[170px] md:h-[240px] rounded-[14px] overflow-hidden group cursor-pointer shadow-sm block shrink-0"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500" 
                style={{ backgroundImage: `url(${haber.resim})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
              
              {/* Top Badges */}
              <div className="absolute top-2.5 left-2.5 right-2.5 flex justify-between items-center z-10">
                <span className="bg-[#1a1a2e]/80 backdrop-blur-sm text-white text-[8px] font-bold px-1.5 py-0.5 rounded border border-white/10 uppercase tracking-wider">
                  {formatDate(haber.created_at)}
                </span>
                <span className="bg-[#e50914] text-white text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shadow-sm">
                  {haber.kategori.toUpperCase()}
                </span>
              </div>

              {/* Bottom Content */}
              <div className="absolute inset-x-0 bottom-0 p-3 flex flex-col z-10">
                <h3 className="text-white font-black text-[12px] md:text-[13px] leading-tight line-clamp-2 mb-1 group-hover:text-red-400 transition-colors">
                  {haber.baslik}
                </h3>
                <p className="text-gray-300 text-[9px] md:text-[10px] font-bold opacity-90 mt-1 flex items-center gap-1 group-hover:text-white transition-colors uppercase">
                  DEVAMINI OKU
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

