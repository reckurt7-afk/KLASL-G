const fs = require('fs');
let page = fs.readFileSync('app/page.tsx', 'utf8');

page = page.replace(
  'alt="Pro Lig Logo" className="object-contain md:w-[48px] md:h-[48px]"',
  'alt="Pro Lig Logo" className="object-contain md:w-[48px] md:h-[48px] rounded-full shadow-md"'
);

fs.writeFileSync('app/page.tsx', page, 'utf8');
console.log('Fixed logo rounding!');
