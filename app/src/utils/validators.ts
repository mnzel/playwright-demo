// Field validators. Each returns null on success, or an error message string.

export type ValidationResult = string | null;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(value: string): ValidationResult {
  if (!value) return 'Email is required';
  if (!EMAIL_REGEX.test(value)) return 'Enter a valid email address';
  return null;
}

export function validatePassword(value: string): ValidationResult {
  if (!value) return 'Password is required';
  if (value.length < 8) return 'Password must be at least 8 characters';
  if (!/[A-Z]/.test(value)) return 'Password must contain an uppercase letter';
  if (!/[a-z]/.test(value)) return 'Password must contain a lowercase letter';
  if (!/[0-9]/.test(value)) return 'Password must contain a number';
  return null;
}

export function validateRequired(value: string, label: string = 'This field'): ValidationResult {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return `${label} is required`;
  }
  return null;
}

export function validateZip(value: string): ValidationResult {
  if (!value) return 'ZIP / postal code is required';
  if (value.length < 3) return 'Enter a valid ZIP / postal code';
  return null;
}

// Loose Luhn-style card number check — accepts the standard Stripe test card 4242 4242 4242 4242
export function validateCardNumber(value: string): ValidationResult {
  if (!value) return 'Card number is required';
  const digits = value.replace(/\s+/g, '');
  if (!/^\d{13,19}$/.test(digits)) return 'Enter a valid card number';
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits[i]!, 10);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  if (sum % 10 !== 0) return 'Card number is invalid';
  return null;
}

export function validateExpiry(value: string): ValidationResult {
  if (!value) return 'Expiry is required';
  const m = value.match(/^(\d{2})\s*\/\s*(\d{2})$/);
  if (!m) return 'Use MM/YY';
  const month = parseInt(m[1]!, 10);
  const year = 2000 + parseInt(m[2]!, 10);
  if (month < 1 || month > 12) return 'Invalid month';
  const now = new Date();
  const expiry = new Date(year, month - 1, 1);
  expiry.setMonth(expiry.getMonth() + 1);
  if (expiry < now) return 'Card has expired';
  return null;
}

export function validateCvc(value: string): ValidationResult {
  if (!value) return 'CVC is required';
  if (!/^\d{3,4}$/.test(value)) return 'CVC must be 3 or 4 digits';
  return null;
}
