"use client";

import Link from "next/link";
import { Clock } from "lucide-react";

interface Haber {
  id: number;
  baslik: string;
  ozet: string;
  resim: string;
  kategori: string;
  created_at: string;
}

interface NewsGridProps {
  news: Haber[];
}

export default function NewsGrid({ news }: NewsGridProps) {
  if (!news || news.length === 0) return null;

  const mainNews = news[0];
  const sideNews = news.slice(1, 4); // Max 3 items on the side

  return (
    <div className="flex flex-col xl:flex-row gap-4 mb-8">
      {/* Main News (Large) */}
      <Link href={`/duyuru/${mainNews.id}`} className="group relative w-full xl:w-2/3 h-[300px] md:h-[400px] rounded-2xl overflow-hidden block">
        <img 
          src={mainNews.resim} 
          alt={mainNews.baslik} 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="bg-[#e50914] text-white text-[10px] font-bold px-2.5 py-1 rounded-sm uppercase tracking-wider">
              {mainNews.kategori}
            </span>
            <div className="flex items-center text-gray-300 text-[11px] font-medium gap-1">
              <Clock className="w-3 h-3" />
              <span>{new Date(mainNews.created_at).toLocaleDateString('tr-TR')}</span>
            </div>
          </div>
          <h2 className="text-white text-xl md:text-3xl font-bold leading-tight mb-2 group-hover:text-red-100 transition-colors line-clamp-2">
            {mainNews.baslik}
          </h2>
          {mainNews.ozet && (
            <p className="text-gray-300 text-sm md:text-base line-clamp-2 hidden md:block">
              {mainNews.ozet}
            </p>
          )}
        </div>
      </Link>

      {/* Side News (List) */}
      <div className="flex flex-col gap-4 w-full xl:w-1/3">
        {sideNews.map((item) => (
          <Link key={item.id} href={`/duyuru/${item.id}`} className="group flex gap-4 h-[90px] xl:h-[124px] bg-white rounded-xl p-2 md:p-3 border border-gray-200 hover:border-gray-300 transition-colors hover:shadow-sm">
            <div className="w-[100px] xl:w-[120px] h-full rounded-lg overflow-hidden flex-shrink-0 relative">
              <img 
                src={item.resim} 
                alt={item.baslik} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="flex flex-col justify-center py-1">
              <span className="text-[#e50914] text-[10px] font-bold uppercase tracking-wider mb-1">
                {item.kategori}
              </span>
              <h3 className="text-[#111111] text-sm font-bold leading-snug line-clamp-3 group-hover:text-[#e50914] transition-colors">
                {item.baslik}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
