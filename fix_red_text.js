const fs = require('fs');
let page = fs.readFileSync('app/page.tsx', 'utf8');

// Replace the gold/burgundy gradient with bright red for the hero text
page = page.replace(
  /className="text-transparent bg-clip-text bg-gradient-to-r from-\[\#ceaa52\] to-\[\#9e1b22\]"/,
  'className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff3131] to-[#cc0000]"'
);

fs.writeFileSync('app/page.tsx', page, 'utf8');
console.log('Fixed red text!');
