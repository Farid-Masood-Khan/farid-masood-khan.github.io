import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="text-center space-y-4">
      <h1 className="text-5xl font-black">404</h1>
      <p className="text-neutral-400">Page not found.</p>
      <Link href="/" className="inline-block rounded-lg border border-neutral-800 px-4 py-2 hover:border-primary">← Back home</Link>
    </section>
  );
}