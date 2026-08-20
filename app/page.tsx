"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans overflow-x-hidden">
      {/* HEADER */}
      <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-[70px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/icons/logo.png" width={45} height={45} alt="Klas Lig Logo" className="object-contain" />
            <span className="font-black text-xl tracking-tight text-gray-900">KLAS LİG</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-red-600 font-bold text-sm cursor-pointer hover:text-red-700 transition-colors">
              <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
              Klas Lig TV
            </div>
            <div className="flex gap-2">
              <Link href="/giris" className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                👤 Giriş Yap
              </Link>
              <Link href="/kayit" className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                ➕ Üye Ol
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center pt-20 px-4">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518605368461-1e12dce38a42?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-90 blur-[2px] scale-105"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-red-900/30"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto mt-10">
          <div className="bg-black/50 backdrop-blur-md border border-white/10 rounded-full px-4 py-1.5 flex items-center gap-2 mb-6">
            <span className="text-red-500">⚽</span>
            <span className="text-white text-xs sm:text-sm font-bold tracking-wider">TÜRKİYE'NİN #1 HALI SAHA PLATFORMU</span>
            <span className="text-red-500">⚽</span>
          </div>

          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-full p-6 sm:p-10 shadow-[0_0_60px_rgba(255,49,49,0.3)] mb-8"
          >
            <Image src="/icons/logo.png" width={160} height={160} alt="Klas Lig" className="object-contain" />
          </motion.div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl text-white font-medium mb-12 drop-shadow-lg max-w-3xl leading-snug">
            Halı saha futbolunun <span className="font-black text-red-500">en kapsamlı platformu</span> ile sahaya çık!
          </h1>

          {/* App Stores */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <button className="bg-black/80 hover:bg-black text-white border border-white/20 rounded-xl px-6 py-3 flex items-center gap-3 transition-colors">
              <span className="text-3xl">🍏</span>
              <div className="text-left">
                <div className="text-[10px] text-gray-300">Apple</div>
                <div className="font-bold text-sm">App Store</div>
              </div>
            </button>
            <button className="bg-black/80 hover:bg-black text-white border border-white/20 rounded-xl px-6 py-3 flex items-center gap-3 transition-colors">
              <span className="text-3xl">▶️</span>
              <div className="text-left">
                <div className="text-[10px] text-gray-300">Android</div>
                <div className="font-bold text-sm">Google Play</div>
              </div>
            </button>
          </div>

          {/* Stats Badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <div className="border border-white/10 bg-black/40 backdrop-blur-md rounded-full px-5 py-2 flex items-center gap-2 text-white">
              📍 <span className="font-bold text-sm">40 Şehir</span>
            </div>
            <div className="border border-white/10 bg-black/40 backdrop-blur-md rounded-full px-5 py-2 flex items-center gap-2 text-white">
              👤 <span className="font-bold text-sm">16.364+ Oyuncu</span>
            </div>
            <div className="border border-white/10 bg-black/40 backdrop-blur-md rounded-full px-5 py-2 flex items-center gap-2 text-white">
              🏆 <span className="font-bold text-sm">1.395+ Takım</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl justify-center px-4">
            <Link href="/lig" className="flex-1 bg-red-600 hover:bg-red-700 text-white font-black text-center py-4 rounded-xl shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2 text-lg">
              Keşfet <span className="text-xl">⌄</span>
            </Link>
            <Link href="/lig" className="flex-1 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold text-center py-4 rounded-xl transition-colors flex items-center justify-center gap-2 text-lg">
              Misafir Girişi 👥
            </Link>
            <Link href="/giris" className="flex-1 bg-transparent hover:bg-white/10 border border-transparent hover:border-white/20 text-white font-bold text-center py-4 rounded-xl transition-colors flex items-center justify-center gap-2 text-lg">
              Giriş Yap {'>'}
            </Link>
          </div>
        </div>
      </section>

      {/* MİSYONUMUZ */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-black text-gray-900 mb-6">Misyonumuz</h2>
          <p className="text-gray-600 leading-relaxed text-lg text-justify sm:text-center">
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
      <section className="py-20 px-4 bg-white border-y border-gray-100">
        <div className="max-w-6xl mx-auto text-center">
          <span className="text-red-600 font-bold tracking-widest text-sm uppercase mb-2 block">Türkiye Geneli</span>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">Türkiye Geneli Ağ</h2>
          <p className="text-gray-500 mb-12 text-lg">40 ilde aktif lig organizasyonları</p>
          
          <div className="relative w-full max-w-4xl mx-auto aspect-[16/9] bg-gray-100 rounded-3xl overflow-hidden border border-gray-200 shadow-inner flex items-center justify-center flex-col">
            <span className="text-6xl mb-4">🗺️</span>
            <h3 className="text-xl font-bold text-gray-800">Türkiye Futbol Haritası</h3>
            <p className="text-gray-500">İnteraktif Türkiye futbol haritası — 40 şehirde aktif</p>
          </div>
        </div>
      </section>

      {/* AVANTAJLAR */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-red-600 font-bold tracking-widest text-sm uppercase mb-2 block">Klas Lig Avantajları</span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">Profesyonel futbol deneyiminin en iyisini sunuyoruz</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-3xl mb-6 text-red-600">🏟️</div>
              <h3 className="font-bold text-xl text-gray-900 mb-4">SON TEKNOLOJİ HALI SAHALAR</h3>
              <p className="text-gray-500">En üst düzey futbol deneyimini sunmak için tasarlanmış en kaliteli sahalarda oynamanın keyfini çıkarın.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-3xl mb-6 text-red-600">⚖️</div>
              <h3 className="font-bold text-xl text-gray-900 mb-4">PROFESYONEL HAKEMLER</h3>
              <p className="text-gray-500">Maçlarımız, fair play ve kurallara uyulmasını sağlayan sertifikalı hakemler tarafından yönetilmektedir.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-3xl mb-6 text-red-600">📺</div>
              <h3 className="font-bold text-xl text-gray-900 mb-4">CANLI MAÇ YAYINI</h3>
              <p className="text-gray-500">Tüm lig maçlarının canlı yayını ve özet görüntüleri ile aksiyonun hiçbir anını kaçırmayacaksınız.</p>
            </div>
          </div>
        </div>
      </section>

      {/* RAKAMLARLA BİZ */}
      <section className="py-20 px-4 bg-red-600 text-white text-center">
        <div className="max-w-5xl mx-auto">
          <span className="text-red-200 font-bold tracking-widest text-sm uppercase mb-2 block">Platform</span>
          <h2 className="text-3xl md:text-4xl font-black mb-4">Rakamlarla Biz</h2>
          <p className="text-red-100 mb-16 text-lg">Türkiye'nin en kapsamlı halı saha futbol platformu</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <span className="text-6xl font-black mb-2">40</span>
              <span className="text-xl font-bold text-red-200">İl</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-6xl font-black mb-2">1.395</span>
              <span className="text-xl font-bold text-red-200">Takım</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-6xl font-black mb-2">16.364</span>
              <span className="text-xl font-bold text-red-200">Oyuncu</span>
            </div>
          </div>
        </div>
      </section>

      {/* ÖZELLİKLER */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-red-600 font-bold tracking-widest text-sm uppercase mb-2 block">Özellikler</span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">Neler Sunuyoruz?</h2>
            <p className="text-gray-500 text-lg">Halı saha futbolunda ihtiyacınız olan her şey</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '🏆', title: 'Lig Takibi', desc: '40 şehirde aktif ligleri takip et, puan durumunu incele' },
              { icon: '🛡️', title: 'Takım Profilleri', desc: 'Takımları keşfet, istatistiklerini incele, kadroları gör' },
              { icon: '⚽', title: 'Maç Sonuçları', desc: 'Canlı skorları takip et, maç detaylarını incele' },
              { icon: '🏃', title: 'Oyuncu İstatistikleri', desc: 'En iyi oyuncuları keşfet, performansları karşılaştır' },
              { icon: '📰', title: 'Güncel Haberler', desc: 'Bölgesel ve ulusal halı saha haberleri' },
              { icon: '🔔', title: 'Anlık Bildirimler', desc: 'Favori takımlarından anlık bildirimler al' },
            ].map((f, i) => (
              <div key={i} className="flex gap-4 p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-lg transition-all">
                <div className="text-3xl">{f.icon}</div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg mb-1">{f.title}</h4>
                  <p className="text-gray-500 text-sm">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gray-900 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-red-600/10"></div>
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Hemen Başla!</h2>
          <p className="text-gray-300 text-lg md:text-xl mb-10">
            Halı saha futbolunun en heyecanlı platformuna katıl! Ligini takip et, istatistikleri keşfet, topluluğa dahil ol.
          </p>
          <Link href="/kayit" className="inline-block bg-red-600 hover:bg-red-700 text-white font-black text-xl px-12 py-5 rounded-full shadow-[0_0_30px_rgba(255,49,49,0.4)] transition-transform hover:scale-105">
            Şimdi Giriş Yap
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black py-12 px-4 text-center">
        <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm font-bold text-gray-400">
          <a href="#" className="hover:text-white transition-colors">İletişim</a>
          <span>•</span>
          <a href="#" className="hover:text-white transition-colors">Lig Kuralları</a>
          <span>•</span>
          <a href="#" className="hover:text-white transition-colors">Gizlilik Politikası</a>
        </div>
        
        <div className="text-gray-500 text-sm mb-4">
          © 2026 KLAS LİG. Tüm Hakları Saklıdır
          <br />
          Halı saha futbolunun Türkiye'deki en büyük platformu
        </div>
        
        <div className="text-gray-600 text-xs">
          Bu site <a href="https://www.agx-labs.com/" className="text-red-500 hover:text-red-400">AGX Labs</a> tarafından geliştirilmiştir
        </div>
      </footer>
    </div>
  );
}
