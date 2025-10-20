'use client';

import { useEffect, useState } from 'react';

type ThemeChoice = 'system' | 'light' | 'dark';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeChoice>('system');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('farid.theme');
      if (saved === 'dark' || saved === 'light' || saved === 'system') {
        setTheme(saved as ThemeChoice);
      }
    } catch {}
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const sysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const effectiveDark = theme === 'system' ? sysDark : theme === 'dark';
    root.classList.toggle('dark', effectiveDark);
    try { localStorage.setItem('farid.theme', theme); } catch {}
  }, [theme]);

  return (
    <select
      aria-label="Theme"
      className="rounded-lg bg-neutral-900 border border-neutral-800 px-2 py-1 text-sm"
      value={theme}
      onChange={(e) => setTheme(e.target.value as ThemeChoice)}
      title="Theme"
    >
      <option value="system">System</option>
      <option value="dark">Dark</option>
      <option value="light">Light</option>
    </select>
  );
}