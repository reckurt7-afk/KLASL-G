const fs = require('fs');
let page = fs.readFileSync('app/page.tsx', 'utf8');

// Use standard Tailwind classes for padding top to ensure they compile reliably
page = page.replace(
  /bg-black pt-\[180px\] sm:pt-\[200px\] pb-16/g,
  'bg-black pt-48 pb-16' // pt-48 is 12rem = 192px
);

// Add massive margin-top directly to the logo wrapper just to force it down!
page = page.replace(
  /<div className="relative flex items-center justify-center mb-12 mt-4 md:mt-6">/g,
  '<div className="relative flex items-center justify-center mb-12 mt-20 md:mt-8">' // mt-20 is 5rem = 80px
);

fs.writeFileSync('app/page.tsx', page, 'utf8');
console.log("Forced top margin!");
