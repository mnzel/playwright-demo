import { useState, useId } from 'react';
import type { HTMLInputTypeAttribute, InputHTMLAttributes } from 'react';
import type { ValidationResult } from '../../utils/validators.ts';

type NativeInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'value' | 'onChange' | 'type' | 'autoComplete' | 'placeholder' | 'inputMode'
>;

interface FormFieldProps extends NativeInputProps {
  label: string;
  type?: HTMLInputTypeAttribute;
  value: string;
  onChange: (value: string) => void;
  validate?: (value: string) => ValidationResult;
  required?: boolean;
  autoComplete?: string;
  testId?: string;
  placeholder?: string;
  inputMode?: InputHTMLAttributes<HTMLInputElement>['inputMode'];
}

export default function FormField({
  label,
  type = 'text',
  value,
  onChange,
  validate,
  required = false,
  autoComplete,
  testId,
  placeholder,
  inputMode,
  ...rest
}: FormFieldProps) {
  const id = useId();
  const [touched, setTouched] = useState(false);
  const error = touched && typeof validate === 'function' ? validate(value) : null;

  return (
    <div className="field">
      <label htmlFor={id}>
        {label}
        {required && (
          <span aria-hidden="true" style={{ color: '#dc2626' }}>
            {' '}
            *
          </span>
        )}
      </label>
      <input
        id={id}
        type={type}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setTouched(true)}
        autoComplete={autoComplete}
        placeholder={placeholder}
        inputMode={inputMode}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        data-testid={testId}
        {...rest}
      />
      {error && (
        <span
          id={`${id}-error`}
          className="field-error"
          data-testid={testId ? `${testId}-error` : undefined}
        >
          {error}
        </span>
      )}
    </div>
  );
}
