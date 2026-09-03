const fs = require('fs');

// PAGE.TSX
let page = fs.readFileSync('app/page.tsx', 'utf8');
page = page.replace(
  'className="font-black text-[20px] md:text-[22px] tracking-tight text-[#1a1a2e]"',
  'className="font-black text-[28px] md:text-[34px] tracking-tighter text-[#1a1a2e]"'
);
fs.writeFileSync('app/page.tsx', page, 'utf8');

// HEADER.TSX
let header = fs.readFileSync('app/components/Header.tsx', 'utf8');
// It currently has: className="font-black text-xl tracking-tight text-[#cc0000] text-3xl tracking-tighter"
header = header.replace(
  /className="font-black text-xl tracking-tight text-\[#cc0000\] text-3xl tracking-tighter"/g,
  'className="font-black text-[28px] md:text-[34px] tracking-tighter text-[#1a1a2e]"'
);
header = header.replace(
  /<span className="text-black">LG<\/span>/g,
  '<span className="text-[#e60000]">LİG</span>'
);
// wait, the text-black might be there because PRO is #cc0000, LİG is black.
// Let's make sure it matches the landing page: PRO is #1a1a2e (dark navy/black), LİG is #e60000 (red).
// So PRO LİG in Header should be:
header = header.replace(
  'text-[#1a1a2e]">PRO <span className="text-[#e60000]">LİG</span></span>',
  'text-[#1a1a2e]">PRO <span className="text-[#e60000]">LİG</span></span>'
);
fs.writeFileSync('app/components/Header.tsx', header, 'utf8');
console.log('Made PRO LIG text bigger!');
