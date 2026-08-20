"use client";

import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans overflow-x-hidden">
      {/* HEADER */}
      <header className="fixed top-0 w-full z-50 bg-white border-b border-gray-100 shadow-sm h-[72px]">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/icons/logo.png" width={48} height={48} alt="Klas Lig Logo" className="object-contain" />
            <span className="font-black text-xl tracking-tight text-[#1a1a1a]">KLAS LİG</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-[#e60000] font-bold text-sm cursor-pointer mr-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
              </svg>
              Klas Lig TV
            </div>
            <div className="flex gap-2">
              <Link href="/giris" className="bg-[#e60000] hover:bg-[#cc0000] text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded transition-colors flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                Giriş Yap
              </Link>
              <Link href="/kayit" className="bg-[#e60000] hover:bg-[#cc0000] text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded transition-colors flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
                Üye Ol
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative w-full min-h-screen flex flex-col items-center justify-center pt-[72px] bg-[#0a0f1c]">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1518605368461-1e12dce38a42?auto=format&fit=crop&q=80')] bg-cover bg-center"></div>
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0a0f1c]/50 to-[#0a0f1c]"></div>

        <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto px-4 w-full">
          
          {/* Top Badge */}
          <div className="border border-white/20 bg-black/40 rounded-full px-4 py-1.5 flex items-center gap-2 mb-8">
            <span className="text-[#e60000] text-xs">⚽</span>
            <span className="text-white text-[11px] font-bold tracking-widest uppercase">TÜRKİYE'NİN #1 HALI SAHA PLATFORMU</span>
            <span className="text-[#e60000] text-xs">⚽</span>
          </div>

          {/* Center Logo */}
          <div className="w-[200px] h-[200px] bg-white rounded-full flex items-center justify-center p-6 shadow-[0_0_50px_rgba(255,255,255,0.1)] mb-8">
            <Image src="/icons/logo.png" width={160} height={160} alt="Klas Lig" className="object-contain" />
          </div>

          {/* Title */}
          <h1 className="text-[22px] md:text-[28px] text-white font-medium mb-10 max-w-2xl leading-snug">
            Halı saha futbolunun <span className="font-black text-[#e60000]">en kapsamlı platformu</span> ile sahaya çık!
          </h1>

          {/* App Stores */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <button className="bg-[#0a0a0a] hover:bg-[#1a1a1a] text-white border border-white/20 rounded-xl px-5 py-2.5 flex items-center gap-3 min-w-[160px] transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91 1.65.17 2.79 1.12 3.45 2.11-2.96 1.76-2.48 5.86.36 7.03-.68 1.63-1.51 3.23-2.54 4.54l-.48.98zM12.03 7.25C11.96 3.73 15.35 1 15.42 1c-.11 4.29-4.14 6.77-3.39 6.25z"/></svg>
              <div className="text-left flex flex-col justify-center">
                <span className="text-[9px] text-gray-400 font-medium leading-tight">Apple</span>
                <span className="font-bold text-[13px] leading-tight">App Store</span>
              </div>
            </button>
            <button className="bg-[#0a0a0a] hover:bg-[#1a1a1a] text-white border border-white/20 rounded-xl px-5 py-2.5 flex items-center gap-3 min-w-[160px] transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M3.208 20.672L16.27 13.12 3.208 5.57l-.022 15.102z"/><path d="M17.15 12.612L20.638 10.6 18.06 9.11l-1.928 1.112z"/><path d="M3.315 20.612l13.835-7.99 1.93-1.114-2.616-1.51-13.15 7.59z"/><path d="M3.315 5.568l13.15-7.59 2.616-1.51-1.93-1.114-13.835 7.99z"/></svg>
              <div className="text-left flex flex-col justify-center">
                <span className="text-[9px] text-gray-400 font-medium leading-tight">Android</span>
                <span className="font-bold text-[13px] leading-tight">Google Play</span>
              </div>
            </button>
          </div>

          {/* Stats Badges */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="border border-[#e60000]/30 bg-black/50 backdrop-blur-md rounded-[20px] px-4 py-2 flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e60000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              <span className="text-white font-bold text-[13px]">40 Şehir</span>
            </div>
            <div className="border border-[#e60000]/30 bg-black/50 backdrop-blur-md rounded-[20px] px-4 py-2 flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e60000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              <span className="text-white font-bold text-[13px]">16.364+ Oyuncu</span>
            </div>
            <div className="border border-[#e60000]/30 bg-black/50 backdrop-blur-md rounded-[20px] px-4 py-2 flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e60000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 21h8"></path><path d="M12 17v4"></path><path d="M7 4h10l1 13H6L7 4z"></path></svg>
              <span className="text-white font-bold text-[13px]">1.395+ Takım</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
            <Link href="/lig" className="w-[140px] bg-[#e60000] hover:bg-[#cc0000] text-white font-bold text-center py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm shadow-[0_4px_14px_0_rgba(230,0,0,0.39)]">
              Keşfet <span className="text-xs">⌄</span>
            </Link>
            <Link href="/lig" className="w-[140px] bg-transparent border border-white/30 hover:bg-white/10 text-white font-bold text-center py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm">
              Misafir Girişi <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </Link>
            <Link href="/giris" className="w-[140px] bg-transparent text-white font-bold text-center py-2.5 rounded-lg hover:bg-white/5 transition-colors flex items-center justify-center gap-2 text-sm">
              Giriş Yap <span className="text-xs">{'>'}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* MİSYONUMUZ */}
      <section className="py-24 px-4 bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-black text-gray-900 mb-6">Misyonumuz</h2>
          <p className="text-gray-600 leading-relaxed text-sm md:text-base text-justify sm:text-center max-w-3xl mx-auto">
            KLAS LİG, amatör futbol ruhunu profesyonel bir altyapıyla birleştiren dev bir spor organizasyonudur. 
            Ülkemizde büyük bir takipçi kitlesi bulunan KLAS LİG, Türkiye'nin en iyi halısaha futbolcularını bir araya getirir. 
            Bu ligde mücadele eden oyuncular, aynı zamanda Halısaha Milli Takımı aday oyuncuları arasında yer alma şansı yakalar. 
            Yani, KLAS LİG oyuncuları, ülkemizi uluslararası arenada temsil etme şansını yakalamak için mücadele eden 
            yetenekli ve deneyimli sporcuları içermektedir. KLAS LİG, bu oyuncuları destekleyerek Türk halısaha futbolunu 
            uluslararası alanda başarıyla temsil etme hedefini taşır.
          </p>
        </div>
      </section>

      {/* TÜRKİYE GENELİ */}
      <section className="py-24 px-4 bg-[#f8f9fa]">
        <div className="max-w-6xl mx-auto text-center">
          <span className="text-[#e60000] font-bold tracking-widest text-[11px] uppercase mb-3 block">Türkiye Geneli</span>
          <h2 className="text-3xl font-black text-gray-900 mb-2">Türkiye Geneli Ağ</h2>
          <p className="text-gray-500 mb-10 text-sm">40 ilde aktif lig organizasyonları</p>
          
          <div className="relative w-full max-w-4xl mx-auto aspect-[16/9] bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm flex items-center justify-center flex-col">
            <span className="text-5xl mb-4 opacity-50">🗺️</span>
            <h3 className="text-lg font-bold text-gray-800">Türkiye Futbol Haritası</h3>
            <p className="text-gray-500 text-xs mt-1">İnteraktif Türkiye futbol haritası — 40 şehirde aktif</p>
          </div>
        </div>
      </section>

      {/* AVANTAJLAR */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#e60000] font-bold tracking-widest text-[11px] uppercase mb-3 block">Klas Lig Avantajları</span>
            <h2 className="text-3xl font-black text-gray-900 mb-2">Profesyonel futbol deneyimi</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#f8f9fa] p-8 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow text-center flex flex-col items-center group">
              <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-2xl mb-6 shadow-sm group-hover:scale-110 transition-transform">🏟️</div>
              <h3 className="font-bold text-[15px] text-gray-900 mb-3">SON TEKNOLOJİ HALI SAHALAR</h3>
              <p className="text-gray-500 text-sm leading-relaxed">En üst düzey futbol deneyimini sunmak için tasarlanmış en kaliteli sahalarda oynamanın keyfini çıkarın.</p>
            </div>
            <div className="bg-[#f8f9fa] p-8 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow text-center flex flex-col items-center group">
              <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-2xl mb-6 shadow-sm group-hover:scale-110 transition-transform">⚖️</div>
              <h3 className="font-bold text-[15px] text-gray-900 mb-3">PROFESYONEL HAKEMLER</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Maçlarımız, fair play ve kurallara uyulmasını sağlayan sertifikalı hakemler tarafından yönetilmektedir.</p>
            </div>
            <div className="bg-[#f8f9fa] p-8 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow text-center flex flex-col items-center group">
              <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-2xl mb-6 shadow-sm group-hover:scale-110 transition-transform">📺</div>
              <h3 className="font-bold text-[15px] text-gray-900 mb-3">CANLI MAÇ YAYINI</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Tüm lig maçlarının canlı yayını ve özet görüntüleri ile aksiyonun hiçbir anını kaçırmayacaksınız.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 bg-[#0a0f1c] text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="max-w-2xl mx-auto relative z-10">
          <h2 className="text-3xl font-black text-white mb-4">Hemen Başla!</h2>
          <p className="text-gray-400 text-sm mb-8">
            Halı saha futbolunun en heyecanlı platformuna katıl! Ligini takip et, istatistikleri keşfet, topluluğa dahil ol.
          </p>
          <Link href="/kayit" className="inline-block bg-[#e60000] hover:bg-[#cc0000] text-white font-bold text-sm px-10 py-3.5 rounded-lg shadow-lg transition-transform hover:scale-105">
            Şimdi Giriş Yap
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black py-12 px-4 text-center">
        <div className="flex flex-wrap justify-center gap-6 mb-6 text-xs font-bold text-gray-400">
          <a href="#" className="hover:text-white transition-colors">İletişim</a>
          <span>•</span>
          <a href="#" className="hover:text-white transition-colors">Lig Kuralları</a>
          <span>•</span>
          <a href="#" className="hover:text-white transition-colors">Gizlilik Politikası</a>
        </div>
        
        <div className="text-gray-600 text-[11px] mb-3">
          © 2026 KLAS LİG. Tüm Hakları Saklıdır
        </div>
        
        <div className="text-gray-700 text-[10px]">
          Bu site <a href="https://www.agx-labs.com/" className="text-[#e60000] hover:text-[#cc0000]">AGX Labs</a> tarafından geliştirilmiştir
        </div>
      </footer>
    </div>
  );
}
