"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

const takimlar = [
  "PS 5",
  "DİNAMO NALBANTOĞLU",
  "KROKODİLLA FC",
  "NOVA FC",
  "YEŞİL BURSA FC",
  "YEDİYOL BLACK FC",
  "GRAVYER FC",
  "BİSKREM FC",
];

const mevkiler = ["Kaleci", "Defans", "Orta Saha", "Forvet"];

export default function OyuncuBasvurusuPage() {
  const [form, setForm] = useState({
    ad_soyad: "",
    telefon: "",
    dogum_tarihi: "",
    takim: "",
    mevki: "",
    forma_no: "",
    aciklama: "",
  });
  const [loading, setLoading] = useState(false);
  const [basari, setBasari] = useState(false);
  const [hata, setHata] = useState("");

  function degistir(alan: string, deger: string) {
    setForm({ ...form, [alan]: deger });
  }

  async function gonder(e: React.FormEvent) {
    e.preventDefault();
    setHata("");
    setLoading(true);

    const { error } = await supabase.from("oyuncu_basvurulari").insert({
      ad_soyad: form.ad_soyad,
      telefon: form.telefon,
      dogum_tarihi: form.dogum_tarihi || null,
      takim: form.takim,
      mevki: form.mevki,
      forma_no: Number(form.forma_no),
      aciklama: form.aciklama,
    });

    if (error) {
      setHata("Başvuru gönderilemedi. Lütfen tekrar deneyin.");
      setLoading(false);
      return;
    }

    setBasari(true);
    setLoading(false);
    setForm({
      ad_soyad: "",
      telefon: "",
      dogum_tarihi: "",
      takim: "",
      mevki: "",
      forma_no: "",
      aciklama: "",
    });
  }

  if (basari) {
    return (
      <div className="page flex items-center justify-center px-4">
        <div className="card max-w-md w-full text-center py-16 px-8">
          <div className="text-7xl mb-6">🎉</div>
          <h2 className="text-white text-2xl font-black mb-3">Başvuru Alındı!</h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-8">
            Başvurunuz başarıyla gönderildi. Yönetim ekibimiz inceleyerek sizinle iletişime geçecek.
          </p>
          <button
            onClick={() => setBasari(false)}
            className="w-full py-4 bg-gradient-to-r from-[#ff3131] to-[#a11212] text-white font-black rounded-xl shadow-[0_8px_20px_rgba(255,49,49,0.3)] hover:shadow-[0_8px_30px_rgba(255,49,49,0.5)] transition-all"
          >
            YENİ BAŞVURU YAP
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container max-w-xl">
        <div className="text-center mb-10">
          <h1 className="section-title">👤 OYUNCU BAŞVURUSU</h1>
          <p className="section-sub">KLAS LİG BURSA</p>
        </div>

        <div className="card p-8">
          {hata && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm font-medium mb-6">
              ⚠️ {hata}
            </div>
          )}

          <form onSubmit={gonder} className="space-y-5">
            {/* Ad Soyad */}
            <div>
              <label className="text-gray-400 text-xs font-bold uppercase tracking-wider block mb-2">
                Ad Soyad *
              </label>
              <input
                type="text"
                required
                placeholder="Adınız Soyadınız"
                value={form.ad_soyad}
                onChange={(e) => degistir("ad_soyad", e.target.value)}
                className="w-full bg-[#0d0d0d] border border-[rgba(255,255,255,0.08)] rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#ff3131] transition-colors text-sm"
              />
            </div>

            {/* Telefon */}
            <div>
              <label className="text-gray-400 text-xs font-bold uppercase tracking-wider block mb-2">
                Telefon *
              </label>
              <input
                type="tel"
                required
                placeholder="05XXXXXXXXX"
                value={form.telefon}
                onChange={(e) => degistir("telefon", e.target.value)}
                className="w-full bg-[#0d0d0d] border border-[rgba(255,255,255,0.08)] rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#ff3131] transition-colors text-sm"
              />
            </div>

            {/* Doğum Tarihi */}
            <div>
              <label className="text-gray-400 text-xs font-bold uppercase tracking-wider block mb-2">
                Doğum Tarihi
              </label>
              <input
                type="date"
                value={form.dogum_tarihi}
                onChange={(e) => degistir("dogum_tarihi", e.target.value)}
                className="w-full bg-[#0d0d0d] border border-[rgba(255,255,255,0.08)] rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#ff3131] transition-colors text-sm"
              />
            </div>

            {/* Takım */}
            <div>
              <label className="text-gray-400 text-xs font-bold uppercase tracking-wider block mb-2">
                Takım *
              </label>
              <select
                required
                value={form.takim}
                onChange={(e) => degistir("takim", e.target.value)}
                className="w-full bg-[#0d0d0d] border border-[rgba(255,255,255,0.08)] rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#ff3131] transition-colors text-sm"
              >
                <option value="">Takım Seçin...</option>
                {takimlar.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Mevki */}
            <div>
              <label className="text-gray-400 text-xs font-bold uppercase tracking-wider block mb-2">
                Mevki *
              </label>
              <select
                required
                value={form.mevki}
                onChange={(e) => degistir("mevki", e.target.value)}
                className="w-full bg-[#0d0d0d] border border-[rgba(255,255,255,0.08)] rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#ff3131] transition-colors text-sm"
              >
                <option value="">Mevki Seçin...</option>
                {mevkiler.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            {/* Forma No */}
            <div>
              <label className="text-gray-400 text-xs font-bold uppercase tracking-wider block mb-2">
                Forma Numarası
              </label>
              <input
                type="number"
                min={1}
                max={99}
                placeholder="1 - 99"
                value={form.forma_no}
                onChange={(e) => degistir("forma_no", e.target.value)}
                className="w-full bg-[#0d0d0d] border border-[rgba(255,255,255,0.08)] rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#ff3131] transition-colors text-sm"
              />
            </div>

            {/* Açıklama */}
            <div>
              <label className="text-gray-400 text-xs font-bold uppercase tracking-wider block mb-2">
                Kendini Tanıt
              </label>
              <textarea
                rows={4}
                placeholder="Kendin hakkında kısa bir bilgi yaz..."
                value={form.aciklama}
                onChange={(e) => degistir("aciklama", e.target.value)}
                className="w-full bg-[#0d0d0d] border border-[rgba(255,255,255,0.08)] rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#ff3131] transition-colors text-sm resize-none"
              />
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
          </form>
        </div>
      </div>
    </div>
  );
}