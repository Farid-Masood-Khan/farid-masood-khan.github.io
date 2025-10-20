'use client';

import { useEffect, useState } from 'react';

export default function CVPage() {
  const [exists, setExists] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if PDF exists (works after export too)
    fetch('/cv/Farid_Masood_CV.pdf', { method: 'HEAD' })
      .then(res => setExists(res.ok))
      .catch(() => setExists(false));
  }, []);

  return (
    <section className="space-y-4">
      <h1 className="text-4xl font-extrabold">Curriculum Vitae</h1>
      {exists === null ? (
        <p className="text-neutral-400">Checking for CV…</p>
      ) : exists ? (
        <>
          <div className="aspect-[3/4] w-full rounded-xl border border-neutral-800 overflow-hidden">
            <iframe
              title="Farid Masood CV"
              src="/cv/Farid_Masood_CV.pdf#view=FitH"
              className="w-full h-full"
            />
          </div>
          <a
            href="/cv/Farid_Masood_CV.pdf"
            download
            className="inline-block rounded-lg border border-neutral-800 px-4 py-2 hover:border-primary"
          >
            Download CV
          </a>
        </>
      ) : (
        <>
          <p className="text-neutral-400">
            CV not found. Please add <code>/public/cv/Farid_Masood_CV.pdf</code>.
            See <code>/public/cv/README.txt</code> for instructions.
          </p>
          <a
            href="/cv/Farid_Masood_CV.pdf"
            className="inline-block rounded-lg border border-neutral-800 px-4 py-2 hover:border-primary"
          >
            Placeholder link
          </a>
        </>
      )}
    </section>
  );
}