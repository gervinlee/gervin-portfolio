'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
  hue: number;
}

interface CursorState {
  x: number;
  y: number;
  trailX: number;
  trailY: number;
  label: string;
  isPointer: boolean;
  isText: boolean;
  isHidden: boolean;
  clicking: boolean;
}

// ─── Interactive targets ──────────────────────────────────────────────────────
const INTERACTIVE_SELECTOR = 'a, button, [role="button"], [data-magnetic]';

// ─── Label map ────────────────────────────────────────────────────────────────
function getLabel(el: Element | null): string {
  if (!el) return '';
  const tag   = el.tagName.toLowerCase();
  const role  = el.getAttribute('role');
  const type  = el.getAttribute('type');
  const label = el.getAttribute('data-cursor-label');
  if (label) return label;
  if (tag === 'a') return 'VISIT';
  if (tag === 'button' || role === 'button') {
    const txt = (el.textContent || '').trim().toUpperCase().slice(0, 10);
    return txt || 'CLICK';
  }
  if (tag === 'input' && (type === 'text' || type === 'email' || type === 'search')) return 'TYPE';
  if (tag === 'textarea') return 'TYPE';
  if (tag === 'select')   return 'SELECT';
  return '';
}

// ─── SVG Arrow cursor (rendered via DOM directly for perf) ───────────────────
// The arrow SVG is injected once; we transform the wrapper div each frame.
const ARROW_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="30" viewBox="0 0 24 30" fill="none">
  <defs>
    <filter id="cur-glow" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="2.2" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <filter id="cur-glow-hover" x="-80%" y="-80%" width="260%" height="260%">
      <feGaussianBlur stdDeviation="3.8" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Shadow / depth layer -->
  <path
    d="M3 2 L3 22 L9 16 L14 27 L17 26 L12 15 L20 15 Z"
    fill="rgba(0,0,0,0.25)"
    transform="translate(1.5, 1.5)"
  />

  <!-- Main arrow body -->
  <path
    class="cur-arrow-body"
    d="M3 2 L3 22 L9 16 L14 27 L17 26 L12 15 L20 15 Z"
    filter="url(#cur-glow)"
  />

  <!-- Inner highlight edge -->
  <path
    class="cur-arrow-edge"
    d="M3 2 L3 22 L9 16 L14 27 L17 26 L12 15 L20 15 Z"
    fill="none"
    stroke-width="0.6"
    opacity="0.6"
  />
</svg>
`;

// ─── Main component ───────────────────────────────────────────────────────────
export default function CursorSystem() {
  const rafRef        = useRef<number>(0);
  const stateRef      = useRef<CursorState>({
    x: -200, y: -200, trailX: -200, trailY: -200,
    label: '', isPointer: false, isText: false,
    isHidden: false, clicking: false,
  });
  const particlesRef  = useRef<Particle[]>([]);
  const particleIdRef = useRef(0);
  const lastPosRef    = useRef({ x: -200, y: -200 });
  const frameRef      = useRef(0);
  const clickBurstRef = useRef(0); // countdown for click burst scale

  // DOM refs
  const wrapperRef  = useRef<HTMLDivElement>(null);  // arrow wrapper
  const svgRef      = useRef<SVGSVGElement>(null);
  const labelRef    = useRef<HTMLDivElement>(null);
  const dotRef      = useRef<HTMLDivElement>(null);   // tiny accent dot
  const canvasRef   = useRef<HTMLCanvasElement>(null);

  // ── Spawn particle ─────────────────────────────────────────────────────────
  const spawnParticle = useCallback((x: number, y: number) => {
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.5 + Math.random() * 1.4;
    particlesRef.current.push({
      id:   particleIdRef.current++,
      x, y,
      vx:   Math.cos(angle) * speed,
      vy:   Math.sin(angle) * speed - 0.5,
      life: 1,
      size: 1.2 + Math.random() * 2,
      hue:  18 + Math.random() * 22,
    });
    if (particlesRef.current.length > 50) particlesRef.current.shift();
  }, []);

  // ── Animation loop ─────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas   = canvasRef.current;
    const wrapper  = wrapperRef.current;
    const labelEl  = labelRef.current;
    const dotEl    = dotRef.current;
    if (!canvas || !wrapper || !labelEl || !dotEl) return;

    const ctx = canvas.getContext('2d')!;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Resolve the theme orange color from CSS vars at runtime
    const getAccentColor = () => {
      const root  = document.documentElement;
      const style = getComputedStyle(root);
      // Try to read --primary or fall back to the portfolio orange
      const primary = style.getPropertyValue('--primary').trim();
      return primary || 'oklch(0.65 0.22 30)'; // orange fallback
    };

    const TRAIL_EASE = 0.14;
    let trailX = -200, trailY = -200;

    // Idle breathe: oscillates glow intensity
    let breatheT = 0;

    const loop = () => {
      frameRef.current++;
      breatheT += 0.025;
      const s = stateRef.current;

      // ── Trail lerp (for accent dot only) ────────────────────────────────
      trailX += (s.x - trailX) * TRAIL_EASE;
      trailY += (s.y - trailY) * TRAIL_EASE;

      // ── Click burst countdown ────────────────────────────────────────────
      if (clickBurstRef.current > 0) clickBurstRef.current--;

      // ── Arrow wrapper transform ──────────────────────────────────────────
      // Arrow tip is at (3, 2) in SVG space — offset so tip = cursor hotspot
      const baseScale   = s.isPointer ? 1.12 : 1;
      const clickScale  = s.clicking || clickBurstRef.current > 0 ? 0.82 : 1;
      const scale       = baseScale * clickScale;
      // Small rotation on hover for a "ready" feel
      const rot         = s.isPointer ? -6 : 0;

      wrapper.style.transform  = `translate(${s.x}px, ${s.y}px) rotate(${rot}deg) scale(${scale})`;
      wrapper.style.opacity    = s.isHidden ? '0' : '1';

      // Glow intensity breathe: ramp up on hover
      const baseGlow  = 0.7 + 0.15 * Math.sin(breatheT);
      const glowMult  = s.isPointer ? 1.6 : s.clicking ? 2 : baseGlow;
      wrapper.style.filter = `brightness(${glowMult})`;

      // Swap SVG filter to stronger glow on hover
      const svg = wrapper.querySelector('svg');
      if (svg) {
        const bodyPath = svg.querySelector('.cur-arrow-body') as SVGPathElement | null;
        const edgePath = svg.querySelector('.cur-arrow-edge') as SVGPathElement | null;
        if (bodyPath) {
          bodyPath.setAttribute('filter', s.isPointer ? 'url(#cur-glow-hover)' : 'url(#cur-glow)');
        }
        if (edgePath) {
          edgePath.style.opacity = s.isPointer ? '0.9' : '0.6';
        }
      }

      // ── Accent dot (lagged, smaller) ────────────────────────────────────
      dotEl.style.transform = `translate(${trailX - 3}px, ${trailY - 3}px)`;
      dotEl.style.opacity   = s.isHidden || s.isPointer ? '0' : '0.6';

      // ── Label ───────────────────────────────────────────────────────────
      const hasLabel = !!s.label;
      labelEl.textContent     = s.label;
      labelEl.style.transform = `translate(${s.x + 18}px, ${s.y - 6}px)`;
      labelEl.style.opacity   = hasLabel && !s.isHidden ? '1' : '0';

      // ── Particles on canvas ─────────────────────────────────────────────
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current = particlesRef.current.filter(p => p.life > 0.02);
      particlesRef.current.forEach(p => {
        p.x    += p.vx;
        p.y    += p.vy;
        p.vy   += 0.035;
        p.vx   *= 0.97;
        p.life -= 0.03;

        const a = p.life * p.life; // quadratic fade = sharper tail
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fillStyle    = `hsla(${p.hue}, 88%, 56%, ${a})`;
        ctx.shadowColor  = `hsla(${p.hue}, 100%, 62%, ${a * 0.5})`;
        ctx.shadowBlur   = 5;
        ctx.fill();
        ctx.shadowBlur   = 0;
      });

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    // ── Mouse events ─────────────────────────────────────────────────────────
    const onMove = (e: MouseEvent) => {
      const s    = stateRef.current;
      s.x = e.clientX;
      s.y = e.clientY;

      const target      = document.elementFromPoint(e.clientX, e.clientY);
      const interactive = target?.closest(INTERACTIVE_SELECTOR);
      const textInput   = target?.closest('input, textarea');
      s.isPointer = !!interactive;
      s.isText    = !!textInput;
      s.label     = getLabel(interactive ?? null);

      const dx    = e.clientX - lastPosRef.current.x;
      const dy    = e.clientY - lastPosRef.current.y;
      const speed = Math.hypot(dx, dy);
      if (speed > 4 && frameRef.current % 2 === 0) {
        spawnParticle(e.clientX, e.clientY);
      }
      lastPosRef.current = { x: e.clientX, y: e.clientY };
    };

    const onDown = () => {
      stateRef.current.clicking = true;
      clickBurstRef.current = 8;
      // burst of particles on click
      for (let i = 0; i < 5; i++) spawnParticle(stateRef.current.x, stateRef.current.y);
    };
    const onUp    = () => { stateRef.current.clicking = false; };
    const onLeave = () => { stateRef.current.isHidden = true;  };
    const onEnter = () => { stateRef.current.isHidden = false; };

    window.addEventListener('mousemove',    onMove);
    window.addEventListener('mousedown',    onDown);
    window.addEventListener('mouseup',      onUp);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize',      resize);
      window.removeEventListener('mousemove',   onMove);
      window.removeEventListener('mousedown',   onDown);
      window.removeEventListener('mouseup',     onUp);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
    };
  }, [spawnParticle]);

  // ── Hide on touch devices ─────────────────────────────────────────────────
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    setIsTouch(window.matchMedia('(pointer: coarse)').matches);
  }, []);

  if (isTouch) return null;

  return (
    <>
      <style>{`
        /* ── Hide native cursor ── */
        *, *::before, *::after { cursor: none !important; }

        /* ── Particle canvas ── */
        .cur-canvas {
          position: fixed; inset: 0;
          pointer-events: none;
          z-index: 99990;
        }

        /* ── Arrow SVG wrapper ── */
        /* Tip of the arrow sits exactly at (0,0) of wrapper = cursor hotspot */
        .cur-arrow {
          position: fixed;
          top: 0; left: 0;
          /* offset so SVG tip (3,2) aligns to hotspot */
          margin-left: -3px;
          margin-top: -2px;
          pointer-events: none;
          z-index: 99999;
          will-change: transform, filter;
          transition:
            opacity 0.2s ease,
            filter  0.15s ease;
        }

        /* Arrow body fill — orange from portfolio palette */
        .cur-arrow-body {
          fill: #ea580c;       /* orange-600: default dark-mode color */
          transition: filter 0.15s;
        }

        /* Light mode override */
        @media (prefers-color-scheme: light) {
          .cur-arrow-body { fill: #c2410c; }  /* orange-700: more contrast on white */
        }

        /* Or if the site uses a .dark class on <html> (next-themes) */
        :root.dark  .cur-arrow-body { fill: #ea580c; }
        :root.light .cur-arrow-body { fill: #c2410c; }

        /* Edge stroke matches body */
        .cur-arrow-edge {
          stroke: #fed7aa;     /* orange-200: bright inner highlight */
          transition: opacity 0.15s;
        }
        :root.light .cur-arrow-edge { stroke: #7c2d12; }

        /* ── Accent dot (lagged, subtle) ── */
        .cur-dot {
          position: fixed; top: 0; left: 0;
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #fb923c;
          box-shadow: 0 0 6px #fb923c, 0 0 14px rgba(251,146,60,0.4);
          pointer-events: none;
          z-index: 99998;
          will-change: transform, opacity;
          transition: opacity 0.2s;
        }
        :root.light .cur-dot {
          background: #ea580c;
          box-shadow: 0 0 6px #ea580c;
        }

        /* ── HUD label ── */
        .cur-label {
          position: fixed; top: 0; left: 0;
          font-family: 'SF Mono', 'Fira Code', monospace;
          font-size: 0.5rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(251,146,60,0.95);
          background: rgba(6,3,1,0.7);
          border: 1px solid rgba(234,88,12,0.3);
          border-radius: 3px;
          padding: 2px 5px;
          pointer-events: none;
          z-index: 99999;
          will-change: transform, opacity;
          transition: opacity 0.18s;
          white-space: nowrap;
          backdrop-filter: blur(6px);
        }
        :root.light .cur-label {
          color: rgba(194,65,12,0.95);
          background: rgba(255,255,255,0.82);
          border-color: rgba(234,88,12,0.25);
        }
      `}</style>

      {/* Particle canvas */}
      <canvas ref={canvasRef} className="cur-canvas" />

      {/* SVG Arrow cursor */}
      <div
        ref={wrapperRef}
        className="cur-arrow"
        dangerouslySetInnerHTML={{ __html: ARROW_SVG }}
      />

      {/* Lagged accent dot */}
      <div ref={dotRef} className="cur-dot" />

      {/* HUD label */}
      <div ref={labelRef} className="cur-label" />
    </>
  );
}