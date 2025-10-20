'use client';

import { FormEvent, useState } from 'react';
import { LS_KEYS, readLocal, writeLocal } from '@/lib/storage';

type FormData = {
  name: string;
  email: string;
  company?: string;
  purpose?: string;
  message: string;
};

export default function HirePage() {
  const [data, setData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    purpose: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    // Persist to local inbox
    const inbox = readLocal<FormData[]>(LS_KEYS.hireInbox) || [];
    inbox.push({ ...data });
    writeLocal(LS_KEYS.hireInbox, inbox);

    // Open mailto
    const subject = encodeURIComponent(`[Portfolio] ${data.purpose || 'Inquiry'} — ${data.name}`);
    const bodyLines = [
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      data.company ? `Company: ${data.company}` : '',
      data.purpose ? `Purpose: ${data.purpose}` : '',
      '',
      data.message
    ].filter(Boolean);
    const body = encodeURIComponent(bodyLines.join('\n'));
    window.location.href = `mailto:faridmasood.khan@yahoo.com?subject=${subject}&body=${body}`;

    setSubmitted(true);
  }

  return (
    <section className="max-w-2xl space-y-6">
      <h1 className="text-4xl font-extrabold">Hire Me</h1>
      <p className="text-neutral-300">Tell me about your project. This form stores your message locally and also opens your email client — no server involved.</p>

      {submitted ? (
        <p className="text-emerald-400">Thanks! Your message was saved locally. You can also confirm an email draft has opened in your client.</p>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm text-neutral-400">Name</span>
              <input
                required
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                className="mt-1 w-full rounded-xl bg-neutral-900 border border-neutral-800 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </label>
            <label className="block">
              <span className="text-sm text-neutral-400">Email</span>
              <input
                required
                type="email"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                className="mt-1 w-full rounded-xl bg-neutral-900 border border-neutral-800 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-sm text-neutral-400">Company</span>
            <input
              value={data.company}
              onChange={(e) => setData({ ...data, company: e.target.value })}
              className="mt-1 w-full rounded-xl bg-neutral-900 border border-neutral-800 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </label>

          <label className="block">
            <span className="text-sm text-neutral-400">Purpose</span>
            <input
              value={data.purpose}
              onChange={(e) => setData({ ...data, purpose: e.target.value })}
              className="mt-1 w-full rounded-xl bg-neutral-900 border border-neutral-800 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </label>

          <label className="block">
            <span className="text-sm text-neutral-400">Message</span>
            <textarea
              required
              rows={6}
              value={data.message}
              onChange={(e) => setData({ ...data, message: e.target.value })}
              className="mt-1 w-full rounded-xl bg-neutral-900 border border-neutral-800 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </label>

          <div className="flex gap-3">
            <button type="submit" className="rounded-xl bg-primary px-5 py-2 font-semibold text-white shadow-glow hover:shadow-lg hover:shadow-primary/30 transition">
              Send
            </button>
            <a href="mailto:faridmasood.khan@yahoo.com" className="rounded-xl border border-neutral-800 bg-neutral-900 px-5 py-2 font-semibold hover:border-primary">
              Or email directly
            </a>
          </div>
        </form>
      )}
    </section>
  );
}