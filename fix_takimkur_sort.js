const fs = require('fs');
let content = fs.readFileSync('app/takim-kur/page.tsx', 'utf8');

const injection = `
      if (data) {
        const sorted = [...data];
        const index8 = sorted.findIndex(c => c.id === 8);
        if (index8 > -1) {
           const item8 = sorted.splice(index8, 1)[0];
           sorted.splice(1, 0, item8);
        }
        
        setLeagues(sorted);
        if (sorted.length > 0) {
          setFormData(prev => ({ ...prev, leagueId: sorted[0].id.toString() }));
        }
      }
`;

const regex = /if \(data\) \{\s*setLeagues\(data\);\s*if \(data\.length > 0\) \{\s*setFormData\(prev => \(\{ \.\.\.prev, leagueId: data\[0\]\.id\.toString\(\) \}\)\);\s*\}\s*\}/m;

content = content.replace(regex, injection.trim());

fs.writeFileSync('app/takim-kur/page.tsx', content, 'utf8');
console.log('Fixed Takim Kur sorting!');
