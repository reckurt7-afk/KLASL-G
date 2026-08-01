"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profil, loading, cikisYap } = useAuth();

  // Giriş/Kayıt sayfalarında Navbar'ı gösterme
  const gizliSayfalar = ["/giris", "/kayit"];
  if (gizliSayfalar.includes(pathname)) return null;

  const links = [
    { href: "/", label: "🏠 Ana Sayfa" },
    { href: "/canli-yayin", label: "🔴 Canlı Yayın" },
    { href: "/puan-durumu", label: "🏆 Puan Durumu" },
    { href: "/fikstur", label: "📅 Fikstür" },
    { href: "/esame-listesi", label: "📋 Esame Listesi" },
    { href: "/takimlar", label: "🛡️ Takımlar" },
    { href: "/galeri", label: "📸 Galeri" },
    { href: "/video-arsivi", label: "🎬 Videolar" },
    { href: "/duyurular", label: "📢 Duyurular" },
    { href: "/mac-saatleri", label: "⏰ Saatler" },
  ];

  const initials = profil?.ad_soyad
    ? profil.ad_soyad.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[9999] bg-[#070707]/80 backdrop-blur-xl border-b border-[#ff3131]/20 shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
        <div className="max-w-[1600px] mx-auto px-4">
          <div className="flex items-center justify-between h-[75px]">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-[50px] h-[50px] rounded-full overflow-hidden border-2 border-transparent group-hover:border-[#ff3131] transition-all duration-300 shadow-[0_0_15px_rgba(255,49,49,0)] group-hover:shadow-[0_0_15px_rgba(255,49,49,0.5)]">
                <Image src="/icons/logo.png" alt="Logo" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-white tracking-widest leading-none group-hover:text-[#ff3131] transition-colors duration-300">KLAS LİG</span>
                <span className="text-[10px] text-[#ff3131] font-bold tracking-[0.3em]">BURSA</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-2 rounded-xl text-[13px] font-bold transition-all duration-300 flex items-center gap-1.5
                      ${isActive
                        ? "bg-gradient-to-r from-[#ff3131] to-[#a11212] text-white shadow-[0_4px_15px_rgba(255,49,49,0.4)] -translate-y-[2px]"
                        : "text-gray-300 hover:bg-white/10 hover:text-white hover:-translate-y-[2px]"
                    }`}
                  >
                    <span>{link.label.split(' ')[0]}</span>
                    <span>{link.label.substring(link.label.indexOf(' ') + 1)}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Kullanıcı Alanı */}
            <div className="hidden lg:flex items-center gap-3">
              {loading ? (
                <div className="w-9 h-9 rounded-full bg-white/10 animate-pulse" />
              ) : user ? (
                // Giriş yapılmış
                <div className="flex items-center gap-3">
                  <Link href="/profil" className="flex items-center gap-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#ff3131]/40 rounded-xl px-4 py-2 transition-all duration-200 group">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff3131] to-[#a11212] flex items-center justify-center text-white text-xs font-black shadow-[0_0_10px_rgba(255,49,49,0.3)]">
                      {initials}
                    </div>
                    <span className="text-white text-sm font-bold group-hover:text-[#ff3131] transition-colors">
                      {profil?.ad_soyad?.split(" ")[0] || "Profil"}
                    </span>
                  </Link>
                  <button
                    onClick={cikisYap}
                    className="px-4 py-2 text-sm font-bold text-gray-400 hover:text-red-400 border border-white/10 hover:border-red-500/30 rounded-xl transition-all duration-200"
                  >
                    Çıkış
                  </button>
                </div>
              ) : (
                // Giriş yapılmamış
                <div className="flex items-center gap-2">
                  <Link href="/giris" className="px-4 py-2 text-sm font-bold text-gray-300 hover:text-white border border-white/10 hover:border-white/30 rounded-xl transition-all duration-200">
                    Giriş Yap
                  </Link>
                  <Link href="/kayit" className="px-5 py-2 text-sm font-bold bg-gradient-to-r from-[#ff3131] to-[#a11212] text-white rounded-xl shadow-[0_4px_12px_rgba(255,49,49,0.3)] hover:shadow-[0_4px_20px_rgba(255,49,49,0.5)] hover:-translate-y-0.5 transition-all duration-200">
                    Kayıt Ol
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#070707]/95 backdrop-blur-xl border-t border-[#ff3131]/20 pb-safe z-[9999] shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
        <div className="flex overflow-x-auto gap-1 p-2 hide-scrollbar">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex-shrink-0 flex flex-col items-center justify-center w-[68px] h-[68px] rounded-2xl text-[10px] font-bold transition-all duration-300
                  ${isActive
                    ? "bg-gradient-to-b from-[#ff3131]/20 to-transparent border border-[#ff3131]/50 text-white shadow-[inset_0_4px_10px_rgba(255,49,49,0.2)]"
                    : "text-gray-400 border border-transparent hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className={`text-xl mb-0.5 ${isActive ? 'drop-shadow-[0_2px_5px_rgba(255,49,49,0.8)]' : ''}`}>
                  {link.label.split(' ')[0]}
                </span>
                <span className="truncate w-full text-center px-0.5">
                  {link.label.substring(link.label.indexOf(' ') + 1)}
                </span>
              </Link>
            );
          })}

          {/* Mobilde kullanıcı */}
          {!loading && (
            user ? (
              <Link
                href="/profil"
                className={`flex-shrink-0 flex flex-col items-center justify-center w-[68px] h-[68px] rounded-2xl text-[10px] font-bold transition-all duration-300 ${pathname === "/profil" ? "bg-gradient-to-b from-[#ff3131]/20 to-transparent border border-[#ff3131]/50 text-white" : "text-gray-400 border border-transparent"}`}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff3131] to-[#a11212] flex items-center justify-center text-white text-xs font-black mb-0.5">
                  {initials}
                </div>
                <span>Profil</span>
              </Link>
            ) : (
              <Link
                href="/giris"
                className="flex-shrink-0 flex flex-col items-center justify-center w-[68px] h-[68px] rounded-2xl text-[10px] font-bold text-[#ff3131] border border-[#ff3131]/30 bg-[#ff3131]/10 transition-all duration-300"
              >
                <span className="text-xl mb-0.5">🔑</span>
                <span>Giriş</span>
              </Link>
            )
          )}
        </div>
      </nav>

      {/* Spacer */}
      <div className="h-[75px]" />
    </>
  );
}