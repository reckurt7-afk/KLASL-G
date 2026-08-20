"use client";

import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans overflow-x-hidden selection:bg-red-100">
      
      {/* HEADER */}
      <header className="fixed top-0 w-full z-50 bg-white border-b border-gray-100 h-[76px] flex items-center">
        <div className="w-full max-w-[1400px] mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <Image src="/icons/logo.png" width={48} height={48} alt="Klas Lig Logo" className="object-contain group-hover:scale-105 transition-transform" />
            <span className="font-black text-[22px] tracking-tight text-[#1a1a2e]">KLAS LİG</span>
          </Link>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 text-[#ff2a2a] font-bold text-[13px] cursor-pointer hover:opacity-80 transition-opacity">
              <span className="w-2.5 h-2.5 bg-[#ff2a2a] rounded-full animate-pulse"></span>
              Klas Lig TV
            </div>
            <div className="flex items-center gap-3">
              <Link href="/giris" className="bg-[#ff2a2a] hover:bg-[#e60000] text-white font-bold text-[13px] px-6 py-2.5 rounded-md transition-colors flex items-center gap-2 shadow-sm">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                Giriş Yap
              </Link>
              <Link href="/kayit" className="bg-[#ff2a2a] hover:bg-[#e60000] text-white font-bold text-[13px] px-6 py-2.5 rounded-md transition-colors flex items-center gap-2 shadow-sm">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
                Üye Ol
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative w-full h-screen min-h-[800px] flex flex-col items-center justify-center bg-[#0a192f] mt-[76px]">
        {/* Background Overlay */}
        <div className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1920')] bg-cover bg-center opacity-30 mix-blend-luminosity"></div>
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0a192f]/80 via-[#0a192f]/60 to-[#0a192f]"></div>

        <div className="relative z-10 flex flex-col items-center text-center w-full max-w-[1200px] mx-auto px-4">
          
          {/* Top Badge */}
          <div className="border border-[#ff2a2a]/40 bg-[#0a192f]/60 backdrop-blur-md rounded-full px-5 py-1.5 flex items-center gap-3 mb-10 shadow-lg">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ff2a2a" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            <span className="text-white text-[11px] font-black tracking-[0.2em] uppercase mt-0.5">TÜRKİYE'NİN #1 HALI SAHA PLATFORMU</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ff2a2a" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
          </div>

          {/* Center Logo */}
          <div className="w-[180px] h-[180px] bg-white rounded-full flex items-center justify-center p-5 mb-10 shadow-[0_0_60px_rgba(255,255,255,0.15)]">
            <Image src="/icons/logo.png" width={140} height={140} alt="Klas Lig" className="object-contain" />
          </div>

          {/* Title */}
          <h1 className="text-[26px] md:text-[32px] text-white font-medium mb-10 w-full">
            Halı saha futbolunun <span className="font-black text-[#ff2a2a]">en kapsamlı platformu</span> ile sahaya çık!
          </h1>

          {/* App Stores */}
          <div className="flex flex-row items-center justify-center gap-5 mb-10 w-full">
            <button className="bg-[#111] hover:bg-black text-white border border-white/10 rounded-xl px-5 py-3 flex items-center gap-4 w-[170px] transition-all hover:border-white/30">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91 1.65.17 2.79 1.12 3.45 2.11-2.96 1.76-2.48 5.86.36 7.03-.68 1.63-1.51 3.23-2.54 4.54l-.48.98zM12.03 7.25C11.96 3.73 15.35 1 15.42 1c-.11 4.29-4.14 6.77-3.39 6.25z"/></svg>
              <div className="text-left flex flex-col justify-center">
                <span className="text-[10px] text-gray-400 font-medium leading-tight">Apple</span>
                <span className="font-bold text-[14px] leading-tight">App Store</span>
              </div>
            </button>
            <button className="bg-[#111] hover:bg-black text-white border border-white/10 rounded-xl px-5 py-3 flex items-center gap-4 w-[170px] transition-all hover:border-white/30">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M3.208 20.672L16.27 13.12 3.208 5.57l-.022 15.102z"/><path d="M17.15 12.612L20.638 10.6 18.06 9.11l-1.928 1.112z"/><path d="M3.315 20.612l13.835-7.99 1.93-1.114-2.616-1.51-13.15 7.59z"/><path d="M3.315 5.568l13.15-7.59 2.616-1.51-1.93-1.114-13.835 7.99z"/></svg>
              <div className="text-left flex flex-col justify-center">
                <span className="text-[10px] text-gray-400 font-medium leading-tight">Android</span>
                <span className="font-bold text-[14px] leading-tight">Google Play</span>
              </div>
            </button>
          </div>

          {/* Stats Badges */}
          <div className="flex flex-row items-center justify-center gap-4 mb-12 w-full">
            <div className="border border-[#ff2a2a]/40 bg-[#0a192f]/60 backdrop-blur-md rounded-full px-5 py-2.5 flex items-center gap-2.5">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ff2a2a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              <span className="text-white font-bold text-[14px]">40 Şehir</span>
            </div>
            <div className="border border-[#ff2a2a]/40 bg-[#0a192f]/60 backdrop-blur-md rounded-full px-5 py-2.5 flex items-center gap-2.5">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ff2a2a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              <span className="text-white font-bold text-[14px]">16.364+ Oyuncu</span>
            </div>
            <div className="border border-[#ff2a2a]/40 bg-[#0a192f]/60 backdrop-blur-md rounded-full px-5 py-2.5 flex items-center gap-2.5">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ff2a2a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 21h8"></path><path d="M12 17v4"></path><path d="M7 4h10l1 13H6L7 4z"></path></svg>
              <span className="text-white font-bold text-[14px]">1.395+ Takım</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-row items-center justify-center gap-5 w-full">
            <Link href="/lig" className="bg-[#ff2a2a] hover:bg-[#e60000] text-white font-bold px-8 py-3.5 rounded-lg transition-colors flex items-center gap-2 text-[15px]">
              Keşfet <span className="text-sm font-black">⌄</span>
            </Link>
            <Link href="/lig" className="bg-[#0a192f]/60 border border-white/20 hover:bg-[#0a192f]/80 text-white font-bold px-8 py-3.5 rounded-lg transition-colors flex items-center gap-3 text-[15px] backdrop-blur-sm">
              Misafir Girişi <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </Link>
            <Link href="/giris" className="bg-transparent text-white font-bold px-6 py-3.5 rounded-lg hover:bg-white/5 transition-colors flex items-center gap-2 text-[15px]">
              Giriş Yap <span className="text-sm font-black">{'>'}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* TÜRKİYE GENELİ - MAP SECTION */}
      <section className="py-24 bg-white w-full">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="w-full aspect-[21/9] bg-[#f0f4f8] rounded-2xl flex flex-col items-center justify-center border border-gray-100 shadow-sm relative overflow-hidden mb-16">
             {/* Map Placeholder */}
             <div className="absolute inset-0 opacity-40 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Turkey_location_map.svg/1024px-Turkey_location_map.svg.png')] bg-contain bg-center bg-no-repeat m-8 filter grayscale"></div>
             <div className="relative z-10 flex flex-col items-center">
               <span className="text-6xl mb-4">🗺️</span>
               <h3 className="text-2xl font-black text-[#1a1a2e]">Türkiye Futbol Haritası</h3>
             </div>
          </div>

          <div className="text-center mb-10">
            <h3 className="text-[22px] font-black text-[#1a1a2e] mb-1">Klas Lig Avantajları</h3>
            <p className="text-gray-500 text-sm">Profesyonel futbol deneyiminin en iyisini sunuyoruz</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#f8f9fa] border border-gray-100 rounded-xl p-8 text-center flex flex-col items-center transition-transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl mb-5 shadow-sm text-gray-700">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
              </div>
              <h4 className="font-black text-[13px] text-[#1a1a2e] mb-3 uppercase tracking-wide">SON TEKNOLOJİ HALI SAHALAR</h4>
              <p className="text-gray-500 text-[13px] leading-relaxed">En üst düzey futbol deneyimini sunmak için tasarlanmış en kaliteli sahalarda oynamanın keyfini çıkarın.</p>
            </div>
            
            <div className="bg-[#f8f9fa] border border-gray-100 rounded-xl p-8 text-center flex flex-col items-center transition-transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl mb-5 shadow-sm text-gray-700">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              </div>
              <h4 className="font-black text-[13px] text-[#1a1a2e] mb-3 uppercase tracking-wide">PROFESYONEL HAKEMLER</h4>
              <p className="text-gray-500 text-[13px] leading-relaxed">Maçlarımız, fair play ve kurallara uyulmasını sağlayan sertifikalı hakemler tarafından yönetilmektedir.</p>
            </div>

            <div className="bg-[#ffe5e5] border border-[#ffcccc] rounded-xl p-8 text-center flex flex-col items-center transition-transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-[#ff2a2a] rounded-full flex items-center justify-center text-white mb-5 shadow-sm">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect><polyline points="17 2 12 7 7 2"></polyline></svg>
              </div>
              <h4 className="font-black text-[13px] text-[#1a1a2e] mb-3 uppercase tracking-wide">CANLI MAÇ YAYINI</h4>
              <p className="text-gray-700 text-[13px] leading-relaxed">Tüm lig maçlarının canlı yayını ve özet görüntüleri ile aksiyonun hiçbir anını kaçırmayacaksınız.</p>
            </div>
          </div>
        </div>
      </section>

      {/* RAKAMLARLA BİZ */}
      <section className="py-24 bg-[#fafbfc] w-full">
        <div className="max-w-[1000px] mx-auto px-4 flex flex-col items-center">
          <div className="bg-white border border-gray-200 rounded-full px-5 py-1.5 text-[11px] font-bold text-gray-600 mb-6 flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
            PLATFORM
          </div>
          <h2 className="text-[40px] font-black text-[#1a1a2e] mb-2 tracking-tight">Rakamlarla Biz</h2>
          <p className="text-gray-500 text-[15px] mb-12">Türkiye'nin en kapsamlı halı saha futbol platformu</p>

          <div className="w-full bg-white rounded-2xl shadow-[0_20px_50px_rgba(255,42,42,0.06)] border border-gray-100 p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 divide-y md:divide-y-0 md:divide-x divide-gray-100">
              
              <div className="flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-[#f8f9fa] rounded-2xl flex items-center justify-center mb-6">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1a1a2e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                </div>
                <div className="text-[54px] font-black text-[#ff2a2a] leading-none mb-2">40</div>
                <div className="text-[15px] font-bold text-gray-500">İl</div>
              </div>

              <div className="flex flex-col items-center justify-center text-center pt-10 md:pt-0">
                <div className="w-16 h-16 bg-[#fff0f0] rounded-2xl flex items-center justify-center mb-6">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1a1a2e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                </div>
                <div className="text-[54px] font-black text-[#ff2a2a] leading-none mb-2">1.395</div>
                <div className="text-[15px] font-bold text-gray-500">Takım</div>
              </div>

              <div className="flex flex-col items-center justify-center text-center pt-10 md:pt-0">
                <div className="w-16 h-16 bg-[#f8f9fa] rounded-2xl flex items-center justify-center mb-6">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1a1a2e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                </div>
                <div className="text-[54px] font-black text-[#ff4d4f] leading-none mb-2 opacity-80">16.364</div>
                <div className="text-[15px] font-bold text-gray-500">Oyuncu</div>
              </div>

            </div>
            
            <div className="w-full text-center mt-12 pt-6 border-t border-gray-100">
              <span className="text-[13px] font-bold text-[#1a1a2e]">Türkiye'nin en kapsamlı halı saha futbol platformu</span>
            </div>
          </div>
        </div>
      </section>

      {/* ÖZELLİKLER - NELER SUNUYORUZ */}
      <section className="py-24 bg-white w-full">
        <div className="max-w-[1200px] mx-auto px-4 flex flex-col items-center">
          <div className="bg-white border border-gray-200 rounded-full px-5 py-1.5 text-[11px] font-bold text-gray-600 mb-6 flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            ÖZELLİKLER
          </div>
          <h2 className="text-[40px] font-black text-[#1a1a2e] mb-2 tracking-tight">Neler Sunuyoruz?</h2>
          <p className="text-gray-500 text-[15px] mb-12">Halı saha futbolunda ihtiyacınız olan her şey</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {/* Box 1 */}
            <div className="bg-[#eef8f2] rounded-2xl p-8 flex flex-col transition-transform hover:-translate-y-1">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff2a2a" strokeWidth="2"><path d="M8 21h8"></path><path d="M12 17v4"></path><path d="M7 4h10l1 13H6L7 4z"></path></svg>
              </div>
              <h3 className="text-[19px] font-black text-[#1a1a2e] mb-3">Lig Takibi</h3>
              <p className="text-gray-600 text-[13px] leading-relaxed">40 şehirde aktif ligleri takip et, puan durumunu incele</p>
            </div>
            
            {/* Box 2 */}
            <div className="bg-[#fef4ed] rounded-2xl p-8 flex flex-col transition-transform hover:-translate-y-1">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff2a2a" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
              <h3 className="text-[19px] font-black text-[#1a1a2e] mb-3">Takım Profilleri</h3>
              <p className="text-gray-600 text-[13px] leading-relaxed">Takımları keşfet, istatistiklerini incele, kadroları gör</p>
            </div>

            {/* Box 3 */}
            <div className="bg-[#fdeaea] rounded-2xl p-8 flex flex-col transition-transform hover:-translate-y-1">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff2a2a" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4"></circle></svg>
              </div>
              <h3 className="text-[19px] font-black text-[#1a1a2e] mb-3">Maç Sonuçları</h3>
              <p className="text-gray-600 text-[13px] leading-relaxed">Canlı skorları takip et, maç detaylarını incele</p>
            </div>

            {/* Box 4 */}
            <div className="bg-[#eef8f2] rounded-2xl p-8 flex flex-col transition-transform hover:-translate-y-1">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              </div>
              <h3 className="text-[19px] font-black text-[#1a1a2e] mb-3">Oyuncu İstatistikleri</h3>
              <p className="text-gray-600 text-[13px] leading-relaxed">En iyi oyuncuları keşfet, performansları karşılaştır</p>
            </div>

            {/* Box 5 */}
            <div className="bg-[#fef4ed] rounded-2xl p-8 flex flex-col transition-transform hover:-translate-y-1">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fb923c" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
              </div>
              <h3 className="text-[19px] font-black text-[#1a1a2e] mb-3">Güncel Haberler</h3>
              <p className="text-gray-600 text-[13px] leading-relaxed">Bölgesel ve ulusal halı saha haberleri</p>
            </div>

            {/* Box 6 */}
            <div className="bg-[#fdeaea] rounded-2xl p-8 flex flex-col transition-transform hover:-translate-y-1">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
              </div>
              <h3 className="text-[19px] font-black text-[#1a1a2e] mb-3">Anlık Bildirimler</h3>
              <p className="text-gray-600 text-[13px] leading-relaxed">Favori takımlarından anlık bildirimler al</p>
            </div>
          </div>
        </div>
      </section>

      {/* HEMEN BAŞLA CTA */}
      <section className="py-24 bg-[#fafbfc] w-full flex justify-center px-4">
        <div className="w-full max-w-[900px] bg-white rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.06)] border border-gray-100 p-16 text-center">
          <h2 className="text-[44px] font-black text-[#1a1a2e] mb-4">Hemen Başla!</h2>
          <p className="text-gray-500 text-[16px] mb-10 max-w-lg mx-auto leading-relaxed">
            Halı saha futbolunun en heyecanlı platformuna katıl! Ligini takip et, istatistikleri keşfet, topluluğa dahil ol.
          </p>
          <Link href="/giris" className="inline-flex items-center gap-3 bg-white text-[#1a1a2e] font-black text-[15px] px-8 py-4 rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.08)] border border-gray-100 hover:-translate-y-1 transition-transform">
            Şimdi Giriş Yap <span className="text-lg">{'>'}</span>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white py-16 px-4 border-t border-gray-100 flex flex-col items-center">
        {/* Socials */}
        <div className="flex items-center gap-4 mb-10">
          <a href="#" className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:text-[#1a1a2e] hover:bg-gray-100 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
          </a>
          <a href="#" className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:text-[#1a1a2e] hover:bg-gray-100 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
          </a>
          <a href="#" className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:text-[#1a1a2e] hover:bg-gray-100 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
          </a>
        </div>

        <div className="flex flex-wrap justify-center gap-8 mb-10 text-[13px] font-bold text-gray-500">
          <a href="#" className="hover:text-[#1a1a2e] transition-colors">İletişim</a>
          <span className="text-gray-300">•</span>
          <a href="#" className="hover:text-[#1a1a2e] transition-colors">Lig Kuralları</a>
          <span className="text-gray-300">•</span>
          <a href="#" className="hover:text-[#1a1a2e] transition-colors">Gizlilik Politikası</a>
        </div>
        
        <div className="text-gray-400 text-[12px] mb-4">
          © 2026 KLAS LİG. Tüm Hakları Saklıdır
          <br/>
          <span className="inline-block mt-2">Halı saha futbolunun Türkiye'deki en büyük platformu</span>
        </div>
        
        <div className="text-gray-400 text-[11px] mt-6 pt-6 border-t border-gray-100 w-full max-w-sm text-center">
          Bu site <a href="https://www.agx-labs.com/" className="text-gray-600 font-bold hover:text-[#ff2a2a]">AGX Labs</a> tarafından geliştirilmiştir
        </div>
      </footer>

    </div>
  );
}
