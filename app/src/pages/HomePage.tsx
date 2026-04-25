import { Link } from 'react-router-dom';
import { getFeaturedProducts, CATEGORIES } from '../data/products.ts';
import ProductGrid from '../components/product/ProductGrid.tsx';

export default function HomePage() {
  const featured = getFeaturedProducts();

  return (
    <div data-testid="page-home">
      {/* Hero */}
      <section
        style={{
          background: 'linear-gradient(135deg, #1e293b, #334155)',
          color: '#fff',
          padding: '64px 0',
        }}
      >
        <div
          className="container"
          style={{ display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap' }}
        >
          <div style={{ flex: 1, minWidth: 280 }}>
            <h1
              style={{
                fontSize: '2.5rem',
                lineHeight: 1.1,
                marginBottom: 16,
                fontWeight: 800,
              }}
            >
              Goods made well,
              <br />
              shipped slow.
            </h1>
            <p
              style={{
                fontSize: '1.05rem',
                opacity: 0.85,
                marginBottom: 24,
                maxWidth: 480,
              }}
            >
              Considered essentials for everyday life. Free shipping on orders over $50.
            </p>
            <Link
              to="/products"
              data-testid="hero-shop-cta"
              className="btn btn-primary"
              style={{
                background: '#fbbf24',
                color: '#0f172a',
                padding: '14px 28px',
                fontSize: '1rem',
              }}
            >
              Shop all products →
            </Link>
          </div>
          <div
            style={{
              flex: 1,
              minWidth: 280,
              aspectRatio: '4/3',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: 12,
              backgroundImage: 'url(https://picsum.photos/seed/hero/800/600)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
            aria-hidden="true"
          />
        </div>
      </section>

      {/* Free shipping banner */}
      <div
        data-testid="free-shipping-banner"
        style={{
          background: '#fef3c7',
          color: '#92400e',
          padding: '12px 0',
          textAlign: 'center',
          fontSize: '0.9rem',
          fontWeight: 500,
        }}
      >
        🚚 Free standard shipping on orders over $50
      </div>

      {/* Categories */}
      <section className="container" style={{ padding: '48px 0 24px' }}>
        <h2 className="section-title">Shop by category</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 'var(--space-4)',
          }}
        >
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              to={`/products?category=${cat.slug}`}
              data-testid={`category-tile-${cat.slug}`}
              style={{
                display: 'block',
                padding: '32px 20px',
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                textAlign: 'center',
                fontWeight: 600,
                transition: 'background 0.15s',
              }}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="container" style={{ padding: '24px 0 64px' }}>
        <h2 className="section-title">Featured products</h2>
        <ProductGrid products={featured} />
      </section>
    </div>
  );
}
