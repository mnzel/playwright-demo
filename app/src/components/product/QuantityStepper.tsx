import type { CSSProperties } from 'react';

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  testIdPrefix?: string;
}

export default function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  testIdPrefix = 'qty',
}: QuantityStepperProps) {
  function decrement() {
    if (value > min) onChange(value - 1);
  }
  function increment() {
    if (value < max) onChange(value + 1);
  }

  return (
    <div
      data-testid={`${testIdPrefix}-stepper`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
      }}
    >
      <button
        type="button"
        data-testid={`${testIdPrefix}-decrement`}
        onClick={decrement}
        disabled={value <= min}
        aria-label="Decrease quantity"
        style={stepBtn}
      >
        −
      </button>
      <input
        type="text"
        inputMode="numeric"
        data-testid={`${testIdPrefix}-value`}
        value={value}
        onChange={(e) => {
          const n = parseInt(e.target.value, 10);
          if (!isNaN(n) && n >= min && n <= max) onChange(n);
        }}
        style={{
          width: 48,
          textAlign: 'center',
          border: 'none',
          padding: '8px 0',
          background: 'transparent',
        }}
        aria-label="Quantity"
      />
      <button
        type="button"
        data-testid={`${testIdPrefix}-increment`}
        onClick={increment}
        disabled={value >= max}
        aria-label="Increase quantity"
        style={stepBtn}
      >
        +
      </button>
    </div>
  );
}

const stepBtn: CSSProperties = {
  width: 36,
  height: 36,
  fontSize: '1.1rem',
  background: 'var(--color-surface)',
};
