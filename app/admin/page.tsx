import Link from "next/link";

const kartlar = [
  { icon: "🔴", baslik: "Canlı Maç", link: "/admin/canli-mac" },
  { icon: "⚽", baslik: "Maç Sonucu Gir", link: "/admin/mac-sonucu" },
  { icon: "🏆", baslik: "Puan Durumu", link: "/admin/puan-durumu" },
  { icon: "📅", baslik: "Fikstürü Düzenle", link: "/admin/fikstur" },
  { icon: "👥", baslik: "Takımları Yönet", link: "/admin/takimlar" },
  { icon: "👤", baslik: "Oyuncuları Yönet", link: "/admin/oyuncular" },
  { icon: "📨", baslik: "Oyuncu Başvuruları", link: "/admin/basvurular" },
  { icon: "📰", baslik: "Haberler", link: "/admin/haberler" },
  { icon: "📢", baslik: "Duyurular", link: "/admin/duyurular" },
  { icon: "🔔", baslik: "Bildirim Gönder", link: "/admin/bildirim" },
  { icon: "⚙️", baslik: "Ayarlar", link: "/admin/ayarlar" },
  { icon: "🎯", baslik: "Skor Tahminleri", link: "/admin/skor-tahminleri" },
  { icon: "📄", baslik: "Maç Esameleri", link: "/admin/mac-esameleri" },
];

export default function AdminPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0b0b0b",
        padding: "90px 15px 30px",
      }}
    >
      <h1
        style={{
          color: "#fff",
          textAlign: "center",
          fontSize: 30,
          fontWeight: 900,
          marginBottom: 30,
        }}
      >
        ⚙️ KLAS LİG ADMIN PANELİ
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
          gap: 15,
        }}
      >
        {kartlar.map((kart) => (
          <Link
            key={kart.baslik}
            href={kart.link}
            style={{ textDecoration: "none" }}
          >
            <div
              style={{
                background: "#151515",
                borderRadius: 18,
                padding: 20,
                border: "1px solid rgba(255,49,49,.25)",
                textAlign: "center",
                cursor: "pointer",
                transition: ".2s",
              }}
            >
              <div style={{ fontSize: 42 }}>{kart.icon}</div>

              <div
                style={{
                  color: "#fff",
                  fontWeight: 800,
                  marginTop: 12,
                  fontSize: 16,
                }}
              >
                {kart.baslik}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}