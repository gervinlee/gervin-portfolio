'use client';

import { X, ChevronLeft, ChevronRight, FileText, ExternalLink, ZoomIn, Download, Users } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';

export interface Collaborator {
  name: string;
  role?: string;
}

export interface WorkItem {
  title: string;
  description: string;
  details: string;
  image: string;
  images?: string[];
  pdf?: string | null;
  category?: string;
  tags?: string[];
  link?: string | null;
  collaborators?: Collaborator[];
}

interface ImageModalProps {
  isOpen: boolean;
  work: WorkItem | null;
  onClose: () => void;
  images?: string[];
  title?: string;
  pdf?: string | null;
}

function initials(name: string) {
  return name.trim().split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

function avatarHue(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360;
  return h;
}

// ── Fullscreen lightbox ───────────────────────────────────────────────────────
function Lightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/95 backdrop-blur-lg p-4"
      onClick={onClose}
    >
      <button onClick={onClose} className="absolute top-4 right-4 p-2.5 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors z-10">
        <X className="w-5 h-5 text-white" />
      </button>
      <img
        src={src}
        alt={alt}
        className="max-w-full max-h-[92vh] object-contain rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}

// ── Main modal ────────────────────────────────────────────────────────────────
export default function ImageModal({
  isOpen,
  work,
  onClose,
  images: legacyImages,
  title: legacyTitle,
  pdf: legacyPdf,
}: ImageModalProps) {
  const [currentImg, setCurrentImg] = useState(0);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [imgLoaded, setImgLoaded] = useState(false);

  const isWorkModal = !!work;

  const allImages = isWorkModal
    ? (work.images && work.images.length > 0 ? work.images : [work.image])
    : (legacyImages ?? []);

  const isPdf  = isWorkModal ? !!work.pdf : !!legacyPdf;
  const pdfSrc = isWorkModal ? work.pdf   : legacyPdf;
  const total  = allImages.length;

  const prev = useCallback(() => { setImgLoaded(false); setCurrentImg(i => (i - 1 + total) % total); }, [total]);
  const next = useCallback(() => { setImgLoaded(false); setCurrentImg(i => (i + 1) % total); }, [total]);

  useEffect(() => { setCurrentImg(0); setImgLoaded(false); }, [work, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (lightboxSrc) { if (e.key === 'Escape') setLightboxSrc(null); return; }
      if (e.key === 'Escape')     onClose();
      if (e.key === 'ArrowLeft')  prev();
      if (e.key === 'ArrowRight') next();
    };
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [isOpen, onClose, prev, next, lightboxSrc]);

  if (!isOpen) return null;

  // ── LEGACY mode (featured project screenshots) ────────────────────────────
  if (!isWorkModal) {
    return (
      <>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
          <div className="relative z-10 bg-card border border-border rounded-3xl w-full max-w-5xl max-h-[95vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
              {legacyTitle && <h2 className="text-xl font-bold">{legacyTitle}</h2>}
              <button onClick={onClose} className="p-2 hover:bg-muted rounded-xl transition-colors ml-auto">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-6">
              {isPdf ? (
                <div className="w-full rounded-2xl overflow-hidden border border-border" style={{ height: '78vh' }}>
                  <object data={pdfSrc!} type="application/pdf" className="w-full h-full rounded-2xl">
                    <div className="flex flex-col items-center justify-center h-full gap-4 text-foreground/60">
                      <FileText className="w-12 h-12" />
                      <p className="text-sm">PDF cannot be displayed inline.</p>
                      <a href={pdfSrc!} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2 bg-orange-500 text-white rounded-2xl font-semibold text-sm">
                        <Download className="w-4 h-4" /> Open PDF
                      </a>
                    </div>
                  </object>
                </div>
              ) : (
                <div className="flex flex-col gap-8">
                  {allImages.map((img, i) => (
                    <img key={i} src={img} alt={legacyTitle || ''} className="max-w-full h-auto mx-auto rounded-2xl shadow-lg object-contain" />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        {lightboxSrc && <Lightbox src={lightboxSrc} alt={legacyTitle || ''} onClose={() => setLightboxSrc(null)} />}
      </>
    );
  }

  // ── RICH WORK modal ───────────────────────────────────────────────────────
  const collabs = work.collaborators ?? [];

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-6">
        <div className="absolute inset-0 bg-black/75 backdrop-blur-md" onClick={onClose} />

        {/*
          MOBILE  (<sm): full-height bottom sheet, NO scrollbars.
                         Image + info split the available height exactly.
          DESKTOP (sm+): large centered card, fixed to viewport height, side-by-side.
        */}
        <div className="
          relative z-10 bg-card border border-border shadow-2xl w-full flex flex-col overflow-hidden

          /* Mobile: bottom sheet, exact screen height, no scroll */
          rounded-t-3xl h-[100dvh]

          /* Desktop: centered card, bigger, no scroll */
          sm:rounded-3xl sm:max-w-6xl sm:h-[92dvh]
        ">

          {/* ── Header ── */}
          <div className="flex items-center justify-between px-4 sm:px-7 py-3 sm:py-4 border-b border-border shrink-0">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              {work.category && (
                <span className="hidden sm:inline-flex shrink-0 text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-500 border border-orange-500/20 whitespace-nowrap">
                  {work.category}
                </span>
              )}
              <h2 className="text-sm sm:text-xl font-black tracking-tight truncate">{work.title}</h2>
            </div>
            <button onClick={onClose} className="shrink-0 ml-2 p-1.5 sm:p-2 hover:bg-muted rounded-xl transition-colors">
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/*
            ── Body ──
            MOBILE:  stacked column. Image flex-[3], info flex-[2] — split the remaining
                     height proportionally with zero overflow so no scrollbar ever appears.
            DESKTOP: side-by-side. Both columns fill the fixed card height exactly.
          */}
          <div className="flex flex-col lg:flex-row flex-1 min-h-0 overflow-hidden">

            {/* ── LEFT: image carousel / PDF ── */}
            <div className="
              lg:w-[60%] shrink-0 flex flex-col bg-black/40 min-h-0 overflow-hidden

              /* Mobile: take 55% of remaining height */
              flex-[11]

              /* Desktop: fill column */
              lg:flex-none
            ">

              {isPdf ? (
                <>
                  <div className="flex-1 min-h-0 overflow-hidden">
                    <object data={`${pdfSrc}#view=FitH&toolbar=1`} type="application/pdf" className="w-full h-full block">
                      <div className="flex flex-col items-center justify-center h-full gap-3 text-white/60 p-4">
                        <FileText className="w-10 h-10 opacity-40" />
                        <p className="text-xs text-center">Browser can't display PDF inline.</p>
                        <a href={pdfSrc!} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl text-xs">
                          <Download className="w-3.5 h-3.5" /> Open PDF
                        </a>
                      </div>
                    </object>
                  </div>
                  <div className="shrink-0 flex items-center justify-center gap-2 p-2.5 border-t border-border/40">
                    <a href={pdfSrc!} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl text-xs hover:-translate-y-0.5 transition-all shadow">
                      <ExternalLink className="w-3 h-3" /> Open in new tab
                    </a>
                    <a href={pdfSrc!} download
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 border border-border hover:border-orange-500/50 text-foreground/70 hover:text-orange-500 font-semibold rounded-xl text-xs transition-all">
                      <Download className="w-3 h-3" /> Download
                    </a>
                  </div>
                </>
              ) : (
                <>
                  {/* Image viewport */}
                  <div className="relative flex-1 min-h-0 overflow-hidden">
                    {!imgLoaded && <div className="absolute inset-0 bg-white/5 animate-pulse" />}

                    <img
                      key={currentImg}
                      src={allImages[currentImg]}
                      alt={`${work.title} — ${currentImg + 1}`}
                      onLoad={() => setImgLoaded(true)}
                      className={`absolute inset-0 w-full h-full object-contain p-3 transition-opacity duration-300 select-none ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                    />

                    {/* Zoom */}
                    <button
                      onClick={() => setLightboxSrc(allImages[currentImg])}
                      className="absolute top-2 right-2 z-10 p-1.5 sm:p-2 bg-black/60 hover:bg-black/80 backdrop-blur-md rounded-xl text-white/70 hover:text-white transition-all"
                    >
                      <ZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>

                    {/* Prev */}
                    {total > 1 && (
                      <button onClick={prev}
                        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-black/60 hover:bg-black/80 backdrop-blur-md rounded-xl text-white transition-all active:scale-95">
                        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    )}

                    {/* Next */}
                    {total > 1 && (
                      <button onClick={next}
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-black/60 hover:bg-black/80 backdrop-blur-md rounded-xl text-white transition-all active:scale-95">
                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    )}
                  </div>

                  {/* Thumbnail strip */}
                  {total > 1 && (
                    <div className="shrink-0 flex items-center gap-1.5 px-3 border-t border-border/40 overflow-x-auto" style={{ height: '52px' }}>
                      {allImages.map((img, i) => (
                        <button key={i} onClick={() => { setCurrentImg(i); setImgLoaded(false); }}
                          className={`shrink-0 w-11 h-8 sm:w-13 sm:h-9 rounded-lg overflow-hidden border-2 transition-all ${
                            i === currentImg
                              ? 'border-orange-500 shadow-md shadow-orange-500/30 opacity-100'
                              : 'border-border/40 opacity-50 hover:opacity-80 hover:border-orange-500/40'
                          }`}>
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                      <span className="ml-auto shrink-0 text-[10px] text-foreground/40 tabular-nums whitespace-nowrap pr-1">
                        {currentImg + 1} / {total}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* ── RIGHT: info panel ── */}
            {/*
              Mobile:  flows naturally below the image, no height restriction
              Desktop: fixed-height column, independently scrolls
            */}
            <div className="lg:w-[40%] flex flex-col gap-2 sm:gap-4 p-4 sm:p-6 border-t lg:border-t-0 lg:border-l border-border/50 min-h-0 overflow-hidden lg:overflow-y-auto flex-[9] lg:flex-none">

              {/* Mobile category badge */}
              {work.category && (
                <span className="sm:hidden self-start text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-500 border border-orange-500/20">
                  {work.category}
                </span>
              )}

              {/* Details */}
              <p className="text-[10px] sm:text-[11px] text-foreground/45 font-medium tracking-wide">{work.details}</p>

              {/* About */}
              <div>
                <p className="text-[8px] sm:text-[9px] uppercase tracking-widest text-foreground/35 mb-1 sm:mb-1.5 font-semibold">About</p>
                <p className="text-[11px] sm:text-sm text-foreground/80 leading-snug sm:leading-relaxed line-clamp-4 sm:line-clamp-none">{work.description}</p>
              </div>

              {/* Tags */}
              {work.tags && work.tags.length > 0 && (
                <div>
                  <p className="text-[8px] sm:text-[9px] uppercase tracking-widest text-foreground/35 mb-1 sm:mb-1.5 font-semibold">Tags</p>
                  <div className="flex flex-wrap gap-1 sm:gap-1.5">
                    {work.tags.map((tag, i) => (
                      <span key={i} className="text-[10px] sm:text-[11px] px-2 sm:px-2.5 py-0.5 sm:py-1 bg-muted rounded-lg border border-border hover:border-orange-500/40 hover:bg-orange-500/5 transition-all cursor-default">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Collaborators */}
              {collabs.length > 0 && (
                <div>
                  <p className="text-[8px] sm:text-[9px] uppercase tracking-widest text-foreground/35 mb-2 font-semibold flex items-center gap-1.5">
                    <Users className="w-3 h-3" /> Made with
                  </p>
                  <div className="flex flex-col gap-2">
                    {collabs.map((c, i) => {
                      const hue = avatarHue(c.name);
                      return (
                        <div key={i} className="flex items-center gap-2.5">
                          <div
                            className="shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold text-white select-none"
                            style={{ background: `hsl(${hue},55%,45%)` }}
                          >
                            {initials(c.name)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs sm:text-sm font-semibold leading-tight truncate">{c.name}</p>
                            {c.role && <p className="text-[9px] sm:text-[10px] text-foreground/45 leading-tight truncate">{c.role}</p>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Dot indicators */}
              {!isPdf && total > 1 && (
                <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-foreground/45">
                  <div className="flex gap-1 flex-wrap">
                    {allImages.map((_, i) => (
                      <button key={i} onClick={() => { setCurrentImg(i); setImgLoaded(false); }}
                        className={`h-1.5 rounded-full transition-all ${i === currentImg ? 'w-5 bg-orange-500' : 'w-1.5 bg-border hover:bg-orange-500/50'}`}
                      />
                    ))}
                  </div>
                  <span className="shrink-0">{total} images</span>
                </div>
              )}

              {/* Spacer pushes action to bottom — desktop only */}
              <div className="hidden lg:block flex-1 min-h-0" />

              {/* Action button */}
              <div className="flex flex-col gap-2 pt-2 border-t border-border/40 mt-auto sm:mt-2">
                {work.link ? (
                  <a href={work.link} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-2xl text-xs sm:text-sm hover:shadow-lg hover:-translate-y-0.5 transition-all">
                    View Live <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </a>
                ) : (
                  <span className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-muted text-muted-foreground font-semibold rounded-2xl text-xs sm:text-sm cursor-default">
                    Unavailable
                  </span>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>

      {lightboxSrc && <Lightbox src={lightboxSrc} alt={work.title} onClose={() => setLightboxSrc(null)} />}
    </>
  );
}