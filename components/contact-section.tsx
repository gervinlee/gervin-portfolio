'use client';

import { ContactForm } from './contact-form';
import { ContactInfo } from './contact-info';

export function ContactSection() {
  return (
    <section className="relative overflow-hidden pt-8 sm:pt-12 md:pt-16 lg:pt-20 pb-12 sm:pb-16 md:pb-20 lg:pb-24 px-5 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      {/* Background */}
      <div className="absolute inset-0 bg-background" />

      {/* Cyber Grid */}
      <div className="absolute inset-0 cyber-grid opacity-[0.06]" />

      {/* Floating Orbs */}
      <div className="absolute top-[10%] left-[8%] w-64 h-64 sm:w-72 sm:h-72 rounded-full bg-primary/25 blur-3xl animate-orbFloat1 pointer-events-none" />
      <div className="absolute bottom-[5%] right-[10%] w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-cyan-400/20 blur-3xl animate-orbFloat2 pointer-events-none" />
      <div className="absolute top-[45%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-pink-500/15 blur-3xl animate-orbFloat3 pointer-events-none" />

      {/* Floating Particles */}
      <div className="particles">
        {Array.from({ length: 18 }).map((_, i) => (
          <span
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.7}s`,
              animationDuration: `${10 + i * 0.8}s`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">
            Let&apos;s Connect
          </h2>
          <p className="text-sm sm:text-base text-foreground/70 max-w-xl mx-auto">
            I&apos;m always open to new opportunities and collaborations.
            Feel free to reach out!
          </p>
        </div>

        <div className="contact-cols">
          {/* Form Column */}
          <div className="contact-form-col">
            <h3 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8">
              Send me a Message
            </h3>
            <ContactForm />
          </div>

          {/* Info Column */}
          <div className="contact-info-col">
            <h3 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8">
              Get in Touch
            </h3>
            <ContactInfo />
          </div>
        </div>
      </div>

      <style>{`
        .contact-cols {
          display: grid;
          grid-template-columns: 1fr;
          gap: 60px;
        }

        @media (min-width: 768px) {
          .contact-cols {
            grid-template-columns: 3fr 2fr;
            gap: 80px;
          }
        }

        .contact-form-col, .contact-info-col {
          min-width: 0;
        }

        /* Cyber Grid */
        .cyber-grid {
          background-image:
            linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px);
          background-size: 60px 60px;
        }

        /* Floating Orbs */
        @keyframes orbFloat1 {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(60px, 40px) scale(1.15); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes orbFloat2 {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-50px, -60px) scale(1.1); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes orbFloat3 {
          0% { transform: translate(-50%, -50%) rotate(0deg) scale(1); }
          50% { transform: translate(-45%, -55%) rotate(180deg) scale(1.2); }
          100% { transform: translate(-50%, -50%) rotate(360deg) scale(1); }
        }

        .animate-orbFloat1 { animation: orbFloat1 16s ease-in-out infinite; }
        .animate-orbFloat2 { animation: orbFloat2 18s ease-in-out infinite; }
        .animate-orbFloat3 { animation: orbFloat3 22s linear infinite; }

        /* Particles */
        .particles {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .particle {
          position: absolute;
          bottom: -20px;
          width: 6px;
          height: 6px;
          border-radius: 999px;
          background: rgba(255,255,255,0.4);
          animation: particleFloat linear infinite;
          filter: blur(1px);
        }

        @keyframes particleFloat {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 1; }
          50% { transform: translateY(-50vh) translateX(40px); }
          100% { transform: translateY(-110vh) translateX(-30px); opacity: 0; }
        }
      `}</style>
    </section>
  );
}