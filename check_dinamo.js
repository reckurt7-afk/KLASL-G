const fs = require('fs');
const envContent = fs.readFileSync('.env.local', 'utf8');
const URL = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1].trim();
const KEY = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/)[1].trim();

async function run() {
  const res = await fetch(`${URL}/rest/v1/teams?select=name`, {
    headers: { 'apikey': KEY, 'Authorization': `Bearer ${KEY}` }
  });
  const data = await res.json();
  const dinamo = data.find(t => t.name.toLowerCase().includes("dinamo"));
  console.log("Found team:", dinamo ? dinamo.name : "Not found");
}
run();
