'use client';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-12 border-t border-neutral-900/60">
      <div className="container py-6 text-sm text-neutral-400 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p>© {year} Muhammad Farid Masood Khan</p>
        <p className="text-xs">Built with Next.js • Works offline • No external trackers</p>
      </div>
    </footer>
  );
}