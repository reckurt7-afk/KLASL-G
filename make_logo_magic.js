const fs = require('fs');
let page = fs.readFileSync('app/page.tsx', 'utf8');

const regex = /\{\/\* Center Logo[\s\S]*?<Image \r?\n?\s*src="\/icons\/prime-logo\.jpg"[\s\S]*?\/>\r?\n?\s*<\/div>\r?\n?\s*<\/div>/;

const newLogoBlock = `{/* Center Logo - Magic Blend Mode to remove white background */}
          <div className="relative flex items-center justify-center my-4 mt-8 md:mt-12 group">
            {/* Glowing Orb that preserves the logo colors while fading out the white square */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,1)_35%,rgba(255,255,255,0.7)_50%,rgba(255,255,255,0)_70%)] rounded-full blur-[10px] scale-[1.3] opacity-90 group-hover:scale-[1.4] group-hover:opacity-100 transition-all duration-700"></div>
            
            {/* Outer Gold Glow */}
            <div className="absolute inset-0 bg-[#ceaa52]/30 blur-[40px] rounded-full scale-[1.5] animate-pulse"></div>

            {/* The Image with mix-blend-multiply */}
            <div className="relative z-10 w-[200px] h-[200px] md:w-[280px] md:h-[280px] flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
              <Image 
                src="/icons/prime-logo.jpg" 
                width={280} 
                height={280} 
                alt="Prime Lig" 
                className="w-full h-full object-contain mix-blend-multiply drop-shadow-2xl" 
              />
            </div>
          </div>`;

if (regex.test(page)) {
  page = page.replace(regex, newLogoBlock);
  fs.writeFileSync('app/page.tsx', page, 'utf8');
  console.log('Applied magic blend mode to logo!');
} else {
  console.log('REGEX FAILED!');
}
