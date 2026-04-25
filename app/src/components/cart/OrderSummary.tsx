import type { CSSProperties } from 'react';
import { useCart } from '../../context/CartContext.tsx';
import { formatCurrency } from '../../utils/format.ts';

interface OrderSummaryProps {
  showLineItems?: boolean;
}

interface SummaryRowProps {
  label: string;
  value: string;
  testId: string;
  variant?: 'success';
}

export default function OrderSummary({ showLineItems = false }: OrderSummaryProps) {
  const {
    lineItems,
    subtotal,
    discount,
    shipping,
    total,
    promoApplied,
    qualifiesForFreeShipping,
    freeShippingThreshold,
  } = useCart();

  const remainingForFreeShipping = freeShippingThreshold - (subtotal - discount);

  return (
    <aside
      data-testid="order-summary"
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-5)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3)',
      }}
    >
      <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 4 }}>Order summary</h2>

      {showLineItems && lineItems.length > 0 && (
        <ul style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 8 }}>
          {lineItems.map((li) => (
            <li
              key={`${li.productId}__${li.size ?? ''}`}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.85rem',
                color: 'var(--color-text-muted)',
              }}
              data-testid={`summary-line-${li.product.slug}`}
            >
              <span>
                {li.product.name} × {li.quantity}
              </span>
              <span>{formatCurrency(li.lineTotal)}</span>
            </li>
          ))}
        </ul>
      )}

      <SummaryRow label="Subtotal" value={formatCurrency(subtotal)} testId="summary-subtotal" />
      {promoApplied && discount > 0 && (
        <SummaryRow
          label={`Discount (${promoApplied})`}
          value={`−${formatCurrency(discount)}`}
          testId="summary-discount"
          variant="success"
        />
      )}
      <SummaryRow
        label="Shipping"
        value={shipping === 0 ? 'Free' : formatCurrency(shipping)}
        testId="summary-shipping"
      />

      {!qualifiesForFreeShipping && remainingForFreeShipping > 0 && lineItems.length > 0 && (
        <div
          data-testid="free-shipping-notice"
          style={{
            background: '#fef3c7',
            color: '#92400e',
            padding: '8px 10px',
            borderRadius: 6,
            fontSize: '0.8rem',
          }}
        >
          Add {formatCurrency(remainingForFreeShipping)} more for free shipping
        </div>
      )}
      {qualifiesForFreeShipping && lineItems.length > 0 && (
        <div
          data-testid="free-shipping-unlocked"
          style={{
            background: '#dcfce7',
            color: '#166534',
            padding: '8px 10px',
            borderRadius: 6,
            fontSize: '0.8rem',
            fontWeight: 600,
          }}
        >
          Free shipping unlocked!
        </div>
      )}

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontWeight: 700,
          fontSize: '1.05rem',
          paddingTop: 'var(--space-3)',
          borderTop: '1px solid var(--color-border)',
        }}
      >
        <span>Total</span>
        <span data-testid="cart-total">{formatCurrency(total)}</span>
      </div>
    </aside>
  );
}

function SummaryRow({ label, value, testId, variant }: SummaryRowProps) {
  const style: CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.9rem',
    color: variant === 'success' ? '#166534' : 'inherit',
  };
  return (
    <div data-testid={testId} style={style}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
