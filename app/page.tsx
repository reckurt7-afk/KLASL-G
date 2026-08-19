"use client";

import { useState } from "react";
import Hero from "./components/Hero";
import PuanDurumuTablosu from "./components/PuanDurumuTablosu";
import IstatistikTablosu from "./components/IstatistikTablosu";
import HaftaninYedisi from "./components/HaftaninYedisi";
import TransferBorsasi from "./components/TransferBorsasi";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [activeModal, setActiveModal] = useState<"haftaninYedisi" | "puanDurumu" | "istatistikler" | "transferBorsasi" | null>(null);

  return (
    <main className="min-h-screen bg-[#070707] text-white overflow-hidden relative">
      {/* HERO SECTION WITH TOP BUTTONS */}
      <Hero activeTab={activeModal || undefined} onSelectTab={setActiveModal} />

      {/* POP-UP MODAL EKRANI */}
      <AnimatePresence>
        {activeModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-5xl max-h-[90vh] bg-[#0c0c0c] border border-white/10 rounded-3xl p-4 sm:p-8 shadow-[0_0_60px_rgba(0,0,0,0.9)] overflow-y-auto hide-scrollbar"
            >
              
              {/* KAPAT BUTONU */}
              <button
                onClick={() => setActiveModal(null)}
                className="absolute top-4 right-4 sm:top-5 sm:right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-[#ff3131] text-white flex items-center justify-center font-black text-lg transition-all duration-300 z-20 cursor-pointer"
              >
                ✕
              </button>

              {/* MODAL İÇERİĞİ */}
              {activeModal === "haftaninYedisi" && <HaftaninYedisi />}
              {activeModal === "puanDurumu" && <PuanDurumuTablosu />}
              {activeModal === "istatistikler" && <IstatistikTablosu />}
              {activeModal === "transferBorsasi" && <TransferBorsasi />}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}