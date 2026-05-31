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
  useEffect,
} from 'react';
import { ContactSection } from '@/components/contact-section';
import { TechStack } from '@/components/tech-stack';
import { FeaturedProjects } from '@/components/featured-projects';

// Enhanced Crystal Portrait Component
function CrystalPortrait() {
  const crystalRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!crystalRef.current) return;

    const rect = crystalRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const x = (e.clientX - centerX) / rect.width * 1.2;
    const y = (e.clientY - centerY) / rect.height * 1.2;

    setRotate({
      x: -y * 18,
      y: x * 18,
    });
  };

  return (
    <div
      className="crystal-wrapper"
      onMouseMove={handleMove}
      onMouseLeave={() => setRotate({ x: 0, y: 0 })}
    >
      {/* Ambient glow layers */}
      <div className="crystal-ambient-glow glow-1" />
      <div className="crystal-ambient-glow glow-2" />

      {/* Main Crystal Container */}
      <div
        ref={crystalRef}
        className="crystal-container"
        style={{
          transform: `
            perspective(1200px)
            rotateX(${rotate.x}deg)
            rotateY(${rotate.y}deg)
            translateZ(30px)
          `,
        }}
      >
        {/* Multiple Crystal Facets */}
        <div className="crystal-facet facet-base" />
        <div className="crystal-facet facet-layer-1" />
        <div className="crystal-facet facet-layer-2" />
        <div className="crystal-facet facet-layer-3" />
        <div className="crystal-facet facet-layer-4" />

        {/* Inner Portrait Container */}
        <div className="portrait-container">
          <Image
            src="/assets/gervin-pic.jpg"
            alt="Gervin Lee Enero"
            fill
            priority
            className="portrait-image object-cover"
          />


        </div>

        {/* Enhanced Edge Highlights */}
        <div className="edge-highlight top-edge" />
        <div className="edge-highlight right-edge" />
        <div className="edge-highlight bottom-edge" />
        <div className="edge-highlight left-edge" />

        {/* Floating Light Particles */}
        <div className="light-particle p1" />
        <div className="light-particle p2" />
        <div className="light-particle p3" />
        <div className="light-particle p4" />
        <div className="light-particle p5" />

        {/* Status Label - Now inside crystal at bottom */}
        <div className="crystal-label">
          <span className="label-dot" />
          AVAILABLE FOR WORK
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>(
      'section[data-reveal], [data-reveal]'
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            el.classList.add('reveal-visible');
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );

    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Scoped styles */}
      <style>{`
        /* ─── Scroll Reveal Base ─────────────────────────── */
        [data-reveal] {
          opacity: 0;
          transform: translateY(52px);
          transition:
            opacity 0.75s cubic-bezier(0.22, 1, 0.36, 1),
            transform 0.75s cubic-bezier(0.22, 1, 0.36, 1);
          will-change: opacity, transform;
        }

        [data-reveal="slide-left"] {
          transform: translateX(-52px);
        }

        [data-reveal="slide-right"] {
          transform: translateX(52px);
        }

        [data-reveal="scale"] {
          transform: translateY(32px) scale(0.96);
        }

        [data-reveal="fade"] {
          transform: none;
        }

        [data-reveal].reveal-visible {
          opacity: 1;
          transform: translateY(0) translateX(0) scale(1);
        }

        /* Stagger children */
        [data-reveal-stagger].reveal-visible > * {
          animation: staggerFadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        [data-reveal-stagger].reveal-visible > *:nth-child(1) { animation-delay: 0.05s; }
        [data-reveal-stagger].reveal-visible > *:nth-child(2) { animation-delay: 0.12s; }
        [data-reveal-stagger].reveal-visible > *:nth-child(3) { animation-delay: 0.19s; }
        [data-reveal-stagger].reveal-visible > *:nth-child(4) { animation-delay: 0.26s; }
        [data-reveal-stagger].reveal-visible > *:nth-child(5) { animation-delay: 0.33s; }
        [data-reveal-stagger].reveal-visible > *:nth-child(6) { animation-delay: 0.40s; }

        @keyframes staggerFadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Hero entrance animations */
        section.hero-section {
          opacity: 1;
          transform: none;
        }

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

        /* ─── CRYSTAL PORTRAIT ──────────────────────────────── */
        .crystal-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: visible;
          padding: 2rem 0;
        }

        .crystal-container {
          position: relative;
          width: 380px;
          height: 460px;
          transform-style: preserve-3d;
          transition: transform 0.15s cubic-bezier(0.23, 1, 0.32, 1);
          filter: drop-shadow(0 70px 100px rgba(249, 115, 22, 0.35));
        }

        .crystal-container:hover {
          filter: drop-shadow(0 90px 120px rgba(249, 115, 22, 0.5));
        }

        .crystal-facet {
          position: absolute;
          inset: 0;
          border-radius: 42% 58% 45% 55% / 48% 42% 58% 52%;
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.9) 0%,
            rgba(249, 115, 22, 0.18) 35%,
            rgba(234, 88, 12, 0.08) 65%,
            rgba(255, 255, 255, 0.95) 100%
          );
          box-shadow: 
            inset 0 0 90px rgba(255,255,255,0.7),
            inset -50px -50px 80px rgba(255,170,80,0.4),
            0 0 70px rgba(249,115,22,0.4);
          backdrop-filter: blur(14px);
        }

        .facet-base { z-index: 1; }
        .facet-layer-1 { z-index: 2; background: linear-gradient(145deg, transparent 25%, rgba(255, 245, 230, 0.5) 50%, transparent 75%); transform: scale(0.96) translate(10px, 14px); opacity: 0.8; }
        .facet-layer-2 { z-index: 3; background: linear-gradient(125deg, rgba(255,255,255,0.7) 10%, transparent 50%, rgba(249,115,22,0.3) 75%); transform: scale(0.93) translate(-8px, -12px); }
        .facet-layer-3 { z-index: 4; border: 1.5px solid rgba(255, 200, 140, 0.6); box-shadow: inset 0 0 50px rgba(255, 255, 255, 0.8); }
        .facet-layer-4 { z-index: 4; background: linear-gradient(160deg, transparent, rgba(255,255,255,0.4), transparent); opacity: 0.6; }

        .portrait-container {
          position: absolute;
          inset: 18px;
          border-radius: 38% 62% 40% 60% / 45% 38% 62% 55%;
          overflow: hidden;
          box-shadow: 0 0 40px rgba(249,115,22,0.25);
          z-index: 5;
        }

        .portrait-image {
          transition: transform 0.8s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .crystal-container:hover .portrait-image {
          transform: scale(1.06);
        }

        .crystal-container:hover

        /* Edge Highlights */
        .edge-highlight {
          position: absolute;
          background: linear-gradient(transparent, rgba(255, 240, 200, 0.95), transparent);
          filter: blur(1px);
          opacity: 0.7;
        }

        .top-edge { top: 6%; left: 10%; right: 15%; height: 4px; }
        .right-edge { top: 12%; right: 8%; bottom: 18%; width: 4px; transform: rotate(28deg); }
        .bottom-edge { bottom: 10%; left: 18%; right: 12%; height: 3px; }
        .left-edge { top: 22%; left: 9%; bottom: 25%; width: 3px; transform: rotate(-35deg); }

        /* Floating Particles */
        .light-particle {
          position: absolute;
          width: 5px;
          height: 5px;
          background: #fff7e6;
          border-radius: 50%;
          box-shadow: 0 0 14px #ffcc80, 0 0 28px #f97316, 0 0 45px #fb923c;
          animation: crystalFloat 7s ease-in-out infinite;
          z-index: 8;
        }

        .p1 { top: 24%; left: 28%; animation-delay: 0s; }
        .p2 { top: 48%; right: 26%; animation-delay: 1.8s; }
        .p3 { bottom: 32%; left: 42%; animation-delay: 3.6s; }
        .p4 { top: 35%; left: 65%; animation-delay: 2.2s; width: 3px; height: 3px; }
        .p5 { bottom: 45%; right: 38%; animation-delay: 5.1s; width: 4px; height: 4px; }

        @keyframes crystalFloat {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.7; }
          50% { transform: translate(18px, -28px) scale(1.4); opacity: 1; }
        }

        /* Ambient Glows */
        .crystal-ambient-glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          opacity: 0.28;
          z-index: -1;
        }

        .glow-1 {
          width: 560px;
          height: 560px;
          background: radial-gradient(circle, #fb923c, transparent 65%);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .glow-2 {
          width: 460px;
          height: 460px;
          background: radial-gradient(circle, #f59e0b, transparent 70%);
          top: 38%;
          left: 42%;
          animation: slowPulse 16s ease-in-out infinite;
        }

        @keyframes slowPulse {
          0%, 100% { opacity: 0.2; transform: scale(0.95); }
          50% { opacity: 0.35; transform: scale(1.05); }
        }

        /* Crystal Label - Inside bottom */
        .crystal-label {
          position: absolute;
          bottom: 28px;
          left: 50%;
          transform: translateX(-50%);
          padding: 8px 20px;
          border-radius: 9999px;
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(251, 146, 60, 0.5);
          color: #fbbf24;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          display: flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
          z-index: 10;
        }

        .label-dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          background: #4ade80;
          border-radius: 50%;
          box-shadow: 0 0 12px #4ade80, 0 0 22px #86efac;
          animation: pulseDot 2s ease-in-out infinite;
        }

        @keyframes pulseDot {
          0%, 100% { box-shadow: 0 0 12px #4ade80, 0 0 22px #86efac; }
          50% { box-shadow: 0 0 18px #4ade80, 0 0 32px #86efac; }
        }

        /* ─── Mobile Hero Base (< 1024px) ───────────────────── */
        .mobile-hero {
          padding-top: 0;
          gap: 0;
        }

        .mobile-hero .hero-left {
          padding: 0 1rem;
        }

        .hero-title {
          font-size: 3.5rem;
          line-height: 1;
        }

        .hero-desc {
          font-size: 1.05rem;
          line-height: 1.5;
        }

        .hero-btns {
          gap: 10px;
          margin-bottom: 1rem;
        }

        .hero-btns a {
          padding: 12px 18px;
          font-size: 0.92rem;
        }

        /* Tablet (641px – 1023px) */
        @media (max-width: 1023px) {
          .crystal-container {
            width: clamp(220px, 52dvw, 320px);
            height: clamp(260px, 62dvw, 390px);
          }

          .crystal-wrapper {
            height: auto;
            padding: 0.75rem 0;
          }

          .crystal-label {
            font-size: 0.68rem;
            padding: 6px 16px;
            bottom: 20px;
          }
        }

        /* Small phones (≤ 640px) */
        @media (max-width: 640px) {
          .crystal-container {
            width: clamp(225px, 70dvw, 290px);
            height: clamp(273px, 85dvw, 355px);
          }

          .crystal-wrapper {
            padding: 0.5rem 0;
          }

          .crystal-label {
            font-size: 0.62rem;
            padding: 5px 12px;
            bottom: 14px;
            gap: 5px;
          }

          .label-dot {
            width: 6px;
            height: 6px;
          }

          .hero-title {
            font-size: 2.85rem;
          }

          .hero-desc {
            font-size: 0.98rem;
          }
        }

        /* iPhone SE and very small (≤ 390px) */
        @media (max-width: 390px) {
          .crystal-container {
            width: clamp(190px, 64dvw, 235px);
            height: clamp(230px, 78dvw, 286px);
          }

          .hero-title {
            font-size: 2.4rem;
          }

          .hero-desc {
            font-size: 0.93rem;
            line-height: 1.45;
          }

          .hero-btns a {
            padding: 10px 14px;
            font-size: 0.84rem;
          }
        }
      `}</style>

      <main className="min-h-screen relative z-10 overflow-x-hidden">
        {/* Background layer */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 circuit-bg opacity-50" />
          <div className="absolute inset-0 dots-bg opacity-30" />
        </div>

        {/* HERO SECTION */}
        <section className="hero-section relative h-[100dvh] w-full overflow-hidden flex flex-col">
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
                    Aspiring Developer & UI/UX Designer
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
                    {[
                      { href: 'mailto:gervinlee10@gmail.com', Icon: Mail },
                      { href: 'https://github.com/gervinlee', Icon: Github },
                      { href: 'https://linkedin.com/in/gervin-lee-enero', Icon: Linkedin },
                      { href: 'https://instagram.com/gervin_lde', Icon: Instagram },
                    ].map(({ href, Icon }) => (
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
                    Aspiring Developer & UI/UX Designer
                  </div>

                  <p className="text-base xl:text-lg leading-relaxed text-zinc-700 dark:text-zinc-300 max-w-xl mb-7">
                    I’m a BSIT student from Valenzuela City, Philippines, exploring web development and UI/UX design, focusing on responsive and modern digital experiences.
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
                    {[
                      { href: 'mailto:gervinlee10@gmail.com', Icon: Mail },
                      { href: 'https://github.com/gervinlee', Icon: Github },
                      { href: 'https://linkedin.com/in/gervin-lee-enero', Icon: Linkedin },
                      { href: 'https://instagram.com/gervin_lde', Icon: Instagram },
                    ].map(({ href, Icon }) => (
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

        <div data-reveal className="tech-stack-section">
          <TechStack />
        </div>

        <div data-reveal="scale" className="featured-projects-section">
          <FeaturedProjects />
        </div>

        <div data-reveal="slide-left" className="contact-section">
          <ContactSection />
        </div>

        <footer data-reveal="fade" className="py-8 px-4 border-t border-border/50">
          <div className="max-w-7xl mx-auto text-center text-sm text-foreground/40">
            <p>&copy; 2026 Gervin Lee Enero. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </>
  );
}