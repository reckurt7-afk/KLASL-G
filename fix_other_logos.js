const fs = require('fs');

try {
  let header = fs.readFileSync('app/components/Header.tsx', 'utf8');
  header = header.replace(
    'className="object-contain drop-shadow-sm rounded-full"',
    'className="object-cover drop-shadow-sm rounded-full border border-gray-200 aspect-square"'
  );
  fs.writeFileSync('app/components/Header.tsx', header, 'utf8');
} catch(e){}

try {
  let navbar = fs.readFileSync('app/components/Navbar.tsx', 'utf8');
  navbar = navbar.replace(
    'className="rounded-full object-cover group-hover:scale-110 transition-transform duration-500"',
    'className="rounded-full object-cover group-hover:scale-110 transition-transform duration-500 aspect-square"'
  );
  fs.writeFileSync('app/components/Navbar.tsx', navbar, 'utf8');
} catch(e){}
console.log('Fixed dashboard logos');
