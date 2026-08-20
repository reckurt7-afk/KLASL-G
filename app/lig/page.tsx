"use client";

import { useCityStore } from "../store/cityStore";

const MOCK_HABERLER = [
  {
    id: 1,
    title: "Şehrin En Büyük Derbisi!",
    summary: "Hafta sonu oynanacak olan büyük derbide iki namağlup takım karşı karşıya geliyor. Hazırlıklar tamamlandı.",
    date: "20 Ağustos 2026",
    category: "ÖN İNCELEME",
    image: "https://images.unsplash.com/photo-1518605368461-1e12dce38a42?q=80&w=600"
  },
  {
    id: 2,
    title: "Yıldız Oyuncu Transfer Oldu",
    summary: "Geçen sezonun gol kralı yeni takımıyla ilk antrenmanına çıktı. Taraftarlar heyecanlı.",
    date: "19 Ağustos 2026",
    category: "TRANSFER",
    image: "https://images.unsplash.com/photo-1543351611-58f69d7c1781?q=80&w=600"
  },
  {
    id: 3,
    title: "Hakem Atamaları Belli Oldu",
    summary: "Bu haftanın kritik mücadelelerini yönetecek hakem triosu Merkez Hakem Kurulu tarafından açıklandı.",
    date: "18 Ağustos 2026",
    category: "DUYURU",
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600"
  },
  {
    id: 4,
    title: "Saha Zeminleri Yenileniyor",
    summary: "Lig maçlarının oynanacağı tüm sahalarda zemin iyileştirme çalışmaları son sürat devam ediyor.",
    date: "17 Ağustos 2026",
    category: "ALTYAPI",
    image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=600"
  }
];

export default function LigMerkezi() {
  const { selectedCityId } = useCityStore();

  // Selected city name can be derived from ID. For now just mock.
  const cityName = selectedCityId === 1 ? "İstanbul" : selectedCityId === 2 ? "Bursa" : selectedCityId === 3 ? "İzmir" : "Türkiye";

  return (
    <div className="w-full flex flex-col fade-in">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 bg-red-50 p-4 rounded-xl border border-red-100">
         <div className="w-10 h-10 bg-[#e60000] rounded-lg flex items-center justify-center text-white shadow-sm">
           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>
         </div>
         <div>
           <h1 className="text-[20px] font-black text-[#1a1a2e]">{cityName} Haberleri</h1>
           <p className="text-[12px] text-gray-500 font-bold">Şehrin son gelişmeleri ve haberler</p>
         </div>
         <div className="ml-auto bg-white border border-gray-200 px-3 py-1 rounded-full text-[11px] font-bold text-gray-600 shadow-sm">
            {MOCK_HABERLER.length} Haber
         </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6 w-full">
        {MOCK_HABERLER.map((haber) => (
          <div key={haber.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-[0_5px_15px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 group cursor-pointer flex flex-col">
            <div className="relative w-full h-[200px] overflow-hidden">
              <div 
                className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500" 
                style={{ backgroundImage: `url(${haber.image})` }}
              ></div>
              <div className="absolute top-3 left-3 bg-[#e60000] text-white text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded">
                {haber.category}
              </div>
            </div>
            
            <div className="p-5 flex flex-col flex-1">
              <span className="text-[11px] text-gray-400 font-bold mb-2 flex items-center gap-1.5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                {haber.date}
              </span>
              <h3 className="text-[17px] font-black text-[#1a1a2e] mb-2 leading-snug group-hover:text-[#e60000] transition-colors">
                {haber.title}
              </h3>
              <p className="text-gray-500 text-[13px] leading-relaxed line-clamp-3">
                {haber.summary}
              </p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
