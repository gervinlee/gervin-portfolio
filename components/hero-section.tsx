'use client';

import Link from 'next/link';
import { ArrowRight, Instagram, Mail, Github, Linkedin } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { CrystalPortrait } from './crystal-portrait';

const SOCIAL_LINKS = [
  { href: 'mailto:gervinlee10@gmail.com', Icon: Mail },
  { href: 'https://github.com/gervinlee', Icon: Github },
  { href: 'https://linkedin.com/in/gervin-lee-enero', Icon: Linkedin },
  { href: 'https://instagram.com/gervin_lde', Icon: Instagram },
];

function TypingText({ text, className }: { text: string; className?: string }) {
  const [displayed, setDisplayed] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const tick = () => {
      if (!isDeleting) {
        if (displayed.length < text.length) {
          timeoutRef.current = setTimeout(() => {
            setDisplayed(text.slice(0, displayed.length + 1));
          }, 80);
        } else {
          timeoutRef.current = setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (displayed.length > 0) {
          timeoutRef.current = setTimeout(() => {
            setDisplayed(text.slice(0, displayed.length - 1));
          }, 40);
        } else {
          timeoutRef.current = setTimeout(() => setIsDeleting(false), 600);
        }
      }
    };
    tick();
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [displayed, isDeleting, text]);

  return (
    <span className={className}>
      {displayed}
      <span
        style={{
          display: 'inline-block',
          width: '2px',
          height: '0.9em',
          background: 'currentColor',
          verticalAlign: 'middle',
          marginLeft: '2px',
          borderRadius: '1px',
          animation: 'cursorBlink 0.8s step-end infinite',
        }}
      />
    </span>
  );
}

export function HeroSection() {
  return (
    <>
      <style>{`
        @keyframes cursorBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        /* Hero entrance animations */
        section.hero-section { opacity: 1; transform: none; }

        .hero-left > * {
          opacity: 0;
          animation: heroSlideUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .hero-left > *:nth-child(1) { animation-delay: 0.15s; }
        .hero-left > *:nth-child(2) { animation-delay: 0.28s; }
        .hero-left > *:nth-child(3) { animation-delay: 0.40s; }
        .hero-left > *:nth-child(4) { animation-delay: 0.52s; }
        .hero-left > *:nth-child(5) { animation-delay: 0.62s; }

        .hero-right {
          opacity: 0;
          animation: heroFadeScale 1s cubic-bezier(0.22, 1, 0.36, 1) 0.3s forwards;
        }

        @keyframes heroSlideUp {
          from { opacity: 0; transform: translateY(36px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes heroFadeScale {
          from { opacity: 0; transform: scale(0.92); }
          to   { opacity: 1; transform: scale(1); }
        }

        /* Mobile hero */
        .mobile-hero { padding-top: 0; gap: 0; }
        .mobile-hero .hero-left { padding: 0 1rem; }

        .hero-title { font-size: 3.5rem; line-height: 1; }
        .hero-desc  { font-size: 1.05rem; line-height: 1.5; }
        .hero-btns  { gap: 10px; margin-bottom: 1rem; }
        .hero-btns a { padding: 12px 18px; font-size: 0.92rem; }

        @media (max-width: 640px) {
          .hero-title { font-size: 2.85rem; }
          .hero-desc  { font-size: 0.98rem; }
        }

        @media (max-width: 390px) {
          .hero-title { font-size: 2.4rem; }
          .hero-desc  { font-size: 0.93rem; line-height: 1.45; }
          .hero-btns a { padding: 10px 14px; font-size: 0.84rem; }
        }
      `}</style>

      <section className="hero-section relative h-[100dvh] w-full overflow-hidden flex flex-col">
        {/* Background */}
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center bg-no-repeat transition-all duration-500 dark:brightness-[0.45] brightness-[0.95]"
          style={{ backgroundImage: "url('/assets/city2.jpg')" }}
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-white/97 via-white/82 to-white/20 dark:from-black/92 dark:via-black/72 dark:to-black/20" />
        <div className="absolute inset-0 -z-10 bg-orange-500/[0.04] dark:bg-orange-500/[0.06]" />
        <div className="absolute inset-0 z-10 pointer-events-none circuit-overlay" />

        <div className="relative z-20 flex-1 flex items-center w-full min-h-0">
          <div className="w-full h-full flex items-center px-4 sm:px-6 lg:px-8">

            {/* MOBILE / TABLET */}
            <div className="mobile-hero w-full h-full flex flex-col items-center justify-center lg:hidden gap-5 py-5">
              <div className="hero-right flex items-center justify-center w-full shrink-0">
                <CrystalPortrait />
              </div>

              <div className="hero-left flex flex-col items-center text-center w-full shrink-0">
                <h1 className="hero-title font-black leading-[0.95] tracking-tight text-center mb-2">
                  <span className="gradient-text">Gervin Lee</span>
                  <br />
                  <span className="text-foreground">Enero</span>
                </h1>

                <div className="hero-subtitle text-orange-600 dark:text-orange-300 font-semibold mb-2 text-xl">
                  <TypingText text="Aspiring Developer & UI/UX Designer" />
                </div>

                <p className="hero-desc leading-snug text-zinc-700 dark:text-zinc-300 mb-4 px-2 max-w-[310px]">
                  I'm a BSIT student from Valenzuela City, Philippines, exploring web development and UI/UX design.
                </p>

                <div className="hero-btns flex flex-row gap-3 justify-center mb-4 w-full max-w-[320px]">
                  <Link
                    href="/projects"
                    className="inline-flex items-center justify-center gap-1.5 px-5 py-3.5 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 flex-1 text-sm"
                  >
                    View My Work
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/about"
                    className="inline-flex items-center justify-center px-5 py-3.5 rounded-xl border border-orange-500/20 bg-white/60 dark:bg-white/5 backdrop-blur-md text-foreground font-semibold hover:bg-orange-500/10 transition-all duration-300 flex-1 text-sm"
                  >
                    Learn More
                  </Link>
                </div>

                <div className="flex flex-row gap-2.5 justify-center">
                  {SOCIAL_LINKS.map(({ href, Icon }) => (
                    <a
                      key={href}
                      href={href}
                      target={href.startsWith('mailto') ? undefined : '_blank'}
                      rel={href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                      className="flex items-center justify-center w-11 h-11 rounded-2xl border border-orange-500/15 bg-white/60 dark:bg-white/5 backdrop-blur-md hover:bg-orange-500/10 hover:scale-110 transition-all duration-300"
                    >
                      <Icon className="w-4.5 h-4.5 text-orange-600 dark:text-orange-300" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* DESKTOP */}
            <div className="hidden lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center w-full max-w-7xl mx-auto">
              <div className="hero-left flex flex-col justify-center text-left">
                <h1 className="text-5xl xl:text-7xl 2xl:text-8xl font-black leading-[0.95] tracking-tight mb-4">
                  <span className="gradient-text">Gervin Lee</span>
                  <br />
                  <span className="text-foreground">Enero</span>
                </h1>

                <div className="text-xl xl:text-2xl text-orange-600 dark:text-orange-300 font-semibold mb-4">
                  <TypingText text="Aspiring Developer & UI/UX Designer" />
                </div>

                <p className="text-base xl:text-lg leading-relaxed text-zinc-700 dark:text-zinc-300 max-w-xl mb-7">
                  I'm a BSIT student from Valenzuela City, Philippines, exploring web development and UI/UX design, focusing on responsive and modern digital experiences.
                </p>

                <div className="flex flex-row gap-4 mb-7">
                  <Link
                    href="/projects"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
                  >
                    View My Work
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href="/about"
                    className="inline-flex items-center justify-center px-8 py-4 rounded-xl border border-orange-500/20 bg-white/60 dark:bg-white/5 backdrop-blur-md text-foreground font-semibold hover:bg-orange-500/10 transition-all duration-300"
                  >
                    Learn More
                  </Link>
                </div>

                <div className="flex flex-row gap-3">
                  {SOCIAL_LINKS.map(({ href, Icon }) => (
                    <a
                      key={href}
                      href={href}
                      target={href.startsWith('mailto') ? undefined : '_blank'}
                      rel={href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                      className="flex items-center justify-center w-12 h-12 rounded-2xl border border-orange-500/15 bg-white/60 dark:bg-white/5 backdrop-blur-md hover:bg-orange-500/10 hover:scale-110 transition-all duration-300"
                    >
                      <Icon className="w-6 h-6 text-orange-600 dark:text-orange-300" />
                    </a>
                  ))}
                </div>
              </div>

              <div className="hero-right flex items-center justify-center">
                <CrystalPortrait />
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}