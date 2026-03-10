import { useState } from 'react';

const NAV = [
  { icon: '◈', label: 'Dashboard',     view: 'dashboard' },
  { icon: '◉', label: 'Students',      view: 'students' },
  { icon: '◎', label: 'Courses',       view: 'courses' },
  { icon: '◐', label: 'Enrollments',   view: 'enrollments' },
  { icon: '+', label: 'Enroll Student',view: 'enroll' },
];

export function Layout({ children, activeView, onNavigate, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // FIX: was calling fetch('/logout') but not triggering onLogout correctly.
  // Now POSTs to /logout, then calls onLogout() to reset app state to login page.
  async function handleLogout() {
    try {
      await fetch('/logout', { method: 'POST', credentials: 'include' });
    } catch (_) {
      // even if request fails, clear local session state
    }
    onLogout();
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? 220 : 0,
        minWidth: sidebarOpen ? 220 : 0,
        overflow: 'hidden',
        background: 'var(--sidebar-bg)',
        borderRight: '1px solid var(--sidebar-border)',
        transition: 'width 0.22s ease, min-width 0.22s ease',
        display: 'flex', flexDirection: 'column',
        flexShrink: 0,
      }}>
        {/* Brand */}
        <div style={{
          padding: '28px 22px 22px',
          borderBottom: '1px solid var(--sidebar-border)',
          whiteSpace: 'nowrap',
        }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 17,
            fontWeight: 700,
            color: 'var(--sidebar-text)',
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
          }}>
            SMS
          </div>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            color: 'var(--sidebar-muted)',
            marginTop: 4,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}>
            Admin Panel
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px' }}>
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
        <div style={{ padding: '12px 12px 20px', borderTop: '1px solid var(--sidebar-border)' }}>
          <NavItem icon="→" label="Sign out" onClick={handleLogout} />
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Topbar */}
        <header style={{
          height: 54,
          background: 'var(--white)',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center',
          padding: '0 24px', gap: 14,
          position: 'sticky', top: 0, zIndex: 100,
        }}>
          <button
            onClick={() => setSidebarOpen(o => !o)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--ink-muted)',
              padding: '4px 6px', borderRadius: 4,
              fontFamily: 'var(--font-mono)',
              fontSize: 16, lineHeight: 1,
              transition: 'color 0.15s',
            }}
          >☰</button>

          <span style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 600, fontSize: 15,
            color: 'var(--text)',
            letterSpacing: '-0.02em',
          }}>
            {NAV.find(n => n.view === activeView)?.label || 'Dashboard'}
          </span>

          <div style={{ flex: 1 }} />

          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '5px 10px 5px 5px',
            borderRadius: 6,
            border: '1px solid var(--border)',
            background: 'var(--cream)',
          }}>
            <div style={{
              width: 26, height: 26, borderRadius: '50%',
              background: 'var(--ink)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-mono)',
              fontSize: 11, color: 'var(--cream)', fontWeight: 500,
            }}>A</div>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 12, color: 'var(--ink-muted)',
              letterSpacing: '0.02em',
            }}>Admin</span>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, padding: '28px 28px', overflowY: 'auto' }}>
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
        padding: '9px 10px', borderRadius: 6, cursor: 'pointer',
        marginBottom: 1, whiteSpace: 'nowrap',
        background: active ? 'rgba(247,244,239,0.1)' : 'transparent',
        color: active ? 'rgba(247,244,239,0.95)' : 'var(--sidebar-text)',
        fontWeight: active ? 600 : 400,
        fontSize: 13,
        transition: 'all 0.13s',
        fontFamily: 'var(--font-body)',
        borderLeft: active ? '2px solid rgba(247,244,239,0.5)' : '2px solid transparent',
        letterSpacing: '-0.01em',
      }}
    >
      <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: active ? 14 : 13,
        opacity: active ? 1 : 0.5,
        width: 16,
        flexShrink: 0,
      }}>{icon}</span>
      <span>{label}</span>
    </div>
  );
}