"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useCityStore } from "@/app/store/cityStore";
import { motion } from "framer-motion";

export default function Topbar() {
  const [cities, setCities] = useState<any[]>([]);
  const { selectedCityId, setSelectedCityId } = useCityStore();

  useEffect(() => {
    async function loadCities() {
      const { data } = await supabase.from("cities").select("*").order("id");
      if (data) setCities(data);
    }
    loadCities();
  }, []);

  if (cities.length === 0) return null;

  return (
    <div className="bg-[#000] border-b border-[#ceaa52]/20 text-[10px] sm:text-xs font-bold text-gray-500 overflow-x-auto hide-scrollbar z-[10000] fixed top-0 w-full flex items-center shadow-lg">
      <div className="max-w-[1600px] mx-auto px-4 w-full flex items-center gap-1 sm:gap-2 py-1.5 whitespace-nowrap">
        <span className="text-[#ceaa52] tracking-widest uppercase mr-2 sm:mr-4 flex items-center gap-1">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ceaa52] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ceaa52]"></span>
          </span>
          SEHIR SECIMI:
        </span>
        
        {cities.map(c => (
          <button 
            key={c.id} 
            onClick={() => setSelectedCityId(c.id)}
            className={`px-3 sm:px-4 py-1 rounded-full uppercase tracking-wider transition-all duration-300 ${selectedCityId === c.id ? 'bg-[#ceaa52] text-gray-900 shadow-[0_0_10px_rgba(212,175,55,0.5)]' : 'hover:bg-gray-100 hover:text-gray-900'}`}
          >
            {c.name}
          </button>
        ))}
      </div>
    </div>
  );
}
