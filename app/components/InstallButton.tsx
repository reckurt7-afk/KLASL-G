"use client";

import { useEffect, useState } from "react";

export default function InstallButton() {
  const [loading, setLoading] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);

  useEffect(() => {
    // Detect if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
    }

    // Detect iOS
    const ua = window.navigator.userAgent;
    const isIOSDevice = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    const handler = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);
    
    // Listen for installation
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const installApp = async () => {
    if (isInstalled) return;

    if (isIOS) {
      setShowIOSPrompt(true);
      setTimeout(() => setShowIOSPrompt(false), 8000);
      return;
    }

    if (!installPrompt) {
      alert("Cihazınızda otomatik yükleme desteklenmiyor. Tarayıcı menüsünden 'Ana Ekrana Ekle' (Add to Home Screen) seçeneğini kullanabilirsiniz.");
      return;
    }

    setLoading(true);

    try {
      await installPrompt.prompt();
      const choiceResult = await installPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
      }
    } catch (err) {
      console.error("Yükleme hatası:", err);
    }

    setInstallPrompt(null);
    setLoading(false);
  };

  if (isInstalled) {
    return (
      <div className="w-full max-w-[340px] flex flex-col items-center mx-auto">
        <button 
          disabled
          className="bg-green-500/10 text-green-500 border border-green-500/30 rounded-xl px-6 h-[56px] flex items-center justify-center gap-3 w-full font-black text-[15px] shadow-sm cursor-default"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          PRO LİG YÜKLÜ
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-[340px] mx-auto flex flex-col items-center">
      <button
        onClick={installApp}
        disabled={loading}
        className="group relative overflow-hidden bg-[#1e3a8a] hover:bg-[#cc0000] text-white rounded-xl px-6 h-[56px] flex items-center justify-center gap-3 w-full font-black text-[15px] shadow-[0_4px_20px_rgba(230,0,0,0.4)] hover:shadow-[0_6px_25px_rgba(230,0,0,0.5)] transition-all hover:-translate-y-0.5"
      >
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)] -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out"></div>
        {loading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
        )}
        PRO LİG'İ TELEFONA YÜKLE
      </button>
      
      {showIOSPrompt && (
        <div className="absolute -bottom-[80px] left-1/2 -translate-x-1/2 w-[280px] bg-[#1a1a2e] text-white text-[12px] p-3 rounded-lg shadow-xl border border-white/10 text-center z-50 animate-fade-in">
          iPhone'a yüklemek için Safari menüsünden <br/>
          <span className="font-bold text-[#1e3a8a]">"Paylaş"</span> ikonuna tıklayıp <br/>
          <span className="font-bold text-[#1e3a8a]">"Ana Ekrana Ekle"</span> seçeneğini kullanın.
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#1a1a2e] border-t border-l border-white/10 rotate-45"></div>
        </div>
      )}
    </div>
  );
}