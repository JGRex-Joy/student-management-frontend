import { useState, useEffect } from 'react';

const NAV = [
  { icon: '◈', label: 'Dashboard',     view: 'dashboard' },
  { icon: '◉', label: 'Students',      view: 'students' },
  { icon: '◎', label: 'Courses',       view: 'courses' },
  { icon: '◐', label: 'Enrollments',   view: 'enrollments' },
  { icon: '+', label: 'Enroll Student',view: 'enroll' },
];

export function Layout({ children, activeView, onNavigate, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Close sidebar on mobile when navigating
  function handleNavigate(view) {
    onNavigate(view);
    if (isMobile) setSidebarOpen(false);
  }

  async function handleLogout() {
    try {
      await fetch('/logout', { method: 'POST', credentials: 'include' });
    } catch (_) {}
    onLogout();
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)', position: 'relative' }}>

      {/* Mobile overlay backdrop */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 200,
            background: 'rgba(15,14,13,0.45)',
            backdropFilter: 'blur(2px)',
          }}
        />
      )}

      {/* Sidebar */}
      <aside style={{
        width: 220,
        background: 'var(--sidebar-bg)',
        borderRight: '1px solid var(--sidebar-border)',
        display: 'flex', flexDirection: 'column',
        flexShrink: 0,
        // Desktop: static in flow; Mobile: fixed overlay
        ...(isMobile ? {
          position: 'fixed',
          top: 0, left: 0, bottom: 0,
          zIndex: 300,
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.25s cubic-bezier(0.4,0,0.2,1)',
          boxShadow: sidebarOpen ? '4px 0 24px rgba(15,14,13,0.25)' : 'none',
        } : {
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
          minWidth: sidebarOpen ? 220 : 0,
          width: sidebarOpen ? 220 : 0,
          transition: 'width 0.22s ease, min-width 0.22s ease',
        }),
      }}>
        {/* Brand */}
        <div style={{
          padding: '28px 22px 22px',
          borderBottom: '1px solid var(--sidebar-border)',
          whiteSpace: 'nowrap',
        }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 17, fontWeight: 700,
            color: 'var(--sidebar-text)',
            letterSpacing: '-0.02em', lineHeight: 1.2,
          }}>SMS</div>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10, color: 'var(--sidebar-muted)',
            marginTop: 4, letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}>Admin Panel</div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
          {NAV.map(({ icon, label, view }) => (
            <NavItem
              key={view}
              icon={icon}
              label={label}
              active={activeView === view}
              onClick={() => handleNavigate(view)}
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
          padding: '0 16px', gap: 12,
          position: 'sticky', top: 0, zIndex: 100,
        }}>
          <button
            onClick={() => setSidebarOpen(o => !o)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--ink-muted)',
              padding: '4px 6px', borderRadius: 4,
              fontFamily: 'var(--font-mono)',
              fontSize: 18, lineHeight: 1,
              transition: 'color 0.15s',
              flexShrink: 0,
            }}
          >☰</button>

          <span style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 600, fontSize: 15,
            color: 'var(--text)',
            letterSpacing: '-0.02em',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {NAV.find(n => n.view === activeView)?.label || 'Dashboard'}
          </span>

          <div style={{ flex: 1 }} />

          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '4px 8px 4px 4px',
            borderRadius: 6,
            border: '1px solid var(--border)',
            background: 'var(--cream)',
            flexShrink: 0,
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
              // Hide on very small screens
              display: isMobile ? 'none' : 'inline',
            }}>Admin</span>
          </div>
        </header>

        {/* Content */}
        <main style={{
          flex: 1,
          padding: isMobile ? '18px 14px' : '28px 28px',
          overflowY: 'auto',
        }}>
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
        width: 16, flexShrink: 0,
      }}>{icon}</span>
      <span>{label}</span>
    </div>
  );
}