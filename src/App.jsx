import { useState } from 'react';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './components/dashboard/Dashboard';
import { Students } from './components/students/Students';
import { Courses } from './components/courses/Courses';
import { Enrollments } from './components/enrollments/Enrollments';
import { EnrollStudent } from './components/enrollments/EnrollStudent';

const GLOBAL_CSS = `
  *, *::before, *::after { box-sizing: border-box; }

  :root {
    --accent: #6366f1;
    --accent-hover: #4f46e5;
    --green: #10b981;
    --red: #ef4444;
    --bg: #f5f6fa;
    --card: #ffffff;
    --border: #e8eaed;
    --text: #1a1d23;
    --text-muted: #6b7280;
    --input-bg: #f9fafb;
    --sidebar-bg: #16181e;
    --sidebar-border: rgba(255,255,255,0.07);
    --sidebar-text: rgba(255,255,255,0.78);
    --sidebar-muted: rgba(255,255,255,0.4);
  }

  body {
    margin: 0;
    font-family: 'DM Sans', 'Segoe UI', system-ui, sans-serif;
    background: var(--bg);
    color: var(--text);
    -webkit-font-smoothing: antialiased;
  }

  input:focus, select:focus, textarea:focus {
    border-color: var(--accent) !important;
    box-shadow: 0 0 0 3px rgba(99,102,241,0.15);
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes fadeInDown {
    from { opacity: 0; transform: translateY(-12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 10px; }
`;

export default function App() {
  const [view, setView] = useState('dashboard');

  const navigate = (v) => setView(v);

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <Layout activeView={view} onNavigate={navigate}>
        {view === 'dashboard'   && <Dashboard />}
        {view === 'students'    && <Students />}
        {view === 'courses'     && <Courses />}
        {view === 'enrollments' && <Enrollments onNavigate={navigate} />}
        {view === 'enroll'      && <EnrollStudent onNavigate={navigate} />}
      </Layout>
    </>
  );
}