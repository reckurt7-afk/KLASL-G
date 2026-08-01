"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function GirisPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [sifre, setSifre] = useState("");
  const [loading, setLoading] = useState(false);
  const [hata, setHata] = useState("");

  async function girisYap(e: React.FormEvent) {
    e.preventDefault();
    setHata("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: sifre,
    });

    if (error) {
      if (
        error.message.includes("Invalid login credentials") ||
        error.message.includes("invalid_credentials")
      ) {
        setHata("E-posta veya şifre hatalı. Lütfen tekrar deneyin.");
      } else if (error.message.includes("Email not confirmed")) {
        // E-posta doğrulama açıksa bunu göster
        setHata(
          "E-posta adresin henüz doğrulanmamış. Supabase panelinden 'Confirm email' seçeneğini kapatın veya e-postanı kontrol edin."
        );
      } else if (error.message.includes("Too many requests")) {
        setHata("Çok fazla deneme yapıldı. Lütfen birkaç dakika bekleyin.");
      } else {
        setHata("Giriş yapılamadı: " + error.message);
      }
      setLoading(false);
      return;
    }

    router.refresh();
    router.push("/");
  }

  return (
    <div className="min-h-screen bg-[#070707] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="relative w-20 h-20 mb-4">
            <Image src="/icons/logo.png" alt="KLAS LİG" fill className="object-contain drop-shadow-[0_0_15px_rgba(255,49,49,0.5)]" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-widest">KLAS LİG</h1>
          <span className="text-[#ff3131] font-black text-xs tracking-[0.4em] mt-1">BURSA</span>
        </div>

        {/* Kart */}
        <div className="bg-[#111] border border-[rgba(255,255,255,0.07)] rounded-3xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
          <h2 className="text-white text-2xl font-black mb-1">Giriş Yap</h2>
          <p className="text-gray-500 text-sm mb-8">Hesabınla giriş yaparak devam et.</p>

          {hata && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm font-medium mb-6">
              ⚠️ {hata}
            </div>
          )}

          <form onSubmit={girisYap} className="space-y-4">
            <div>
              <label className="text-gray-400 text-xs font-bold uppercase tracking-wider block mb-2">
                E-posta
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                placeholder="ornek@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                autoComplete="current-password"
                placeholder="••••••••"
                value={sifre}
                onChange={(e) => setSifre(e.target.value)}
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
                  Giriş yapılıyor...
                </span>
              ) : "GİRİŞ YAP →"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[rgba(255,255,255,0.06)] text-center">
            <p className="text-gray-500 text-sm">
              Hesabın yok mu?{" "}
              <Link href="/kayit" className="text-[#ff3131] font-bold hover:text-red-400 transition-colors">
                Kayıt Ol
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
