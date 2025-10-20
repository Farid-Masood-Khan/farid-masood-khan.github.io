import './globals.css';
import type { Metadata } from 'next';
import siteMeta from '@/data/site-meta.json';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeadUpdater from '@/components/HeadUpdater';
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister';

const baseUrl = (siteMeta as any).baseUrl || 'https://example.com';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: siteMeta.title,
    template: '%s | Muhammad Farid Masood Khan'
  },
  description: siteMeta.description,
  openGraph: {
    title: siteMeta.title,
    description: siteMeta.description,
    images: siteMeta.ogImage ? [siteMeta.ogImage] : undefined,
    url: baseUrl
  },
  alternates: {
    canonical: baseUrl
  },
  robots: {
    index: true,
    follow: true
  },
  twitter: {
    card: 'summary_large_image',
    title: siteMeta.title,
    description: siteMeta.description,
    images: siteMeta.ogImage ? [siteMeta.ogImage] : undefined
  }
};

function ThemeScript() {
  // Prevent theme flash: run before paint
  const code = `
  (function() {
    try {
      var s = localStorage.getItem('farid.theme');
      var m = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      var theme = s === 'light' || s === 'dark' ? s : m;
      if (theme === 'dark') document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    } catch (_) {}
  })();
  `;
  // eslint-disable-next-line @next/next/no-sync-scripts
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <ThemeScript />
        <meta name="theme-color" content="#7c3aed" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
      </head>
      <body className="min-h-screen">
        <a href="#content" className="skip-link">Skip to content</a>
        <Header />
        <main id="content" className="container py-8">{children}</main>
        <Footer />
        <HeadUpdater />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}