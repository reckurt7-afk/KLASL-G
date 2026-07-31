"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

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
    return <div style={{ minHeight: "100vh", background: "#0b0b0b", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>Yükleniyor...</div>;
  }

  if (!oyuncu) {
    return <div style={{ minHeight: "100vh", background: "#0b0b0b", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>Oyuncu bulunamadı.</div>;
  }

  const teamLogo = TEAM_LOGOS[oyuncu.takim];
  const isGold = oyuncu.is_premium;

  return (
    <div style={{ minHeight: "100vh", backgroundImage: "url('/images/stadium.jpg')", backgroundSize: "cover", backgroundPosition: "center", padding: "90px 15px 30px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", background: "rgba(0,0,0,.85)", padding: 30, borderRadius: 24, border: "1px solid rgba(255,49,49,0.2)", display: "flex", flexDirection: "column", alignItems: "center" }}>
        
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <h1 style={{ color: "#fff", fontSize: 32, fontWeight: 900, marginBottom: 5 }}>{oyuncu.ad_soyad}</h1>
          <div style={{ color: "#ff3131", fontWeight: 700, letterSpacing: 2 }}>{oyuncu.takim}</div>
        </div>

        {/* Büyük Kart Görünümü */}
        <div style={{ transform: "scale(1.2)", margin: "40px 0 60px 0" }}>
          <div
            style={{
              position: "relative", width: 220, height: 330,
              background: "linear-gradient(135deg, #f6d365 0%, #ffb347 100%)",
              borderRadius: "10% 10% 45% 45% / 10% 10% 15% 15%",
              border: "3px solid #fff3cd",
              boxShadow: isGold ? "0 10px 25px rgba(255, 215, 0, 0.4)" : "0 10px 20px rgba(0,0,0,0.5)",
              overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center",
            }}
          >
            <div style={{ position: "absolute", top: 15, left: 15, textAlign: "center", zIndex: 2 }}>
              <div style={{ fontSize: 26, fontWeight: 900, color: "#4a3300", lineHeight: 1 }}>{oyuncu.genel_puan || "0"}</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#4a3300", marginTop: 2 }}>{oyuncu.mevki ? oyuncu.mevki.substring(0,3).toUpperCase() : "OYT"}</div>
              <div style={{ fontSize: 10, fontWeight: 900, color: "#4a3300", marginTop: 5, borderTop: "1px solid #855c0b", paddingTop: 3 }}>KLAS</div>
            </div>
            <div style={{ width: 140, height: 140, marginTop: 30, position: "relative", zIndex: 1 }}>
              {oyuncu.foto_url ? (
                <img src={oyuncu.foto_url} alt={oyuncu.ad_soyad} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)", maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)" }} />
              ) : (
                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "flex-end", justifyContent: "center", fontSize: 100, color: "rgba(0,0,0,0.2)" }}>👤</div>
              )}
            </div>
            <div style={{ width: "80%", textAlign: "center", borderBottom: "1px solid #855c0b", paddingBottom: 5, marginTop: 5, zIndex: 2 }}>
              <div style={{ fontSize: 18, fontWeight: 900, color: "#4a3300", textTransform: "uppercase", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {oyuncu.ad_soyad} {isGold && <span style={{ color: "#1d9bf0" }}>✔️</span>}
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "85%", marginTop: 10, zIndex: 2 }}>
              <div style={{ textAlign: "center", flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 900, color: "#4a3300" }}>{oyuncu.forma_no || "-"}</div>
                <div style={{ fontSize: 9, fontWeight: 700, color: "#855c0b" }}>FORMA</div>
              </div>
              <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
                {teamLogo ? (
                  <img src={teamLogo} alt={oyuncu.takim} style={{ width: 30, height: 30, objectFit: "contain" }} />
                ) : (
                  <div style={{ width: 1, height: 25, background: "#855c0b", opacity: 0.5 }}></div>
                )}
              </div>
              <div style={{ textAlign: "center", flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: "#4a3300", maxWidth: 70, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginTop: 2 }}>{oyuncu.takim}</div>
                <div style={{ fontSize: 9, fontWeight: 700, color: "#855c0b", marginTop: 2 }}>TAKIM</div>
              </div>
            </div>
            {isGold && <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 50%)", pointerEvents: "none", zIndex: 0 }} />}
          </div>
        </div>

        {/* QR Kod Alanı (Placeholder) */}
        <div style={{ background: "#111", border: "1px dashed #444", borderRadius: 16, padding: 30, textAlign: "center", width: "100%", maxWidth: 400 }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>📱</div>
          <h3 style={{ color: "#fff", fontWeight: 800, marginBottom: 10 }}>Forma QR Kodu (Yakında)</h3>
          <p style={{ color: "#888", fontSize: 14 }}>Bu alanda oyuncunun formasına basılabilecek ve tarandığında direkt bu sayfaya yönlendirecek QR kod yer alacak.</p>
        </div>

        <Link href="/takimlar" style={{ marginTop: 40, color: "#ff3131", textDecoration: "none", fontWeight: 700 }}>
          ← Takımlara Dön
        </Link>
      </div>
    </div>
  );
}
