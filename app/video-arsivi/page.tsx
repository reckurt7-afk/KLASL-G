"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Video = { id: number; baslik: string; youtube_link: string; aciklama: string; tarih: string };

function extractId(url: string): string | null {
  if (!url) return null;
  const m = url.match(/[?&]v=([\w-]{11})|youtu\.be\/([\w-]{11})|\/(?:embed|live|shorts)\/([\w-]{11})/i);
  return m ? (m[1] || m[2] || m[3]) : null;
}

export default function VideoArsivPage() {
  const [videolar, setVideolar] = useState<Video[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [secili, setSecili] = useState<Video | null>(null);

  useEffect(() => {
    supabase.from("videolar").select("*").order("tarih", { ascending: false })
      .then(({ data }) => { setVideolar(data || []); setYukleniyor(false); });
  }, []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === "Escape" && setSecili(null);
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  return (
    <div className="page">
      <div className="container">
        <div style={{ marginBottom: 40, textAlign: "center" }}>
          <p className="section-sub">KLAS LİG BURSA</p>
          <h1 className="section-title">🎬 Video Arşivi</h1>
        </div>

        {yukleniyor ? (
          <div className="grid-3">
            {[...Array(6)].map((_, i) => <div key={i} className="skeleton" style={{ aspectRatio: "16/9", borderRadius: 16 }} />)}
          </div>
        ) : videolar.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px", color: "var(--muted)" }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🎬</div>
            <p style={{ fontSize: 18, fontWeight: 700 }}>Henüz video eklenmemiş</p>
          </div>
        ) : (
          <div className="grid-3">
            {videolar.map(video => {
              const vid = extractId(video.youtube_link);
              return (
                <div key={video.id} className="card" onClick={() => setSecili(video)}
                  style={{ padding: 0, cursor: "pointer", overflow: "hidden" }}>
                  {/* Thumbnail */}
                  <div style={{ position: "relative", aspectRatio: "16/9", background: "#1a1a1a", overflow: "hidden" }}>
                    {vid && <img src={`https://img.youtube.com/vi/${vid}/hqdefault.jpg`} alt={video.baslik}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                    <div style={{
                      position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)",
                      display: "flex", alignItems: "center", justifyContent: "center"
                    }}>
                      <div style={{
                        width: 54, height: 54, borderRadius: "50%",
                        background: "rgba(255,49,49,0.9)", display: "flex",
                        alignItems: "center", justifyContent: "center",
                        fontSize: 22, paddingLeft: 4,
                        boxShadow: "0 0 24px rgba(255,49,49,0.6)",
                        transition: "transform 0.2s"
                      }}>▶</div>
                    </div>
                  </div>
                  <div style={{ padding: "14px 16px" }}>
                    <p style={{ color: "#fff", fontWeight: 800, fontSize: 14, marginBottom: 6 }}>{video.baslik}</p>
                    {video.aciklama && <p style={{ color: "var(--muted)", fontSize: 12, lineHeight: 1.6 }}>{video.aciklama}</p>}
                    {video.tarih && (
                      <p style={{ color: "var(--primary)", fontSize: 11, fontWeight: 700, marginTop: 10 }}>
                        📅 {new Date(video.tarih).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Video Modal */}
      {secili && (
        <div onClick={() => setSecili(null)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.95)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: 20 }}>
          <div onClick={e => e.stopPropagation()} style={{ maxWidth: 900, width: "100%", position: "relative" }}>
            <button onClick={() => setSecili(null)}
              style={{ position: "absolute", top: -44, right: 0, background: "none", border: "none", color: "#fff", fontSize: 28, cursor: "pointer" }}>✕</button>
            <div style={{ position: "relative", paddingBottom: "56.25%", borderRadius: 16, overflow: "hidden" }}>
              <iframe src={`https://www.youtube.com/embed/${extractId(secili.youtube_link)}?autoplay=1`}
                title={secili.baslik}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            </div>
            <p style={{ color: "#fff", fontWeight: 800, fontSize: 17, marginTop: 14, textAlign: "center" }}>{secili.baslik}</p>
          </div>
        </div>
      )}
    </div>
  );
}
