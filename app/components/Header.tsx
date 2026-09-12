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
    <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-[1600px] mx-auto px-4 h-[64px] flex items-center justify-between">

        {/* Left: Empty space for balance on mobile */}
        <div className="w-[44px] md:w-[160px]">
          <Link href="/canli-yayin" className="hidden md:flex items-center gap-2 text-[#9e1b22] font-bold text-sm hover:opacity-80 transition-opacity">
            <span className="w-2 h-2 bg-[#9e1b22] rounded-full animate-pulse" />
            Prime Lig TV
          </Link>
        </div>

        {/* Center: Logo + Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-[44px] h-[44px] shrink-0">
            <Image
              src="/icons/prime-logo.jpg"
              alt="Prime Lig Logo"
              fill
              className="rounded-full object-cover scale-[1.05] bg-white border-2 border-[#ceaa52] shadow-md group-hover:shadow-[0_0_12px_rgba(206,170,82,0.5)] transition-shadow duration-300"
            />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-black text-[22px] md:text-[26px] tracking-tight text-[#ceaa52] leading-none">
              PRIME <span className="text-[#9e1b22]">LİG</span>
            </span>
            <span className="text-[9px] text-gray-400 font-semibold tracking-[0.2em] uppercase hidden sm:block">
              Resmi Platform
            </span>
          </div>
        </Link>

        {/* Right: Profile */}
        <div className="flex items-center gap-3 md:gap-4">
          {loading ? (
            <div className="w-9 h-9 border-2 border-[#ceaa52] border-t-transparent rounded-full animate-spin" />
          ) : user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 focus:outline-none"
              >
                {profil?.avatar_url ? (
                  <img src={profil.avatar_url} alt={profil.ad_soyad} className="w-9 h-9 rounded-full object-cover shadow border-2 border-[#ceaa52]" />
                ) : (
                  <div className="w-9 h-9 bg-gradient-to-br from-[#ceaa52] to-[#9e1b22] text-white rounded-full flex items-center justify-center font-black text-sm shadow-md uppercase">
                    {(profil?.ad_soyad || user.email || "K")[0]}
                  </div>
                )}
                <div className="hidden md:flex flex-col text-left">
                  <span className="text-[13px] font-bold text-gray-900 leading-tight line-clamp-1">{profil?.ad_soyad || "Kullanıcı"}</span>
                  <span className="text-[10px] text-gray-400">Hesabım</span>
                </div>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden py-2 flex flex-col z-50">
                  <div className="px-4 pb-3 pt-2 mb-1 border-b border-gray-100 flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-[#ceaa52] to-[#9e1b22] rounded-full flex items-center justify-center font-bold text-white uppercase text-sm shrink-0">
                      {(profil?.ad_soyad || user.email || "K")[0]}
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <span className="font-bold text-[13px] text-gray-900 truncate">{profil?.ad_soyad || "Kullanıcı"}</span>
                      <span className="text-[10px] text-gray-400 truncate">{user.email}</span>
                    </div>
                  </div>
                  <Link
                    href="/profil"
                    onClick={() => setDropdownOpen(false)}
                    className="px-4 py-2.5 text-[13px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                    Bilgilerimi Güncelle
                  </Link>
                  <button
                    onClick={() => { setDropdownOpen(false); cikisYap(); }}
                    className="px-4 py-2.5 text-[13px] font-semibold text-[#9e1b22] hover:bg-red-50 transition-colors flex items-center gap-2 text-left"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                    Çıkış Yap
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/giris" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gray-100 text-gray-500 rounded-full flex items-center justify-center font-bold text-sm">
                👤
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-[13px] font-bold text-gray-900 leading-tight">Misafir</span>
                <span className="text-[10px] text-gray-400">Giriş Yap</span>
              </div>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
