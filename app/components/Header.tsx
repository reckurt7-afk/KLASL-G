"use client";

import { useAuth } from "@/lib/AuthContext";
import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

export default function Header() {
  const { user, loading, profil, cikisYap } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-[1600px] mx-auto px-4 h-[70px] flex items-center justify-between relative">
        {/* Left: Logo */}
        <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex items-center gap-5 z-10">
          <Image src="/icons/prolig-logo-final.jpg" width={60} height={60} alt="Pro Lig" className="object-cover drop-shadow-sm rounded-full border border-gray-200 aspect-square" />
          <span className="font-black text-xl tracking-tight text-[#cc0000] text-3xl tracking-tighter">PRO <span className="text-black">LİG</span></span>
        </Link>

        {/* Right: TV, Search, Profile */}
        <div className="flex items-center gap-6">
          <Link href="/canli-yayin" className="hidden md:flex items-center gap-2 text-[#d4af37] font-bold text-sm cursor-pointer hover:text-[#b5952f] transition-colors">
            <span className="w-2 h-2 bg-[#d4af37] rounded-full animate-pulse"></span>
            Pro Lig TV
          </Link>
          
          <button className="text-gray-500 hover:text-gray-900 text-xl">
            🔍
          </button>

          {loading ? (
            <div className="w-10 h-10 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin"></div>
          ) : user ? (
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 pl-4 border-l border-gray-200 focus:outline-none"
              >
                {profil?.avatar_url ? (
                  <img src={profil.avatar_url} alt={profil.ad_soyad} className="w-10 h-10 rounded-full object-cover shadow-md" />
                ) : (
                  <div className="w-10 h-10 bg-[#1e3a8a] text-white rounded-full flex items-center justify-center font-bold shadow-md uppercase">
                    {(profil?.ad_soyad || user.email || "K")[0]}
                  </div>
                )}
                <div className="hidden md:flex flex-col text-left">
                  <span className="text-sm font-bold text-gray-900 leading-tight line-clamp-1">{profil?.ad_soyad || "Kullanıcı"}</span>
                  <span className="text-[10px] text-gray-500">Hesabım</span>
                </div>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-[#1e3a8a] text-white rounded-xl shadow-xl overflow-hidden py-2 flex flex-col z-50">
                  <div className="px-4 pb-3 pt-2 mb-2 border-b border-[#eab308]/50 flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold uppercase shrink-0">
                      {(profil?.ad_soyad || user.email || "K")[0]}
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <span className="font-bold text-[13px] truncate">{profil?.ad_soyad || "Kullanıcı"}</span>
                      <span className="text-[10px] text-red-100 truncate">{user.email}</span>
                    </div>
                  </div>
                  <Link 
                    href="/profil" 
                    onClick={() => setDropdownOpen(false)}
                    className="px-4 py-2 text-[13px] font-bold hover:bg-white/10 transition-colors mx-2 rounded-lg"
                  >
                    Bilgilerimi Güncelle
                  </Link>
                  <button 
                    onClick={() => { setDropdownOpen(false); cikisYap(); }}
                    className="px-4 py-2 text-[13px] font-bold hover:bg-white/10 transition-colors mx-2 rounded-lg flex items-center gap-2 text-left"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                    Çıkış Yap
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/giris" className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="w-10 h-10 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center font-bold shadow-sm">
                M
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-sm font-bold text-gray-900 leading-tight">Misafir</span>
                <span className="text-[10px] text-gray-500">Giriş Yap</span>
              </div>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
