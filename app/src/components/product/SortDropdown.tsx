import type { SortMode } from '../../types.ts';

interface SortDropdownProps {
  value: SortMode;
  onChange: (value: SortMode) => void;
}

export default function SortDropdown({ value, onChange }: SortDropdownProps) {
  return (
    <div className="field" style={{ marginBottom: 0 }}>
      <label htmlFor="sort-select" className="sr-only">
        Sort by
      </label>
      <select
        id="sort-select"
        data-testid="sort-select"
        value={value}
        onChange={(e) => onChange(e.target.value as SortMode)}
      >
        <option value="featured">Featured</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="name-asc">Name: A → Z</option>
      </select>
    </div>
  );
}
