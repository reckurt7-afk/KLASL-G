import Image from "next/image";
import Link from "next/link";

const takimlar = [
  {
    ad: "ALAÇAM SPOR",
    logo: "/logos/alacam-spor.png",
    oyuncu: 14,
    link: "/takim/alacam-spor",
  },
  {
    ad: "KROKODİLLA FC",
    logo: "/logos/krokodilla-fc.png",
    oyuncu: 14,
    link: "/takim/krokodilla-fc",
  },
  {
    ad: "DÜNDAR KÖYÜ",
    logo: "/logos/dundar-koyu.png",
    oyuncu: 14,
    link: "/takim/dundar-koyu",
  },
  {
    ad: "YEŞİL BURSA FC",
    logo: "/logos/yesil-bursa-fc.png",
    oyuncu: 14,
    link: "/takim/yesil-bursa-fc",
  },
  {
    ad: "YEDİYOL BLACK FC",
    logo: "/logos/yediyol-black-fc.png",
    oyuncu: 14,
    link: "/takim/yediyol-black-fc",
  },
  {
    ad: "GRAVYER FC",
    logo: "/logos/gravyer-fc.png",
    oyuncu: 14,
    link: "/takim/gravyer-fc",
  },
  {
    ad: "BİSKREM FC",
    logo: "/logos/biskrem-fc.png",
    oyuncu: 14,
    link: "/takim/biskrem-fc",
  },
  {
    ad: "DİNAMO NALBANTOĞLU",
    logo: "/logos/dinamo-nalbantoglu.png",
    oyuncu: 14,
    link: "/takim/dinamo-nalbantoglu",
  },
];

export default function TakimlarPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0b0b0b",
        padding: "90px 15px 20px",
      }}
    >
      <h1
        style={{
          color: "#fff",
          fontSize: 28,
          fontWeight: 900,
          marginBottom: 20,
          textAlign: "center",
        }}
      >
        👥 TAKIMLAR
      </h1>

      {takimlar.map((takim) => (
        <Link
          key={takim.ad}
          href={takim.link}
          style={{
            textDecoration: "none",
            display: "block",
          }}
        >
          <div
            style={{
              background: "#151515",
              borderRadius: 18,
              padding: 16,
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
              gap: 16,
              border: "1px solid rgba(255,49,49,.20)",
            }}
          >
            <Image
              src={takim.logo}
              alt={takim.ad}
              width={60}
              height={60}
              style={{ objectFit: "contain" }}
            />

            <div style={{ flex: 1 }}>
              <div
                style={{
                  color: "#fff",
                  fontSize: 17,
                  fontWeight: 800,
                }}
              >
                {takim.ad}
              </div>

              <div
                style={{
                  color: "#999",
                  fontSize: 13,
                  marginTop: 5,
                }}
              >
                👥 {takim.oyuncu} Oyuncu
              </div>
            </div>

            <div
              style={{
                color: "#ff3131",
                fontSize: 26,
                fontWeight: 700,
              }}
            >
              ›
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}