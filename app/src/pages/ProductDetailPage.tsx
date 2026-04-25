import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductBySlug, getRelatedProducts, getCategoryName } from '../data/products.ts';
import { useCart } from '../context/CartContext.tsx';
import { useToast } from '../context/ToastContext.tsx';
import { formatCurrency } from '../utils/format.ts';
import StockBadge from '../components/product/StockBadge.tsx';
import SizeSelector from '../components/product/SizeSelector.tsx';
import QuantityStepper from '../components/product/QuantityStepper.tsx';
import ProductGrid from '../components/product/ProductGrid.tsx';
import Button from '../components/ui/Button.tsx';
import Spinner from '../components/ui/Spinner.tsx';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const product = slug ? getProductBySlug(slug) : null;
  const { addItem } = useCart();
  const toast = useToast();

  const [size, setSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  const [stockChecked, setStockChecked] = useState(false);
  const [actualInStock, setActualInStock] = useState<boolean>(product?.inStock ?? false);

  useEffect(() => {
    if (!product) return;
    setStockChecked(false);
    setActualInStock(product.inStock);
    const t = setTimeout(() => {
      setActualInStock(product.stockCount > 0);
      setStockChecked(true);
    }, 300);
    return () => clearTimeout(t);
  }, [product]);

  if (!product) {
    return (
      <div className="page container" data-testid="page-product-detail-missing">
        <h1 className="page-title">Product not found</h1>
        <Link to="/products" className="btn btn-secondary">
          Back to shop
        </Link>
      </div>
    );
  }

  const requiresSize = Array.isArray(product.sizes) && product.sizes.length > 0;
  const related = getRelatedProducts(product.id, 4);

  function handleAddToCart() {
    if (!product) return;
    if (requiresSize && !size) {
      toast.push('Please select a size', { variant: 'warning' });
      return;
    }
    if (!actualInStock) {
      toast.push('Sorry, that item is out of stock', { variant: 'error' });
      return;
    }
    addItem(product.id, quantity, size);
    toast.push('Added to cart', { variant: 'success' });
  }

  return (
    <div className="page" data-testid="page-product-detail" data-product-slug={product.slug}>
      <div className="container">
        <nav
          style={{
            fontSize: '0.85rem',
            color: 'var(--color-text-muted)',
            marginBottom: 'var(--space-4)',
          }}
          aria-label="Breadcrumb"
        >
          <Link to="/">Home</Link> / <Link to="/products">Shop</Link> /{' '}
          <Link to={`/products?category=${product.category}`}>
            {getCategoryName(product.category)}
          </Link>{' '}
          / <span>{product.name}</span>
        </nav>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(280px, 1fr) minmax(280px, 1fr)',
            gap: 'var(--space-7)',
          }}
        >
          <div
            style={{
              aspectRatio: '1/1',
              background: 'var(--color-surface)',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
            }}
          >
            <img
              src={product.image}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }} data-testid="product-name">
                {product.name}
              </h1>
              <div
                style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: 8 }}
                data-testid="product-price"
              >
                {formatCurrency(product.price)}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              {!stockChecked ? (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: '0.85rem',
                    color: 'var(--color-text-muted)',
                  }}
                >
                  <Spinner size={14} /> Checking availability…
                </span>
              ) : (
                <StockBadge inStock={actualInStock} />
              )}
            </div>

            <p style={{ color: 'var(--color-text-muted)' }} data-testid="product-description">
              {product.description}
            </p>

            {requiresSize && (
              <SizeSelector sizes={product.sizes} value={size} onChange={setSize} />
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
              <QuantityStepper value={quantity} onChange={setQuantity} testIdPrefix="qty" />
              <Button
                variant="primary"
                onClick={handleAddToCart}
                disabled={stockChecked && !actualInStock}
                data-testid="add-to-cart"
                style={{ padding: '12px 24px' }}
              >
                {stockChecked && !actualInStock ? 'Out of stock' : 'Add to cart'}
              </Button>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section style={{ marginTop: 'var(--space-8)' }}>
            <h2 className="section-title">Related products</h2>
            <ProductGrid products={related} />
          </section>
        )}
      </div>
    </div>
  );
}
