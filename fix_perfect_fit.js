const fs = require('fs');
let page = fs.readFileSync('app/page.tsx', 'utf8');

// 1. Fix the top padding so it just clears the header (pt-[95px]) and stays justify-start
page = page.replace(
  /bg-black pt-48 pb-16/g,
  'bg-black pt-[95px] pb-6'
);

// 2. Fix the Logo margin to be normal (it had mb-12 mt-20)
page = page.replace(
  /<div className="relative flex items-center justify-center mb-12 mt-20 md:mt-8">/g,
  '<div className="relative flex items-center justify-center mb-3 mt-4 md:mt-6">'
);

// 3. Fix the PWA button margin (it had mt-12)
page = page.replace(
  /max-w-\[320px\] md:max-w-\[400px\] mt-12/g,
  'max-w-[320px] md:max-w-[400px] mt-4'
);

// 4. Fix the CTA Buttons margin (it had mt-16)
page = page.replace(
  /w-full max-w-\[360px\] md:max-w-\[440px\] mt-16/g,
  'w-full max-w-[360px] md:max-w-[440px] mt-6'
);

fs.writeFileSync('app/page.tsx', page, 'utf8');
console.log("Perfect fit applied!");
