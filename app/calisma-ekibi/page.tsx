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

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white pt-28 pb-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-[#ff3131] uppercase tracking-tighter mb-4" style={{ textShadow: "0 0 40px rgba(255,49,49,0.3)" }}>
            ÇALIŞMA EKİBİ
          </h1>
          <p className="text-gray-400 font-medium text-lg max-w-2xl mx-auto">
            Klas Lig'in kusursuz işlemesini sağlayan, sahanın içi ve dışındaki profesyonel ekibimiz.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center"><div className="w-12 h-12 border-4 border-[#ff3131]/20 border-t-[#ff3131] rounded-full animate-spin"></div></div>
        ) : ekip.length === 0 ? (
          <div className="text-center text-gray-500 py-12 bg-[#121212] rounded-2xl border border-white/5">
            Ekip bilgileri yakında eklenecektir.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {ekip.map((kisi, index) => (
              <motion.div 
                key={kisi.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-[#121212] border border-white/10 rounded-3xl p-6 flex flex-col items-center text-center group hover:border-[#ff3131]/50 hover:shadow-[0_10px_30px_rgba(255,49,49,0.15)] transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-[#ff3131]/0 to-[#ff3131]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[#1a1a1a] group-hover:border-[#ff3131]/30 overflow-hidden relative mb-5 shadow-2xl transition-colors duration-300 bg-black">
                  {kisi.foto_url ? (
                    <Image src={kisi.foto_url} alt={kisi.ad_soyad} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-900 text-gray-600">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    </div>
                  )}
                </div>

                <h3 className="text-xl font-black text-white mb-1 group-hover:text-[#ff3131] transition-colors">{kisi.ad_soyad}</h3>
                <div className="text-sm font-bold text-gray-400 bg-white/5 px-4 py-1.5 rounded-full mb-4">
                  {kisi.gorev}
                </div>

                {kisi.instagram && (
                  <a href={`https://instagram.com/${kisi.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="mt-auto text-[#ff3131] hover:text-white transition-colors flex items-center gap-2 text-sm font-medium">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                    {kisi.instagram}
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
