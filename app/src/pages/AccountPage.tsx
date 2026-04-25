import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import { useLocalStorage } from '../hooks/useLocalStorage.ts';
import { formatCurrency, formatDate } from '../utils/format.ts';
import Button from '../components/ui/Button.tsx';
import type { Order } from '../types.ts';

export default function AccountPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders] = useLocalStorage<Order[]>('ec_orders_v1', []);

  const myOrders = orders.filter((o) => o.userEmail === user?.email);

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <div className="page" data-testid="page-account">
      <div className="container">
        <h1 className="page-title">My account</h1>

        <section
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-5)',
            marginBottom: 'var(--space-5)',
          }}
          data-testid="account-profile"
        >
          <h2 className="section-title">Profile</h2>
          <p>
            <strong>Name:</strong> <span data-testid="account-name">{user?.name}</span>
          </p>
          <p>
            <strong>Email:</strong> <span data-testid="account-email">{user?.email}</span>
          </p>
          <Button
            variant="secondary"
            onClick={handleLogout}
            data-testid="account-logout"
            style={{ marginTop: 16 }}
          >
            Log out
          </Button>
        </section>

        <section data-testid="order-history">
          <h2 className="section-title">Order history</h2>
          {myOrders.length === 0 ? (
            <p
              data-testid="order-history-empty"
              style={{ color: 'var(--color-text-muted)' }}
            >
              You haven't placed any orders yet.{' '}
              <Link to="/products" style={{ textDecoration: 'underline' }}>
                Start shopping
              </Link>
              .
            </p>
          ) : (
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {myOrders.map((order) => (
                <li
                  key={order.id}
                  data-testid={`order-row-${order.id}`}
                  style={{
                    padding: 'var(--space-4)',
                    background: '#fff',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600 }}>{order.id}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                      {formatDate(order.placedAt)} · {order.items.length}{' '}
                      {order.items.length === 1 ? 'item' : 'items'}
                    </div>
                  </div>
                  <div style={{ fontWeight: 700 }}>{formatCurrency(order.total)}</div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
