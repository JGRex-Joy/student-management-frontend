import { useState } from 'react';

const NAV = [
  { icon: '⚡', label: 'Dashboard', view: 'dashboard' },
  { icon: '🎓', label: 'Students', view: 'students' },
  { icon: '📚', label: 'Courses', view: 'courses' },
  { icon: '📋', label: 'Enrollments', view: 'enrollments' },
  { icon: '➕', label: 'Enroll Student', view: 'enroll' },
];

export function Layout({ children, activeView, onNavigate }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? 240 : 0,
        minWidth: sidebarOpen ? 240 : 0,
        overflow: 'hidden',
        background: 'var(--sidebar-bg)',
        borderRight: '1px solid var(--sidebar-border)',
        transition: 'width 0.25s ease, min-width 0.25s ease',
        display: 'flex', flexDirection: 'column',
        flexShrink: 0,
      }}>
        {/* Brand */}
        <div style={{
          padding: '22px 20px 18px',
          borderBottom: '1px solid var(--sidebar-border)',
          display: 'flex', alignItems: 'center', gap: 10,
          whiteSpace: 'nowrap',
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'var(--accent)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0,
          }}>🏫</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--sidebar-text)', letterSpacing: 0.3 }}>SMS Admin</div>
            <div style={{ fontSize: 11, color: 'var(--sidebar-muted)' }}>Student Management</div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 10px' }}>
          {NAV.map(({ icon, label, view }) => (
            <NavItem
              key={view}
              icon={icon}
              label={label}
              active={activeView === view}
              onClick={() => onNavigate(view)}
            />
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: '12px 10px', borderTop: '1px solid var(--sidebar-border)' }}>
          <a href="/logout" style={{ textDecoration: 'none' }}>
            <NavItem icon="🚪" label="Logout" />
          </a>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Topbar */}
        <header style={{
          height: 58, background: 'var(--card)',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center',
          padding: '0 20px', gap: 14,
          position: 'sticky', top: 0, zIndex: 100,
        }}>
          <button
            onClick={() => setSidebarOpen(o => !o)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 20, color: 'var(--text-muted)', padding: '4px 8px', borderRadius: 6,
            }}
          >☰</button>
          <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)', textTransform: 'capitalize' }}>
            {NAV.find(n => n.view === activeView)?.label || 'Dashboard'}
          </span>
          <div style={{ flex: 1 }} />
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '6px 12px', borderRadius: 8,
            background: 'var(--bg)',
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: 'var(--accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, color: '#fff', fontWeight: 700,
            }}>A</div>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>Admin</span>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, padding: '24px 24px', overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 12px', borderRadius: 9, cursor: 'pointer',
        marginBottom: 2, whiteSpace: 'nowrap',
        background: active ? 'rgba(99,102,241,0.15)' : 'transparent',
        color: active ? 'var(--accent)' : 'var(--sidebar-text)',
        fontWeight: active ? 600 : 500, fontSize: 14,
        transition: 'all 0.15s',
        borderLeft: active ? '3px solid var(--accent)' : '3px solid transparent',
      }}
    >
      <span style={{ fontSize: 16, flexShrink: 0 }}>{icon}</span>
      <span>{label}</span>
    </div>
  );
}