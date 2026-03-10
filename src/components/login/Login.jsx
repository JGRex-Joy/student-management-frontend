import { useState } from 'react';
import { authApi } from '../../api/client';

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Mono:wght@300;400;500&family=Instrument+Sans:wght@400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Instrument Sans', system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
    background: #f7f4ef;
  }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(18px); }
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

  /* Left panel — dark ink */
  .login-left {
    background: #1e1c1a;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 52px 56px;
    position: relative;
    overflow: hidden;
  }

  /* Subtle texture lines */
  .login-left::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 39px,
      rgba(247,244,239,0.03) 40px
    );
    pointer-events: none;
  }

  .brand-mark {
    display: flex;
    align-items: center;
    gap: 12px;
    position: relative;
    z-index: 1;
  }

  .brand-monogram {
    width: 42px; height: 42px;
    border: 1.5px solid rgba(247,244,239,0.2);
    border-radius: 6px;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 18px; font-weight: 700;
    color: #f7f4ef;
    letter-spacing: -0.02em;
  }

  .brand-name {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: rgba(247,244,239,0.45);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    line-height: 1;
  }

  .hero-text {
    position: relative;
    z-index: 1;
  }

  .hero-headline {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 42px;
    font-weight: 700;
    color: #f7f4ef;
    line-height: 1.15;
    letter-spacing: -0.03em;
    margin-bottom: 20px;
  }

  .hero-headline em {
    font-style: italic;
    color: rgba(247,244,239,0.5);
  }

  .hero-sub {
    font-size: 14px;
    color: rgba(247,244,239,0.45);
    line-height: 1.7;
    max-width: 300px;
    font-family: 'Instrument Sans', sans-serif;
  }

  .feature-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    position: relative; z-index: 1;
  }

  .feature-chip {
    border: 1px solid rgba(247,244,239,0.1);
    border-radius: 6px;
    padding: 12px 14px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .feature-chip-icon {
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    color: rgba(247,244,239,0.35);
    width: 18px;
    flex-shrink: 0;
  }

  .feature-chip-label {
    font-size: 12px;
    color: rgba(247,244,239,0.55);
    font-family: 'Instrument Sans', sans-serif;
    letter-spacing: -0.01em;
  }

  /* Right panel — cream */
  .login-right {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 24px;
    background: #f7f4ef;
  }

  .login-card {
    width: 100%;
    max-width: 360px;
    animation: fadeInUp 0.4s ease;
  }

  .login-header {
    margin-bottom: 36px;
  }

  .login-header h1 {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 28px; font-weight: 700;
    color: #0f0e0d;
    letter-spacing: -0.03em;
    margin-bottom: 6px;
    line-height: 1.2;
  }

  .login-header p {
    font-size: 13px;
    color: #6b6560;
    font-family: 'Instrument Sans', sans-serif;
  }

  .form-field { margin-bottom: 16px; }

  .form-label {
    display: block;
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    font-weight: 500;
    color: #6b6560;
    margin-bottom: 6px;
    letter-spacing: 0.09em;
    text-transform: uppercase;
  }

  .form-input {
    width: 100%;
    padding: 10px 12px;
    border-radius: 6px;
    border: 1.5px solid #d8d2c8;
    background: #fdfcfa;
    color: #0f0e0d;
    font-size: 13px;
    font-family: 'Instrument Sans', sans-serif;
    outline: none;
    transition: border-color 0.13s, box-shadow 0.13s;
    letter-spacing: -0.01em;
  }

  .form-input:focus {
    border-color: #0f0e0d;
    box-shadow: 0 0 0 2px rgba(15,14,13,0.07);
  }

  .form-input.error { border-color: #c0392b; }

  .error-msg {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    color: #c0392b;
    margin-top: 4px;
    letter-spacing: 0.02em;
  }

  .alert {
    background: rgba(192,57,43,0.06);
    border: 1px solid rgba(192,57,43,0.2);
    border-radius: 6px;
    padding: 10px 13px;
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: #c0392b;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
    letter-spacing: 0.01em;
  }

  .submit-btn {
    width: 100%;
    padding: 11px;
    border-radius: 6px;
    border: 1.5px solid #0f0e0d;
    background: #0f0e0d;
    color: #f7f4ef;
    font-size: 13px;
    font-weight: 600;
    font-family: 'Instrument Sans', sans-serif;
    cursor: pointer;
    transition: background 0.13s, color 0.13s;
    margin-top: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    letter-spacing: -0.01em;
  }

  .submit-btn:hover:not(:disabled) {
    background: #1e1c1a;
  }

  .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .spinner {
    width: 14px; height: 14px;
    border: 2px solid rgba(247,244,239,0.25);
    border-top-color: #f7f4ef;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  .divider {
    height: 1px;
    background: #d8d2c8;
    margin: 24px 0;
  }

  .hint {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    color: #b0aaa3;
    text-align: center;
    line-height: 1.8;
    letter-spacing: 0.04em;
  }

  .hint strong {
    color: #6b6560;
    font-weight: 500;
  }
`;

export function Login({ onSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [errors, setErrors]     = useState({});

  function validate() {
    const e = {};
    if (!username.trim()) e.username = 'username required';
    if (!password.trim()) e.password = 'password required';
    return e;
  }

  async function handleSubmit() {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setError('');
    try {
      await authApi.login(username, password);
      onSuccess();
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
        {/* Left */}
        <div className="login-left">
          <div className="brand-mark">
            <div className="brand-monogram">S</div>
            <div className="brand-name">Student Mgmt System</div>
          </div>

          <div className="hero-text">
            <div className="hero-headline">
              Manage<br />
              <em>students &</em><br />
              courses.
            </div>
            <p className="hero-sub">
              A clean admin panel for student registration, course management, and enrollment tracking.
            </p>
          </div>

          <div className="feature-grid">
            {[
              ['◉', 'Student profiles'],
              ['◎', 'Course catalog'],
              ['◈', 'Enrollment tracking'],
              ['◐', 'Dashboard overview'],
            ].map(([icon, text]) => (
              <div className="feature-chip" key={text}>
                <span className="feature-chip-icon">{icon}</span>
                <span className="feature-chip-label">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="login-right">
          <div className="login-card">
            <div className="login-header">
              <h1>Welcome back</h1>
              <p>Sign in to your admin account</p>
            </div>

            {error && <div className="alert">⚠ {error}</div>}

            <div className="form-field">
              <label className="form-label">Username</label>
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
              <label className="form-label">Password</label>
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
              {loading ? <><span className="spinner" /> Signing in...</> : 'Sign In →'}
            </button>

            <div className="divider" />
            <div className="hint">
              Default — <strong>Admin</strong> / <strong>admin@123</strong>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}