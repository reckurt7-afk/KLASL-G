"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import CityStoryBar from "./CityStoryBar";
import GundemCarousel from "./GundemCarousel";
import MacSonuclariSlider from "./MacSonuclariSlider";
import Link from "next/link";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Hide complex layout on splash screen and auth pages
  const isSplash = pathname === "/";
  const isAuth = pathname.startsWith("/giris") || pathname.startsWith("/kayit") || pathname.startsWith("/admin");

  if (isSplash || isAuth) {
    return <>{children}</>;
  }

  // Phase 5 Exact Match Layout
  return (
    <div className="flex flex-col bg-[#f4f6f8] min-h-screen font-sans">
      <Header />
      <CityStoryBar />
      <GundemCarousel />
      <MacSonuclariSlider />

      {/* Two Column Section */}
      <div className="max-w-[1600px] mx-auto w-full px-4 py-8 flex flex-col lg:flex-row gap-6">
        
        {/* Left Sidebar (Desktop Only) */}
        <aside className="w-[260px] hidden lg:block shrink-0">
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm sticky top-[90px]">
            <nav className="flex flex-col">
              <Link href="/lig" className={`flex items-center gap-3 px-6 py-4 font-bold transition-colors ${pathname === '/lig' ? 'bg-[#e60000] text-white' : 'text-gray-700 hover:bg-gray-50'}`}>
                <span className="text-lg">📰</span> HABERLER
              </Link>
              <Link href="/genel-bakis" className={`flex items-center gap-3 px-6 py-4 font-bold transition-colors ${pathname === '/genel-bakis' ? 'bg-[#e60000] text-white' : 'text-gray-700 hover:bg-gray-50'}`}>
                <span className="text-lg">📊</span> GENEL BAKIŞ
              </Link>
              <Link href="/puan-durumu" className={`flex items-center gap-3 px-6 py-4 font-bold transition-colors ${pathname === '/puan-durumu' ? 'bg-[#e60000] text-white' : 'text-gray-700 hover:bg-gray-50'}`}>
                <span className="text-lg">🏆</span> PUAN DURUMU
              </Link>
              <Link href="/fikstur" className={`flex items-center gap-3 px-6 py-4 font-bold transition-colors ${pathname === '/fikstur' ? 'bg-[#e60000] text-white' : 'text-gray-700 hover:bg-gray-50'}`}>
                <span className="text-lg">📅</span> MAÇ PROGRAMI
              </Link>
              <Link href="/takimlar" className={`flex items-center gap-3 px-6 py-4 font-bold transition-colors ${pathname === '/takimlar' ? 'bg-[#e60000] text-white' : 'text-gray-700 hover:bg-gray-50'}`}>
                <span className="text-lg">🛡️</span> TAKIM İSTATİSTİKLERİ
              </Link>
              <Link href="/transfer-borsasi" className={`flex items-center gap-3 px-6 py-4 font-bold transition-colors ${pathname === '/transfer-borsasi' ? 'bg-[#e60000] text-white' : 'text-gray-700 hover:bg-gray-50'}`}>
                <span className="text-lg">💸</span> TRANSFER BORSASI
              </Link>
              <Link href="/ceza-tahtasi" className={`flex items-center gap-3 px-6 py-4 font-bold transition-colors ${pathname === '/ceza-tahtasi' ? 'bg-[#e60000] text-white' : 'text-gray-700 hover:bg-gray-50'}`}>
                <span className="text-lg">⚖️</span> CEZA TAHTASI
              </Link>
            </nav>
          </div>
        </aside>

        {/* Mobile Navbar (Visible only on small screens, instead of left sidebar) */}
        <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-50 flex justify-around p-3 pb-safe">
          <Link href="/lig" className="flex flex-col items-center text-red-600">
             <span className="text-xl">📰</span>
             <span className="text-[10px] font-bold mt-1">Haberler</span>
          </Link>
          <Link href="/puan-durumu" className="flex flex-col items-center text-gray-400">
             <span className="text-xl">🏆</span>
             <span className="text-[10px] font-bold mt-1">Puan D.</span>
          </Link>
          <Link href="/fikstur" className="flex flex-col items-center text-gray-400">
             <span className="text-xl">📅</span>
             <span className="text-[10px] font-bold mt-1">Fikstür</span>
          </Link>
          <Link href="/takimlar" className="flex flex-col items-center text-gray-400">
             <span className="text-xl">🛡️</span>
             <span className="text-[10px] font-bold mt-1">Takımlar</span>
          </Link>
        </div>

        {/* Main Content */}
        <main className="flex-1 w-full min-h-[500px] bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-20 lg:mb-0">
          <div className="flex items-center gap-3 mb-6 bg-red-50 p-4 rounded-xl border border-red-100">
             <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-white text-xl shadow-sm">📰</div>
             <div>
               <h1 className="text-xl font-black text-gray-900">Lig Merkezi</h1>
               <p className="text-xs text-gray-500 font-bold">Şehrin son gelişmeleri ve lig durumu</p>
             </div>
             <div className="ml-auto bg-white border border-gray-200 px-3 py-1 rounded-full text-xs font-bold text-gray-600 shadow-sm">
                10
             </div>
          </div>
          {children}
        </main>

      </div>
    </div>
  );
}
