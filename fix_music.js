const fs = require('fs');
let content = fs.readFileSync('app/page.tsx', 'utf8');

// Remove the mute button
content = content.replace(
  /               <button [\s\S]*?MÜZİĞİ (?:AÇ|KAPAT)[\s\S]*?<\/button>/,
  ''
);

// Replace audio tag to have autoplay
content = content.replace(
  '<audio ref={audioRef} loop src="/bg-music.mp3" />',
  '<audio ref={audioRef} loop autoPlay src="/bg-music.mp3" />'
);

// Modify the LandingPage component to play on first click
content = content.replace(
  /const toggleMute = \(\) => \{[\s\S]*?\};\n/,
  \useEffect(() => {
    const playMusic = () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play().catch(() => {});
      }
    };
    
    // Tarayıcı otomatik oynatmaya izin vermezse ilk tıklamada başlat
    document.addEventListener('click', playMusic, { once: true });
    
    return () => {
      document.removeEventListener('click', playMusic);
    };
  }, []);\n\
);

// Remove isMuted state
content = content.replace(/  const \[isMuted, setIsMuted\] = useState\(true\);\n/, '');

fs.writeFileSync('app/page.tsx', content, 'utf8');
console.log('Fixed music!');
