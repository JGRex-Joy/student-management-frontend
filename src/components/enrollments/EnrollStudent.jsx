import { useState } from 'react';
import { studentsApi, coursesApi, enrollmentsApi } from '../../api/client';
import { useFetch } from '../../hooks/useFetch';
import { Spinner, Toast, FormField, Select, Btn, Card, CardHeader } from '../common/UI';

export function EnrollStudent({ onNavigate }) {
  const students = useFetch(() => studentsApi.all());
  const courses  = useFetch(() => coursesApi.all());

  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedCourses, setSelectedCourses] = useState(new Set());
  const [saving, setSaving]   = useState(false);
  const [toast, setToast]     = useState(null);
  const [errors, setErrors]   = useState({});

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

      <div style={{ marginBottom: 28 }}>
        <h1 style={{
          fontSize: 26, fontFamily: 'var(--font-display)', fontWeight: 700,
          color: 'var(--text)', margin: 0, letterSpacing: '-0.03em',
        }}>Enroll Student</h1>
        <p style={{ color: 'var(--ink-faint)', margin: '6px 0 0', fontSize: 11, fontFamily: 'var(--font-mono)', letterSpacing: '0.02em' }}>
          Assign one or more courses to a student
        </p>
      </div>

      {loading ? <Spinner /> : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 18, alignItems: 'start' }}>
          {/* Left: Course selection */}
          <Card>
            <CardHeader
              title="Select Courses"
              subtitle={`${courses.data?.length ?? 0} available`}
            />
            {errors.courses && (
              <div style={{ padding: '10px 18px 0', color: 'var(--red)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>
                ⚠ {errors.courses}
              </div>
            )}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: 'var(--cream)' }}>
                    {['', 'Course Name', 'Code', 'Duration', 'Fee'].map(h => (
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
                  {courses.data?.map((c) => {
                    const checked = selectedCourses.has(c.id);
                    return (
                      <tr
                        key={c.id}
                        onClick={() => toggleCourse(c.id)}
                        style={{
                          cursor: 'pointer',
                          borderBottom: '1px solid var(--border)',
                          background: checked ? 'rgba(15,14,13,0.03)' : 'transparent',
                          transition: 'background 0.1s',
                        }}
                      >
                        <td style={{ padding: '12px 18px', width: 40 }}>
                          <div style={{
                            width: 16, height: 16, borderRadius: 4,
                            border: `1.5px solid ${checked ? 'var(--ink)' : 'var(--border)'}`,
                            background: checked ? 'var(--ink)' : 'transparent',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.13s', flexShrink: 0,
                          }}>
                            {checked && (
                              <span style={{ color: 'var(--cream)', fontFamily: 'var(--font-mono)', fontSize: 10, lineHeight: 1 }}>✓</span>
                            )}
                          </div>
                        </td>
                        <td style={{ padding: '12px 18px', fontWeight: checked ? 600 : 400, color: 'var(--text)' }}>{c.courseName}</td>
                        <td style={{ padding: '12px 18px' }}>
                          <span style={{
                            fontFamily: 'var(--font-mono)', fontSize: 10,
                            border: '1px solid var(--border)', borderRadius: 3,
                            padding: '2px 7px', color: 'var(--ink-muted)',
                          }}>{c.courseCode}</span>
                        </td>
                        <td style={{ padding: '12px 18px', color: 'var(--ink-muted)' }}>{c.duration}</td>
                        <td style={{ padding: '12px 18px', fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 12 }}>
                          ₹{Number(c.fee).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Right */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Card>
              <CardHeader title="Select Student" />
              <div style={{ padding: 16 }}>
                <FormField label="Student" error={errors.student} required>
                  <Select
                    value={selectedStudent}
                    onChange={e => { setSelectedStudent(e.target.value); setErrors(er => ({ ...er, student: null })); }}
                    error={errors.student}
                  >
                    <option value="">— choose a student —</option>
                    {students.data?.map(s => (
                      <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>
                    ))}
                  </Select>
                </FormField>

                {selectedStudentObj && (
                  <div style={{
                    background: 'var(--cream)',
                    borderRadius: 6, padding: '10px 12px',
                    border: '1px solid var(--border)',
                    marginTop: -2,
                  }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text)' }}>
                      {selectedStudentObj.firstName} {selectedStudentObj.lastName}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--ink-faint)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>
                      {selectedStudentObj.email}
                    </div>
                  </div>
                )}
              </div>
            </Card>

            <Card>
              <CardHeader title="Summary" />
              <div style={{ padding: '12px 16px' }}>
                <SummaryRow label="Courses selected" value={selectedCourses.size} />
                <SummaryRow label="Total fee" value={`₹${totalFee.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`} accent />

                {selectedCoursesList.length > 0 && (
                  <div style={{ marginTop: 14 }}>
                    <div style={{
                      fontFamily: 'var(--font-mono)', fontSize: 9,
                      color: 'var(--ink-faint)', textTransform: 'uppercase',
                      letterSpacing: '0.08em', marginBottom: 8,
                    }}>Selected</div>
                    {selectedCoursesList.map(c => (
                      <div key={c.id} style={{
                        display: 'flex', justifyContent: 'space-between',
                        padding: '6px 0', borderBottom: '1px solid var(--border)', fontSize: 12,
                      }}>
                        <span style={{ color: 'var(--text)' }}>{c.courseName}</span>
                        <span style={{ color: 'var(--ink-muted)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>
                          ₹{Number(c.fee).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
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
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-faint)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
      <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', fontSize: 12, color: accent ? 'var(--green)' : 'var(--text)' }}>{value}</span>
    </div>
  );
}