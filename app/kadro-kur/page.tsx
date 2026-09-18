"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";
import { Download, Share2, Shirt } from "lucide-react";

// Tactic Presets (Coordinates in percentages: x is left-to-right 0-100, y is top-to-bottom 0-100)
// Goal is at top (0%) or bottom (100%)?
// Usually, squad builder has GK at the bottom or top. Let's put GK at the bottom (y: 85).
const FORMATIONS = {
  "3-2-1": [
    { id: 1, x: 50, y: 88, role: "GK" },
    { id: 2, x: 20, y: 70, role: "DEF" },
    { id: 3, x: 50, y: 70, role: "DEF" },
    { id: 4, x: 80, y: 70, role: "DEF" },
    { id: 5, x: 30, y: 45, role: "MID" },
    { id: 6, x: 70, y: 45, role: "MID" },
    { id: 7, x: 50, y: 20, role: "FWD" },
  ],
  "2-3-1": [
    { id: 1, x: 50, y: 88, role: "GK" },
    { id: 2, x: 30, y: 72, role: "DEF" },
    { id: 3, x: 70, y: 72, role: "DEF" },
    { id: 4, x: 20, y: 48, role: "MID" },
    { id: 5, x: 50, y: 45, role: "MID" },
    { id: 6, x: 80, y: 48, role: "MID" },
    { id: 7, x: 50, y: 20, role: "FWD" },
  ],
  "2-2-2": [
    { id: 1, x: 50, y: 88, role: "GK" },
    { id: 2, x: 30, y: 72, role: "DEF" },
    { id: 3, x: 70, y: 72, role: "DEF" },
    { id: 4, x: 30, y: 45, role: "MID" },
    { id: 5, x: 70, y: 45, role: "MID" },
    { id: 6, x: 30, y: 20, role: "FWD" },
    { id: 7, x: 70, y: 20, role: "FWD" },
  ],
  "3-1-2": [
    { id: 1, x: 50, y: 88, role: "GK" },
    { id: 2, x: 20, y: 72, role: "DEF" },
    { id: 3, x: 50, y: 75, role: "DEF" },
    { id: 4, x: 80, y: 72, role: "DEF" },
    { id: 5, x: 50, y: 50, role: "MID" },
    { id: 6, x: 30, y: 25, role: "FWD" },
    { id: 7, x: 70, y: 25, role: "FWD" },
  ],
};

type FormationKey = keyof typeof FORMATIONS;

export default function KadroKurPage() {
  const [formation, setFormation] = useState<FormationKey>("3-2-1");
  const [teamName, setTeamName] = useState("TAKIM ADI");
  const [coach, setCoach] = useState("Teknik Direktör");
  const [shirtColor, setShirtColor] = useState("#9e1b22");
  const [exporting, setExporting] = useState(false);
  
  const [players, setPlayers] = useState(() => 
    FORMATIONS["3-2-1"].map(pos => ({
      ...pos,
      name: pos.role === "GK" ? "Kaleci" : "Oyuncu"
    }))
  );

  const pitchRef = useRef<HTMLDivElement>(null);

  // When formation changes, update the x/y positions but keep the names
  useEffect(() => {
    const newPositions = FORMATIONS[formation];
    setPlayers(prev => prev.map((p, idx) => ({
      ...p,
      x: newPositions[idx].x,
      y: newPositions[idx].y
    })));
  }, [formation]);

  const handleNameChange = (id: number, newName: string) => {
    setPlayers(prev => prev.map(p => p.id === id ? { ...p, name: newName } : p));
  };

  const handleExport = async () => {
    if (!pitchRef.current) return;
    setExporting(true);
    
    try {
      // Small delay to allow React to render any state changes (like hiding UI controls if we added any)
      await new Promise(r => setTimeout(r, 100));
      
      const canvas = await html2canvas(pitchRef.current, {
        scale: 2, // High resolution
        useCORS: true,
        backgroundColor: "#1a1a2e"
      });
      
      const image = canvas.toDataURL("image/jpeg", 0.9);
      const link = document.createElement("a");
      link.href = image;
      link.download = `ilk7-${teamName.replace(/\s+/g, '-').toLowerCase()}.jpg`;
      link.click();
    } catch (err) {
      console.error("Export failed", err);
      alert("Görüntü kaydedilirken bir hata oluştu.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center font-sans py-4 md:py-8 fade-in">
      
      <div className="text-center mb-6">
        <h1 className="text-3xl md:text-5xl font-black text-gray-900 uppercase tracking-tight">KADRONU KUR</h1>
        <p className="mt-2 text-sm font-bold text-[#9e1b22] tracking-widest uppercase">7'li Saha Dizilişi ve Instagram Paylaşımı</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl">
        
        {/* Controls Panel */}
        <div className="flex-1 bg-white rounded-3xl p-6 md:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col gap-6">
          
          <div>
            <label className="text-xs font-black text-gray-500 uppercase tracking-wider mb-2 block">Takım Adı</label>
            <input 
              type="text" 
              value={teamName}
              onChange={e => setTeamName(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 focus:border-[#ceaa52] focus:ring-1 focus:ring-[#ceaa52] rounded-xl p-3 text-gray-900 font-black outline-none transition-all uppercase"
            />
          </div>

          <div>
            <label className="text-xs font-black text-gray-500 uppercase tracking-wider mb-2 block">Teknik Sorumlu</label>
            <input 
              type="text" 
              value={coach}
              onChange={e => setCoach(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 focus:border-[#ceaa52] focus:ring-1 focus:ring-[#ceaa52] rounded-xl p-3 text-gray-900 font-bold outline-none transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-black text-gray-500 uppercase tracking-wider mb-2 block">Diziliş Taktikleri</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {(Object.keys(FORMATIONS) as FormationKey[]).map(t => (
                <button
                  key={t}
                  onClick={() => setFormation(t)}
                  className={`py-3 rounded-xl font-black text-sm transition-all ${
                    formation === t 
                    ? "bg-[#1a1a2e] text-white shadow-md scale-105" 
                    : "bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-gray-400 font-medium mt-2">* Oyuncuları saha üzerinde parmağınızla/farenizle serbestçe sürükleyebilirsiniz.</p>
          </div>

          <div>
            <label className="text-xs font-black text-gray-500 uppercase tracking-wider mb-2 block">Forma Rengi</label>
            <div className="flex gap-3">
              {["#9e1b22", "#1a1a2e", "#ceaa52", "#ffffff", "#000000", "#16a34a", "#2563eb"].map(color => (
                <button
                  key={color}
                  onClick={() => setShirtColor(color)}
                  className={`w-10 h-10 rounded-full shadow-sm transition-transform ${shirtColor === color ? "scale-125 ring-2 ring-offset-2 ring-gray-400" : "hover:scale-110"}`}
                  style={{ backgroundColor: color, border: color === "#ffffff" ? "1px solid #e5e7eb" : "none" }}
                />
              ))}
            </div>
          </div>

          <button
            onClick={handleExport}
            disabled={exporting}
            className="mt-auto w-full bg-gradient-to-r from-[#ceaa52] to-[#d62020] text-white font-black text-lg py-4 rounded-xl shadow-[0_10px_20px_rgba(212,175,55,0.3)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
          >
            {exporting ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Download className="w-6 h-6" />
                HİKAYE OLARAK İNDİR
              </>
            )}
          </button>
          
        </div>

        {/* The Pitch (Aspect Ratio optimized for IG Story ~ 9:16) */}
        <div className="flex-1 flex justify-center">
          <div 
            ref={pitchRef}
            className="relative w-full max-w-[400px] aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl bg-[#2e8b57] select-none"
            style={{
              backgroundImage: `
                repeating-linear-gradient(
                  0deg,
                  transparent,
                  transparent 10%,
                  rgba(255,255,255,0.05) 10%,
                  rgba(255,255,255,0.05) 20%
                )
              `
            }}
          >
            {/* Pitch Lines (CSS Drawing) */}
            <div className="absolute inset-4 border-2 border-white/40 rounded-sm pointer-events-none" />
            <div className="absolute top-1/2 left-4 right-4 h-0 border-t-2 border-white/40 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 border-2 border-white/40 rounded-full pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white/50 rounded-full pointer-events-none" />
            
            {/* Penalty Areas */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-40 h-24 border-2 border-white/40 border-t-0 pointer-events-none" />
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-8 border-2 border-white/40 border-t-0 pointer-events-none" />
            
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-40 h-24 border-2 border-white/40 border-b-0 pointer-events-none" />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-16 h-8 border-2 border-white/40 border-b-0 pointer-events-none" />

            {/* Branding Watermark */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center opacity-10 pointer-events-none">
              <div className="text-4xl font-black tracking-tighter">PRİME LİG</div>
              <div className="text-sm font-black tracking-widest mt-1">BURSA</div>
            </div>

            {/* Header Overlay in Export */}
            <div className="absolute top-8 left-0 right-0 flex flex-col items-center z-10 pointer-events-none text-white drop-shadow-md">
               <h2 className="text-3xl font-black uppercase tracking-tight">{teamName}</h2>
               <p className="text-xs font-bold uppercase tracking-widest text-white/80">{coach}</p>
            </div>

            {/* Players */}
            {players.map((player) => {
              const isWhiteShirt = shirtColor === "#ffffff";
              return (
                <motion.div
                  key={player.id}
                  drag
                  dragMomentum={false}
                  initial={false}
                  animate={{ 
                    left: `${player.x}%`, 
                    top: `${player.y}%` 
                  }}
                  transition={{ type: "spring", stiffness: 120, damping: 15 }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 cursor-grab active:cursor-grabbing z-20 group"
                  style={{ touchAction: "none" }}
                >
                  <div 
                    className="relative w-12 h-12 flex items-center justify-center drop-shadow-lg transition-transform group-hover:scale-110"
                  >
                    <Shirt 
                      size={48} 
                      fill={player.role === "GK" ? "#eab308" : shirtColor}
                      color={player.role === "GK" ? "#ca8a04" : (isWhiteShirt ? "#e5e7eb" : shirtColor)}
                      strokeWidth={1}
                    />
                    <span className={`absolute mt-1 text-sm font-black ${isWhiteShirt && player.role !== "GK" ? "text-gray-900" : "text-white"}`}>
                      {player.id}
                    </span>
                  </div>
                  
                  {/* Editable Name Input */}
                  <input 
                    type="text"
                    value={player.name}
                    onChange={(e) => handleNameChange(player.id, e.target.value)}
                    className="w-24 bg-black/40 text-white text-[11px] font-black uppercase text-center rounded px-1 py-0.5 outline-none focus:ring-1 focus:ring-white/50 focus:bg-black/80 transition-colors border border-white/20 backdrop-blur-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.currentTarget.select();
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                  />
                </motion.div>
              );
            })}

          </div>
        </div>

      </div>
    </div>
  );
}
