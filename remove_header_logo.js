const fs = require('fs');

// PAGE.TSX
let page = fs.readFileSync('app/page.tsx', 'utf8');

// Remove the small logo div
const pageRegex = /<div className="w-\[44px\] h-\[44px\] md:w-\[48px\] md:h-\[48px\] rounded-full overflow-hidden border border-gray-200 shadow-md shrink-0">[\s\S]*?<\/div>/;
page = page.replace(pageRegex, '');

// Nudge text left
page = page.replace(
  'className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 md:gap-3 shrink-0 z-10"',
  'className="absolute left-1/2 -translate-x-1/2 flex items-center shrink-0 z-10 -ml-2 md:-ml-4"'
);

fs.writeFileSync('app/page.tsx', page, 'utf8');

// HEADER.TSX
let header = fs.readFileSync('app/components/Header.tsx', 'utf8');

const headerRegex = /<Image src="\/icons\/prolig-logo-final\.jpg" width=\{60\} height=\{60\} alt="Pro Lig" className="object-cover drop-shadow-sm rounded-full border border-gray-200 aspect-square" \/>/;
header = header.replace(headerRegex, '');

header = header.replace(
  'className="absolute left-1/2 -translate-x-1/2 flex items-center gap-5 z-10"',
  'className="absolute left-1/2 -translate-x-1/2 flex items-center z-10 -ml-2 md:-ml-4"'
);

fs.writeFileSync('app/components/Header.tsx', header, 'utf8');
console.log('Removed header logo and nudged text left!');
