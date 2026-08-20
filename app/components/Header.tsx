"use client";

import { useAuth } from "@/lib/AuthContext";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const { user, loading, profil } = useAuth();

  return (
    <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-[1600px] mx-auto px-4 h-[70px] flex items-center justify-between">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image src="/icons/logo.png" width={40} height={40} alt="Klas Lig" className="object-contain drop-shadow-sm" />
          <span className="font-black text-xl tracking-tight text-gray-900">KLAS LİG</span>
        </Link>

        {/* Right: TV, Search, Profile */}
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2 text-red-600 font-bold text-sm cursor-pointer hover:text-red-700 transition-colors">
            <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
            Klas Lig TV
          </div>
          
          <button className="text-gray-500 hover:text-gray-900 text-xl">
            🔍
          </button>

          {loading ? (
            <div className="w-10 h-10 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          ) : user ? (
            <Link href="/profil" className="flex items-center gap-3 pl-4 border-l border-gray-200">
              {profil?.avatar_url ? (
                <img src={profil.avatar_url} alt={profil.ad_soyad} className="w-10 h-10 rounded-full object-cover shadow-md" />
              ) : (
                <div className="w-10 h-10 bg-[#e60000] text-white rounded-full flex items-center justify-center font-bold shadow-md uppercase">
                  {(profil?.ad_soyad || user.email || "K")[0]}
                </div>
              )}
              <div className="hidden md:flex flex-col">
                <span className="text-sm font-bold text-gray-900 leading-tight line-clamp-1">{profil?.ad_soyad || "Kullanıcı"}</span>
                <span className="text-[10px] text-gray-500">Hesabım</span>
              </div>
            </Link>
          ) : (
            <Link href="/giris" className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="w-10 h-10 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center font-bold shadow-sm">
                M
              </div>
              <div className="hidden md:flex flex-col">
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
