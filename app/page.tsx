'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import JsonLd from '@/components/JsonLd';
import siteMeta from '@/data/site-meta.json';
import { buildPersonLd } from '@/lib/structuredData';

export default function HomePage() {
  const shouldReduce = useReducedMotion();
  const personLd = buildPersonLd({
    name: 'Muhammad Farid Masood Khan',
    description: 'Computer Science graduate & Data Science intern focused on AI/ML, NLP, Flutter, full-stack.',
    email: 'faridmasood.khan@yahoo.com',
    url: (siteMeta as any).baseUrl || 'https://example.com',
    image: siteMeta.ogImage ? `${((siteMeta as any).baseUrl || 'https://example.com')}${siteMeta.ogImage}` : undefined,
    sameAs: [
      'https://github.com/Farid-Masood-Khan',
      'https://www.linkedin.com/in/leishu/'
    ],
    locality: 'Sahiwal',
    region: 'Punjab',
    country: 'PK'
  });

  return (
    <>
      <JsonLd data={personLd} />

      <section className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-gradient-to-br from-neutral-900/70 to-black/60 p-8 md:p-12 shadow-glow">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/20 blur-2xl" />
          <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-emerald-400/20 blur-2xl" />
        </div>

        <motion.h1
          initial={{ opacity: 0, y: shouldReduce ? 0 : -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative text-4xl md:text-6xl font-extrabold tracking-tight"
        >
          Muhammad Farid Masood Khan
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: shouldReduce ? 0 : -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="relative mt-3 text-lg text-neutral-300"
        >
          AI/ML Engineer • NLP • Flutter • Full‑stack
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: shouldReduce ? 0 : -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="relative mt-4 max-w-2xl text-neutral-400"
        >
          Building practical, fast, and privacy‑friendly AI products. This portfolio is fully static and works offline — content is local JSON with a localStorage admin.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="relative mt-8 flex flex-wrap gap-3"
        >
          <Link href="/cv" className="rounded-xl bg-primary px-5 py-2 font-semibold text-white shadow-glow hover:shadow-lg hover:shadow-primary/30 transition">
            View CV
          </Link>
          <Link href="/hire" className="rounded-xl border border-neutral-800 bg-neutral-900 px-5 py-2 font-semibold hover:border-primary">
            Hire Me
          </Link>
          <a href="https://github.com/Farid-Masood-Khan" target="_blank" className="rounded-xl border border-neutral-800 px-5 py-2 hover:border-primary">GitHub</a>
          <a href="https://www.linkedin.com/in/leishu/" target="_blank" className="rounded-xl border border-neutral-800 px-5 py-2 hover:border-primary">LinkedIn</a>
        </motion.div>
      </section>

      <section className="mt-10 grid md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="text-xl font-bold">Latest Projects</h2>
          <p className="mt-2 text-neutral-400 text-sm">See hands-on ML, NLP, Flutter, and full‑stack builds.</p>
          <Link href="/projects" className="mt-4 inline-block rounded-lg border border-neutral-800 px-4 py-2 hover:border-primary">
            Browse Projects →
          </Link>
        </div>
        <div className="card p-6">
          <h2 className="text-xl font-bold">Recent Posts</h2>
          <p className="mt-2 text-neutral-400 text-sm">Short write‑ups on models, performance, and shipping.</p>
          <Link href="/blog" className="mt-4 inline-block rounded-lg border border-neutral-800 px-4 py-2 hover:border-primary">
            Read the Blog →
          </Link>
        </div>
      </section>
    </>
  );
}