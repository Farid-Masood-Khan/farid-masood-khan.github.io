'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import ThemeToggle from './ThemeToggle';

const nav = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/blog', label: 'Blog' },
  { href: '/cv', label: 'CV' },
  { href: '/hire', label: 'Hire Me' }
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const shouldReduce = useReducedMotion();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const active = useMemo(() => {
    const hit = nav.find(n => (pathname === '/' ? n.href === '/' : pathname.startsWith(n.href) && n.href !== '/'));
    return hit?.href || '/';
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-900/60 bg-black/60 backdrop-blur">
      <div className="container py-3 flex items-center justify-between">
        <Link href="/" className="font-extrabold tracking-tight text-lg">
          <span className="text-primary">Farid</span> • Portfolio
        </Link>
        <nav className="hidden md:flex items-center gap-6 relative">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`relative px-1 py-1 hover:text-primary transition-colors ${active === n.href ? 'text-primary' : ''}`}
            >
              {n.label}
              {active === n.href && (
                <motion.span
                  layoutId="underline"
                  className="absolute left-0 -bottom-1 h-0.5 w-full bg-primary rounded-full shadow-glow"
                  transition={{ type: shouldReduce ? false : 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/Farid-Masood-Khan"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-block text-sm hover:text-primary"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/leishu/"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-block text-sm hover:text-primary"
          >
            LinkedIn
          </a>
          <ThemeToggle />
          <button
            aria-label="Open menu"
            className="md:hidden rounded-lg border border-neutral-800 px-2 py-1 hover:border-primary"
            onClick={() => setOpen((v) => !v)}
          >
            ☰
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-neutral-900/60 bg-black/70 backdrop-blur">
          <div className="container py-3 flex flex-col gap-2">
            {nav.map(n => (
              <Link key={n.href} href={n.href} className="py-2 hover:text-primary">
                {n.label}
              </Link>
            ))}
            <div className="flex gap-4 pt-2">
              <a href="https://github.com/Farid-Masood-Khan" target="_blank" rel="noreferrer" className="hover:text-primary">GitHub</a>
              <a href="https://www.linkedin.com/in/leishu/" target="_blank" rel="noreferrer" className="hover:text-primary">LinkedIn</a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}