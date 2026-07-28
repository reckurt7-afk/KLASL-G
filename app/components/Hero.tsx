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
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        backgroundImage: "url('/images/stadium.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "130px 20px 40px",
      }}
    >
      {/* KARARTMA */}
      <div
        style={{
          pointerEvents: "none",
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,.55), rgba(0,0,0,.92))",
        }}
      />

      <div className="flex flex-col xl:flex-row justify-center w-full max-w-[1600px] mx-auto gap-8 md:gap-12 relative z-10 items-center xl:items-start pt-8 xl:pt-0">
        
        {/* Sol Sponsor - Mobil için üste veya alta, ama masaüstünde solda. Mobilde yan yana veya grid. */}
        <div className="flex xl:flex-col flex-row flex-wrap justify-center gap-4 xl:gap-6 w-full xl:w-[260px] shrink-0 xl:pt-[20px] order-2 xl:order-1">
          <div className="w-full sm:w-[48%] xl:w-full"><SponsorBox side="left" /></div>
          <div className="w-full sm:w-[48%] xl:w-full"><SponsorBox side="left" /></div>
        </div>

        {/* İÇERİK */}
        <div
          className="w-full max-w-[430px] flex flex-col items-center text-center order-1 xl:order-2"
        >
          <Image
            src="/icons/logo.png"
            alt="KLAS LİG"
            width={160}
            height={160}
            priority
          />

          <h1
            style={{
              color: "#fff",
              fontSize: 46,
              fontWeight: 900,
              lineHeight: 1.05,
              marginTop: 10,
              textShadow: "0 0 20px rgba(255,0,0,.45)",
            }}
          >
            KLAS LİG
            <br />
            BURSA
          </h1>

          <div
            style={{
              marginTop: 12,
              color: "#ff3131",
              fontWeight: 900,
              fontSize: 24,
              letterSpacing: 3,
            }}
          >
            3. SEZON
          </div>
          
          <div
            style={{
              width: "100%",
              marginTop: 35,
              background: "rgba(15,15,15,.75)",
              border: "1px solid rgba(255,49,49,.30)",
              borderRadius: 20,
              padding: "24px",
              backdropFilter: "blur(10px)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                color: "#ff3131",
                fontWeight: 900,
                fontSize: 22,
                marginBottom: 18,
              }}
            >
              🔴 BUGÜNKÜ MAÇ
            </div>

            <div
              style={{
                color: "#fff",
                fontSize: 24,
                fontWeight: 800,
                lineHeight: 1.5,
              }}
            >
              {mac ? (
                <>
                  <div>{mac.ev_sahibi}</div>

                  <div
                    style={{
                      fontSize: 36,
                      fontWeight: 900,
                      color: "#ff3131",
                      margin: "10px 0",
                    }}
                  >
                    {mac.ev_skor} - {mac.dep_skor}
                  </div>

                  <div>{mac.deplasman}</div>
                </>
              ) : (
                "Bugün maç bulunmuyor."
              )}
            </div>

            <div
              style={{
                marginTop: 18,
                color: "#ddd",
                fontSize: 16,
              }}
            >
              {mac && (
                <>
                  ⏱️ {mac.dakika}'
                  <br />
                  📍 {mac.saha}
                  <br />
                  🧑‍⚖️ Hakem: {mac.hakem}
                </>
              )}
            </div>

            <a
              href={mac?.youtube_link || "#"}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                marginTop: 20,
                background: "#ff3131",
                color: "#fff",
                padding: "14px 28px",
                borderRadius: 999,
                textDecoration: "none",
                fontWeight: 800,
                fontSize: 16,
              }}
            >
              📺 CANLI YAYINI İZLE
            </a>
          </div>
          
          <Link
            href="/oyuncular"
            style={{
              width: "100%",
              maxWidth: 320,
              textDecoration: "none",
              marginTop: 28,
            }}
          >
            <button
              style={{
                width: "100%",
                height: 56,
                border: "none",
                borderRadius: 999,
                background: "#ff3131",
                color: "#fff",
                fontSize: 18,
                fontWeight: 800,
                cursor: "pointer",
                boxShadow: "0 0 25px rgba(255,49,49,.45)",
              }}
            >
              👥 OYUNCULAR
            </button>
          </Link>
          <InstallButton />
          <NotificationButton />
          
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2,1fr)",
              gap: 14,
              width: "100%",
              marginTop: 35,
            }}
          >
            {[
              { icon: "👥", value: "8", text: "TAKIM" },
              { icon: "⚽", value: "28", text: "MAÇ" },
              { icon: "📺", value: "TÜM", text: "CANLI YAYIN" },
              { icon: "🧑‍⚖️", value: "HAKEM", text: " TRİOSU" },
            ].map((item) => (
              <div
                key={item.text}
                style={{
                  background: "rgba(15,15,15,.75)",
                  border: "1px solid rgba(255,49,49,.30)",
                  borderRadius: 18,
                  padding: "18px",
                  backdropFilter: "blur(10px)",
                }}
              >
                <div style={{ fontSize: 28 }}>{item.icon}</div>

                <div
                  style={{
                    color: "#ff3131",
                    fontSize: 28,
                    fontWeight: 900,
                    marginTop: 10,
                  }}
                >
                  {item.value}
                </div>

                <div
                  style={{
                    color: "#fff",
                    fontSize: 13,
                    fontWeight: 700,
                    marginTop: 4,
                  }}
                >
                  {item.text}
                </div>
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
    <div style={{
      background: "rgba(21, 21, 21, 0.8)",
      border: "1px solid rgba(255,49,49,.30)",
      borderRadius: 16,
      overflow: "hidden",
      textAlign: "center",
      display: "flex",
      flexDirection: "column",
      boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
      backdropFilter: "blur(10px)"
    }}>
      <div style={{
        background: "linear-gradient(90deg, #ff3131 0%, #a11212 100%)",
        color: "#fff",
        padding: "12px",
        fontWeight: 900,
        fontSize: 14,
        letterSpacing: 2
      }}>
        REKLAM ALANI
      </div>
      
      <div style={{ padding: "25px 15px" }}>
        <div style={{
          width: 100,
          height: 100,
          margin: "0 auto 15px",
          background: "#222",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "2px dashed #ff3131",
          fontSize: 35
        }}>
          📢
        </div>

        <h3 style={{ margin: "0 0 5px", fontSize: 22, fontWeight: 900, color: "#fff" }}>
          BURAYA REKLAM VERİN
        </h3>
        <p style={{ margin: "0 0 20px", color: "#aaa", fontSize: 13, lineHeight: 1.4 }}>
          Siz de markanızı binlerce sporsevere ulaştırın.
        </p>

        <div style={{
          background: "rgba(0,0,0,0.5)",
          padding: "10px",
          borderRadius: 8,
          marginBottom: 20,
          fontWeight: 700,
          color: "#fff",
          fontSize: 14,
          border: "1px solid #333"
        }}>
          İletişime Geçin
        </div>

        <a href="#" style={{
          display: "block",
          background: "#fff",
          color: "#000",
          padding: "12px",
          borderRadius: 8,
          fontWeight: 900,
          textDecoration: "none",
          fontSize: 14,
          transition: "all 0.2s"
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = "#e0e0e0"}
        onMouseLeave={(e) => e.currentTarget.style.background = "#fff"}
        >
          BİLGİ AL
        </a>
      </div>
    </div>
  );
}