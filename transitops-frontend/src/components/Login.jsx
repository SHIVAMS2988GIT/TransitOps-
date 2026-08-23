import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import './Dashboard.css';

export default function Login({ setToken, setRole }) {
  const [email, setEmail] = useState('admin@transitops.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email: email.trim(), password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      setToken(res.data.token);
      setRole(res.data.role);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to sign in. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="brand-mark large">TO</div>
        <div className="login-brand">TransitOps</div>
        <p className="login-subtitle">Fleet command center</p>
        <div className="login-divider" />
        <h1>Welcome back</h1>
        <p className="login-copy">Sign in to monitor fleet activity, dispatch trips and track operational health.</p>

        {error && <div className="alert error-alert">{error}</div>}

        <form onSubmit={handleLogin} className="form-stack">
          <label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" /></label>
          <label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" /></label>
          <button className="primary-btn full" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button>
        </form>

        <div className="demo-note"><strong>Demo account</strong><span>admin@transitops.com</span><span>admin123</span></div>
      </section>
    </main>
  );
}
