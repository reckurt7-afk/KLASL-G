const fs = require('fs');
let page = fs.readFileSync('app/page.tsx', 'utf8');

// Fix the header layout: use flex-1 to center the text safely without overlapping the right buttons
page = page.replace(
  /<Link href="\/" className="absolute left-1\/2 -translate-x-1\/2 flex items-center z-0">/g,
  '<Link href="/" className="flex-1 flex justify-center pr-10 sm:pr-0 z-0">'
);

// Reduce the text size slightly on mobile so it definitely fits without overlapping
page = page.replace(
  /text-\[26px\] md:text-\[30px\] tracking-tighter/g,
  'text-[24px] md:text-[30px] tracking-tighter'
);

// Move the hero section down by changing justify-center to justify-start and increasing pt
page = page.replace(
  /flex flex-col items-center justify-center bg-black pt-\[160px\] pb-16/g,
  'flex flex-col items-center justify-start bg-black pt-[180px] sm:pt-[200px] pb-16'
);

fs.writeFileSync('app/page.tsx', page, 'utf8');
console.log("Fixed mobile layout 2!");
