import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FormField from '../ui/FormField.tsx';
import Button from '../ui/Button.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { useToast } from '../../context/ToastContext.tsx';
import {
  validateEmail,
  validatePassword,
  validateRequired,
} from '../../utils/validators.ts';
import type { ValidationResult } from '../../utils/validators.ts';

export default function RegisterForm() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const toast = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function validateConfirm(value: string): ValidationResult {
    if (!value) return 'Please confirm your password';
    if (value !== password) return 'Passwords do not match';
    return null;
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitError(null);
    const errs = [
      validateRequired(name, 'Name'),
      validateEmail(email),
      validatePassword(password),
      validateConfirm(confirm),
    ].filter(Boolean);
    if (errs.length > 0) {
      setSubmitError('Please correct the errors above');
      return;
    }
    setSubmitting(true);
    const result = register(name, email, password);
    setSubmitting(false);
    if (!result.ok) {
      setSubmitError(result.error ?? 'Could not create account');
      return;
    }
    toast.push('Account created!', { variant: 'success' });
    navigate('/', { replace: true });
  }

  return (
    <form onSubmit={handleSubmit} data-testid="register-form" noValidate>
      <FormField
        label="Full name"
        value={name}
        onChange={setName}
        validate={(v) => validateRequired(v, 'Name')}
        autoComplete="name"
        testId="register-name"
        required
      />
      <FormField
        label="Email"
        type="email"
        value={email}
        onChange={setEmail}
        validate={validateEmail}
        autoComplete="email"
        testId="register-email"
        required
      />
      <FormField
        label="Password"
        type="password"
        value={password}
        onChange={setPassword}
        validate={validatePassword}
        autoComplete="new-password"
        testId="register-password"
        required
      />
      <FormField
        label="Confirm password"
        type="password"
        value={confirm}
        onChange={setConfirm}
        validate={validateConfirm}
        autoComplete="new-password"
        testId="register-confirm"
        required
      />
      {submitError && (
        <div
          data-testid="register-error"
          style={{
            color: 'var(--color-error)',
            background: '#fee2e2',
            padding: '10px 12px',
            borderRadius: 6,
            fontSize: '0.9rem',
            marginBottom: 16,
          }}
        >
          {submitError}
        </div>
      )}
      <Button type="submit" block data-testid="register-submit" disabled={submitting}>
        {submitting ? 'Creating account…' : 'Create account'}
      </Button>
      <p style={{ textAlign: 'center', marginTop: 'var(--space-4)', fontSize: '0.9rem' }}>
        Already have an account?{' '}
        <Link to="/login" data-testid="register-link-login" style={{ textDecoration: 'underline' }}>
          Sign in
        </Link>
      </p>
    </form>
  );
}
