'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Instagram,
  Mail,
  Github,
  Linkedin,
} from 'lucide-react';
import {
  useRef,
  useState,
} from 'react';
import { ContactSection } from '@/components/contact-section';
import { TechStack } from '@/components/tech-stack';
import { FeaturedProjects } from '@/components/featured-projects';

// Interactive floating profile card
function ProfileCard() {
  const coreRef = useRef<HTMLDivElement>(null);

  const [rotate, setRotate] = useState({
    x: 0,
    y: 0,
  });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!coreRef.current) return;

    const rect = coreRef.current.getBoundingClientRect();

    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    setRotate({
      x: -(y / rect.height) * 18,
      y: (x / rect.width) * 18,
    });
  };

  return (
    <div
      className="ai-core-wrapper"
      onMouseMove={handleMove}
      onMouseLeave={() => setRotate({ x: 0, y: 0 })}
    >
      {/* Background glow */}
      <div className="core-ambient-glow" />

      {/* Floating UI Labels */}
      <div className="hud hud-1">FULL STACK</div>
      <div className="hud hud-2">UI/UX</div>
      <div className="hud hud-3">FIGMA</div>
      <div className="hud hud-4">REACT</div>

      {/* Orbit particles */}
      <div className="particle particle-1" />
      <div className="particle particle-2" />
      <div className="particle particle-3" />
      <div className="particle particle-4" />

      {/* AI Core */}
      <div
        ref={coreRef}
        className="ai-core"
        style={{
          transform: `
            perspective(1200px)
            rotateX(${rotate.x}deg)
            rotateY(${rotate.y}deg)
          `,
        }}
      >
        {/* Rotating rings - ORIGINAL SIZES */}
        <div className="ring ring-1" />
        <div className="ring ring-2" />
        <div className="ring ring-3" />

        {/* Center image */}
        <div className="core-image-wrap">
          <div className="core-image-glow" />

          <Image
            src="/gervin-picture.jpg"
            alt="Gervin Lee Enero"
            fill
            priority
            className="object-cover rounded-full"
          />
        </div>

        {/* Scanning line */}
        <div className="scanner-line" />

        {/* Core label */}
        <div className="core-label">
          <span className="core-dot" />
          Available
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      {/* Scoped styles */}
      <style>{`
        .ai-core-wrapper {
          position: relative;
          width: 100%;
          height: 620px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: visible;
        }

        .ai-core {
          position: relative;
          width: 360px;
          height: 360px;
          border-radius: 999px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.15s ease;
          transform-style: preserve-3d;
        }

        .ring {
          position: absolute;
          border-radius: 999px;
          border: 1px solid rgba(255,160,70,0.28);
        }

        .ring-1 {
          width: 290px;
          height: 290px;
          animation: spinRing 10s linear infinite;
        }

        .ring-2 {
          width: 340px;
          height: 340px;
          border-style: dashed;
          animation: spinReverse 14s linear infinite;
        }

        .ring-3 {
          width: 390px;
          height: 390px;
          opacity: 0.4;
          animation: pulseRing 4s ease-in-out infinite;
        }

        @keyframes spinRing {
          to { transform: rotate(360deg); }
        }

        @keyframes spinReverse {
          to { transform: rotate(-360deg); }
        }

        @keyframes pulseRing {
          0%,100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.04); opacity: 0.6; }
        }

        .core-label {
          position: absolute;
          bottom: -55px;
          padding: 10px 18px;
          border-radius: 999px;
          background: rgba(10,10,10,0.7);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(74, 222, 128, 0.3);
          color: #4ade80;
          font-size: 0.75rem;
          letter-spacing: 0.22em;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .core-dot {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: #4ade80;
          box-shadow: 0 0 10px #4ade80, 0 0 25px #4ade80;
        }

        .scanner-line {
          position: absolute;
          width: 250px;
          height: 4px;
          background: linear-gradient(to right, transparent, rgba(255,180,90,0.9), transparent);
          filter: blur(1px);
          animation: scanMove 3s linear infinite;
          z-index: 10;
        }

        @keyframes scanMove {
          0% { transform: translateY(-120px); opacity: 0; }
          15% { opacity: 1; }
          50% { transform: translateY(0px); }
          100% { transform: translateY(120px); opacity: 0; }
        }

        .core-ambient-glow {
          position: absolute;
          width: 600px;
          height: 600px;
          border-radius: 999px;
          background: radial-gradient(circle, rgba(255,140,40,0.18), transparent 65%);
          filter: blur(60px);
        }

        .hud {
          position: absolute;
          padding: 8px 14px;
          border-radius: 999px;
          background: rgba(20,20,20,0.55);
          border: 1px solid rgba(255,160,70,0.2);
          backdrop-filter: blur(10px);
          color: rgba(255,190,120,0.9);
          font-size: 0.7rem;
          letter-spacing: 0.12em;
          font-weight: 700;
          box-shadow: 0 0 20px rgba(255,140,40,0.15);
          animation: hudFloat 5s ease-in-out infinite;
        }

        .hud-1 { top: 18%; left: -2%; }
        .hud-2 { top: 12%; right: 0%; }
        .hud-3 { bottom: 22%; left: 2%; }
        .hud-4 { bottom: 15%; right: 4%; }

        @keyframes hudFloat {
          0%,100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }

        .particle {
          position: absolute;
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: #ff9a3d;
          box-shadow: 0 0 15px #ff9a3d, 0 0 30px rgba(255,140,40,0.7);
          animation: orbitFloat 6s ease-in-out infinite;
        }

        .particle-1 { top: 18%; left: 22%; }
        .particle-2 { top: 28%; right: 18%; animation-delay: 1s; }
        .particle-3 { bottom: 22%; left: 18%; animation-delay: 2s; }
        .particle-4 { bottom: 14%; right: 22%; animation-delay: 3s; }

        @keyframes orbitFloat {
          0%,100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-15px) scale(1.15); }
        }

        .typing-text {
          display: inline-block;
          overflow: hidden;
          white-space: nowrap;
          border-right: 3px solid #f97316;
          width: 0ch;
          animation: typing 4s steps(38, end) infinite, blinkCursor 0.8s step-end infinite;
        }

        @keyframes typing {
          0% { width: 0ch; }
          40%, 60% { width: 26ch; }
          100% { width: 0ch; }
        }

        @keyframes blinkCursor { 50% { border-color: transparent; } }

        /* Mobile Hero Adjustments */
        @media (max-width: 768px) {
          .ai-core-wrapper { height: 360px; }
          .ai-core { width: 255px; height: 255px; }
        }

        @media (max-width: 480px) {
          .ai-core-wrapper { height: 320px; }
          .ai-core { width: 230px; height: 230px; }
        }

        .social-icons {
          gap: 12px;
        }

        .social-icons a {
          padding: 14px;
        }

        @media (max-width: 360px) {
          .social-icons { gap: 10px; }
          .social-icons a { padding: 12px; }
        }
      `}</style>

      <main className="min-h-screen relative z-10 overflow-x-hidden">

        {/* Background layer */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 circuit-bg opacity-50" />
          <div className="absolute inset-0 dots-bg opacity-30" />
        </div>

        {/* HERO SECTION */}
        <section className="relative overflow-hidden h-[100dvh] flex items-center">
          {/* Hero BG image */}
          <div
            className="absolute inset-0 -z-20 bg-cover bg-center bg-no-repeat transition-all duration-500 dark:brightness-[0.45] brightness-[0.95]"
            style={{ backgroundImage: "url('/assets/city2.jpg')" }}
          />

          {/* Overlays */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-white/97 via-white/82 to-white/20 dark:from-black/92 dark:via-black/72 dark:to-black/20" />
          <div className="absolute inset-0 -z-10 bg-orange-500/[0.04] dark:bg-orange-500/[0.06]" />
          <div className="absolute inset-0 z-10 pointer-events-none circuit-overlay" />

          {/* Main Content */}
          <div className="relative z-20 w-full h-full flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center h-full">
                {/* LEFT CONTENT */}
                <div className="flex flex-col justify-center order-2 lg:order-1 text-center lg:text-left py-6 lg:py-0">
                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-[0.95] tracking-tight mb-4 sm:mb-6">
                    <span className="gradient-text">Gervin Lee</span>
                    <br />
                    <span className="text-foreground">Enero</span>
                  </h1>

                  <div className="text-lg sm:text-xl md:text-2xl text-orange-600 dark:text-orange-300 font-semibold mb-4 sm:mb-6 h-[28px] sm:h-[32px] md:h-[40px] flex items-center justify-center lg:justify-start">
                    <span className="typing-text">Aspiring Developer & UI/UX Designer</span>
                  </div>

                  <p className="text-sm sm:text-base md:text-lg leading-relaxed text-zinc-700 dark:text-zinc-300 max-w-2xl mx-auto lg:mx-0 mb-6 sm:mb-8">
                    A passionate BSIT student from Valenzuela City, Philippines, specializing in full-stack web development, responsive interfaces, and modern digital experiences.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start mb-8 w-full">
                    <Link
                      href="/projects"
                      className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 group w-full sm:w-auto"
                    >
                      View My Work
                      <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <Link
                      href="/about"
                      className="inline-flex items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl border border-orange-500/20 bg-white/60 dark:bg-white/5 backdrop-blur-md text-foreground font-semibold hover:bg-orange-500/10 transition-all duration-300 w-full sm:w-auto"
                    >
                      Learn More
                    </Link>
                  </div>

                  <div className="social-icons flex gap-3 sm:gap-4 justify-center lg:justify-start">
                    {[
                      { href: 'mailto:gervinlee10@gmail.com', Icon: Mail, label: 'Email' },
                      { href: 'https://github.com', Icon: Github, label: 'GitHub' },
                      { href: 'https://linkedin.com', Icon: Linkedin, label: 'LinkedIn' },
                      { href: 'https://instagram.com/gervin_lde', Icon: Instagram, label: 'Instagram' },
                    ].map(({ href, Icon, label }) => (
                      <a
                        key={label}
                        href={href}
                        target={href.startsWith('mailto') ? undefined : '_blank'}
                        rel={href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                        className="p-4 rounded-2xl border border-orange-500/15 bg-white/60 dark:bg-white/5 backdrop-blur-md hover:bg-orange-500/10 hover:scale-110 transition-all duration-300"
                      >
                        <Icon className="w-6 h-6 text-orange-600 dark:text-orange-300" />
                      </a>
                    ))}
                  </div>
                </div>

                {/* RIGHT CONTENT */}
                <div className="flex items-center justify-center order-1 lg:order-2">
                  <ProfileCard />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── TECH STACK SECTION ── */}
        <TechStack />

        {/* ── FEATURED PROJECTS SECTION ── */}
        <FeaturedProjects />

        {/* ── CONTACT SECTION ── */}
        <ContactSection />

        {/* ── FOOTER ── */}
        <footer className="py-8 px-4 border-t border-border/50">
        <div className="max-w-7xl mx-auto text-center text-sm text-foreground/40">
          <p>&copy; 2026 Gervin Lee Enero. All rights reserved.</p>
        </div>
      </footer>
      </main>
    </>
  );
}