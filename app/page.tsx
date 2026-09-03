"use client";

import Image from "next/image";
import Link from "next/link";
import InstallButton from "./components/InstallButton";
import { useState, useRef, useEffect } from "react";

export default function LandingPage() {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => { if (videoRef.current) { videoRef.current.defaultMuted = true; } }, []);

  const subscribeUser = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      alert("Tarayıcınız bildirimleri desteklemiyor.");
      return;
    }
    
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        alert('Bildirim izni reddedildi. Ayarlardan izin vermeniz gerekiyor.');
        return;
      }

      const reg = await navigator.serviceWorker.ready;
      
      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";
      const padding = '='.repeat((4 - vapidKey.length % 4) % 4);
      const base64 = (vapidKey + padding).replace(/\-/g, '+').replace(/_/g, '/');
      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);
      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }

      let subscription = await reg.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
      }

      subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: outputArray
      });

      const response = await fetch('/api/subscribe', {
        method: 'POST',
        body: JSON.stringify(subscription),
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        // Show immediate welcome notification
        await reg.showNotification("PRO LİG", {
          body: "Bildirimler başarıyla açıldı! Maç sonuçları ve haberler anında cebinizde.",
          icon: "/icons/prolig-logo-final.jpg",
          vibrate: [200, 100, 200]
        } as any);
        // alert("Bildirimler başarıyla açıldı! Maç sonuçları ve haberler anında cebinizde.");
      } else {
        alert("Abonelik kaydedilemedi.");
      }
    } catch (error: any) {
      console.error(error);
      alert("Bir hata oluştu: " + (error.message || error));
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#1a1a2e] font-sans overflow-x-hidden selection:bg-red-100">
      
      {/* HEADER */}
      <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 h-[70px] md:h-[76px] flex items-center shadow-sm">
        <div className="w-full max-w-[1400px] mx-auto px-5 md:px-8 flex items-center justify-end relative h-full">
          

          {/* Orta Kısım - Logo (Tam Merkeze Sabitlendi) */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex items-center shrink-0 z-10 -ml-2 md:-ml-4">
            
            <span className="font-black text-[20px] md:text-[22px] tracking-tight text-[#1a1a2e]">PRO <span className="text-[#e60000]">LİG</span></span>
          </Link>

          {/* Sağ Kısım - Butonlar */}
          <div className="flex items-center justify-end gap-2 md:gap-6 w-full md:w-auto relative z-20">
            <Link href="/canli-yayin" className="hidden lg:flex items-center gap-2 text-[#e60000] font-bold text-[13px] cursor-pointer hover:opacity-80 transition-opacity">
              <span className="w-2.5 h-2.5 bg-[#e60000] rounded-full animate-pulse"></span>
              Pro Lig TV
            </Link>
            <div className="flex items-center gap-2 md:gap-3">
              <Link href="/giris" className="group relative overflow-hidden bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900 font-black text-[12px] md:text-[15px] px-3 py-2 md:px-6 md:py-3 rounded-lg md:rounded-xl transition-all duration-300 flex items-center gap-1.5 md:gap-2 shadow-sm whitespace-nowrap">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="hidden sm:block group-hover:-translate-x-1 transition-transform"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
                GİRİŞ YAP
              </Link>
              <Link href="/kayit" className="group relative overflow-hidden bg-gradient-to-r from-[#e60000] to-[#ff3333] hover:from-[#cc0000] hover:to-[#e60000] text-white font-black text-[12px] md:text-[15px] px-3 py-2 md:px-6 md:py-3 rounded-lg md:rounded-xl transition-all duration-300 flex items-center gap-1.5 md:gap-2 shadow-[0_4px_12px_rgba(230,0,0,0.3)] hover:shadow-[0_6px_16px_rgba(230,0,0,0.4)] hover:-translate-y-0.5 whitespace-nowrap">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="hidden sm:block group-hover:scale-110 transition-transform"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
                ÜYE OL
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative w-full min-h-screen flex flex-col items-center justify-center bg-black pt-[90px] pb-16 overflow-hidden">
        {/* Background MP4 Video */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-black">
          <video 
            ref={videoRef}
            autoPlay 
            loop 
            muted={isMuted}
            playsInline
            preload="auto"
            onEnded={(e) => {
              e.currentTarget.currentTime = 0;
              e.currentTarget.play().catch(() => {});
            }}
            className="absolute top-1/2 left-1/2 w-full h-full object-cover -translate-x-1/2 -translate-y-1/2 opacity-80"
          >
            <source src="/hero-bg-classic.mp4" type="video/mp4" />
          </video>
        </div>
        
        {/* Mute Toggle Button */}
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className="absolute bottom-10 right-10 z-[100] bg-black/60 hover:bg-black/80 text-white p-3.5 rounded-full backdrop-blur-md transition-all shadow-[0_0_20px_rgba(0,0,0,0.5)] border border-white/20"
          aria-label="Sesi Aç / Kapat"
        >
          {isMuted ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
          )}
        </button>
        
        {/* Hafif Karartma (Sadece yazıların okunabilmesi için çok ince bir siyah katman) */}
        <div className="absolute inset-0 z-10 bg-black/40 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center text-center w-full max-w-[1000px] mx-auto px-5 gap-6">
          
          {/* Top Badge */}
          <div className="border border-[#e60000]/30 bg-black/50 backdrop-blur-md rounded-full px-4 py-1.5 flex items-center justify-center gap-2 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-[#e60000] animate-pulse"></span>
            <span className="text-white/90 text-[10px] md:text-[12px] font-bold tracking-widest uppercase">Türkiye&apos;nin #1 Platformu</span>
          </div>

          {/* Center Logo - Fixed white background issue by using a soft transparent glow instead */}
          <div className="relative flex items-center justify-center my-2 mt-4">
            <div className="absolute inset-0 bg-white/20 blur-[50px] rounded-full scale-[1.7]"></div>
            <div className="w-[170px] h-[170px] md:w-[210px] md:h-[210px] rounded-full overflow-hidden border-[3px] border-[#d4af37] shadow-[0_0_40px_rgba(212,175,55,0.8)] z-10 flex items-center justify-center bg-black relative">
              <Image 
                src="/icons/prolig-logo-final.jpg" 
                width={210} 
                height={210} 
                alt="Pro Lig" 
                className="w-full h-full object-cover scale-[1.03]" 
              />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-[32px] md:text-[48px] leading-[1.15] text-white font-black w-full tracking-tight mt-2">
            Halı saha futbolunun <br className="md:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff3131] to-[#a30000]">
              en kapsamlı platformu
            </span>
          </h1>

          {/* Install PWA */}
          <div className="flex flex-col items-center w-full max-w-[320px] md:max-w-[400px]">
            <InstallButton />
            <p className="text-white/70 text-[13px] md:text-[15px] font-medium text-center mt-4 leading-relaxed">
              Maç sonuçları, puan durumları, takımlar ve özel haberlere telefonundan anında ulaş.
            </p>
          </div>

          {/* Stats Badges */}
          <div className="flex flex-row flex-wrap items-center justify-center gap-2 md:gap-4 w-full mt-2">
            <div className="border border-white/10 bg-white/10 backdrop-blur-md rounded-xl px-4 py-2.5 flex items-center justify-center gap-2 shadow-sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff3131" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              <span className="text-white font-bold text-[13px] md:text-[15px]">40 Şehir</span>
            </div>
            <div className="border border-white/10 bg-white/10 backdrop-blur-md rounded-xl px-4 py-2.5 flex items-center justify-center gap-2 shadow-sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff3131" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              <span className="text-white font-bold text-[13px] md:text-[15px]">16.364+ Oyuncu</span>
            </div>
            <div className="border border-white/10 bg-white/10 backdrop-blur-md rounded-xl px-4 py-2.5 flex items-center justify-center gap-2 shadow-sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff3131" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 21h8"></path><path d="M12 17v4"></path><path d="M7 4h10l1 13H6L7 4z"></path></svg>
              <span className="text-white font-bold text-[13px] md:text-[15px]">1.395+ Takım</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-[360px] md:max-w-[440px] mt-6">
            <Link 
              href="/lig" 
              className="col-span-1 sm:col-span-2 bg-gradient-to-r from-[#e60000] to-[#b30000] hover:from-[#ff3131] hover:to-[#cc0000] text-white font-bold text-[16px] h-[52px] rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(230,0,0,0.3)] hover:-translate-y-1"
            >
              Platformu Keşfet
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </Link>
            
            <Link 
              href="/giris" 
              style={{ color: "#e60000" }}
              className="bg-white hover:bg-gray-100 font-black text-[16px] h-[52px] rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(255,255,255,0.15)] hover:-translate-y-0.5"
            >
              Giriş Yap
            </Link>
            <Link 
              href="/lig" 
              style={{ color: "#e60000" }}
              className="bg-white hover:bg-gray-100 font-black text-[16px] h-[52px] rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(255,255,255,0.15)] hover:-translate-y-0.5"
            >
              Misafir Girişi
            </Link>
          </div>

          {/* Notifications Button */}
          <div className="w-full max-w-[360px] md:max-w-[440px] mt-1">
             <button 
                onClick={subscribeUser}
                className="group relative overflow-hidden w-full bg-gradient-to-r from-[#0077b5] to-[#1da1f2] text-white font-bold text-[14px] h-[48px] rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_5px_15px_rgba(29,161,242,0.3)] hover:-translate-y-1"
             >
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)] -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out cursor-pointer"></div>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                BİLDİRİMLERİ AÇ
             </button>
          </div>
        </div>
      </section>

      {/* TÜRKİYE GENELİ - MAP SECTION */}
      <section className="py-24 bg-white w-full">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="w-full aspect-[2/1] md:aspect-[2.5/1] bg-white rounded-3xl flex flex-col items-center justify-center border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] relative overflow-hidden mb-16 p-8">
             <div className="absolute inset-0 opacity-[0.15] bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Turkey_location_map.svg/1024px-Turkey_location_map.svg.png')] bg-contain bg-center bg-no-repeat filter sepia hue-rotate-[200deg] saturate-200"></div>
             <div className="relative z-10 flex flex-col items-center">
               <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-4 opacity-80"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg>
               <h3 className="text-[26px] font-black text-[#1a1a2e]">Türkiye Futbol Haritası</h3>
             </div>
          </div>

          <div className="text-center mb-10">
            <h3 className="text-[14px] font-medium text-gray-500 mb-1">Pro Lig Avantajları</h3>
            <p className="text-[12px] text-gray-400">Profesyonel futbol deneyiminin en iyisini sunuyoruz</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#f8f9fa] border border-gray-100 rounded-xl p-8 text-center flex flex-col items-center">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-5 shadow-sm">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1a1a2e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
              </div>
              <h4 className="font-bold text-[13px] text-[#1a1a2e] mb-3 uppercase tracking-wide">SON TEKNOLOJİ HALI SAHALAR</h4>
              <p className="text-gray-500 text-[13px] leading-relaxed">En üst düzey futbol deneyimini sunmak için tasarlanmış en kaliteli sahalarda oynamanın keyfini çıkarın.</p>
            </div>
            
            <div className="bg-[#f8f9fa] border border-gray-100 rounded-xl p-8 text-center flex flex-col items-center">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-5 shadow-sm">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1a1a2e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              </div>
              <h4 className="font-bold text-[13px] text-[#1a1a2e] mb-3 uppercase tracking-wide">PROFESYONEL HAKEMLER</h4>
              <p className="text-gray-500 text-[13px] leading-relaxed">Maçlarımız, fair play ve kurallara uyulmasını sağlayan sertifikalı hakemler tarafından yönetilmektedir.</p>
            </div>

            <div className="bg-[#ffe5e5] border border-[#ffcccc] rounded-xl p-8 text-center flex flex-col items-center">
              <div className="w-12 h-12 bg-[#e60000] rounded-full flex items-center justify-center text-white mb-5 shadow-sm">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect><polyline points="17 2 12 7 7 2"></polyline></svg>
              </div>
              <h4 className="font-bold text-[13px] text-[#1a1a2e] mb-3 uppercase tracking-wide">CANLI MAÇ YAYINI</h4>
              <p className="text-gray-700 text-[13px] leading-relaxed">Tüm lig maçlarının canlı yayını ve özet görüntüleri ile aksiyonun hiçbir anını kaçırmayacaksınız.</p>
            </div>
          </div>
        </div>
      </section>

      {/* RAKAMLARLA BİZ */}
      <section className="py-28 bg-[#fafbfc] w-full">
        <div className="max-w-[900px] mx-auto px-6 flex flex-col items-center">
          <div className="bg-white border border-gray-200 rounded-full px-5 py-1.5 text-[11px] font-bold text-gray-500 mb-6 flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
            PLATFORM
          </div>
          <h2 className="text-[40px] font-black text-[#1a1a2e] mb-2 tracking-tight">Rakamlarla Biz</h2>
          <p className="text-gray-500 text-[15px] mb-14">Türkiye'nin en kapsamlı halı saha futbol platformu</p>

          <div className="w-full bg-white rounded-3xl shadow-[0_20px_50px_rgba(230,0,0,0.06)] border border-[#ffcccc]/30 p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 divide-y md:divide-y-0 md:divide-x divide-gray-100">
              
              <div className="flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-[#f8f9fa] rounded-2xl flex items-center justify-center mb-6">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1a1a2e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                </div>
                <div className="text-[54px] font-black text-[#e60000] leading-none mb-2 tracking-tighter">40</div>
                <div className="text-[14px] font-bold text-[#1a1a2e]">İl</div>
              </div>

              <div className="flex flex-col items-center justify-center text-center pt-10 md:pt-0">
                <div className="w-16 h-16 bg-[#fff0f0] rounded-2xl flex items-center justify-center mb-6">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1a1a2e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                </div>
                <div className="text-[54px] font-black text-[#e60000] leading-none mb-2 tracking-tighter">1.395</div>
                <div className="text-[14px] font-bold text-[#1a1a2e]">Takım</div>
              </div>

              <div className="flex flex-col items-center justify-center text-center pt-10 md:pt-0">
                <div className="w-16 h-16 bg-[#f8f9fa] rounded-2xl flex items-center justify-center mb-6">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1a1a2e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                </div>
                <div className="text-[54px] font-black text-[#ff8080] leading-none mb-2 tracking-tighter opacity-90">16.364</div>
                <div className="text-[14px] font-bold text-[#1a1a2e]">Oyuncu</div>
              </div>

            </div>
            
            <div className="w-full text-center mt-12 pt-6 border-t border-gray-100">
              <span className="text-[12px] font-medium text-gray-500">Türkiye'nin en kapsamlı halı saha futbol platformu</span>
            </div>
          </div>
        </div>
      </section>

      {/* ÖZELLİKLER - NELER SUNUYORUZ */}
      <section className="py-24 bg-white w-full">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col items-center">
          <div className="bg-white border border-gray-200 rounded-full px-5 py-1.5 text-[11px] font-bold text-gray-500 mb-6 flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            ÖZELLİKLER
          </div>
          <h2 className="text-[40px] font-black text-[#1a1a2e] mb-2 tracking-tight">Neler Sunuyoruz?</h2>
          <p className="text-gray-500 text-[15px] mb-12">Halı saha futbolunda ihtiyacınız olan her şey</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {/* Box 1 */}
            <div className="bg-[#f0f9f4] rounded-xl p-8 flex flex-col border border-[#e2f2e9]">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e60000" strokeWidth="2"><path d="M8 21h8"></path><path d="M12 17v4"></path><path d="M7 4h10l1 13H6L7 4z"></path></svg>
              </div>
              <h3 className="text-[18px] font-bold text-[#1a1a2e] mb-3">Lig Takibi</h3>
              <p className="text-gray-600 text-[13px] leading-relaxed">40 şehirde aktif ligleri takip et, puan durumunu incele</p>
            </div>
            
            {/* Box 2 */}
            <div className="bg-[#fff9f5] rounded-xl p-8 flex flex-col border border-[#faefe8]">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e60000" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
              <h3 className="text-[18px] font-bold text-[#1a1a2e] mb-3">Takım Profilleri</h3>
              <p className="text-gray-600 text-[13px] leading-relaxed">Takımları keşfet, istatistiklerini incele, kadroları gör</p>
            </div>

            {/* Box 3 */}
            <div className="bg-[#fff5f5] rounded-xl p-8 flex flex-col border border-[#fce8e8]">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e60000" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4"></circle></svg>
              </div>
              <h3 className="text-[18px] font-bold text-[#1a1a2e] mb-3">Maç Sonuçları</h3>
              <p className="text-gray-600 text-[13px] leading-relaxed">Canlı skorları takip et, maç detaylarını incele</p>
            </div>

            {/* Box 4 */}
            <div className="bg-[#f0f9f4] rounded-xl p-8 flex flex-col border border-[#e2f2e9]">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              </div>
              <h3 className="text-[18px] font-bold text-[#1a1a2e] mb-3">Oyuncu İstatistikleri</h3>
              <p className="text-gray-600 text-[13px] leading-relaxed">En iyi oyuncuları keşfet, performansları karşılaştır</p>
            </div>

            {/* Box 5 */}
            <div className="bg-[#fff9f5] rounded-xl p-8 flex flex-col border border-[#faefe8]">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fb923c" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
              </div>
              <h3 className="text-[18px] font-bold text-[#1a1a2e] mb-3">Güncel Haberler</h3>
              <p className="text-gray-600 text-[13px] leading-relaxed">Bölgesel ve ulusal halı saha haberleri</p>
            </div>

            {/* Box 6 */}
            <div className="bg-[#fff5f5] rounded-xl p-8 flex flex-col border border-[#fce8e8]">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
              </div>
              <h3 className="text-[18px] font-bold text-[#1a1a2e] mb-3">Anlık Bildirimler</h3>
              <p className="text-gray-600 text-[13px] leading-relaxed">Favori takımlarından anlık bildirimler al</p>
            </div>
          </div>
        </div>
      </section>

      {/* HEMEN BAŞLA CTA */}
      <section className="py-24 bg-[#fafbfc] w-full flex justify-center px-6">
        <div className="w-full max-w-[800px] bg-white rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.04)] border border-gray-100 p-14 text-center">
          <h2 className="text-[44px] font-black text-[#1a1a2e] mb-4 tracking-tight">Hemen Başla!</h2>
          <p className="text-gray-500 text-[15px] mb-10 max-w-md mx-auto leading-relaxed">
            Halı saha futbolunun en heyecanlı platformuna katıl! Ligini takip et, istatistikleri keşfet, topluluğa dahil ol.
          </p>
          <Link href="/giris" className="inline-flex items-center gap-2 bg-white text-[#1a1a2e] font-bold text-[14px] px-8 py-3.5 rounded-lg shadow-[0_5px_15px_rgba(0,0,0,0.06)] border border-gray-200 hover:bg-gray-50 transition-colors">
            Şimdi Giriş Yap <span className="text-lg font-black ml-1">{'>'}</span>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white py-16 px-6 border-t border-gray-100 flex flex-col items-center">
        {/* Socials */}
        <div className="flex items-center gap-4 mb-10">
          <a href="#" className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-500 hover:text-[#1a1a2e] hover:bg-gray-100 transition-colors border border-gray-100">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
          </a>
          <a href="#" className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-500 hover:text-[#1a1a2e] hover:bg-gray-100 transition-colors border border-gray-100">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
          </a>
          <a href="#" className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-500 hover:text-[#1a1a2e] hover:bg-gray-100 transition-colors border border-gray-100">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
          </a>
        </div>

        <div className="flex flex-wrap justify-center gap-8 mb-10 text-[12px] font-bold text-gray-400">
          <a href="#" className="hover:text-[#1a1a2e] transition-colors">İletişim</a>
          <span className="text-gray-300">•</span>
          <a href="#" className="hover:text-[#1a1a2e] transition-colors">Lig Kuralları</a>
          <span className="text-gray-300">•</span>
          <a href="#" className="hover:text-[#1a1a2e] transition-colors">Gizlilik Politikası</a>
        </div>
        
        <div className="text-gray-400 text-[11px] mb-4 text-center">
          © 2026 PRO LİG. Tüm Hakları Saklıdır
          <br/>
          <span className="inline-block mt-2">Halı saha futbolunun Türkiye'deki en büyük platformu</span>
        </div>
        
        <div className="text-gray-400 text-[10px] mt-6 pt-6 border-t border-gray-100 w-full max-w-sm text-center">
          Bu site <a href="https://www.agx-labs.com/" className="text-gray-500 font-bold hover:text-[#e60000]">AGX Labs</a> tarafından geliştirilmiştir
        </div>
      </footer>

    </div>
  );
}
