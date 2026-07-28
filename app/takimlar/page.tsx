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
    <div className="min-h-screen bg-cover bg-center bg-fixed relative" style={{ backgroundImage: "url('/images/stadium.jpg')" }}>
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#070707]/90 via-[#070707]/80 to-[#070707]/95"></div>

      <div className="relative z-10 w-full max-w-[1400px] mx-auto pt-[40px] px-4 pb-24">
        
        {/* Başlık */}
        <div className="bg-[#151515]/60 backdrop-blur-xl border border-[#ff3131]/20 rounded-3xl p-6 mb-10 text-center shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          <h1 className="text-white text-3xl md:text-4xl font-black m-0 drop-shadow-[0_0_15px_rgba(255,49,49,0.4)]">
            👥 TAKIMLAR
          </h1>
          <div className="text-[#ff3131] mt-2 text-xs md:text-sm tracking-[0.4em] font-black">
            KLAS LİG MÜCADELECİLERİ
          </div>
        </div>

        {/* Takım Kartları ızgarası */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {takimlar.map((takim, idx) => (
            <Link
              key={takim.ad}
              href={takim.link}
              className="group block"
            >
              <div className="relative overflow-hidden bg-[#151515]/80 backdrop-blur-md rounded-2xl p-6 border border-[#ff3131]/10 transition-all duration-300 transform group-hover:-translate-y-2 group-hover:shadow-[0_15px_30px_rgba(255,49,49,0.2)] group-hover:border-[#ff3131]/50 h-full flex flex-col items-center text-center">
                
                {/* Glow Efekti (Hover) */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#ff3131]/0 to-[#ff3131]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                {/* Arkaplan Filigran Logo */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 opacity-5 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none">
                  <Image src={takim.logo} alt="" fill className="object-contain blur-[2px]" />
                </div>

                {/* Takım Logosu */}
                <div className="relative w-[100px] h-[100px] mb-4 drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)] group-hover:scale-110 transition-transform duration-500">
                  <Image
                    src={takim.logo}
                    alt={takim.ad}
                    fill
                    className="object-contain"
                  />
                </div>

                {/* Takım Adı */}
                <div className="text-white text-xl font-black uppercase tracking-wide group-hover:text-[#ff3131] transition-colors mt-2">
                  {takim.ad}
                </div>

                <div className="w-12 h-1 bg-gradient-to-r from-transparent via-[#ff3131]/50 to-transparent my-4"></div>

                {/* Oyuncu Sayısı ve Detay Butonu */}
                <div className="flex items-center justify-between w-full mt-auto bg-black/40 rounded-xl p-3 border border-white/5 group-hover:border-[#ff3131]/20">
                  <div className="flex flex-col text-left">
                    <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Kadro</span>
                    <span className="text-white font-black text-sm">👥 {takim.oyuncu} Oyuncu</span>
                  </div>
                  
                  <div className="w-8 h-8 rounded-full bg-[#ff3131]/20 flex items-center justify-center text-[#ff3131] group-hover:bg-[#ff3131] group-hover:text-white transition-colors shadow-[0_0_10px_rgba(255,49,49,0.3)]">
                    <span className="font-bold text-xl leading-none">›</span>
                  </div>
                </div>

              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}