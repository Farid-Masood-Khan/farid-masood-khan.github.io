'use client';

import { useEffect, useId } from 'react';

export default function SearchInput({
  value,
  onChange,
  placeholder = 'Search…',
  autoFocus = false,
  persistKey
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  persistKey?: string; // optional localStorage key
}) {
  const id = useId();

  useEffect(() => {
    if (!persistKey) return;
    try {
      const saved = localStorage.getItem(persistKey);
      if (saved) onChange(saved);
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [persistKey]);

  useEffect(() => {
    if (!persistKey) return;
    try {
      localStorage.setItem(persistKey, value || '');
    } catch {}
  }, [value, persistKey]);

  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">Search</label>
      <input
        id={id}
        type="search"
        className="w-full rounded-xl bg-neutral-900 border border-neutral-800 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoFocus={autoFocus}
        onKeyDown={(e) => {
          if (e.key === 'Escape') onChange('');
        }}
      />
      {value && (
        <button
          type="button"
          aria-label="Clear search"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-200"
          onClick={() => onChange('')}
        >
          ×
        </button>
      )}
    </div>
  );
}