import FormField from '../ui/FormField.tsx';
import { validateRequired, validateZip } from '../../utils/validators.ts';
import type { ShippingAddress } from '../../types.ts';

interface ShippingFormProps {
  value: ShippingAddress;
  onChange: (value: ShippingAddress) => void;
}

export default function ShippingForm({ value, onChange }: ShippingFormProps) {
  const set =
    <K extends keyof ShippingAddress>(field: K) =>
    (v: ShippingAddress[K]) =>
      onChange({ ...value, [field]: v });

  return (
    <fieldset data-testid="shipping-form" style={{ border: 'none', padding: 0 }}>
      <legend style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 16 }}>
        Shipping address
      </legend>
      <FormField
        label="Full name"
        value={value.fullName}
        onChange={set('fullName')}
        validate={(v) => validateRequired(v, 'Full name')}
        autoComplete="name"
        testId="ship-name"
        required
      />
      <FormField
        label="Address line 1"
        value={value.address1}
        onChange={set('address1')}
        validate={(v) => validateRequired(v, 'Address')}
        autoComplete="address-line1"
        testId="ship-address1"
        required
      />
      <FormField
        label="Address line 2 (optional)"
        value={value.address2}
        onChange={set('address2')}
        autoComplete="address-line2"
        testId="ship-address2"
      />
      <div className="field-row">
        <FormField
          label="City"
          value={value.city}
          onChange={set('city')}
          validate={(v) => validateRequired(v, 'City')}
          autoComplete="address-level2"
          testId="ship-city"
          required
        />
        <FormField
          label="ZIP / Postal code"
          value={value.zip}
          onChange={set('zip')}
          validate={validateZip}
          autoComplete="postal-code"
          testId="ship-zip"
          required
        />
      </div>
      <FormField
        label="Country"
        value={value.country}
        onChange={set('country')}
        validate={(v) => validateRequired(v, 'Country')}
        autoComplete="country-name"
        testId="ship-country"
        required
      />
    </fieldset>
  );
}
