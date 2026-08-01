"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function KayitPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    ad_soyad: "",
    telefon: "",
    email: "",
    sifre: "",
    sifreTekrar: "",
  });
  const [loading, setLoading] = useState(false);
  const [hata, setHata] = useState("");

  function degistir(alan: string, deger: string) {
    setForm({ ...form, [alan]: deger });
  }

  async function kayitOl(e: React.FormEvent) {
    e.preventDefault();
    setHata("");

    // Validasyon
    if (form.ad_soyad.trim().length < 3) {
      setHata("Ad soyad en az 3 karakter olmalıdır.");
      return;
    }

    const telefonTemiz = form.telefon.replace(/\s/g, "");
    if (!/^(05|5)\d{9}$/.test(telefonTemiz)) {
      setHata("Geçerli bir telefon numarası girin. (05XXXXXXXXX)");
      return;
    }

    if (form.sifre.length < 6) {
      setHata("Şifre en az 6 karakter olmalıdır.");
      return;
    }

    if (form.sifre !== form.sifreTekrar) {
      setHata("Şifreler eşleşmiyor.");
      return;
    }

    setLoading(true);

    // Telefon numarası daha önce kayıtlı mı?
    const { data: varMi } = await supabase
      .from("profiller")
      .select("id")
      .eq("telefon", telefonTemiz)
      .maybeSingle();

    if (varMi) {
      setHata("Bu telefon numarası ile zaten bir hesap açılmış. Lütfen giriş yapın.");
      setLoading(false);
      return;
    }

    // Supabase Auth ile kayıt
    const { data, error } = await supabase.auth.signUp({
      email: form.email.trim(),
      password: form.sifre,
      options: {
        data: {
          ad_soyad: form.ad_soyad.trim(),
          telefon: telefonTemiz,
        },
      },
    });

    if (error) {
      if (error.message.includes("already registered") || error.message.includes("already been registered")) {
        setHata("Bu e-posta adresi zaten kayıtlı. Lütfen giriş yapın.");
      } else {
        setHata(error.message);
      }
      setLoading(false);
      return;
    }

    // Profil tablosuna ekle
    if (data.user) {
      await supabase.from("profiller").insert({
        id: data.user.id,
        ad_soyad: form.ad_soyad.trim(),
        telefon: telefonTemiz,
        email: form.email.trim(),
      });
    }

    // Başarılı - direkt giriş yapılmış olur (email confirm kapalıysa)
    router.refresh();
    router.push("/");
  }

  return (
    <div className="min-h-screen bg-[#070707] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="relative w-20 h-20 mb-4">
            <Image
              src="/icons/logo.png"
              alt="KLAS LİG"
              fill
              className="object-contain drop-shadow-[0_0_15px_rgba(255,49,49,0.5)]"
            />
          </div>
          <h1 className="text-3xl font-black text-white tracking-widest">KLAS LİG</h1>
          <span className="text-[#ff3131] font-black text-xs tracking-[0.4em] mt-1">BURSA</span>
        </div>

        {/* Kart */}
        <div className="bg-[#111] border border-[rgba(255,255,255,0.07)] rounded-3xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
          <h2 className="text-white text-2xl font-black mb-1">Kayıt Ol</h2>
          <p className="text-gray-500 text-sm mb-8">
            Her kişi yalnızca 1 hesap açabilir.
          </p>

          {hata && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm font-medium mb-6">
              ⚠️ {hata}
            </div>
          )}

          <form onSubmit={kayitOl} className="space-y-4">
            <div>
              <label className="text-gray-400 text-xs font-bold uppercase tracking-wider block mb-2">
                Ad Soyad
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

            <div>
              <label className="text-gray-400 text-xs font-bold uppercase tracking-wider block mb-2">
                Telefon Numarası
              </label>
              <input
                type="tel"
                required
                placeholder="05XXXXXXXXX"
                value={form.telefon}
                onChange={(e) => degistir("telefon", e.target.value)}
                className="w-full bg-[#0d0d0d] border border-[rgba(255,255,255,0.08)] rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#ff3131] transition-colors text-sm"
              />
              <p className="text-gray-600 text-[11px] mt-1.5">
                Şifrenizi unutursanız telefon numaranız ile sıfırlayabilirsiniz.
              </p>
            </div>



            <div>
              <label className="text-gray-400 text-xs font-bold uppercase tracking-wider block mb-2">
                E-posta
              </label>
              <input
                type="email"
                required
                placeholder="ornek@mail.com"
                value={form.email}
                onChange={(e) => degistir("email", e.target.value)}
                className="w-full bg-[#0d0d0d] border border-[rgba(255,255,255,0.08)] rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#ff3131] transition-colors text-sm"
              />
            </div>

            <div>
              <label className="text-gray-400 text-xs font-bold uppercase tracking-wider block mb-2">
                Şifre
              </label>
              <input
                type="password"
                required
                placeholder="En az 6 karakter"
                value={form.sifre}
                onChange={(e) => degistir("sifre", e.target.value)}
                className="w-full bg-[#0d0d0d] border border-[rgba(255,255,255,0.08)] rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#ff3131] transition-colors text-sm"
              />
            </div>

            <div>
              <label className="text-gray-400 text-xs font-bold uppercase tracking-wider block mb-2">
                Şifre Tekrar
              </label>
              <input
                type="password"
                required
                placeholder="Şifrenizi tekrar girin"
                value={form.sifreTekrar}
                onChange={(e) => degistir("sifreTekrar", e.target.value)}
                className="w-full bg-[#0d0d0d] border border-[rgba(255,255,255,0.08)] rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#ff3131] transition-colors text-sm"
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
                  Kayıt yapılıyor...
                </span>
              ) : "KAYIT OL →"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[rgba(255,255,255,0.06)] text-center">
            <p className="text-gray-500 text-sm">
              Zaten hesabın var mı?{" "}
              <Link href="/giris" className="text-[#ff3131] font-bold hover:text-red-400 transition-colors">
                Giriş Yap
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
