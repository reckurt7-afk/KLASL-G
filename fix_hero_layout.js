const fs = require('fs');

let page = fs.readFileSync('app/page.tsx', 'utf8');

// Fix Header layout: center the PRİME LİG text and keep logo left (pushed slightly right)
page = page.replace(
  /<Link href="\/" className="flex items-center gap-4 md:gap-5 shrink-0">([\s\S]*?)<Image src="\/icons\/logo\.png" width=\{64\} height=\{64\} alt="Prime Lig Logo" className="rounded-full object-contain md:w-\[70px\] md:h-\[70px\]" \/>\s*<span className="font-black text-\[#0f172a\] text-\[26px\] md:text-\[30px\] tracking-tighter">PRİME <span className="text-\[#d4af37\]">LİG<\/span><\/span>\s*<\/Link>/i,
  `<Link href="/" className="flex items-center shrink-0 pl-2 md:pl-4 z-10">
              <Image src="/icons/logo.png" width={64} height={64} alt="Prime Lig Logo" className="rounded-full object-contain md:w-[70px] md:h-[70px]" />
            </Link>
            <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex items-center z-0">
              <span className="font-black text-[#0f172a] text-[26px] md:text-[30px] tracking-tighter">PRİME <span className="text-[#d4af37]">LİG</span></span>
            </Link>`
);

// Fix Hero section padding to push things down
page = page.replace(/pt-\[90px\] pb-16/g, 'pt-[160px] pb-16');

fs.writeFileSync('app/page.tsx', page, 'utf8');
console.log('Fixed mobile layout!');
