"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import PuanDurumuTablosu from "./PuanDurumuTablosu";

export default function RightSidebar() {
  return (
    <aside className="w-80 flex-shrink-0 min-h-[calc(100vh-72px)] hidden xl:block p-6 space-y-8 bg-white border-l border-gray-200 overflow-y-auto">
      
      {/* MINI PUAN DURUMU WIDGET */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-900 tracking-tight">Puan Durumu</h3>
          <Link href="/puan-durumu" className="text-xs font-semibold text-[#e50914] hover:underline flex items-center">
            Tümü <ChevronRight className="w-3 h-3 ml-0.5" />
          </Link>
        </div>
        <PuanDurumuTablosu mini={true} />
      </div>

      {/* HAFTANIN OYUNCUSU WIDGET */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
          <h3 className="font-bold text-sm text-yellow-500 uppercase tracking-wider">Haftanın Oyuncusu</h3>
        </div>
        <div className="p-4 flex items-center gap-4">
          <div className="w-14 h-14 bg-gray-100 rounded-full border-2 border-yellow-500 flex-shrink-0 overflow-hidden">
             <img src="/icons/logo.png" alt="MVP" className="w-full h-full object-cover opacity-50" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 leading-tight">M. Recep Şentürk</h4>
            <p className="text-xs text-gray-500">Krokodilla FC • Kaptan</p>
            <div className="mt-1 flex gap-2 text-[11px] font-bold">
              <span className="text-green-600 bg-green-50 px-1.5 py-0.5 rounded">3 Gol</span>
              <span className="text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">1 Asist</span>
            </div>
          </div>
        </div>
      </div>

      {/* SPONSOR WIDGET */}
      <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 text-center">
        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-3">Ana Sponsor</span>
        <div className="h-24 bg-white rounded-lg flex items-center justify-center border border-gray-200 shadow-sm">
          <img src="/icons/logo.png" alt="Sponsor" className="h-12 opacity-20 grayscale" />
        </div>
      </div>

    </aside>
  );
}
