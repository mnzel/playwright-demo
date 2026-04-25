import { useState } from 'react';
import type { FormEvent } from 'react';
import { useCart } from '../../context/CartContext.tsx';
import { useToast } from '../../context/ToastContext.tsx';

export default function PromoCodeInput() {
  const { promoApplied, applyPromo, removePromo } = useCart();
  const toast = useToast();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  function handleApply(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const result = applyPromo(code);
    if (result.ok) {
      toast.push('Promo code applied', { variant: 'success' });
      setCode('');
    } else {
      setError(result.error ?? 'Could not apply promo');
    }
  }

  if (promoApplied) {
    return (
      <div
        data-testid="promo-applied"
        style={{
          background: '#dcfce7',
          color: '#166534',
          padding: '10px 14px',
          borderRadius: 8,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span>
          <strong>{promoApplied}</strong> applied — 10% off
        </span>
        <button
          type="button"
          data-testid="promo-remove"
          onClick={removePromo}
          style={{ fontSize: '0.85rem', textDecoration: 'underline' }}
        >
          Remove
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleApply} data-testid="promo-form">
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          type="text"
          data-testid="promo-input"
          placeholder="Promo code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          style={{
            flex: 1,
            padding: '10px 12px',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            background: '#fff',
          }}
        />
        <button
          type="submit"
          data-testid="promo-apply"
          className="btn btn-secondary"
          style={{ padding: '0 20px' }}
        >
          Apply
        </button>
      </div>
      {error && (
        <div
          data-testid="promo-error"
          style={{ color: 'var(--color-error)', fontSize: '0.85rem', marginTop: 6 }}
        >
          {error}
        </div>
      )}
    </form>
  );
}
