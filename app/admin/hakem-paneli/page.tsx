"use client";

import { useState, useEffect } from "react";
import { publicFetch, supabase } from "@/lib/supabase";

export default function HakemPaneli() {
  const [matches, setMatches] = useState<any[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<any | null>(null);
  
  const [homePlayers, setHomePlayers] = useState<any[]>([]);
  const [awayPlayers, setAwayPlayers] = useState<any[]>([]);
  
  const [showEventModal, setShowEventModal] = useState(false);
  const [eventType, setEventType] = useState<"GOL" | "SARI_KART" | "KIRMIZI_KART">("GOL");
  const [eventTeamId, setEventTeamId] = useState<number>(0);

  useEffect(() => {
    async function loadMatches() {
      const data = await publicFetch("matches", "select=*,home_team:home_team_id(name,logo),away_team:away_team_id(name,logo)&order=match_date.desc");
      if (data) setMatches(data);
    }
    loadMatches();
  }, []);

  useEffect(() => {
    if (!selectedMatch) return;
    
    async function loadPlayers() {
      const home = await publicFetch("team_players", `select=*,players(id,first_name,last_name)&team_id=eq.${selectedMatch.home_team_id}`);
      const away = await publicFetch("team_players", `select=*,players(id,first_name,last_name)&team_id=eq.${selectedMatch.away_team_id}`);
      setHomePlayers(home || []);
      setAwayPlayers(away || []);
    }
    loadPlayers();
  }, [selectedMatch]);

  const setLiveStatus = async (status: string, is_live: boolean) => {
    if (!selectedMatch) return;
    await supabase.from("matches").update({ status, is_live }).eq("id", selectedMatch.id);
    setSelectedMatch({ ...selectedMatch, status, is_live });
  };

  const handleAddEvent = async (playerId: number | null) => {
    if (!selectedMatch) return;
    
    await supabase.from("match_events").insert({
      match_id: selectedMatch.id,
      team_id: eventTeamId,
      player_id: playerId,
      event_type: eventType,
      minute: selectedMatch.current_minute || 1
    });

    if (eventType === "GOL") {
      const isHome = eventTeamId === selectedMatch.home_team_id;
      const updates = isHome 
        ? { home_score: selectedMatch.home_score + 1 }
        : { away_score: selectedMatch.away_score + 1 };
        
      await supabase.from("matches").update(updates).eq("id", selectedMatch.id);
      setSelectedMatch({ ...selectedMatch, ...updates });
    }

    setShowEventModal(false);
    alert("Olay kaydedildi!");
  };

  return (
    <div className="min-h-screen bg-[#070707] text-white p-4 font-montserrat">
      <h1 className="text-3xl font-black text-center mb-6 text-[#ceaa52] font-oswald uppercase">HAKEM PANELI</h1>

      {!selectedMatch ? (
        <div className="max-w-xl mx-auto space-y-4">
          <h2 className="text-xl font-bold text-gray-400">Yonetilecek Maci Secin</h2>
          {matches.map(m => (
            <div key={m.id} onClick={() => setSelectedMatch(m)} className="card p-4 flex justify-between items-center cursor-pointer hover:border-[#ceaa52]">
              <div className="flex-1 text-right font-bold">{m.home_team?.name}</div>
              <div className="px-4 font-black text-2xl text-[#ceaa52]">{m.home_score} - {m.away_score}</div>
              <div className="flex-1 text-left font-bold">{m.away_team?.name}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="card p-6 flex flex-col items-center">
            <div className="text-sm font-bold text-[#eab308] mb-2">{selectedMatch.status} - {selectedMatch.current_minute}'</div>
            <div className="flex justify-between items-center w-full">
              <div className="flex-1 text-center font-black text-xl">{selectedMatch.home_team?.name}</div>
              <div className="px-6 font-black text-5xl tracking-widest">{selectedMatch.home_score}-{selectedMatch.away_score}</div>
              <div className="flex-1 text-center font-black text-xl">{selectedMatch.away_team?.name}</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button onClick={() => setLiveStatus('Canli', true)} className="bg-green-600/20 text-green-500 border border-green-600 p-3 rounded-lg font-bold">BASLAT</button>
            <button onClick={() => setLiveStatus('Devre Arasi', false)} className="bg-yellow-600/20 text-yellow-500 border border-yellow-600 p-3 rounded-lg font-bold">DEVRE ARASI</button>
            <button onClick={() => setLiveStatus('Bitti', false)} className="bg-[#ceaa52]/20 text-[#eab308] border border-[#ceaa52] p-3 rounded-lg font-bold">BITIR</button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="text-center font-bold text-gray-400 border-b border-gray-800 pb-2">EV SAHIBI</h3>
              <button onClick={() => { setEventTeamId(selectedMatch.home_team_id); setEventType("GOL"); setShowEventModal(true); }} className="w-full bg-blue-600/20 text-blue-400 border border-blue-600 p-4 rounded-xl font-black text-xl uppercase tracking-widest">+ GOL</button>
              <div className="flex gap-2">
                <button onClick={() => { setEventTeamId(selectedMatch.home_team_id); setEventType("SARI_KART"); setShowEventModal(true); }} className="flex-1 bg-yellow-500/20 border border-yellow-500 p-3 rounded-xl flex justify-center"><div className="w-6 h-8 bg-yellow-500 rounded-sm"></div></button>
                <button onClick={() => { setEventTeamId(selectedMatch.home_team_id); setEventType("KIRMIZI_KART"); setShowEventModal(true); }} className="flex-1 bg-[#ceaa52]/20 border border-[#ceaa52] p-3 rounded-xl flex justify-center"><div className="w-6 h-8 bg-[#ceaa52] rounded-sm"></div></button>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-center font-bold text-gray-400 border-b border-gray-800 pb-2">DEPLASMAN</h3>
              <button onClick={() => { setEventTeamId(selectedMatch.away_team_id); setEventType("GOL"); setShowEventModal(true); }} className="w-full bg-blue-600/20 text-blue-400 border border-blue-600 p-4 rounded-xl font-black text-xl uppercase tracking-widest">+ GOL</button>
              <div className="flex gap-2">
                <button onClick={() => { setEventTeamId(selectedMatch.away_team_id); setEventType("SARI_KART"); setShowEventModal(true); }} className="flex-1 bg-yellow-500/20 border border-yellow-500 p-3 rounded-xl flex justify-center"><div className="w-6 h-8 bg-yellow-500 rounded-sm"></div></button>
                <button onClick={() => { setEventTeamId(selectedMatch.away_team_id); setEventType("KIRMIZI_KART"); setShowEventModal(true); }} className="flex-1 bg-[#ceaa52]/20 border border-[#ceaa52] p-3 rounded-xl flex justify-center"><div className="w-6 h-8 bg-[#ceaa52] rounded-sm"></div></button>
              </div>
            </div>
          </div>
          
          <button onClick={() => setSelectedMatch(null)} className="w-full mt-8 p-3 text-gray-500 font-bold underline">Mac Listesine Don</button>
        </div>
      )}

      {showEventModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-gray-800 p-6 rounded-2xl w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-black text-center mb-6 font-oswald text-white">
              {eventType === 'GOL' ? 'GOLU KIM ATTI?' : 'KARTI KIM GORDU?'}
            </h2>
            
            <div className="max-h-64 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              <button onClick={() => handleAddEvent(null)} className="w-full p-3 bg-gray-800/50 hover:bg-gray-700 rounded-lg text-left font-bold text-gray-300">
                Bilinmeyen / Diger
              </button>
              
              {(eventTeamId === selectedMatch?.home_team_id ? homePlayers : awayPlayers).map(tp => (
                <button 
                  key={tp.id} 
                  onClick={() => handleAddEvent(tp.players?.id)}
                  className="w-full p-3 bg-gray-900 border border-gray-800 hover:border-[#ceaa52] rounded-lg text-left font-bold text-white transition-colors"
                >
                  <span className="text-gray-500 w-6 inline-block">{tp.jersey_number || '-'}</span> {tp.players?.first_name} {tp.players?.last_name}
                </button>
              ))}
            </div>
            
            <button onClick={() => setShowEventModal(false)} className="w-full mt-4 p-3 bg-[#ceaa52] text-white rounded-lg font-bold">Iptal</button>
          </div>
        </div>
      )}
    </div>
  );
}
