'use client';

import { useEffect } from 'react';
import { HeroSection } from '@/components/hero-section';
import { ContactSection } from '@/components/contact-section';
import { TechStack } from '@/components/tech-stack';
import { FeaturedProjects } from '@/components/featured-projects';

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
      <style>{`
        /* ─── Scroll Reveal ──────────────────────────────────── */
        [data-reveal] {
          opacity: 0;
          transform: translateY(52px);
          transition:
            opacity 0.75s cubic-bezier(0.22, 1, 0.36, 1),
            transform 0.75s cubic-bezier(0.22, 1, 0.36, 1);
          will-change: opacity, transform;
        }
        [data-reveal="slide-left"]  { transform: translateX(-52px); }
        [data-reveal="slide-right"] { transform: translateX(52px); }
        [data-reveal="scale"]       { transform: translateY(32px) scale(0.96); }
        [data-reveal="fade"]        { transform: none; }
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
      `}</style>

      <main className="min-h-screen relative z-10 overflow-x-hidden">
        {/* Background layer */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 circuit-bg opacity-50" />
          <div className="absolute inset-0 dots-bg opacity-30" />
        </div>

        <HeroSection />

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