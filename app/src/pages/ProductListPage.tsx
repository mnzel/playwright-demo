import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PRODUCTS, getCategoryName } from '../data/products.ts';
import ProductGrid from '../components/product/ProductGrid.tsx';
import CategoryFilter from '../components/product/CategoryFilter.tsx';
import SortDropdown from '../components/product/SortDropdown.tsx';
import SearchInput from '../components/product/SearchInput.tsx';
import type { CategorySlug, Product, SortMode } from '../types.ts';

export default function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') as CategorySlug | null;

  const [category, setCategory] = useState<CategorySlug | null>(initialCategory);
  const [sort, setSort] = useState<SortMode>('featured');
  const [search, setSearch] = useState('');

  // Sync category back to URL so it's shareable
  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    if (category) {
      next.set('category', category);
    } else {
      next.delete('category');
    }
    setSearchParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  const filtered: Product[] = useMemo(() => {
    let list = PRODUCTS.slice();
    if (category) list = list.filter((p) => p.category === category);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }
    switch (sort) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'featured':
      default:
        list.sort((a, b) => Number(b.featured) - Number(a.featured));
    }
    return list;
  }, [category, sort, search]);

  return (
    <div className="page" data-testid="page-product-list">
      <div className="container">
        <h1 className="page-title">{category ? getCategoryName(category) : 'All products'}</h1>

        <div
          style={{
            display: 'flex',
            gap: 'var(--space-4)',
            alignItems: 'center',
            marginBottom: 'var(--space-5)',
            flexWrap: 'wrap',
          }}
        >
          <SearchInput value={search} onChange={setSearch} />
          <SortDropdown value={sort} onChange={setSort} />
        </div>

        <div style={{ marginBottom: 'var(--space-5)' }}>
          <CategoryFilter value={category} onChange={setCategory} />
        </div>

        <div
          data-testid="result-count"
          style={{
            color: 'var(--color-text-muted)',
            fontSize: '0.9rem',
            marginBottom: 'var(--space-4)',
          }}
        >
          {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
        </div>

        <ProductGrid products={filtered} />
      </div>
    </div>
  );
}
