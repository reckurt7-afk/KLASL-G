"use client";
import InstallButton from "./InstallButton";
import NotificationButton from "./NotificationButton";
import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function Hero() {
  const [mac, setMac] = useState<any>(null);

  useEffect(() => {
    canliMacGetir();

    const channel = supabase
      .channel("canli-mac")
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

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function canliMacGetir() {
    const { data } = await supabase
      .from("maclar")
      .select("*")
      .eq("canli", true)
      .single();

    if (data) {
      setMac(data);
    }
  }

  return (
    <section className="relative min-h-screen bg-[url('/images/stadium.png')] bg-cover bg-center bg-no-repeat overflow-hidden flex justify-center items-center px-4 pt-32 pb-12">
      {/* KARARTMA GÖLGESİ */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#070707]/60 via-[#070707]/80 to-[#070707]/95" />

      <div className="flex flex-col xl:flex-row justify-center w-full max-w-[1600px] mx-auto gap-8 md:gap-12 relative z-10 items-center xl:items-start pt-8 xl:pt-0">
        
        {/* Sol Sponsor */}
        <div className="flex xl:flex-col flex-row flex-wrap justify-center gap-4 xl:gap-6 w-full xl:w-[260px] shrink-0 xl:pt-[20px] order-2 xl:order-1">
          <div className="w-full sm:w-[48%] xl:w-full"><GoktugSponsorBox /></div>
          <div className="w-full sm:w-[48%] xl:w-full"><SponsorBox side="left" /></div>
        </div>

        {/* ANA İÇERİK (MERKEZ) */}
        <div className="w-full max-w-[480px] flex flex-col items-center text-center order-1 xl:order-2">
          
          <div className="relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-[#ff3131] to-[#a11212] rounded-full blur-xl opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <Image
              src="/icons/logo.png"
              alt="KLAS LİG"
              width={160}
              height={160}
              priority
              className="relative drop-shadow-[0_0_15px_rgba(255,49,49,0.5)] transform transition-transform duration-500 hover:scale-105"
            />
          </div>

          <h1 className="text-5xl md:text-7xl font-black mt-6 leading-tight tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-gray-400 drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
            KLAS LİG
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff3131] to-[#a11212] drop-shadow-[0_0_15px_rgba(255,49,49,0.4)]">BURSA</span>
          </h1>

          <div className="mt-3 text-[#ff3131] font-black text-xl md:text-2xl tracking-[0.3em] bg-[#ff3131]/10 px-4 py-1 rounded-full border border-[#ff3131]/20">
            3. SEZON
          </div>
          
          {/* BUGÜNKÜ MAÇ KUTUSU */}
          <div className="w-full mt-8 bg-[#0f0f0f]/80 border border-[#ff3131]/30 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group hover:border-[#ff3131]/50 transition-all duration-500">
            {/* Şık Arkaplan Işığı */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#ff3131]/20 rounded-full blur-3xl group-hover:bg-[#ff3131]/30 transition-all duration-500 pointer-events-none"></div>

            <div className="flex items-center justify-center gap-2 text-[#ff3131] font-black text-xl md:text-2xl mb-6">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff3131] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#ff3131]"></span>
              </span>
              CANLI MAÇ
            </div>

            <div className="text-white text-2xl md:text-3xl font-black leading-snug">
              {mac ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-full truncate px-2 text-gray-200">{mac.ev_sahibi}</div>

                  <div className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#ff3131] to-[#a11212] drop-shadow-[0_0_20px_rgba(255,49,49,0.6)] my-4">
                    {mac.ev_skor} - {mac.dep_skor}
                  </div>

                  <div className="w-full truncate px-2 text-gray-200">{mac.deplasman}</div>
                </div>
              ) : (
                <div className="text-gray-500 text-lg md:text-xl font-bold py-6">Şu an oynanan maç bulunmuyor.</div>
              )}
            </div>

            <div className="mt-6 text-gray-400 text-sm md:text-base font-bold bg-black/40 rounded-2xl p-4 border border-white/5">
              {mac ? (
                <div className="flex justify-around items-center">
                  <div className="flex flex-col items-center">
                    <span className="text-[#ff3131] text-lg">⏱️</span>
                    <span>{mac.dakika}'</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[#ff3131] text-lg">📍</span>
                    <span>{mac.saha || "Saha"}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[#ff3131] text-lg">🧑‍⚖️</span>
                    <span>{mac.hakem || "Hakem"}</span>
                  </div>
                </div>
              ) : (
                <div className="text-center opacity-50">Sıradaki maçlar için fikstürü kontrol edin.</div>
              )}
            </div>

            <a
              href={mac?.youtube_link || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-block mt-6 w-full py-4 rounded-xl text-center font-black text-lg transition-all duration-300 ${mac?.youtube_link ? "bg-gradient-to-r from-[#ff3131] to-[#a11212] text-white shadow-[0_5px_15px_rgba(255,49,49,0.3)] hover:shadow-[0_5px_25px_rgba(255,49,49,0.6)] hover:-translate-y-1" : "bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700"}`}
            >
              📺 CANLI YAYINI İZLE
            </a>
          </div>
          
          <Link href="/oyuncular" className="w-full mt-8 block">
            <button className="w-full h-14 rounded-xl bg-[#111] border border-white/10 hover:border-[#ff3131]/50 text-white text-lg font-black flex items-center justify-center gap-3 transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(255,49,49,0.2)] hover:bg-[#1a1a1a]">
              👥 OYUNCU İSTATİSTİKLERİ
            </button>
          </Link>

          <div className="w-full mt-4 flex gap-4">
            <div className="w-1/2"><InstallButton /></div>
            <div className="w-1/2"><NotificationButton /></div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 w-full mt-8">
            {[
              { icon: "👥", value: "8", text: "TAKIM" },
              { icon: "⚽", value: "28", text: "MAÇ" },
              { icon: "📺", value: "TÜM", text: "CANLI YAYIN" },
              { icon: "🧑‍⚖️", value: "HAKEM", text: "TRİOSU" },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-[#0f0f0f]/60 border border-white/5 hover:border-[#ff3131]/30 rounded-2xl p-5 backdrop-blur-md flex flex-col items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:bg-[#1a1a1a]"
              >
                <div className="text-3xl mb-2 drop-shadow-md">{item.icon}</div>
                <div className="text-[#ff3131] text-3xl font-black drop-shadow-[0_0_10px_rgba(255,49,49,0.3)]">{item.value}</div>
                <div className="text-gray-400 text-xs font-bold mt-1 tracking-widest">{item.text}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Sağ Sponsor */}
        <div className="flex xl:flex-col flex-row flex-wrap justify-center gap-4 xl:gap-6 w-full xl:w-[260px] shrink-0 xl:pt-[20px] order-3">
          <div className="w-full sm:w-[48%] xl:w-full"><SponsorBox side="right" /></div>
          <div className="w-full sm:w-[48%] xl:w-full"><SponsorBox side="right" /></div>
        </div>
      </div>
    </section>
  );
}

function SponsorBox({ side }: { side: "left" | "right" }) {
  return (
    <div className="bg-[#111]/90 border border-[#ff3131]/20 rounded-2xl overflow-hidden text-center flex flex-col shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl group hover:border-[#ff3131]/50 transition-all duration-500">
      <div className="bg-gradient-to-r from-[#ff3131] to-[#a11212] text-white py-2 px-4 font-black text-xs tracking-widest">
        REKLAM ALANI
      </div>
      
      <div className="p-6 md:p-8 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#ff3131]/0 to-[#ff3131]/5 pointer-events-none group-hover:opacity-100 opacity-0 transition-opacity duration-500"></div>
        
        <div className="w-20 h-20 md:w-24 md:h-24 mb-4 bg-black rounded-full flex items-center justify-center border-2 border-dashed border-[#ff3131]/50 text-3xl md:text-4xl group-hover:scale-110 group-hover:border-solid group-hover:border-[#ff3131] transition-all duration-500 shadow-[0_0_15px_rgba(255,49,49,0.2)]">
          📢
        </div>

        <h3 className="m-0 mb-2 text-xl font-black text-white group-hover:text-[#ff3131] transition-colors">
          BURAYA REKLAM VERİN
        </h3>
        <p className="m-0 mb-6 text-gray-400 text-xs md:text-sm leading-relaxed">
          Siz de markanızı binlerce sporsevere ulaştırın.
        </p>

        <a href="https://wa.me/905010120016" target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 bg-white text-black py-3 rounded-xl font-black text-sm hover:bg-[#ff3131] hover:text-white hover:shadow-[0_5px_15px_rgba(255,49,49,0.4)] transition-all duration-300">
          <span className="text-lg">📞</span> 
          <span>0501 012 0016</span>
        </a>
      </div>
    </div>
  );
}

function GoktugSponsorBox() {
  return (
    <div className="bg-[#0b2b3a] border border-[#00d0ff]/40 rounded-2xl overflow-hidden flex flex-col shadow-[0_10px_30px_rgba(0,208,255,0.2)] group hover:border-[#00d0ff]/80 transition-all duration-500 relative h-full">
      <div className="bg-gradient-to-r from-[#00d0ff] to-[#0088cc] text-white py-2 px-4 font-black text-[10px] tracking-widest text-center relative z-10">
        👑 ANA SPONSOR
      </div>
      
      <div className="p-4 flex flex-col items-center justify-between flex-1">
        <div className="relative w-full aspect-[2/1] md:aspect-[21/9] rounded-lg overflow-hidden border border-white/5 group-hover:border-[#00d0ff]/40 transition-colors shadow-lg mb-4">
          <img 
            src="/logos/goktug.jpg" 
            alt="Göktuğ Bilişim" 
            className="w-full h-full object-cover"
          />
        </div>

        <a href="https://wa.me/905366660201" target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 bg-[#00d0ff]/10 border border-[#00d0ff]/50 text-[#00d0ff] py-2.5 rounded-xl font-black text-xs hover:bg-[#00d0ff] hover:text-black hover:shadow-[0_0_15px_rgba(0,208,255,0.6)] transition-all duration-300 mt-auto">
          <span className="text-sm">📞</span>
          <span>0536 666 02 01</span>
        </a>
      </div>
    </div>
  );
}