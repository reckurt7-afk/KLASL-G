import MacSaatleriListesi from "../components/MacSaatleriListesi";

export default function MacSaatleriPage() {
  return (
    <div className="page min-h-screen" style={{ backgroundColor: "#070707" }}>
      <div className="container mx-auto py-12 px-4 max-w-5xl">
        <MacSaatleriListesi />
      </div>
    </div>
  );
}