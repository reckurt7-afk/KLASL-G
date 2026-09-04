const fs = require('fs');
let page = fs.readFileSync('app/page.tsx', 'utf8');

const regex = /\{\/\* Center Logo - Magic Blend Mode[\s\S]*?<\/div>\r?\n?\s*<\/div>/;

const newLogoBlock = `{/* Center Logo - Bullet Crop */}
          <div className="relative flex items-center justify-center my-4 mt-8 md:mt-12 group">
            {/* Arka plan parlaması (Altın rengi) */}
            <div className="absolute inset-0 bg-[#ceaa52]/30 blur-[40px] rounded-full scale-[1.3] animate-pulse"></div>

            {/* Mermi gibi yuvarlak logo */}
            <div className="relative z-10 w-[200px] h-[200px] md:w-[240px] md:h-[240px] rounded-full overflow-hidden border-4 border-[#ceaa52] shadow-[0_0_50px_rgba(206,170,82,0.6)] flex items-center justify-center bg-white transition-transform duration-500 group-hover:scale-105">
              <Image 
                src="/icons/prime-logo.jpg" 
                width={240} 
                height={240} 
                alt="Prime Lig" 
                className="w-full h-full object-cover scale-[1.1]" 
              />
            </div>
          </div>`;

if (regex.test(page)) {
  page = page.replace(regex, newLogoBlock);
  fs.writeFileSync('app/page.tsx', page, 'utf8');
  console.log('Applied bullet crop!');
} else {
  console.log('REGEX FAILED!');
}
