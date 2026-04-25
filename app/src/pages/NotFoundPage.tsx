import { Link } from 'react-router-dom';
import Button from '../components/ui/Button.tsx';

export default function NotFoundPage() {
  return (
    <div className="page" data-testid="page-not-found">
      <div className="container" style={{ textAlign: 'center', padding: '80px 0' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: 16 }}>404</h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 24 }}>
          We couldn't find that page.
        </p>
        <Link to="/">
          <Button variant="primary">Back to home</Button>
        </Link>
      </div>
    </div>
  );
}
