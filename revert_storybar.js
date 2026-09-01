const fs = require('fs');

let content = fs.readFileSync('app/components/CityStoryBar.tsx', 'utf8');

// Put the full name back
content = content.replace(/\{city\.name\.replace\(\/\^PRO LİG \/i, ""\)\}/, '{city.name}');

// Increase the width of the container so the text fits beautifully
content = content.replace(/min-w-\[90px\]/g, 'min-w-[110px] px-1');

// Make sure text wraps properly
content = content.replace(/leading-tight text-center/, 'leading-tight text-center break-words w-full px-1');

fs.writeFileSync('app/components/CityStoryBar.tsx', content, 'utf8');
console.log("Restored names and widened boxes!");
