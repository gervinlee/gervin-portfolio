'use client';

import { X } from 'lucide-react';
import { useEffect } from 'react';

interface ImageModalProps {
  isOpen: boolean;
  images: string[];
  pdf?: string | null;
  onClose: () => void;
  title?: string;
}

export default function ImageModal({ isOpen, images, pdf, onClose, title }: ImageModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) document.addEventListener('keydown', handleEsc);

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 bg-card border border-border rounded-3xl w-full max-w-5xl max-h-[95vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
          {title && <h2 className="text-xl font-bold">{title}</h2>}
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-xl transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {pdf ? (
            <div className="w-full bg-white rounded-2xl overflow-hidden border border-border min-h-[75vh]">
              <iframe
                src={`${pdf}#toolbar=1&navpanes=0`}
                className="w-full h-[80vh] rounded-2xl"
                title={title}
              />
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              {images.map((image, idx) => (
                <img
                  key={idx}
                  src={image}
                  alt={title || ''}
                  className="max-w-full h-auto mx-auto rounded-2xl shadow-lg object-contain"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}