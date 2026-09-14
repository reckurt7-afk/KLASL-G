"use client";

import { useCityStore } from "../store/cityStore";
import { useEffect, useState } from "react";
import { publicFetch } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";

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
        const parsed = (data || []).map((d: any) => {
          let ozet = d.aciklama || "";
          let resim = "/icons/prime-logo.jpg"; // Default premium logo if no image
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
            kategori: d.renk || "KAP",
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
      
      {/* Premium Header Banner */}
      <div className="relative w-full overflow-hidden rounded-[20px] mb-6 md:mb-8 shadow-[0_8px_24px_rgba(158,27,34,0.15)] group">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f1115] via-[#1a0507] to-[#9e1b22] z-0" />
        {/* Subtle pattern or texture could go here */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#ceaa52] via-transparent to-transparent z-0" />
        
        <div className="relative z-10 flex items-center p-5 md:p-6 gap-4">
          <div className="w-14 h-14 md:w-16 md:h-16 relative bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-inner shrink-0">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ceaa52" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/>
              <path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/>
            </svg>
          </div>
          
          <div className="flex flex-col justify-center flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#ceaa52] animate-pulse" />
              <span className="text-[10px] md:text-[11px] font-bold tracking-[0.2em] text-[#ceaa52] uppercase">
                RESMİ BİLDİRİM EKRANI
              </span>
            </div>
            <h1 className="text-[20px] md:text-[24px] font-black text-white leading-tight tracking-tight">
              {cityName} Transfer KAP
            </h1>
          </div>

          <div className="hidden sm:flex flex-col items-center justify-center px-4 border-l border-white/10 ml-auto">
            <span className="text-[24px] font-black text-white leading-none">{haberler.length}</span>
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-1">Bildirim</span>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="w-full py-16 flex flex-col items-center justify-center gap-4">
          <div className="w-10 h-10 border-4 border-[#ceaa52] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-bold text-gray-400 animate-pulse">KAP Bildirimleri Yükleniyor...</span>
        </div>
      ) : haberler.length === 0 ? (
        <div className="w-full py-20 flex flex-col items-center justify-center bg-gray-50 rounded-[20px] border border-gray-100">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ceaa52" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-4 opacity-50"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          <span className="text-gray-500 font-bold text-center">Henüz güncel bir transfer bildirimi bulunmuyor.</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
          {haberler.map((haber) => (
            <Link 
              key={haber.id} 
              href={`/duyuru/${haber.id}`}
              className="relative w-full aspect-[4/5] sm:aspect-[3/4] rounded-[16px] overflow-hidden group cursor-pointer block bg-[#0f1115] border border-gray-200 hover:border-[#ceaa52]/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.12)]"
            >
              {/* Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" 
                style={{ backgroundImage: `url(${haber.resim})` }}
              />
              
              {/* Premium Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent z-0" />
              
              {/* Top Badges */}
              <div className="absolute top-3 left-3 right-3 flex justify-between items-center z-10">
                <span className="bg-black/40 backdrop-blur-md text-white text-[9px] font-bold px-2 py-1 rounded-md border border-white/10 uppercase tracking-wider">
                  {formatDate(haber.created_at)}
                </span>
                <span className="bg-[#9e1b22] text-white text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-widest shadow-md">
                  {haber.kategori}
                </span>
              </div>

              {/* Bottom Content */}
              <div className="absolute inset-x-0 bottom-0 p-4 md:p-5 flex flex-col z-10">
                <h3 className="text-white font-black text-[15px] md:text-[16px] leading-snug line-clamp-2 mb-2 group-hover:text-[#ceaa52] transition-colors">
                  {haber.baslik}
                </h3>
                {haber.ozet && (
                  <p className="text-gray-300 text-[11px] md:text-[12px] line-clamp-2 mb-3 opacity-90 leading-relaxed">
                    {haber.ozet}
                  </p>
                )}
                
                {/* Read More button */}
                <div className="flex items-center gap-1.5 mt-auto">
                  <span className="text-[#ceaa52] text-[10px] font-black tracking-widest uppercase group-hover:text-white transition-colors">
                    DETAYLARI İNCELE
                  </span>
                  <div className="w-5 h-5 rounded-full bg-[#ceaa52]/20 flex items-center justify-center group-hover:bg-[#ceaa52] transition-colors">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-[#ceaa52] group-hover:text-white transition-colors" strokeWidth="2.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
