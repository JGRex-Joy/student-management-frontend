import { useState } from 'react';
import { studentsApi } from '../../api/client';
import { usePaginated } from '../../hooks/useFetch';
import {
  Spinner, Pagination, Badge, Toast, Modal, FormField,
  Input, Textarea, Select, Btn, EmptyState, Card, CardHeader,
} from '../common/UI';

const EMPTY_FORM = { firstName: '', lastName: '', email: '', phoneNumber: '', address: '', active: true };

function validate(f) {
  const e = {};
  if (!f.firstName.trim()) e.firstName = 'First name is required';
  if (!f.lastName.trim())  e.lastName  = 'Last name is required';
  if (!f.email.trim())     e.email     = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = 'Invalid email';
  return e;
}

export function Students() {
  const { data, loading, error, page, setPage, refetch } = usePaginated(studentsApi.list, 0, 8);
  const [toast, setToast]           = useState(null);
  const [modal, setModal]           = useState(null);
  const [form, setForm]             = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving]         = useState(false);
  const [editId, setEditId]         = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting]     = useState(false);

  const notify = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  function openCreate() { setForm(EMPTY_FORM); setFormErrors({}); setEditId(null); setModal('create'); }
  function openEdit(s)  { setForm({ ...s }); setFormErrors({}); setEditId(s.id); setModal('edit'); }
  function openView(s)  { setForm({ ...s }); setModal('view'); }
  const change = f => e => setForm(p => ({ ...p, [f]: e.target.value }));

  async function save() {
    const errs = validate(form);
    if (Object.keys(errs).length) { setFormErrors(errs); return; }
    setSaving(true);
    try {
      if (editId) {
        await studentsApi.update(editId, form);
        notify('Student updated');
      } else {
        await studentsApi.create(form);
        notify('Student created');
      }
      setModal(null);
      refetch();
    } catch (e) {
      notify(e.message, 'error');
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await studentsApi.delete(deleteTarget.id);
      notify(`${deleteTarget.name} deleted`);
      setDeleteTarget(null);
      refetch();
    } catch (e) {
      notify(e.message, 'error');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <Toast message={toast?.msg} type={toast?.type} onClose={() => setToast(null)} />

      <div style={{ marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{
            fontSize: 26, fontFamily: 'var(--font-display)', fontWeight: 700,
            color: 'var(--text)', margin: 0, letterSpacing: '-0.03em',
          }}>Students</h1>
          <p style={{ color: 'var(--ink-faint)', margin: '6px 0 0', fontSize: 11, fontFamily: 'var(--font-mono)', letterSpacing: '0.02em' }}>
            {data?.totalElements ?? 0} total registered
          </p>
        </div>
        <Btn onClick={openCreate}>+ Add Student</Btn>
      </div>

      <Card>
        <CardHeader title="Student List" />
        {loading ? <Spinner /> : error ? (
          <div style={{ padding: 24, color: 'var(--red)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>Error: {error}</div>
        ) : !data?.content?.length ? (
          <EmptyState icon="◉" title="No students yet" subtitle="add your first student to get started" />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: 'var(--cream)' }}>
                  {['#', 'Name', 'Email', 'Phone', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{
                      padding: '10px 18px', textAlign: 'left',
                      fontSize: 10, fontWeight: 500,
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--ink-faint)',
                      textTransform: 'uppercase', letterSpacing: '0.07em',
                      borderBottom: '1px solid var(--border)',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.content.map((s) => (
                  <tr key={s.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px 18px', fontFamily: 'var(--font-mono)', color: 'var(--ink-faint)', fontSize: 11 }}>
                      {String(s.id).padStart(3, '0')}
                    </td>
                    <td style={{ padding: '12px 18px', fontWeight: 600, color: 'var(--text)' }}>
                      {s.firstName} {s.lastName}
                    </td>
                    <td style={{ padding: '12px 18px', color: 'var(--ink-muted)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>{s.email}</td>
                    <td style={{ padding: '12px 18px', color: 'var(--ink-muted)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>
                      {s.phoneNumber || '—'}
                    </td>
                    <td style={{ padding: '12px 18px' }}><Badge active={s.active} /></td>
                    <td style={{ padding: '12px 18px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <Btn size="sm" variant="ghost"     onClick={() => openView(s)}>View</Btn>
                        <Btn size="sm" variant="secondary" onClick={() => openEdit(s)}>Edit</Btn>
                        <Btn size="sm" variant="danger"    onClick={() => setDeleteTarget({ id: s.id, name: `${s.firstName} ${s.lastName}` })}>Delete</Btn>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ padding: '10px 18px' }}>
              <Pagination page={page} totalPages={data.totalPages} onChange={setPage} />
            </div>
          </div>
        )}
      </Card>

      {(modal === 'create' || modal === 'edit') && (
        <Modal title={modal === 'create' ? 'Add New Student' : 'Edit Student'} onClose={() => setModal(null)}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FormField label="First Name" error={formErrors.firstName} required>
              <Input value={form.firstName} onChange={change('firstName')} error={formErrors.firstName} placeholder="John" />
            </FormField>
            <FormField label="Last Name" error={formErrors.lastName} required>
              <Input value={form.lastName} onChange={change('lastName')} error={formErrors.lastName} placeholder="Doe" />
            </FormField>
          </div>
          <FormField label="Email" error={formErrors.email} required>
            <Input type="email" value={form.email} onChange={change('email')} error={formErrors.email} placeholder="john@example.com" />
          </FormField>
          <FormField label="Phone">
            <Input value={form.phoneNumber || ''} onChange={change('phoneNumber')} placeholder="+1 234 567 8900" />
          </FormField>
          <FormField label="Address">
            <Textarea value={form.address || ''} onChange={change('address')} placeholder="Full address..." />
          </FormField>
          {modal === 'edit' && (
            <FormField label="Status">
              <Select value={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.value === 'true' }))}>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </Select>
            </FormField>
          )}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 10 }}>
            <Btn variant="secondary" onClick={() => setModal(null)}>Cancel</Btn>
            <Btn loading={saving} onClick={save}>{modal === 'create' ? 'Create Student' : 'Save Changes'}</Btn>
          </div>
        </Modal>
      )}

      {modal === 'view' && (
        <Modal title="Student Details" onClose={() => setModal(null)}>
          <DetailRow label="Full Name" value={`${form.firstName} ${form.lastName}`} />
          <DetailRow label="Email"     value={form.email} mono />
          <DetailRow label="Phone"     value={form.phoneNumber || '—'} mono />
          <DetailRow label="Address"   value={form.address || '—'} />
          <DetailRow label="Status"    value={<Badge active={form.active} />} />
          <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Btn variant="secondary" onClick={() => setModal(null)}>Close</Btn>
            <Btn onClick={() => openEdit(form)}>Edit</Btn>
          </div>
        </Modal>
      )}

      {deleteTarget && (
        <Modal title="Delete Student" onClose={() => setDeleteTarget(null)} width={420}>
          <p style={{ fontSize: 14, color: 'var(--ink-muted)', marginBottom: 8 }}>
            Delete <strong style={{ color: 'var(--text)' }}>{deleteTarget.name}</strong>?
          </p>
          <p style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--ink-faint)', marginBottom: 22 }}>
            All enrollment records for this student will also be removed.
          </p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Btn variant="secondary" onClick={() => setDeleteTarget(null)}>Cancel</Btn>
            <Btn variant="danger" loading={deleting} onClick={confirmDelete}>Delete</Btn>
          </div>
        </Modal>
      )}
    </>
  );
}

function DetailRow({ label, value, mono }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: 13,
    }}>
      <span style={{
        fontFamily: 'var(--font-mono)', fontSize: 10,
        color: 'var(--ink-faint)', letterSpacing: '0.06em',
        textTransform: 'uppercase',
      }}>{label}</span>
      <span style={{
        color: 'var(--text)', fontWeight: 500,
        fontFamily: mono ? 'var(--font-mono)' : 'var(--font-body)',
        fontSize: mono ? 12 : 13,
      }}>{value}</span>
    </div>
  );
}