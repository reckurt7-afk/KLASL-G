"use client";

import { usePathname } from "next/navigation";
import Topbar from "./Topbar";
import Navbar from "./Navbar";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Hide standard layout elements on the splash screen
  const isSplash = pathname === "/";

  if (isSplash) {
    return <>{children}</>;
  }

  // Phase 4 White Theme Layout
  return (
    <div className="flex bg-[var(--bg)] min-h-screen text-[var(--text)] font-sans">
      {/* Sidebar Layout for Desktop */}
      <aside className="w-[280px] bg-white border-r border-gray-200 hidden lg:flex flex-col shadow-sm fixed h-full z-50">
         <div className="p-6 border-b border-gray-100 flex items-center justify-center">
            <img src="/icons/logo.png" className="w-20 h-20 object-contain drop-shadow-md" />
         </div>
         <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <a href="/lig" className="flex items-center gap-3 px-4 py-3 bg-[#e60000] text-white rounded-xl font-bold shadow-md hover:bg-red-700 transition-colors">
              <span className="w-5 h-5 flex items-center justify-center">📰</span> Haberler
            </a>
            <a href="/lig" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-bold transition-colors">
              <span className="w-5 h-5 flex items-center justify-center">📊</span> Genel Bakış
            </a>
            <a href="/puan-durumu" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-bold transition-colors">
              <span className="w-5 h-5 flex items-center justify-center">🏆</span> Puan Durumu
            </a>
            <a href="/fikstur" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-bold transition-colors">
              <span className="w-5 h-5 flex items-center justify-center">📅</span> Maç Programı
            </a>
            <a href="/takimlar" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-bold transition-colors">
              <span className="w-5 h-5 flex items-center justify-center">🛡️</span> Takım İstatistikleri
            </a>
            <a href="/transfer-borsasi" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-bold transition-colors">
              <span className="w-5 h-5 flex items-center justify-center">💸</span> Transfer Borsası
            </a>
            <a href="/ceza-tahtasi" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-bold transition-colors">
              <span className="w-5 h-5 flex items-center justify-center">⚖️</span> Ceza Tahtası
            </a>
         </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-[280px] min-h-screen pb-20 lg:pb-0 flex flex-col relative">
        {/* Topbar for City Selection */}
        <Topbar />
        
        {/* Mobile Bottom Navbar */}
        <div className="lg:hidden">
           <Navbar />
        </div>
        
        <div className="pt-[60px] px-4 md:px-8 py-8 w-full max-w-[1400px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
