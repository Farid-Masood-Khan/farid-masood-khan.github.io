// Tiny offline search & ranker (no deps)
export type TextLike = string | undefined | null;

export type ProjectRecord = {
  id: number;
  title: string;
  slug: string;
  description?: string;
  tags?: string[];
  language?: string;
  stars?: number;
  readme?: string;
  repoUrl?: string;
  demoUrl?: string;
};

export type BlogRecord = {
  id: number;
  title: string;
  slug: string;
  date: string;
  tags?: string[];
  summary?: string;
  bodyMarkdown?: string;
  published?: boolean;
};

function norm(s: TextLike): string {
  if (!s) return "";
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, ""); // strip diacritics
}

function tokens(q: string): string[] {
  return norm(q).split(/[^a-z0-9]+/).filter(Boolean);
}

function scoreField(hay: string, qtok: string, weights = { exact: 6, prefix: 4, substr: 2 }) {
  if (!hay || !qtok) return 0;
  if (hay === qtok) return weights.exact;
  if (hay.startsWith(qtok)) return weights.prefix;
  if (hay.includes(qtok)) return weights.substr;
  return 0;
}

function scoreArray(hays: string[], qtok: string, weights = { exact: 7, prefix: 5, substr: 3 }) {
  let best = 0;
  for (const h of hays) best = Math.max(best, scoreField(h, qtok, weights));
  return best;
}

export function searchProjects(records: ProjectRecord[], query: string, tag?: string) {
  const qts = tokens(query);
  const tagNorm = norm(tag || "");
  const results = records
    .filter(r => !tagNorm || (r.tags || []).map(norm).includes(tagNorm))
    .map(r => {
      const tTitle = norm(r.title);
      const tDesc = norm(r.description);
      const tLang = norm(r.language);
      const tTags = (r.tags || []).map(norm);
      const tReadme = norm(r.readme);

      let score = 0;
      if (qts.length === 0) {
        score = 1; // neutral baseline when no query
      } else {
        for (const qt of qts) {
          // weight title highest, tags next, then description/lang/readme
          const sTitle = scoreField(tTitle, qt, { exact: 10, prefix: 7, substr: 4 });
          const sTags = scoreArray(tTags, qt, { exact: 8, prefix: 6, substr: 4 });
          const sDesc = scoreField(tDesc, qt, { exact: 4, prefix: 3, substr: 2 });
          const sLang = scoreField(tLang, qt, { exact: 4, prefix: 3, substr: 2 });
          const sReadme = scoreField(tReadme, qt, { exact: 3, prefix: 2, substr: 1 });
          score += Math.max(sTitle, sTags, sDesc, sLang, sReadme);
        }
        // normalize by query length
        score = score / qts.length;
      }
      // small star boost
      score += Math.min(10, (r.stars || 0) / 10);
      return { record: r, score };
    })
    .filter(x => x.score > 0 || qts.length === 0)
    .sort((a, b) => b.score - a.score);

  return results.map(x => x.record);
}

export function searchBlog(records: BlogRecord[], query: string, tag?: string, includeDrafts = false) {
  const qts = tokens(query);
  const tagNorm = norm(tag || "");
  const results = records
    .filter(r => (includeDrafts || r.published !== false))
    .filter(r => !tagNorm || (r.tags || []).map(norm).includes(tagNorm))
    .map(r => {
      const tTitle = norm(r.title);
      const tSummary = norm(r.summary);
      const tBody = norm(r.bodyMarkdown);
      const tTags = (r.tags || []).map(norm);

      let score = 0;
      if (qts.length === 0) {
        score = 1;
      } else {
        for (const qt of qts) {
          const sTitle = scoreField(tTitle, qt, { exact: 10, prefix: 7, substr: 4 });
          const sTags = scoreArray(tTags, qt, { exact: 8, prefix: 6, substr: 4 });
          const sSummary = scoreField(tSummary, qt, { exact: 5, prefix: 3, substr: 2 });
          const sBody = scoreField(tBody, qt, { exact: 4, prefix: 3, substr: 2 });
          score += Math.max(sTitle, sTags, sSummary, sBody);
        }
        score = score / qts.length;
      }
      // newer posts (by date) get a small recency nudge
      const when = Date.parse(r.date || "");
      if (!Number.isNaN(when)) {
        const monthsOld = (Date.now() - when) / (1000 * 60 * 60 * 24 * 30);
        const recencyBoost = Math.max(0, 6 - Math.min(6, monthsOld / 6)); // 0..6 scaled
        score += recencyBoost * 0.2;
      }
      return { record: r, score };
    })
    .filter(x => x.score > 0 || qts.length === 0)
    .sort((a, b) => b.score - a.score);

  return results.map(x => x.record);
}