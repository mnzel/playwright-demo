import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import FormField from '../ui/FormField.tsx';
import Button from '../ui/Button.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { useToast } from '../../context/ToastContext.tsx';
import { validateEmail, validateRequired } from '../../utils/validators.ts';

export default function LoginForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const redirect = searchParams.get('redirect') || '/';

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitError(null);
    if (validateEmail(email) || validateRequired(password, 'Password')) {
      setSubmitError('Please correct the errors above');
      return;
    }
    setSubmitting(true);
    const result = login(email, password);
    setSubmitting(false);
    if (!result.ok) {
      setSubmitError(result.error ?? 'Could not sign in');
      return;
    }
    toast.push('Welcome back!', { variant: 'success' });
    navigate(redirect, { replace: true });
  }

  return (
    <form onSubmit={handleSubmit} data-testid="login-form" noValidate>
      <FormField
        label="Email"
        type="email"
        value={email}
        onChange={setEmail}
        validate={validateEmail}
        autoComplete="email"
        testId="login-email"
        required
      />
      <FormField
        label="Password"
        type="password"
        value={password}
        onChange={setPassword}
        validate={(v) => validateRequired(v, 'Password')}
        autoComplete="current-password"
        testId="login-password"
        required
      />
      {submitError && (
        <div
          data-testid="login-error"
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
      <Button type="submit" block data-testid="login-submit" disabled={submitting}>
        {submitting ? 'Signing in…' : 'Sign in'}
      </Button>
      <p style={{ textAlign: 'center', marginTop: 'var(--space-4)', fontSize: '0.9rem' }}>
        New customer?{' '}
        <Link
          to="/register"
          data-testid="login-link-register"
          style={{ textDecoration: 'underline' }}
        >
          Create an account
        </Link>
      </p>
      <p
        style={{
          textAlign: 'center',
          marginTop: 'var(--space-3)',
          fontSize: '0.8rem',
          color: 'var(--color-text-muted)',
        }}
      >
        Demo: <code>test@example.com</code> / <code>Password123!</code>
      </p>
    </form>
  );
}
