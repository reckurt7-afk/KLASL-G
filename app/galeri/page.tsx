"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Foto = { id: number; url: string; baslik: string; created_at: string };

export default function GaleriPage() {
  const [fotolar, setFotolar] = useState<Foto[]>([]);
  const [secili, setSecili] = useState<Foto | null>(null);
  const [seciliIdx, setSeciliIdx] = useState(0);
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    supabase.from("galeri").select("*").order("created_at", { ascending: false })
      .then(({ data }) => { setFotolar(data || []); setYukleniyor(false); });
  }, []);

  function ac(foto: Foto, idx: number) { setSecili(foto); setSeciliIdx(idx); }
  function onceki() { const i = (seciliIdx - 1 + fotolar.length) % fotolar.length; setSecili(fotolar[i]); setSeciliIdx(i); }
  function sonraki() { const i = (seciliIdx + 1) % fotolar.length; setSecili(fotolar[i]); setSeciliIdx(i); }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!secili) return;
      if (e.key === "Escape") setSecili(null);
      if (e.key === "ArrowLeft") onceki();
      if (e.key === "ArrowRight") sonraki();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [secili, seciliIdx, fotolar]);

  return (
    <div className="page">
      <div className="container">
        <div style={{ marginBottom: 40, textAlign: "center" }}>
          <p className="section-sub">KLAS LİG BURSA</p>
          <h1 className="section-title">📸 Fotoğraf Galerisi</h1>
        </div>

        {yukleniyor ? (
          <div className="grid-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton" style={{ aspectRatio: "3/2", borderRadius: 16 }} />
            ))}
          </div>
        ) : fotolar.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px", color: "var(--muted)" }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>📷</div>
            <p style={{ fontSize: 18, fontWeight: 700 }}>Henüz fotoğraf eklenmemiş</p>
          </div>
        ) : (
          <div className="grid-3">
            {fotolar.map((foto, idx) => (
              <div
                key={foto.id}
                onClick={() => ac(foto, idx)}
                className="card"
                style={{ padding: 0, cursor: "pointer", overflow: "hidden" }}
              >
                <div style={{ position: "relative", aspectRatio: "3/2", background: "#1a1a1a", overflow: "hidden" }}>
                  <img
                    src={foto.url}
                    alt={foto.baslik || "Fotoğraf"}
                    style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s" }}
                    onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.06)")}
                    onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                  />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)", opacity: 0, transition: "opacity 0.3s" }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
                    onMouseLeave={e => (e.currentTarget.style.opacity = "0")}
                  />
                  <div style={{ position: "absolute", bottom: 12, left: 12, right: 12 }}>
                    {foto.baslik && <p style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>{foto.baslik}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {secili && (
        <div
          onClick={() => setSecili(null)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.95)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: 20 }}
        >
          <button onClick={e => { e.stopPropagation(); onceki(); }}
            style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", width: 48, height: 48, borderRadius: "50%", fontSize: 22, cursor: "pointer", zIndex: 10 }}>
            ←
          </button>
          <div onClick={e => e.stopPropagation()} style={{ maxWidth: 900, width: "100%", position: "relative" }}>
            <button onClick={() => setSecili(null)}
              style={{ position: "absolute", top: -44, right: 0, background: "none", border: "none", color: "#fff", fontSize: 28, cursor: "pointer" }}>✕</button>
            <img src={secili.url} alt={secili.baslik} style={{ width: "100%", borderRadius: 16, maxHeight: "80vh", objectFit: "contain" }} />
            {secili.baslik && <p style={{ textAlign: "center", color: "#fff", fontWeight: 700, marginTop: 14, fontSize: 16 }}>{secili.baslik}</p>}
            <p style={{ textAlign: "center", color: "var(--muted)", fontSize: 12, marginTop: 6 }}>{seciliIdx + 1} / {fotolar.length} — ok tuşlarıyla gezebi­lirsin</p>
          </div>
          <button onClick={e => { e.stopPropagation(); sonraki(); }}
            style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", width: 48, height: 48, borderRadius: "50%", fontSize: 22, cursor: "pointer", zIndex: 10 }}>
            →
          </button>
        </div>
      )}
    </div>
  );
}
