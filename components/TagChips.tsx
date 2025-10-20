'use client';

export default function TagChips({
  tags,
  active,
  onChange
}: {
  tags: string[];
  active?: string;
  onChange: (tag?: string) => void;
}) {
  const uniq = Array.from(new Set(tags)).sort((a, b) => a.localeCompare(b));
  return (
    <div className="flex flex-wrap gap-2">
      <button
        className={`px-3 py-1 rounded-full border ${!active ? 'bg-neutral-800 border-neutral-700' : 'border-neutral-800 hover:border-primary'}`}
        onClick={() => onChange(undefined)}
      >
        All
      </button>
      {uniq.map(t => (
        <button
          key={t}
          className={`px-3 py-1 rounded-full border ${active === t ? 'bg-primary/20 border-primary' : 'border-neutral-800 hover:border-primary'}`}
          onClick={() => onChange(active === t ? undefined : t)}
        >
          {t}
        </button>
      ))}
    </div>
  );
}