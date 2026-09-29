import RegisterForm from '../components/auth/RegisterForm';
import './page.css';

export default function RegisterFormPage() {
  return (
    <section id="page" className="login-page d-flex align-items-center">
        <div className="container align-items-center mx-auto space-y-6">
          <RegisterForm />
        </div>
    </section>
  );
}


