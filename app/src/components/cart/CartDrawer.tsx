import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext.tsx';
import { formatCurrency } from '../../utils/format.ts';
import CartLineItem from './CartLineItem.tsx';
import Button from '../ui/Button.tsx';
import styles from './CartDrawer.module.css';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

type DrawerState = 'closed' | 'opening' | 'open' | 'closing';

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const drawerRef = useRef<HTMLElement | null>(null);
  const [state, setState] = useState<DrawerState>('closed');

  useEffect(() => {
    if (open && state === 'closed') {
      setState('opening');
      requestAnimationFrame(() => {
        // The CSS transition will run; transitionend handler flips to "open"
      });
    } else if (!open && (state === 'open' || state === 'opening')) {
      setState('closing');
    }
  }, [open, state]);

  useEffect(() => {
    const node = drawerRef.current;
    if (!node) return;
    function handleEnd(e: TransitionEvent) {
      if (e.propertyName !== 'transform') return;
      setState((s) => {
        if (s === 'opening') return 'open';
        if (s === 'closing') return 'closed';
        return s;
      });
    }
    node.addEventListener('transitionend', handleEnd);
    return () => node.removeEventListener('transitionend', handleEnd);
  }, []);

  useEffect(() => {
    if (state !== 'closed') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [state]);

  const { lineItems, total, itemCount } = useCart();

  return (
    <>
      <div
        className={styles.backdrop}
        data-state={state === 'open' || state === 'opening' ? 'open' : 'closed'}
        data-testid="cart-drawer-backdrop"
        onClick={onClose}
      />
      <aside
        ref={drawerRef}
        className={styles.drawer}
        data-state={state}
        data-testid="cart-drawer"
        aria-label="Shopping cart"
        aria-hidden={state !== 'open'}
      >
        <div className={styles.drawerInner}>
          <div className={styles.header}>
            <h2>Your cart ({itemCount})</h2>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={onClose}
              aria-label="Close cart"
              data-testid="cart-drawer-close"
            >
              ×
            </button>
          </div>
          <div className={styles.body}>
            {lineItems.length === 0 ? (
              <div className={styles.empty} data-testid="cart-drawer-empty">
                Your cart is empty.
              </div>
            ) : (
              lineItems.map((li) => (
                <CartLineItem key={`${li.productId}__${li.size ?? ''}`} item={li} compact />
              ))
            )}
          </div>
          {lineItems.length > 0 && (
            <div className={styles.footer}>
              <div className={styles.totalRow}>
                <span>Total</span>
                <span data-testid="cart-drawer-total">{formatCurrency(total)}</span>
              </div>
              <Link to="/cart" onClick={onClose}>
                <Button variant="secondary" block data-testid="cart-drawer-view">
                  View cart
                </Button>
              </Link>
              <Link to="/checkout" onClick={onClose}>
                <Button variant="primary" block data-testid="cart-drawer-checkout">
                  Go to checkout
                </Button>
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
