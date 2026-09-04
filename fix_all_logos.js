const fs = require('fs');

const fixNavbar = () => {
  let file = 'app/components/Navbar.tsx';
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(
    /className="rounded-full object-cover group-hover:scale-110 transition-transform duration-500 aspect-square"/g,
    'className="rounded-full object-cover scale-[1.4] group-hover:scale-[1.5] transition-transform duration-500 aspect-square"'
  );
  fs.writeFileSync(file, content, 'utf8');
};

const fixGiris = () => {
  ['app/giris/page.tsx', 'app/kayit/page.tsx'].forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(
      /style=\{\{ objectFit: "contain", filter: "drop-shadow\(0 0 10px rgba\(0,0,0,0.1\)\)" \}\}/g,
      'className="rounded-full object-cover scale-[1.4]" style={{ filter: "drop-shadow(0 0 10px rgba(0,0,0,0.1))" }}'
    );
    fs.writeFileSync(file, content, 'utf8');
  });
};

const fixFooter = () => {
  let file = 'app/components/Footer.tsx';
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(
    /<Image src="\/icons\/prime-logo\.jpg" alt="Prime Lig" fill className="object-cover" \/>/g,
    '<Image src="/icons/prime-logo.jpg" alt="Prime Lig" fill className="rounded-full object-cover scale-[1.4]" />'
  );
  fs.writeFileSync(file, content, 'utf8');
};

fixNavbar();
fixGiris();
fixFooter();
console.log('Fixed all tiny logos!');
