"use client";

import React from "react";

interface MatchProps {
  match: any;
}

export default function MatchCard({ match }: MatchProps) {
  const isLive = match.canli === true;
  const isFinished = match.oynandi === true;
  
  const homeScore = match.ev_sahibi_skor ?? "-";
  const awayScore = match.deplasman_skor ?? "-";

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow group cursor-pointer relative">
      {/* Top Bar */}
      <div className="flex justify-between items-center px-3 py-1.5 bg-gray-50 border-b border-gray-100 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
        <span>{match.hafta}. HAFTA</span>
        <span className="text-gray-400">{match.tarih || "Belirsiz"}</span>
      </div>
      
      {/* Teams & Score */}
      <div className="p-3">
        {/* Home */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-6 h-6 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center border border-gray-200 overflow-hidden">
              {match.takimlar_ev_sahibi?.logo ? (
                <img src={match.takimlar_ev_sahibi.logo} alt="Home Logo" className="w-full h-full object-cover" />
              ) : (
                <span className="text-[10px] font-bold text-gray-400">EV</span>
              )}
            </div>
            <span className="font-semibold text-xs text-gray-900 truncate">
              {match.takimlar_ev_sahibi?.ad || "Ev Sahibi"}
            </span>
          </div>
          <span className="font-bold text-sm text-gray-900 w-6 text-center flex-shrink-0">{homeScore}</span>
        </div>
        
        {/* Away */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-6 h-6 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center border border-gray-200 overflow-hidden">
              {match.takimlar_deplasman?.logo ? (
                <img src={match.takimlar_deplasman.logo} alt="Away Logo" className="w-full h-full object-cover" />
              ) : (
                <span className="text-[10px] font-bold text-gray-400">DEP</span>
              )}
            </div>
            <span className="font-semibold text-xs text-gray-900 truncate">
              {match.takimlar_deplasman?.ad || "Deplasman"}
            </span>
          </div>
          <span className="font-bold text-sm text-gray-900 w-6 text-center flex-shrink-0">{awayScore}</span>
        </div>
      </div>
      
      {/* Bottom Status */}
      <div className="px-3 py-1.5 flex justify-between items-center text-[11px] font-bold border-t border-gray-50">
        <span className="text-gray-400 truncate max-w-[120px]">{match.saha || "Saha Belirsiz"}</span>
        {isLive ? (
          <span className="text-[#e50914] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-[#e50914] rounded-full animate-ping"></span>
            CANLI
          </span>
        ) : isFinished ? (
          <span className="text-gray-500">MS</span>
        ) : (
          <span className="text-gray-400">{match.saat || "-"}</span>
        )}
      </div>
    </div>
  );
}
