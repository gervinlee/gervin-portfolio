'use client';

import { useEffect, useState } from 'react';

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Show splash screen for 10.5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 10500);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="splash-screen fixed inset-0 z-[9999] bg-gradient-to-br from-background via-background to-background flex items-center justify-center">
      {/* Background blur effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Logo Container */}
      <div className="relative flex flex-col items-center justify-center gap-4">
        {/* Pop Animation Logo */}
        <div className="animate-pop">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-4xl sm:text-5xl font-bold shadow-2xl">
            GLE
          </div>
        </div>

        {/* Portfolio Text */}
        <div className="text-center animate-pop" style={{ animationDelay: '0.1s' }}>
          <h1 className="text-2xl sm:text-3xl font-bold gradient-text">Gervin Lee</h1>
          <p className="text-sm sm:text-base text-foreground/60 mt-2">Portfolio</p>
        </div>

        {/* Loading dots */}
        <div className="flex gap-2 mt-6">
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
}
