const fs = require('fs');

function updatePageHeader() {
  let content = fs.readFileSync('app/page.tsx', 'utf8');
  // Update logo size
  content = content.replace(/width=\{44\} height=\{44\}/g, 'width={64} height={64}');
  content = content.replace(/md:w-\[48px\] md:h-\[48px\]/g, 'md:w-[70px] md:h-[70px]');
  // Update text gap and size
  content = content.replace(/className="flex items-center gap-2 md:gap-3 shrink-0"/g, 'className="flex items-center gap-4 md:gap-5 shrink-0"');
  // Update PRO LİG text colors to match logo (PRO is Dark Blue/Black, LİG is Gold)
  content = content.replace(/text-\[#1a1a2e\]">PRO <span className="text-\[#e60000\]"/g, 'text-[#0f172a] text-[24px] md:text-[28px]">PRO <span className="text-[#d4af37]"');
  fs.writeFileSync('app/page.tsx', content, 'utf8');
}

function updateHeader() {
  let content = fs.readFileSync('app/components/Header.tsx', 'utf8');
  content = content.replace(/width=\{40\} height=\{40\}/g, 'width={60} height={60}');
  content = content.replace(/className="flex items-center gap-3"/g, 'className="flex items-center gap-5"');
  content = content.replace(/text-gray-900">PRO <span className="text-\[#e60000\]"/g, 'text-gray-900 text-2xl">PRO <span className="text-[#d4af37]"');
  fs.writeFileSync('app/components/Header.tsx', content, 'utf8');
}

function updateNavbar() {
  let content = fs.readFileSync('app/components/Navbar.tsx', 'utf8');
  content = content.replace(/w-\[50px\] h-\[50px\]/g, 'w-[70px] h-[70px]');
  content = content.replace(/className="flex items-center gap-3 group"/g, 'className="flex items-center gap-5 group"');
  content = content.replace(/group-hover:text-\[#ff3131\]/g, 'group-hover:text-[#d4af37]');
  content = content.replace(/text-\[10px\] text-\[#ff3131\]/g, 'text-[11px] text-[#d4af37]');
  fs.writeFileSync('app/components/Navbar.tsx', content, 'utf8');
}

updatePageHeader();
updateHeader();
updateNavbar();
console.log('Updated headers!');
