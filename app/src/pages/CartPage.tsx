import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.tsx';
import CartLineItem from '../components/cart/CartLineItem.tsx';
import PromoCodeInput from '../components/cart/PromoCodeInput.tsx';
import OrderSummary from '../components/cart/OrderSummary.tsx';
import Button from '../components/ui/Button.tsx';

export default function CartPage() {
  const { lineItems } = useCart();
  const navigate = useNavigate();

  return (
    <div className="page" data-testid="page-cart">
      <div className="container">
        <h1 className="page-title">Your cart</h1>

        {lineItems.length === 0 ? (
          <div data-testid="cart-empty" style={{ textAlign: 'center', padding: '64px 0' }}>
            <p style={{ marginBottom: 24, color: 'var(--color-text-muted)' }}>
              Your cart is empty.
            </p>
            <Link to="/products">
              <Button variant="primary">Continue shopping</Button>
            </Link>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 2fr) minmax(280px, 1fr)',
              gap: 'var(--space-6)',
            }}
          >
            <div>
              <ul data-testid="cart-line-list">
                {lineItems.map((li) => (
                  <li key={`${li.productId}__${li.size ?? ''}`}>
                    <CartLineItem item={li} />
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <PromoCodeInput />
              <OrderSummary />
              <Button
                variant="primary"
                block
                onClick={() => navigate('/checkout')}
                data-testid="cart-checkout"
              >
                Proceed to checkout
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
