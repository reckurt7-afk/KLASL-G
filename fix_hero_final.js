const fs = require('fs');
let page = fs.readFileSync('app/page.tsx', 'utf8');

// Replace the section classes
page = page.replace(
  /className="relative w-full min-h-screen flex flex-col items-center justify-start bg-black pt-\[95px\] pb-6 overflow-hidden"/g,
  'className="relative w-full min-h-[calc(100vh-70px)] mt-[70px] flex flex-col items-center justify-start bg-black pt-4 md:pt-8 pb-6 overflow-hidden"'
);

fs.writeFileSync('app/page.tsx', page, 'utf8');
console.log("Fixed hero section height and margin!");
