'use client';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  console.error('Global error:', error);
  return (
    <section className="text-center space-y-4">
      <h1 className="text-3xl font-extrabold">Something went wrong</h1>
      <p className="text-neutral-400">An unexpected error occurred. Try again.</p>
      <button onClick={reset} className="rounded-lg border border-neutral-800 px-4 py-2 hover:border-primary">
        Retry
      </button>
    </section>
  );
}