"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Foto = {
  id: number;
  url: string;
  baslik: string;
  created_at: string;
};

export default function GaleriPage() {
  const [fotolar, setFotolar] = useState<Foto[]>([]);
  const [secili, setSecili] = useState<Foto | null>(null);
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    async function getir() {
      const { data } = await supabase
        .from("galeri")
        .select("*")
        .order("created_at", { ascending: false });
      setFotolar(data || []);
      setYukleniyor(false);
    }
    getir();
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#0b0b0b", paddingTop: 90, paddingBottom: 60 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 15px" }}>
        
        {/* Başlık */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h1 style={{ color: "#fff", fontSize: 36, fontWeight: 900, margin: 0 }}>📸 FOTOĞRAF GALERİSİ</h1>
          <div style={{ color: "#ff3131", fontSize: 12, letterSpacing: 4, fontWeight: 800, marginTop: 8 }}>KLAS LİG BURSA</div>
        </div>

        {yukleniyor ? (
          <div style={{ textAlign: "center", color: "#aaa", padding: 60 }}>Yükleniyor...</div>
        ) : fotolar.length === 0 ? (
          <div style={{ textAlign: "center", color: "#aaa", padding: 60, fontSize: 18 }}>
            <div style={{ fontSize: 60, marginBottom: 15 }}>📷</div>
            Henüz fotoğraf yok.
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 15,
          }}>
            {fotolar.map((foto) => (
              <div
                key={foto.id}
                onClick={() => setSecili(foto)}
                style={{
                  background: "#111",
                  borderRadius: 16,
                  overflow: "hidden",
                  border: "1px solid rgba(255,255,255,0.08)",
                  cursor: "pointer",
                  transition: "transform 0.2s, border-color 0.2s",
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
              >
                <div style={{ position: "relative", paddingBottom: "66%", background: "#1a1a1a" }}>
                  <img
                    src={foto.url}
                    alt={foto.baslik}
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
                {foto.baslik && (
                  <div style={{ padding: "12px 15px", color: "#fff", fontWeight: 700, fontSize: 14 }}>
                    {foto.baslik}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
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
            <img src={secili.url} alt={secili.baslik} style={{ width: "100%", borderRadius: 16, maxHeight: "80vh", objectFit: "contain" }} />
            {secili.baslik && (
              <div style={{ textAlign: "center", color: "#fff", fontWeight: 700, marginTop: 15, fontSize: 18 }}>{secili.baslik}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
