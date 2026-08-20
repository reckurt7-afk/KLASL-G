"use client";

import { useEffect, useState } from "react";
import { publicFetch } from "../../lib/supabase";
import Image from "next/image";

type Mac = {
  id: number;
  hafta: number;
  ev_sahibi: string;
  deplasman: string;
  ev_skor: number | null;
  dep_skor: number | null;
  oynandi: boolean;
  canli: boolean;
  tarih: string | null;
  saat: string | null;
  saha: string | null;
};

type HaftaGroup = {
  hafta: number;
  maclar: Mac[];
};

type TeamMap = Record<string, string>;

function TeamLogo({ name, logoMap }: { name: string; logoMap: TeamMap }) {
  const logo = logoMap[name];
  if (logo) {
    return (
      <div className="w-12 h-12 relative drop-shadow-sm">
        <Image src={logo} alt={name} fill className="object-contain" unoptimized />
      </div>
    );
  }
  return (
    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center shadow-sm">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    </div>
  );
}

export default function FiksturPage() {
  const [haftalar, setHaftalar] = useState<HaftaGroup[]>([]);
  const [aktifHafta, setAktifHafta] = useState<number>(1);
  const [logoMap, setLogoMap] = useState<TeamMap>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([loadFixtures(), loadTeams()]);
  }, []);

  async function loadTeams() {
    try {
      const data = await publicFetch("takimlar", "select=ad,logo");
      const map: TeamMap = {};
      for (const t of data || []) {
        if (t.ad && t.logo) map[t.ad] = t.logo;
      }
      setLogoMap(map);
    } catch {}
  }

  async function loadFixtures() {
    try {
      const data = await publicFetch(
        "maclar",
        "select=id,hafta,ev_sahibi,deplasman,ev_skor,dep_skor,oynandi,canli,tarih,saat,saha&order=hafta.asc,id.asc"
      );

      // Group by hafta
      const grouped: Record<number, Mac[]> = {};
      for (const mac of data || []) {
        if (!grouped[mac.hafta]) grouped[mac.hafta] = [];
        grouped[mac.hafta].push(mac);
      }

      const result: HaftaGroup[] = Object.entries(grouped)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([hafta, maclar]) => ({ hafta: Number(hafta), maclar }));

      setHaftalar(result);

      // Aktif hafta = en son oynanan hafta veya ilk hafta
      const lastPlayed = result.filter((h) => h.maclar.some((m) => m.oynandi));
      if (lastPlayed.length > 0) {
        setAktifHafta(lastPlayed[lastPlayed.length - 1].hafta);
      } else if (result.length > 0) {
        setAktifHafta(result[0].hafta);
      }
    } catch {
      setHaftalar([]);
    } finally {
      setLoading(false);
    }
  }

  const aktifGroup = haftalar.find((h) => h.hafta === aktifHafta);

  function getStatusBadge(mac: Mac) {
    if (mac.canli) return { label: "CANLI", cls: "bg-[#e60000] text-white animate-pulse" };
    if (mac.oynandi) return { label: "Bitti", cls: "bg-gray-100 text-gray-600" };
    return { label: "Bekliyor", cls: "bg-blue-50 text-blue-600" };
  }

  function formatDate(mac: Mac) {
    if (!mac.tarih && !mac.saat) return null;
    const parts = [];
    if (mac.tarih) {
      const d = new Date(mac.tarih);
      parts.push(d.toLocaleDateString("tr-TR", { day: "numeric", month: "long" }));
    }
    if (mac.saat) parts.push(mac.saat);
    return parts.join(" ");
  }

  return (
    <div className="w-full flex flex-col fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 bg-red-50 p-4 rounded-xl border border-red-100">
        <div className="w-10 h-10 bg-[#e60000] rounded-lg flex items-center justify-center text-white shadow-sm">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        </div>
        <div>
          <h1 className="text-[20px] font-black text-[#1a1a2e]">Maç Programı ve Fikstür</h1>
          <p className="text-[12px] text-gray-500 font-bold">Tüm haftaların maç programı ve sonuçları</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-[100px] bg-gray-50 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : haftalar.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-4 opacity-40">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <p className="font-bold text-[15px]">Henüz fikstür oluşturulmamış</p>
          <p className="text-[13px] mt-1">Admin panelinden maçları ekleyebilirsiniz.</p>
        </div>
      ) : (
        <>
          {/* Hafta Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-3 mb-5" style={{ scrollbarWidth: "none" }}>
            {haftalar.map((h) => {
              const hasPlayed = h.maclar.some((m) => m.oynandi);
              const hasLive = h.maclar.some((m) => m.canli);
              return (
                <button
                  key={h.hafta}
                  onClick={() => setAktifHafta(h.hafta)}
                  className={`shrink-0 px-4 py-2 rounded-lg text-[13px] font-bold transition-all border flex items-center gap-1.5 ${
                    aktifHafta === h.hafta
                      ? "bg-[#e60000] text-white border-[#e60000] shadow-sm"
                      : hasPlayed
                      ? "bg-gray-50 text-gray-600 border-gray-200"
                      : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {hasLive && <span className="w-2 h-2 rounded-full bg-white animate-pulse" />}
                  {h.hafta}. Hafta
                  {hasPlayed && !hasLive && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </button>
              );
            })}
          </div>

          {/* Matches */}
          {aktifGroup && (
            <div className="flex flex-col gap-3">
              {aktifGroup.maclar.map((mac) => {
                const status = getStatusBadge(mac);
                const dateStr = formatDate(mac);
                return (
                  <div
                    key={mac.id}
                    className={`bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all ${
                      mac.canli ? "border-[#e60000]/30 ring-1 ring-[#e60000]/20" : "border-gray-100"
                    }`}
                  >
                    {/* Top Bar */}
                    <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-100">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded ${status.cls}`}>
                        {status.label}
                      </span>
                      <span className="text-[11px] text-gray-400 font-medium">
                        {dateStr || `${aktifHafta}. Hafta`}
                        {mac.saha && <span className="ml-2 text-gray-300">• {mac.saha}</span>}
                      </span>
                    </div>

                    {/* Match Row */}
                    <div className="flex items-center px-4 py-4">
                      {/* Home Team */}
                      <div className="flex-1 flex flex-col items-center gap-2 min-w-0">
                        <TeamLogo name={mac.ev_sahibi} logoMap={logoMap} />
                        <span className="text-[12px] md:text-[14px] font-black text-[#1a1a2e] text-center leading-tight line-clamp-2">
                          {mac.ev_sahibi}
                        </span>
                      </div>

                      {/* Score / VS */}
                      <div className="flex flex-col items-center justify-center px-4 shrink-0">
                        {mac.oynandi || mac.canli ? (
                          <div className="flex items-center gap-3">
                            <span className={`text-[32px] font-black leading-none ${mac.canli ? "text-[#e60000] animate-pulse" : "text-[#e60000]"}`}>
                              {mac.ev_skor ?? 0}
                            </span>
                            <span className="text-gray-300 font-black text-lg">–</span>
                            <span className="text-[32px] font-black text-gray-800 leading-none">
                              {mac.dep_skor ?? 0}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[#e60000] font-black text-[18px] bg-red-50 border border-red-100 px-4 py-1.5 rounded-lg">
                            VS
                          </span>
                        )}
                      </div>

                      {/* Away Team */}
                      <div className="flex-1 flex flex-col items-center gap-2 min-w-0">
                        <TeamLogo name={mac.deplasman} logoMap={logoMap} />
                        <span className="text-[12px] md:text-[14px] font-black text-[#1a1a2e] text-center leading-tight line-clamp-2">
                          {mac.deplasman}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
