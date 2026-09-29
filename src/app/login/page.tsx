import LoginForm from '../components/auth/LoginForm';
import './page.css';

export default function LoginPage() {
  return (
    <section id="page" className="login-page d-flex align-items-center">
        <div className="container align-items-center mx-auto space-y-6">
          <LoginForm />
        </div>
    </section>
  );
}

