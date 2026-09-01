const fs = require('fs');
let content = fs.readFileSync('app/takim-kur/page.tsx', 'utf8');

// Change default form data
content = content.replace(/setFormData\(prev => \(\{ \.\.\.prev, leagueId: sorted\[0\]\.id\.toString\(\) \}\)\);/, '');

// Add placeholder option
const selectRegex = /<select[\s\S]*?>/;
content = content.replace(selectRegex, match => match + '\n                  <option value="" disabled>Lütfen Katılacağınız Ligi Seçiniz</option>');

fs.writeFileSync('app/takim-kur/page.tsx', content, 'utf8');
console.log('Fixed Takim Kur dropdown placeholder!');
