export const LS_KEYS = {
  siteMeta: 'farid.site.meta',
  projects: 'farid.projects',
  blog: 'farid.blog',
  adminSession: 'farid.admin.session',
  hireInbox: 'farid.hire.inbox'
} as const;

export function readLocal<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.error('Failed to read localStorage key', key, e);
    return null;
  }
}

export function writeLocal<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to write localStorage key', key, e);
  }
}

// Convenience wrappers compatible with examples
export function lsGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function lsSet<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

export function lsRemove(key: string) {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}