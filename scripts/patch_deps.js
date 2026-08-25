const fs = require('fs');
const path = require('path');

const files = [
  'app/components/GundemCarousel.tsx',
  'app/components/HaftaninYedisi.tsx',
  'app/components/IstatistikTablosu.tsx',
  'app/components/MacSaatleriListesi.tsx',
  'app/components/MacSonuclariSlider.tsx',
  'app/components/TransferBorsasi.tsx',
  'app/lig/page.tsx'
];

files.forEach(file => {
  const fullPath = path.join(process.cwd(), file);
  if (!fs.existsSync(fullPath)) {
    console.log(`File missing: ${fullPath}`);
    return;
  }
  
  let content = fs.readFileSync(fullPath, 'utf8');
  let changed = false;

  // Ensure useCityStore is imported
  if (!content.includes('useCityStore')) {
    // Add import after first import
    content = content.replace(/(import .*?;)/, `$1\nimport { useCityStore } from "@/app/store/cityStore";`);
    changed = true;
  }

  // Ensure selectedCityId is extracted inside the component
  if (!content.includes('const { selectedCityId } = useCityStore()') && !content.includes('selectedCityId:')) {
    // Find component function start
    const compRegex = /export default function (\w+)\([^)]*\) \{/;
    if (compRegex.test(content)) {
      content = content.replace(compRegex, (match) => {
        return match + '\n  const { selectedCityId } = useCityStore();\n';
      });
      changed = true;
    }
  }

  // Replace useEffect(() => { ... }, []) with useEffect(() => { ... }, [selectedCityId])
  if (content.includes('useEffect(')) {
    content = content.replace(/useEffect\(([\s\S]*?), \[\]\);/g, 'useEffect($1, [selectedCityId]);');
    content = content.replace(/useEffect\(([\s\S]*?), \[\]\)/g, 'useEffect($1, [selectedCityId])');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(fullPath, content);
    console.log(`Updated ${file}`);
  }
});
