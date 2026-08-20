"use client";

const MOCK_MATCHES = [
  { id: 1, teamA: "YENİLMEZ AR...", teamB: "SÜRÜCÜ", scoreA: 3, scoreB: 0, status: "Bitti", date: "6 Ara 22:00", week: "17. HAFTA" },
  { id: 2, teamA: "KOMODOR FC", teamB: "VİCTHİA SİG...", scoreA: 3, scoreB: 0, status: "Bitti", date: "29 Kas 22:00", week: "17. HAFTA" },
  { id: 3, teamA: "HARBİ MİLAN...", teamB: "KARADENİZ FC", scoreA: 12, scoreB: 2, status: "Bitti", date: "29 Kas 22:00", week: "17. HAFTA" },
  { id: 4, teamA: "EVA İNŞAAT", teamB: "ANADOLU AS...", scoreA: 0, scoreB: 3, status: "Bitti", date: "29 Kas 22:00", week: "17. HAFTA" },
  { id: 5, teamA: "AMSTERDAM ...", teamB: "ALTINKÖY", scoreA: 0, scoreB: 3, status: "Bitti", date: "29 Kas 22:00", week: "17. HAFTA" },
  { id: 6, teamA: "DARICILI MAT...", teamB: "KARATEKİR D...", scoreA: 3, scoreB: 0, status: "Bitti", date: "29 Kas 22:00", week: "17. HAFTA" },
];

export default function MacSonuclariSlider() {
  return (
    <div className="w-full bg-white py-4 border-b border-gray-100">
      <div className="max-w-[1600px] mx-auto px-4 overflow-hidden relative">
        <div className="flex gap-4 overflow-x-auto hide-scrollbar snap-x pb-2">
          {MOCK_MATCHES.map((match) => (
            <div key={match.id} className="min-w-[260px] h-[100px] border border-gray-200 rounded-xl bg-white p-3 flex flex-col justify-between shrink-0 snap-center shadow-sm">
              <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold border-b border-gray-100 pb-2">
                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{match.status}</span>
                <span>{match.date}</span>
              </div>
              <div className="flex justify-between items-center flex-1 mt-2">
                <div className="flex flex-col items-center gap-1 w-[80px]">
                  <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-[10px]">🛡️</div>
                  <span className="text-[10px] font-bold text-gray-800 text-center truncate w-full">{match.teamA}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl font-black text-red-600">{match.scoreA}</span>
                  <span className="text-gray-300">-</span>
                  <span className="text-xl font-black text-gray-900">{match.scoreB}</span>
                </div>
                <div className="flex flex-col items-center gap-1 w-[80px]">
                  <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-[10px]">🛡️</div>
                  <span className="text-[10px] font-bold text-gray-800 text-center truncate w-full">{match.teamB}</span>
                </div>
              </div>
              <div className="text-[9px] text-gray-400 font-bold mt-1 text-center">
                Klas Lig Bursa • {match.week}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
