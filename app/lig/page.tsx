"use client";

import { useCityStore } from "../store/cityStore";
import { useEffect, useState } from "react";
import { publicFetch } from "@/lib/supabase";
import NewsGrid from "../components/NewsGrid";
import MatchCard from "../components/MatchCard";

export default function LigMerkezi() {
  const { selectedCityId } = useCityStore();
  const [haberler, setHaberler] = useState<any[]>([]);
  const [maclar, setMaclar] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Fetch News
        const newsData = await publicFetch("duyurular", "select=*&order=created_at.desc&limit=5");
        const parsedNews = newsData.map((d: any) => {
          let resim = "/images/default-kap.jpg";
          let ozet = d.aciklama || "";
          try {
            const j = JSON.parse(d.aciklama || "{}");
            if (j.ozet !== undefined) ozet = j.ozet;
            if (j.resim) resim = j.resim;
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
        setHaberler(parsedNews);

        // Fetch Matches (Live and Recent)
        const matchData = await publicFetch(
          "maclar",
          "select=*,takimlar_ev_sahibi:ev_sahibi(ad,logo),takimlar_deplasman:deplasman(ad,logo)&order=canli.desc,tarih.desc&limit=6"
        );
        setMaclar(matchData);

      } catch (err) {
        console.error("Veri yüklenemedi", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [selectedCityId]);

  return (
    <div className="w-full flex flex-col p-4 md:p-6 lg:p-8 fade-in space-y-8">
      {/* 1. Haberler & Gündem */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-5 bg-[#e50914] rounded-full"></div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Gündem</h2>
        </div>
        
        {loading ? (
          <div className="h-[300px] w-full bg-gray-100 animate-pulse rounded-2xl"></div>
        ) : (
          <NewsGrid news={haberler} />
        )}
      </section>

      {/* 2. Son Maçlar & Canlı */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-5 bg-[#e50914] rounded-full"></div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Maçlar</h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[1,2,3].map(i => <div key={i} className="h-28 bg-gray-100 animate-pulse rounded-xl"></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {maclar.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
