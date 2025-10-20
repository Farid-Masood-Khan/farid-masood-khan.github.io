export function paginate<T>(arr: T[], page: number, perPage: number) {
  const total = arr.length;
  const pages = Math.max(1, Math.ceil(total / perPage));
  const p = Math.min(Math.max(page, 1), pages);
  const start = (p - 1) * perPage;
  return {
    page: p,
    pages,
    total,
    items: arr.slice(start, start + perPage)
  };
}