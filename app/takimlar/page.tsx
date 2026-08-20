import TakimlarListesi from "../components/TakimlarListesi";

export default function TakimlarPage() {
  return (
    <main className="w-full flex flex-col fade-in">
      <div className="w-full">
        <TakimlarListesi />
      </div>
    </main>
  );
}