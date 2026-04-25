import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  block?: boolean;
  children: ReactNode;
}

export default function Button({
  variant = 'primary',
  type = 'button',
  block = false,
  children,
  className = '',
  ...rest
}: ButtonProps) {
  const cls = [
    'btn',
    variant === 'primary' ? 'btn-primary' : 'btn-secondary',
    block ? 'btn-block' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <button type={type} className={cls} {...rest}>
      {children}
    </button>
  );
}
