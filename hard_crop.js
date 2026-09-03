const fs = require('fs');
let page = fs.readFileSync('app/page.tsx', 'utf8');

const oldImage = `<Image 
                src="/icons/prolig-logo-final.jpg" 
                width={180} 
                height={180} 
                alt="Pro Lig" 
                className="object-cover drop-shadow-[0_0_20px_rgba(212,175,55,0.4)] z-10 w-[140px] h-[140px] md:w-[180px] md:h-[180px] rounded-full border-2 border-[#d4af37]" 
              />`;

const newImage = `<div className="w-[140px] h-[140px] md:w-[180px] md:h-[180px] rounded-full overflow-hidden border-2 border-[#d4af37] shadow-[0_0_30px_rgba(212,175,55,0.6)] z-10 flex items-center justify-center bg-black">
                <Image 
                  src="/icons/prolig-logo-final.jpg" 
                  width={180} 
                  height={180} 
                  alt="Pro Lig" 
                  className="w-full h-full object-cover scale-[1.05]" 
                />
              </div>`;

page = page.replace(oldImage, newImage);

fs.writeFileSync('app/page.tsx', page, 'utf8');
console.log('Hard cropped the logo!');
