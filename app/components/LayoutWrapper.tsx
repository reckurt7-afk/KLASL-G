"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import CityStoryBar from "./CityStoryBar";
import GundemCarousel from "./GundemCarousel";
import MacSonuclariSlider from "./MacSonuclariSlider";
import Link from "next/link";

const NAV_ITEMS = [
  {
    href: "/lig",
    label: "TRANSFERLER KAP",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/>
        <path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/>
      </svg>
    ),
  },
  {
    href: "/puan-durumu",
    label: "PUAN DURUMU",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 4h10l1 13H6L7 4z"/>
      </svg>
    ),
  },
  {
    href: "/fikstur",
    label: "Fikstür",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
        <line x1="8" y1="14" x2="8.01" y2="14"/><line x1="12" y1="14" x2="12.01" y2="14"/>
      </svg>
    ),
  },
  {
    href: "/takimlar",
    label: "Takımlar",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
];

const SIDEBAR_ITEMS = [
  { href: "/lig", label: "TRANSFERLER KAP", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg> },
  { href: "/genel-bakis", label: "HAFTANIN ALTIN 8'İ", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
  { href: "/puan-durumu", label: "PUAN DURUMU", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 4h10l1 13H6L7 4z"/></svg> },
  { href: "/fikstur", label: "MAÇ PROGRAMI", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
  { href: "/takimlar", label: "TAKIM İSTATİSTİKLERİ", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  { href: "/istatistikler", label: "OYUNCU İSTATİSTİKLERİ", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
  { href: "/takim-kur", label: "TAKIM KUR (YENİ SEZON)", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg> },
  { href: "/transfer-borsasi", label: "TRANSFER BORSASI", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg> },
  { href: "/calisma-ekibi", label: "ÇALIŞMA EKİBİ", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
];

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const isSplash = pathname === "/";
  const isAuth = pathname.startsWith("/giris") || pathname.startsWith("/kayit") || pathname.startsWith("/admin");
  const isDuyuru = pathname.startsWith("/duyuru") || pathname.startsWith("/oyuncu") || pathname.startsWith("/takim");

  if (isSplash || isAuth) {
    return <>{children}</>;
  }

  if (isDuyuru) {
    return (
      <div className="flex flex-col bg-[#fcfcfc] min-h-screen font-sans">
        <Header />
        <main className="flex-1 w-full">
          <div className="max-w-[1440px] mx-auto w-full px-4 md:px-6 py-6">
            {children}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-[#fcfcfc] min-h-screen font-sans">
      <Header />
      {/* <CityStoryBar /> removed */}
      <GundemCarousel />
      <MacSonuclariSlider />

      {/* The red separator line like the screenshot */}
      <div className="w-full bg-[#fcfcfc] pt-2">
         <div className="max-w-[1440px] mx-auto w-full px-4 md:px-6">
            <div className="w-full h-[2px] bg-[#ceaa52] rounded-full opacity-20"></div>
         </div>
      </div>
      
      {/* Two Column Section */}
      <div className="max-w-[1440px] mx-auto w-full px-4 md:px-6 py-6 flex flex-col lg:flex-row gap-8">
        
        {/* Left Sidebar - Desktop Only */}
        {/* Left sidebar removed */}

        {/* Main Content */}
        <main className="flex-1 w-full min-h-[500px] pb-24 lg:pb-6 bg-white rounded-[24px] border border-gray-100 p-5 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.03)]">
          {children}
        </main>

      
      {/* Mobile Bottom Navigation (App-like) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-200 pb-safe z-[9999] shadow-[0_-10px_20px_rgba(0,0,0,0.03)]">
        <nav className="flex items-center justify-between px-2 h-16">
          {SIDEBAR_ITEMS.slice(0, 5).map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex-1 flex flex-col items-center justify-center gap-1 h-full"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isActive ? "bg-[#9e1b22] text-white shadow-md scale-110" : "text-gray-400 hover:text-gray-900"}`}>
                  {item.icon}
                </div>
                <span className={`text-[9px] font-bold tracking-tight ${isActive ? "text-[#9e1b22]" : "text-gray-400"}`}>
                  {item.label.split(' ')[0]}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
  
      </div>
    </div>
  );
}
