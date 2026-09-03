const fs = require('fs');
let page = fs.readFileSync('app/page.tsx', 'utf8');

const regex = /<Image\s+src="\/icons\/prolig-logo-final\.jpg"\s+width=\{180\}\s+height=\{180\}\s+alt="Pro Lig"\s+className="[^"]+"\s*\/>/;

const newImage = `<div className="w-[170px] h-[170px] md:w-[210px] md:h-[210px] rounded-full overflow-hidden border-[3px] border-[#d4af37] shadow-[0_0_40px_rgba(212,175,55,0.8)] z-10 flex items-center justify-center bg-black relative">
              <Image 
                src="/icons/prolig-logo-final.jpg" 
                width={210} 
                height={210} 
                alt="Pro Lig" 
                className="w-full h-full object-cover scale-[1.03]" 
              />
            </div>`;

if (regex.test(page)) {
  page = page.replace(regex, newImage);
  fs.writeFileSync('app/page.tsx', page, 'utf8');
  console.log('Successfully cropped the central logo!');
} else {
  console.log('REGEX FAILED TO MATCH!');
}
