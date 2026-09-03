const fs = require('fs');
let file = fs.readFileSync('app/api/mvp-vote/route.ts', 'utf8');
file = file.replace(
  /'apikey': SUPABASE_KEY,/g,
  `'apikey': SUPABASE_KEY || "",`
);
file = file.replace(
  /'Authorization': \`Bearer \$\{SUPABASE_KEY\}\`/g,
  `'Authorization': \`Bearer \$\{SUPABASE_KEY || ""\}\``
);
fs.writeFileSync('app/api/mvp-vote/route.ts', file, 'utf8');
console.log('Fixed API TypeScript error!');
