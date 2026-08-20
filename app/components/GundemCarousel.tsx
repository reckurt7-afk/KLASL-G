"use client";

export default function GundemCarousel() {
  return (
    <div className="w-full bg-white pt-8 pb-4">
      <div className="max-w-[1600px] mx-auto px-4">
        <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center justify-between">
          Gündem
          <div className="flex gap-1">
            <span className="w-2 h-2 rounded-full bg-gray-300"></span>
            <span className="w-2 h-2 rounded-full bg-gray-300"></span>
            <span className="w-6 h-2 rounded-full bg-red-600"></span>
          </div>
        </h2>

        <div className="flex gap-4 overflow-x-auto hide-scrollbar snap-x">
          {/* Card 1 */}
          <div className="relative min-w-[280px] sm:min-w-[320px] md:min-w-[400px] h-[250px] rounded-2xl overflow-hidden shrink-0 snap-center group cursor-pointer">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=600')] bg-cover bg-center group-hover:scale-105 transition-transform duration-500"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded">🔴 20 Ağustos 2026</span>
                <span className="text-white text-[10px] font-bold bg-white/20 px-2 py-1 rounded backdrop-blur-sm">📌 Manşet</span>
              </div>
              <h3 className="text-white font-black text-lg md:text-xl leading-tight mb-1">Büyük Randevu Bursa'da!</h3>
              <p className="text-gray-300 text-xs">Bursa Süper Ligi'nde dev derbi...</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="relative min-w-[280px] sm:min-w-[320px] md:min-w-[400px] h-[250px] rounded-2xl overflow-hidden shrink-0 snap-center group cursor-pointer">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518605368461-1e12dce38a42?q=80&w=600')] bg-cover bg-center group-hover:scale-105 transition-transform duration-500"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded">🔴 19 Ağustos 2026</span>
                <span className="text-white text-[10px] font-bold bg-white/20 px-2 py-1 rounded backdrop-blur-sm">📌 Manşet</span>
              </div>
              <h3 className="text-white font-black text-lg md:text-xl leading-tight mb-1">Milli Takımımızın Giyim Sponsoru Divane Spor!</h3>
              <p className="text-gray-300 text-xs">Halı saha milli takımı...</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="relative min-w-[280px] sm:min-w-[320px] md:min-w-[400px] h-[250px] rounded-2xl overflow-hidden shrink-0 snap-center group cursor-pointer">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600')] bg-cover bg-center group-hover:scale-105 transition-transform duration-500"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded">🔴 18 Ağustos 2026</span>
                <span className="text-white text-[10px] font-bold bg-white/20 px-2 py-1 rounded backdrop-blur-sm">📌 Röportaj</span>
              </div>
              <h3 className="text-white font-black text-lg md:text-xl leading-tight mb-1">Hoş Geldin Cihan Özdemir</h3>
              <p className="text-gray-300 text-xs">Yeni antrenörümüz ile özel röportaj...</p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="relative min-w-[280px] sm:min-w-[320px] md:min-w-[400px] h-[250px] rounded-2xl overflow-hidden shrink-0 snap-center group cursor-pointer">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1543351611-58f69d7c1781?q=80&w=600')] bg-cover bg-center group-hover:scale-105 transition-transform duration-500"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded">🔴 17 Ağustos 2026</span>
                <span className="text-white text-[10px] font-bold bg-white/20 px-2 py-1 rounded backdrop-blur-sm">📌 Manşet</span>
              </div>
              <h3 className="text-white font-black text-lg md:text-xl leading-tight mb-1">Halı Saha Takımı Sırbistan Yolcusu</h3>
              <p className="text-gray-300 text-xs">Road to Serbia...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
