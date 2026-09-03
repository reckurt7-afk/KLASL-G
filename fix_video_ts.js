const fs = require('fs');
let page = fs.readFileSync('app/page.tsx', 'utf8');

page = page.replace(
  'muted={isMuted} defaultMuted',
  'muted={isMuted}'
);

page = page.replace(
  'const videoRef = useRef<HTMLVideoElement>(null);',
  'const videoRef = useRef<HTMLVideoElement>(null);\n  useEffect(() => { if (videoRef.current) { videoRef.current.defaultMuted = true; } }, []);'
);

fs.writeFileSync('app/page.tsx', page, 'utf8');
console.log('Fixed TS error!');
