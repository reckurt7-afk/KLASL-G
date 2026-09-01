const fs = require('fs');
let content = fs.readFileSync('app/takim-kur/page.tsx', 'utf8');

// 1. Remove the default selection
content = content.replace(/setFormData\(prev => \(\{ \.\.\.prev, leagueId: sorted\[0\]\.id\.toString\(\) \}\)\);/, '');

// 2. Add placeholder properly inside the <select>
const newSelect = `<select 
                value={formData.leagueId} 
                onChange={e => setFormData({...formData, leagueId: e.target.value})} 
                className="w-full bg-gray-50 border border-gray-200 focus:border-[#ff3131] focus:ring-1 focus:ring-[#ff3131] rounded-xl p-4 text-gray-900 font-bold outline-none transition-all cursor-pointer appearance-none"
              >
                <option value="" disabled>Lütfen Katılacağınız Ligi Seçiniz</option>
                {leagues.map(l => (`;

content = content.replace(/<select[\s\S]*?>[\s]*\{leagues\.map\(l => \(/, newSelect);

fs.writeFileSync('app/takim-kur/page.tsx', content, 'utf8');
console.log('Fixed properly!');
