'use client';

import JsonLd from '@/components/JsonLd';
import siteMeta from '@/data/site-meta.json';
import { buildPersonLd } from '@/lib/structuredData';

export default function AboutPage() {
  const timeline = [
    { year: '2025', title: 'Data Science Intern', detail: 'Built and evaluated small CNN classifiers for CPU inference; data pipelines and experiments.' },
    { year: '2024', title: 'BS Computer Science', detail: 'Graduated with focus on AI/ML, algorithms, and software engineering.' }
  ];
  const skills = [
    'Machine Learning', 'Deep Learning', 'NLP', 'Data Mining', 'Flutter',
    'React.js', 'Node.js', 'SQL', 'AI App Development'
  ];

  const personLd = buildPersonLd({
    name: 'Muhammad Farid Masood Khan',
    description: (siteMeta as any).description,
    email: 'faridmasood.khan@yahoo.com',
    url: ((siteMeta as any).baseUrl || 'https://example.com').replace(/\/$/, ''),
    image: (siteMeta as any).ogImage,
    sameAs: [
      'https://github.com/Farid-Masood-Khan',
      'https://www.linkedin.com/in/leishu/'
    ],
    locality: 'Sahiwal',
    country: 'Pakistan'
  });

  return (
    <section className="space-y-8">
      <JsonLd data={personLd} />
      <header>
        <h1 className="text-4xl font-extrabold">About</h1>
        <p className="mt-2 text-neutral-300 max-w-3xl">
          I’m Muhammad Farid Masood Khan — a Computer Science graduate and Data Science intern based in Sahiwal, Pakistan.
          I build practical AI systems and end‑to‑end software: from tiny models for edge devices to clean UIs built with Flutter and React.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="text-xl font-bold mb-4">Education & Experience</h2>
          <ol className="relative border-l border-neutral-800 pl-4 space-y-6">
            {timeline.map((t) => (
              <li key={t.year} className="ml-2">
                <div className="absolute -left-1.5 mt-1 h-3 w-3 rounded-full bg-primary shadow-glow" />
                <div className="text-sm text-neutral-400">{t.year}</div>
                <div className="font-semibold">{t.title}</div>
                <p className="text-neutral-400 text-sm mt-1">{t.detail}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-bold mb-4">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((s) => (
              <span key={s} className="px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-sm">{s}</span>
            ))}
          </div>

          <div className="mt-6">
            <h3 className="font-semibold">Contact</h3>
            <ul className="text-neutral-400 text-sm mt-1 space-y-1">
              <li>Email: <a href="mailto:faridmasood.khan@yahoo.com">faridmasood.khan@yahoo.com</a></li>
              <li>Phone: <a href="tel:+923026673322">+92 302 6673322</a></li>
              <li>GitHub: <a href="https://github.com/Farid-Masood-Khan" target="_blank">Farid-Masood-Khan</a></li>
              <li>LinkedIn: <a href="https://www.linkedin.com/in/leishu/" target="_blank">leishu</a></li>
              <li>Location: Sahiwal, Pakistan</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}