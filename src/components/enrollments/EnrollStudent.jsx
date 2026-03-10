import { useState } from 'react';
import { studentsApi, coursesApi, enrollmentsApi } from '../../api/client';
import { useFetch } from '../../hooks/useFetch';
import { Spinner, Toast, FormField, Select, Btn, Card, CardHeader } from '../common/UI';

export function EnrollStudent({ onNavigate }) {
  const students = useFetch(() => studentsApi.all());
  const courses = useFetch(() => coursesApi.all());

  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedCourses, setSelectedCourses] = useState(new Set());
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});

  const notify = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  function toggleCourse(id) {
    setSelectedCourses(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function validate() {
    const e = {};
    if (!selectedStudent) e.student = 'Please select a student';
    if (selectedCourses.size === 0) e.courses = 'Select at least one course';
    return e;
  }

  async function submit() {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      await enrollmentsApi.enroll({
        studentId: Number(selectedStudent),
        courseIds: [...selectedCourses],
      });
      notify('Enrollment successful!');
      setSelectedStudent('');
      setSelectedCourses(new Set());
      setErrors({});
      setTimeout(() => onNavigate('enrollments'), 1500);
    } catch (e) {
      notify(e.message, 'error');
    } finally {
      setSaving(false);
    }
  }

  const loading = students.loading || courses.loading;

  const selectedStudentObj = students.data?.find(s => s.id === Number(selectedStudent));
  const selectedCoursesList = courses.data?.filter(c => selectedCourses.has(c.id)) ?? [];
  const totalFee = selectedCoursesList.reduce((sum, c) => sum + Number(c.fee || 0), 0);

  return (
    <>
      <Toast message={toast?.msg} type={toast?.type} onClose={() => setToast(null)} />

      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', margin: 0 }}>Enroll Student</h1>
        <p style={{ color: 'var(--text-muted)', margin: '4px 0 0', fontSize: 13 }}>
          Assign one or more courses to a student
        </p>
      </div>

      {loading ? <Spinner /> : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20, alignItems: 'start' }}>
          {/* Left: Course selection */}
          <Card>
            <CardHeader
              title="Select Courses"
              subtitle={`${courses.data?.length ?? 0} available`}
            />
            {errors.courses && (
              <div style={{ padding: '10px 20px 0', color: 'var(--red)', fontSize: 13 }}>⚠ {errors.courses}</div>
            )}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr style={{ background: 'var(--bg)' }}>
                    {['', 'Course Name', 'Code', 'Duration', 'Fee'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', borderBottom: '1px solid var(--border)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {courses.data?.map((c, i) => {
                    const checked = selectedCourses.has(c.id);
                    return (
                      <tr
                        key={c.id}
                        onClick={() => toggleCourse(c.id)}
                        style={{
                          cursor: 'pointer',
                          borderBottom: '1px solid var(--border)',
                          background: checked ? 'rgba(99,102,241,0.06)' : i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.015)',
                          transition: 'background 0.12s',
                        }}
                      >
                        <td style={{ padding: '12px 16px' }}>
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => {}}
                            style={{ width: 16, height: 16, accentColor: 'var(--accent)', cursor: 'pointer' }}
                          />
                        </td>
                        <td style={{ padding: '12px 16px', fontWeight: checked ? 700 : 500, color: 'var(--text)' }}>{c.courseName}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ background: 'rgba(99,102,241,0.1)', color: 'var(--accent)', padding: '2px 7px', borderRadius: 4, fontSize: 11, fontWeight: 700 }}>{c.courseCode}</span>
                        </td>
                        <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>{c.duration}</td>
                        <td style={{ padding: '12px 16px', fontWeight: 600 }}>
                          ₹{Number(c.fee).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Right: Student + Summary */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Card>
              <CardHeader title="Select Student" />
              <div style={{ padding: 18 }}>
                <FormField label="Student" error={errors.student} required>
                  <Select
                    value={selectedStudent}
                    onChange={e => { setSelectedStudent(e.target.value); setErrors(er => ({ ...er, student: null })); }}
                    error={errors.student}
                  >
                    <option value="">— Choose a student —</option>
                    {students.data?.map(s => (
                      <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.email})</option>
                    ))}
                  </Select>
                </FormField>

                {selectedStudentObj && (
                  <div style={{ background: 'var(--bg)', borderRadius: 8, padding: 12, marginTop: 4 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>
                      {selectedStudentObj.firstName} {selectedStudentObj.lastName}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{selectedStudentObj.email}</div>
                  </div>
                )}
              </div>
            </Card>

            <Card>
              <CardHeader title="Summary" />
              <div style={{ padding: 18 }}>
                <SummaryRow label="Courses Selected" value={selectedCourses.size} />
                <SummaryRow label="Total Fee" value={`₹${totalFee.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`} accent />

                {selectedCoursesList.length > 0 && (
                  <div style={{ marginTop: 14 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>Selected Courses</div>
                    {selectedCoursesList.map(c => (
                      <div key={c.id} style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '6px 0', borderBottom: '1px solid var(--border)', fontSize: 13,
                      }}>
                        <span style={{ color: 'var(--text)', fontWeight: 500 }}>{c.courseName}</span>
                        <span style={{ color: 'var(--text-muted)' }}>₹{Number(c.fee).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                  <Btn variant="secondary" style={{ flex: 1 }} onClick={() => onNavigate('enrollments')}>Cancel</Btn>
                  <Btn loading={saving} style={{ flex: 1 }} onClick={submit}>Enroll</Btn>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </>
  );
}

function SummaryRow({ label, value, accent }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 14 }}>
      <span style={{ color: 'var(--text-muted)' }}>{label}</span>
      <span style={{ fontWeight: 700, color: accent ? 'var(--green)' : 'var(--text)' }}>{value}</span>
    </div>
  );
}