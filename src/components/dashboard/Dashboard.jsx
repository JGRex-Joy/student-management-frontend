import { useFetch } from '../../hooks/useFetch';
import { studentsApi, coursesApi, enrollmentsApi } from '../../api/client';
import { Spinner } from '../common/UI';

export function Dashboard() {
  const students = useFetch(() => studentsApi.list(0, 1));
  const courses = useFetch(() => coursesApi.list(0, 1));
  const enrolled = useFetch(() => enrollmentsApi.list(0, 1));

  const loading = students.loading || courses.loading || enrolled.loading;

  const stats = [
    {
      label: 'Total Students',
      value: students.data?.totalElements ?? '—',
      icon: '🎓',
      color: '#6366f1',
      bg: 'rgba(99,102,241,0.1)',
    },
    {
      label: 'Active Courses',
      value: courses.data?.totalElements ?? '—',
      icon: '📚',
      color: '#0ea5e9',
      bg: 'rgba(14,165,233,0.1)',
    },
    {
      label: 'Enrolled Students',
      value: enrolled.data?.totalElements ?? '—',
      icon: '✅',
      color: '#10b981',
      bg: 'rgba(16,185,129,0.1)',
    },
    {
      label: 'Total Pages (Students)',
      value: students.data?.totalPages ?? '—',
      icon: '📄',
      color: '#f59e0b',
      bg: 'rgba(245,158,11,0.1)',
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', margin: 0 }}>Dashboard</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: 4, fontSize: 14 }}>
          Welcome back, Admin. Here's what's happening.
        </p>
      </div>

      {loading ? <Spinner /> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 18, marginBottom: 32 }}>
          {stats.map(s => <StatCard key={s.label} {...s} />)}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <InfoCard title="Quick Start Guide" icon="🚀">
          <ul style={{ paddingLeft: 18, lineHeight: 2, fontSize: 14, color: 'var(--text-muted)', margin: 0 }}>
            <li>Add <strong>Students</strong> via the sidebar</li>
            <li>Create <strong>Courses</strong> with fees & durations</li>
            <li>Go to <strong>Enroll Student</strong> to assign courses</li>
            <li>View all enrollments under <strong>Enrollments</strong></li>
          </ul>
        </InfoCard>
        <InfoCard title="System Info" icon="⚙️">
          <Row label="Backend" value="Spring Boot 3 + JPA" />
          <Row label="Database" value="MySQL" />
          <Row label="Security" value="Spring Security + CSRF" />
          <Row label="Auth" value="Form Login (BCrypt)" />
          <Row label="Frontend" value="React 18 (SPA)" />
        </InfoCard>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color, bg }) {
  return (
    <div style={{
      background: 'var(--card)', borderRadius: 14,
      border: '1px solid var(--border)',
      padding: '20px 22px',
      display: 'flex', alignItems: 'center', gap: 16,
    }}>
      <div style={{
        width: 50, height: 50, borderRadius: 12,
        background: bg, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        fontSize: 22, flexShrink: 0,
      }}>{icon}</div>
      <div>
        <div style={{ fontSize: 28, fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{label}</div>
      </div>
    </div>
  );
}

function InfoCard({ title, icon, children }) {
  return (
    <div style={{
      background: 'var(--card)', borderRadius: 14,
      border: '1px solid var(--border)', overflow: 'hidden',
    }}>
      <div style={{
        padding: '14px 20px', borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 8,
        fontWeight: 700, fontSize: 14, color: 'var(--text)',
      }}>
        <span>{icon}</span>{title}
      </div>
      <div style={{ padding: '16px 20px' }}>{children}</div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, padding: '5px 0', borderBottom: '1px solid var(--border)' }}>
      <span style={{ color: 'var(--text-muted)' }}>{label}</span>
      <span style={{ fontWeight: 600, color: 'var(--text)' }}>{value}</span>
    </div>
  );
}