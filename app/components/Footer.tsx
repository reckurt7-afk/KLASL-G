"use client";

import Link from "next/link";

const bolumler = [
  {
    baslik: "Lig",
    linkler: [
      { href: "/puan-durumu", label: "🏆 Puan Durumu" },
      { href: "/fikstur", label: "📅 Fikstür" },
      { href: "/mac-saatleri", label: "⏰ Maç Saatleri" },
      { href: "/esame-listesi", label: "📋 Esame Listesi" },
    ],
  },
  {
    baslik: "Takımlar & Oyuncular",
    linkler: [
      { href: "/takimlar", label: "🛡️ Takımlar" },
      { href: "/galeri", label: "📸 Fotoğraf Galerisi" },
      { href: "/video-arsivi", label: "🎬 Video Arşivi" },
      { href: "/canli-yayin", label: "🔴 Canlı Yayın" },
    ],
  },
  {
    baslik: "Haberler",
    linkler: [
      { href: "/haberler", label: "📰 Haberler" },
      { href: "/duyurular", label: "📢 Duyurular" },
    ],
  },
];

export default function Footer() {
  return (
    <footer style={{
      background: "#070707",
      borderTop: "1px solid rgba(255,49,49,0.15)",
      paddingBottom: 80, // mobile nav için boşluk
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "50px 20px 30px" }}>

        {/* Üst bölüm */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 40, marginBottom: 40, justifyContent: "space-between" }}>

          {/* Logo & Açıklama */}
          <div style={{ flex: "1 1 220px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 15 }}>
              <img src="/icons/logo.png" alt="Klas Lig" style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover" }} />
              <div>
                <div style={{ color: "#fff", fontWeight: 900, fontSize: 18, letterSpacing: 1 }}>KLAS LİG</div>
                <div style={{ color: "#ff3131", fontSize: 10, fontWeight: 800, letterSpacing: 3 }}>BURSA</div>
              </div>
            </div>
            <p style={{ color: "#aaa", fontSize: 13, lineHeight: 1.8, maxWidth: 220 }}>
              Bursa'nın en prestijli amatör futbol ligi. Puan durumu, fikstür ve canlı maç takibi.
            </p>
            <div style={{ marginTop: 20 }}>
              <a
                href="https://wa.me/905010120016"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "#25D366", color: "#fff",
                  padding: "8px 16px", borderRadius: 10,
                  fontWeight: 700, fontSize: 13, textDecoration: "none"
                }}
              >
                📞 Reklam: 0501 012 0016
              </a>
            </div>
          </div>

          {/* Linkler */}
          {bolumler.map((b) => (
            <div key={b.baslik} style={{ flex: "1 1 150px" }}>
              <div style={{ color: "#ff3131", fontWeight: 900, fontSize: 13, letterSpacing: 2, marginBottom: 16, textTransform: "uppercase" }}>
                {b.baslik}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {b.linkler.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    style={{ color: "#aaa", textDecoration: "none", fontSize: 14, fontWeight: 500, transition: "color 0.2s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#aaa")}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Alt bölüm */}
        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          paddingTop: 20,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 10,
        }}>
          <div style={{ color: "#555", fontSize: 12 }}>
            © {new Date().getFullYear()} Klas Lig Bursa. Tüm hakları saklıdır.
          </div>
          <Link
            href="/admin"
            style={{ color: "#333", fontSize: 12, textDecoration: "none" }}
          >
            ⚙️ Yönetim
          </Link>
        </div>
      </div>
    </footer>
  );
}
