'use client';

import { X, ChevronLeft, ChevronRight, FileText, ExternalLink, ZoomIn, Download } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';

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
}

interface ImageModalProps {
  isOpen: boolean;
  work: WorkItem | null;
  onClose: () => void;
  images?: string[];
  title?: string;
  pdf?: string | null;
}

// ── Fullscreen lightbox ────────────────────────────────────────────────────────
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

// ── Main modal ─────────────────────────────────────────────────────────────────
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

  // ── LEGACY mode ───────────────────────────────────────────────────────────
  if (!isWorkModal) {
    return (
      <>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
          <div className="relative z-10 bg-card border border-border rounded-3xl w-full max-w-5xl max-h-[95vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
              {legacyTitle && <h2 className="text-xl font-bold">{legacyTitle}</h2>}
              <button onClick={onClose} className="p-2 hover:bg-muted rounded-xl transition-colors ml-auto"><X className="w-6 h-6" /></button>
            </div>
            <div className="flex-1 overflow-auto p-6">
              {isPdf ? (
                <div className="w-full rounded-2xl overflow-hidden border border-border" style={{ height: '78vh' }}>
                  <object data={pdfSrc!} type="application/pdf" className="w-full h-full rounded-2xl">
                    <div className="flex flex-col items-center justify-center h-full gap-4 text-foreground/60">
                      <FileText className="w-12 h-12" />
                      <p className="text-sm">PDF cannot be displayed inline.</p>
                      <a href={pdfSrc!} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2 bg-orange-500 text-white rounded-2xl font-semibold text-sm">
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

  // ── RICH WORK modal ────────────────────────────────────────────────────────
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5">
        <div className="absolute inset-0 bg-black/75 backdrop-blur-md" onClick={onClose} />

        {/*
          KEY FIX: The modal has a hard fixed height.
          The image panel never grows or shrinks — it is a fixed box.
          The image uses absolute inset + object-contain so it fits inside
          without ever changing the box dimensions.
        */}
        <div
          className="relative z-10 bg-card border border-border rounded-3xl w-full max-w-5xl flex flex-col overflow-hidden shadow-2xl"
          style={{ height: 'min(92vh, 720px)' }}
        >

          {/* ── Header — fixed height ── */}
          <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-border shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              {work.category && (
                <span className="hidden sm:inline-flex shrink-0 text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 border border-orange-500/20">
                  {work.category}
                </span>
              )}
              <h2 className="text-base sm:text-xl font-black tracking-tight truncate">{work.title}</h2>
            </div>
            <button onClick={onClose} className="shrink-0 ml-3 p-2 hover:bg-muted rounded-xl transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* ── Body — fills remaining height, never overflows ── */}
          <div className="flex flex-col lg:flex-row flex-1 min-h-0 overflow-hidden">

            {/* LEFT — fixed panel, does not resize with image content */}
            <div className="lg:w-[60%] shrink-0 flex flex-col bg-black/40 min-h-0 overflow-hidden">

              {isPdf ? (
                /* ── PDF viewer ── */
                <>
                  <div className="flex-1 min-h-0 overflow-hidden">
                    <object
                      data={`${pdfSrc}#view=FitH&toolbar=1`}
                      type="application/pdf"
                      className="w-full h-full block"
                    >
                      <div className="flex flex-col items-center justify-center h-full gap-4 text-white/60 p-6">
                        <FileText className="w-14 h-14 opacity-40" />
                        <p className="text-sm text-center">Your browser can't display this PDF inline.</p>
                        <a href={pdfSrc!} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-2xl text-sm">
                          <Download className="w-4 h-4" /> Open / Download PDF
                        </a>
                      </div>
                    </object>
                  </div>
                  <div className="shrink-0 flex items-center justify-center gap-3 p-3 border-t border-border/40">
                    <a href={pdfSrc!} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-2xl text-xs hover:-translate-y-0.5 transition-all shadow">
                      <ExternalLink className="w-3.5 h-3.5" /> Open in new tab
                    </a>
                    <a href={pdfSrc!} download
                      className="inline-flex items-center gap-2 px-5 py-2 border border-border hover:border-orange-500/50 text-foreground/70 hover:text-orange-500 font-semibold rounded-2xl text-xs transition-all">
                      <Download className="w-3.5 h-3.5" /> Download
                    </a>
                  </div>
                </>
              ) : (
                /* ── Image carousel ── */
                <>
                  {/* Image viewport — absolutely fixed, image is painted inside it */}
                  <div className="relative flex-1 min-h-0 overflow-hidden">

                    {/* Loading skeleton */}
                    {!imgLoaded && (
                      <div className="absolute inset-0 bg-white/5 animate-pulse" />
                    )}

                    {/* Image: absolute fill + object-contain — never pushes layout */}
                    <img
                      key={currentImg}
                      src={allImages[currentImg]}
                      alt={`${work.title} — ${currentImg + 1}`}
                      onLoad={() => setImgLoaded(true)}
                      className={`absolute inset-0 w-full h-full object-contain p-4 transition-opacity duration-300 select-none ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                    />

                    {/* Zoom button */}
                    <button
                      onClick={() => setLightboxSrc(allImages[currentImg])}
                      className="absolute top-3 right-3 z-10 p-2 bg-black/60 hover:bg-black/80 backdrop-blur-md rounded-xl text-white/70 hover:text-white transition-all"
                      title="View fullscreen"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>

                    {/* Prev — only when multiple images */}
                    {total > 1 && (
                      <button
                        onClick={prev}
                        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center bg-black/60 hover:bg-black/80 backdrop-blur-md rounded-xl text-white transition-all hover:scale-105 active:scale-95"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                    )}

                    {/* Next — only when multiple images */}
                    {total > 1 && (
                      <button
                        onClick={next}
                        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center bg-black/60 hover:bg-black/80 backdrop-blur-md rounded-xl text-white transition-all hover:scale-105 active:scale-95"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  {/* Thumbnail strip — fixed height, only when multiple images */}
                  {total > 1 && (
                    <div className="shrink-0 flex items-center gap-2 px-3 py-2.5 border-t border-border/40 overflow-x-auto" style={{ height: '56px' }}>
                      {allImages.map((img, i) => (
                        <button
                          key={i}
                          onClick={() => { setCurrentImg(i); setImgLoaded(false); }}
                          className={`shrink-0 w-12 h-9 rounded-lg overflow-hidden border-2 transition-all ${
                            i === currentImg
                              ? 'border-orange-500 shadow-md shadow-orange-500/30 opacity-100'
                              : 'border-border/40 opacity-50 hover:opacity-80 hover:border-orange-500/40'
                          }`}
                        >
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                      <span className="ml-auto shrink-0 text-[11px] text-foreground/40 tabular-nums whitespace-nowrap pr-1">
                        {currentImg + 1} / {total}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* RIGHT — info panel, independently scrollable */}
            <div className="lg:w-[40%] flex flex-col gap-4 p-5 sm:p-6 border-t lg:border-t-0 lg:border-l border-border/50 overflow-y-auto">

              {work.category && (
                <span className="sm:hidden self-start text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 border border-orange-500/20">
                  {work.category}
                </span>
              )}

              <p className="text-[11px] text-foreground/45 font-medium tracking-wide">{work.details}</p>

              <div>
                <p className="text-[9px] uppercase tracking-widest text-foreground/35 mb-1.5 font-semibold">About</p>
                <p className="text-sm text-foreground/80 leading-relaxed">{work.description}</p>
              </div>

              {work.tags && work.tags.length > 0 && (
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-foreground/35 mb-1.5 font-semibold">Tags</p>
                  <div className="flex flex-wrap gap-1.5">
                    {work.tags.map((tag, i) => (
                      <span key={i} className="text-[11px] px-2.5 py-1 bg-muted rounded-lg border border-border hover:border-orange-500/40 hover:bg-orange-500/5 transition-all cursor-default">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Dot indicators in the info panel */}
              {!isPdf && total > 1 && (
                <div className="flex items-center gap-2 text-[11px] text-foreground/45">
                  <div className="flex gap-1">
                    {allImages.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => { setCurrentImg(i); setImgLoaded(false); }}
                        className={`h-1.5 rounded-full transition-all ${i === currentImg ? 'w-5 bg-orange-500' : 'w-1.5 bg-border hover:bg-orange-500/50'}`}
                      />
                    ))}
                  </div>
                  <span>{total} images</span>
                </div>
              )}

              <div className="flex-1" />

              <div className="flex flex-col gap-2 pt-2 border-t border-border/40">
                {work.link ? (
                  <a
                    href={work.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-2xl text-sm hover:shadow-lg hover:-translate-y-0.5 transition-all"
                  >
                    View Live <ExternalLink className="w-4 h-4" />
                  </a>
                ) : (
                  <span className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-muted text-muted-foreground font-semibold rounded-2xl text-sm cursor-default">
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