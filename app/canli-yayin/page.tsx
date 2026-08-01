"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function CanliYayinPage() {
  const [videoId, setVideoId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [hata, setHata] = useState("");

  const extractVideoId = (url: string): string | null => {
    if (!url) return null;
    url = url.trim();
    // Sadece 11 karakterlik ham ID girilmişse
    if (/^[\w-]{11}$/.test(url)) return url;
    try {
      const match = url.match(
        /[?&]v=([\w-]{11})|youtu\.be\/([\w-]{11})|\/(?:embed|live|shorts)\/([\w-]{11})/i
      );
      if (match) return match[1] || match[2] || match[3];
    } catch {}
    return null;
  };

  useEffect(() => {
    async function getir() {
      try {
        // 1) Canlı maç var mı?
        const { data: maclar } = await supabase
          .from("maclar")
          .select("youtube_link")
          .eq("canli", true)
          .limit(1);

        if (maclar && maclar.length > 0 && maclar[0].youtube_link) {
          const id = extractVideoId(maclar[0].youtube_link);
          if (id) { setVideoId(id); setLoading(false); return; }
        }

        // 2) Canlı maç yoksa ayarlar tablosundan çek
        const { data: ayarlar, error } = await supabase
          .from("ayarlar")
          .select("deger")
          .eq("anahtar", "canli_yayin_link")
          .limit(1);

        if (error) {
          setHata("Ayarlar tablosu okunamadı: " + error.message);
          setLoading(false);
          return;
        }

        if (ayarlar && ayarlar.length > 0 && ayarlar[0].deger) {
          const id = extractVideoId(ayarlar[0].deger);
          setVideoId(id);
        }
      } catch (e: any) {
        setHata("Hata: " + e.message);
      }

      setLoading(false);
    }
    getir();
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#0b0b0b", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <h2 style={{ color: "#fff" }}>Yükleniyor...</h2>
      </div>
    );
  }

  if (hata) {
    return (
      <div style={{ minHeight: "100vh", background: "#0b0b0b", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
        <div style={{ color: "#ff3131", fontWeight: 700, fontSize: 18 }}>⚠️ Bir hata oluştu</div>
        <div style={{ color: "#aaa", fontSize: 14 }}>{hata}</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0b0b0b", paddingTop: 100, paddingBottom: 60 }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 15px" }}>

        {/* Başlık */}
        <div style={{ display: "flex", alignItems: "center", gap: 15, marginBottom: 30 }}>
          <div
            style={{
              width: 15, height: 15,
              background: videoId ? "#ff3131" : "#888",
              borderRadius: "50%",
              boxShadow: videoId ? "0 0 15px #ff3131" : "none",
              animation: videoId ? "pulse 1.5s infinite" : "none",
            }}
          />
          <h1 style={{ color: "#fff", fontSize: 32, fontWeight: 900, margin: 0, textTransform: "uppercase", letterSpacing: 1 }}>
            {videoId ? "CANLI YAYIN" : "ŞU AN CANLI YAYIN YOK"}
          </h1>
          <style>{`
            @keyframes pulse {
              0%   { transform: scale(0.95); opacity: 0.8; }
              50%  { transform: scale(1.3);  opacity: 1; }
              100% { transform: scale(0.95); opacity: 0.8; }
            }
          `}</style>
        </div>

        {videoId ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
            {/* YouTube Player */}
            <div style={{ flex: "1 1 700px", background: "#111", borderRadius: 20, overflow: "hidden", border: "1px solid rgba(255,49,49,0.2)", boxShadow: "0 10px 40px rgba(0,0,0,0.5)" }}>
              <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
                <iframe
                  key={videoId}
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                  title="Klas Lig Canlı Yayın"
                  style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>

            {/* Canlı Sohbet */}
            <div style={{ flex: "1 1 350px", minHeight: 500, background: "#111", borderRadius: 20, overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)", display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "15px 20px", background: "rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontWeight: 700, display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 18 }}>💬</span> Canlı Sohbet
              </div>
              <div style={{ flex: 1, position: "relative" }}>
                <iframe
                  src={`https://www.youtube.com/live_chat?v=${videoId}&embed_domain=${typeof window !== "undefined" ? window.location.hostname : "klasl-g-4u2d.vercel.app"}`}
                  style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "80px 20px", color: "#aaa" }}>
            <div style={{ fontSize: 80, marginBottom: 20 }}>📺</div>
            <p style={{ fontSize: 20, color: "#fff", fontWeight: 700 }}>Şu an aktif yayın yok</p>
            <p style={{ fontSize: 14, marginTop: 10 }}>Admin paneli → Ayarlar'dan bir YouTube linki ekleyebilirsin.</p>
          </div>
        )}

      </div>
    </div>
  );
}
