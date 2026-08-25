"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { motion } from "framer-motion";

export default function CalismaEkibiPage() {
  const [ekip, setEkip] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getir() {
      const { data } = await supabase.from("calisma_ekibi").select("*").order("sira", { ascending: true });
      setEkip(data || []);
      setLoading(false);
    }
    getir();
  }, []);

  const StaffCard = ({ role, person, delay, isTop }: { role: string, person: any, delay: number, isTop?: boolean }) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`flex flex-col items-center bg-white rounded-2xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border ${isTop ? 'border-[#ff3131]/30 shadow-[#ff3131]/10' : 'border-gray-100'} relative w-full h-full group hover:-translate-y-1 transition-all duration-300`}
    >
      {/* Kırmızı vurgu şeridi */}
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 h-1.5 w-1/3 rounded-b-md ${isTop ? 'bg-[#ff3131]' : 'bg-gray-300 group-hover:bg-[#ff3131] transition-colors'}`}></div>

      {/* Avatar */}
      <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full p-1 mb-4 relative overflow-hidden bg-white shadow-inner mt-2 ${isTop ? 'border-2 border-[#ff3131]' : 'border border-gray-200'}`}>
        <div className="w-full h-full rounded-full overflow-hidden relative bg-gray-50 flex items-center justify-center">
          {person?.foto_url ? (
            <Image src={person.foto_url} alt={person.ad_soyad} fill className="object-cover" />
          ) : (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-300"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          )}
        </div>
      </div>

      {/* İsim ve Görev */}
      <div className="text-center w-full flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-sm md:text-base font-black text-gray-900 uppercase tracking-tight mb-1 truncate px-1">
            {person?.ad_soyad || ""}
          </h3>
          <div className="text-[11px] md:text-xs font-bold text-[#ff3131] uppercase tracking-wider line-clamp-2">
            {role}
          </div>
        </div>

        {person?.instagram && (
          <a href={`https://instagram.com/${person.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-[10px] md:text-xs font-bold text-gray-400 hover:text-[#ff3131] transition-colors bg-gray-50 px-3 py-1.5 rounded-full">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            {person.instagram}
          </a>
        )}
      </div>
    </motion.div>
  );

  const ortaklar = ekip.filter(k => k.sira === 1 || k.gorev.toLowerCase().includes("ortak") || k.gorev.toLowerCase().includes("kurucu") || k.gorev.toLowerCase().includes("başkan"));
  const diger = ekip.filter(k => !(k.sira === 1 || k.gorev.toLowerCase().includes("ortak") || k.gorev.toLowerCase().includes("kurucu") || k.gorev.toLowerCase().includes("başkan")));

  return (
    <div className="min-h-screen bg-[#f8f9fa] pt-8 pb-20 relative overflow-hidden font-sans">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 relative z-10">
        
        {/* HEADER */}
        <div className="text-center mb-12 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <svg className="w-12 h-12 md:w-14 md:h-14 mx-auto text-[#ff3131] mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 uppercase tracking-tight mb-2">
            KLAS LİG <span className="text-[#ff3131]">EKİBİ</span>
          </h1>
          <p className="text-gray-500 font-medium text-sm md:text-base max-w-2xl mx-auto">
            Klas Lig'in arkasındaki profesyonel organizasyon kadrosu
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-[#ff3131]/20 border-t-[#ff3131] rounded-full animate-spin"></div></div>
        ) : ekip.length === 0 ? (
          <div className="text-center text-gray-500 py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
            Henüz ekip üyesi eklenmemiş.
          </div>
        ) : (
          <div className="flex flex-col items-center">
            
            {/* YÖNETİM SECTION */}
            {ortaklar.length > 0 && (
              <div className="w-full flex flex-col items-center relative mb-12">
                <div className="bg-[#ff3131] text-white px-8 py-2 rounded-full font-black text-xs md:text-sm tracking-widest z-10 shadow-lg mb-8 uppercase">
                  Yönetim Kurulu
                </div>
                
                <div className="flex flex-wrap justify-center gap-4 md:gap-8 w-full max-w-4xl relative z-10">
                  {ortaklar.map((kisi, idx) => (
                    <div key={kisi.id} className="w-[140px] md:w-[180px]">
                      <StaffCard role={kisi.gorev} person={kisi} delay={0.1 * idx} isTop={true} />
                    </div>
                  ))}
                </div>

                {/* Bağlantı Çizgisi (Dikey) */}
                {diger.length > 0 && (
                  <div className="w-px h-12 bg-gray-300 mt-4"></div>
                )}
              </div>
            )}

            {/* ÇALIŞMA EKİBİ SECTION */}
            {diger.length > 0 && (
              <div className="w-full flex flex-col items-center relative">
                <div className="bg-gray-800 text-white px-8 py-2 rounded-full font-black text-xs md:text-sm tracking-widest z-10 shadow-md mb-8 uppercase">
                  Operasyon & Saha Ekibi
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 w-full relative z-10">
                  {diger.map((kisi, idx) => (
                    <StaffCard key={kisi.id} role={kisi.gorev} person={kisi} delay={0.2 + (idx * 0.05)} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
