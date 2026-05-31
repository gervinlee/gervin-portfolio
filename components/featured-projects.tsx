'use client';

export function FeaturedProjects() {
  return (
    <section className="fp-section">
      <style>{`
        /* ── SECTION ── */
        .fp-section {
          position: relative;
          padding: 3.5rem 1rem 4rem;
          overflow: hidden;
        }

        @media (min-width: 640px)  { .fp-section { padding: 7rem 1.5rem 9rem; } }
        @media (min-width: 1024px) { .fp-section { padding: 8rem 2rem 10rem; } }

        /* Ambient background glow */
        .fp-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 70% 40% at 20% 60%, rgba(255,140,40,0.06) 0%, transparent 60%),
            radial-gradient(ellipse 50% 30% at 80% 20%, rgba(255,100,20,0.04) 0%, transparent 55%);
          pointer-events: none;
        }

        /* ── HEADER ── */
        .fp-header {
          position: relative;
          max-width: 80rem;
          margin: 0 auto 4rem;
        }

        @media (min-width: 640px)  { .fp-header { margin-bottom: 5rem; } }

        .fp-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #f97316;
          margin-bottom: 1rem;
          padding: 0.4rem 1rem;
          border: 1px solid rgba(249,115,22,0.3);
          border-radius: 999px;
          background: rgba(249,115,22,0.07);
        }

        .fp-eyebrow-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #f97316;
          box-shadow: 0 0 8px #f97316;
          animation: fp-pulse 2s ease-in-out infinite;
        }

        @keyframes fp-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.8); }
        }

        .fp-title {
          font-size: clamp(2.4rem, 6vw, 5rem);
          font-weight: 900;
          line-height: 0.95;
          letter-spacing: -0.02em;
          margin: 0 0 1.25rem;
        }

        .fp-title-muted {
          color: var(--foreground);
          opacity: 0.15;
        }

        .fp-subtitle {
          max-width: 32rem;
          font-size: 0.95rem;
          line-height: 1.7;
          color: var(--foreground);
          opacity: 0.55;
        }

        /* ── GRID ── */
        .fp-grid {
          position: relative;
          max-width: 80rem;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }

        @media (min-width: 768px) {
          .fp-grid {
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
          }
        }

        /* ── CARD ── */
        .fp-card {
          position: relative;
          border-radius: 1.25rem;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.02);
          backdrop-filter: blur(4px);
          cursor: pointer;
          transition: border-color 0.35s ease, transform 0.35s ease, box-shadow 0.35s ease;
        }

        .fp-card:hover {
          border-color: rgba(249,115,22,0.4);
          transform: translateY(-6px);
          box-shadow:
            0 24px 60px rgba(0,0,0,0.35),
            0 0 0 1px rgba(249,115,22,0.15),
            0 0 80px rgba(249,115,22,0.08);
        }

        /* ── IMAGE AREA ── */
        .fp-image-wrap {
          position: relative;
          aspect-ratio: 16 / 9;
          overflow: hidden;
        }

        .fp-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), filter 0.4s ease;
          filter: brightness(0.85) saturate(1.1);
        }

        .fp-card:hover .fp-img {
          transform: scale(1.07);
          filter: brightness(0.5) saturate(0.8);
        }

        /* Gradient base always present */
        .fp-image-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(0,0,0,0.55) 0%,
            rgba(0,0,0,0.1) 50%,
            transparent 100%
          );
          transition: opacity 0.4s ease;
        }

        .fp-card:hover .fp-image-gradient {
          opacity: 0;
        }

        /* Hover overlay with info */
        .fp-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1.25rem;
          background: linear-gradient(
            135deg,
            rgba(15,10,5,0.82) 0%,
            rgba(30,15,5,0.78) 100%
          );
          opacity: 0;
          transition: opacity 0.35s ease;
          padding: 2rem;
          text-align: center;
        }

        .fp-card:hover .fp-overlay {
          opacity: 1;
        }

        /* Scan line sweep on hover */
        .fp-overlay::after {
          content: '';
          position: absolute;
          left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(249,115,22,0.7), transparent);
          top: -2px;
          animation: fp-scan 1.6s ease-in-out infinite;
          opacity: 0;
          transition: opacity 0.3s ease 0.1s;
        }

        .fp-card:hover .fp-overlay::after {
          opacity: 1;
        }

        @keyframes fp-scan {
          0%   { top: 0%; }
          100% { top: 100%; }
        }

        /* Corner brackets on overlay */
        .fp-corner {
          position: absolute;
          width: 22px;
          height: 22px;
          border-color: rgba(249,115,22,0.7);
          border-style: solid;
          border-width: 0;
          opacity: 0;
          transition: opacity 0.3s ease 0.1s;
        }

        .fp-card:hover .fp-corner { opacity: 1; }

        .fp-corner-tl { top: 16px; left: 16px; border-top-width: 2px; border-left-width: 2px; border-radius: 3px 0 0 0; }
        .fp-corner-tr { top: 16px; right: 16px; border-top-width: 2px; border-right-width: 2px; border-radius: 0 3px 0 0; }
        .fp-corner-bl { bottom: 16px; left: 16px; border-bottom-width: 2px; border-left-width: 2px; border-radius: 0 0 0 3px; }
        .fp-corner-br { bottom: 16px; right: 16px; border-bottom-width: 2px; border-right-width: 2px; border-radius: 0 0 3px 0; }

        .fp-overlay-icon {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          border: 2px solid rgba(249,115,22,0.5);
          background: rgba(249,115,22,0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fb923c;
          transform: scale(0.85);
          transition: transform 0.3s ease 0.05s;
          backdrop-filter: blur(4px);
        }

        .fp-card:hover .fp-overlay-icon {
          transform: scale(1);
        }

        .fp-overlay-label {
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #fb923c;
        }

        .fp-overlay-title {
          font-size: 1.3rem;
          font-weight: 800;
          color: #fff;
          line-height: 1.2;
        }

        .fp-overlay-desc {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.65);
          line-height: 1.6;
          max-width: 22rem;
        }

        /* Number badge on image */
        .fp-number {
          position: absolute;
          top: 1rem;
          left: 1rem;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          color: rgba(255,255,255,0.45);
          background: rgba(0,0,0,0.35);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 999px;
          padding: 0.25rem 0.7rem;
          font-variant-numeric: tabular-nums;
          transition: color 0.3s ease, border-color 0.3s ease;
          z-index: 5;
        }

        .fp-card:hover .fp-number {
          color: #fb923c;
          border-color: rgba(249,115,22,0.4);
        }

        /* Category badge on image */
        .fp-category-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #f97316;
          background: rgba(249,115,22,0.12);
          border: 1px solid rgba(249,115,22,0.3);
          border-radius: 999px;
          padding: 0.3rem 0.85rem;
          backdrop-filter: blur(8px);
          z-index: 5;
        }

        /* ── BODY ── */
        .fp-body {
          padding: 1.5rem 1.75rem 1.75rem;
          position: relative;
        }

        /* Subtle top line accent */
        .fp-body::before {
          content: '';
          position: absolute;
          top: 0; left: 1.75rem; right: 1.75rem;
          height: 1px;
          background: linear-gradient(90deg, rgba(249,115,22,0.4), transparent);
          opacity: 0;
          transition: opacity 0.35s ease;
        }

        .fp-card:hover .fp-body::before { opacity: 1; }

        .fp-body-title {
          font-size: 1.2rem;
          font-weight: 800;
          letter-spacing: -0.01em;
          margin: 0 0 0.35rem;
          color: var(--foreground);
          transition: color 0.3s ease;
        }

        .fp-card:hover .fp-body-title { color: #fb923c; }

        .fp-body-desc {
          font-size: 0.8rem;
          line-height: 1.65;
          color: var(--foreground);
          opacity: 0.55;
          margin: 0 0 1.25rem;
        }

        /* ── TAGS ── */
        .fp-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          margin-bottom: 1.4rem;
        }

        .fp-tag {
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          padding: 0.28rem 0.75rem;
          border-radius: 999px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          color: var(--foreground);
          opacity: 0.7;
          transition: background 0.25s, border-color 0.25s, opacity 0.25s;
        }

        .fp-card:hover .fp-tag {
          background: rgba(249,115,22,0.08);
          border-color: rgba(249,115,22,0.25);
          opacity: 1;
        }

        /* ── CTA BUTTON ── */
        .fp-cta {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          padding: 0.6rem 1.3rem;
          border-radius: 0.6rem;
          background: linear-gradient(135deg, #ea580c, #c2410c);
          color: #fff;
          text-decoration: none;
          position: relative;
          overflow: hidden;
          transition: box-shadow 0.3s ease, transform 0.2s ease;
        }

        .fp-cta::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
          opacity: 0;
          transition: opacity 0.25s;
        }

        .fp-cta:hover {
          box-shadow: 0 6px 24px rgba(234,88,12,0.45);
          transform: translateY(-1px);
        }

        .fp-cta:hover::before { opacity: 1; }

        .fp-cta-arrow {
          transition: transform 0.2s ease;
        }

        .fp-cta:hover .fp-cta-arrow { transform: translateX(3px); }

        /* ── DIVIDER LINE ── */
        .fp-row-divider {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.3rem;
        }

        .fp-divider-line {
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.07);
        }

        .fp-divider-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: rgba(249,115,22,0.4);
        }

        /* ── FALLBACK GRADIENT BG (if image fails) ── */
        .fp-img-fallback-orange {
          background: linear-gradient(135deg, rgba(234,88,12,0.25) 0%, rgba(120,30,5,0.55) 100%);
        }

        .fp-img-fallback-blue {
          background: linear-gradient(135deg, rgba(37,99,235,0.25) 0%, rgba(10,30,100,0.55) 100%);
        }
      `}</style>

      <div className="fp-header">
        <h2 className="fp-title">
          Featured Projects
        </h2>
        <p className="fp-subtitle">
          Showcasing my best work in full-stack development and design — built for real users, real problems.
        </p>
      </div>

      <div className="fp-grid">

        {/* ── ResearchConnect Card ── */}
        <div className="fp-card">

          {/* Image */}
          <div className="fp-image-wrap fp-img-fallback-orange">
            <img
              src="/assets/researchconnect-login.png"
              alt="ResearchConnect"
              className="fp-img"
            />
            <div className="fp-image-gradient" />

            {/* Corner brackets */}
            <div className="fp-corner fp-corner-tl" />
            <div className="fp-corner fp-corner-tr" />
            <div className="fp-corner fp-corner-bl" />
            <div className="fp-corner fp-corner-br" />

            {/* Number */}
            <span className="fp-number">01 / 02</span>

            {/* Category */}
            <span className="fp-category-badge">Web Development</span>

            {/* Hover overlay */}
            <div className="fp-overlay">
              <div className="fp-overlay-icon">
                <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </div>
              <div className="fp-overlay-label">Live Project</div>
              <div className="fp-overlay-title">ResearchConnect+</div>
              <div className="fp-overlay-desc">
                A full-featured research management platform for PLV&apos;s IT department.
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="fp-body">
            <h3 className="fp-body-title">ResearchConnect+</h3>
            <p className="fp-body-desc">
              Research management platform built for PLV&apos;s IT department — covering ERC compliance, topic proposals, repository access, and mentorship coordination.
            </p>

            <div className="fp-row-divider">
              <div className="fp-divider-line" />
              <div className="fp-divider-dot" />
              <div className="fp-divider-line" />
            </div>

            <div className="fp-tags">
              <span className="fp-tag">React</span>
              <span className="fp-tag">Next.js</span>
              <span className="fp-tag">Supabase</span>
            </div>

            <a
              href="https://erc-system.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="fp-cta"
            >
              View Project
              <svg className="fp-cta-arrow" width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
          </div>
        </div>

        {/* ── SatisTrack Card ── */}
        <div className="fp-card">

          {/* Image */}
          <div className="fp-image-wrap fp-img-fallback-blue">
            <img
              src="/assets/satistrack-landing.png"
              alt="SatisTrack"
              className="fp-img"
            />
            <div className="fp-image-gradient" />

            {/* Corner brackets */}
            <div className="fp-corner fp-corner-tl" />
            <div className="fp-corner fp-corner-tr" />
            <div className="fp-corner fp-corner-bl" />
            <div className="fp-corner fp-corner-br" />

            {/* Number */}
            <span className="fp-number">02 / 02</span>

            {/* Category */}
            <span className="fp-category-badge">System Kiosk</span>

            {/* Hover overlay */}
            <div className="fp-overlay">
              <div className="fp-overlay-icon">
                <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </div>
              <div className="fp-overlay-label">Live Project</div>
              <div className="fp-overlay-title">SatisTrack</div>
              <div className="fp-overlay-desc">
                Real-time analytics for satisfaction metrics with automated reporting.
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="fp-body">
            <h3 className="fp-body-title">SatisTrack</h3>
            <p className="fp-body-desc">
              Analytics platform for tracking and analyzing satisfaction metrics — real-time dashboards, trend analysis, and automated reporting tools.
            </p>

            <div className="fp-row-divider">
              <div className="fp-divider-line" />
              <div className="fp-divider-dot" />
              <div className="fp-divider-line" />
            </div>

            <div className="fp-tags">
              <span className="fp-tag">React</span>
              <span className="fp-tag">Next.js</span>
              <span className="fp-tag">PostgreSQL</span>
            </div>

            <a
              href="https://satis-track.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="fp-cta"
            >
              View Project
              <svg className="fp-cta-arrow" width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}