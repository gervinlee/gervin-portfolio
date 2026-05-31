'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';

export function CrystalPortrait() {
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
    <>
      <style>{`
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

        /* Edge Highlights */
        .edge-highlight {
          position: absolute;
          background: linear-gradient(transparent, rgba(255, 240, 200, 0.95), transparent);
          filter: blur(1px);
          opacity: 0.7;
        }

        .top-edge    { top: 6%;    left: 10%; right: 15%;  height: 4px; }
        .right-edge  { top: 12%;   right: 8%; bottom: 18%; width: 4px;  transform: rotate(28deg); }
        .bottom-edge { bottom: 10%; left: 18%; right: 12%; height: 3px; }
        .left-edge   { top: 22%;   left: 9%;  bottom: 25%; width: 3px;  transform: rotate(-35deg); }

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

        /* Crystal Label */
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
          50%       { box-shadow: 0 0 18px #4ade80, 0 0 32px #86efac; }
        }

        /* Responsive */
        @media (max-width: 1023px) {
          .crystal-container {
            width: clamp(220px, 52dvw, 320px);
            height: clamp(260px, 62dvw, 390px);
          }
          .crystal-wrapper { height: auto; padding: 0.75rem 0; }
          .crystal-label { font-size: 0.68rem; padding: 6px 16px; bottom: 20px; }
        }

        @media (max-width: 640px) {
          .crystal-container {
            width: clamp(225px, 70dvw, 290px);
            height: clamp(273px, 85dvw, 355px);
          }
          .crystal-wrapper { padding: 0.5rem 0; }
          .crystal-label { font-size: 0.62rem; padding: 5px 12px; bottom: 14px; gap: 5px; }
          .label-dot { width: 6px; height: 6px; }
        }

        @media (max-width: 390px) {
          .crystal-container {
            width: clamp(190px, 64dvw, 235px);
            height: clamp(230px, 78dvw, 286px);
          }
        }
      `}</style>

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

          {/* Status Label */}
          <div className="crystal-label">
            <span className="label-dot" />
            AVAILABLE FOR WORK
          </div>
        </div>
      </div>
    </>
  );
}