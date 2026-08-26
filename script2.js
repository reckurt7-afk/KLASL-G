const fs = require('fs');
let code = fs.readFileSync('app/page.tsx', 'utf8');

if (!code.includes('useState')) {
  code = code.replace('import Image from "next/image";', 'import { useState, useRef } from "react";\nimport Image from "next/image";');
}

code = code.replace('export default function Splash() {', 'export default function Splash() {\n  const [isMuted, setIsMuted] = useState(true);\n  const videoRef = useRef<HTMLVideoElement>(null);');

const oldBlock = code.substring(code.indexOf('{/* Background MP4 Video */}'), code.indexOf('{/* Hafif Karartma') + 90);

const newBlock = \{/* Background MP4 Video */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-black">
          <video 
            ref={videoRef}
            autoPlay 
            loop 
            muted={isMuted}
            playsInline
            preload="auto"
            onEnded={(e) => {
              e.currentTarget.currentTime = 0;
              e.currentTarget.play().catch(() => {});
            }}
            className="absolute top-1/2 left-1/2 w-full h-full object-cover -translate-x-1/2 -translate-y-1/2"
          >
            <source src="/hero-bg-2.mp4" type="video/mp4" />
          </video>
        </div>
        
        {/* Mute Toggle Button */}
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className="absolute bottom-10 right-10 z-[100] bg-black/60 hover:bg-black/80 text-white p-3.5 rounded-full backdrop-blur-md transition-all shadow-[0_0_20px_rgba(0,0,0,0.5)] border border-white/20"
          aria-label="Sesi Aç / Kapat"
        >
          {isMuted ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
          )}
        </button>

        {/* Hafif Karartma (Sadece yazilarin okunabilmesi icin) */}
        <div className="absolute inset-0 z-10 bg-black/40 pointer-events-none"></div>\;

code = code.replace(oldBlock, newBlock);
fs.writeFileSync('app/page.tsx', code);
