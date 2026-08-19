import Image from "next/image";

export default function TakimDetayPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: "url('/images/stadium.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        style={{
          minHeight: "100vh",
          background: "rgba(0,0,0,.75)",
          padding: "90px 15px 20px",
        }}
      >
        <div
          style={{
            background: "#151515",
            borderRadius: 20,
            padding: 24,
            textAlign: "center",
            border: "1px solid rgba(255,215,0,.2)",
          }}
        >
          <Image
            src="/logos/ps5.png"
            alt="PS 5"
            width={120}
            height={120}
            style={{ margin: "0 auto" }}
          />

          <h1
            style={{
              color: "#fff",
              fontSize: 30,
              fontWeight: 900,
              marginTop: 20,
              marginBottom: 8,
            }}
          >
            PS 5
          </h1>

          <p
            style={{
              color: "#ffd700",
              fontWeight: 700,
              fontSize: 18,
            }}
          >
            👥 14 Oyuncu
          </p>
        </div>
      </div>
    </div>
  );
}