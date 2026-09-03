const fs = require('fs');
let header = fs.readFileSync('app/components/Header.tsx', 'utf8');

const regex = /{([\s\S]*?){([\s\S]*?)\/\/ Left: Logo([\s\S]*?)<Link href="\/".*?className="flex items-center gap-5">([\s\S]*?)<\/Link>([\s\S]*?)\/\/ Right:/;

// We will just do a simple replace
header = header.replace(
  '<Link href="/" className="flex items-center gap-5">',
  '<Link href="/" className="absolute left-1/2 -translate-x-1/2 flex items-center gap-5 z-10">'
);
header = header.replace(
  '<div className="max-w-[1600px] mx-auto px-4 h-[70px] flex items-center justify-between">',
  '<div className="max-w-[1600px] mx-auto px-4 h-[70px] flex items-center justify-between relative">'
);

fs.writeFileSync('app/components/Header.tsx', header, 'utf8');
console.log('Centered dashboard header logo!');
