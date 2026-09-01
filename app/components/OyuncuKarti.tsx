"use client";

import Image from "next/image";

export type OyuncuKartProps = {
  id?: number;
  ad: string;
  soyad?: string;
  fotograf?: string;
  mevki?: string;
  takimAd?: string;
  takimLogo?: string;
  rating?: number;
  golSayisi?: number;
  asistSayisi?: number;
  macSayisi?: number;
  stats?: {
    hiz?: number;
    sut?: number;
    pas?: number;
    dribling?: number;
    defans?: number;
    fizik?: number;
  };
  kartTipi?: "gold" | "totw" | "hero";
};

export default function OyuncuKarti({
  id = 0,
  ad,
  soyad = "",
  fotograf,
  mevki = "OS",
  takimAd = "Pro Lig",
  takimLogo,
  rating = 85,
  golSayisi = 0,
  asistSayisi = 0,
  macSayisi = 0,
  stats = { hiz: 82, sut: 84, pas: 80, dribling: 85, defans: 65, fizik: 78 },
  kartTipi = "totw",
}: OyuncuKartProps) {
  // Theme gradients based on card type
  const theme =
    kartTipi === "totw"
      ? {
          cardBg: "from-[#1a1c29] via-[#0d0f19] to-[#05060b]",
          borderColor: "border-[#ffd700]/50",
          glowColor: "shadow-[0_0_30px_rgba(255,215,0,0.3)]",
          accentText: "text-[#ffd700]",
          badgeBg: "bg-[#ffd700]/10 border-[#ffd700]/30",
        }
      : kartTipi === "hero"
      ? {
          cardBg: "from-[#2b0808] via-[#160303] to-[#080101]",
          borderColor: "border-[#d4af37]/60",
          glowColor: "shadow-[0_0_30px_rgba(212,175,55,0.4)]",
          accentText: "text-[#d4af37]",
          badgeBg: "bg-[#d4af37]/10 border-[#d4af37]/30",
        }
      : {
          cardBg: "from-[#292211] via-[#141008] to-[#0a0804]",
          borderColor: "border-[#e5c158]/40",
          glowColor: "shadow-[0_0_20px_rgba(229,193,88,0.2)]",
          accentText: "text-[#e5c158]",
          badgeBg: "bg-[#e5c158]/10 border-[#e5c158]/30",
        };

  const fullPlayerName = `${ad} ${soyad}`.trim();

  // Piyasa Değeri Hesaplama (Market Value)
  // Formül: Rating * 15k + Gol * 50k + Asist * 30k + Maç * 10k + İsim Varyasyonu
  const baseDeger = rating * 15000;
  const golDeger = golSayisi * 50000;
  const asistDeger = asistSayisi * 30000;
  const macDeger = macSayisi * 10000;
  // Rakamların herkes için aynı olmaması için isim ve id tabanlı GÜÇLÜ bir varyasyon ekliyoruz.
  const nameSeed = fullPlayerName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  // Daha dağınık bir formül: id ve nameSeed'i çarpıp, 2.500.000'a kadar fark yarat.
  const variation = ((nameSeed * 13 + id * 97) % 250) * 10000; // 0 ile 2.490.000 TL arası
  
  const toplamDeger = baseDeger + golDeger + asistDeger + macDeger + variation;
  
  // Format to full TL (e.g., 1.500.000 TL)
  const formatliDeger = new Intl.NumberFormat("tr-TR").format(toplamDeger) + " TL";

  return (
    <div
      className={`relative w-[280px] h-[430px] rounded-3xl p-5 bg-gradient-to-b ${theme.cardBg} border-2 ${theme.borderColor} ${theme.glowColor} flex flex-col justify-between overflow-hidden group hover:scale-[1.03] transition-all duration-500 select-none`}
    >
      {/* Background Subtle Lines & Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute -right-12 -top-12 w-36 h-36 bg-[#ffd700]/10 rounded-full blur-2xl pointer-events-none group-hover:bg-[#ffd700]/20 transition-all" />

      {/* TOP HEADER SECTION */}
      <div className="relative z-10 flex justify-between items-start">
        {/* Rating & Position */}
        <div className="flex flex-col items-center">
          <span className={`text-4xl font-black ${theme.accentText} leading-none tracking-tighter drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]`}>
            {rating}
          </span>
          <span className="text-xs font-black tracking-widest text-white/80 uppercase mt-1">
            {mevki}
          </span>
          {takimLogo && (
            <div className="relative w-8 h-8 mt-2 drop-shadow-md">
              <Image
                src={takimLogo}
                alt={takimAd}
                fill
                className="object-contain"
              />
            </div>
          )}
        </div>

        {/* Player Avatar */}
        <div className="relative w-[150px] h-[170px] -mt-2">
          {fotograf ? (
            <Image
              src={fotograf}
              alt={fullPlayerName}
              fill
              className="object-cover object-top drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-white/5 rounded-2xl border border-white/10 text-4xl">
              ⚽
            </div>
          )}
        </div>
      </div>

      {/* PLAYER NAME */}
      <div className="relative z-10 text-center border-t border-b border-white/10 py-2 my-1">
        <h3 className="text-xl font-black tracking-tight text-white uppercase truncate px-1 drop-shadow-md">
          {fullPlayerName}
        </h3>
        <p className="text-[10px] tracking-widest text-gray-400 uppercase font-semibold">
          {takimAd}
        </p>
      </div>

      {/* STATS MATRIX (FIFA STYLE 6 STATS) */}
      <div className="relative z-10 grid grid-cols-3 gap-x-2 gap-y-1 text-center bg-black/40 backdrop-blur-md p-2.5 rounded-2xl border border-white/10">
        <div>
          <span className={`font-black text-sm ${theme.accentText}`}>{stats.hiz || 80}</span>
          <span className="text-[9px] font-bold text-gray-400 uppercase ml-1">HIZ</span>
        </div>
        <div>
          <span className={`font-black text-sm ${theme.accentText}`}>{stats.sut || 80}</span>
          <span className="text-[9px] font-bold text-gray-400 uppercase ml-1">ŞUT</span>
        </div>
        <div>
          <span className={`font-black text-sm ${theme.accentText}`}>{stats.pas || 80}</span>
          <span className="text-[9px] font-bold text-gray-400 uppercase ml-1">PAS</span>
        </div>
        <div>
          <span className={`font-black text-sm ${theme.accentText}`}>{stats.dribling || 80}</span>
          <span className="text-[9px] font-bold text-gray-400 uppercase ml-1">DRB</span>
        </div>
        <div>
          <span className={`font-black text-sm ${theme.accentText}`}>{stats.defans || 70}</span>
          <span className="text-[9px] font-bold text-gray-400 uppercase ml-1">DEF</span>
        </div>
        <div>
          <span className={`font-black text-sm ${theme.accentText}`}>{stats.fizik || 75}</span>
          <span className="text-[9px] font-bold text-gray-400 uppercase ml-1">FİZ</span>
        </div>
      </div>

      {/* BOTTOM SECTION (GOL/ASİST + DEĞER) */}
      <div className="mt-auto pt-2 flex flex-col gap-2">
        {/* FOOTER BADGES (GOL / ASİST) */}
        <div className="relative z-10 flex justify-between items-center text-[11px] font-bold text-gray-300 px-1">
          <div className="flex items-center gap-1">
            <span>⚽ Gol:</span>
            <span className="text-white font-extrabold">{golSayisi}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>🎯 Asist:</span>
            <span className="text-white font-extrabold">{asistSayisi}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>👕 Maç:</span>
            <span className="text-white font-extrabold">{macSayisi}</span>
          </div>
        </div>

        {/* PİYASA DEĞERİ (MARKET VALUE) */}
        <div className="relative z-10 bg-gradient-to-r from-[#e5c158]/20 via-[#e5c158]/40 to-[#e5c158]/20 border border-[#e5c158]/50 rounded-xl py-1 text-center shadow-[0_0_15px_rgba(229,193,88,0.2)] backdrop-blur-sm">
          <span className="text-[10px] uppercase font-bold text-[#e5c158] tracking-wider mr-1">DEĞER:</span>
          <span className="text-sm font-black text-white tracking-wide">{formatliDeger}</span>
        </div>
      </div>
    </div>
  );
}
