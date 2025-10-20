'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;

    const register = async () => {
      try {
        await navigator.serviceWorker.register('/sw.js', { scope: '/' });
      } catch {
        // ignore
      }
    };

    // Wait for page to be fully loaded to avoid interfering with initial render
    if (document.readyState === 'complete') {
      register();
    } else {
      window.addEventListener('load', register, { once: true });
    }

    return () => {
      window.removeEventListener('load', register as any);
    };
  }, []);

  return null;
}