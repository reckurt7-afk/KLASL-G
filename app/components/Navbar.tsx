"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Tv, Trophy, ClipboardList, Shield, Camera, Video, Megaphone, Clock, User, BarChart2 } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { useCityStore } from "@/app/store/cityStore";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { selectedCityId } = useCityStore();
  const [cities, setCities] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("cities").select("*").then(({data}) => { if(data) setCities(data); });
  }, []);

  const links = [
    { href: "/", label: "Ana Sayfa", icon: Home },
    { href: "/canli-yayin", label: "Canlı Yayın", icon: Tv },
    { href: "/istatistikler", label: "İstatistikler", icon: BarChart2 },
    { href: "/puan-durumu", label: "Puan Durumu", icon: Trophy },
    { href: "/esame-listesi", label: "Esame Listesi", icon: ClipboardList },
    { href: "/takimlar", label: "Takımlar", icon: Shield },
    { href: "/takim-kur", label: "Takım Kur", icon: Shield },
    { href: "/galeri", label: "Galeri", icon: Camera },
    { href: "/video-arsivi", label: "Videolar", icon: Video },
    { href: "/duyurular", label: "Duyurular", icon: Megaphone },
    { href: "/mac-saatleri", label: "Saatler", icon: Clock },
    { href: user ? "/hesabim" : "/giris", label: user ? "Hesabım" : "Giriş", icon: User },
  ];

  return (
    <>
      <header className="fixed top-[32px] left-0 right-0 z-[9999] bg-[#070707]/85 backdrop-blur-2xl border-b border-[#d4af37]/20 shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
        <div className="max-w-[1600px] mx-auto px-4">
          <div className="flex items-center justify-between h-[75px]">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-5 group">
              <div className="relative w-[70px] h-[70px] rounded-full overflow-hidden border-2 border-transparent group-hover:border-[#d4af37] transition-all duration-300 shadow-[0_0_15px_rgba(212,175,55,0)] group-hover:shadow-[0_0_15px_rgba(212,175,55,0.5)]">
                <Image src="/icons/prolig-logo-final.jpg" alt="Logo" fill className="rounded-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-[#cc0000] tracking-widest leading-none group-hover:text-[#d4af37] transition-colors duration-300">PRO <span className="text-black">LİG</span></span>
                <span className="text-[11px] text-[#d4af37] font-bold tracking-[0.3em] uppercase">{cities.find(c => c.id === selectedCityId)?.name || "LİG"}</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-2">
              {links.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link key={link.href} href={link.href}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-3 py-2 rounded-xl text-[13px] font-bold transition-all duration-300 flex items-center gap-1.5
                        ${isActive
                          ? "bg-gradient-to-r from-[#d4af37] to-[#8c7324] text-gray-900 shadow-[0_4px_15px_rgba(212,175,55,0.4)]"
                          : "text-gray-300 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      <Icon size={16} className={isActive ? "text-gray-900" : "text-[#d4af37]"} />
                      <span>{link.label}</span>
                    </motion.div>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-[44px] left-0 right-0 bg-[#070707]/90 backdrop-blur-2xl border-t border-[#d4af37]/20 pb-safe z-[9999] shadow-[0_-10px_40px_rgba(0,0,0,0.9)]">
        <div className="flex overflow-x-auto gap-2 p-2 hide-scrollbar snap-x snap-mandatory">
          {links.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link key={link.href} href={link.href} className="snap-center">
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className={`flex-shrink-0 flex flex-col items-center justify-center w-[72px] h-[72px] rounded-2xl text-[10px] font-bold transition-all duration-300
                    ${isActive
                      ? "bg-[#d4af37]/10 border border-[#d4af37]/50 text-gray-900 shadow-[inset_0_4px_10px_rgba(212,175,55,0.2)]"
                      : "text-gray-500 border border-transparent hover:bg-white/5 hover:text-gray-900"
                  }`}
                >
                  <Icon 
                    size={24} 
                    strokeWidth={isActive ? 2.5 : 2} 
                    className={`mb-1 transition-colors ${isActive ? "text-[#d4af37] drop-shadow-[0_2px_5px_rgba(212,175,55,0.8)]" : "text-gray-500"}`} 
                  />
                  <span className="truncate w-full text-center px-0.5">
                    {link.label}
                  </span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Spacer */}
      <div className="h-[75px]" />
    </>
  );
}