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
        const { data: maclar } = await supabase
          .from("maclar")
          .select("youtube_link")
          .eq("canli", true)
          .limit(1);

        if (maclar && maclar.length > 0 && maclar[0].youtube_link) {
          const id = extractVideoId(maclar[0].youtube_link);
          if (id) { setVideoId(id); setLoading(false); return; }
        }

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
      <div className="page flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#ceaa52] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 font-bold">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (hata) {
    return (
      <div className="page flex flex-col items-center justify-center gap-4">
        <div className="text-6xl">⚠️</div>
        <div className="text-[#ceaa52] font-bold text-lg">Bir hata oluştu</div>
        <div className="text-gray-400 text-sm bg-[#111] border border-white/10 rounded-xl px-6 py-3">{hata}</div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container max-w-[1400px]">

        {/* Başlık */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            {videoId ? (
              <span className="relative flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ceaa52] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-[#ceaa52]"></span>
              </span>
            ) : (
              <span className="w-4 h-4 rounded-full bg-gray-600 inline-block" />
            )}
            <h1 className="section-title mb-0">
              {videoId ? "CANLI YAYIN" : "ŞU AN CANLI YAYIN YOK"}
            </h1>
          </div>
          <p className="section-sub">PRİME LİG BURSA</p>
        </div>

        {videoId ? (
          <div className="flex flex-wrap gap-5">
            {/* YouTube Player */}
            <div className="flex-1 min-w-[300px] bg-[#111] rounded-2xl overflow-hidden border border-[rgba(212,175,55,0.2)] shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
              <div className="relative" style={{ paddingBottom: "56.25%" }}>
                <iframe
                  key={videoId}
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                  title="Prime Lig Canlı Yayın"
                  className="absolute inset-0 w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>

            {/* Canlı Sohbet */}
            <div className="flex-1 min-w-[280px] min-h-[450px] bg-[#111] rounded-2xl overflow-hidden border border-[rgba(255,255,255,0.07)] flex flex-col">
              <div className="px-5 py-4 bg-[rgba(255,255,255,0.04)] border-b border-white/10 text-white font-bold flex items-center gap-3">
                <span className="text-xl">💬</span> Canlı Sohbet
              </div>
              <div className="flex-1 relative">
                <iframe
                  src={`https://www.youtube.com/live_chat?v=${videoId}&embed_domain=${typeof window !== "undefined" ? window.location.hostname : "localhost"}`}
                  className="absolute inset-0 w-full h-full border-0"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="card text-center py-24 px-6">
            <div className="text-8xl mb-6 opacity-50">📺</div>
            <h2 className="text-white text-2xl font-black mb-3">Şu an aktif yayın yok</h2>
            <p className="text-gray-500 text-sm max-w-sm mx-auto leading-relaxed">
              Admin paneli → Ayarlar'dan bir YouTube linki ekleyerek canlı yayını başlatabilirsiniz.
            </p>
            <div className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-[rgba(212,175,55,0.1)] border border-[rgba(212,175,55,0.2)] rounded-xl text-[#ceaa52] font-bold text-sm">
              🔴 Bir sonraki maç için takipte kalın!
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
