const fs = require('fs');
let content = fs.readFileSync('app/takim-kur/page.tsx', 'utf8');

content = content.replace(/await supabase\.from\("teams"\)\.insert\(\[\{\s*name: formData\.name,\s*league_id: parseInt\(formData\.leagueId\),\s*logo_url: logoUrl,\s*points: 0,\s*played: 0,\s*won: 0,\s*drawn: 0,\s*lost: 0,\s*goals_for: 0,\s*goals_against: 0\s*\}\]\)/, 
  'await supabase.from("takimlar").insert([{\n          ad: formData.name,\n          city_id: parseInt(formData.leagueId),\n          logo: logoUrl,\n          puan: 0,\n          oynanan: 0,\n          galibiyet: 0,\n          beraberlik: 0,\n          maglubiyet: 0,\n          atilan_gol: 0,\n          yenilen_gol: 0,\n          averaj: 0\n        }])');

fs.writeFileSync('app/takim-kur/page.tsx', content, 'utf8');
console.log('Fixed takim-kur!');
