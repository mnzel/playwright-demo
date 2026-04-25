import LoginForm from '../components/auth/LoginForm.tsx';

export default function LoginPage() {
  return (
    <div className="page" data-testid="page-login">
      <div className="container" style={{ maxWidth: 440 }}>
        <h1 className="page-title" style={{ textAlign: 'center' }}>
          Sign in
        </h1>
        <LoginForm />
      </div>
    </div>
  );
}
