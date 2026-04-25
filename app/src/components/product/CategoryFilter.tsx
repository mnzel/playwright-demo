import type { CSSProperties } from 'react';
import { CATEGORIES } from '../../data/products.ts';
import type { CategorySlug } from '../../types.ts';

interface CategoryFilterProps {
  value: CategorySlug | null;
  onChange: (value: CategorySlug | null) => void;
}

export default function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  return (
    <div
      data-testid="category-filter"
      role="group"
      aria-label="Filter by category"
      style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}
    >
      <button
        type="button"
        data-testid="category-chip-all"
        data-active={value === null ? 'true' : 'false'}
        onClick={() => onChange(null)}
        style={chipStyle(value === null)}
      >
        All
      </button>
      {CATEGORIES.map((cat) => (
        <button
          key={cat.slug}
          type="button"
          data-testid={`category-chip-${cat.slug}`}
          data-active={value === cat.slug ? 'true' : 'false'}
          onClick={() => onChange(cat.slug)}
          style={chipStyle(value === cat.slug)}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}

function chipStyle(active: boolean): CSSProperties {
  return {
    padding: '6px 14px',
    borderRadius: 999,
    fontSize: '0.85rem',
    fontWeight: 500,
    border: '1px solid',
    borderColor: active ? '#1e293b' : '#e2e8f0',
    background: active ? '#1e293b' : '#fff',
    color: active ? '#fff' : '#0f172a',
  };
}
