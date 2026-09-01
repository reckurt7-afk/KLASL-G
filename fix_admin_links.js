const fs = require('fs');
let page = fs.readFileSync('app/admin/page.tsx', 'utf8');

const newLink = `
  {
    title: "Oyuncu Yönetimi",
    desc: "Tüm oyuncuları düzenle ve takımlarını değiştir",
    link: "/admin/oyuncu-yonetimi",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    ),
  },`;

page = page.replace(
  /const ADMIN_CARDS = \[/g,
  'const ADMIN_CARDS = [' + newLink
);

fs.writeFileSync('app/admin/page.tsx', page, 'utf8');
console.log("Added Oyuncu Yonetimi to Admin Cards!");
