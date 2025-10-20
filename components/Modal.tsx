'use client';

import { useEffect } from 'react';

export default function Modal({
  open,
  onClose,
  title,
  children
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative max-h-[80vh] w-[min(96vw,800px)] overflow-auto rounded-2xl border border-neutral-800 bg-neutral-950 p-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-bold">{title || 'Details'}</h3>
          <button
            aria-label="Close"
            className="rounded-lg border border-neutral-800 px-2 py-1 text-sm hover:border-primary"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className="mt-3">{children}</div>
      </div>
    </div>
  );
}