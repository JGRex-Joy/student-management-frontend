import { useState } from 'react';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './components/dashboard/Dashboard';
import { Students } from './components/students/Students';
import { Courses } from './components/courses/Courses';
import { Enrollments } from './components/enrollments/Enrollments';
import { EnrollStudent } from './components/enrollments/EnrollStudent';
import { Login } from './components/login/Login';

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Mono:wght@300;400;500&family=Instrument+Sans:wght@400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; }

  :root {
    --cream: #f7f4ef;
    --cream-dark: #ede9e1;
    --cream-deeper: #e0dbd0;
    --ink: #0f0e0d;
    --ink-2: #1e1c1a;
    --ink-muted: #6b6560;
    --ink-faint: #b0aaa3;
    --white: #fdfcfa;
    --accent: #1e1c1a;
    --accent-hover: #0f0e0d;
    --green: #2d6a4f;
    --red: #c0392b;
    --border: #d8d2c8;
    --border-dark: #b0a898;
    --bg: var(--cream);
    --card: var(--white);
    --text: var(--ink);
    --text-muted: var(--ink-muted);
    --input-bg: var(--cream);
    --sidebar-bg: var(--ink-2);
    --sidebar-border: rgba(255,255,255,0.06);
    --sidebar-text: rgba(247,244,239,0.85);
    --sidebar-muted: rgba(247,244,239,0.38);
    --font-display: 'Playfair Display', Georgia, serif;
    --font-body: 'Instrument Sans', 'Segoe UI', system-ui, sans-serif;
    --font-mono: 'DM Mono', 'Courier New', monospace;
  }

  body {
    margin: 0;
    font-family: var(--font-body);
    background: var(--bg);
    color: var(--text);
    -webkit-font-smoothing: antialiased;
    letter-spacing: -0.01em;
  }

  input:focus, select:focus, textarea:focus {
    border-color: var(--ink) !important;
    box-shadow: 0 0 0 2px rgba(15,14,13,0.08);
    outline: none;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--cream-deeper); border-radius: 10px; }
`;

export default function App() {
  const [view, setView] = useState('dashboard');
  const [page, setPage] = useState('login');

  if (page === 'login') {
    return (
      <>
        <style>{GLOBAL_CSS}</style>
        <Login onSuccess={() => setPage('app')} />
      </>
    );
  }

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <Layout activeView={view} onNavigate={setView} onLogout={() => setPage('login')}>
        {view === 'dashboard'   && <Dashboard />}
        {view === 'students'    && <Students />}
        {view === 'courses'     && <Courses />}
        {view === 'enrollments' && <Enrollments onNavigate={setView} />}
        {view === 'enroll'      && <EnrollStudent onNavigate={setView} />}
      </Layout>
    </>
  );
}