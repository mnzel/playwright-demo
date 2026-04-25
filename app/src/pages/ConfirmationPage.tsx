import { useParams, Link } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage.ts';
import { formatCurrency, formatDate } from '../utils/format.ts';
import Button from '../components/ui/Button.tsx';
import type { Order } from '../types.ts';

export default function ConfirmationPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const [orders] = useLocalStorage<Order[]>('ec_orders_v1', []);
  const order = (orders ?? []).find((o) => o.id === orderId);

  if (!order) {
    return (
      <div className="page" data-testid="page-confirmation-missing">
        <div className="container">
          <h1 className="page-title">Order not found</h1>
          <p style={{ marginBottom: 16, color: 'var(--color-text-muted)' }}>
            We couldn't find that order. It may have been placed in a different browser session.
          </p>
          <Link to="/">
            <Button variant="secondary">Back to home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page" data-testid="page-confirmation">
      <div className="container" style={{ maxWidth: 720 }}>
        <div
          style={{
            background: '#dcfce7',
            color: '#166534',
            padding: 'var(--space-5)',
            borderRadius: 'var(--radius-md)',
            marginBottom: 'var(--space-5)',
          }}
        >
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 8 }}>
            Order placed — thank you!
          </h1>
          <p>
            Order number:{' '}
            <strong data-testid="confirmation-order-id">{order.id}</strong>
          </p>
          <p style={{ fontSize: '0.9rem', marginTop: 4 }}>
            Placed on {formatDate(order.placedAt)}
          </p>
        </div>

        <h2 className="section-title">Items</h2>
        <ul
          style={{
            background: '#fff',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            marginBottom: 'var(--space-5)',
          }}
        >
          {order.items.map((item, idx) => (
            <li
              key={idx}
              data-testid={`confirmation-item-${item.slug}`}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: 'var(--space-3) var(--space-4)',
                borderBottom:
                  idx === order.items.length - 1 ? 'none' : '1px solid var(--color-border)',
              }}
            >
              <span>
                {item.name} {item.size ? `(${item.size}) ` : ''}× {item.quantity}
              </span>
              <span style={{ fontWeight: 600 }}>{formatCurrency(item.lineTotal)}</span>
            </li>
          ))}
        </ul>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontWeight: 700,
            fontSize: '1.1rem',
            padding: 'var(--space-4)',
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-md)',
            marginBottom: 'var(--space-5)',
          }}
        >
          <span>Total paid</span>
          <span data-testid="confirmation-total">{formatCurrency(order.total)}</span>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <Link to="/products">
            <Button variant="primary">Continue shopping</Button>
          </Link>
          <Link to="/account">
            <Button variant="secondary">View account</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
