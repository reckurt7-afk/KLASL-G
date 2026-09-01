const fs = require('fs');
let page = fs.readFileSync('app/page.tsx', 'utf8');

// Change the section to use a physical spacer div instead of padding/margin which Safari might ignore
page = page.replace(
  /className="relative w-full min-h-\[calc\(100vh-70px\)\] mt-\[70px\] flex flex-col items-center justify-start bg-black pt-4 md:pt-8 pb-6 overflow-hidden"/g,
  'className="relative w-full min-h-screen flex flex-col items-center justify-start bg-black pb-6 overflow-hidden"'
);

// Add the physical spacer right after the video background
page = page.replace(
  /<div className="absolute inset-0 bg-black\/60 z-0"><\/div>/g,
  '<div className="absolute inset-0 bg-black/60 z-0"></div>\n          {/* SAFARI SPACER - CANNOT BE IGNORED */}\n          <div className="w-full h-[95px] md:h-[110px] shrink-0 relative z-10"></div>'
);

fs.writeFileSync('app/page.tsx', page, 'utf8');
console.log("Safari physical spacer added!");
