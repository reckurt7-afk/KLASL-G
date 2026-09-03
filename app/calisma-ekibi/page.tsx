"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="flex flex-col items-center w-[160px] md:w-[220px] mx-3 md:mx-4 mb-10 group"
    >
      {/* NİZAMİ RESİM KUTUSU */}
      <div 
        className="w-full aspect-[3/4] bg-gray-100 rounded-2xl overflow-hidden shadow-md border border-gray-200 mb-4 cursor-pointer relative group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300"
        onClick={() => person?.foto_url && setSelectedImage(person.foto_url)}
      >
        {person?.foto_url ? (
          <img 
            src={person.foto_url} 
            alt={person.ad_soyad} 
            className="w-full h-full object-cover object-top" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
        )}
        
        {/* Büyütme İkonu */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
        </div>
      </div>

      {/* İSİM VE GÖREV */}
      <div className="text-center w-full px-2">
        <h3 className="text-gray-900 font-black text-sm md:text-base uppercase tracking-tight truncate">
          {person?.ad_soyad}
        </h3>
        <div className="text-[#ceaa52] font-bold text-xs md:text-sm tracking-wider uppercase mt-1">
          {person?.gorev}
        </div>
        
        {person?.instagram && (
          <a href={`https://instagram.com/${person.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-gray-900 px-3 py-1.5 rounded-full text-[10px] md:text-xs font-medium transition-colors border border-gray-200">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            {person.instagram}
          </a>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="w-full font-sans pb-10">
      
      {/* IMAGE MODAL */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 cursor-pointer"
          >
            <button 
              className="absolute top-6 right-6 text-white hover:text-[#ceaa52] transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <motion.img 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={selectedImage} 
              alt="Büyük Görsel" 
              className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)]"
              onClick={(e) => e.stopPropagation()} 
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full">
        
        {/* HEADER SECTION */}
        <div className="text-center mb-16 pt-8 md:pt-12">
          <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-black to-gray-800 uppercase tracking-tighter drop-shadow-lg mb-3">
            PRİME LİG BURSA
          </h2>
          <p className="text-xl md:text-3xl tracking-[0.3em] font-black text-[#ceaa52] uppercase drop-shadow-md">
            ÇALIŞMA EKİBİ
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-[#ceaa52]/20 border-t-[#ceaa52] rounded-full animate-spin"></div></div>
        ) : ekip.length === 0 ? (
          <div className="text-center text-gray-500 py-12 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-xl mx-auto">
            Henüz teknik ekip üyesi eklenmemiş.
          </div>
        ) : (
          <div className="flex flex-col items-center w-full">
            {Object.keys(groupedEkip).sort((a, b) => Number(a) - Number(b)).map((siraKey: string, rowIdx: number) => (
              <div key={siraKey} className="flex flex-wrap justify-center w-full mb-2">
                {groupedEkip[Number(siraKey)].map((kisi: any, idx: number) => (
                  <PersonCard key={kisi.id} person={kisi} delay={(rowIdx * 0.1) + (idx * 0.1)} />
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
