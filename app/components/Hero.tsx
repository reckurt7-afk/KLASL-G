"use client";
import InstallButton from "./InstallButton";
import NotificationButton from "./NotificationButton";
import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { useCityStore } from "@/app/store/cityStore";
import Link from "next/link";
import { motion } from "framer-motion";



export default function Hero({
  activeTab = "puanDurumu",
  onSelectTab,
}: {
  activeTab?: "haftaninYedisi" | "puanDurumu" | "istatistikler" | "transferBorsasi";
  onSelectTab?: (tab: "haftaninYedisi" | "puanDurumu" | "istatistikler" | "transferBorsasi") => void;
}) {
  const { selectedCityId } = useCityStore();
  const cityName = selectedCityId === 1 ? "BURSA" : selectedCityId === 2 ? "�STANBUL" : selectedCityId === 3 ? "�ZM�R" : "T�RK�YE";
  const [mac, setMac] = useState<any>(null);
  const [olaylar, setOlaylar] = useState<any[]>([]);
  const [golAnimasyon, setGolAnimasyon] = useState(false);
  const [sonGolOlay, setSonGolOlay] = useState<any>(null);

  // 🔊 Sentezleyici Ses (Maçkolik tarzı korna ve anons)
  function golSesiCal() {
    try {
      const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      // Korna sesi
      const korna = ctx.createOscillator();
      const kornaGain = ctx.createGain();
      korna.type = "sawtooth";
      korna.frequency.setValueAtTime(300, now);
      korna.frequency.linearRampToValueAtTime(600, now + 0.5);
      kornaGain.gain.setValueAtTime(0, now);
      kornaGain.gain.linearRampToValueAtTime(0.3, now + 0.1);
      kornaGain.gain.linearRampToValueAtTime(0, now + 1.2);
      korna.connect(kornaGain);
      kornaGain.connect(ctx.destination);
      korna.start(now);
      korna.stop(now + 1.2);

      // Anons
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance("GOOOOOL!");
        utterance.lang = "tr-TR";
        utterance.rate = 0.6;
        utterance.pitch = 1.2;
        setTimeout(() => window.speechSynthesis.speak(utterance), 500);
      }
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    canliMacGetir();

    const channel = supabase
      .channel("hero-canli-mac")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "maclar",
        },
        () => {
          canliMacGetir();
        }
      )
      .subscribe();

    const channelOlay = supabase
      .channel("hero-mac-olaylari")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "mac_olaylari" }, (payload) => {
        canliMacGetir();
        if (payload.new.tip === "GOL") {
          setSonGolOlay(payload.new);
          setGolAnimasyon(true);
          golSesiCal();
          setTimeout(() => setGolAnimasyon(false), 6000);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(channelOlay);
    };
  }, [selectedCityId]);

  async function canliMacGetir() {
    const { data } = await supabase
      .from("maclar")
      .select("*")
      .eq("canli", true)
      .eq("city_id", selectedCityId || 1)
      .order("id", { ascending: false })
      .limit(1)
      .single();

    if (data) {
      // Map it to match the existing component structure expectation if needed, or modify component rendering
      // The original component expects data.home_team.name, data.home_team.logo, data.home_score
      // We will map `maclar` structure to what Hero expects below, OR we can just pass the raw data and fix the rendering.
      // Wait, let's just fetch team logos as well.
      const tumTakimlar = await supabase.from("takimlar").select("ad,logo").eq("city_id", selectedCityId || 1);
      const evTakim = tumTakimlar.data?.find(t => t.ad === data.ev_sahibi);
      const depTakim = tumTakimlar.data?.find(t => t.ad === data.deplasman);
      
      const mappedMac = {
        ...data,
        home_team: { name: data.ev_sahibi, logo: evTakim?.logo },
        away_team: { name: data.deplasman, logo: depTakim?.logo },
        home_score: data.ev_skor,
        away_score: data.dep_skor,
        minute: data.dakika,
        match_status: data.durum
      };
      
      setMac(mappedMac);
      
      const { data: olayData } = await supabase
        .from("mac_olaylari")
        .select("*")
        .eq("mac_id", data.id)
        .order("dakika", { ascending: false });
        
      const mappedOlay = (olayData || []).map(o => ({
        ...o,
        event_type: o.tip,
        minute: o.dakika,
        team_direction: o.takim_yonu,
        players: { first_name: o.oyuncu, last_name: "" }
      }));
      setOlaylar(mappedOlay);
    } else {
      setMac(null);
      setOlaylar([]);
    }
  }

  return (
    <section className="relative min-h-screen overflow-hidden flex justify-center items-center px-4 pt-28 pb-12">
      {/* ARKA PLAN VİDEOSU */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-80"
        src="https://assets.mixkit.co/videos/preview/mixkit-football-stadium-at-night-with-flashing-lights-43960-large.mp4"
      />
      
      {/* KARARTMA GÖLGESİ */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#070707]/60 via-[#070707]/80 to-[#070707]/98 z-0" />

      <div className="flex flex-col xl:flex-row justify-center w-full max-w-[1600px] mx-auto gap-8 md:gap-12 relative z-10 items-center xl:items-start pt-4 xl:pt-0">
        
        {/* Sol Sponsor */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex xl:flex-col flex-row flex-wrap justify-center gap-4 xl:gap-6 w-full xl:w-[260px] shrink-0 xl:pt-[20px] order-2 xl:order-1"
        >
          <div className="w-full sm:w-[48%] xl:w-full"><GoktugSponsorBox /></div>
          <div className="w-full sm:w-[48%] xl:w-full"><SponsorBox side="left" /></div>
        </motion.div>

        {/* ANA İÇERİK (MERKEZ) */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-[520px] flex flex-col items-center text-center order-1 xl:order-2"
        >
          
          <div className="relative group">
            <div className="absolute -inset-3 bg-gradient-to-r from-[#d4af37] to-[#8c7324] rounded-full blur-2xl opacity-40 group-hover:opacity-70 transition duration-1000 group-hover:duration-200"></div>
            <Image
              src="/icons/prolig-logo-final.jpg"
              alt="PRO LİG"
              width={140}
              height={140}
              priority
              className="relative rounded-full drop-shadow-[0_0_20px_rgba(212,175,55,0.6)] transform transition-transform duration-500 hover:scale-105"
            />
          </div>

          <h1 className="text-4xl md:text-6xl font-black mt-3 leading-tight tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-gray-400 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            PRO LİG
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-[#8c7324] drop-shadow-[0_0_20px_rgba(212,175,55,0.5)]">{cityName}</span>
          </h1>

          <div className="mt-1.5 font-black text-xs md:text-sm tracking-[0.3em] text-[#d4af37] bg-[#d4af37]/15 px-4 py-1 rounded-full border border-[#d4af37]/40 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
            3. SEZON
          </div>

          {/* ULTRA ŞIK CANLI MAÇ KUTUSU */}
          <div className="w-full mt-6 bg-gradient-to-b from-[#0e0e0e]/95 via-[#090909]/90 to-[#050505]/95 border-2 border-[#d4af37]/40 hover:border-[#d4af37]/70 rounded-3xl p-6 md:p-8 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative overflow-hidden group transition-all duration-500">
            {/* Şık Arkaplan Işığı */}
            <div className="absolute -top-24 -right-24 w-56 h-56 bg-[#d4af37]/20 rounded-full blur-3xl group-hover:bg-[#d4af37]/35 transition-all duration-500 pointer-events-none"></div>

            <div className="flex items-center justify-center gap-2.5 text-[#d4af37] font-black text-xl md:text-2xl mb-6 tracking-wider">
              <span className="relative flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4af37] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#d4af37]"></span>
              </span>
              CANLI MAÇ
            </div>

            <div className="text-gray-900 text-2xl md:text-3xl font-black leading-snug">
              {mac ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-full truncate px-2 text-gray-100 font-extrabold">{mac.home_team?.name}</div>

                  <div className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#d4af37] via-[#e61c1c] to-[#8c7324] drop-shadow-[0_0_25px_rgba(212,175,55,0.7)] my-4 tracking-tighter">
                    {mac.home_score} - {mac.away_score}
                  </div>

                  <div className="w-full truncate px-2 text-gray-100 font-extrabold">{mac.away_team?.name}</div>
                </div>
              ) : (
                <div className="text-gray-500 text-lg md:text-xl font-bold py-6">Şu an oynanan canlı maç bulunmuyor.</div>
              )}
            </div>

            <div className="mt-6 text-gray-300 text-sm md:text-base font-bold bg-black/60 rounded-2xl p-4 border border-gray-200 shadow-inner">
              {mac ? (
                <div className="flex justify-around items-center">
                  <div className="flex flex-col items-center">
                    <span className="text-[#d4af37] text-xl">⏱️</span>
                    <span className="font-black text-gray-900">{mac.current_minute}'</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[#d4af37] text-xl">📍</span>
                    <span className="font-black text-gray-900">{mac.saha || "Saha"}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[#d4af37] text-xl">🧑‍⚖️</span>
                    <span className="font-black text-gray-900">{mac.hakem || "Hakem"}</span>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 font-bold">Sıradaki lig maçları için fikstürü takip edin.</div>
              )}
            </div>

            <a
              href={mac?.youtube_link || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-block mt-6 w-full py-4 rounded-2xl text-center font-black text-lg transition-all duration-300 ${
                mac?.youtube_link
                  ? "bg-gradient-to-r from-[#d4af37] to-[#8c7324] text-gray-900 shadow-[0_8px_25px_rgba(212,175,55,0.4)] hover:shadow-[0_10px_35px_rgba(212,175,55,0.7)] hover:scale-[1.02]"
                  : "bg-gray-900 text-gray-500 cursor-not-allowed border border-gray-800"
              }`}
            >
              📺 CANLI YAYINI İZLE
            </a>

            {/* ZAMAN TÜNELİ */}
            {mac && olaylar.length > 0 && (
              <div className="mt-6 text-left">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[#d4af37]">⚡</span>
                  <span className="text-gray-900 font-black text-sm tracking-widest">MAÇ OLAYLARI</span>
                </div>
                <div className="max-h-[160px] overflow-y-auto pr-2 flex flex-col gap-2 custom-scrollbar">
                  {olaylar.map((olay, i) => (
                    <div key={i} className="flex items-center gap-3 bg-black/40 border border-gray-100 p-2.5 rounded-xl">
                      <div className="w-8 h-8 shrink-0 flex items-center justify-center bg-[#d4af37]/10 rounded-lg text-sm font-black text-[#d4af37]">
                        {olay.minute}'
                      </div>
                      <div className="text-xl">
                        {olay.event_type === "GOL" ? "⚽" : olay.event_type === "SARI_KART" ? "🟨" : olay.event_type === "KIRMIZI_KART" ? "🟥" : "🔄"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-gray-900 font-bold text-sm truncate">{(olay.players ? (olay.players.first_name + " " + (olay.players.last_name||"")) : "Bilinmeyen")}</div>
                        <div className="text-gray-500 text-xs truncate">
                          {olay.team_id === mac.home_team_id ? mac.home_team?.name : mac.away_team?.name}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* GOL ANİMASYONU OVERLAY */}
          {golAnimasyon && sonGolOlay && (
            <div className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center bg-white/80 backdrop-blur-sm animate-in fade-in duration-300">
              <div className="relative text-center scale-150 animate-bounce">
                <div className="absolute -inset-10 bg-gradient-to-r from-[#d4af37] to-[#ff9000] blur-[100px] opacity-60"></div>
                <h1 className="text-7xl md:text-9xl font-black text-gray-900 italic drop-shadow-[0_0_40px_rgba(212,175,55,1)] transform -rotate-6 tracking-tighter" style={{ textShadow: "4px 4px 0 #000, 8px 8px 0 #d4af37" }}>
                  GOOOOOL!
                </h1>
                <div className="text-2xl md:text-4xl text-yellow-300 font-black mt-4 drop-shadow-[0_0_10px_rgba(0,0,0,1)] uppercase">
                  ⚽ {(sonGolOlay.players ? (sonGolOlay.players.first_name + " " + (sonGolOlay.players.last_name||"")) : "Bilinmeyen")} ({sonGolOlay.minute}')
                </div>
              </div>
            </div>
          )}

          
          {/* OYUNCU İSTATİSTİKLERİ BUTONU */}
          <Link href="/oyunculari" className="w-full mt-6 block">
            <button className="w-full h-14 rounded-2xl bg-[#0c0c0c]/90 border border-white/15 hover:border-[#d4af37]/60 text-gray-900 text-base md:text-lg font-black flex items-center justify-center gap-3 transition-all duration-300 shadow-xl hover:shadow-[0_0_25px_rgba(212,175,55,0.3)] hover:bg-[#151515] cursor-pointer">
              👥 OYUNCU İSTATİSTİKLERİ VE KARTLARI
            </button>
          </Link>

          <div className="w-full mt-4 flex gap-4">
            <div className="w-1/2"><InstallButton /></div>
            <div className="w-1/2"><NotificationButton /></div>
          </div>
          
          {/* STATS COUNTER GRID BOXES */}
          <div className="grid grid-cols-2 gap-4 w-full mt-6">
            {[
              { icon: "👥", value: "8", text: "TAKIM" },
              { icon: "⚽", value: "28", text: "MAÇ" },
              { icon: "📺", value: "TÜM", text: "CANLI YAYIN" },
              { icon: "🧑‍⚖️", value: "HAKEM", text: "TRİOSU" },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-[#0b0b0b]/80 border border-gray-200 hover:border-[#d4af37]/50 rounded-2xl p-5 backdrop-blur-md flex flex-col items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:bg-[#121212] shadow-lg"
              >
                <div className="text-3xl mb-1.5 drop-shadow-md">{item.icon}</div>
                <div className="text-[#d4af37] text-3xl font-black drop-shadow-[0_0_12px_rgba(212,175,55,0.4)]">{item.value}</div>
                <div className="text-gray-500 text-[11px] font-extrabold mt-1 tracking-widest uppercase">{item.text}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Sağ Sponsor */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex xl:flex-col flex-row flex-wrap justify-center gap-4 xl:gap-6 w-full xl:w-[260px] shrink-0 xl:pt-[20px] order-3"
        >
          <div className="w-full sm:w-[48%] xl:w-full"><SponsorBox side="right" /></div>
          <div className="w-full sm:w-[48%] xl:w-full"><SponsorBox side="right" /></div>
        </motion.div>
      </div>
    </section>
  );
}

function SponsorBox({ side }: { side: "left" | "right" }) {
  return (
    <div className="bg-[#0c0c0c]/90 border border-[#d4af37]/30 rounded-2xl overflow-hidden text-center flex flex-col shadow-[0_10px_30px_rgba(0,0,0,0.6)] backdrop-blur-xl group hover:border-[#d4af37]/60 transition-all duration-500">
      <div className="bg-gradient-to-r from-[#d4af37] to-[#8c7324] text-gray-900 py-2 px-4 font-black text-xs tracking-widest uppercase">
        REKLAM ALANI
      </div>
      
      <div className="p-6 md:p-8 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#d4af37]/0 to-[#d4af37]/5 pointer-events-none group-hover:opacity-100 opacity-0 transition-opacity duration-500"></div>
        
        <div className="w-20 h-20 md:w-24 md:h-24 mb-4 bg-black rounded-full flex items-center justify-center border-2 border-dashed border-[#d4af37]/50 text-3xl md:text-4xl group-hover:scale-110 group-hover:border-solid group-hover:border-[#d4af37] transition-all duration-500 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
          📢
        </div>

        <h3 className="m-0 mb-2 text-xl font-black text-gray-900 group-hover:text-[#d4af37] transition-colors">
          BURAYA REKLAM VERİN
        </h3>
        <p className="m-0 mb-6 text-gray-500 text-xs md:text-sm leading-relaxed font-semibold">
          Siz de markanızı binlerce sporsevere ulaştırın.
        </p>

        <a href="https://wa.me/905010120016" target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 bg-white text-black py-3 rounded-xl font-black text-sm hover:bg-[#d4af37] hover:text-gray-900 hover:shadow-[0_5px_20px_rgba(212,175,55,0.5)] transition-all duration-300">
          <span className="text-lg">📞</span> 
          <span>0501 012 0016</span>
        </a>
      </div>
    </div>
  );
}

function GoktugSponsorBox() {
  return (
    <div className="bg-[#081e29] border border-[#00d0ff]/50 rounded-2xl overflow-hidden flex flex-col shadow-[0_10px_30px_rgba(0,208,255,0.25)] group hover:border-[#00d0ff]/90 transition-all duration-500 relative h-full">
      <div className="bg-gradient-to-r from-[#00d0ff] to-[#0088cc] text-gray-900 py-2 px-4 font-black text-[10px] tracking-widest text-center relative z-10 uppercase">
        👑 ANA SPONSOR
      </div>
      
      <div className="p-4 flex flex-col items-center justify-between flex-1">
        <div className="relative w-full aspect-[2/1] md:aspect-[21/9] rounded-lg overflow-hidden border border-gray-200 group-hover:border-[#00d0ff]/50 transition-colors shadow-lg mb-4">
          <img 
            src="/logos/goktug.jpg" 
            alt="Göktuğ Bilişim" 
            className="w-full h-full object-cover"
          />
        </div>

        <a href="https://wa.me/905366660201" target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 bg-[#00d0ff]/10 border border-[#00d0ff]/60 text-[#00d0ff] py-2.5 rounded-xl font-black text-xs hover:bg-[#00d0ff] hover:text-black hover:shadow-[0_0_20px_rgba(0,208,255,0.7)] transition-all duration-300 mt-auto">
          <span className="text-sm">📞</span>
          <span>0536 666 02 01</span>
        </a>
      </div>
    </div>
  );
}
