// ── Toast Notification ────────────────────────────────────────────────────────
export function Toast({ message, type = 'success', onClose }) {
  if (!message) return null;
  const isSuccess = type === 'success';
  return (
    <div style={{
      position: 'fixed', top: 20, right: 20, zIndex: 9999,
      background: isSuccess ? 'var(--ink-2)' : '#c0392b',
      color: 'var(--cream)',
      padding: '11px 16px', borderRadius: 8,
      boxShadow: '0 8px 32px rgba(15,14,13,0.18)',
      display: 'flex', alignItems: 'center', gap: 10,
      fontSize: 13, fontFamily: 'var(--font-body)',
      fontWeight: 500, letterSpacing: '-0.01em',
      animation: 'fadeIn 0.25s ease',
      maxWidth: 340,
    }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>
        {isSuccess ? '✓' : '✕'}
      </span>
      <span style={{ flex: 1 }}>{message}</span>
      <button onClick={onClose} style={{
        background: 'none', border: 'none',
        color: 'rgba(247,244,239,0.5)', cursor: 'pointer',
        fontSize: 16, lineHeight: 1, padding: '0 0 0 4px',
        fontFamily: 'var(--font-mono)',
      }}>×</button>
    </div>
  );
}

// ── Spinner ───────────────────────────────────────────────────────────────────
export function Spinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 64 }}>
      <div style={{
        width: 28, height: 28,
        border: '2px solid var(--border)',
        borderTop: '2px solid var(--ink)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
    </div>
  );
}

// ── Pagination ────────────────────────────────────────────────────────────────
export function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 4, marginTop: 16, flexWrap: 'wrap' }}>
      <PagBtn disabled={page === 0} onClick={() => onChange(page - 1)}>← Prev</PagBtn>
      {Array.from({ length: totalPages }, (_, i) => (
        <PagBtn key={i} active={i === page} onClick={() => onChange(i)}>{i + 1}</PagBtn>
      ))}
      <PagBtn disabled={page === totalPages - 1} onClick={() => onChange(page + 1)}>Next →</PagBtn>
    </div>
  );
}

function PagBtn({ children, active, disabled, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '5px 11px', borderRadius: 5, fontSize: 12,
        fontFamily: 'var(--font-mono)',
        border: active ? '1.5px solid var(--ink)' : '1.5px solid var(--border)',
        background: active ? 'var(--ink)' : 'var(--white)',
        color: active ? 'var(--cream)' : 'var(--ink-muted)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.35 : 1,
        fontWeight: active ? 600 : 400,
        letterSpacing: '0.01em',
        transition: 'all 0.13s',
      }}
    >{children}</button>
  );
}

// ── Badge ─────────────────────────────────────────────────────────────────────
export function Badge({ active }) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 9px', borderRadius: 3, fontSize: 10,
      fontFamily: 'var(--font-mono)',
      fontWeight: 500, letterSpacing: '0.08em',
      textTransform: 'uppercase',
      border: `1px solid ${active ? 'rgba(45,106,79,0.3)' : 'rgba(192,57,43,0.3)'}`,
      background: active ? 'rgba(45,106,79,0.07)' : 'rgba(192,57,43,0.06)',
      color: active ? '#2d6a4f' : '#c0392b',
    }}>
      {active ? 'Active' : 'Inactive'}
    </span>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────────
export function Modal({ title, children, onClose, width = 540 }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(15,14,13,0.5)',
        backdropFilter: 'blur(3px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--white)',
          borderRadius: 10,
          border: '1px solid var(--border)',
          width: '100%', maxWidth: width,
          boxShadow: '0 24px 64px rgba(15,14,13,0.2)',
          animation: 'slideUp 0.2s ease',
          maxHeight: '90vh', overflowY: 'auto',
        }}
      >
        <div style={{
          padding: '18px 22px 14px',
          borderBottom: '1px solid var(--border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <h3 style={{
            margin: 0, fontSize: 15, fontWeight: 600,
            fontFamily: 'var(--font-display)',
            color: 'var(--text)', letterSpacing: '-0.02em',
          }}>{title}</h3>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
            fontSize: 18, color: 'var(--ink-faint)', lineHeight: 1,
            padding: '2px 6px', borderRadius: 4,
            transition: 'color 0.13s',
          }}>×</button>
        </div>
        <div style={{ padding: '20px 22px' }}>{children}</div>
      </div>
    </div>
  );
}

// ── FormField ─────────────────────────────────────────────────────────────────
export function FormField({ label, error, children, required, style }) {
  return (
    <div style={{ marginBottom: 14, ...style }}>
      <label style={{
        display: 'block', fontSize: 11, fontWeight: 600,
        marginBottom: 5, color: 'var(--ink-muted)',
        fontFamily: 'var(--font-mono)',
        letterSpacing: '0.07em', textTransform: 'uppercase',
      }}>
        {label}{required && <span style={{ color: 'var(--red)', marginLeft: 3 }}>*</span>}
      </label>
      {children}
      {error && (
        <div style={{
          color: 'var(--red)', fontSize: 11, marginTop: 4,
          fontFamily: 'var(--font-mono)',
        }}>{error}</div>
      )}
    </div>
  );
}

const inputStyle = (error) => ({
  width: '100%', padding: '8px 11px', borderRadius: 6,
  border: `1.5px solid ${error ? 'var(--red)' : 'var(--border)'}`,
  background: 'var(--input-bg)', color: 'var(--text)',
  fontSize: 13, fontFamily: 'var(--font-body)', outline: 'none',
  boxSizing: 'border-box', transition: 'border-color 0.13s',
  letterSpacing: '-0.01em',
});

export function Input({ error, ...props }) {
  return <input {...props} style={inputStyle(error)} />;
}

export function Select({ error, children, ...props }) {
  return (
    <select {...props} style={inputStyle(error)}>{children}</select>
  );
}

export function Textarea({ error, ...props }) {
  return (
    <textarea {...props} style={{
      ...inputStyle(error),
      resize: 'vertical', minHeight: 90,
    }} />
  );
}

// ── Button ────────────────────────────────────────────────────────────────────
export function Btn({ children, variant = 'primary', size = 'md', disabled, loading, onClick, type = 'button', style: extra }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    borderRadius: 6, fontFamily: 'var(--font-body)',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    fontWeight: 500, transition: 'all 0.13s',
    opacity: disabled || loading ? 0.5 : 1,
    letterSpacing: '-0.01em',
    padding: size === 'sm' ? '5px 11px' : size === 'lg' ? '10px 20px' : '8px 16px',
    fontSize: size === 'sm' ? 12 : size === 'lg' ? 14 : 13,
  };
  const variants = {
    primary:   { background: 'var(--ink)', color: 'var(--cream)', border: '1.5px solid var(--ink)' },
    secondary: { background: 'var(--cream)', color: 'var(--ink)', border: '1.5px solid var(--border)' },
    danger:    { background: 'var(--red)', color: '#fff', border: '1.5px solid var(--red)' },
    ghost:     { background: 'transparent', color: 'var(--ink)', border: '1.5px solid var(--border)' },
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled || loading} style={{ ...base, ...variants[variant], ...extra }}>
      {loading ? (
        <span style={{
          display: 'inline-block', width: 12, height: 12,
          border: '2px solid rgba(255,255,255,0.3)',
          borderTop: '2px solid rgba(255,255,255,0.9)',
          borderRadius: '50%', animation: 'spin 0.6s linear infinite',
        }} />
      ) : null}
      {children}
    </button>
  );
}

// ── Empty State ───────────────────────────────────────────────────────────────
export function EmptyState({ icon = '—', title, subtitle }) {
  return (
    <div style={{ textAlign: 'center', padding: '56px 20px', color: 'var(--ink-faint)' }}>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 32, marginBottom: 14,
        color: 'var(--cream-deeper)',
      }}>{icon}</div>
      <div style={{
        fontSize: 14, fontWeight: 600,
        color: 'var(--ink-muted)',
        fontFamily: 'var(--font-display)',
        marginBottom: 6, letterSpacing: '-0.02em',
      }}>{title}</div>
      {subtitle && <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--ink-faint)' }}>{subtitle}</div>}
    </div>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────────
export function Card({ children, style }) {
  return (
    <div style={{
      background: 'var(--card)',
      borderRadius: 8,
      border: '1px solid var(--border)',
      boxShadow: '0 1px 4px rgba(15,14,13,0.04)',
      ...style,
    }}>{children}</div>
  );
}

export function CardHeader({ title, subtitle, action }) {
  return (
    <div style={{
      padding: '14px 20px',
      borderBottom: '1px solid var(--border)',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    }}>
      <div>
        <div style={{
          fontWeight: 600, fontSize: 13,
          fontFamily: 'var(--font-display)',
          color: 'var(--text)', letterSpacing: '-0.02em',
        }}>{title}</div>
        {subtitle && <div style={{
          fontSize: 11, color: 'var(--ink-faint)',
          marginTop: 2, fontFamily: 'var(--font-mono)',
        }}>{subtitle}</div>}
      </div>
      {action}
    </div>
  );
}