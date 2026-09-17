"use client";

import { useEffect, useState } from "react";
import { publicFetch } from "../../lib/supabase";
import { TeamLogo } from "../components/TeamLogo";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ChevronLeft, ChevronRight, Clock, MapPin } from "lucide-react";

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
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    Promise.all([loadFixtures(), loadTeams()]);
  }, []);

  async function loadTeams() {
    try {
      const data = await publicFetch("teams", "select=name,logo");
      const map: TeamMap = {};
      for (const t of data || []) {
        if (t.name) map[t.name] = t.logo;
      }
      setLogoMap(map);
    } catch {}
  }

  async function loadFixtures() {
    setLoading(true);
    try {
      const data = await publicFetch("maclar", "select=*&order=hafta.asc,tarih.asc,saat.asc");
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
      const lastPlayed = result.filter((h) => h.maclar.some((m) => m.oynandi || m.canli));
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

  const handleHaftaChange = (yeniHafta: number) => {
    setDirection(yeniHafta > aktifHafta ? 1 : -1);
    setAktifHafta(yeniHafta);
  };

  const aktifGroup = haftalar.find((h) => h.hafta === aktifHafta);

  function getStatusBadge(mac: Mac) {
    if (mac.canli) return { label: "CANLI", cls: "bg-[#9e1b22] text-white shadow-[0_0_10px_rgba(158,27,34,0.5)] animate-pulse" };
    if (mac.oynandi) return { label: "MAÇ SONUCU", cls: "bg-gray-800 text-white shadow-sm" };
    return { label: "BEKLİYOR", cls: "bg-gray-100 text-gray-500 border border-gray-200" };
  }

  function formatDate(mac: Mac) {
    if (!mac.tarih) return null;
    const parts = mac.tarih.includes('/') ? mac.tarih.split('/') : mac.tarih.includes('.') ? mac.tarih.split('.') : null;
    if (parts && parts.length === 3) {
      const d = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
      }
    }
    return mac.tarih;
  }

  const variants = {
    enter: (direction: number) => ({ x: direction > 0 ? 50 : -50, opacity: 0 }),
    center: { zIndex: 1, x: 0, opacity: 1 },
    exit: (direction: number) => ({ zIndex: 0, x: direction < 0 ? 50 : -50, opacity: 0 })
  };

  return (
    <div className="w-full flex flex-col font-sans">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 sm:mb-12 relative"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-32 bg-[#ceaa52] opacity-10 blur-[80px] pointer-events-none rounded-full" />
        <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight drop-shadow-sm uppercase">FİKSTÜR</h2>
        <p className="mt-3 tracking-[0.4em] font-black text-[#9e1b22] text-sm md:text-base drop-shadow-[0_0_8px_rgba(158,27,34,0.4)] uppercase">Maç Programı</p>
      </motion.div>

      {loading ? (
        <div className="w-full py-20 flex justify-center">
          <div className="w-12 h-12 border-4 border-[#ceaa52] border-t-[#9e1b22] rounded-full animate-spin"></div>
        </div>
      ) : haftalar.length === 0 ? (
        <div className="w-full py-20 text-center text-gray-500 font-bold bg-white rounded-2xl border border-gray-100">Fikstür verisi bulunamadı.</div>
      ) : (
        <div className="flex flex-col relative w-full overflow-hidden">
          
          {/* Enhanced Week Selector (Horizontal Scroll / Swipeable) */}
          <div className="relative w-full max-w-4xl mx-auto mb-8">
             <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#fcfcfc] to-transparent z-10 pointer-events-none" />
             <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#fcfcfc] to-transparent z-10 pointer-events-none" />
             
             <div className="flex gap-3 overflow-x-auto hide-scrollbar px-6 pb-4 snap-x snap-mandatory" style={{ scrollbarWidth: "none" }}>
              {haftalar.map((h) => {
                const isActive = aktifHafta === h.hafta;
                return (
                  <button
                    key={h.hafta}
                    onClick={() => handleHaftaChange(h.hafta)}
                    className={`relative shrink-0 px-6 py-3 rounded-xl font-black text-[14px] md:text-[16px] transition-all duration-300 snap-center ${
                      isActive
                        ? "text-white shadow-[0_8px_20px_rgba(158,27,34,0.3)] scale-110 z-10"
                        : "bg-white text-gray-400 border border-gray-200 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    {isActive && (
                      <motion.div layoutId="activeWeek" className="absolute inset-0 bg-gradient-to-r from-[#1a1a2e] to-[#9e1b22] rounded-xl -z-10" />
                    )}
                    {h.hafta}. HAFTA
                  </button>
                );
              })}
             </div>
          </div>

          {/* Matches Container with Swipe Transition */}
          <div className="relative min-h-[400px]">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={aktifHafta}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="w-full max-w-4xl mx-auto flex flex-col gap-4"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = Math.abs(offset.x) * velocity.x;
                  if (swipe < -10000) {
                     // Next week
                     const next = haftalar.find(h => h.hafta > aktifHafta);
                     if (next) handleHaftaChange(next.hafta);
                  } else if (swipe > 10000) {
                     // Prev week
                     const prev = [...haftalar].reverse().find(h => h.hafta < aktifHafta);
                     if (prev) handleHaftaChange(prev.hafta);
                  }
                }}
              >
                {aktifGroup?.maclar.map((mac, idx) => {
                  const status = getStatusBadge(mac);
                  const dateStr = formatDate(mac) || mac.tarih;
                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      key={mac.id}
                      className={`group relative bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] border hover:scale-[1.01] ${
                        mac.canli ? "border-[#ceaa52] shadow-[0_0_15px_rgba(206,170,82,0.2)]" : "border-gray-100"
                      }`}
                    >
                      {mac.canli && (
                        <div className="absolute inset-0 bg-gradient-to-r from-[#ceaa52]/5 to-transparent pointer-events-none" />
                      )}

                      {/* Top Bar */}
                      <div className="flex items-center justify-between px-4 py-2 bg-gray-50/80 border-b border-gray-100/80">
                        <span className={`text-[10px] md:text-[11px] font-black px-3 py-1 rounded-md tracking-[0.2em] ${status.cls}`}>
                          {status.label}
                        </span>
                        
                        <div className="flex items-center gap-3 text-[11px] md:text-[12px] font-bold text-gray-500 uppercase">
                           <div className="flex items-center gap-1">
                             <Calendar className="w-3.5 h-3.5 text-gray-400" />
                             {dateStr || "-"}
                           </div>
                           {mac.saha && (
                             <div className="flex items-center gap-1 hidden md:flex">
                               <MapPin className="w-3.5 h-3.5 text-gray-400" />
                               {mac.saha}
                             </div>
                           )}
                        </div>
                      </div>

                      {/* Match Row */}
                      <div className="flex items-center px-4 py-6 md:py-8">
                        {/* Home Team */}
                        <div className="flex-1 flex flex-col md:flex-row items-center justify-end gap-3 md:gap-6 min-w-0">
                          <span className="text-[14px] md:text-[18px] font-black text-[#1a1a2e] text-center md:text-right leading-tight group-hover:text-[#9e1b22] transition-colors order-2 md:order-1 truncate w-full md:w-auto">
                            {mac.ev_sahibi}
                          </span>
                          <div className="relative w-14 h-14 md:w-20 md:h-20 shrink-0 order-1 md:order-2 bg-white rounded-full shadow-md border border-gray-100 flex items-center justify-center p-2 group-hover:shadow-[0_0_15px_rgba(206,170,82,0.3)] transition-all">
                            <TeamLogo name={mac.ev_sahibi} logoMap={logoMap} size={80} />
                          </div>
                        </div>

                        {/* Score / Time Info */}
                        <div className="flex flex-col items-center justify-center px-4 md:px-8 shrink-0 min-w-[120px]">
                          {mac.oynandi || mac.canli ? (
                            <div className="flex items-center gap-4 md:gap-6">
                              <span className={`text-[32px] md:text-[48px] font-black tracking-tighter leading-none ${mac.canli ? "text-[#ceaa52] drop-shadow-md" : "text-[#1a1a2e]"}`}>
                                {mac.ev_skor ?? 0}
                              </span>
                              <span className="text-gray-300 font-black text-2xl md:text-3xl mb-1">-</span>
                              <span className={`text-[32px] md:text-[48px] font-black tracking-tighter leading-none ${mac.canli ? "text-[#ceaa52] drop-shadow-md" : "text-[#1a1a2e]"}`}>
                                {mac.dep_skor ?? 0}
                              </span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-2">
                              <div className="flex items-center justify-center bg-gray-50 px-4 py-2 rounded-xl border border-gray-200 shadow-inner group-hover:bg-white group-hover:border-[#ceaa52]/30 transition-all">
                                <Clock className="w-4 h-4 text-[#ceaa52] mr-2" />
                                <span className="text-[#1a1a2e] font-black text-[18px] md:text-[22px] tracking-tight">{mac.saat ? mac.saat.slice(0, 5) : "-:-"}</span>
                              </div>
                              {mac.saha && (
                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider text-center md:hidden">
                                  {mac.saha}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Away Team */}
                        <div className="flex-1 flex flex-col md:flex-row items-center justify-start gap-3 md:gap-6 min-w-0">
                          <div className="relative w-14 h-14 md:w-20 md:h-20 shrink-0 bg-white rounded-full shadow-md border border-gray-100 flex items-center justify-center p-2 group-hover:shadow-[0_0_15px_rgba(206,170,82,0.3)] transition-all">
                            <TeamLogo name={mac.deplasman} logoMap={logoMap} size={80} />
                          </div>
                          <span className="text-[14px] md:text-[18px] font-black text-[#1a1a2e] text-center md:text-left leading-tight group-hover:text-[#9e1b22] transition-colors truncate w-full md:w-auto">
                            {mac.deplasman}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>
          
        </div>
      )}
    </div>
  );
}
