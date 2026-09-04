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
  const { data: settings } = await supabase.from('ayarlar').select('*');
  let updated = 0;
  if (settings) {
    for (const s of settings) {
      if (s.deger && typeof s.deger === 'string' && s.deger.includes('PRO LİG')) {
        const newVal = s.deger.replace(/PRO LİG/g, 'PRİME LİG');
        console.log(`Updating setting ${s.anahtar}`);
        await supabase.from('ayarlar').update({ deger: newVal }).eq('id', s.id);
        updated++;
      }
    }
  }
  console.log(`Updated ${updated} settings!`);
}
run();
