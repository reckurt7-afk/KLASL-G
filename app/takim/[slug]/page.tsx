"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { publicFetch } from "@/lib/supabase";

type Oyuncu = {
  id: string | number;
  ad_soyad: string;
  takim: string;
  mevki: string;
  forma_no: number;
  foto_url?: string;
  genel_puan?: number;
  is_premium?: boolean;
};

const takimBilgileri: Record<string, { ad: string; logo: string; }> = {
  "ps-5": { ad: "PS 5", logo: "/logos/ps5.png" },
  "dinamo-nalbantoglu": { ad: "DİNAMO NALBANTOĞLU", logo: "/logos/dinamo-nalbantoglu.png" },
  "krokodilla-fc": { ad: "KROKODİLLA FC", logo: "/logos/krokodilla-fc.png" },
  "nova-fc": { ad: "NOVA FC", logo: "/logos/nova-fc.png" },
  "yesil-bursa-fc": { ad: "YEŞİL BURSA FC", logo: "/logos/yesil-bursa-fc.png" },
  "yediyol-black-fc": { ad: "YEDİYOL BLACK FC", logo: "/logos/yediyol-black-fc.png" },
  "gravyer-fc": { ad: "GRAVYER FC", logo: "/logos/gravyer-fc.png" },
  "biskrem-fc": { ad: "BİSKREM FC", logo: "/logos/biskrem-fc.png" },
};

const kartStyle = {
  background: "rgba(20,20,20,.78)",
  backdropFilter: "blur(18px)",
  border: "1px solid rgba(255,215,0,.15)",
  borderRadius: 20,
  padding: 18,
  boxShadow: "0 10px 30px rgba(0,0,0,.35)",
} as const;

export default function TakimDetayPage() {
  const params = useParams();
  const slug = params.slug as string;
  const takim = takimBilgileri[slug];

  const [oyuncular, setOyuncular] = useState<Oyuncu[]>([]);

  useEffect(() => {
    async function getir() {
      if (!takim) return;
      
      // 1) All players from DB filtered by team name
      const allPlayers = await publicFetch("oyuncular", "select=*");
      const teamPlayers = allPlayers.filter(
        (o) => o.takim && o.takim.toUpperCase().trim() === takim.ad.toUpperCase().trim()
      );
      
      // 2) Siteye kayıt olup bu takımı seçen üyeler  
      const profillerData = await publicFetch("profiller", "select=id,ad_soyad,avatar_url,takim");
      const teamProfiles = profillerData.filter(
        (p) => p.takim && p.takim.toUpperCase().trim() === takim.ad.toUpperCase().trim()
      );

      const merged: Oyuncu[] = [...teamPlayers];
      
      teamProfiles.forEach((p: any) => {
        const profName = p.ad_soyad ? p.ad_soyad.toLowerCase().trim() : "";
        if (profName && !merged.find(m => m.ad_soyad && m.ad_soyad.toLowerCase().trim() === profName)) {
          merged.push({
            id: p.id,
            ad_soyad: p.ad_soyad || "İsimsiz Oyuncu",
            takim: p.takim,
            mevki: "Oyuncu",
            forma_no: 0,
            foto_url: p.avatar_url,
            genel_puan: 75,
            is_premium: false
          });
        }
      });

      setOyuncular(merged);
    }
    getir();
  }, [takim]);

  if (!takim) {
    return (
      <div style={{ minHeight: "100vh", background: "#0b0b0b", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 700 }}>
        Takım bulunamadı.
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundImage: "url('/images/stadium.jpg')", backgroundSize: "cover", backgroundPosition: "center", padding: "90px 15px 30px" }}>
      <div style={{ background: "rgba(0,0,0,.72)", minHeight: "100vh", padding: 15, borderRadius: 20 }}>
        <div style={kartStyle}>
          <div style={{ textAlign: "center", position: "relative", overflow: "hidden" }}>
            <Image src={takim.logo} alt={takim.ad} width={240} height={240} style={{ position: "absolute", right: -30, top: -20, opacity: 0.06 }} />
            <Image src={takim.logo} alt={takim.ad} width={130} height={130} style={{ filter: "drop-shadow(0 0 20px rgba(255,215,0,.4))" }} />
            <h1 style={{ color: "#fff", fontSize: 32, marginTop: 20, marginBottom: 8, fontWeight: 900 }}>{takim.ad}</h1>
            <div style={{ color: "#FFD700", fontWeight: 700, marginBottom: 20 }}>👥 {oyuncular.length} Oyuncu</div>
          </div>
        </div>

        <div style={{ height: 40 }} />

        {oyuncular.length === 0 && (
          <div style={{ color: "#aaa", textAlign: "center", marginTop: 30 }}>Henüz oyuncu bulunmuyor.</div>
        )}
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 25, justifyItems: "center" }}>
          {oyuncular.map((oyuncu) => (
            <Link key={oyuncu.id} href={`/oyuncu/${oyuncu.id}`} style={{ textDecoration: "none" }}>
              <PlayerCard oyuncu={oyuncu} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

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

function PlayerCard({ oyuncu }: { oyuncu: Oyuncu }) {
  const isGold = oyuncu.is_premium;
  const bgGradient = "linear-gradient(135deg, #f6d365 0%, #ffb347 100%)";
  const borderColor = "#fff3cd";
  const textColor = "#4a3300";
  const statsColor = "#855c0b";
  const teamLogo = TEAM_LOGOS[oyuncu.takim];

  return (
    <div
      style={{
        position: "relative",
        width: 220,
        height: 330,
        background: bgGradient,
        borderRadius: "10% 10% 45% 45% / 10% 10% 15% 15%",
        border: `3px solid ${borderColor}`,
        boxShadow: isGold ? "0 10px 25px rgba(255, 215, 0, 0.4)" : "0 10px 20px rgba(0,0,0,0.5)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        transition: "transform 0.2s",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05) translateY(-5px)"}
      onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1) translateY(0)"}
    >
      <div style={{ position: "absolute", top: 15, left: 15, textAlign: "center", zIndex: 2 }}>
        <div style={{ fontSize: 26, fontWeight: 900, color: textColor, lineHeight: 1 }}>{oyuncu.genel_puan || "0"}</div>
        <div style={{ fontSize: 13, fontWeight: 800, color: textColor, marginTop: 2 }}>{oyuncu.mevki ? oyuncu.mevki.substring(0,3).toUpperCase() : "OYT"}</div>
        <div style={{ fontSize: 10, fontWeight: 900, color: textColor, marginTop: 5, borderTop: `1px solid ${statsColor}`, paddingTop: 3 }}>PRO</div>
      </div>
      <div style={{ width: 140, height: 140, marginTop: 30, position: "relative", zIndex: 1 }}>
        {oyuncu.foto_url ? (
          <img src={oyuncu.foto_url} alt={oyuncu.ad_soyad} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)", maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "flex-end", justifyContent: "center", fontSize: 100, color: "rgba(0,0,0,0.2)" }}>👤</div>
        )}
      </div>
      <div style={{ width: "80%", textAlign: "center", borderBottom: `1px solid ${statsColor}`, paddingBottom: 5, marginTop: 5, zIndex: 2 }}>
        <div style={{ fontSize: 18, fontWeight: 900, color: textColor, textTransform: "uppercase", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {oyuncu.ad_soyad} {isGold && <span style={{ color: "#1d9bf0" }}>✔️</span>}
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "85%", marginTop: 10, zIndex: 2 }}>
        <div style={{ textAlign: "center", flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 900, color: textColor }}>{oyuncu.forma_no || "-"}</div>
          <div style={{ fontSize: 9, fontWeight: 700, color: statsColor }}>FORMA</div>
        </div>
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          {teamLogo ? (
            <img src={teamLogo} alt={oyuncu.takim} style={{ width: 30, height: 30, objectFit: "contain" }} />
          ) : (
            <div style={{ width: 1, height: 25, background: statsColor, opacity: 0.5 }}></div>
          )}
        </div>
        <div style={{ textAlign: "center", flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: textColor, maxWidth: 70, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginTop: 2 }}>{oyuncu.takim}</div>
          <div style={{ fontSize: 9, fontWeight: 700, color: statsColor, marginTop: 2 }}>TAKIM</div>
        </div>
      </div>
      {isGold && <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 50%)", pointerEvents: "none", zIndex: 0 }} />}
    </div>
  );
}