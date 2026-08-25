const sharp = require('sharp');
const svg = '<svg width="1024px" height="946px"><circle cx="512" cy="473" r="460" fill="white"/></svg>';
sharp('public/logos/ps5.jpg')
  .ensureAlpha()
  .composite([{ input: Buffer.from(svg), blend: 'dest-in' }])
  .png()
  .toFile('public/logos/ps5.png')
  .then(() => console.log('Done'))
  .catch(console.error);
