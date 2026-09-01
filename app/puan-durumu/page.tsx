"use client";

import PuanDurumuTablosu from "../components/PuanDurumuTablosu";

export default function PuanDurumuPage() {
  return (
    <div className="w-full flex flex-col fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 bg-red-50 p-4 rounded-xl border border-red-100">
         <div className="w-10 h-10 bg-[#1e3a8a] rounded-lg flex items-center justify-center text-white shadow-sm">
           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
         </div>
         <div>
           <h1 className="text-[20px] font-black text-[#1a1a2e]">Puan Durumu</h1>
           <p className="text-[12px] text-gray-500 font-bold">Güncel lig sıralaması ve takım istatistikleri</p>
         </div>
      </div>

      {/* Content */}
      <div className="w-full">
        <PuanDurumuTablosu />
      </div>
    </div>
  );
}
