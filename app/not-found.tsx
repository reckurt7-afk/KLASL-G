import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#0b0b0b",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: "20px",
    }}>
      <div style={{ fontSize: 100, marginBottom: 20 }}>⚽</div>
      <h1 style={{ color: "#ff3131", fontSize: 80, fontWeight: 900, margin: 0, lineHeight: 1 }}>404</h1>
      <p style={{ color: "#fff", fontSize: 22, fontWeight: 700, marginTop: 15 }}>Sayfa Bulunamadı</p>
      <p style={{ color: "#aaa", fontSize: 15, marginTop: 10, maxWidth: 400 }}>
        Aradığın sayfa mevcut değil ya da taşınmış olabilir.
      </p>
      <div style={{ display: "flex", gap: 15, marginTop: 35, flexWrap: "wrap", justifyContent: "center" }}>
        <Link href="/" style={{
          background: "linear-gradient(135deg, #ff3131, #a11212)",
          color: "#fff", textDecoration: "none",
          padding: "14px 28px", borderRadius: 12,
          fontWeight: 800, fontSize: 15,
          boxShadow: "0 8px 25px rgba(255,49,49,0.3)"
        }}>
          🏠 Ana Sayfaya Dön
        </Link>
        <Link href="/puan-durumu" style={{
          background: "rgba(255,255,255,0.08)",
          color: "#fff", textDecoration: "none",
          padding: "14px 28px", borderRadius: 12,
          fontWeight: 700, fontSize: 15,
          border: "1px solid rgba(255,255,255,0.15)"
        }}>
          🏆 Puan Durumu
        </Link>
      </div>
    </div>
  );
}
