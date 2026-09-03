const fs = require('fs');
let page = fs.readFileSync('app/page.tsx', 'utf8');

const oldHeaderImage = `<Image src="/icons/prolig-logo-final.jpg" width={44} height={44} alt="Pro Lig Logo" className="object-cover md:w-[48px] md:h-[48px] rounded-full shadow-md border border-gray-200" />`;
const newHeaderImage = `<div className="w-[44px] h-[44px] md:w-[48px] md:h-[48px] rounded-full overflow-hidden border border-gray-200 shadow-md shrink-0">
              <Image src="/icons/prolig-logo-final.jpg" width={48} height={48} alt="Pro Lig Logo" className="w-full h-full object-cover scale-[1.05]" />
            </div>`;

page = page.replace(oldHeaderImage, newHeaderImage);
fs.writeFileSync('app/page.tsx', page, 'utf8');
console.log('Fixed header logo crop!');
