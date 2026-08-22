"use client";

import { useCityStore } from "@/app/store/cityStore";
import Link from "next/link";
import { ChevronDown, Search, Bell, User } from "lucide-react";

export default function Header() {
  const { selectedCityId, setSelectedCityId } = useCityStore();
  
  const cities = [
    { id: 1, name: "BURSA" },
    { id: 2, name: "İSTANBUL" },
    { id: 3, name: "İZMİR" },
    { id: 4, name: "ANKARA" },
  ];

  const activeCity = cities.find(c => c.id === selectedCityId) || cities[0];

  return (
    <header className="sticky top-0 z-50 w-full h-[72px] bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-4 lg:px-8">
      {/* LEFT: Logo & City Switcher */}
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2">
          <img src="/icons/logo.png" alt="Klas Lig Logo" className="w-10 h-10 object-contain" />
          <span className="font-black text-xl tracking-tight hidden sm:block">
            KLAS <span className="text-[#e50914]">LİG</span>
          </span>
        </Link>
        
        {/* City Switcher */}
        <div className="relative group cursor-pointer border border-gray-200 rounded-lg px-3 py-1.5 flex items-center gap-2 hover:bg-gray-50 transition-colors">
          <span className="text-sm font-bold text-gray-700">{activeCity.name}</span>
          <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-transform group-hover:rotate-180" />
          
          {/* Dropdown */}
          <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden">
            {cities.map(city => (
              <button
                key={city.id}
                onClick={() => setSelectedCityId(city.id)}
                className={`w-full text-left px-4 py-3 text-sm font-semibold transition-colors hover:bg-gray-50 ${selectedCityId === city.id ? 'text-[#e50914] bg-red-50/50' : 'text-gray-600'}`}
              >
                {city.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT: Actions */}
      <div className="flex items-center gap-4 text-gray-500">
        <Link href="/klas-lig-tv" className="hidden md:flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide hover:text-[#e50914] transition-colors">
          <span className="w-2 h-2 rounded-full bg-[#e50914] animate-pulse"></span>
          Klas Lig TV
        </Link>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <Search className="w-5 h-5" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
        <Link href="/profil" className="ml-2 w-9 h-9 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center hover:bg-gray-200 transition-colors">
          <User className="w-5 h-5 text-gray-600" />
        </Link>
      </div>
    </header>
  );
}
