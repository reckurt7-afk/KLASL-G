"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { publicFetch } from "@/lib/supabase";
import { useCityStore } from "@/app/store/cityStore";

type Oyuncu = {
  id: number;
  ad_soyad: string;
  takim: string;
  mevki: string;
  gol: number;
  asist: number;
  mac: number;
  genel_puan: number;
};

export default function AdminIstatistiklerPage() {
  const [oyuncular, setOyuncular] = useState<Oyuncu[]>([]);
  const [loading, setLoading] = useState(true);
  const { selectedCityId } = useCityStore();

  useEffect(() => {
    fetchOyuncular();
  }, [selectedCityId]);

  async function fetchOyuncular() {
    setLoading(true);
    // Fetch all players using publicFetch, ordered by goals then assists
    const data = await publicFetch("oyuncular", `select=*&order=gol.desc,asist.desc,ad_soyad.asc`);
    
    if (data && data.length > 0) {
      // DEDUPLICATE BY NAME: Keep only 1 record per player name
      const map = new Map<string, Oyuncu>();
      data.forEach((o) => {
        const norm = (o.ad_soyad || "").trim().toLowerCase();
        if (!map.has(norm)) {
          map.set(norm, {
            ...o,
            gol: o.gol || 0,
            asist: o.asist || 0,
            mac: o.mac || 0,
            genel_puan: o.genel_puan || 85,
          });
        }
      });

      // Map values and sort again just to be safe
      const sorted = Array.from(map.values()).sort((a, b) => b.gol - a.gol || b.asist - a.asist);
      setOyuncular(sorted);
    } else {
      setOyuncular([]);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 border-b border-white/10 pb-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-black text-white flex items-center gap-3">
              👑 GOL & ASİST KRALLIĞI (OTOMATİK)
            </h1>
            <p className="text-gray-400 text-sm mt-2 max-w-2xl">
              Bu tablo, <strong className="text-[#ff3131]">Maç Sonucu</strong> ve <strong className="text-[#ff3131]">Canlı Maç</strong> ekranlarından girilen maç olaylarına (Gol/Asist) göre <strong className="text-white">otomatik</strong> olarak hesaplanır. Manuel müdahale kapalıdır.
            </p>
          </div>

          <Link
            href="/admin"
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-sm transition-all"
          >
            ← Admin Paneline Dön
          </Link>
        </div>

        {/* PLAYERS LIST TABLE */}
        <div className="bg-[#121212] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#1a1a1a] text-gray-400 uppercase text-xs font-black border-b border-white/10">
                <tr>
                  <th className="p-4 text-center w-12">#</th>
                  <th className="p-4">Oyuncu Adı</th>
                  <th className="p-4">Takım</th>
                  <th className="p-4 text-center">⚽ Gol</th>
                  <th className="p-4 text-center">👟 Asist</th>
                  <th className="p-4 text-center">👕 Maç</th>
                  <th className="p-4 text-center">⭐ Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center p-8 text-gray-400 font-bold">
                      İstatistikler Yükleniyor...
                    </td>
                  </tr>
                ) : oyuncular.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center p-8 text-gray-400">
                      Henüz istatistik bulunmuyor. Maç olayları girildikçe bu tablo dolacaktır.
                    </td>
                  </tr>
                ) : (
                  oyuncular.map((o, index) => (
                    <tr key={o.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 text-center font-black text-gray-500">
                        {index + 1}
                      </td>
                      <td className="p-4 font-black text-white flex items-center gap-3">
                        {index === 0 && <span className="text-2xl" title="Gol Kralı">👑</span>}
                        {o.ad_soyad}
                      </td>
                      <td className="p-4 text-gray-400 font-semibold">{o.takim}</td>
                      <td className="p-4 text-center font-black text-[#ff3131] text-lg">
                        {o.gol}
                      </td>
                      <td className="p-4 text-center font-black text-blue-400 text-lg">
                        {o.asist}
                      </td>
                      <td className="p-4 text-center font-bold text-gray-300">
                        {o.mac}
                      </td>
                      <td className="p-4 text-center font-black text-yellow-400">
                        {o.genel_puan}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
