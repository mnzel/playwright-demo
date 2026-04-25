import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext.tsx';
import { formatCurrency } from '../../utils/format.ts';
import QuantityStepper from '../product/QuantityStepper.tsx';
import type { CartLineItem as CartLineItemType } from '../../types.ts';

interface CartLineItemProps {
  item: CartLineItemType;
  compact?: boolean;
}

export default function CartLineItem({ item, compact = false }: CartLineItemProps) {
  const { updateQuantity, removeItem } = useCart();
  const { product, size, quantity, lineTotal } = item;

  return (
    <div
      data-testid={`cart-line-${product.slug}`}
      data-product-id={product.id}
      style={{
        display: 'flex',
        gap: 'var(--space-4)',
        padding: 'var(--space-3) 0',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <Link
        to={`/products/${product.slug}`}
        style={{
          flexShrink: 0,
          width: compact ? 64 : 96,
          height: compact ? 64 : 96,
          background: 'var(--color-surface)',
          borderRadius: 6,
          overflow: 'hidden',
        }}
      >
        <img
          src={product.image}
          alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </Link>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Link
          to={`/products/${product.slug}`}
          style={{ fontWeight: 600, fontSize: compact ? '0.9rem' : '0.95rem' }}
          data-testid={`cart-line-name-${product.slug}`}
        >
          {product.name}
        </Link>
        {size && (
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            Size: {size}
          </div>
        )}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 'auto',
            gap: 'var(--space-3)',
          }}
        >
          <QuantityStepper
            value={quantity}
            onChange={(q) => updateQuantity(product.id, size, q)}
            testIdPrefix={`cart-line-${product.slug}-qty`}
          />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: 4,
            }}
          >
            <span
              style={{ fontWeight: 700 }}
              data-testid={`cart-line-total-${product.slug}`}
            >
              {formatCurrency(lineTotal)}
            </span>
            <button
              type="button"
              onClick={() => removeItem(product.id, size)}
              data-testid={`cart-line-remove-${product.slug}`}
              style={{
                fontSize: '0.8rem',
                color: 'var(--color-text-muted)',
                textDecoration: 'underline',
              }}
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
