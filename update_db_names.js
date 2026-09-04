const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// We need the supabase URL and key. 
// They are in .env.local
const envContent = fs.readFileSync('.env.local', 'utf8');
let NEXT_PUBLIC_SUPABASE_URL = '';
let NEXT_PUBLIC_SUPABASE_ANON_KEY = '';

envContent.split('\n').forEach(line => {
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) NEXT_PUBLIC_SUPABASE_URL = line.split('=')[1].trim();
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) NEXT_PUBLIC_SUPABASE_ANON_KEY = line.split('=')[1].trim();
});

const supabase = createClient(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
  // Update cities table
  const { data: cities } = await supabase.from('cities').select('*');
  if (cities) {
    for (const city of cities) {
      if (city.name && city.name.includes('PRO LİG')) {
        const newName = city.name.replace('PRO LİG', 'PRİME LİG');
        console.log(`Updating city ${city.id}: ${city.name} -> ${newName}`);
        await supabase.from('cities').update({ name: newName }).eq('id', city.id);
      }
      else if (city.name && city.name.includes('Pro Lig')) {
        const newName = city.name.replace('Pro Lig', 'Prime Lig');
        console.log(`Updating city ${city.id}: ${city.name} -> ${newName}`);
        await supabase.from('cities').update({ name: newName }).eq('id', city.id);
      }
    }
  }
  
  console.log('Database updated successfully!');
}
run();
