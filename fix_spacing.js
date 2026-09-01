const fs = require('fs');
let page = fs.readFileSync('app/page.tsx', 'utf8');

// Push logo up a bit relative to text, or add space between logo and text
page = page.replace(
  /<div className="relative flex items-center justify-center my-2 mt-4">/g,
  '<div className="relative flex items-center justify-center mb-6 mt-6 md:mt-8">'
);

// Push the Install PWA section down from the title
page = page.replace(
  /<div className="flex flex-col items-center w-full max-w-\[320px\] md:max-w-\[400px\]">/g,
  '<div className="flex flex-col items-center w-full max-w-[320px] md:max-w-[400px] mt-6">'
);

// Push the CTA Buttons down further
page = page.replace(
  /<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-\[360px\] md:max-w-\[440px\] mt-6">/g,
  '<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-[360px] md:max-w-[440px] mt-10">'
);

// Push Notifications Button down further
page = page.replace(
  /<div className="w-full max-w-\[360px\] md:max-w-\[440px\] mt-1 flex gap-2">/g,
  '<div className="w-full max-w-[360px] md:max-w-[440px] mt-3 flex gap-2">'
);

fs.writeFileSync('app/page.tsx', page, 'utf8');
console.log("Fixed spacing!");
