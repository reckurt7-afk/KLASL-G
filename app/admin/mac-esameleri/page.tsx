import { supabase } from "@/lib/supabase";

export default async function MacEsameleriPage() {
  const { data, error } = await supabase
    .from("mac_esameleri")
    .select("*")
    .order("id", { ascending: false });

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0b0b0b",
        color: "#fff",
        padding: 30,
      }}
    >
      <h1
        style={{
          fontSize: 32,
          fontWeight: 900,
          color: "#ff3131",
          marginBottom: 30,
        }}
      >
        📄 Maç Esameleri
      </h1>

      {error && (
        <div
          style={{
            background: "#8b0000",
            padding: 15,
            borderRadius: 10,
            marginBottom: 20,
          }}
        >
          Hata: {error.message}
        </div>
      )}

      {!data || data.length === 0 ? (
        <div
          style={{
            background: "#171717",
            padding: 20,
            borderRadius: 15,
          }}
        >
          Henüz maç esamesi gönderilmemiş.
        </div>
      ) : (
        data.map((oyuncu: any) => (
          <div
            key={oyuncu.id}
            style={{
              background: "#171717",
              border: "1px solid #333",
              borderRadius: 15,
              padding: 20,
              marginBottom: 15,
            }}
          >
            <h2>{oyuncu.ad_soyad}</h2>

            <p>👥 Takım ID: {oyuncu.takim_id}</p>
            <p>⚽ Maç ID: {oyuncu.mac_id}</p>
            <p>🔢 Forma No: {oyuncu.forma_no}</p>
            <p>🎯 Pozisyon: {oyuncu.pozisyon}</p>
            <p>{oyuncu.ilk_11 ? "✅ İlk 11" : "🪑 Yedek"}</p>
            <p>{oyuncu.kaptan ? "©️ Kaptan" : ""}</p>
          </div>
        ))
      )}
    </div>
  );
}