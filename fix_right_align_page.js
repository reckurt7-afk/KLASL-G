const fs = require('fs');
let page = fs.readFileSync('app/page.tsx', 'utf8');

page = page.replace(
  '<div className="w-full max-w-[1400px] mx-auto px-5 md:px-8 flex items-center justify-between relative h-full">',
  '<div className="w-full max-w-[1400px] mx-auto px-5 md:px-8 flex items-center justify-end relative h-full">'
);
page = page.replace(
  '{/* Sol Kısım (Boş - Ortalamayı dengelemek için) */}\r\n          <div className="w-[100px] hidden md:block"></div>',
  ''
);
// just in case line endings differ:
page = page.replace(
  /\{\/\* Sol Kısım \(Boş - Ortalamayı dengelemek için\) \*\/\}\s*<div className="w-\[100px\] hidden md:block"><\/div>/,
  ''
);

fs.writeFileSync('app/page.tsx', page, 'utf8');
console.log('Fixed right alignment in page.tsx');
