"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function CanliYayinPage() {
  const [videoId, setVideoId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const extractVideoId = (url: string) => {
    if (!url) return null;
    url = url.trim();
    // Eğer sadece 11 karakterli ID girilmişse direkt onu döndür
    if (url.length === 11 && !url.includes("youtube.com") && !url.includes("youtu.be")) {
      return url;
    }
    try {
      const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|live\/|shorts\/))([\w-]{11})/i);
      return match ? match[1] : null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    async function getir() {
      // Önce canlı bir maç var mı diye bakalım
      const { data: canliMac } = await supabase
        .from("maclar")
        .select("youtube_link")
        .eq("canli", true)
        .single();
      
      if (canliMac && canliMac.youtube_link) {
        setVideoId(extractVideoId(canliMac.youtube_link));
        setLoading(false);
        return;
      }

      // Canlı maç yoksa, genel ayarlardan (id=0) varsayılan tanıtım linkini çekelim
      const { data: ayar } = await supabase
        .from("maclar")
        .select("youtube_link")
        .eq("id", 0)
        .single();

      if (ayar && ayar.youtube_link) {
        setVideoId(extractVideoId(ayar.youtube_link));
      }
      
      setLoading(false);
    }
    getir();

  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#0b0b0b", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <h2 style={{ color: "#fff" }}>Canlı yayın aranıyor...</h2>
      </div>
    );
  }

  // Eğer canlı yayın ve genel ayar yoksa en son çare bir placeholder
  const activeVideoId = videoId || "jfKfPfyJRdk";

  return (
    <div style={{ minHeight: "100vh", background: "#0b0b0b", paddingTop: 100, paddingBottom: 60 }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 15px" }}>
        
        <div style={{ display: "flex", alignItems: "center", gap: 15, marginBottom: 30 }}>
          <div 
            style={{ 
              width: 15, 
              height: 15, 
              background: videoId ? "#ff3131" : "#888", 
              borderRadius: "50%", 
              boxShadow: videoId ? "0 0 15px #ff3131" : "none", 
              animation: videoId ? "pulse 1.5s infinite" : "none" 
            }} 
          />
          <h1 style={{ color: "#fff", fontSize: 32, fontWeight: 900, margin: 0, textTransform: "uppercase", letterSpacing: 1 }}>
            {videoId ? "CANLI YAYIN" : "ŞU AN CANLI YAYIN YOK"}
          </h1>
          <style>{`
            @keyframes pulse {
              0% { transform: scale(0.95); opacity: 0.8; }
              50% { transform: scale(1.3); opacity: 1; }
              100% { transform: scale(0.95); opacity: 0.8; }
            }
          `}</style>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
          {/* Video Player */}
          <div style={{ flex: "1 1 700px", background: "#111", borderRadius: 20, overflow: "hidden", border: "1px solid rgba(255,49,49,0.2)", boxShadow: "0 10px 40px rgba(0,0,0,0.5)" }}>
            <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
              <iframe
                src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1`}
                title="Klas Lig Canlı Yayın"
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>

          {/* Live Chat */}
          <div style={{ flex: "1 1 350px", height: "auto", minHeight: 500, background: "#111", borderRadius: 20, overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "15px 20px", background: "rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontWeight: 700, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 18 }}>💬</span> Canlı Sohbet
            </div>
            <div style={{ flex: 1, position: "relative" }}>
              <iframe
                src={`https://www.youtube.com/live_chat?v=${activeVideoId}&embed_domain=${typeof window !== "undefined" ? window.location.hostname : "klasl-g-4u2d.vercel.app"}`}
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
              />
            </div>
          </div>
        </div>

        {!videoId && (
          <div style={{ marginTop: 20, background: "rgba(255,49,49,0.1)", padding: 15, borderRadius: 12, border: "1px solid rgba(255,49,49,0.2)", color: "#ff3131", fontWeight: 700 }}>
            Şu an devam eden bir maç yayını bulunmamaktadır. Aşağıdaki video örnektir.
          </div>
        )}

      </div>
    </div>
  );
}
