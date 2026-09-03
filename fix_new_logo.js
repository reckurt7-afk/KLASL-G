const fs = require('fs');
let page = fs.readFileSync('app/page.tsx', 'utf8');

const regex = /<div className="w-\[170px\] h-\[170px\] md:w-\[210px\] md:h-\[210px\] rounded-full overflow-hidden border-\[3px\] border-\[#d4af37\] shadow-\[0_0_40px_rgba\(212,175,55,0\.8\)\] z-10 flex items-center justify-center bg-black relative">[\s\S]*?<\/div>/;

const newLogo = `<div className="w-[180px] h-[180px] md:w-[220px] md:h-[220px] rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(206,170,82,0.5)] z-10 flex items-center justify-center bg-white border-4 border-[#ceaa52] relative p-2 transition-transform hover:scale-105">
              <Image 
                src="/icons/prime-logo.jpg" 
                width={220} 
                height={220} 
                alt="Prime Lig" 
                className="w-full h-full object-contain" 
              />
            </div>`;

page = page.replace(regex, newLogo);
fs.writeFileSync('app/page.tsx', page, 'utf8');
console.log('Fixed central logo rendering!');
