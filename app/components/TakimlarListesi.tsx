"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { publicFetch } from "@/lib/supabase";
import { useCityStore } from "@/app/store/cityStore";
import { motion } from "framer-motion";

export default function TakimlarListesi() {
  const { selectedCityId } = useCityStore();
  const [loading, setLoading] = useState(true);
  const [takimlar, setTakimlar] = useState<any[]>([]);

  useEffect(() => {
    async function getir() {
      const data = await publicFetch("teams", "select=id,name,logo&order=name.asc");
      if (data.length > 0) setTakimlar(data);
      setLoading(false);
    }
    getir();
  }, [selectedCityId]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-12">
        <h2 className="section-title">👥 TAKIMLAR</h2>
        <p className="section-sub mt-2 tracking-[0.3em] font-bold text-[#ff3131]">KLAS LİG MÜCADELECİLERİ</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div key={idx} className="card p-4 md:p-6 flex flex-col items-center">
              <div className="skeleton w-[60px] h-[60px] md:w-[100px] md:h-[100px] rounded-full mb-4"></div>
              <div className="skeleton h-6 w-3/4 mb-4"></div>
            </div>
          ))}
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {takimlar.map((takim) => {
            const slug = takim.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '');
            return (
              <motion.div variants={itemVariants} key={takim.id}>
                <Link href={`/takim/${slug}`} className="group block h-full">
                  <div className="card h-full p-4 md:p-6 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2 hover:border-[#ff3131]/50 hover:shadow-[0_15px_30px_rgba(255,49,49,0.15)] relative overflow-hidden bg-[#111]">
                    <div className="absolute inset-0 bg-gradient-to-b from-[#ff3131]/0 to-[#ff3131]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                    <div className="relative w-[60px] h-[60px] md:w-[100px] md:h-[100px] mb-4 group-hover:scale-110 transition-transform duration-500">
                      <Image src={takim.logo || '/logos/default.png'} alt={takim.name} fill className="object-contain drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)]" />
                    </div>

                    <div className="text-white text-sm md:text-xl font-black uppercase tracking-wide group-hover:text-[#ff3131] transition-colors mt-2 line-clamp-2">
                      {takim.name}
                    </div>
                    
                    <div className="w-8 h-1 bg-gradient-to-r from-transparent via-[#ff3131]/50 to-transparent my-3"></div>
                    
                    <div className="mt-auto w-full bg-black/40 rounded-xl py-2 flex items-center justify-center border border-white/5 group-hover:border-[#ff3131]/20">
                      <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider group-hover:text-white transition-colors">Kadroyu Gör ➔</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
