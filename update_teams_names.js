const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envContent = fs.readFileSync('.env.local', 'utf8');
let NEXT_PUBLIC_SUPABASE_URL = '';
let NEXT_PUBLIC_SUPABASE_ANON_KEY = '';

envContent.split('\n').forEach(line => {
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) NEXT_PUBLIC_SUPABASE_URL = line.split('=')[1].trim();
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) NEXT_PUBLIC_SUPABASE_ANON_KEY = line.split('=')[1].trim();
});

const supabase = createClient(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
  const { data: teams } = await supabase.from('takimlar').select('*');
  let updated = 0;
  if (teams) {
    for (const team of teams) {
      if (team.ad && team.ad.includes('PRO LİG')) {
        const newName = team.ad.replace('PRO LİG', 'PRİME LİG');
        console.log(`Updating team ${team.id}: ${team.ad} -> ${newName}`);
        await supabase.from('takimlar').update({ ad: newName }).eq('id', team.id);
        updated++;
      }
      else if (team.ad && team.ad.includes('Pro Lig')) {
        const newName = team.ad.replace('Pro Lig', 'Prime Lig');
        console.log(`Updating team ${team.id}: ${team.ad} -> ${newName}`);
        await supabase.from('takimlar').update({ ad: newName }).eq('id', team.id);
        updated++;
      }
    }
  }
  console.log(`Updated ${updated} teams!`);
}
run();
