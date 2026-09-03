const fs = require('fs');
let page = fs.readFileSync('app/page.tsx', 'utf8');

// Replace the hard crop with a blend mode version
page = page.replace(
  'shadow-[0_0_30px_rgba(212,175,55,0.6)] z-10 flex items-center justify-center bg-black"',
  'shadow-[0_0_30px_rgba(212,175,55,0.6)] z-10 flex items-center justify-center bg-transparent mix-blend-screen"'
);

fs.writeFileSync('app/page.tsx', page, 'utf8');
console.log('Added mix-blend-screen!');
