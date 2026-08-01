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

function extractId(url: string): string | null {
  if (!url) return null;
  const m = url.match(
    /[?&]v=([\w-]{11})|youtu\.be\/([\w-]{11})|\/(?:embed|live|shorts)\/([\w-]{11})/i
  );
  return m ? m[1] || m[2] || m[3] : null;
}

export default function VideoArsivPage() {
  const [videolar, setVideolar] = useState<Video[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [secili, setSecili] = useState<Video | null>(null);

  useEffect(() => {
    supabase
      .from("videolar")
      .select("*")
      .order("tarih", { ascending: false })
      .then(({ data }) => {
        setVideolar(data || []);
        setYukleniyor(false);
      });
  }, []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === "Escape" && setSecili(null);
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  return (
    <div className="page">
      <div className="container">
        <div className="text-center mb-12">
          <h1 className="section-title">🎬 Video Arşivi</h1>
          <p className="section-sub">KLAS LİG BURSA</p>
        </div>

        {yukleniyor ? (
          <div className="grid-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="skeleton rounded-2xl"
                style={{ aspectRatio: "16/9" }}
              />
            ))}
          </div>
        ) : videolar.length === 0 ? (
          <div className="card text-center py-24">
            <div className="text-7xl mb-4 opacity-50">🎬</div>
            <p className="text-white text-xl font-black mb-2">
              Henüz video eklenmemiş
            </p>
            <p className="text-gray-500 text-sm">
              Admin panelinden video ekleyebilirsiniz.
            </p>
          </div>
        ) : (
          <div className="grid-3">
            {videolar.map((video) => {
              const vid = extractId(video.youtube_link);
              return (
                <div
                  key={video.id}
                  onClick={() => setSecili(video)}
                  className="card p-0 cursor-pointer overflow-hidden group rounded-2xl"
                >
                  {/* Thumbnail */}
                  <div
                    className="relative bg-[#1a1a1a] overflow-hidden"
                    style={{ aspectRatio: "16/9" }}
                  >
                    {vid && (
                      <img
                        src={`https://img.youtube.com/vi/${vid}/hqdefault.jpg`}
                        alt={video.baslik}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-300 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-[#ff3131]/90 flex items-center justify-center text-white text-2xl pl-1 shadow-[0_0_24px_rgba(255,49,49,0.6)] group-hover:scale-110 transition-transform duration-300">
                        ▶
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <p className="text-white font-black text-sm mb-1 line-clamp-2">
                      {video.baslik}
                    </p>
                    {video.aciklama && (
                      <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-2">
                        {video.aciklama}
                      </p>
                    )}
                    {video.tarih && (
                      <p className="text-[#ff3131] text-xs font-bold">
                        📅{" "}
                        {new Date(video.tarih).toLocaleDateString("tr-TR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
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
        <div
          onClick={() => setSecili(null)}
          className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-[9999] p-5"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-4xl w-full relative"
          >
            <button
              onClick={() => setSecili(null)}
              className="absolute -top-12 right-0 text-white text-3xl hover:text-[#ff3131] transition-colors font-black"
            >
              ✕
            </button>
            <div
              className="relative rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
              style={{ paddingBottom: "56.25%" }}
            >
              <iframe
                src={`https://www.youtube.com/embed/${extractId(secili.youtube_link)}?autoplay=1`}
                title={secili.baslik}
                className="absolute inset-0 w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <p className="text-white font-black text-lg mt-5 text-center">
              {secili.baslik}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
