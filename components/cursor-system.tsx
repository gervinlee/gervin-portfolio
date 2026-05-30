'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;       // 1 → 0
  size: number;
  hue: number;        // 20–40 orange range
}

interface CursorState {
  x: number;
  y: number;
  ringX: number;      // lagged ring position
  ringY: number;
  label: string;
  isPointer: boolean;
  isText: boolean;
  isHidden: boolean;
  clicking: boolean;
}

// ─── Magnetic targets ─────────────────────────────────────────────────────────
const MAGNETIC_SELECTOR = 'a, button, [role="button"], [data-magnetic]';
const MAGNETIC_STRENGTH = 0.38;   // 0 = no pull, 1 = snaps to center
const MAGNETIC_RADIUS   = 90;     // px from element edge

// ─── Label map: element → short HUD text ────────────────────────────────────
function getLabel(el: Element | null): string {
  if (!el) return '';
  const tag = el.tagName.toLowerCase();
  const role = el.getAttribute('role');
  const type = el.getAttribute('type');
  const label = el.getAttribute('data-cursor-label');
  if (label) return label;
  if (tag === 'a')      return 'VISIT';
  if (tag === 'button' || role === 'button') {
    const txt = (el.textContent || '').trim().toUpperCase().slice(0, 10);
    return txt || 'CLICK';
  }
  if (tag === 'input' && (type === 'text' || type === 'email' || type === 'search')) return 'TYPE';
  if (tag === 'textarea') return 'TYPE';
  if (tag === 'select')   return 'SELECT';
  return '';
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function CursorSystem() {
  const rafRef        = useRef<number>(0);
  const stateRef      = useRef<CursorState>({
    x: -200, y: -200, ringX: -200, ringY: -200,
    label: '', isPointer: false, isText: false,
    isHidden: false, clicking: false,
  });
  const particlesRef  = useRef<Particle[]>([]);
  const particleIdRef = useRef(0);
  const lastPosRef    = useRef({ x: -200, y: -200 });
  const frameRef      = useRef(0);

  // DOM refs
  const dotRef        = useRef<HTMLDivElement>(null);
  const ringRef       = useRef<HTMLDivElement>(null);
  const ring2Ref      = useRef<HTMLDivElement>(null);
  const labelRef      = useRef<HTMLDivElement>(null);
  const canvasRef     = useRef<HTMLCanvasElement>(null);

  // ── Spawn a particle at (x, y) ─────────────────────────────────────────────
  const spawnParticle = useCallback((x: number, y: number) => {
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.4 + Math.random() * 1.2;
    particlesRef.current.push({
      id:   particleIdRef.current++,
      x, y,
      vx:   Math.cos(angle) * speed,
      vy:   Math.sin(angle) * speed - 0.6,
      life: 1,
      size: 1.5 + Math.random() * 2.5,
      hue:  20 + Math.random() * 25,
    });
    // cap pool
    if (particlesRef.current.length > 60) particlesRef.current.shift();
  }, []);

  // ── Main animation loop ────────────────────────────────────────────────────
  useEffect(() => {
    const canvas  = canvasRef.current;
    const dot     = dotRef.current;
    const ring    = ringRef.current;
    const ring2   = ring2Ref.current;
    const labelEl = labelRef.current;
    if (!canvas || !dot || !ring || !ring2 || !labelEl) return;

    const ctx = canvas.getContext('2d')!;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Laggy ring follow speed
    const RING_EASE  = 0.11;
    const RING2_EASE = 0.06;
    let ring2X = -200, ring2Y = -200;

    const loop = () => {
      frameRef.current++;
      const s = stateRef.current;

      // ── Lerp rings ────────────────────────────────────────────────────────
      s.ringX += (s.x - s.ringX) * RING_EASE;
      s.ringY += (s.y - s.ringY) * RING_EASE;
      ring2X  += (s.x - ring2X)  * RING2_EASE;
      ring2Y  += (s.y - ring2Y)  * RING2_EASE;

      // ── Move dot (instant) ────────────────────────────────────────────────
      dot.style.transform = `translate(${s.x - 4}px, ${s.y - 4}px) scale(${s.clicking ? 0.5 : s.isPointer ? 1.4 : 1})`;

      // ── Ring 1 (holographic, medium lag) ──────────────────────────────────
      const ringSize = s.isPointer ? 44 : s.isText ? 36 : 32;
      ring.style.transform  = `translate(${s.ringX - ringSize / 2}px, ${s.ringY - ringSize / 2}px) scale(${s.clicking ? 0.7 : 1}) rotate(${frameRef.current * 0.8}deg)`;
      ring.style.width      = `${ringSize}px`;
      ring.style.height     = `${ringSize}px`;
      ring.style.opacity    = s.isHidden ? '0' : '1';

      // ── Ring 2 (outer glow, heavy lag) ────────────────────────────────────
      const ring2Size = s.isPointer ? 72 : 56;
      ring2.style.transform = `translate(${ring2X - ring2Size / 2}px, ${ring2Y - ring2Size / 2}px) rotate(${-frameRef.current * 0.4}deg)`;
      ring2.style.width     = `${ring2Size}px`;
      ring2.style.height    = `${ring2Size}px`;
      ring2.style.opacity   = s.isHidden ? '0' : s.isPointer ? '0.7' : '0.35';

      // ── Label ─────────────────────────────────────────────────────────────
      const hasLabel = !!s.label;
      labelEl.textContent   = s.label;
      labelEl.style.transform = `translate(${s.ringX + ringSize / 2 + 10}px, ${s.ringY - 8}px)`;
      labelEl.style.opacity   = hasLabel && !s.isHidden ? '1' : '0';

      // ── Particles on canvas ───────────────────────────────────────────────
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current = particlesRef.current.filter(p => p.life > 0.02);
      particlesRef.current.forEach(p => {
        p.x    += p.vx;
        p.y    += p.vy;
        p.vy   += 0.04;   // gravity
        p.vx   *= 0.97;
        p.life -= 0.028;

        const a = p.life;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 90%, 58%, ${a})`;
        ctx.shadowColor  = `hsla(${p.hue}, 100%, 60%, ${a * 0.6})`;
        ctx.shadowBlur   = 6;
        ctx.fill();
        ctx.shadowBlur   = 0;
      });

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    // ── Mouse events ──────────────────────────────────────────────────────────
    const onMove = (e: MouseEvent) => {
      const s = stateRef.current;

      // Magnetic pull
      let tx = e.clientX, ty = e.clientY;
      const elements = document.querySelectorAll<HTMLElement>(MAGNETIC_SELECTOR);
      let closestDist = Infinity;
      let closestEl: HTMLElement | null = null;

      elements.forEach(el => {
        const r    = el.getBoundingClientRect();
        const cx   = r.left + r.width  / 2;
        const cy   = r.top  + r.height / 2;
        const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
        if (dist < closestDist) { closestDist = dist; closestEl = el; }

        // Magnetic offset on the element itself
        if (dist < MAGNETIC_RADIUS) {
          const pull = (1 - dist / MAGNETIC_RADIUS) * MAGNETIC_STRENGTH;
          el.style.transform = `translate(${(e.clientX - cx) * pull}px, ${(e.clientY - cy) * pull}px)`;
          el.style.transition = 'transform 0.1s ease';
        } else {
          el.style.transform  = '';
          el.style.transition = 'transform 0.4s cubic-bezier(0.22,1,0.36,1)';
        }
      });

      // Cursor pull toward nearest magnetic target
      if (closestEl && closestDist < MAGNETIC_RADIUS) {
        const r  = (closestEl as HTMLElement).getBoundingClientRect();
        const cx = r.left + r.width  / 2;
        const cy = r.top  + r.height / 2;
        const pull = (1 - closestDist / MAGNETIC_RADIUS) * MAGNETIC_STRENGTH * 0.5;
        tx = e.clientX + (cx - e.clientX) * pull;
        ty = e.clientY + (cy - e.clientY) * pull;
      }

      s.x = tx;
      s.y = ty;

      // Detect target under native cursor
      const target = document.elementFromPoint(e.clientX, e.clientY);
      const interactive = target?.closest(MAGNETIC_SELECTOR);
      const textInput   = target?.closest('input, textarea');
      s.isPointer = !!interactive;
      s.isText    = !!textInput;
      s.label     = getLabel(interactive ?? null);

      // Spawn trail particles when moving fast enough
      const dx = e.clientX - lastPosRef.current.x;
      const dy = e.clientY - lastPosRef.current.y;
      const speed = Math.hypot(dx, dy);
      if (speed > 3 && frameRef.current % 2 === 0) {
        spawnParticle(e.clientX, e.clientY);
      }
      lastPosRef.current = { x: e.clientX, y: e.clientY };
    };

    const onDown  = () => { stateRef.current.clicking = true;  spawnParticle(stateRef.current.x, stateRef.current.y); spawnParticle(stateRef.current.x, stateRef.current.y); spawnParticle(stateRef.current.x, stateRef.current.y); };
    const onUp    = () => { stateRef.current.clicking = false; };
    const onLeave = () => { stateRef.current.isHidden = true;  };
    const onEnter = () => { stateRef.current.isHidden = false; };

    window.addEventListener('mousemove',  onMove);
    window.addEventListener('mousedown',  onDown);
    window.addEventListener('mouseup',    onUp);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize',    resize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup',   onUp);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
    };
  }, [spawnParticle]);

  // Hide on touch devices
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    const check = () => setIsTouch(window.matchMedia('(pointer: coarse)').matches);
    check();
  }, []);

  if (isTouch) return null;

  return (
    <>
      <style>{`
        /* Hide native cursor globally */
        *, *::before, *::after { cursor: none !important; }

        /* ── Particle canvas ── */
        .cur-canvas {
          position: fixed; inset: 0;
          pointer-events: none;
          z-index: 99990;
        }

        /* ── Dot (instant, center) ── */
        .cur-dot {
          position: fixed; top: 0; left: 0;
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #ea580c;
          box-shadow: 0 0 10px #ea580c, 0 0 22px rgba(234,88,12,0.5);
          pointer-events: none;
          z-index: 99999;
          will-change: transform;
          transition: transform 0.08s cubic-bezier(0.22,1,0.36,1);
        }

        /* ── Ring 1 — holographic spinning ring ── */
        .cur-ring {
          position: fixed; top: 0; left: 0;
          border-radius: 50%;
          pointer-events: none;
          z-index: 99998;
          will-change: transform, width, height;
          transition: width 0.25s, height 0.25s, opacity 0.3s;

          /* Conic gradient = holographic shimmer */
          background: conic-gradient(
            from 0deg,
            transparent 0%,
            rgba(234,88,12,0.9)  8%,
            rgba(251,146,60,1)   15%,
            rgba(253,224,71,0.8) 20%,
            rgba(251,146,60,0.6) 25%,
            transparent 35%,
            rgba(234,88,12,0.4)  50%,
            rgba(251,146,60,0.7) 60%,
            rgba(234,88,12,0.9)  70%,
            transparent 80%,
            rgba(251,146,60,0.5) 92%,
            transparent 100%
          );
          /* Mask: only show a thin ring */
          -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 2.5px), #000 calc(100% - 2.5px));
                  mask: radial-gradient(farthest-side, transparent calc(100% - 2.5px), #000 calc(100% - 2.5px));
          filter: drop-shadow(0 0 4px rgba(234,88,12,0.8));
        }

        /* ── Ring 2 — outer glow ring, counter-rotate, heavier lag ── */
        .cur-ring2 {
          position: fixed; top: 0; left: 0;
          border-radius: 50%;
          pointer-events: none;
          z-index: 99997;
          will-change: transform;
          transition: width 0.35s, height 0.35s, opacity 0.3s;
          border: 1px solid rgba(234,88,12,0.4);
          box-shadow:
            inset 0 0 8px rgba(234,88,12,0.15),
                  0 0 12px rgba(234,88,12,0.2);
          /* dashed look via conic */
          background: conic-gradient(
            rgba(234,88,12,0.25)  0deg,   transparent 20deg,
            rgba(251,146,60,0.15) 40deg,  transparent 60deg,
            rgba(234,88,12,0.2)   80deg,  transparent 100deg,
            rgba(251,146,60,0.1)  120deg, transparent 140deg,
            rgba(234,88,12,0.2)   160deg, transparent 180deg,
            rgba(251,146,60,0.15) 200deg, transparent 220deg,
            rgba(234,88,12,0.25)  240deg, transparent 260deg,
            rgba(251,146,60,0.2)  280deg, transparent 300deg,
            rgba(234,88,12,0.15)  320deg, transparent 340deg,
            rgba(251,146,60,0.1)  360deg
          );
          -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 1.5px), #000 calc(100% - 1.5px));
                  mask: radial-gradient(farthest-side, transparent calc(100% - 1.5px), #000 calc(100% - 1.5px));
        }

        /* ── Adaptive HUD label ── */
        .cur-label {
          position: fixed; top: 0; left: 0;
          font-family: monospace;
          font-size: 0.52rem;
          font-weight: 800;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(251,146,60,0.95);
          background: rgba(6,4,2,0.75);
          border: 1px solid rgba(234,88,12,0.35);
          border-radius: 4px;
          padding: 2px 6px;
          pointer-events: none;
          z-index: 99999;
          will-change: transform, opacity;
          transition: opacity 0.2s;
          white-space: nowrap;
          backdrop-filter: blur(4px);
          box-shadow: 0 0 10px rgba(234,88,12,0.2);
        }
      `}</style>

      {/* Particle canvas */}
      <canvas ref={canvasRef} className="cur-canvas" />

      {/* Outer glow ring — heaviest lag */}
      <div ref={ring2Ref} className="cur-ring2" />

      {/* Holographic spinning ring — medium lag */}
      <div ref={ringRef} className="cur-ring" />

      {/* Instant dot */}
      <div ref={dotRef} className="cur-dot" />

      {/* Adaptive label */}
      <div ref={labelRef} className="cur-label" />
    </>
  );
}