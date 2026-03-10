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
      color: '#2d6a4f',
      bg: 'rgba(45,106,79,0.06)',
    },
    {
      label: 'Courses',
      value: courses.data?.totalElements ?? '—',
      sub: 'active courses',
      symbol: '◎',
      color: '#1e4d8c',
      bg: 'rgba(30,77,140,0.06)',
    },
    {
      label: 'Enrolled',
      value: enrolled.data?.totalElements ?? '—',
      sub: 'students in courses',
      symbol: '◈',
      color: '#7c3d12',
      bg: 'rgba(124,61,18,0.06)',
    },
    {
      label: 'Coverage',
      value: (students.data?.totalElements && enrolled.data?.totalElements)
        ? `${Math.round((enrolled.data.totalElements / students.data.totalElements) * 100)}%`
        : '—',
      sub: 'enrollment rate',
      symbol: '◐',
      color: '#5b2d8e',
      bg: 'rgba(91,45,142,0.06)',
    },
  ];

  const steps = [
    { num: '01', title: 'Register Students', desc: 'Add student profiles with contact info and status tracking.' },
    { num: '02', title: 'Create Courses', desc: 'Define courses with codes, durations, fees, and descriptions.' },
    { num: '03', title: 'Enroll Students', desc: 'Assign one or more courses to any registered student.' },
    { num: '04', title: 'Track Enrollments', desc: 'View all active enrollments, fees, and course details.' },
    { num: '05', title: 'Manage Records', desc: 'Edit, deactivate, or delete students and courses as needed.' },
    { num: '06', title: 'Monitor Coverage', desc: 'Use the dashboard to track enrollment rates at a glance.' },
  ];

  return (
    <div>
      {/* Header */}
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

      {/* Stats */}
      {loading ? <Spinner /> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}>
          {stats.map(s => <StatCard key={s.label} {...s} />)}
        </div>
      )}

      {/* Bottom section — 2 cols */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

        {/* Quick Start — expanded */}
        <div style={{
          background: 'var(--white)',
          borderRadius: 8,
          border: '1px solid var(--border)',
          overflow: 'hidden',
        }}>
          <div style={{
            padding: '14px 20px',
            borderBottom: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div>
              <div style={{
                fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14,
                color: 'var(--text)', letterSpacing: '-0.02em',
              }}>Getting Started</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-faint)', marginTop: 2 }}>
                how to use this system
              </div>
            </div>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 18,
              color: 'var(--cream-deeper)',
            }}>◈</span>
          </div>
          <div style={{ padding: '6px 20px 18px' }}>
            {steps.map(({ num, title, desc }) => (
              <div key={num} style={{
                display: 'flex', gap: 16, padding: '12px 0',
                borderBottom: '1px solid var(--border)',
              }}>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 10,
                  color: 'var(--ink-faint)', letterSpacing: '0.05em',
                  paddingTop: 2, flexShrink: 0, width: 20,
                }}>{num}</div>
                <div>
                  <div style={{
                    fontSize: 13, fontWeight: 600,
                    color: 'var(--text)', letterSpacing: '-0.01em', marginBottom: 2,
                  }}>{title}</div>
                  <div style={{
                    fontSize: 11, color: 'var(--ink-muted)',
                    fontFamily: 'var(--font-mono)', lineHeight: 1.5,
                  }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right col — Tips + Status */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Pro tips */}
          <div style={{
            background: 'var(--ink-2)',
            borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.06)',
            overflow: 'hidden',
            flex: 1,
          }}>
            <div style={{
              padding: '14px 20px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{
                fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14,
                color: 'rgba(247,244,239,0.9)', letterSpacing: '-0.02em',
              }}>Tips & Notes</div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 16, color: 'rgba(247,244,239,0.2)' }}>◉</span>
            </div>
            <div style={{ padding: '6px 20px 18px' }}>
              {[
                { icon: '→', tip: 'Duplicate course codes are blocked automatically.' },
                { icon: '→', tip: 'Deleting a student removes all their enrollments too.' },
                { icon: '→', tip: 'A student can be enrolled in multiple courses at once.' },
                { icon: '→', tip: 'Inactive students and courses are hidden from lists.' },
                { icon: '→', tip: 'Enrollment skips courses the student already has.' },
              ].map(({ icon, tip }, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 12, padding: '10px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  alignItems: 'flex-start',
                }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 11,
                    color: 'rgba(247,244,239,0.25)', flexShrink: 0, paddingTop: 1,
                  }}>{icon}</span>
                  <span style={{
                    fontSize: 12, color: 'rgba(247,244,239,0.55)',
                    fontFamily: 'var(--font-mono)', lineHeight: 1.55,
                  }}>{tip}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stack info — compact */}
          <div style={{
            background: 'var(--white)',
            borderRadius: 8,
            border: '1px solid var(--border)',
            padding: '14px 20px',
          }}>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 9,
              color: 'var(--ink-faint)', textTransform: 'uppercase',
              letterSpacing: '0.1em', marginBottom: 12,
            }}>Tech Stack</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {['Spring Boot 3', 'JPA / Hibernate', 'MySQL', 'BCrypt Auth', 'React 18', 'Vite'].map(tag => (
                <span key={tag} style={{
                  fontFamily: 'var(--font-mono)', fontSize: 10,
                  border: '1px solid var(--border)',
                  borderRadius: 4, padding: '4px 9px',
                  color: 'var(--ink-muted)',
                  letterSpacing: '0.02em',
                }}>{tag}</span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, symbol, color, bg }) {
  return (
    <div style={{
      background: 'var(--white)',
      borderRadius: 8,
      border: '1px solid var(--border)',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Subtle color tint top bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: color, opacity: 0.35, borderRadius: '8px 8px 0 0',
      }} />
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
          fontSize: 14,
          color: color,
          opacity: 0.4,
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