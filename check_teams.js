const fs = require('fs');
const envContent = fs.readFileSync('.env.local', 'utf8');
const URL = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1].trim();
const KEY = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/)[1].trim();

async function run() {
  const res = await fetch(`${URL}/rest/v1/teams?select=id,name,league_id`, {
    headers: { 'apikey': KEY, 'Authorization': `Bearer ${KEY}` }
  });
  const teams = await res.json();
  console.log("Total teams:", teams.length);
  const inLeague8 = teams.filter(t => t.league_id === 8);
  console.log("Teams in league 8 (4. Sezon):", inLeague8.length);
}
run();
