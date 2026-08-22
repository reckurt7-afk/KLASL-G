"use client";

import { useEffect, useState } from "react";
import { publicFetch } from "@/lib/supabase";
import { useCityStore } from "@/app/store/cityStore";

type Takim = {
  id: number;
  name: string;
  logo: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goals_for: number;
  goals_against: number;
  goal_difference: number;
  points: number;
};

export default function PuanDurumuTablosu({ mini = false }: { mini?: boolean }) {
  const { selectedCityId } = useCityStore();
  const [takimlar, setTakimlar] = useState<Takim[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    async function takimlariGetir() {
      // NOTE: using "takimlar" or "teams" based on backend logic
      // In the redesign we don't break existing data logic, just UX
      const data = await publicFetch(
        "teams",
        "select=*&order=points.desc,goal_difference.desc"
      );
      if (data.length > 0) setTakimlar(data);
      setLoading(false);
    }
    takimlariGetir();
  }, [selectedCityId]);

  const displayTakimlar = mini ? takimlar.slice(0, 5) : takimlar;

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-4 w-full h-[400px] animate-pulse">
        <div className="h-8 bg-gray-100 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          {[1,2,3,4,5].map(i => <div key={i} className="h-10 bg-gray-50 rounded"></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden w-full">
      {!mini && (
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gray-50 flex items-center justify-center border border-gray-100">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5"><path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 4h10l1 13H6L7 4z"/></svg>
          </div>
          <h2 className="font-bold text-gray-900 text-lg">Puan Durumu</h2>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="bg-[#f8f9fa] text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 w-10 text-center">#</th>
              <th className="px-4 py-3 text-left">Takım</th>
              <th className="px-3 py-3 text-center">O</th>
              <th className="px-3 py-3 text-center hidden sm:table-cell">G</th>
              <th className="px-3 py-3 text-center hidden sm:table-cell">B</th>
              <th className="px-3 py-3 text-center hidden sm:table-cell">M</th>
              {!mini && <th className="px-3 py-3 text-center hidden md:table-cell">A</th>}
              {!mini && <th className="px-3 py-3 text-center hidden md:table-cell">Y</th>}
              <th className="px-3 py-3 text-center">AV</th>
              <th className="px-4 py-3 text-center text-gray-900">P</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {displayTakimlar.map((takim, index) => {
              // Championship zone logic
              const isChamp = index === 0;
              const isRelegation = index >= takimlar.length - 2 && takimlar.length > 5 && !mini;

              return (
                <tr key={takim.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                        ${isChamp ? 'bg-green-100 text-green-700' : isRelegation ? 'bg-red-100 text-red-700' : 'text-gray-500'}
                      `}>
                        {index + 1}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-900">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex-shrink-0 flex items-center justify-center overflow-hidden">
                        {takim.logo ? (
                          <img src={takim.logo} alt={takim.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[9px] text-gray-400">LOGO</span>
                        )}
                      </div>
                      <span className="group-hover:text-[#e50914] transition-colors">{takim.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-center font-medium text-gray-600">{takim.played || 0}</td>
                  <td className="px-3 py-3 text-center text-gray-500 hidden sm:table-cell">{takim.won || 0}</td>
                  <td className="px-3 py-3 text-center text-gray-500 hidden sm:table-cell">{takim.drawn || 0}</td>
                  <td className="px-3 py-3 text-center text-gray-500 hidden sm:table-cell">{takim.lost || 0}</td>
                  {!mini && <td className="px-3 py-3 text-center text-gray-500 hidden md:table-cell">{takim.goals_for || 0}</td>}
                  {!mini && <td className="px-3 py-3 text-center text-gray-500 hidden md:table-cell">{takim.goals_against || 0}</td>}
                  <td className="px-3 py-3 text-center font-medium text-gray-600">{takim.goal_difference || 0}</td>
                  <td className="px-4 py-3 text-center font-black text-gray-900 text-base">{takim.points || 0}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {!mini && (
        <div className="bg-gray-50 px-5 py-3 border-t border-gray-200 flex gap-4 text-[11px] font-medium text-gray-500">
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-500"></span> Şampiyonluk / Play-off</div>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Küme Düşme</div>
        </div>
      )}
    </div>
  );
}
