const fs = require('fs');
let content = fs.readFileSync('app/admin/page.tsx', 'utf8');

const newCard = `
    {
      title: "Takım Yönetimi",
      desc: "Kayıtlı takımları gör ve sil",
      link: "/admin/takim-yonetimi",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
    },
`;

content = content.replace('const ADMIN_CARDS = [', 'const ADMIN_CARDS = [' + newCard);
fs.writeFileSync('app/admin/page.tsx', content, 'utf8');
console.log('Admin card added!');
