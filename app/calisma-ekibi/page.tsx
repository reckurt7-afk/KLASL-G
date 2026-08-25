"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function CalismaEkibiPage() {
  const [ekip, setEkip] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    async function getir() {
      const { data } = await supabase.from("calisma_ekibi").select("*").order("sira", { ascending: true });
      setEkip(data || []);
      setLoading(false);
    }
    getir();
  }, []);

  // Gruplama mantığı: Aynı 'sira' numarasına sahip olanları aynı satırda gösterir
  const groupedEkip = ekip.reduce((acc, kisi) => {
    const sira = kisi.sira || 99;
    if (!acc[sira]) acc[sira] = [];
    acc[sira].push(kisi);
    return acc;
  }, {} as Record<number, any[]>);

  const PersonCard = ({ person, delay }: { person: any, delay: number }) => (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="flex flex-col items-center group relative z-10 mx-2 md:mx-4 mb-8"
    >
      {/* Cutout Photo Area */}
      <div 
        className="w-32 h-40 md:w-48 md:h-56 relative flex items-end justify-center mb-2 overflow-visible cursor-pointer"
        onClick={() => person?.foto_url && setSelectedImage(person.foto_url)}
      >
        {person?.foto_url ? (
          <img 
            src={person.foto_url} 
            alt={person.ad_soyad} 
            className="max-w-full max-h-full object-contain object-bottom drop-shadow-[0_10px_15px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform duration-500" 
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-black/20 flex items-center justify-center text-white/50 mb-4 border border-white/10">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
        )}
      </div>

      {/* Name and Role */}
      <div className="text-center flex flex-col items-center">
        <h3 className="text-white font-black text-sm md:text-base uppercase tracking-wider mb-0.5" style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}>
          {person?.ad_soyad}
        </h3>
        <div 
          className="text-[#2563eb] font-black italic text-lg md:text-xl tracking-tight uppercase"
          style={{ 
            textShadow: "2px 2px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff, 0px 3px 10px rgba(0,0,0,0.8)",
            fontFamily: "'Impact', 'Arial Black', sans-serif"
          }}
        >
          {person?.gorev}
        </div>
        
        {person?.instagram && (
          <a href={`https://instagram.com/${person.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="mt-2 text-white/70 hover:text-white text-[10px] md:text-xs flex items-center gap-1 bg-black/20 px-2 py-1 rounded-full backdrop-blur-sm transition-colors">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            {person.instagram}
          </a>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen pt-20 pb-20 relative overflow-hidden font-sans">
      
      {/* IMAGE MODAL */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 cursor-pointer backdrop-blur-sm"
          >
            <button 
              className="absolute top-6 right-6 text-white hover:text-[#ff3131] transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <motion.img 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              src={selectedImage} 
              alt="Büyük Görsel" 
              className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()} // Resme tıklayınca kapanmayı engellemek için
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* DEEP RED GRADIENT BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#d40000] via-[#990000] to-[#4d0000] z-0"></div>
      
      {/* SUBTLE WAVE OVERLAY (Optional texturing) */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent z-0 mix-blend-overlay"></div>
      
      <div className="max-w-[1200px] mx-auto px-4 relative z-10">
        
        {/* HEADER SECTION */}
        <div className="text-center mb-16 pt-8 relative">
          <h1 
            className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter"
            style={{ fontFamily: "'Impact', 'Arial Black', sans-serif", transform: "scaleY(1.2)" }}
          >
            KLAS LİG BURSA
          </h1>
          <h2 
            className="text-2xl md:text-4xl font-black text-white uppercase mt-2"
            style={{ fontFamily: "'Impact', 'Arial Black', sans-serif" }}
          >
            TEKNİK EKİP
          </h2>
          
          {/* Decorative Logos (Hidden on mobile for better spacing) */}
          <div className="hidden md:block absolute top-4 left-10 w-32 h-32 opacity-80">
            <Image src="/logo.png" alt="Klas Lig Logo" fill className="object-contain drop-shadow-2xl" />
          </div>
          <div className="hidden md:block absolute top-4 right-10 w-32 h-32 opacity-80">
            <Image src="/logo.png" alt="Klas Lig Logo" fill className="object-contain drop-shadow-2xl" />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div></div>
        ) : ekip.length === 0 ? (
          <div className="text-center text-white/70 py-12 bg-black/20 backdrop-blur-md rounded-2xl border border-white/10 max-w-xl mx-auto">
            Henüz teknik ekip üyesi eklenmemiş.
          </div>
        ) : (
          <div className="flex flex-col items-center w-full mt-4">
            {Object.keys(groupedEkip).sort((a, b) => Number(a) - Number(b)).map((siraKey: string, rowIdx: number) => (
              <div key={siraKey} className="flex flex-wrap justify-center w-full mb-4">
                {groupedEkip[Number(siraKey)].map((kisi: any, idx: number) => (
                  <PersonCard key={kisi.id} person={kisi} delay={(rowIdx * 0.2) + (idx * 0.1)} />
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
