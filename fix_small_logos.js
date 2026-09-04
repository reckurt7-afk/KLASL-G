const fs = require('fs');

const fixCityStoryBar = () => {
  let file = 'app/components/CityStoryBar.tsx';
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace the old bad zoom with the clean white badge look
  content = content.replace(
    /<Image src="\/icons\/prime-logo\.jpg" alt=\{city\.name\} fill className="rounded-full object-cover scale-\[1\.4\] drop-shadow-sm" \/>/g,
    '<Image src="/icons/prime-logo.jpg" alt={city.name} fill className="rounded-full object-cover scale-[1.1] bg-white border border-[#ceaa52]" />'
  );
  
  fs.writeFileSync(file, content, 'utf8');
};

const fixNavbar = () => {
  let file = 'app/components/Navbar.tsx';
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(
    /className="rounded-full object-cover scale-\[1\.4\] group-hover:scale-\[1\.5\] transition-transform duration-500 aspect-square"/g,
    'className="rounded-full object-cover scale-[1.1] bg-white border-2 border-[#ceaa52] group-hover:scale-[1.15] transition-transform duration-500 aspect-square"'
  );
  fs.writeFileSync(file, content, 'utf8');
};

const fixFooter = () => {
  let file = 'app/components/Footer.tsx';
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(
    /<Image src="\/icons\/prime-logo\.jpg" alt="Prime Lig" fill className="rounded-full object-cover scale-\[1\.4\]" \/>/g,
    '<Image src="/icons/prime-logo.jpg" alt="Prime Lig" fill className="rounded-full object-cover scale-[1.1] bg-white border border-[#ceaa52]" />'
  );
  fs.writeFileSync(file, content, 'utf8');
};

const fixGiris = () => {
  ['app/giris/page.tsx', 'app/kayit/page.tsx'].forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(
      /className="rounded-full object-cover scale-\[1\.4\]"/g,
      'className="rounded-full object-cover scale-[1.1] bg-white border-2 border-[#ceaa52]"'
    );
    fs.writeFileSync(file, content, 'utf8');
  });
};

fixCityStoryBar();
fixNavbar();
fixFooter();
fixGiris();
console.log('Fixed all tiny logos to look like the homepage badge!');
