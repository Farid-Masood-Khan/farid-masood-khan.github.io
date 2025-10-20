'use client';

export type SortOption = { value: string; label: string };

export default function SortMenu({
  label = 'Sort by',
  value,
  onChange,
  options
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  options: SortOption[];
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-neutral-400">{label}</span>
      <select
        className="rounded-lg bg-neutral-900 border border-neutral-800 px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}