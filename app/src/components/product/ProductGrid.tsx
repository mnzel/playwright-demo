import ProductCard from './ProductCard.tsx';
import type { Product } from '../../types.ts';

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (!products || products.length === 0) {
    return (
      <p data-testid="product-grid-empty" style={{ color: 'var(--color-text-muted)' }}>
        No products match your filters.
      </p>
    );
  }
  return (
    <div
      data-testid="product-grid"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: 'var(--space-5)',
      }}
    >
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
