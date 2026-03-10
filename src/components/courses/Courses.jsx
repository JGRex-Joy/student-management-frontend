import { useState, useEffect } from 'react';
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
  if (!f.duration.trim())   e.duration   = 'Duration is required';
  if (!f.fee) e.fee = 'Fee is required';
  else if (isNaN(Number(f.fee)) || Number(f.fee) < 0) e.fee = 'Invalid fee';
  return e;
}

function useIsMobile() {
  const [mobile, setMobile] = useState(window.innerWidth < 640);
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 640);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  return mobile;
}

export function Courses() {
  const { data, loading, error, page, setPage, refetch } = usePaginated(coursesApi.list, 0, 8);
  const isMobile = useIsMobile();
  const [toast, setToast]           = useState(null);
  const [modal, setModal]           = useState(null);
  const [form, setForm]             = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving]         = useState(false);
  const [editId, setEditId]         = useState(null);

  const notify = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  function openCreate() { setForm(EMPTY_FORM); setFormErrors({}); setEditId(null); setModal('create'); }
  function openEdit(c)  { setForm({ ...c, fee: c.fee?.toString() }); setFormErrors({}); setEditId(c.id); setModal('edit'); }
  function openView(c)  { setForm({ ...c }); setModal('view'); }
  const change = f => e => setForm(p => ({ ...p, [f]: e.target.value }));

  async function save() {
    const errs = validate(form);
    if (Object.keys(errs).length) { setFormErrors(errs); return; }
    setSaving(true);
    try {
      const payload = { ...form, fee: parseFloat(form.fee) };
      if (editId) {
        await coursesApi.update(editId, payload);
        notify('Course updated');
      } else {
        await coursesApi.create(payload);
        notify('Course created');
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

      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: 26, fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text)', margin: 0, letterSpacing: '-0.03em' }}>Courses</h1>
          <p style={{ color: 'var(--ink-faint)', margin: '6px 0 0', fontSize: 11, fontFamily: 'var(--font-mono)', letterSpacing: '0.02em' }}>
            {data?.totalElements ?? 0} active courses
          </p>
        </div>
        <Btn onClick={openCreate}>+ Add Course</Btn>
      </div>

      <Card>
        <CardHeader title="Course List" />
        {loading ? <Spinner /> : error ? (
          <div style={{ padding: 24, color: 'var(--red)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>Error: {error}</div>
        ) : !data?.content?.length ? (
          <EmptyState icon="◎" title="No courses yet" subtitle="create your first course" />
        ) : isMobile ? (
          <div>
            {data.content.map((c) => (
              <div key={c.id} style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)' }}>{c.courseName}</div>
                  <Badge active={c.active} />
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, border: '1px solid var(--border)', borderRadius: 3, padding: '2px 7px', color: 'var(--ink-muted)' }}>{c.courseCode}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-muted)' }}>{c.duration}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 12, color: 'var(--text)' }}>
                    ${Number(c.fee).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <Btn size="sm" variant="ghost"     onClick={() => openView(c)}>View</Btn>
                  <Btn size="sm" variant="secondary" onClick={() => openEdit(c)}>Edit</Btn>
                </div>
              </div>
            ))}
            <div style={{ padding: '10px 16px' }}>
              <Pagination page={page} totalPages={data.totalPages} onChange={setPage} />
            </div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: 'var(--cream)' }}>
                  {['#', 'Course Name', 'Code', 'Duration', 'Fee', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '10px 18px', textAlign: 'left', fontSize: 10, fontWeight: 500, fontFamily: 'var(--font-mono)', color: 'var(--ink-faint)', textTransform: 'uppercase', letterSpacing: '0.07em', borderBottom: '1px solid var(--border)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.content.map((c) => (
                  <tr key={c.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px 18px', fontFamily: 'var(--font-mono)', color: 'var(--ink-faint)', fontSize: 11 }}>{String(c.id).padStart(3, '0')}</td>
                    <td style={{ padding: '12px 18px', fontWeight: 600, color: 'var(--text)' }}>{c.courseName}</td>
                    <td style={{ padding: '12px 18px' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, border: '1px solid var(--border)', borderRadius: 3, padding: '2px 7px', color: 'var(--ink-muted)' }}>{c.courseCode}</span>
                    </td>
                    <td style={{ padding: '12px 18px', color: 'var(--ink-muted)' }}>{c.duration}</td>
                    <td style={{ padding: '12px 18px', fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 12 }}>${Number(c.fee).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td style={{ padding: '12px 18px' }}><Badge active={c.active} /></td>
                    <td style={{ padding: '12px 18px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <Btn size="sm" variant="ghost"     onClick={() => openView(c)}>View</Btn>
                        <Btn size="sm" variant="secondary" onClick={() => openEdit(c)}>Edit</Btn>
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
        <Modal title={modal === 'create' ? 'Add New Course' : 'Edit Course'} onClose={() => setModal(null)}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12 }}>
            <FormField label="Course Name" error={formErrors.courseName} required style={{ gridColumn: isMobile ? '1' : '1/-1' }}>
              <Input value={form.courseName} onChange={change('courseName')} error={formErrors.courseName} placeholder="e.g. Web Development" />
            </FormField>
            <FormField label="Course Code" error={formErrors.courseCode} required>
              <Input value={form.courseCode} onChange={change('courseCode')} error={formErrors.courseCode} placeholder="WEB101" />
            </FormField>
            <FormField label="Duration" error={formErrors.duration} required>
              <Input value={form.duration} onChange={change('duration')} error={formErrors.duration} placeholder="6 Months" />
            </FormField>
          </div>
          <FormField label="Course Fee ($)" error={formErrors.fee} required>
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
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 10 }}>
            <Btn variant="secondary" onClick={() => setModal(null)}>Cancel</Btn>
            <Btn loading={saving} onClick={save}>{modal === 'create' ? 'Create Course' : 'Save Changes'}</Btn>
          </div>
        </Modal>
      )}

      {modal === 'view' && (
        <Modal title="Course Details" onClose={() => setModal(null)}>
          <DetailRow label="Course Name" value={form.courseName} />
          <DetailRow label="Code"     value={form.courseCode} mono />
          <DetailRow label="Duration" value={form.duration} />
          <DetailRow label="Fee"      value={`$${Number(form.fee).toLocaleString('en-US', { minimumFractionDigits: 2 })}`} mono />
          <DetailRow label="Status"   value={<Badge active={form.active} />} />
          {form.description && (
            <div style={{ marginTop: 16 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-faint)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Description</div>
              <div style={{ fontSize: 13, color: 'var(--ink-muted)', lineHeight: 1.6 }}>{form.description}</div>
            </div>
          )}
          <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Btn variant="secondary" onClick={() => setModal(null)}>Close</Btn>
            <Btn onClick={() => openEdit(form)}>Edit</Btn>
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
      padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: 13, gap: 12,
    }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-faint)', letterSpacing: '0.06em', textTransform: 'uppercase', flexShrink: 0 }}>{label}</span>
      <span style={{ color: 'var(--text)', fontWeight: 500, fontFamily: mono ? 'var(--font-mono)' : 'var(--font-body)', fontSize: mono ? 12 : 13, textAlign: 'right' }}>{value}</span>
    </div>
  );
}