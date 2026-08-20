"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function SplashScreen() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen flex flex-col bg-black text-white overflow-hidden">
      {/* Arkaplan Görseli */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/icons/logo.png" // using logo for bg for now or a solid color gradient
          alt="Background"
          fill
          className="object-cover opacity-20 blur-sm scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#ff0000]/20 mix-blend-overlay"></div>
      </div>

      {/* Üst Logo Bar (Navbar yedeği) */}
      <header className="relative z-10 w-full flex items-center justify-between px-6 py-4 bg-white">
         <div className="flex items-center gap-2">
            <Image src="/icons/logo.png" width={40} height={40} alt="Logo" />
            <span className="text-black font-black text-xl tracking-tighter">KLAS LİG</span>
         </div>
         <div className="flex gap-2">
            <button className="bg-red-600 text-white font-bold text-xs px-4 py-2 rounded-lg">Giriş Yap</button>
            <button className="bg-red-600 text-white font-bold text-xs px-4 py-2 rounded-lg">Üye Ol</button>
         </div>
      </header>

      {/* Ana İçerik */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-8">
        
        {/* Ortadaki Dev Logo */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-white rounded-full p-4 sm:p-8 shadow-[0_0_80px_rgba(255,49,49,0.5)] mb-8"
        >
          <Image src="/icons/logo.png" width={180} height={180} alt="Klas Lig Merkez Logo" className="object-contain" />
        </motion.div>

        <h1 className="text-2xl sm:text-4xl text-center font-medium mb-12">
          Halı saha futbolunun <span className="font-black text-red-600">en kapsamlı platformu</span> ile sahaya çık!
        </h1>

        {/* İstatistik Rozetleri */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
           <div className="border border-white/20 bg-black/40 backdrop-blur-sm rounded-full px-6 py-2 flex items-center gap-2">
              📍 <span className="font-bold">14 Şehir</span>
           </div>
           <div className="border border-white/20 bg-black/40 backdrop-blur-sm rounded-full px-6 py-2 flex items-center gap-2">
              👤 <span className="font-bold">8.500+ Oyuncu</span>
           </div>
           <div className="border border-white/20 bg-black/40 backdrop-blur-sm rounded-full px-6 py-2 flex items-center gap-2">
              🏆 <span className="font-bold">400+ Takım</span>
           </div>
        </div>

        {/* Aksiyon Butonları */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg justify-center">
           <Link href="/lig" className="flex-1 bg-red-600 hover:bg-red-700 text-white font-black text-center py-4 rounded-xl shadow-lg transition-transform hover:scale-105">
             Keşfet
           </Link>
           <button className="flex-1 border-2 border-white/30 hover:border-white text-white font-bold text-center py-4 rounded-xl transition-colors">
             Misafir Girişi 👥
           </button>
        </div>
      </main>
    </div>
  );
}
