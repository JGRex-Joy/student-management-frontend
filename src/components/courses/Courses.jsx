import { useState } from 'react';
import { coursesApi } from '../../api/client';
import { usePaginated } from '../../hooks/useFetch';
import {
  Spinner, Pagination, Badge, Toast, Modal, FormField,
  Input, Textarea, Select, Btn, EmptyState, Card, CardHeader,
} from '../common/UI';

const EMPTY_FORM = { courseName: '', courseCode: '', duration: '', fee: '', description: '', active: true };

function validate(f) {
  const e = {};
  if (!f.courseName.trim()) e.courseName = 'Course name is required';
  if (!f.courseCode.trim()) e.courseCode = 'Course code is required';
  if (!f.duration.trim()) e.duration = 'Duration is required';
  if (!f.fee) e.fee = 'Fee is required';
  else if (isNaN(Number(f.fee)) || Number(f.fee) < 0) e.fee = 'Invalid fee';
  return e;
}

export function Courses() {
  const { data, loading, error, page, setPage, refetch } = usePaginated(coursesApi.list, 0, 8);
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState(null);

  const notify = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  function openCreate() { setForm(EMPTY_FORM); setFormErrors({}); setEditId(null); setModal('create'); }
  function openEdit(c) { setForm({ ...c, fee: c.fee?.toString() }); setFormErrors({}); setEditId(c.id); setModal('edit'); }
  function openView(c) { setForm({ ...c }); setModal('view'); }
  const change = f => e => setForm(prev => ({ ...prev, [f]: e.target.value }));

  async function save() {
    const errs = validate(form);
    if (Object.keys(errs).length) { setFormErrors(errs); return; }
    setSaving(true);
    try {
      const payload = { ...form, fee: parseFloat(form.fee) };
      if (editId) {
        await coursesApi.update(editId, payload);
        notify('Course updated successfully');
      } else {
        await coursesApi.create(payload);
        notify('Course created successfully');
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
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', margin: 0 }}>Courses</h1>
          <p style={{ color: 'var(--text-muted)', margin: '4px 0 0', fontSize: 13 }}>
            {data?.totalElements ?? 0} active courses available
          </p>
        </div>
        <Btn onClick={openCreate}>+ Add Course</Btn>
      </div>

      <Card>
        <CardHeader title="Course List" />
        {loading ? <Spinner /> : error ? (
          <div style={{ padding: 24, color: 'var(--red)' }}>Error: {error}</div>
        ) : !data?.content?.length ? (
          <EmptyState icon="📚" title="No courses yet" subtitle="Create your first course" />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: 'var(--bg)' }}>
                  {['ID', 'Course Name', 'Code', 'Duration', 'Fee', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.4, borderBottom: '1px solid var(--border)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.content.map((c, i) => (
                  <tr key={c.id} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.015)' }}>
                    <td style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: 13 }}>#{c.id}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text)' }}>{c.courseName}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        background: 'rgba(99,102,241,0.1)', color: 'var(--accent)',
                        padding: '3px 8px', borderRadius: 5, fontSize: 12, fontWeight: 700,
                      }}>{c.courseCode}</span>
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>{c.duration}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text)' }}>
                      ₹{Number(c.fee).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td style={{ padding: '12px 16px' }}><Badge active={c.active} /></td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <Btn size="sm" variant="ghost" onClick={() => openView(c)}>View</Btn>
                        <Btn size="sm" variant="secondary" onClick={() => openEdit(c)}>Edit</Btn>
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

      {(modal === 'create' || modal === 'edit') && (
        <Modal title={modal === 'create' ? 'Add New Course' : 'Edit Course'} onClose={() => setModal(null)}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FormField label="Course Name" error={formErrors.courseName} required style={{ gridColumn: '1/-1' }}>
              <Input value={form.courseName} onChange={change('courseName')} error={formErrors.courseName} placeholder="e.g. Web Development" />
            </FormField>
            <FormField label="Course Code" error={formErrors.courseCode} required>
              <Input value={form.courseCode} onChange={change('courseCode')} error={formErrors.courseCode} placeholder="WEB101" />
            </FormField>
            <FormField label="Duration" error={formErrors.duration} required>
              <Input value={form.duration} onChange={change('duration')} error={formErrors.duration} placeholder="6 Months" />
            </FormField>
          </div>
          <FormField label="Course Fee (₹)" error={formErrors.fee} required>
            <Input type="number" step="0.01" min="0" value={form.fee} onChange={change('fee')} error={formErrors.fee} placeholder="1200.00" />
          </FormField>
          <FormField label="Description">
            <Textarea value={form.description || ''} onChange={change('description')} placeholder="Course description..." />
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
            <Btn loading={saving} onClick={save}>{modal === 'create' ? 'Create Course' : 'Save Changes'}</Btn>
          </div>
        </Modal>
      )}

      {modal === 'view' && (
        <Modal title="Course Details" onClose={() => setModal(null)}>
          <DetailRow label="Course Name" value={form.courseName} />
          <DetailRow label="Code" value={<code style={{ background: 'var(--bg)', padding: '2px 8px', borderRadius: 4 }}>{form.courseCode}</code>} />
          <DetailRow label="Duration" value={form.duration} />
          <DetailRow label="Fee" value={`₹${Number(form.fee).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`} />
          <DetailRow label="Status" value={<Badge active={form.active} />} />
          {form.description && (
            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 700, marginBottom: 6, textTransform: 'uppercase' }}>Description</div>
              <div style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.6 }}>{form.description}</div>
            </div>
          )}
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