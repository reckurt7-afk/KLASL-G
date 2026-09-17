"use client";

import { useEffect, useRef, useState } from "react";
import { useCityStore } from "../store/cityStore";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";

export default function CityStoryBar() {
  const { selectedCityId, setSelectedCityId } = useCityStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [cities, setCities] = useState<any[]>([]);

  useEffect(() => {
    async function fetchCities() {
      const { data } = await supabase.from("cities").select("*").order("id", { ascending: true });
      if (data) {
          const sorted = [...data].filter(c => c.id !== 1 && c.name !== "PRİME LİG BURSA" && c.name !== "PRIME LIG BURSA");
          const indexKaracabey = sorted.findIndex(c => c.name && c.name.toLowerCase().includes("karacabey"));
          if (indexKaracabey > -1) {
             const itemKaracabey = sorted.splice(indexKaracabey, 1)[0];
             sorted.unshift(itemKaracabey);
          }
          const index8 = sorted.findIndex(c => c.id === 8);
          if (index8 > -1) {
             const item8 = sorted.splice(index8, 1)[0];
             sorted.splice(1, 0, item8);
          }
          setCities(sorted);
          if (!selectedCityId && sorted.length > 0) {
            setSelectedCityId(sorted[0].id);
          }
        }
    }
    fetchCities();
  }, []);

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === "right" ? 300 : -300, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full bg-white/50 backdrop-blur-xl border-b border-gray-100 py-6 relative z-30">
      <div className="max-w-[1440px] mx-auto relative px-4 md:px-6">
        {/* Navigation Arrows */}
        <button
          onClick={() => scroll("left")}
          className="hidden md:flex absolute left-2 lg:-left-4 top-[45%] -translate-y-1/2 z-20 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.05)] items-center justify-center text-gray-500 hover:bg-[#9e1b22] hover:text-white hover:border-[#9e1b22] hover:scale-110 transition-all duration-300"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={() => scroll("right")}
          className="hidden md:flex absolute right-2 lg:-right-4 top-[45%] -translate-y-1/2 z-20 w-10 h-10 bg-[#9e1b22] border border-[#9e1b22] rounded-full shadow-[0_4px_12px_rgba(158,27,34,0.3)] items-center justify-center text-white hover:bg-[#ceaa52] hover:border-[#ceaa52] hover:scale-110 transition-all duration-300"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Scrollable Container */}
        <div className="relative group/container">
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent z-10 md:hidden pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10 md:hidden pointer-events-none" />
          
          <div
            ref={scrollRef}
            className="flex gap-4 md:gap-5 overflow-x-auto hide-scrollbar snap-x snap-mandatory py-2"
            style={{ scrollbarWidth: "none" }}
          >
            <AnimatePresence>
              {cities.map((city, i) => {
                const isSelected = selectedCityId === city.id;
                const isAktif = city.status === 'AKTIF';
                
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: i * 0.05, type: "spring", stiffness: 400, damping: 25 }}
                    key={city.id}
                    className="flex flex-col items-center gap-3 snap-start shrink-0 group cursor-pointer"
                    onClick={() => setSelectedCityId(city.id)}
                  >
                    {/* League Card */}
                    <motion.div
                      whileHover={{ y: -4, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`relative w-[140px] h-[130px] md:w-[160px] md:h-[145px] rounded-[20px] flex flex-col items-center justify-center p-3 transition-all duration-300 ${
                        isSelected 
                          ? "bg-gradient-to-br from-[#9e1b22] to-[#b82029] shadow-[0_12px_24px_rgba(158,27,34,0.35)] border-0" 
                          : "bg-white border border-gray-100 shadow-[0_4px_15px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.08)] hover:border-[#ceaa52]/30"
                      }`}
                    >
                      {/* Active Indicator Pulse */}
                      {isSelected && (
                        <div className="absolute top-3 right-3 flex items-center justify-center">
                          <span className="absolute w-2.5 h-2.5 rounded-full bg-[#ceaa52] opacity-75 animate-ping" />
                          <span className="relative w-2.5 h-2.5 rounded-full bg-[#ceaa52]" />
                        </div>
                      )}

                      {/* Logo Container */}
                      <div className={`w-14 h-14 md:w-16 md:h-16 relative rounded-2xl flex items-center justify-center mb-1 transition-transform duration-300 group-hover:scale-110 ${
                        isSelected ? "bg-white shadow-inner p-1" : "bg-gray-50/50 p-1"
                      }`}>
                        <div className="w-full h-full relative rounded-[10px] overflow-hidden">
                          <Image src="/icons/prime-logo.jpg" alt={city.name} fill className="object-cover scale-110" />
                        </div>
                      </div>

                      {/* League Title */}
                      <span className={`text-[12px] md:text-[13px] font-black leading-tight text-center px-1 mt-2 line-clamp-2 ${
                        isSelected ? "text-white drop-shadow-md" : "text-gray-800 group-hover:text-[#9e1b22] transition-colors"
                      }`}>
                        {city.name}
                      </span>

                      {/* Status Badge */}
                      <div className={`mt-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] md:text-[10px] font-bold tracking-widest uppercase ${
                        isSelected 
                          ? "bg-black/20 text-[#ceaa52]" 
                          : isAktif ? "bg-green-50 text-green-600" : "bg-gray-50 text-gray-400"
                      }`}>
                        {isAktif && !isSelected && <CheckCircle2 className="w-3 h-3" />}
                        {isAktif ? 'AKTİF' : 'BEKLEMEDE'}
                      </div>
                    </motion.div>

                    {/* Favorite / Follow Button */}
                    <button 
                      className={`transition-colors duration-300 ${isSelected ? "text-[#ceaa52]" : "text-gray-300 hover:text-[#9e1b22]"}`}
                    >
                      <Heart className={`w-4 h-4 md:w-5 md:h-5 ${isSelected ? "fill-[#ceaa52]" : ""}`} strokeWidth={2.5} />
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
