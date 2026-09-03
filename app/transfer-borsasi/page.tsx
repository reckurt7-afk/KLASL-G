
import TransferBorsasi from "../components/TransferBorsasi";

export default function TransferBorsasiPage() {
  return (
    <div className="w-full flex flex-col fade-in">
      <div className="flex items-center gap-3 mb-6 bg-red-50 p-4 rounded-xl border border-red-100">
         <div className="w-10 h-10 bg-[#ceaa52] rounded-lg flex items-center justify-center text-white shadow-sm">
           <span className="text-lg">🤝</span>
         </div>
         <div>
           <h1 className="text-[20px] font-black text-[#1a1a2e]">Transfer Borsası</h1>
           <p className="text-[12px] text-gray-500 font-bold">Ligteki güncel oyuncu arayanlar ve takım arayanlar</p>
         </div>
      </div>
      <div className="w-full">
        <TransferBorsasi />
      </div>
    </div>
  );
}
