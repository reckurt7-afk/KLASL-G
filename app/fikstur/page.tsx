"use client";

import { useEffect, useState } from "react";
import { publicFetch } from "../../lib/supabase";
import { TeamLogo } from "../components/TeamLogo";

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
    if (!mac.tarih) return null;
    const parts = mac.tarih.includes('/') ? mac.tarih.split('/') : mac.tarih.includes('.') ? mac.tarih.split('.') : null;
    if (parts && parts.length === 3) {
      const d = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString("tr-TR", { day: "numeric", month: "long" });
      }
    }
    return mac.tarih;
  }

  return (
    <div className="w-full flex flex-col font-sans fade-in">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 bg-white h-[76px] rounded-2xl border border-gray-100 shadow-sm px-5">
        <div className="w-12 h-12 bg-gradient-to-br from-[#e60000] to-[#b30000] rounded-xl flex items-center justify-center text-white shadow-[0_4px_10px_rgba(230,0,0,0.3)] shrink-0">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="text-[16px] md:text-[18px] font-black text-[#1a1a2e] leading-none mb-1">Maç Programı ve Fikstür</h1>
          <p className="text-[11px] md:text-[13px] text-gray-500 font-medium leading-none">Tüm haftaların maç programı ve sonuçları</p>
        </div>
      </div>

      {loading ? (
        <div className="w-full py-20 flex justify-center"><div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div></div>
      ) : haftalar.length === 0 ? (
        <div className="w-full py-20 text-center text-gray-500 font-bold bg-white rounded-2xl border border-gray-100">Fikstür verisi bulunamadı.</div>
      ) : (
        <div className="flex flex-col">
          {/* Week Selector */}
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-4 mb-2">
            {haftalar.map((h) => (
              <button
                key={h.hafta}
                onClick={() => setAktifHafta(h.hafta)}
                className={`shrink-0 px-4 py-2 rounded-full font-black text-[14px] transition-all ${
                  aktifHafta === h.hafta
                    ? "bg-[#e60000] text-white shadow-md scale-105"
                    : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50 hover:text-gray-800"
                }`}
              >
                {h.hafta}. Hafta
              </button>
            ))}
          </div>

          {aktifGroup && (
            <div className="flex flex-col gap-4">
              {aktifGroup.maclar.map((mac) => {
                const status = getStatusBadge(mac);
                const dateStr = formatDate(mac) || mac.tarih;
                return (
                  <div
                    key={mac.id}
                    className={`bg-white border rounded-2xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.03)] hover:shadow-md transition-all ${
                      mac.canli ? "border-[#e60000]/40 ring-1 ring-[#e60000]/20" : "border-gray-100"
                    }`}
                  >
                    {/* Top Bar */}
                    <div className="flex items-center justify-between px-5 py-2.5 bg-gray-50 border-b border-gray-100">
                      <span className={`text-[10px] md:text-[11px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider ${status.cls}`}>
                        {status.label}
                      </span>
                      <span className="text-[12px] font-bold text-gray-500">
                        {aktifHafta}. Hafta
                      </span>
                    </div>

                    {/* Match Row */}
                    <div className="flex items-center px-4 py-5 md:py-6">
                      {/* Home Team */}
                      <div className="flex-1 flex flex-col items-center gap-2 min-w-0">
                        <TeamLogo name={mac.ev_sahibi} logoMap={logoMap} size={56} />
                        <span className="text-[13px] md:text-[15px] font-black text-[#1a1a2e] text-center leading-tight line-clamp-2 mt-1">
                          {mac.ev_sahibi}
                        </span>
                      </div>

                      {/* Score / Time Info */}
                      <div className="flex flex-col items-center justify-center px-2 shrink-0">
                        {mac.oynandi || mac.canli ? (
                          <div className="flex items-center gap-3">
                            <span className={`text-[36px] font-black tracking-tighter leading-none ${mac.canli ? "text-[#e60000] animate-pulse" : "text-[#1a1a2e]"}`}>
                              {mac.ev_skor ?? 0}
                            </span>
                            <span className="text-gray-300 font-black text-xl mb-1">-</span>
                            <span className={`text-[36px] font-black tracking-tighter leading-none ${mac.canli ? "text-[#e60000] animate-pulse" : "text-[#1a1a2e]"}`}>
                              {mac.dep_skor ?? 0}
                            </span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-1.5 w-full max-w-[140px]">
                            {mac.saha && (
                              <span className="text-[10px] text-[#e60000] font-black uppercase tracking-wider text-center bg-red-50 px-2 py-0.5 rounded w-full line-clamp-1">
                                {mac.saha}
                              </span>
                            )}
                            <div className="flex flex-col items-center justify-center bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200 w-full">
                              <span className="text-[#1a1a2e] font-black text-[16px] tracking-tight">{mac.saat || "-:-"}</span>
                              <span className="text-gray-500 font-bold text-[10px] tracking-wide uppercase">{dateStr || "-"}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Away Team */}
                      <div className="flex-1 flex flex-col items-center gap-2 min-w-0">
                        <TeamLogo name={mac.deplasman} logoMap={logoMap} size={56} />
                        <span className="text-[13px] md:text-[15px] font-black text-[#1a1a2e] text-center leading-tight line-clamp-2 mt-1">
                          {mac.deplasman}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
