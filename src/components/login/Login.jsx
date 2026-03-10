import { useState } from 'react';
import { authApi } from '../../api/client';

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'DM Sans', system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .login-root {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
  @media (max-width: 768px) {
    .login-root { grid-template-columns: 1fr; }
    .login-left { display: none; }
  }

  .login-left {
    background: #16181e;
    display: flex; flex-direction: column; justify-content: center;
    padding: 60px 56px;
    position: relative; overflow: hidden;
  }
  .login-left::before {
    content: '';
    position: absolute; width: 420px; height: 420px; border-radius: 50%;
    background: radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%);
    top: -80px; left: -80px; pointer-events: none;
  }
  .login-left::after {
    content: '';
    position: absolute; width: 300px; height: 300px; border-radius: 50%;
    background: radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%);
    bottom: -60px; right: -60px; pointer-events: none;
  }
  .brand-logo {
    width: 52px; height: 52px; background: #6366f1; border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    font-size: 26px; margin-bottom: 40px; position: relative; z-index: 1;
  }
  .brand-title {
    font-size: 32px; font-weight: 800; color: #fff;
    line-height: 1.2; margin-bottom: 16px; position: relative; z-index: 1;
  }
  .brand-subtitle {
    font-size: 15px; color: rgba(255,255,255,0.5);
    line-height: 1.6; max-width: 340px; position: relative; z-index: 1;
  }
  .feature-list {
    margin-top: 48px; display: flex; flex-direction: column;
    gap: 16px; position: relative; z-index: 1;
  }
  .feature-item { display: flex; align-items: center; gap: 14px; }
  .feature-dot {
    width: 36px; height: 36px; border-radius: 10px;
    background: rgba(99,102,241,0.2);
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; flex-shrink: 0;
  }
  .feature-text { font-size: 14px; color: rgba(255,255,255,0.65); font-weight: 500; }

  .login-right {
    display: flex; align-items: center; justify-content: center;
    padding: 40px 24px; background: #f5f6fa;
  }
  .login-card { width: 100%; max-width: 400px; animation: fadeInUp 0.4s ease; }
  .login-card-header { margin-bottom: 32px; }
  .login-card-header h1 { font-size: 26px; font-weight: 800; color: #1a1d23; margin-bottom: 6px; }
  .login-card-header p { font-size: 14px; color: #6b7280; }

  .form-field { margin-bottom: 18px; }
  .form-field label {
    display: block; font-size: 13px; font-weight: 600;
    color: #6b7280; margin-bottom: 7px;
  }
  .form-input {
    width: 100%; padding: 11px 14px; border-radius: 9px;
    border: 1.5px solid #e8eaed; background: #fff;
    color: #1a1d23; font-size: 14px; font-family: inherit;
    outline: none; transition: border-color 0.15s, box-shadow 0.15s;
  }
  .form-input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.15); }
  .form-input.error { border-color: #ef4444; }
  .error-msg { font-size: 12px; color: #ef4444; margin-top: 5px; }

  .alert {
    background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.25);
    border-radius: 9px; padding: 11px 14px; font-size: 13px; color: #ef4444;
    margin-bottom: 20px; display: flex; align-items: center; gap: 8px;
  }
  .submit-btn {
    width: 100%; padding: 12px; border-radius: 9px; border: none;
    background: #6366f1; color: #fff; font-size: 15px; font-weight: 700;
    font-family: inherit; cursor: pointer;
    transition: background 0.15s; margin-top: 8px;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .submit-btn:hover:not(:disabled) { background: #4f46e5; }
  .submit-btn:disabled { opacity: 0.65; cursor: not-allowed; }
  .spinner {
    width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,0.35); border-top-color: #fff;
    border-radius: 50%; animation: spin 0.6s linear infinite;
  }
  .divider { height: 1px; background: #e8eaed; margin: 24px 0; }
  .hint { font-size: 12px; color: #6b7280; text-align: center; line-height: 1.5; }
  .hint strong { color: #1a1d23; }
`;

export function Login({ onSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [errors, setErrors]     = useState({});

  function validate() {
    const e = {};
    if (!username.trim()) e.username = 'Username is required';
    if (!password.trim()) e.password = 'Password is required';
    return e;
  }

  async function handleSubmit() {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setError('');
    try {
      await authApi.login(username, password);
      onSuccess(); // tell App.jsx to switch to dashboard
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{CSS}</style>
      <div className="login-root">
        <div className="login-left">
          <div className="brand-logo">🏫</div>
          <div className="brand-title">Student Management System</div>
          <div className="brand-subtitle">
            Manage students, courses and enrollments from a single admin panel.
          </div>
          <div className="feature-list">
            {[
              ['🎓', 'Student registration & profiles'],
              ['📚', 'Course catalog with fees'],
              ['✅', 'Enrollment tracking'],
              ['📊', 'Dashboard overview'],
            ].map(([icon, text]) => (
              <div className="feature-item" key={text}>
                <div className="feature-dot">{icon}</div>
                <div className="feature-text">{text}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="login-right">
          <div className="login-card">
            <div className="login-card-header">
              <h1>Welcome back</h1>
              <p>Sign in to your admin account</p>
            </div>

            {error && <div className="alert">⚠ {error}</div>}

            <div className="form-field">
              <label>Username</label>
              <input
                className={`form-input${errors.username ? ' error' : ''}`}
                type="text"
                value={username}
                onChange={e => { setUsername(e.target.value); setErrors(v => ({ ...v, username: '' })); }}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                placeholder="Admin"
                autoFocus
              />
              {errors.username && <div className="error-msg">{errors.username}</div>}
            </div>

            <div className="form-field">
              <label>Password</label>
              <input
                className={`form-input${errors.password ? ' error' : ''}`}
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setErrors(v => ({ ...v, password: '' })); }}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                placeholder="••••••••"
              />
              {errors.password && <div className="error-msg">{errors.password}</div>}
            </div>

            <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
              {loading ? <><span className="spinner" /> Signing in...</> : 'Sign In'}
            </button>

            <div className="divider" />
            <div className="hint">
              Default: <strong>Admin</strong> / <strong>admin@123</strong>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}