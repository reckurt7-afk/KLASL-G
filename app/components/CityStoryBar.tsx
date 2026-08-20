"use client";

import { useCityStore } from "../store/cityStore";

const MOCK_CITIES = [
  { id: 1, name: "İstanbul", teams: 18, players: 419, active: true },
  { id: 2, name: "Bursa", teams: 21, players: 279, active: false },
  { id: 3, name: "İzmir", teams: 14, players: 147, active: false },
  { id: 4, name: "Antalya", teams: 22, players: 321, active: false },
  { id: 5, name: "Ankara", teams: 45, players: 880, active: false },
  { id: 6, name: "Gaziantep", teams: 34, players: 413, active: false },
  { id: 7, name: "Mersin", teams: 110, players: 1617, active: false },
  { id: 8, name: "Kocaeli", teams: 37, players: 590, active: false },
  { id: 9, name: "Trabzon", teams: 85, players: 1006, active: false },
  { id: 10, name: "Samsun", teams: 28, players: 512, active: false },
];

export default function CityStoryBar() {
  const { selectedCityId, setSelectedCityId } = useCityStore();

  return (
    <div className="w-full bg-white border-b border-gray-100 py-6 overflow-hidden relative">
      <div className="max-w-[1600px] mx-auto px-4">
        
        {/* Nav Buttons (Mock for visual) */}
        <button className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm z-10 text-gray-400">
          {'<'}
        </button>
        <button className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center shadow-md z-10 text-white font-bold">
          {'>'}
        </button>

        <div className="flex gap-4 overflow-x-auto hide-scrollbar px-8 snap-x">
          {MOCK_CITIES.map((city) => {
            const isSelected = selectedCityId === city.id;
            // The screenshot shows a square shape with rounded corners, a border, and a small heart below
            return (
              <div key={city.id} className="flex flex-col items-center gap-2 snap-center shrink-0 cursor-pointer group" onClick={() => setSelectedCityId(city.id)}>
                <div className={`w-[110px] h-[90px] rounded-2xl flex flex-col items-center justify-center transition-all ${isSelected ? 'border-2 border-indigo-600 bg-indigo-50 shadow-sm' : 'border border-gray-200 bg-white hover:border-gray-300'}`}>
                   {/* Mini Logo */}
                   <div className="w-8 h-8 mb-2 opacity-80 group-hover:scale-110 transition-transform">
                     <img src="/icons/logo.png" alt="" className="w-full h-full object-contain" />
                   </div>
                   {/* Name */}
                   <span className={`text-xs font-bold ${isSelected ? 'text-indigo-900' : 'text-gray-700'}`}>{city.name}</span>
                   {/* Stats */}
                   <span className="text-[9px] text-gray-400">O:{city.teams} 👤:{city.players}</span>
                </div>
                {/* Heart */}
                <button className="text-gray-300 hover:text-red-500 transition-colors text-sm">
                  ♡
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
