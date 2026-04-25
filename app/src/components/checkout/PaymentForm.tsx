import FormField from '../ui/FormField.tsx';
import {
  validateCardNumber,
  validateExpiry,
  validateCvc,
  validateRequired,
} from '../../utils/validators.ts';
import type { PaymentDetails } from '../../types.ts';

interface PaymentFormProps {
  value: PaymentDetails;
  onChange: (value: PaymentDetails) => void;
}

export default function PaymentForm({ value, onChange }: PaymentFormProps) {
  const set =
    <K extends keyof PaymentDetails>(field: K) =>
    (v: PaymentDetails[K]) =>
      onChange({ ...value, [field]: v });

  return (
    <fieldset data-testid="payment-form" style={{ border: 'none', padding: 0 }}>
      <legend style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 16 }}>
        Payment
      </legend>
      <FormField
        label="Cardholder name"
        value={value.cardName}
        onChange={set('cardName')}
        validate={(v) => validateRequired(v, 'Cardholder name')}
        autoComplete="cc-name"
        testId="pay-name"
        required
      />
      <FormField
        label="Card number"
        value={value.cardNumber}
        onChange={set('cardNumber')}
        validate={validateCardNumber}
        autoComplete="cc-number"
        inputMode="numeric"
        placeholder="4242 4242 4242 4242"
        testId="pay-number"
        required
      />
      <div className="field-row">
        <FormField
          label="Expiry (MM/YY)"
          value={value.expiry}
          onChange={set('expiry')}
          validate={validateExpiry}
          autoComplete="cc-exp"
          inputMode="numeric"
          placeholder="12/30"
          testId="pay-expiry"
          required
        />
        <FormField
          label="CVC"
          value={value.cvc}
          onChange={set('cvc')}
          validate={validateCvc}
          autoComplete="cc-csc"
          inputMode="numeric"
          placeholder="123"
          testId="pay-cvc"
          required
        />
      </div>
    </fieldset>
  );
}
