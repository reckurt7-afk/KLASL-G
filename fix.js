const fs = require('fs');

let content = fs.readFileSync('app/admin/canli-mac/page.tsx', 'utf8');

const fetchToRemove = /if \(canli\) \{\s*await fetch\("\/api\/send-notification"[\s\S]*?\}\);?\s*\}/;
content = content.replace(fetchToRemove, '');

const fixes = [
  ['Y??', '🏁'],
  ['-', '▶'],
  ['s', '⚽'],
  ['Y?', '🎯'],
  ['Y""', '🔄'],
  ['?', '⏸'],
  ['YY', '🟥'],
];

for(const [bad, good] of fixes) {
  content = content.split(bad).join(good);
}

// Ensure golSesiCal is properly written in the buttons
content = content.replace(/className=\"w-10 h-10 rounded-full bg-\[\#e60000\]/g, 'className="w-10 h-10 rounded-full bg-[#e60000]');

fs.writeFileSync('app/admin/canli-mac/page.tsx', content);
console.log('Fixed duplicate fetch and encodings');
