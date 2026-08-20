"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import OyuncuKarti from "@/app/components/OyuncuKarti";

type Oyuncu = {
  id: number;
  ad_soyad: string;
  takim: string;
  mevki: string;
  forma_no: number;
  foto_url?: string;
  genel_puan?: number;
  is_premium?: boolean;
  gol_sayisi?: number;
  asist_sayisi?: number;
  mac_sayisi?: number;
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

export default function OyuncuProfilPage() {
  const params = useParams();
  const [oyuncu, setOyuncu] = useState<Oyuncu | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getir() {
      const { data } = await supabase
        .from("oyuncular")
        .select("*")
        .eq("id", params.id)
        .single();
      setOyuncu(data || null);
      setLoading(false);
    }
    getir();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] text-white flex items-center justify-center font-bold">
        Oyuncu Kartı Hazırlanıyor...
      </div>
    );
  }

  if (!oyuncu) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] text-white flex items-center justify-center font-bold">
        Oyuncu bulunamadı.
      </div>
    );
  }

  const teamLogo = TEAM_LOGOS[oyuncu.takim];
  const nameParts = oyuncu.ad_soyad.split(" ");
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(" ");

  return (
    <div className="min-h-screen bg-[url('/images/stadium.png')] bg-cover bg-center bg-no-repeat pt-28 pb-16 px-4 flex flex-col items-center justify-center">
      {/* OVERLAY */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md pointer-events-none" />

      <div className="relative z-10 w-full max-w-4xl bg-[#0b0b0b]/90 border border-white/10 rounded-3xl p-6 md:p-10 backdrop-blur-2xl shadow-[0_0_60px_rgba(0,0,0,0.8)] flex flex-col items-center">
        
        {/* HEADER */}
        <div className="text-center mb-8">
          <span className="text-[#ff3131] font-black tracking-[0.3em] text-xs md:text-sm uppercase bg-[#ff3131]/10 px-4 py-1 rounded-full border border-[#ff3131]/30">
            KLAS LİG OYUNCU KARTI
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white mt-3 tracking-tight">
            {oyuncu.ad_soyad}
          </h1>
          <p className="text-gray-400 font-bold text-sm mt-1">{oyuncu.takim}</p>
        </div>

        {/* FUT CARD DISPLAY */}
        <div className="my-6">
          <OyuncuKarti
            ad={firstName}
            soyad={lastName}
            fotograf={oyuncu.foto_url}
            mevki={oyuncu.mevki || "OS"}
            takimAd={oyuncu.takim}
            takimLogo={teamLogo}
            rating={oyuncu.genel_puan || 86}
            golSayisi={oyuncu.gol_sayisi || 0}
            asistSayisi={oyuncu.asist_sayisi || 0}
            macSayisi={oyuncu.mac_sayisi || 0}
            kartTipi={oyuncu.is_premium ? "totw" : "hero"}
          />
        </div>

        {/* QR CODE & EXTRA INFO BOX */}
        <div className="mt-8 bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-center max-w-md w-full">
          <div className="text-4xl mb-2">📱</div>
          <h3 className="text-white font-black text-base mb-1">Forma & Profil QR Kodu</h3>
          <p className="text-gray-400 text-xs leading-relaxed">
            Forma arkasına basılacak QR kod tarandığında doğrudan oyuncunun bu FUT istatistik kartı açılır.
          </p>
        </div>

        {/* BACK LINK */}
        <Link
          href="/takimlar"
          className="mt-8 text-[#ff3131] hover:text-white font-black text-sm tracking-wider transition-colors flex items-center gap-2"
        >
          ← TAKIMLARA DÖN
        </Link>
      </div>
    </div>
  );
}
