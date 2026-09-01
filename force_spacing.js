const fs = require('fs');
let page = fs.readFileSync('app/page.tsx', 'utf8');

// Logo margin bottom
page = page.replace(
  /mb-6 mt-6 md:mt-8/g,
  'mb-12 mt-4 md:mt-6'
);

// PWA button margin
page = page.replace(
  /max-w-\[320px\] md:max-w-\[400px\] mt-6/g,
  'max-w-[320px] md:max-w-[400px] mt-12'
);

// CTA buttons margin
page = page.replace(
  /w-full max-w-\[360px\] md:max-w-\[440px\] mt-10/g,
  'w-full max-w-[360px] md:max-w-[440px] mt-16'
);

fs.writeFileSync('app/page.tsx', page, 'utf8');
console.log("Forced massive spacing!");
