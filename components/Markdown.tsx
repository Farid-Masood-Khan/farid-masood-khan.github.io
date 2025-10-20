'use client';

import { useMemo } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

// Keep rendering consistent + safe
marked.setOptions({
  mangle: false,            // don't obfuscate emails
  headerIds: true
});

// Allow a tight, safe subset only (extend if you trust your source)
const ALLOWED_TAGS = [
  'a','p','strong','em','ul','ol','li','blockquote','pre','code',
  'h1','h2','h3','h4','h5','h6','hr','br','img','table','thead','tbody','tr','th','td'
];
const ALLOWED_ATTR = [
  'href','title','alt','src','target','rel','class','id','align','width','height'
];

export default function Markdown({ content }: { content: string }) {
  const html = useMemo(() => {
    const raw = marked.parse(content || '');
    const clean = DOMPurify.sanitize(raw as string, {
      ALLOWED_TAGS,
      ALLOWED_ATTR,
      USE_PROFILES: { html: true }
    });
    return clean;
  }, [content]);

  return (
    <div
      className="md-prose"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}