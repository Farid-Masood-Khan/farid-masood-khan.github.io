'use client';

import { useEffect } from 'react';

export default function HeadUpdater() {
  useEffect(() => {
    try {
      const raw = localStorage.getItem('farid.site.meta');
      if (!raw) return;
      const data = JSON.parse(raw);
      if (!data || typeof data !== 'object') return;

      if (data.title) document.title = data.title;

      function setMeta(name: string, content?: string) {
        if (!content) return;
        let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
        if (!el) {
          el = document.createElement('meta');
          el.setAttribute('name', name);
          document.head.appendChild(el);
        }
        el.setAttribute('content', content);
      }

      function setOg(property: string, content?: string) {
        if (!content) return;
        let el = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
        if (!el) {
          el = document.createElement('meta');
          el.setAttribute('property', property);
          document.head.appendChild(el);
        }
        el.setAttribute('content', content);
      }

      setMeta('description', data.description);
      setOg('og:title', data.title);
      setOg('og:description', data.description);
      if (data.ogImage) setOg('og:image', data.ogImage);

      // canonical
      if (data.baseUrl) {
        let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
        if (!link) {
          link = document.createElement('link');
          link.rel = 'canonical';
          document.head.appendChild(link);
        }
        link.href = data.baseUrl;
      }
    } catch (e) {
      console.error('Failed to apply site meta from localStorage', e);
    }
  }, []);

  return null;
}