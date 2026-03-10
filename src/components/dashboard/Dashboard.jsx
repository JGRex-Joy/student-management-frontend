import { useFetch } from '../../hooks/useFetch';
import { studentsApi, coursesApi, enrollmentsApi } from '../../api/client';
import { Spinner } from '../common/UI';

export function Dashboard() {
  const students = useFetch(() => studentsApi.list(0, 1));
  const courses  = useFetch(() => coursesApi.list(0, 1));
  const enrolled = useFetch(() => enrollmentsApi.list(0, 1));

  const loading = students.loading || courses.loading || enrolled.loading;

  const stats = [
    {
      label: 'Students',
      value: students.data?.totalElements ?? '—',
      sub: 'total registered',
      symbol: '◉',
    },
    {
      label: 'Courses',
      value: courses.data?.totalElements ?? '—',
      sub: 'active courses',
      symbol: '◎',
    },
    {
      label: 'Enrolled',
      value: enrolled.data?.totalElements ?? '—',
      sub: 'students in courses',
      symbol: '◈',
    },
    {
      label: 'Coverage',
      value: (students.data?.totalElements && enrolled.data?.totalElements)
        ? `${Math.round((enrolled.data.totalElements / students.data.totalElements) * 100)}%`
        : '—',
      sub: 'enrollment rate',
      symbol: '◐',
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{
          fontSize: 26,
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          color: 'var(--text)',
          margin: 0,
          letterSpacing: '-0.03em',
          lineHeight: 1.2,
        }}>
          Dashboard
        </h1>
        <p style={{
          color: 'var(--ink-muted)', marginTop: 6, fontSize: 12,
          fontFamily: 'var(--font-mono)', letterSpacing: '0.02em',
        }}>
          Overview — {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {loading ? <Spinner /> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}>
          {stats.map(s => <StatCard key={s.label} {...s} />)}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <InfoCard title="Quick Start">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {[
              ['01', 'Add Students via the sidebar'],
              ['02', 'Create Courses with fees & durations'],
              ['03', 'Go to Enroll Student to assign courses'],
              ['04', 'View all enrollments under Enrollments'],
            ].map(([num, text]) => (
              <div key={num} style={{
                display: 'flex', alignItems: 'flex-start', gap: 14,
                padding: '10px 0',
                borderBottom: '1px solid var(--border)',
              }}>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 10,
                  color: 'var(--ink-faint)', letterSpacing: '0.05em',
                  paddingTop: 2, flexShrink: 0,
                }}>{num}</span>
                <span style={{ fontSize: 13, color: 'var(--ink-muted)' }}>{text}</span>
              </div>
            ))}
          </div>
        </InfoCard>

        <InfoCard title="System">
          {[
            ['Backend',   'Spring Boot 3 + JPA'],
            ['Database',  'MySQL'],
            ['Security',  'Spring Security + CSRF'],
            ['Auth',      'Form Login (BCrypt)'],
            ['Frontend',  'React 18 (SPA)'],
          ].map(([label, value]) => (
            <div key={label} style={{
              display: 'flex', justifyContent: 'space-between',
              padding: '9px 0', borderBottom: '1px solid var(--border)',
            }}>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: 11,
                color: 'var(--ink-faint)', letterSpacing: '0.04em',
              }}>{label}</span>
              <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--ink-muted)' }}>{value}</span>
            </div>
          ))}
        </InfoCard>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, symbol }) {
  return (
    <div style={{
      background: 'var(--white)',
      borderRadius: 8,
      border: '1px solid var(--border)',
      padding: '20px 20px',
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'flex-start', marginBottom: 14,
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 10,
          color: 'var(--ink-faint)', letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}>{label}</span>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 14, color: 'var(--cream-deeper)',
        }}>{symbol}</span>
      </div>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 34, fontWeight: 700,
        color: 'var(--ink)', lineHeight: 1,
        letterSpacing: '-0.04em',
        marginBottom: 6,
      }}>{value}</div>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 10,
        color: 'var(--ink-faint)', letterSpacing: '0.04em',
      }}>{sub}</div>
    </div>
  );
}

function InfoCard({ title, children }) {
  return (
    <div style={{
      background: 'var(--white)',
      borderRadius: 8,
      border: '1px solid var(--border)',
      overflow: 'hidden',
    }}>
      <div style={{
        padding: '12px 18px',
        borderBottom: '1px solid var(--border)',
        fontFamily: 'var(--font-mono)',
        fontSize: 10, fontWeight: 500,
        color: 'var(--ink-muted)',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
      }}>
        {title}
      </div>
      <div style={{ padding: '4px 18px 14px' }}>{children}</div>
    </div>
  );
}