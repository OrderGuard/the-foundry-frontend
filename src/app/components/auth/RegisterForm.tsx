'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterForm() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirm_password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (form.password !== form.confirm_password) {
      setError('Passwords do not match');
      return;
    }

    {/*const res = await fetch('/auth/register', {*/}
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      // 🔥 Extract DRF errors
      const errorMessage =
        data.message || // custom message (if you used Option 2 backend)
        Object.values(data).flat().join(' ') || // field errors
        data.detail || // fallback
        'Registration failed';

      setError(errorMessage);

    } else {
      setSuccess('Account created! Redirecting to login...');
      setTimeout(() => router.push('/login'), 1500);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="login login-form max-w-sm mx-auto mt-10 space-y-4">
      <h2 className="text-2xl font-bold">Register</h2>

      <div className="form-group mt-3">
        <input
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          className="form-control"
          required
        />
      </div>

      <div className="form-group mt-3">
        <input
          type="email"
          placeholder="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="form-control"
          required
        />
      </div>

      <div className="form-group mt-3">
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="form-control"
          required
        />
      </div>

      <div className="form-group mt-3">
        <input
          type="password"
          placeholder="Confirm Password"
          value={form.confirm_password}
          onChange={(e) => setForm({ ...form, confirm_password: e.target.value })}
          className="form-control"
          required
        />
      </div>

      <div className="form-group mt-3">
        <button
          type="submit"
          className="form-control"
        >
          Register
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-600">{success}</p>}

      <div className="text-center mt-4">
        <p className="text-sm">
          Already have an account?{' '}
          <Link href="/login" className="register-link hover:underline">
            Login
          </Link>
        </p>
      </div>
    </form>
  );
}


