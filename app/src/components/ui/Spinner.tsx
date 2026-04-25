interface SpinnerProps {
  size?: number;
  label?: string;
}

export default function Spinner({ size = 24, label = 'Loading' }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      data-testid="spinner"
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        border: '3px solid #e2e8f0',
        borderTopColor: '#1e293b',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </span>
  );
}
