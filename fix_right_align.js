const fs = require('fs');
let header = fs.readFileSync('app/components/Header.tsx', 'utf8');

// Change the parent container to push the remaining flex item to the right!
header = header.replace(
  '<div className="max-w-[1600px] mx-auto px-4 h-[70px] flex items-center justify-between relative">',
  '<div className="max-w-[1600px] mx-auto px-4 h-[70px] flex items-center justify-end relative">'
);

fs.writeFileSync('app/components/Header.tsx', header, 'utf8');
console.log('Fixed right alignment in Header.tsx');
