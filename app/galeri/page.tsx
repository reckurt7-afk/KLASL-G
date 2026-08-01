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
    supabase
      .from("galeri")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setFotolar(data || []);
        setYukleniyor(false);
      });
  }, []);

  function ac(foto: Foto, idx: number) {
    setSecili(foto);
    setSeciliIdx(idx);
  }
  function onceki() {
    const i = (seciliIdx - 1 + fotolar.length) % fotolar.length;
    setSecili(fotolar[i]);
    setSeciliIdx(i);
  }
  function sonraki() {
    const i = (seciliIdx + 1) % fotolar.length;
    setSecili(fotolar[i]);
    setSeciliIdx(i);
  }

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
        <div className="text-center mb-12">
          <h1 className="section-title">📸 Fotoğraf Galerisi</h1>
          <p className="section-sub">KLAS LİG BURSA</p>
        </div>

        {yukleniyor ? (
          <div className="grid-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="skeleton rounded-2xl"
                style={{ aspectRatio: "3/2" }}
              />
            ))}
          </div>
        ) : fotolar.length === 0 ? (
          <div className="card text-center py-24">
            <div className="text-7xl mb-4 opacity-50">📷</div>
            <p className="text-white text-xl font-black mb-2">
              Henüz fotoğraf eklenmemiş
            </p>
            <p className="text-gray-500 text-sm">
              Admin panelinden fotoğraf ekleyebilirsiniz.
            </p>
          </div>
        ) : (
          <div className="grid-3">
            {fotolar.map((foto, idx) => (
              <div
                key={foto.id}
                onClick={() => ac(foto, idx)}
                className="card p-0 cursor-pointer overflow-hidden group rounded-2xl"
              >
                <div
                  className="relative overflow-hidden bg-[#1a1a1a]"
                  style={{ aspectRatio: "3/2" }}
                >
                  <img
                    src={foto.url}
                    alt={foto.baslik || "Fotoğraf"}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {foto.baslik && (
                    <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-white font-bold text-sm">{foto.baslik}</p>
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-14 h-14 rounded-full bg-[#ff3131]/80 backdrop-blur-sm flex items-center justify-center text-white text-2xl shadow-[0_0_20px_rgba(255,49,49,0.5)]">
                      🔍
                    </div>
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
          className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-[9999] p-5"
        >
          {/* Sol ok */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onceki();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 border border-white/20 text-white text-2xl flex items-center justify-center hover:bg-[#ff3131]/60 transition-colors z-10"
          >
            ←
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-4xl w-full relative"
          >
            {/* Kapat */}
            <button
              onClick={() => setSecili(null)}
              className="absolute -top-12 right-0 text-white text-3xl hover:text-[#ff3131] transition-colors font-black"
            >
              ✕
            </button>

            <img
              src={secili.url}
              alt={secili.baslik}
              className="w-full rounded-2xl max-h-[80vh] object-contain"
            />

            <div className="mt-4 text-center">
              {secili.baslik && (
                <p className="text-white font-bold text-lg">{secili.baslik}</p>
              )}
              <p className="text-gray-500 text-xs mt-2">
                {seciliIdx + 1} / {fotolar.length} — ← → ok tuşlarıyla gezebilirsiniz
              </p>
            </div>
          </div>

          {/* Sağ ok */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              sonraki();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 border border-white/20 text-white text-2xl flex items-center justify-center hover:bg-[#ff3131]/60 transition-colors z-10"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}
