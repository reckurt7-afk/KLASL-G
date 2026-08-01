import TakimlarListesi from "../components/TakimlarListesi";

export default function TakimlarPage() {
  return (
    <main className="page min-h-screen" style={{ backgroundColor: "#0b0b0b" }}>
      <div className="container mx-auto py-12 px-4 max-w-[1200px]">
        <TakimlarListesi />
      </div>
    </main>
  );
}