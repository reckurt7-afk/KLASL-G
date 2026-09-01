const fs = require('fs');
let content = fs.readFileSync('app/components/TakimlarListesi.tsx', 'utf8');

const regex = /<div className="relative w-\[60px\].*?mb-4 group-hover:scale-110.*?">[\s\S]*?<Image src=\{takim.logo.*?className="object-contain.*?".*?\/>[\s\S]*?<\/div>/;

const newContainer = `<div className="relative w-[70px] h-[70px] md:w-[110px] md:h-[110px] mb-4 rounded-full bg-[#050505] border border-gray-800 shadow-[0_10px_20px_rgba(0,0,0,0.2)] flex items-center justify-center group-hover:scale-110 group-hover:border-[#ff3131]/50 transition-all duration-500 overflow-hidden">
                      <Image src={takim.logo || '/logos/default.png'} alt={takim.name} fill className="object-contain p-2" />
                    </div>`;

content = content.replace(regex, newContainer);

fs.writeFileSync('app/components/TakimlarListesi.tsx', content, 'utf8');
console.log('Fixed properly via Regex!');
