'use client';

import { useEffect, useRef, useState } from 'react';

export default function SplashScreen() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef   = useRef<number>(0);
  const clockRef  = useRef(0);

  // boot phases drive the sequenced animation
  const [bootPhase, setBootPhase] = useState(0);
  // 0 → black screen
  // 1 → chip appears
  // 2 → circuit traces spread
  // 3 → energy pulse wave
  // 4 → text lines type in
  // 5 → Enter button appears
  // 6 → exit wipe
  // 7 → unmount

  // Lock body scroll and interaction while splash is active
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.body.style.pointerEvents = 'none';
    return () => {
      document.body.style.overflow = '';
      document.body.style.pointerEvents = '';
    };
  }, []);

  useEffect(() => {
    const ts: ReturnType<typeof setTimeout>[] = [];
    ts.push(setTimeout(() => setBootPhase(1), 300));
    ts.push(setTimeout(() => setBootPhase(2), 900));
    ts.push(setTimeout(() => setBootPhase(3), 2200));
    ts.push(setTimeout(() => setBootPhase(4), 3400));
    ts.push(setTimeout(() => setBootPhase(5), 5000));
    return () => ts.forEach(clearTimeout);
  }, []);

  // Canvas: circuit traces + energy pulses
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const W = () => canvas.width;
    const H = () => canvas.height;
    const CX = () => W() / 2;
    const CY = () => H() / 2;

    // Build traces radiating from the center chip
    type Trace = {
      pts: { x: number; y: number }[];
      len: number;    // total path length
      drawn: number;  // 0..1 how far drawn
      pulses: { t: number; alpha: number }[];
      speed: number;
      delay: number;
      color: [number, number, number];
    };

    const buildTraces = (): Trace[] => {
      const traces: Trace[] = [];
      const chipHalf = Math.min(W(), H()) * 0.09;
      const colors: [number, number, number][] = [
        [234, 88,  12],
        [251, 146, 60],
        [253, 186, 116],
        [234, 88,  12],
        [251, 146, 60],
      ];

      // 22 traces in various directions
      const angles = Array.from({ length: 22 }, (_, i) => (i / 22) * Math.PI * 2);
      angles.forEach((ang, i) => {
        const pts: { x: number; y: number }[] = [];
        let x = CX() + Math.cos(ang) * chipHalf * 1.1;
        let y = CY() + Math.sin(ang) * chipHalf * 1.1;
        pts.push({ x, y });

        // Manhattan routing: 3-5 segments per trace
        const segs = 3 + Math.floor(Math.random() * 3);
        let dir = Math.random() < 0.5 ? 'h' : 'v'; // start horizontal or vertical
        for (let s = 0; s < segs; s++) {
          const maxDist = 60 + Math.random() * 180;
          if (dir === 'h') {
            x = x + (Math.cos(ang) > 0 ? 1 : -1) * (20 + Math.random() * maxDist);
            x = Math.max(20, Math.min(W() - 20, x));
          } else {
            y = y + (Math.sin(ang) > 0 ? 1 : -1) * (20 + Math.random() * maxDist);
            y = Math.max(20, Math.min(H() - 20, y));
          }
          pts.push({ x, y });
          dir = dir === 'h' ? 'v' : 'h';
        }

        // measure total length
        let len = 0;
        for (let p = 1; p < pts.length; p++) {
          const dx = pts[p].x - pts[p - 1].x;
          const dy = pts[p].y - pts[p - 1].y;
          len += Math.sqrt(dx * dx + dy * dy);
        }

        traces.push({
          pts,
          len,
          drawn: 0,
          pulses: [],
          speed: 0.004 + Math.random() * 0.006,
          delay: i * 0.06 + Math.random() * 0.1,
          color: colors[i % colors.length],
        });
      });
      return traces;
    };

    let traces: Trace[] = [];
    let tracing = false;
    let pulsing = false;

    const drawTracePath = (
      ctx: CanvasRenderingContext2D,
      pts: { x: number; y: number }[],
      progress: number, // 0..1
      alpha: number,
      color: [number, number, number],
      lineW = 1.2
    ) => {
      if (progress <= 0 || pts.length < 2) return;
      ctx.save();
      ctx.strokeStyle = `rgba(${color[0]},${color[1]},${color[2]},${alpha})`;
      ctx.lineWidth = lineW;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);

      let remaining = progress; // 0..1 of total length
      let covered = 0;
      let totalLen = 0;
      for (let p = 1; p < pts.length; p++) {
        const dx = pts[p].x - pts[p - 1].x;
        const dy = pts[p].y - pts[p - 1].y;
        totalLen += Math.sqrt(dx * dx + dy * dy);
      }
      let drawn = 0;
      const target = progress * totalLen;

      for (let p = 1; p < pts.length; p++) {
        const dx = pts[p].x - pts[p - 1].x;
        const dy = pts[p].y - pts[p - 1].y;
        const segLen = Math.sqrt(dx * dx + dy * dy);
        if (drawn + segLen <= target) {
          ctx.lineTo(pts[p].x, pts[p].y);
          drawn += segLen;
        } else {
          const t = (target - drawn) / segLen;
          ctx.lineTo(pts[p - 1].x + dx * t, pts[p - 1].y + dy * t);
          break;
        }
      }
      ctx.stroke();

      // node dot at end
      const endAlpha = alpha * 0.85;
      const lastPt = (() => {
        let d2 = 0;
        for (let p = 1; p < pts.length; p++) {
          const ddx = pts[p].x - pts[p - 1].x;
          const ddy = pts[p].y - pts[p - 1].y;
          const sl = Math.sqrt(ddx * ddx + ddy * ddy);
          if (d2 + sl >= target) {
            const t = (target - d2) / sl;
            return { x: pts[p - 1].x + ddx * t, y: pts[p - 1].y + ddy * t };
          }
          d2 += sl;
        }
        return pts[pts.length - 1];
      })();
      ctx.beginPath();
      ctx.arc(lastPt.x, lastPt.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color[0]},${color[1]},${color[2]},${endAlpha})`;
      ctx.fill();

      ctx.restore();
    };

    let startTime = -1;
    let phase = 0; // local mirror

    const draw = (ts: number) => {
      if (startTime < 0) startTime = ts;
      const elapsed = (ts - startTime) / 1000;
      clockRef.current = elapsed;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, W(), H());

      // Phase gating
      if (!tracing && elapsed > 0.6) { tracing = true; traces = buildTraces(); }
      if (!pulsing && elapsed > 1.9)  { pulsing = true; }

      // Draw traces
      traces.forEach(tr => {
        const localT = elapsed - tr.delay;
        if (localT <= 0) return;
        if (pulsing) {
          // fully drawn, just glow
          drawTracePath(ctx, tr.pts, 1, 0.18 + 0.08 * Math.sin(elapsed * 1.5 + tr.delay), tr.color);
        } else {
          tr.drawn = Math.min(1, tr.drawn + tr.speed);
          drawTracePath(ctx, tr.pts, tr.drawn, 0.55, tr.color);
        }

        // Pulses
        if (pulsing) {
          if (Math.random() < 0.006) {
            tr.pulses.push({ t: 0, alpha: 0.9 + Math.random() * 0.1 });
          }
          tr.pulses = tr.pulses.filter(p => p.t < 1);
          tr.pulses.forEach(p => {
            p.t += 0.018;
            // draw the pulse dot along the full path
            const totalLen = tr.len;
            let target = p.t * totalLen;
            let d = 0;
            for (let i = 1; i < tr.pts.length; i++) {
              const dx = tr.pts[i].x - tr.pts[i - 1].x;
              const dy = tr.pts[i].y - tr.pts[i - 1].y;
              const sl = Math.sqrt(dx * dx + dy * dy);
              if (d + sl >= target) {
                const tt = (target - d) / sl;
                const px = tr.pts[i - 1].x + dx * tt;
                const py = tr.pts[i - 1].y + dy * tt;
                const a = p.alpha * (1 - p.t);
                // glow
                const grad = ctx.createRadialGradient(px, py, 0, px, py, 7);
                grad.addColorStop(0, `rgba(${tr.color[0]},${tr.color[1]},${tr.color[2]},${a})`);
                grad.addColorStop(1, `rgba(${tr.color[0]},${tr.color[1]},${tr.color[2]},0)`);
                ctx.beginPath();
                ctx.arc(px, py, 7, 0, Math.PI * 2);
                ctx.fillStyle = grad;
                ctx.fill();
                break;
              }
              d += sl;
            }
          });
        }
      });

      // Corner node dots scattered across screen when pulsing
      if (pulsing) {
        const seed = Math.floor(elapsed * 0.3);
        for (let i = 0; i < 28; i++) {
          const nx = ((i * 137 + seed * 13) % (W() - 40)) + 20;
          const ny = ((i * 97  + seed * 7)  % (H() - 40)) + 20;
          const pulse = 0.15 + 0.12 * Math.sin(elapsed * 2 + i * 0.7);
          ctx.beginPath();
          ctx.arc(nx, ny, 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(234,88,12,${pulse})`;
          ctx.fill();
        }
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const handleEnter = () => {
    // Restore page interactivity immediately on enter
    document.body.style.overflow = '';
    document.body.style.pointerEvents = '';
    setBootPhase(6);
    setTimeout(() => setBootPhase(7), 1000);
  };

  if (bootPhase === 7) return null;

  const exiting = bootPhase === 6;

  // boot log lines that type in
  const logLines = [
    '> BIOS v2.6.0 — Gervin Lee Portfolio',
    '> Loading React 18 · Next.js 15 · Tailwind CSS...',
    '> Mounting UI/UX subsystem................. OK',
    '> Full-stack environment initialized........ OK',
    '> All systems nominal.',
  ];

  return (
    <>
      <style>{`
        .spl {
          position: fixed; inset: 0; z-index: 9999;
          background: #060402;
          display: flex; align-items: center; justify-content: center;
          overflow: hidden;
          pointer-events: all;
          transition: opacity 0.9s cubic-bezier(0.76,0,0.24,1);
        }
        .spl.out { opacity: 0; pointer-events: none; }

        /* ── grid bg ── */
        .spl-grid {
          position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(234,88,12,0.055) 1px, transparent 1px),
            linear-gradient(90deg, rgba(234,88,12,0.055) 1px, transparent 1px);
          background-size: 48px 48px;
          animation: spl-grid-drift 18s linear infinite;
        }
        @keyframes spl-grid-drift {
          from { background-position: 0 0, 0 0; }
          to   { background-position: 48px 48px, 48px 48px; }
        }

        /* ── corners ── */
        .spl-c { position: absolute; width: 36px; height: 36px; opacity: 0; animation: spl-fade-in 0.5s ease forwards; }
        .spl-c-tl { top:28px; left:28px; border-top: 1px solid rgba(234,88,12,0.5); border-left: 1px solid rgba(234,88,12,0.5); animation-delay:0.2s; }
        .spl-c-tr { top:28px; right:28px; border-top: 1px solid rgba(234,88,12,0.5); border-right: 1px solid rgba(234,88,12,0.5); animation-delay:0.3s; }
        .spl-c-bl { bottom:28px; left:28px; border-bottom: 1px solid rgba(234,88,12,0.5); border-left: 1px solid rgba(234,88,12,0.5); animation-delay:0.4s; }
        .spl-c-br { bottom:28px; right:28px; border-bottom: 1px solid rgba(234,88,12,0.5); border-right: 1px solid rgba(234,88,12,0.5); animation-delay:0.5s; }
        @keyframes spl-fade-in { to { opacity:1; } }

        /* ── CPU chip ── */
        .spl-chip-wrap {
          position: relative;
          opacity: 0;
          transform: scale(0.5);
          animation: spl-chip-in 0.7s cubic-bezier(0.34,1.56,0.64,1) 0.3s forwards;
          z-index: 10;
          flex-shrink: 0;
        }
        @keyframes spl-chip-in {
          to { opacity:1; transform:scale(1); }
        }

        .spl-chip-svg { display:block; filter: drop-shadow(0 0 18px rgba(234,88,12,0.7)); }

        /* pins pulsing */
        .pin-pulse { animation: pin-blink 1.8s ease-in-out infinite; }
        @keyframes pin-blink {
          0%,100% { opacity:0.4; }
          50%      { opacity:1; }
        }

        /* chip inner glow when pulsing phase */
        .chip-core-glow {
          position: absolute; inset: 0;
          border-radius: 12px;
          background: radial-gradient(circle, rgba(234,88,12,0.0) 40%, transparent 70%);
          transition: background 0.6s;
          pointer-events: none;
        }
        .chip-core-glow.active {
          background: radial-gradient(circle, rgba(234,88,12,0.35) 40%, transparent 70%);
          animation: spl-core-pulse 1.2s ease-in-out infinite;
        }
        @keyframes spl-core-pulse {
          0%,100% { opacity:0.7; }
          50%      { opacity:1; }
        }

        /* outer orbit rings */
        .chip-ring {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(234,88,12,0.18);
          transform: translate(-50%,-50%);
          left: 50%; top: 50%;
          opacity: 0;
          transition: opacity 0.5s;
        }
        .chip-ring.active { opacity: 1; animation: ring-expand 2.5s ease-in-out infinite; }
        .chip-ring-2.active { animation: ring-expand 2.5s ease-in-out 0.6s infinite; }
        @keyframes ring-expand {
          0%   { transform: translate(-50%,-50%) scale(0.92); opacity:0.5; }
          50%  { transform: translate(-50%,-50%) scale(1.04); opacity:1;   }
          100% { transform: translate(-50%,-50%) scale(0.92); opacity:0.5; }
        }

        /* ── layout ── */
        .spl-inner {
          position: relative; z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 32px;
          padding: 20px;
          width: 100%;
          max-width: 560px;
        }

        /* ── name block ── */
        .spl-name-block {
          text-align: center;
          opacity: 0;
          transform: translateY(16px);
          animation: spl-slide-up 0.7s cubic-bezier(0.22,1,0.36,1) 0.5s forwards;
        }
        @keyframes spl-slide-up {
          to { opacity:1; transform:translateY(0); }
        }
        .spl-name {
          font-size: clamp(2.4rem, 7vw, 4.5rem);
          font-weight: 900;
          letter-spacing: -0.04em;
          line-height: 1;
          background: linear-gradient(120deg, #ea580c 0%, #fb923c 50%, #fde68a 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 6px;
        }
        .spl-role {
          font-size: 0.7rem;
          letter-spacing: 0.28em;
          color: rgba(234,88,12,0.5);
          font-family: monospace;
          font-weight: 700;
          text-transform: uppercase;
        }

        /* ── boot log ── */
        .spl-log {
          width: 100%;
          background: rgba(0,0,0,0.55);
          border: 1px solid rgba(234,88,12,0.18);
          border-radius: 10px;
          padding: 14px 18px;
          font-family: monospace;
          font-size: clamp(0.65rem, 2vw, 0.78rem);
          color: rgba(234,88,12,0.75);
          min-height: 118px;
          line-height: 1.7;
          opacity: 0;
          animation: spl-fade-in 0.5s ease forwards;
          animation-delay: 0.1s;
        }
        .spl-log-line { display: block; white-space: nowrap; overflow: hidden; }
        .spl-log-line.typing {
          width: 0;
          animation: spl-type 0.6s steps(45,end) forwards;
        }
        .spl-log-line.done { width: auto; }
        .spl-log-line.ok  { color: #4ade80; }
        @keyframes spl-type { to { width: 100%; } }

        /* cursor blink */
        .spl-cursor {
          display: inline-block;
          width: 7px; height: 1em;
          background: rgba(234,88,12,0.8);
          vertical-align: text-bottom;
          animation: spl-cursor-blink 0.7s step-end infinite;
          margin-left: 2px;
        }
        @keyframes spl-cursor-blink { 50% { opacity:0; } }

        /* ── enter button ── */
        .spl-btn-wrap {
          opacity: 0;
          transform: translateY(12px);
          transition: opacity 0.7s cubic-bezier(0.22,1,0.36,1), transform 0.7s cubic-bezier(0.22,1,0.36,1);
        }
        .spl-btn-wrap.show { opacity:1; transform:translateY(0); }

        .spl-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 13px 38px;
          border-radius: 999px;
          border: 1px solid rgba(234,88,12,0.55);
          background: transparent;
          color: rgba(255,200,140,0.9);
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          cursor: pointer;
          overflow: hidden;
          transition: border-color 0.3s, color 0.3s, box-shadow 0.3s;
        }
        .spl-btn::before {
          content:'';
          position:absolute; inset:0;
          background: linear-gradient(135deg, rgba(234,88,12,0.14), rgba(251,146,60,0.09));
          opacity:0; transition:opacity 0.3s;
        }
        .spl-btn:hover { border-color:rgba(234,88,12,0.95); color:#fff; box-shadow: 0 0 32px rgba(234,88,12,0.4); }
        .spl-btn:hover::before { opacity:1; }
        .spl-btn-ring {
          position:absolute; inset:-7px; border-radius:999px;
          border:1px solid rgba(234,88,12,0.2);
          animation: spl-ring-pulse 2.2s ease-in-out infinite;
          pointer-events:none;
        }
        @keyframes spl-ring-pulse {
          0%,100% { opacity:0.3; transform:scale(1); }
          50%      { opacity:0.9; transform:scale(1.03); }
        }
        .spl-btn-arrow {
          width:18px; height:18px; display:flex; align-items:center; justify-content:center;
          border-radius:50%; border:1px solid rgba(234,88,12,0.5);
          transition:transform 0.3s, border-color 0.3s;
        }
        .spl-btn:hover .spl-btn-arrow { transform:translateX(3px); border-color:rgba(234,88,12,1); }

        /* ── hud top ── */
        .spl-hud {
          position:absolute; top:34px; left:50%; transform:translateX(-50%);
          display:flex; align-items:center; gap:8px;
          opacity:0; animation: spl-fade-in 0.5s ease 0.4s forwards;
          white-space:nowrap;
        }
        .spl-hud-dot {
          width:6px; height:6px; border-radius:50%; background:#ea580c;
          box-shadow:0 0 8px #ea580c;
          animation: spl-hud-dot-blink 1.6s ease-in-out infinite;
        }
        @keyframes spl-hud-dot-blink { 0%,100%{opacity:1} 50%{opacity:0.25} }
        .spl-hud-txt { font-size:0.58rem; letter-spacing:0.26em; color:rgba(234,88,12,0.65); font-family:monospace; font-weight:700; }

        /* ── hud bottom stats ── */
        .spl-stats {
          position:absolute; bottom:34px; left:50%; transform:translateX(-50%);
          display:flex; align-items:center; gap:20px;
          opacity:0; animation: spl-fade-in 0.6s ease 0.9s forwards;
          white-space:nowrap;
        }
        .spl-stat { display:flex; flex-direction:column; align-items:center; gap:2px; }
        .spl-stat-val { font-size:0.82rem; font-weight:900; color:rgba(234,88,12,0.85); font-family:monospace; }
        .spl-stat-lbl { font-size:0.5rem; letter-spacing:0.2em; color:rgba(255,200,140,0.32); text-transform:uppercase; }
        .spl-stat-sep  { width:1px; height:26px; background:rgba(234,88,12,0.18); }

        /* scan line overlay */
        .spl-scanlines {
          position:absolute; inset:0; pointer-events:none;
          background: repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 4px);
        }
      `}</style>

      <div className={`spl${exiting ? ' out' : ''}`}>
        {/* canvas for circuit traces */}
        <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1 }} />

        {/* grid + scan */}
        <div className="spl-grid" />
        <div className="spl-scanlines" />

        {/* corners */}
        <div className="spl-c spl-c-tl" />
        <div className="spl-c spl-c-tr" />
        <div className="spl-c spl-c-bl" />
        <div className="spl-c spl-c-br" />

        {/* hud top */}
        <div className="spl-hud">
          <div className="spl-hud-dot" />
          <span className="spl-hud-txt">SYSTEM BOOT</span>
          <div className="spl-hud-dot" style={{ animationDelay: '0.8s' }} />
        </div>

        {/* main content */}
        <div className="spl-inner">

          {/* CPU chip SVG */}
          {bootPhase >= 1 && (
            <div className="spl-chip-wrap">
              {/* orbit rings */}
              <div className={`chip-ring${bootPhase >= 3 ? ' active' : ''}`}
                style={{ width: 220, height: 220 }} />
              <div className={`chip-ring chip-ring-2${bootPhase >= 3 ? ' active' : ''}`}
                style={{ width: 270, height: 270 }} />

              <div className="chip-core-glow" style={{ position: 'absolute', inset: 20 }} />
              <div className={`chip-core-glow${bootPhase >= 3 ? ' active' : ''}`}
                style={{ position: 'absolute', inset: 20 }} />

              <ChipSVG phase={bootPhase} />
            </div>
          )}

          {/* name */}
          <div className="spl-name-block">
            <div className="spl-name">Gervin Lee</div>
            <div className="spl-role">Aspiring Developer &amp; UI/UX Designer</div>
          </div>

          {/* boot log */}
          {bootPhase >= 4 && (
            <BootLog lines={logLines} onDone={() => {}} />
          )}

          {/* enter button */}
          <div className={`spl-btn-wrap${bootPhase >= 5 ? ' show' : ''}`}>
            <button className="spl-btn" onClick={handleEnter}>
              <div className="spl-btn-ring" />
              Enter Portfolio
              <div className="spl-btn-arrow">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5h6M6 3l2 2-2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ── CPU chip SVG with pins ───────────────────────────────────────────────────
function ChipSVG({ phase }: { phase: number }) {
  const powered = phase >= 3;
  const S = 110; // chip body size
  const pinCount = 6;
  const pinLen = 18;
  const pinGap = 12;
  const offset = (S - (pinCount - 1) * pinGap) / 2;

  const pins: { x1:number; y1:number; x2:number; y2:number; delay:number }[] = [];
  for (let i = 0; i < pinCount; i++) {
    const p = offset + i * pinGap;
    const d = (i * 0.12).toFixed(2);
    // top
    pins.push({ x1: p, y1: 0, x2: p, y2: -pinLen, delay: i * 0.08 });
    // bottom
    pins.push({ x1: p, y1: S, x2: p, y2: S + pinLen, delay: i * 0.08 + 0.05 });
    // left
    pins.push({ x1: 0, y1: p, x2: -pinLen, y2: p, delay: i * 0.08 + 0.1 });
    // right
    pins.push({ x1: S, y1: p, x2: S + pinLen, y2: p, delay: i * 0.08 + 0.15 });
  }

  const totalW = S + pinLen * 2 + 4;
  const vb = `-${pinLen + 2} -${pinLen + 2} ${totalW} ${totalW}`;

  return (
    <svg
      className="spl-chip-svg"
      viewBox={vb}
      width={totalW}
      height={totalW}
      style={{ overflow: 'visible' }}
    >
      {/* pins */}
      {pins.map((p, i) => (
        <line key={i}
          x1={p.x1} y1={p.y1} x2={p.x2} y2={p.y2}
          stroke={powered ? '#fb923c' : '#3a2010'}
          strokeWidth="2.5"
          strokeLinecap="round"
          className={powered ? 'pin-pulse' : ''}
          style={{ animationDelay: `${p.delay}s` }}
        />
      ))}
      {/* pin end dots */}
      {pins.map((p, i) => (
        <circle key={`d-${i}`} cx={p.x2} cy={p.y2} r="3"
          fill={powered ? '#fb923c' : '#2a1608'}
          className={powered ? 'pin-pulse' : ''}
          style={{ animationDelay: `${p.delay + 0.1}s` }}
        />
      ))}

      {/* chip body */}
      <rect x="0" y="0" width={S} height={S} rx="12"
        fill={powered ? '#1a0d04' : '#0f0804'}
        stroke={powered ? '#ea580c' : '#2a1608'}
        strokeWidth="1.5"
      />

      {/* inner border */}
      <rect x="8" y="8" width={S - 16} height={S - 16} rx="8"
        fill="none"
        stroke={powered ? 'rgba(234,88,12,0.35)' : 'rgba(234,88,12,0.08)'}
        strokeWidth="1"
      />

      {/* die grid lines */}
      {[28, 42, 56, 70, 84].map(v => (
        <g key={v}>
          <line x1={v} y1="12" x2={v} y2={S - 12}
            stroke={powered ? 'rgba(234,88,12,0.18)' : 'rgba(234,88,12,0.05)'}
            strokeWidth="0.7" />
          <line x1="12" y1={v} x2={S - 12} y2={v}
            stroke={powered ? 'rgba(234,88,12,0.18)' : 'rgba(234,88,12,0.05)'}
            strokeWidth="0.7" />
        </g>
      ))}

      {/* center die */}
      <rect x="30" y="30" width={S - 60} height={S - 60} rx="6"
        fill={powered ? 'rgba(234,88,12,0.12)' : 'rgba(234,88,12,0.03)'}
        stroke={powered ? 'rgba(234,88,12,0.6)' : 'rgba(234,88,12,0.12)'}
        strokeWidth="1"
      />

      {/* Logo placeholder */}
      <image
        href="/assets/favicon.png"
        x="34" y="34"
        width={S - 68} height={S - 68}
        preserveAspectRatio="xMidYMid meet"
        style={{ opacity: powered ? 1 : 0.2, transition: 'opacity 0.6s' }}
      />

      {/* corner markers on chip body */}
      {[[4,4],[S-4,4],[4,S-4],[S-4,S-4]].map(([cx,cy],i) => (
        <circle key={`cm-${i}`} cx={cx} cy={cy} r="3"
          fill={powered ? 'rgba(234,88,12,0.7)' : 'rgba(234,88,12,0.15)'}
          className={powered ? 'pin-pulse' : ''}
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </svg>
  );
}

// ── Boot log with per-line typewriter ────────────────────────────────────────
function BootLog({ lines, onDone }: { lines: string[]; onDone: () => void }) {
  const [visible, setVisible] = useState<number[]>([]);

  useEffect(() => {
    // reveal one line at a time
    lines.forEach((_, i) => {
      const t = setTimeout(() => {
        setVisible(v => [...v, i]);
        if (i === lines.length - 1) onDone();
      }, i * 620 + 80);
      return () => clearTimeout(t);
    });
  }, []);

  const isOk = (l: string) => l.includes('OK');

  return (
    <div className="spl-log">
      {lines.map((line, i) => {
        if (!visible.includes(i)) return null;
        const isLast = i === Math.max(...visible);
        return (
          <span key={i} className={`spl-log-line${isLast ? ' typing' : ' done'}${isOk(line) ? ' ok' : ''}`}
            style={{ animationDuration: `${Math.max(0.3, line.length * 0.022)}s` }}>
            {line}
            {isLast && <span className="spl-cursor" />}
          </span>
        );
      })}
    </div>
  );
}