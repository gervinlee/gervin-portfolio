'use client';

import { Canvas } from '@react-three/fiber';
import { RockModel } from '@/components/RockModel';

export function TechStack() {
  return (
    <section className="pt-6 sm:pt-10 lg:pt-14 pb-8 sm:pb-12 lg:pb-16 relative overflow-hidden">

      <style jsx>{`
        .gem-scene {
          position: relative;
          width: 100%;
          height: 820px;
          display: flex;
          align-items: center;
          justify-content: center;
          perspective: 2800px;
          transform-style: preserve-3d;
        }

        .gem-system {
          position: relative;
          width: 760px;
          height: 760px;
          transform-style: preserve-3d;
          animation: masterFloat 8s ease-in-out infinite;
        }

        @keyframes masterFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-24px); }
        }

        /* Enhanced Orbital Rings */
        .orbit-trail {
          position: absolute;
          top: 50%;
          left: 50%;
          border-radius: 999px;
          border: 2px solid rgba(249,115,22,0.25);
          box-shadow: 0 0 45px rgba(249,115,22,0.18);
          transform-style: preserve-3d;
        }

        .trail-1 { width: 520px; height: 520px; margin-left: -260px; margin-top: -260px; transform: rotateX(75deg); }
        .trail-2 { width: 680px; height: 680px; margin-left: -340px; margin-top: -340px; transform: rotateX(75deg) rotateZ(28deg); }
        .trail-3 { width: 420px; height: 420px; margin-left: -210px; margin-top: -210px; transform: rotateX(75deg) rotateZ(-24deg); }
        .trail-4 { width: 580px; height: 580px; margin-left: -290px; margin-top: -290px; transform: rotateX(78deg) rotateZ(45deg); border-color: rgba(249,115,22,0.18); }
        .trail-5 { width: 760px; height: 760px; margin-left: -380px; margin-top: -380px; transform: rotateX(72deg); border-color: rgba(249,115,22,0.12); }

        .energy-base {
          position: absolute;
          bottom: 90px;
          left: 50%;
          width: 420px;
          height: 130px;
          margin-left: -210px;
          border-radius: 999px;
          background: radial-gradient(ellipse, rgba(249,115,22,0.38), rgba(249,115,22,0.08), transparent 72%);
          filter: blur(30px);
          transform: rotateX(80deg);
          animation: basePulse 5s ease-in-out infinite;
        }

        @keyframes basePulse {
          0%,100% { opacity: 0.7; transform: rotateX(80deg) scale(1); }
          50% { opacity: 1; transform: rotateX(80deg) scale(1.08); }
        }

        .rock-canvas-wrap {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 440px;
          height: 440px;
          margin-left: -220px;
          margin-top: -220px;
          transform: translateZ(80px);
          z-index: 5;
        }

        .orbit-layer {
          position: absolute;
          inset: 0;
          transform-style: preserve-3d;
          z-index: 10;
        }

        .orbit-layer-1 { animation: rotateOrbit1 28s linear infinite; }
        .orbit-layer-2 { animation: rotateOrbit2 20s linear infinite; }
        .orbit-layer-3 { animation: rotateOrbit3 16s linear infinite; }

        @keyframes rotateOrbit1 { from { transform: rotateY(0deg); } to { transform: rotateY(360deg); } }
        @keyframes rotateOrbit2 { from { transform: rotateY(360deg); } to { transform: rotateY(0deg); } }
        @keyframes rotateOrbit3 { from { transform: rotateY(0deg) rotateX(15deg); } to { transform: rotateY(360deg) rotateX(15deg); } }

        .tech-planet {
          position: absolute;
          top: 50%;
          left: 50%;
          transform-style: preserve-3d;
          animation: orbFloat 5s ease-in-out infinite;
          cursor: pointer;
          z-index: 20;
        }

        .tech-planet:nth-child(2n) { animation-delay: 0.8s; }
        .tech-planet:nth-child(3n) { animation-delay: 1.6s; }

        @keyframes orbFloat {
          0%,100% { margin-top: 0px; }
          50% { margin-top: -18px; }
        }

        .planet-container {
          position: relative;
        }

        .planet-ui {
          position: relative;
          width: 140px;
          height: 140px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          transform-style: preserve-3d;
          background: radial-gradient(circle at 28% 24%, rgba(255,255,255,1) 0%, rgba(255,235,215,0.98) 18%, rgba(251,146,60,0.92) 45%, rgba(194,65,12,0.96) 70%, rgba(120,40,8,0.95) 100%);
          border: 1px solid rgba(249,115,22,0.35);
          box-shadow:
            inset -42px -52px 70px rgba(0,0,0,0.75),
            inset 18px 18px 28px rgba(255,255,255,0.25),
            0 0 50px rgba(249,115,22,0.35);
          transform: rotateX(18deg) rotateY(-12deg) translateZ(140px);
          transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .dark .planet-ui {
          background: radial-gradient(circle at 28% 24%, rgba(255,255,255,1) 0%, rgba(255,235,215,0.98) 18%, rgba(251,146,60,0.92) 45%, rgba(194,65,12,0.96) 70%, rgba(28,25,23,1) 100%);
        }

        .tech-planet:hover .planet-ui {
          transform: rotateX(25deg) rotateY(-18deg) scale(1.18) translateZ(180px);
          box-shadow: 
            inset -42px -52px 70px rgba(0,0,0,0.7),
            0 0 80px rgba(249,115,22,0.6),
            0 0 160px rgba(249,115,22,0.35);
        }

        .planet-ui img {
          position: relative;
          width: 56px;
          height: 56px;
          z-index: 5;
          object-fit: contain;
          filter: drop-shadow(0 0 14px rgba(255,255,255,0.5));
          transition: transform 0.4s ease;
        }

        .tech-planet:hover .planet-ui img {
          transform: scale(1.1) translateZ(60px);
        }

        /* Hover Label */
        .tech-label {
          position: absolute;
          top: -58px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(10,10,10,0.95);
          color: #ffb067;
          padding: 6px 16px;
          border-radius: 999px;
          font-size: 0.82rem;
          font-weight: 600;
          white-space: nowrap;
          pointer-events: none;
          opacity: 0;
          transition: all 0.35s ease;
          box-shadow: 0 10px 30px rgba(0,0,0,0.4);
          border: 1px solid rgba(249,115,22,0.3);
          z-index: 30;
        }

        .dark .tech-label {
          background: rgba(15,15,15,0.98);
          color: #ffca7a;
        }

        .tech-planet:hover .tech-label {
          opacity: 1;
          top: -72px;
        }

        .energy-particle {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: #fb923c;
          box-shadow: 0 0 15px #fb923c, 0 0 35px rgba(249,115,22,0.8);
          animation: pulseParticle 3s ease-in-out infinite;
          z-index: 25;
        }

        @keyframes pulseParticle {
          0%,100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.5); opacity: 1; }
        }

        /* Responsiveness */
        @media (max-width: 768px) {
          .gem-scene { height: 680px; }
          .gem-system { transform: scale(0.65); }
          .planet-ui { width: 110px; height: 110px; }
          .planet-ui img { width: 46px; height: 46px; }
        }

        @media (max-width: 480px) {
          .gem-system { transform: scale(0.52); }
          .gem-scene { height: 560px; }
        }
      `}</style>

      {/* BG GLOW */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 w-[1100px] h-[1100px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/10 blur-[180px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-3 sm:mb-4 md:mb-6">
            Tech Stack & Tools
          </h2>
          <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-foreground/65 leading-relaxed">
            A collection of the technologies, frameworks, and creative tools I use to build modern, responsive, and high-performance digital experiences.
          </p>
        </div>

        <div className="gem-scene">
          <div className="gem-system">

            {/* Orbital Rings */}
            <div className="orbit-trail trail-1" />
            <div className="orbit-trail trail-2" />
            <div className="orbit-trail trail-3" />
            <div className="orbit-trail trail-4" />
            <div className="orbit-trail trail-5" />

            <div className="energy-base" />

            {/* Core Rock */}
            <div className="rock-canvas-wrap">
              <Canvas
                camera={{ position: [0, 1, 8], fov: 42 }}
                gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}
              >
                <ambientLight intensity={0.8} />
                <directionalLight position={[4, 4, 2]} intensity={1} />
                <RockModel scale={11.5} />
              </Canvas>
            </div>

            {/* ORBITS */}
            <div className="orbit-layer orbit-layer-1">
              <div className="tech-planet" style={{ transform: "translate3d(280px,-120px,160px)" }}>
                <div className="planet-container">
                  <div className="planet-ui"><img src="/assets/react.png" alt="React" /></div>
                  <div className="tech-label">React</div>
                </div>
              </div>
              <div className="tech-planet" style={{ transform: "translate3d(-260px,140px,-60px)" }}>
                <div className="planet-container">
                  <div className="planet-ui"><img src="/assets/javascript.png" alt="JavaScript" /></div>
                  <div className="tech-label">JavaScript</div>
                </div>
              </div>
              <div className="tech-planet" style={{ transform: "translate3d(180px,80px,-120px)" }}>
                <div className="planet-container">
                  <div className="planet-ui"><img src="/assets/typescript.png" alt="TypeScript" /></div>
                  <div className="tech-label">TypeScript</div>
                </div>
              </div>
              <div className="tech-planet" style={{ transform: "translate3d(-80px, -40px, -150px)" }}>
                <div className="planet-container">
                  <div className="planet-ui"><img src="/assets/css3.png" alt="CSS3" /></div>
                  <div className="tech-label">CSS3</div>
                </div>
              </div>
            </div>

            <div className="orbit-layer orbit-layer-2">
              <div className="tech-planet" style={{ transform: "translate3d(-320px,-60px,170px)" }}>
                <div className="planet-container">
                  <div className="planet-ui"><img src="/assets/tailwind-css.png" alt="Tailwind" /></div>
                  <div className="tech-label">Tailwind CSS</div>
                </div>
              </div>
              <div className="tech-planet" style={{ transform: "translate3d(300px,120px,-100px)" }}>
                <div className="planet-container">
                  <div className="planet-ui"><img src="/assets/supabase.png" alt="Supabase" /></div>
                  <div className="tech-label">Supabase</div>
                </div>
              </div>
              <div className="tech-planet" style={{ transform: "translate3d(-140px,-200px,140px)" }}>
                <div className="planet-container">
                  <div className="planet-ui"><img src="/assets/vscode.png" alt="VS Code" /></div>
                  <div className="tech-label">VS Code</div>
                </div>
              </div>
              <div className="tech-planet" style={{ transform: "translate3d(90px, -180px, 80px)" }}>
                <div className="planet-container">
                  <div className="planet-ui"><img src="/assets/html5.png" alt="HTML5" /></div>
                  <div className="tech-label">HTML5</div>
                </div>
              </div>
            </div>

            <div className="orbit-layer orbit-layer-3">
              <div className="tech-planet" style={{ transform: "translate3d(0px,280px,160px)" }}>
                <div className="planet-container">
                  <div className="planet-ui"><img src="/assets/canva.png" alt="Canva" /></div>
                  <div className="tech-label">Canva</div>
                </div>
              </div>
              <div className="tech-planet" style={{ transform: "translate3d(0px,-300px,-80px)" }}>
                <div className="planet-container">
                  <div className="planet-ui"><img src="/assets/figma.png" alt="Figma" /></div>
                  <div className="tech-label">Figma</div>
                </div>
              </div>
              <div className="tech-planet" style={{ transform: "translate3d(180px,220px,-140px)" }}>
                <div className="planet-container">
                  <div className="planet-ui"><img src="/assets/pycharm.png" alt="PyCharm" /></div>
                  <div className="tech-label">PyCharm</div>
                </div>
              </div>
              <div className="tech-planet" style={{ transform: "translate3d(-220px,180px,-30px)" }}>
                <div className="planet-container">
                  <div className="planet-ui"><img src="/assets/nextjs.png" alt="Next.js" /></div>
                  <div className="tech-label">Next.js</div>
                </div>
              </div>
              <div className="tech-planet" style={{ transform: "translate3d(240px,-180px,150px)" }}>
                <div className="planet-container">
                  <div className="planet-ui"><img src="/assets/vercel.png" alt="Vercel" /></div>
                  <div className="tech-label">Vercel</div>
                </div>
              </div>
            </div>

            {/* Particles */}
            <div className="energy-particle" style={{ top: "20%", left: "28%" }} />
            <div className="energy-particle" style={{ top: "30%", right: "22%", animationDelay: "1s" }} />
            <div className="energy-particle" style={{ bottom: "22%", left: "38%", animationDelay: "2s" }} />
            <div className="energy-particle" style={{ top: "45%", right: "35%", animationDelay: "0.5s" }} />

          </div>
        </div>
      </div>
    </section>
  );
}