"use client";

import Link from "next/link";
import Image from "next/image";

const bolumler = [
  {
    baslik: "Lig",
    linkler: [
      { href: "/puan-durumu", label: "🏆 Puan Durumu" },
      { href: "/fikstur", label: "📅 Fikstür" },
      { href: "/mac-saatleri", label: "⏰ Maç Saatleri" },
      { href: "/esame-listesi", label: "📋 Esame Listesi" },
    ],
  },
  {
    baslik: "Takımlar & İçerik",
    linkler: [
      { href: "/takimlar", label: "🛡️ Takımlar" },
      { href: "/galeri", label: "📸 Fotoğraf Galerisi" },
      { href: "/video-arsivi", label: "🎬 Video Arşivi" },
      { href: "/canli-yayin", label: "🔴 Canlı Yayın" },
    ],
  },
  {
    baslik: "Üyelik",
    linkler: [
      { href: "/duyurular", label: "📢 Duyurular" },
      { href: "/oyuncu-basvurusu", label: "👤 Oyuncu Başvurusu" },
      { href: "/giris", label: "🔑 Giriş Yap" },
      { href: "/kayit", label: "📝 Kayıt Ol" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#070707] border-t border-[rgba(255,49,49,0.15)] pb-24 lg:pb-0">
      <div className="max-w-[1200px] mx-auto px-5 pt-12 pb-8">

        {/* Üst Bölüm */}
        <div className="flex flex-wrap gap-10 mb-10 justify-between">

          {/* Logo & Açıklama */}
          <div className="flex-1 min-w-[200px] max-w-[260px]">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[rgba(255,49,49,0.3)]">
                <Image src="/icons/logo.png" alt="Klas Lig" fill className="object-cover" />
              </div>
              <div>
                <div className="text-white font-black text-lg tracking-widest leading-none">KLAS LİG</div>
                <div className="text-[#ff3131] text-[10px] font-black tracking-[0.3em]">BURSA</div>
              </div>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-5">
              Bursa'nın en prestijli amatör futbol ligi. Puan durumu, fikstür ve canlı maç takibi.
            </p>
            <a
              href="https://wa.me/905010120016"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-[#1ea855] transition-colors shadow-[0_4px_12px_rgba(37,211,102,0.3)]"
            >
              📞 Reklam: 0501 012 0016
            </a>
          </div>

          {/* Linkler */}
          {bolumler.map((b) => (
            <div key={b.baslik} className="flex-1 min-w-[140px]">
              <div className="text-[#ff3131] font-black text-xs tracking-[0.2em] uppercase mb-4">
                {b.baslik}
              </div>
              <div className="flex flex-col gap-3">
                {b.linkler.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="text-gray-500 text-sm font-medium hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Alt Bölüm */}
        <div className="border-t border-[rgba(255,255,255,0.06)] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-gray-600 text-xs">
            © {new Date().getFullYear()} Klas Lig Bursa. Tüm hakları saklıdır.
          </div>
          <div className="text-gray-700 text-xs">
            ⚽ 3. Sezon
          </div>
        </div>
      </div>
    </footer>
  );
}
