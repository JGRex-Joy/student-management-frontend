import { useState } from 'react';

// ── Toast Notification ────────────────────────────────────────────────────────
export function Toast({ message, type = 'success', onClose }) {
  if (!message) return null;
  const bg = type === 'success' ? 'var(--green)' : 'var(--red)';
  return (
    <div style={{
      position: 'fixed', top: 24, right: 24, zIndex: 9999,
      background: bg, color: '#fff',
      padding: '12px 20px', borderRadius: 10,
      boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
      display: 'flex', alignItems: 'center', gap: 12,
      fontSize: 14, fontWeight: 500,
      animation: 'fadeInDown 0.3s ease',
    }}>
      <span>{type === 'success' ? '✓' : '✕'}</span>
      {message}
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}>×</button>
    </div>
  );
}

// ── Spinner ───────────────────────────────────────────────────────────────────
export function Spinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 60 }}>
      <div style={{
        width: 40, height: 40,
        border: '3px solid var(--border)',
        borderTop: '3px solid var(--accent)',
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
      }} />
    </div>
  );
}

// ── Pagination ────────────────────────────────────────────────────────────────
export function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, marginTop: 20, flexWrap: 'wrap' }}>
      <PagBtn disabled={page === 0} onClick={() => onChange(page - 1)}>‹ Prev</PagBtn>
      {Array.from({ length: totalPages }, (_, i) => (
        <PagBtn key={i} active={i === page} onClick={() => onChange(i)}>{i + 1}</PagBtn>
      ))}
      <PagBtn disabled={page === totalPages - 1} onClick={() => onChange(page + 1)}>Next ›</PagBtn>
    </div>
  );
}

function PagBtn({ children, active, disabled, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '6px 12px', borderRadius: 6, fontSize: 13,
        border: active ? '2px solid var(--accent)' : '1.5px solid var(--border)',
        background: active ? 'var(--accent)' : 'var(--card)',
        color: active ? '#fff' : 'var(--text)',
        cursor: disabled ? 'not-allowed', opacity: disabled ? 0.45 : 1,
        fontFamily: 'inherit', fontWeight: active ? 600 : 400,
        transition: 'all 0.15s',
      }}
    >{children}</button>
  );
}

// ── Badge ─────────────────────────────────────────────────────────────────────
export function Badge({ active }) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
      background: active ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.1)',
      color: active ? '#16a34a' : '#dc2626',
    }}>
      {active ? 'Active' : 'Inactive'}
    </span>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────────
export function Modal({ title, children, onClose, width = 560 }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(2px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--card)', borderRadius: 16,
          width: '100%', maxWidth: width,
          boxShadow: '0 24px 60px rgba(0,0,0,0.25)',
          animation: 'fadeInUp 0.2s ease',
          maxHeight: '90vh', overflowY: 'auto',
        }}
      >
        <div style={{
          padding: '20px 24px 16px',
          borderBottom: '1px solid var(--border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: 'var(--text)' }}>{title}</h3>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 22, color: 'var(--text-muted)', lineHeight: 1,
          }}>×</button>
        </div>
        <div style={{ padding: 24 }}>{children}</div>
      </div>
    </div>
  );
}

// ── FormField ─────────────────────────────────────────────────────────────────
export function FormField({ label, error, children, required }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--text-muted)' }}>
        {label}{required && <span style={{ color: 'var(--red)', marginLeft: 3 }}>*</span>}
      </label>
      {children}
      {error && <div style={{ color: 'var(--red)', fontSize: 12, marginTop: 4 }}>{error}</div>}
    </div>
  );
}

export function Input({ error, ...props }) {
  return (
    <input
      {...props}
      style={{
        width: '100%', padding: '9px 13px', borderRadius: 8,
        border: `1.5px solid ${error ? 'var(--red)' : 'var(--border)'}`,
        background: 'var(--input-bg)', color: 'var(--text)',
        fontSize: 14, fontFamily: 'inherit', outline: 'none',
        boxSizing: 'border-box',
        transition: 'border-color 0.15s',
      }}
    />
  );
}

export function Select({ error, children, ...props }) {
  return (
    <select
      {...props}
      style={{
        width: '100%', padding: '9px 13px', borderRadius: 8,
        border: `1.5px solid ${error ? 'var(--red)' : 'var(--border)'}`,
        background: 'var(--input-bg)', color: 'var(--text)',
        fontSize: 14, fontFamily: 'inherit', outline: 'none',
        boxSizing: 'border-box',
      }}
    >{children}</select>
  );
}

export function Textarea({ error, ...props }) {
  return (
    <textarea
      {...props}
      style={{
        width: '100%', padding: '9px 13px', borderRadius: 8,
        border: `1.5px solid ${error ? 'var(--red)' : 'var(--border)'}`,
        background: 'var(--input-bg)', color: 'var(--text)',
        fontSize: 14, fontFamily: 'inherit', outline: 'none',
        boxSizing: 'border-box', resize: 'vertical', minHeight: 100,
      }}
    />
  );
}

// ── Button ────────────────────────────────────────────────────────────────────
export function Btn({ children, variant = 'primary', size = 'md', disabled, loading, onClick, type = 'button', style: extra }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    borderRadius: 8, fontFamily: 'inherit', cursor: disabled || loading ? 'not-allowed' : 'pointer',
    fontWeight: 600, border: 'none', transition: 'all 0.15s',
    opacity: disabled || loading ? 0.6 : 1,
    padding: size === 'sm' ? '6px 12px' : size === 'lg' ? '11px 22px' : '9px 18px',
    fontSize: size === 'sm' ? 13 : size === 'lg' ? 15 : 14,
  };
  const variants = {
    primary: { background: 'var(--accent)', color: '#fff' },
    secondary: { background: 'var(--border)', color: 'var(--text)' },
    danger: { background: 'var(--red)', color: '#fff' },
    ghost: { background: 'transparent', color: 'var(--accent)', border: '1.5px solid var(--accent)' },
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled || loading} style={{ ...base, ...variants[variant], ...extra }}>
      {loading ? <span style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid rgba(255,255,255,0.4)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} /> : null}
      {children}
    </button>
  );
}

// ── Empty State ───────────────────────────────────────────────────────────────
export function EmptyState({ icon = '📭', title, subtitle }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>{title}</div>
      {subtitle && <div style={{ fontSize: 14 }}>{subtitle}</div>}
    </div>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────────
export function Card({ children, style }) {
  return (
    <div style={{
      background: 'var(--card)', borderRadius: 14,
      border: '1px solid var(--border)',
      boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      ...style,
    }}>{children}</div>
  );
}

export function CardHeader({ title, subtitle, action }) {
  return (
    <div style={{
      padding: '18px 22px', borderBottom: '1px solid var(--border)',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    }}>
      <div>
        <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--text)' }}>{title}</div>
        {subtitle && <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{subtitle}</div>}
      </div>
      {action}
    </div>
  );
}