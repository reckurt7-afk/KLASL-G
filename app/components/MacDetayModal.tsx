"use client";

import Image from "next/image";

type Mac = {
  id: number;
  ev_sahibi: string;
  deplasman: string;
  ev_skor?: number | null;
  dep_skor?: number | null;
  tarih?: string;
  saat?: string;
  saha?: string;
  hafta?: number;
  canli?: boolean;
  oynandi?: boolean;
  durum?: string;
  ev_logo?: string;
  dep_logo?: string;
  goller?: { dk: number; oyuncu: string; takim: "ev" | "dep" }[];
  kartlar?: { dk: number; oyuncu: string; tip: "sari" | "kirmizi"; takim: "ev" | "dep" }[];
};

const TEAM_LOGOS: Record<string, string> = {
  "PS 5": "/logos/ps5.png",
  "KROKODİLLA FC": "/logos/krokodilla-fc.png",
  "NOVA FC": "/logos/nova-fc.png",
  "YEŞİL BURSA FC": "/logos/yesil-bursa-fc.png",
  "YEDİYOL BLACK FC": "/logos/yediyol-black-fc.png",
  "GRAVYER FC": "/logos/gravyer-fc.png",
  "BİSKREM FC": "/logos/biskrem-fc.png",
  "DİNAMO NALBANTOĞLU": "/logos/dinamo-nalbantoglu.png",
};

export default function MacDetayModal({
  mac,
  onClose,
}: {
  mac: Mac | null;
  onClose: () => void;
}) {
  if (!mac) return null;

  const evLogo = mac.ev_logo || TEAM_LOGOS[mac.ev_sahibi.toUpperCase()] || TEAM_LOGOS[mac.ev_sahibi] || "/icons/prolig-logo-yeni.jpg";
  const depLogo = mac.dep_logo || TEAM_LOGOS[mac.deplasman.toUpperCase()] || TEAM_LOGOS[mac.deplasman] || "/icons/prolig-logo-yeni.jpg";

  const goller = mac.goller || [
    { dk: 14, oyuncu: "Ahmet Yılmaz", takim: "ev" },
    { dk: 38, oyuncu: "Mehmet Demir", takim: "dep" },
    { dk: 52, oyuncu: "Burak Yılmaz", takim: "ev" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
      {/* MODAL CONTAINER */}
      <div className="relative w-full max-w-2xl bg-[#0d0d0d] border border-white/10 rounded-3xl p-6 md:p-8 shadow-[0_0_50px_rgba(212,175,55,0.2)] overflow-hidden">
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-[#d4af37] text-white flex items-center justify-center font-bold text-xl transition-all duration-300 z-20"
        >
          ✕
        </button>

        {/* MATCH HEADER / TEAMS DISPLAY */}
        <div className="text-center mb-6">
          <span className="bg-[#d4af37]/10 text-[#d4af37] text-xs font-black px-4 py-1 rounded-full border border-[#d4af37]/30 tracking-widest uppercase">
            {mac.hafta ? `${mac.hafta}. HAFTA MAÇI` : "PRO LİG MAÇ DETAYI"}
          </span>
        </div>

        <div className="grid grid-cols-3 items-center text-center gap-2 mb-8 bg-gradient-to-r from-white/[0.02] via-white/[0.05] to-white/[0.02] p-4 rounded-2xl border border-white/5">
          {/* HOME TEAM */}
          <div className="flex flex-col items-center">
            <div className="relative w-16 h-16 sm:w-24 sm:h-24 mb-2">
              <Image src={evLogo} alt={mac.ev_sahibi} fill className="object-contain" />
            </div>
            <h3 className="text-white font-black text-sm sm:text-lg leading-snug truncate max-w-[140px]">
              {mac.ev_sahibi}
            </h3>
          </div>

          {/* SCORE / STATUS */}
          <div className="flex flex-col items-center justify-center">
            {mac.oynandi || mac.canli || mac.ev_skor !== undefined ? (
              <div className="flex items-center gap-3 text-3xl sm:text-5xl font-black text-white tracking-tighter">
                <span className="text-[#d4af37]">{mac.ev_skor ?? 0}</span>
                <span className="text-gray-600">-</span>
                <span className="text-[#d4af37]">{mac.dep_skor ?? 0}</span>
              </div>
            ) : (
              <div className="text-2xl sm:text-3xl font-black text-[#d4af37]">VS</div>
            )}

            <div className="mt-2 text-xs font-bold text-gray-400">
              {mac.canli ? (
                <span className="text-[#eab308] animate-pulse font-black">● CANLI</span>
              ) : (
                mac.durum || mac.saat || "Maç Sona Erdi"
              )}
            </div>
          </div>

          {/* AWAY TEAM */}
          <div className="flex flex-col items-center">
            <div className="relative w-16 h-16 sm:w-24 sm:h-24 mb-2">
              <Image src={depLogo} alt={mac.deplasman} fill className="object-contain" />
            </div>
            <h3 className="text-white font-black text-sm sm:text-lg leading-snug truncate max-w-[140px]">
              {mac.deplasman}
            </h3>
          </div>
        </div>

        {/* TIMELINE & EVENTS */}
        <div>
          <h4 className="text-white font-black text-sm tracking-wider uppercase mb-4 border-b border-white/10 pb-2 flex items-center gap-2">
            <span>⏱️</span> MAÇ AKIŞI & GOLLER
          </h4>

          <div className="space-y-3 max-h-56 overflow-y-auto pr-2">
            {goller.map((g, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 p-3 rounded-xl border ${
                  g.takim === "ev"
                    ? "bg-[#d4af37]/5 border-[#d4af37]/20 flex-row"
                    : "bg-blue-500/5 border-blue-500/20 flex-row-reverse text-right"
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-black text-xs text-[#d4af37] shrink-0">
                  {g.dk}'
                </div>
                <div className="flex items-center gap-2 font-bold text-sm text-white">
                  <span>⚽</span>
                  <span>{g.oyuncu}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FOOTER INFO */}
        <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center text-xs text-gray-400 font-semibold">
          <span>📍 Saha: {mac.saha || "Pro Saha 1"}</span>
          <span>📅 {mac.tarih || "Sezon Maçı"}</span>
        </div>
      </div>
    </div>
  );
}
