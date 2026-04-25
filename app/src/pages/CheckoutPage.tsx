import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { useToast } from '../context/ToastContext.tsx';
import { useLocalStorage } from '../hooks/useLocalStorage.ts';
import {
  validateRequired,
  validateZip,
  validateCardNumber,
  validateExpiry,
  validateCvc,
} from '../utils/validators.ts';
import { generateOrderId } from '../utils/ids.ts';
import ShippingForm from '../components/checkout/ShippingForm.tsx';
import PaymentForm from '../components/checkout/PaymentForm.tsx';
import OrderSummary from '../components/cart/OrderSummary.tsx';
import Button from '../components/ui/Button.tsx';
import type { Order, OrderItem, PaymentDetails, ShippingAddress } from '../types.ts';

const initialShipping: ShippingAddress = {
  fullName: '',
  address1: '',
  address2: '',
  city: '',
  zip: '',
  country: '',
};

const initialPayment: PaymentDetails = {
  cardName: '',
  cardNumber: '',
  expiry: '',
  cvc: '',
};

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { lineItems, total, clearCart } = useCart();
  const { user } = useAuth();
  const toast = useToast();
  const [orders, setOrders] = useLocalStorage<Order[]>('ec_orders_v1', []);

  const [shipping, setShipping] = useState<ShippingAddress>(initialShipping);
  const [payment, setPayment] = useState<PaymentDetails>(initialPayment);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [placing, setPlacing] = useState(false);

  function validate(): string[] {
    const errs = [
      validateRequired(shipping.fullName, 'Full name'),
      validateRequired(shipping.address1, 'Address'),
      validateRequired(shipping.city, 'City'),
      validateZip(shipping.zip),
      validateRequired(shipping.country, 'Country'),
      validateRequired(payment.cardName, 'Cardholder name'),
      validateCardNumber(payment.cardNumber),
      validateExpiry(payment.expiry),
      validateCvc(payment.cvc),
    ].filter((e): e is string => e !== null);
    return errs;
  }

  function handlePlaceOrder() {
    if (lineItems.length === 0) {
      setSubmitError('Your cart is empty');
      return;
    }
    if (!user) {
      setSubmitError('You must be signed in to place an order');
      return;
    }
    const errs = validate();
    if (errs.length > 0) {
      setSubmitError(errs[0] ?? 'Please correct the form errors');
      return;
    }
    setSubmitError(null);
    setPlacing(true);
    const id = generateOrderId();
    const items: OrderItem[] = lineItems.map((li) => ({
      productId: li.productId,
      name: li.product.name,
      slug: li.product.slug,
      quantity: li.quantity,
      size: li.size,
      unitPrice: li.product.price,
      lineTotal: li.lineTotal,
    }));
    const order: Order = {
      id,
      userEmail: user.email,
      placedAt: new Date().toISOString(),
      items,
      total,
      shipping,
    };
    setOrders([...(orders ?? []), order]);
    clearCart();
    toast.push('Order placed!', { variant: 'success' });
    navigate(`/checkout/confirmation/${id}`, { replace: true });
  }

  if (lineItems.length === 0) {
    return (
      <div className="page" data-testid="page-checkout-empty">
        <div className="container">
          <h1 className="page-title">Checkout</h1>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: 16 }}>
            Your cart is empty. Add some items before checking out.
          </p>
          <Button variant="primary" onClick={() => navigate('/products')}>
            Continue shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="page" data-testid="page-checkout">
      <div className="container">
        <h1 className="page-title">Checkout</h1>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 2fr) minmax(280px, 1fr)',
            gap: 'var(--space-6)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <ShippingForm value={shipping} onChange={setShipping} />
            <PaymentForm value={payment} onChange={setPayment} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <OrderSummary showLineItems />
            {submitError && (
              <div
                data-testid="checkout-error"
                style={{
                  color: 'var(--color-error)',
                  background: '#fee2e2',
                  padding: '10px 12px',
                  borderRadius: 6,
                  fontSize: '0.9rem',
                }}
              >
                {submitError}
              </div>
            )}
            <Button
              variant="primary"
              block
              onClick={handlePlaceOrder}
              disabled={placing}
              data-testid="place-order"
            >
              {placing ? 'Placing order…' : 'Place order'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
