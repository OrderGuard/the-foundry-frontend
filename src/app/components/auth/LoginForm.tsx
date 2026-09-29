'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

//import { useAuth } from '../../context/AuthContext'; // adjust path as needed
import { useAuthStore } from '../../store/useAuthStore'; // update path if needed


export default function LoginForm() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  //const { login } = useAuth();
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  async function handleSubmit(e: React.FormEvent) {

    e.preventDefault();
    setError('');

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/token/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.detail || 'Invalid credentials');
    } else {
      localStorage.setItem('access', data.access); // or use cookie
      localStorage.setItem('refresh', data.refresh); // or use cookie
      //login(data.access); // After successful login
      //login(data.access, data.user); // ✅ correct for Zustand store
      login(data.access, data.refresh, data.user);
      router.push('/'); // redirect to homepage
    }
  }

  return (
    <form onSubmit={handleSubmit} className="login-form max-w-sm mx-auto mt-10 space-y-4">
      <h2 className="text-2xl font-bold">Login</h2>

      <div className="form-group mt-3">
        <input
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          className="form-control"
        />
      </div>

      <div className="form-group mt-3">
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="form-control"
        />
      </div>

      <div className="form-group mt-3">
        <button
          type="submit"
          className="form-control"
        >
          Log In
        </button>
      </div>

      {error && <p className="text-error">{error}</p>}

      {/* Register link */}
      <div className="text-center mt-4">
        <p className="text-sm">
          Don’t have an account?{' '}
          <Link href="/register" className="register-link hover:underline">
            Register
          </Link>
        </p>
      </div>

    </form>
  );
}

