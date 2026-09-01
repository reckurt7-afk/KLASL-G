"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function OyuncuKayitPage() {
  const [takimlar, setTakimlar] = useState<any[]>([]);
  const [adSoyad, setAdSoyad] = useState("");
  const [formaNo, setFormaNo] = useState("");
  const [takim, setTakim] = useState("");
  const [mevki, setMevki] = useState("");
  const [telefon, setTelefon] = useState("");
  const [foto, setFoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [hata, setHata] = useState("");

  useEffect(() => {
    supabase.from("takimlar").select("id, ad").order("ad").then(({ data }) => {
      setTakimlar(data || []);
    });
  }, []);

  async function basvuruGonder(e: React.FormEvent) {
    e.preventDefault();
    setHata("");

    if (!adSoyad || !formaNo || !takim) {
      setHata("Lütfen zorunlu alanları doldurun: Ad Soyad, Forma No, Takım.");
      return;
    }

    setLoading(true);
    let foto_url = null;

    if (foto) {
      const fileExt = foto.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, foto);

      if (uploadError) {
        setHata("Fotoğraf yüklenirken hata oluştu.");
        setLoading(false);
        return;
      }
      const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);
      foto_url = data.publicUrl;
    }

    const { error } = await supabase.from("oyuncu_basvurulari").insert({
      ad_soyad: adSoyad,
      telefon: telefon,
      takim: takim,
      mevki: mevki,
      forma_no: Number(formaNo),
      durum: "beklemede",
      foto_url: foto_url,
    });

    setLoading(false);

    if (error) {
      setHata("Başvuru gönderilemedi: " + error.message);
      return;
    }

    setSuccess(true);
  }

  if (success) {
    return (
      <div className="page flex items-center justify-center px-4">
        <div className="card max-w-md w-full text-center py-16 px-8">
          <div className="text-7xl mb-6">✅</div>
          <h2 className="text-white text-2xl font-black mb-3">Başvurunuz Alındı!</h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-8">
            Yönetici onayından sonra profiliniz aktif edilecektir. Sizi en kısa sürede haberdar edeceğiz.
          </p>
          <Link
            href="/takimlar"
            className="inline-block w-full py-4 bg-gradient-to-r from-[#ff3131] to-[#a11212] text-white font-black rounded-xl shadow-[0_8px_20px_rgba(255,49,49,0.3)] hover:shadow-[0_8px_30px_rgba(255,49,49,0.5)] transition-all text-center"
          >
            TAKIMLARA DÖN
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container max-w-xl">
        <div className="text-center mb-10">
          <h1 className="section-title">👤 OYUNCU KAYDI</h1>
          <p className="section-sub">PRO LİG BURSA</p>
        </div>

        <div className="card p-8">
          {hata && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm font-medium mb-6">
              ⚠️ {hata}
            </div>
          )}

          <form onSubmit={basvuruGonder} className="space-y-5">
            {/* Fotoğraf */}
            <div>
              <label className="text-gray-400 text-xs font-bold uppercase tracking-wider block mb-2">
                📸 Profil Fotoğrafı
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.length && setFoto(e.target.files[0])}
                className="w-full bg-[#0d0d0d] border border-[rgba(255,255,255,0.08)] rounded-xl px-4 py-3 text-gray-400 text-sm file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-[#ff3131] file:text-white file:text-xs file:font-bold file:cursor-pointer"
              />
            </div>

            {/* Ad Soyad */}
            <div>
              <label className="text-gray-400 text-xs font-bold uppercase tracking-wider block mb-2">
                Ad Soyad *
              </label>
              <input
                type="text"
                required
                placeholder="Adınız Soyadınız"
                value={adSoyad}
                onChange={(e) => setAdSoyad(e.target.value)}
                className="w-full bg-[#0d0d0d] border border-[rgba(255,255,255,0.08)] rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#ff3131] transition-colors text-sm"
              />
            </div>

            {/* Telefon */}
            <div>
              <label className="text-gray-400 text-xs font-bold uppercase tracking-wider block mb-2">
                Telefon
              </label>
              <input
                type="tel"
                placeholder="05XXXXXXXXX"
                value={telefon}
                onChange={(e) => setTelefon(e.target.value)}
                className="w-full bg-[#0d0d0d] border border-[rgba(255,255,255,0.08)] rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#ff3131] transition-colors text-sm"
              />
            </div>

            {/* Forma No */}
            <div>
              <label className="text-gray-400 text-xs font-bold uppercase tracking-wider block mb-2">
                Forma Numarası *
              </label>
              <input
                type="number"
                required
                min={1}
                max={99}
                placeholder="10"
                value={formaNo}
                onChange={(e) => setFormaNo(e.target.value)}
                className="w-full bg-[#0d0d0d] border border-[rgba(255,255,255,0.08)] rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#ff3131] transition-colors text-sm"
              />
            </div>

            {/* Mevki */}
            <div>
              <label className="text-gray-400 text-xs font-bold uppercase tracking-wider block mb-2">
                Mevki
              </label>
              <select
                value={mevki}
                onChange={(e) => setMevki(e.target.value)}
                className="w-full bg-[#0d0d0d] border border-[rgba(255,255,255,0.08)] rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#ff3131] transition-colors text-sm"
              >
                <option value="">Mevki Seçiniz</option>
                <option value="Kaleci">Kaleci</option>
                <option value="Defans">Defans</option>
                <option value="Orta Saha">Orta Saha</option>
                <option value="Forvet">Forvet</option>
              </select>
            </div>

            {/* Takım */}
            <div>
              <label className="text-gray-400 text-xs font-bold uppercase tracking-wider block mb-2">
                Takım *
              </label>
              <select
                required
                value={takim}
                onChange={(e) => setTakim(e.target.value)}
                className="w-full bg-[#0d0d0d] border border-[rgba(255,255,255,0.08)] rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#ff3131] transition-colors text-sm"
              >
                <option value="">Takım Seçiniz</option>
                {takimlar.map((t) => (
                  <option key={t.id} value={t.ad}>{t.ad}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-[#ff3131] to-[#a11212] text-white font-black rounded-xl text-base shadow-[0_8px_20px_rgba(255,49,49,0.3)] hover:shadow-[0_8px_30px_rgba(255,49,49,0.5)] hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Gönderiliyor...
                </span>
              ) : "BAŞVURUYU GÖNDER →"}
            </button>

            <Link
              href="/takimlar"
              className="block text-center text-gray-500 text-sm hover:text-gray-300 transition-colors mt-2"
            >
              ← Takımlara Geri Dön
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}