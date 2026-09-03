const fs = require('fs');
let page = fs.readFileSync('app/page.tsx', 'utf8');

// Fix Header Logo
page = page.replace(
  'className="object-contain md:w-[48px] md:h-[48px] rounded-full shadow-md"',
  'className="object-cover md:w-[48px] md:h-[48px] rounded-full shadow-md border border-gray-200"'
);

// Fix Central Hero Logo
page = page.replace(
  'className="object-contain drop-shadow-2xl z-10 w-[140px] md:w-[180px] h-auto"',
  'className="object-cover drop-shadow-[0_0_20px_rgba(212,175,55,0.4)] z-10 w-[140px] h-[140px] md:w-[180px] md:h-[180px] rounded-full border-2 border-[#d4af37]"'
);

fs.writeFileSync('app/page.tsx', page, 'utf8');
console.log('Made logo round and beautiful!');
