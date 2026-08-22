"use client";

import Header from "./Header";
import Sidebar from "./Sidebar";
import RightSidebar from "./RightSidebar";

import { usePathname } from "next/navigation";
export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  if (isAdmin) return <>{children}</>;

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f6f8] text-[#111111]">
      {/* Top Header */}
      <Header />

      {/* Main Layout Grid */}
      <div className="flex-1 max-w-[1920px] w-full mx-auto flex">
        {/* Left Sidebar (Desktop) */}
        <Sidebar />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 flex flex-col h-[calc(100vh-72px)] overflow-y-auto">
          {children}
        </main>

        {/* Right Sidebar (Desktop XL) */}
        <RightSidebar />
      </div>

      {/* Mobile Bottom Navigation (TODO: Extract to component) */}
      <div className="lg:hidden fixed bottom-0 w-full bg-white border-t border-gray-200 flex items-center justify-around p-3 z-50 pb-safe">
        <a href="/lig" className="flex flex-col items-center gap-1 text-[#e50914]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          <span className="text-[10px] font-bold">LİG</span>
        </a>
        <a href="/puan-durumu" className="flex flex-col items-center gap-1 text-gray-500">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 4h10l1 13H6L7 4z"/></svg>
          <span className="text-[10px] font-bold">PUAN</span>
        </a>
        <a href="/fikstur" className="flex flex-col items-center gap-1 text-gray-500">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          <span className="text-[10px] font-bold">FİKSTÜR</span>
        </a>
      </div>
    </div>
  );
}

