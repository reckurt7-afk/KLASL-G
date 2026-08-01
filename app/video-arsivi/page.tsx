"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Video = {
  id: number;
  baslik: string;
  youtube_link: string;
  aciklama: string;
  tarih: string;
};

function extractVideoId(url: string): string | null {
  if (!url) return null;
  const match = url.match(/[?&]v=([\w-]{11})|youtu\.be\/([\w-]{11})|\/(?:embed|live|shorts)\/([\w-]{11})/i);
  return match ? (match[1] || match[2] || match[3]) : null;
}

export default function VideoArsivPage() {
  const [videolar, setVideolar] = useState<Video[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [secili, setSecili] = useState<Video | null>(null);

  useEffect(() => {
    async function getir() {
      const { data } = await supabase
        .from("videolar")
        .select("*")
        .order("tarih", { ascending: false });
      setVideolar(data || []);
      setYukleniyor(false);
    }
    getir();
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#0b0b0b", paddingTop: 90, paddingBottom: 60 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 15px" }}>

        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h1 style={{ color: "#fff", fontSize: 36, fontWeight: 900, margin: 0 }}>🎬 VİDEO ARŞİVİ</h1>
          <div style={{ color: "#ff3131", fontSize: 12, letterSpacing: 4, fontWeight: 800, marginTop: 8 }}>KLAS LİG BURSA</div>
        </div>

        {yukleniyor ? (
          <div style={{ textAlign: "center", color: "#aaa", padding: 60 }}>Yükleniyor...</div>
        ) : videolar.length === 0 ? (
          <div style={{ textAlign: "center", color: "#aaa", padding: 60 }}>
            <div style={{ fontSize: 60, marginBottom: 15 }}>🎬</div>
            <p style={{ fontSize: 18 }}>Henüz video yok.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
            {videolar.map(video => {
              const vid = extractVideoId(video.youtube_link);
              return (
                <div
                  key={video.id}
                  onClick={() => setSecili(video)}
                  style={{
                    background: "#111",
                    borderRadius: 16,
                    overflow: "hidden",
                    border: "1px solid rgba(255,255,255,0.08)",
                    cursor: "pointer",
                    transition: "transform 0.2s, border-color 0.2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.borderColor = "rgba(255,49,49,0.4)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
                >
                  {/* Thumbnail */}
                  <div style={{ position: "relative", paddingBottom: "56.25%", background: "#1a1a1a" }}>
                    {vid ? (
                      <>
                        <img
                          src={`https://img.youtube.com/vi/${vid}/hqdefault.jpg`}
                          alt={video.baslik}
                          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                        />
                        <div style={{
                          position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
                          background: "rgba(0,0,0,0.3)"
                        }}>
                          <div style={{
                            width: 60, height: 60, borderRadius: "50%",
                            background: "rgba(255,49,49,0.9)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 24, paddingLeft: 5,
                            boxShadow: "0 0 20px rgba(255,49,49,0.5)"
                          }}>▶</div>
                        </div>
                      </>
                    ) : (
                      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#aaa", fontSize: 40 }}>🎬</div>
                    )}
                  </div>

                  <div style={{ padding: "15px" }}>
                    <div style={{ color: "#fff", fontWeight: 800, fontSize: 15, marginBottom: 6 }}>{video.baslik}</div>
                    {video.aciklama && <div style={{ color: "#aaa", fontSize: 13, lineHeight: 1.5 }}>{video.aciklama}</div>}
                    {video.tarih && (
                      <div style={{ color: "#ff3131", fontSize: 12, fontWeight: 700, marginTop: 10 }}>
                        📅 {new Date(video.tarih).toLocaleDateString("tr-TR")}
                      </div>
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
        <div
          onClick={() => setSecili(null)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 9999, padding: 20,
          }}
        >
          <div onClick={e => e.stopPropagation()} style={{ maxWidth: 900, width: "100%", position: "relative" }}>
            <button
              onClick={() => setSecili(null)}
              style={{ position: "absolute", top: -45, right: 0, background: "none", border: "none", color: "#fff", fontSize: 30, cursor: "pointer" }}
            >✕</button>
            <div style={{ position: "relative", paddingBottom: "56.25%", borderRadius: 16, overflow: "hidden" }}>
              <iframe
                src={`https://www.youtube.com/embed/${extractVideoId(secili.youtube_link)}?autoplay=1`}
                title={secili.baslik}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div style={{ color: "#fff", fontWeight: 800, fontSize: 18, marginTop: 15, textAlign: "center" }}>{secili.baslik}</div>
          </div>
        </div>
      )}
    </div>
  );
}
