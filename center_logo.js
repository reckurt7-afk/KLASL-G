const fs = require('fs');
let page = fs.readFileSync('app/page.tsx', 'utf8');

const regex = /<div className="w-full max-w-\[1400px\] mx-auto px-5 md:px-8 flex items-center justify-between">([\s\S]*?)<\/div>\s*<\/header>/;

const newHeader = `<div className="w-full max-w-[1400px] mx-auto px-5 md:px-8 flex items-center justify-between relative h-full">
          {/* Sol Kısım (Boş - Ortalamayı dengelemek için) */}
          <div className="w-[100px] hidden md:block"></div>

          {/* Orta Kısım - Logo (Tam Merkeze Sabitlendi) */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 md:gap-3 shrink-0 z-10">
            <div className="w-[44px] h-[44px] md:w-[48px] md:h-[48px] rounded-full overflow-hidden border border-gray-200 shadow-md shrink-0">
              <Image src="/icons/prolig-logo-final.jpg" width={48} height={48} alt="Pro Lig Logo" className="w-full h-full object-cover scale-[1.05]" />
            </div>
            <span className="font-black text-[20px] md:text-[22px] tracking-tight text-[#1a1a2e]">PRO <span className="text-[#e60000]">LİG</span></span>
          </Link>

          {/* Sağ Kısım - Butonlar */}
          <div className="flex items-center justify-end gap-2 md:gap-6 w-full md:w-auto relative z-20">
            <Link href="/canli-yayin" className="hidden lg:flex items-center gap-2 text-[#e60000] font-bold text-[13px] cursor-pointer hover:opacity-80 transition-opacity">
              <span className="w-2.5 h-2.5 bg-[#e60000] rounded-full animate-pulse"></span>
              Pro Lig TV
            </Link>
            <div className="flex items-center gap-2 md:gap-3">
              <Link href="/giris" className="group relative overflow-hidden bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900 font-black text-[12px] md:text-[15px] px-3 py-2 md:px-6 md:py-3 rounded-lg md:rounded-xl transition-all duration-300 flex items-center gap-1.5 md:gap-2 shadow-sm whitespace-nowrap">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="hidden sm:block group-hover:-translate-x-1 transition-transform"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
                GİRİŞ YAP
              </Link>
              <Link href="/kayit" className="group relative overflow-hidden bg-gradient-to-r from-[#e60000] to-[#ff3333] hover:from-[#cc0000] hover:to-[#e60000] text-white font-black text-[12px] md:text-[15px] px-3 py-2 md:px-6 md:py-3 rounded-lg md:rounded-xl transition-all duration-300 flex items-center gap-1.5 md:gap-2 shadow-[0_4px_12px_rgba(230,0,0,0.3)] hover:shadow-[0_6px_16px_rgba(230,0,0,0.4)] hover:-translate-y-0.5 whitespace-nowrap">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="hidden sm:block group-hover:scale-110 transition-transform"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
                ÜYE OL
              </Link>
            </div>
          </div>
        </div>
      </header>`;

if (regex.test(page)) {
  page = page.replace(regex, newHeader);
  fs.writeFileSync('app/page.tsx', page, 'utf8');
  console.log('Centered the logo!');
} else {
  console.log('Regex failed.');
}
