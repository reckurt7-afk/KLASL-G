const sharp = require('sharp');
sharp('C:/Users/mac/.gemini/antigravity/brain/a0b3a536-1899-4314-97ff-20f319c44342/.user_uploaded/media_1787209643124.jpg')
  .metadata()
  .then(meta => {
    const minDim = Math.min(meta.width, meta.height);
    const radius = minDim / 2;
    const cx = meta.width / 2;
    const cy = meta.height / 2;
    const svg = `<svg width="${meta.width}px" height="${meta.height}px"><circle cx="${cx}" cy="${cy}" r="${radius}" fill="white"/></svg>`;
    return sharp('C:/Users/mac/.gemini/antigravity/brain/a0b3a536-1899-4314-97ff-20f319c44342/.user_uploaded/media_1787209643124.jpg')
      .ensureAlpha()
      .composite([{ input: Buffer.from(svg), blend: 'dest-in' }])
      .png()
      .toFile('public/logos/nova-fc.png');
  })
  .then(() => console.log('Done'))
  .catch(console.error);
