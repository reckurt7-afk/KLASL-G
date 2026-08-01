import PuanDurumuTablosu from "../components/PuanDurumuTablosu";

export default function PuanDurumuPage() {
  return (
    <div className="page" style={{ background: "#0b0b0b", minHeight: "100vh" }}>
      <div className="container py-12 max-w-[1200px] mx-auto px-4">
        <PuanDurumuTablosu />
      </div>
    </div>
  );
}