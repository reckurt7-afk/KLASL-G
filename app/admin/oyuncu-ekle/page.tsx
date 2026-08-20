"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const TAKIMLAR = [
  "PS 5",
  "DİNAMO NALBANTOĞLU",
  "KROKODİLLA FC",
  "NOVA FC",
  "YEŞİL BURSA FC",
  "YEDİYOL BLACK FC",
  "GRAVYER FC",
  "BİSKREM FC",
];

const MEVKILER = ["KL", "DEF", "OS", "FOR"];

export default function OyuncuEklePage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    ad_soyad: "",
    takim: TAKIMLAR[0],
    mevki: MEVKILER[2], // Default OS
    forma_no: "",
    genel_puan: 85,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    if (!formData.ad_soyad.trim()) {
      setError("Lütfen oyuncu adını girin.");
      setLoading(false);
      return;
    }

    try {
      const { data, error: supaError } = await supabase.from("oyuncular").insert([
        {
          ad_soyad: formData.ad_soyad.trim(),
          takim: formData.takim,
          mevki: formData.mevki,
          forma_no: formData.forma_no ? parseInt(formData.forma_no.toString()) : null,
          genel_puan: formData.genel_puan ? parseInt(formData.genel_puan.toString()) : 85,
          aktif: true, // Varsayılan olarak aktif yap
        },
      ]);

      if (supaError) throw supaError;

      setMessage(`✅ ${formData.ad_soyad}, ${formData.takim} takımına başarıyla eklendi!`);
      
      // Formu sıfırla ama takımı aynı bırak (peş peşe ekleme kolaylığı için)
      setFormData((prev) => ({
        ...prev,
        ad_soyad: "",
        forma_no: "",
      }));
    } catch (err: any) {
      console.error(err);
      setError("Oyuncu eklenirken bir hata oluştu: " + err.message);
    } finally {
      setLoading(false);
      
      // 5 saniye sonra mesajı gizle
      setTimeout(() => setMessage(""), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-2xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 border-b border-white/10 pb-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-black text-[#00ff66] flex items-center gap-3">
              ➕ TAKIMA OYUNCU EKLE
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Veritabanına manuel olarak yeni bir oyuncu kaydedin.
            </p>
          </div>

          <Link
            href="/admin"
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-sm transition-all shrink-0"
          >
            ← Admin Paneline Dön
          </Link>
        </div>

        {/* STATUS MESSAGES */}
        {message && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 font-bold text-center animate-pulse">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/50 text-red-400 font-bold text-center">
            {error}
          </div>
        )}

        {/* FORM */}
        <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            {/* TAKIM SEÇİMİ */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                1. OYUNCUNUN TAKIMI
              </label>
              <select
                name="takim"
                value={formData.takim}
                onChange={handleChange}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white font-bold focus:border-[#00ff66] focus:outline-none transition-colors appearance-none cursor-pointer"
              >
                {TAKIMLAR.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* AD SOYAD */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                2. OYUNCU ADI SOYADI
              </label>
              <input
                type="text"
                name="ad_soyad"
                value={formData.ad_soyad}
                onChange={handleChange}
                placeholder="Örn: Ahmet Yılmaz"
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white font-bold focus:border-[#00ff66] focus:outline-none transition-colors"
                autoComplete="off"
              />
            </div>

            {/* MEVKİ & FORMA NO (Yan Yana) */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                  3. MEVKİ
                </label>
                <select
                  name="mevki"
                  value={formData.mevki}
                  onChange={handleChange}
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white font-bold focus:border-[#00ff66] focus:outline-none transition-colors appearance-none cursor-pointer"
                >
                  {MEVKILER.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                  4. FORMA NO (İsteğe Bağlı)
                </label>
                <input
                  type="number"
                  name="forma_no"
                  value={formData.forma_no}
                  onChange={handleChange}
                  placeholder="Örn: 10"
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white font-bold focus:border-[#00ff66] focus:outline-none transition-colors"
                  min="1"
                  max="99"
                />
              </div>
            </div>

            {/* GENEL PUAN */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                5. GENEL PUAN (RATING)
              </label>
              <input
                type="number"
                name="genel_puan"
                value={formData.genel_puan}
                onChange={handleChange}
                placeholder="Örn: 85"
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white font-bold focus:border-[#00ff66] focus:outline-none transition-colors"
                min="1"
                max="99"
              />
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full py-4 bg-gradient-to-r from-[#00ff66] to-[#00cc52] hover:from-[#00cc52] hover:to-[#00ff66] text-black font-black rounded-xl text-lg transition-all shadow-[0_0_20px_rgba(0,255,102,0.3)] hover:shadow-[0_0_30px_rgba(0,255,102,0.5)] disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Kaydediliyor..." : "💾 OYUNCUYU KAYDET"}
            </button>
            
          </form>
        </div>
      </div>
    </div>
  );
}
