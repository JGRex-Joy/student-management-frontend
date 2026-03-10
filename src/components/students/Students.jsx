import { useState } from 'react';
import { studentsApi } from '../../api/client';
import { usePaginated } from '../../hooks/useFetch';
import {
  Spinner, Pagination, Badge, Toast, Modal, FormField,
  Input, Textarea, Select, Btn, EmptyState, Card, CardHeader,
} from '../common/UI';

const EMPTY_FORM = { firstName: '', lastName: '', email: '', phoneNumber: '', address: '', active: true };

function validate(f, editId) {
  const e = {};
  if (!f.firstName.trim()) e.firstName = 'First name is required';
  if (!f.lastName.trim()) e.lastName = 'Last name is required';
  if (!f.email.trim()) e.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = 'Invalid email';
  return e;
}

export function Students() {
  const { data, loading, error, page, setPage, refetch } = usePaginated(studentsApi.list, 0, 8);
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState(null); // null | 'create' | 'edit' | 'view'
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState(null);

  const notify = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  function openCreate() {
    setForm(EMPTY_FORM);
    setFormErrors({});
    setEditId(null);
    setModal('create');
  }

  function openEdit(student) {
    setForm({ ...student });
    setFormErrors({});
    setEditId(student.id);
    setModal('edit');
  }

  function openView(student) {
    setForm({ ...student });
    setModal('view');
  }

  function change(field) {
    return e => setForm(f => ({ ...f, [field]: e.target.value }));
  }

  async function save() {
    const errs = validate(form);
    if (Object.keys(errs).length) { setFormErrors(errs); return; }
    setSaving(true);
    try {
      if (editId) {
        await studentsApi.update(editId, form);
        notify('Student updated successfully');
      } else {
        await studentsApi.create(form);
        notify('Student created successfully');
      }
      setModal(null);
      refetch();
    } catch (e) {
      notify(e.message, 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Toast message={toast?.msg} type={toast?.type} onClose={() => setToast(null)} />

      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', margin: 0 }}>Students</h1>
          <p style={{ color: 'var(--text-muted)', margin: '4px 0 0', fontSize: 13 }}>
            {data?.totalElements ?? 0} total students registered
          </p>
        </div>
        <Btn onClick={openCreate}>+ Add Student</Btn>
      </div>

      <Card>
        <CardHeader title="Student List" />
        {loading ? <Spinner /> : error ? (
          <div style={{ padding: 24, color: 'var(--red)' }}>Error: {error}</div>
        ) : !data?.content?.length ? (
          <EmptyState icon="🎓" title="No students yet" subtitle="Add your first student to get started" />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: 'var(--bg)' }}>
                  {['ID', 'Name', 'Email', 'Phone', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.4, borderBottom: '1px solid var(--border)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.content.map((s, i) => (
                  <tr key={s.id} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.015)' }}>
                    <td style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: 13 }}>#{s.id}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text)' }}>{s.firstName} {s.lastName}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>{s.email}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>{s.phoneNumber || '—'}</td>
                    <td style={{ padding: '12px 16px' }}><Badge active={s.active} /></td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <Btn size="sm" variant="ghost" onClick={() => openView(s)}>View</Btn>
                        <Btn size="sm" variant="secondary" onClick={() => openEdit(s)}>Edit</Btn>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ padding: '12px 16px' }}>
              <Pagination page={page} totalPages={data.totalPages} onChange={setPage} />
            </div>
          </div>
        )}
      </Card>

      {/* Create / Edit Modal */}
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
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
            <Btn variant="secondary" onClick={() => setModal(null)}>Cancel</Btn>
            <Btn loading={saving} onClick={save}>{modal === 'create' ? 'Create Student' : 'Save Changes'}</Btn>
          </div>
        </Modal>
      )}

      {/* View Modal */}
      {modal === 'view' && (
        <Modal title="Student Details" onClose={() => setModal(null)}>
          <DetailRow label="Full Name" value={`${form.firstName} ${form.lastName}`} />
          <DetailRow label="Email" value={form.email} />
          <DetailRow label="Phone" value={form.phoneNumber || '—'} />
          <DetailRow label="Address" value={form.address || '—'} />
          <DetailRow label="Status" value={<Badge active={form.active} />} />
          <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <Btn variant="secondary" onClick={() => setModal(null)}>Close</Btn>
            <Btn onClick={() => openEdit(form)}>Edit</Btn>
          </div>
        </Modal>
      )}
    </>
  );
}

function DetailRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: 14 }}>
      <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>{label}</span>
      <span style={{ color: 'var(--text)', fontWeight: 600 }}>{value}</span>
    </div>
  );
}