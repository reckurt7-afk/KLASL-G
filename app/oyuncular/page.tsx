"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

type Oyuncu = {
  id: number;
  ad_soyad: string;
  takim: string;
  mevki: string;
  forma_no: number;
  foto_url?: string;
  genel_puan?: number;
  is_premium?: boolean;
};

export default function OyuncularPage() {
  const [oyuncular, setOyuncular] = useState<Oyuncu[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function oyunculariGetir() {
      const { data, error } = await supabase
        .from("oyuncular")
        .select("*")
        .order("id", { ascending: false });

      if (!error && data) {
        setOyuncular(data);
      }
      setLoading(false);
    }
    oyunculariGetir();
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0b0b0b",
        color: "#fff",
        padding: "100px 20px 40px",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30, flexWrap: "wrap", gap: 15 }}>
          <div>
            <h1 style={{ fontSize: 38, fontWeight: 900, color: "#ff3131", margin: 0 }}>
              👥 OYUNCULAR
            </h1>
            <p style={{ color: "#bbb", margin: "5px 0 0 0" }}>
              KLAS LİG Yıldızları
            </p>
          </div>
          
          <Link
            href="/oyuncu-kayit"
            style={{
              display: "inline-block",
              background: "#ff3131",
              color: "#fff",
              padding: "12px 24px",
              borderRadius: 999,
              textDecoration: "none",
              fontWeight: 800,
              boxShadow: "0 4px 15px rgba(255,49,49,0.4)"
            }}
          >
            ➕ Oyuncu Kaydı Oluştur
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", color: "#aaa", padding: 50 }}>Yükleniyor...</div>
        ) : oyuncular.length === 0 ? (
          <div
            style={{
              background: "#151515",
              border: "1px solid #333",
              borderRadius: 18,
              padding: 30,
              textAlign: "center",
            }}
          >
            <h2 style={{ marginBottom: 10 }}>Henüz onaylı oyuncu bulunmuyor.</h2>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: 25,
              justifyItems: "center"
            }}
          >
            {oyuncular.map((oyuncu) => (
              <PlayerCard key={oyuncu.id} oyuncu={oyuncu} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

const TEAM_LOGOS: Record<string, string> = {
  "ALAÇAM SPOR": "/logos/alacam-spor.png",
  "KROKODİLLA FC": "/logos/krokodilla-fc.png",
  "DÜNDAR KÖYÜ": "/logos/dundar-koyu.png",
  "YEŞİL BURSA FC": "/logos/yesil-bursa-fc.png",
  "YEDİYOL BLACK FC": "/logos/yediyol-black-fc.png",
  "GRAVYER FC": "/logos/gravyer-fc.png",
  "BİSKREM FC": "/logos/biskrem-fc.png",
  "DİNAMO NALBANTOĞLU": "/logos/dinamo-nalbantoglu.png",
};

function PlayerCard({ oyuncu }: { oyuncu: Oyuncu }) {
  const isGold = oyuncu.is_premium;
  
  // Tüm oyuncular altın kart tasarımında olacak
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
        borderRadius: "10% 10% 45% 45% / 10% 10% 15% 15%", // FIFA kartı benzeri kesim
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
      {/* Sol Üst - Puan ve Mevki */}
      <div style={{ position: "absolute", top: 15, left: 15, textAlign: "center", zIndex: 2 }}>
        <div style={{ fontSize: 26, fontWeight: 900, color: textColor, lineHeight: 1 }}>
          {oyuncu.genel_puan || "0"}
        </div>
        <div style={{ fontSize: 13, fontWeight: 800, color: textColor, marginTop: 2 }}>
          {oyuncu.mevki ? oyuncu.mevki.substring(0,3).toUpperCase() : "OYT"}
        </div>
        <div style={{ fontSize: 10, fontWeight: 900, color: textColor, marginTop: 5, borderTop: `1px solid ${statsColor}`, paddingTop: 3 }}>
          KLAS
        </div>
      </div>

      {/* Oyuncu Fotoğrafı */}
      <div style={{ 
        width: 140, 
        height: 140, 
        marginTop: 30,
        position: "relative",
        zIndex: 1
      }}>
        {oyuncu.foto_url ? (
          <img 
            src={oyuncu.foto_url} 
            alt={oyuncu.ad_soyad} 
            style={{ 
              width: "100%", 
              height: "100%", 
              objectFit: "cover",
              objectPosition: "top",
              WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)",
              maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)"
            }} 
          />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "flex-end", justifyContent: "center", fontSize: 100, color: "rgba(0,0,0,0.2)" }}>
            👤
          </div>
        )}
      </div>

      {/* İsim Alanı */}
      <div style={{
        width: "80%",
        textAlign: "center",
        borderBottom: `1px solid ${statsColor}`,
        paddingBottom: 5,
        marginTop: 5,
        zIndex: 2
      }}>
        <div style={{ 
          fontSize: 18, 
          fontWeight: 900, 
          color: textColor,
          textTransform: "uppercase",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis"
        }}>
          {oyuncu.ad_soyad} {isGold && <span style={{ color: "#1d9bf0", textShadow: "none" }}>✔️</span>}
        </div>
      </div>

      {/* İstatistik / Takım Alanı */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        width: "85%", 
        marginTop: 10,
        zIndex: 2 
      }}>
        <div style={{ textAlign: "center", flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 900, color: textColor }}>{oyuncu.forma_no || "-"}</div>
          <div style={{ fontSize: 9, fontWeight: 700, color: statsColor }}>FORMA</div>
        </div>
        
        {/* Orta Kısım - Küçük Takım Logosu */}
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          {teamLogo ? (
            <img src={teamLogo} alt={oyuncu.takim} style={{ width: 30, height: 30, objectFit: "contain" }} />
          ) : (
            <div style={{ width: 1, height: 25, background: statsColor, opacity: 0.5 }}></div>
          )}
        </div>
        
        <div style={{ textAlign: "center", flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ 
            fontSize: 10, 
            fontWeight: 800, 
            color: textColor,
            maxWidth: 70,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            marginTop: 2
          }}>
            {oyuncu.takim}
          </div>
          <div style={{ fontSize: 9, fontWeight: 700, color: statsColor, marginTop: 2 }}>TAKIM</div>
        </div>
      </div>
      
      {/* Arka plan süslemesi (İsteğe bağlı, karta derinlik katar) */}
      {isGold && (
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 50%)",
          pointerEvents: "none",
          zIndex: 0
        }} />
      )}
    </div>
  );
}