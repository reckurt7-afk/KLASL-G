const fs = require('fs');
let header = fs.readFileSync('app/components/Header.tsx', 'utf8');

header = header.replace(
  '<span className="font-black text-[28px] md:text-[34px] tracking-tighter text-[#1a1a2e]">PRO <span className="text-black">LİG</span></span>',
  '<span className="font-black text-[28px] md:text-[34px] tracking-tighter text-[#1a1a2e]">PRO <span className="text-[#e60000]">LİG</span></span>'
);
// fallback for encoding
header = header.replace(
  /<span className="text-black">LG<\/span>/g,
  '<span className="text-[#e60000]">LİG</span>'
);
header = header.replace(
  /<span className="text-black">L.G<\/span>/g,
  '<span className="text-[#e60000]">LİG</span>'
);

fs.writeFileSync('app/components/Header.tsx', header, 'utf8');
console.log('Fixed header colors!');
