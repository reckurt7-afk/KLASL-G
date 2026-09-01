const https = require('https');
https.get('https://prolig.vercel.app/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    if (data.includes('mt-[70px]')) {
      console.log('YES: Found mt-[70px]');
    } else {
      console.log('NO: Did not find mt-[70px]');
    }
  });
});
