import RegisterForm from '../components/auth/RegisterForm.tsx';

export default function RegisterPage() {
  return (
    <div className="page" data-testid="page-register">
      <div className="container" style={{ maxWidth: 440 }}>
        <h1 className="page-title" style={{ textAlign: 'center' }}>
          Create an account
        </h1>
        <RegisterForm />
      </div>
    </div>
  );
}
