"use client";

import { useState } from "react";

export default function CanliYayinPage() {
  // Lofi Girl video ID for placeholder - we need a mechanism to update this
  const [videoId, setVideoId] = useState("jfKfPfyJRdk"); 

  return (
    <div style={{ minHeight: "100vh", background: "#0b0b0b", paddingTop: 100, paddingBottom: 60 }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 15px" }}>
        
        <div style={{ display: "flex", alignItems: "center", gap: 15, marginBottom: 30 }}>
          <div 
            style={{ 
              width: 15, 
              height: 15, 
              background: "#ff3131", 
              borderRadius: "50%", 
              boxShadow: "0 0 15px #ff3131", 
              animation: "pulse 1.5s infinite" 
            }} 
          />
          <h1 style={{ color: "#fff", fontSize: 32, fontWeight: 900, margin: 0, textTransform: "uppercase", letterSpacing: 1 }}>
            CANLI YAYIN
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
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
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
                src={`https://www.youtube.com/live_chat?v=${videoId}&embed_domain=${typeof window !== "undefined" ? window.location.hostname : "klasl-g-4u2d.vercel.app"}`}
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
              />
            </div>
          </div>
        </div>

        <div style={{ marginTop: 20, background: "rgba(255,255,255,0.05)", padding: 15, borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)" }}>
          <p style={{ color: "#aaa", fontSize: 13, margin: 0 }}>
            <strong style={{ color: "#fff" }}>Admin Bilgilendirmesi:</strong> YouTube canlı sohbet kutusunun düzgün çalışabilmesi için her yayında güncel YouTube <b>Video Linkini (veya ID'sini)</b> sisteme girmeniz gerekmektedir. (Bunun için yakında admin paneline bir ayar eklenecektir).
          </p>
        </div>

      </div>
    </div>
  );
}
