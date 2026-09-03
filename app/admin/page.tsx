import Link from "next/link";

const ADMIN_CARDS = [
  {
    title: "Oyuncu Yönetimi",
    desc: "Tüm oyuncuları düzenle ve takımlarını değiştir",
    link: "/admin/oyuncu-yonetimi",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    ),
  },
    {
      title: "Takım Yönetimi",
      desc: "Kayıtlı takımları gör ve sil",
      link: "/admin/takim-yonetimi",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
    },

  {
    title: "Canlı Maç & Olaylar",
    desc: "Maç skoru, gol, asist ve kartları yönet",
    link: "/admin/canli-mac",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ceaa52" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  },
  {
    title: "Oyuncu İstatistikleri",
    desc: "Gol ve Asist Krallığı (Otomatik)",
    link: "/admin/istatistikler",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 20v-6M6 20V10M18 20V4"/>
      </svg>
    ),
  },
  {
    title: "Maç Sonucu Gir",
    desc: "Maç skorlarını ve durumlarını güncelle",
    link: "/admin/mac-sonucu",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>
      </svg>
    ),
  },
  {
    title: "Fikstür Düzenle",
    desc: "Maç tarihlerini ve sahalarını ayarla",
    link: "/admin/fikstur",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
  },
  {
    title: "Gündem & Haberler",
    desc: "Anasayfa haberlerini ve duyuruları yönet",
    link: "/admin/duyurular",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/>
      </svg>
    ),
  },
  {
    title: "KAP Bildirimleri",
    desc: "Lig sayfasındaki KAP haberlerini yönet",
    link: "/admin/kap",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14"/>
      </svg>
    ),
  },
  {
    title: "Puan Durumu",
    desc: "Puan durumunu manuel olarak düzenle",
    link: "/admin/puan-durumu",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 4h10l1 13H6L7 4z"/>
      </svg>
    ),
  },
  {
    title: "Altın 8'i Güncelle",
    desc: "Haftanın karma 8'li kadrosunu belirle",
    link: "/admin/altin-sekiz",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
  },
  {
    title: "Hakem Paneli",
    desc: "Hakem atamaları ve maç raporları",
    link: "/admin/hakem-paneli",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  },
  {
    title: "Oyuncu Başvuruları",
    desc: "Yeni oyuncu kayıtlarını onayla/reddet",
    link: "/admin/basvurular",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    title: "Çalışma Ekibi Yönetimi",
    desc: "Personel ve hakem ekibini düzenle",
    link: "/admin/calisma-ekibi",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    title: "Fotoğraf Galerisi",
    desc: "Galeriye yeni fotoğraflar yükle",
    link: "/admin/galeri",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
      </svg>
    ),
  },
  {
    title: "Maç Esameleri",
    desc: "Maç kadrolarını ve esamelerini yönet",
    link: "/admin/esameler",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
  },
  {
    title: "Bildirim Gönder",
    desc: "Kullanıcılara push bildirim gönder",
    link: "/admin/bildirim",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      </svg>
    ),
  },
  {
    title: "Skor Tahminleri",
    desc: "Tahmin yarışması sonuçlarını yönet",
    link: "/admin/skor-tahminleri",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
      </svg>
    ),
  },
  {
    title: "Ayarlar",
    desc: "Sistem ve sezon ayarlarını yapılandır",
    link: "/admin/ayarlar",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
      </svg>
    ),
  },
];

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-[#050505] pt-12 pb-24 font-sans relative overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#ceaa52] opacity-[0.03] blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#ceaa52] opacity-[0.03] blur-[150px] rounded-full pointer-events-none"></div>

      <div className="max-w-[1250px] mx-auto px-5 md:px-8 relative z-10">
        
        {/* Admin Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between bg-[#0a0a0a]/80 backdrop-blur-xl border border-gray-800/60 rounded-3xl p-8 shadow-2xl mb-12 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-[#9e1b22]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
          
          <div className="flex items-center gap-6 mb-6 md:mb-0 relative z-10">
            <div className="w-16 h-16 bg-gradient-to-br from-[#9e1b22] to-[#990000] rounded-2xl flex items-center justify-center text-white shadow-[0_0_30px_rgba(158,27,34,0.3)] border border-[#b82029]/30">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/>
              </svg>
            </div>
            <div>
              <h1 className="text-[28px] md:text-[34px] font-black text-white tracking-tight leading-none mb-2 drop-shadow-md">
                YÖNETİM PANELİ
              </h1>
              <p className="text-[14px] md:text-[15px] text-gray-400 font-medium tracking-wide">
                Prime Lig Komuta Merkezi
              </p>
            </div>
          </div>
          <Link 
            href="/"
            className="flex items-center justify-center gap-2 bg-[#141414] hover:bg-[#1f1f1f] border border-gray-800 hover:border-gray-600 text-gray-300 hover:text-white font-bold px-6 py-4 rounded-xl transition-all duration-300 text-[14px] shadow-lg relative z-10"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            SİTEYE DÖN
          </Link>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
          {ADMIN_CARDS.map((kart, i) => (
            <Link
              key={i}
              href={kart.link}
              className="group relative bg-[#0a0a0a]/60 backdrop-blur-md border border-gray-800/80 rounded-2xl p-6 transition-all duration-300 flex flex-col hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(158,27,34,0.15)] hover:border-[#ceaa52]/50 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#9e1b22]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              
              <div className="w-14 h-14 bg-[#141414] group-hover:bg-[#ceaa52] text-gray-400 group-hover:text-white rounded-xl flex items-center justify-center mb-5 transition-all duration-300 border border-gray-800 group-hover:border-[#b82029] shadow-inner relative z-10">
                {kart.icon}
              </div>
              <h2 className="text-[17px] font-black text-gray-200 mb-2 group-hover:text-white transition-colors tracking-wide relative z-10">
                {kart.title}
              </h2>
              <p className="text-[13px] text-gray-500 font-medium leading-relaxed group-hover:text-gray-400 transition-colors relative z-10">
                {kart.desc}
              </p>
              
              {/* Decorative Arrow */}
              <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300 text-[#ceaa52]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
