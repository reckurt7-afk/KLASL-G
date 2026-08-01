"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const takimlar = [
  { ad: "ALAÇAM SPOR", logo: "/logos/alacam-spor.png", link: "/takim/alacam-spor" },
  { ad: "KROKODİLLA FC", logo: "/logos/krokodilla-fc.png", link: "/takim/krokodilla-fc" },
  { ad: "DÜNDAR KÖYÜ", logo: "/logos/dundar-koyu.png", link: "/takim/dundar-koyu" },
  { ad: "YEŞİL BURSA FC", logo: "/logos/yesil-bursa-fc.png", link: "/takim/yesil-bursa-fc" },
  { ad: "YEDİYOL BLACK FC", logo: "/logos/yediyol-black-fc.png", link: "/takim/yediyol-black-fc" },
  { ad: "GRAVYER FC", logo: "/logos/gravyer-fc.png", link: "/takim/gravyer-fc" },
  { ad: "BİSKREM FC", logo: "/logos/biskrem-fc.png", link: "/takim/biskrem-fc" },
  { ad: "DİNAMO NALBANTOĞLU", logo: "/logos/dinamo-nalbantoglu.png", link: "/takim/dinamo-nalbantoglu" },
];

export default function TakimlarListesi() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-black text-white">👥 TAKIMLAR</h2>
        <p className="section-sub mt-2 tracking-[0.3em] font-bold text-[#ff3131]">KLAS LİG MÜCADELECİLERİ</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div key={idx} className="card p-4 md:p-6 flex flex-col items-center">
              <div className="skeleton w-[60px] h-[60px] md:w-[100px] md:h-[100px] rounded-full mb-4"></div>
              <div className="skeleton h-6 w-3/4 mb-4"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {takimlar.map((takim) => (
            <Link key={takim.ad} href={takim.link} className="group block">
              <div className="card h-full p-4 md:p-6 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2 hover:border-[#ff3131]/50 hover:shadow-[0_15px_30px_rgba(255,49,49,0.15)] relative overflow-hidden bg-[#111]">
                <div className="absolute inset-0 bg-gradient-to-b from-[#ff3131]/0 to-[#ff3131]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                <div className="relative w-[60px] h-[60px] md:w-[100px] md:h-[100px] mb-4 group-hover:scale-110 transition-transform duration-500">
                  <Image src={takim.logo} alt={takim.ad} fill className="object-contain drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)]" />
                </div>

                <div className="text-white text-sm md:text-xl font-black uppercase tracking-wide group-hover:text-[#ff3131] transition-colors mt-2 line-clamp-2">
                  {takim.ad}
                </div>
                
                <div className="w-8 h-1 bg-gradient-to-r from-transparent via-[#ff3131]/50 to-transparent my-3"></div>
                
                <div className="mt-auto w-full bg-black/40 rounded-xl py-2 flex items-center justify-center border border-white/5 group-hover:border-[#ff3131]/20">
                   <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider group-hover:text-white transition-colors">Kadroyu Gör ›</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
