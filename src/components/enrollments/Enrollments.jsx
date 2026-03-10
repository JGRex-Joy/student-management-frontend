import { useState, useEffect } from 'react';
import { enrollmentsApi, studentsApi } from '../../api/client';
import { usePaginated, useFetch } from '../../hooks/useFetch';
import { Spinner, Pagination, Toast, Modal, Btn, EmptyState, Card, CardHeader } from '../common/UI';

function useIsMobile() {
  const [mobile, setMobile] = useState(window.innerWidth < 640);
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 640);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  return mobile;
}

export function Enrollments({ onNavigate }) {
  const { data, loading, error, page, setPage } = usePaginated(enrollmentsApi.list, 0, 8);
  const activeStudents = useFetch(() => studentsApi.all());
  const isMobile = useIsMobile();
  const [detailModal, setDetailModal] = useState(null);
  const [toast, setToast] = useState(null);

  const notify = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const activeIds = new Set((activeStudents.data ?? []).map(s => s.id));
  const filteredContent = data?.content?.filter(s =>
    activeStudents.loading || activeIds.has(s.studentId)
  ) ?? [];
  const isLoading = loading || activeStudents.loading;

  return (
    <>
      <Toast message={toast?.msg} type={toast?.type} onClose={() => setToast(null)} />

      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: 26, fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text)', margin: 0, letterSpacing: '-0.03em' }}>Enrollments</h1>
          <p style={{ color: 'var(--ink-faint)', margin: '6px 0 0', fontSize: 11, fontFamily: 'var(--font-mono)', letterSpacing: '0.02em' }}>
            {filteredContent.length > 0 ? filteredContent.length : data?.totalElements ?? 0} students enrolled
          </p>
        </div>
        <Btn onClick={() => onNavigate('enroll')}>+ Enroll</Btn>
      </div>

      <Card>
        <CardHeader title="Enrolled Students" />
        {isLoading ? <Spinner /> : error ? (
          <div style={{ padding: 24, color: 'var(--red)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>Error: {error}</div>
        ) : !filteredContent.length ? (
          <EmptyState icon="◎" title="No enrollments yet" subtitle="enroll a student to see them here" />
        ) : isMobile ? (
          /* Mobile cards */
          <div>
            {filteredContent.map((s) => (
              <div key={s.studentId} style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)' }}>{s.studentName}</div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 13, color: 'var(--green)' }}>
                    ${Number(s.totalFee || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-muted)', marginBottom: 8 }}>{s.email}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, border: '1px solid var(--border)', borderRadius: 4, padding: '2px 8px', color: 'var(--ink-muted)' }}>
                    {s.courseCount} {s.courseCount === 1 ? 'course' : 'courses'}
                  </span>
                  <Btn size="sm" variant="ghost" onClick={() => setDetailModal(s.studentId)}>View</Btn>
                </div>
              </div>
            ))}
            <div style={{ padding: '10px 16px' }}>
              <Pagination page={page} totalPages={data.totalPages} onChange={setPage} />
            </div>
          </div>
        ) : (
          /* Desktop table */
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: 'var(--cream)' }}>
                  {['#', 'Student Name', 'Email', 'Courses', 'Total Fee', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '10px 18px', textAlign: 'left', fontSize: 10, fontWeight: 500, fontFamily: 'var(--font-mono)', color: 'var(--ink-faint)', textTransform: 'uppercase', letterSpacing: '0.07em', borderBottom: '1px solid var(--border)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredContent.map((s) => (
                  <tr key={s.studentId} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px 18px', fontFamily: 'var(--font-mono)', color: 'var(--ink-faint)', fontSize: 11 }}>{String(s.studentId).padStart(3, '0')}</td>
                    <td style={{ padding: '12px 18px', fontWeight: 600, color: 'var(--text)' }}>{s.studentName}</td>
                    <td style={{ padding: '12px 18px', color: 'var(--ink-muted)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>{s.email}</td>
                    <td style={{ padding: '12px 18px' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, border: '1px solid var(--border)', borderRadius: 4, padding: '2px 8px', color: 'var(--ink-muted)' }}>
                        {s.courseCount} {s.courseCount === 1 ? 'course' : 'courses'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 18px', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--green)', fontSize: 12 }}>
                      ${Number(s.totalFee || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td style={{ padding: '12px 18px' }}>
                      <Btn size="sm" variant="ghost" onClick={() => setDetailModal(s.studentId)}>View</Btn>
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

      {detailModal && (
        <EnrollmentDetailModal studentId={detailModal} onClose={() => setDetailModal(null)} isMobile={isMobile} />
      )}
    </>
  );
}

function EnrollmentDetailModal({ studentId, onClose, isMobile }) {
  const { data, loading, error } = useFetch(() => enrollmentsApi.details(studentId), [studentId]);

  return (
    <Modal title="Enrollment Details" onClose={onClose} width={660}>
      {loading ? <Spinner /> : error ? (
        <div style={{ color: 'var(--red)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>Error loading details: {error}</div>
      ) : (
        <>
          <div style={{
            background: 'var(--cream)', borderRadius: 7, padding: '14px 18px', marginBottom: 20,
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr 1fr 1fr 1fr',
            gap: 12,
            border: '1px solid var(--border)',
          }}>
            <SummaryItem label="Student" value={data.studentName} />
            <SummaryItem label="Email" value={data.email} small />
            <SummaryItem label="Courses" value={data.courseCount} />
            <SummaryItem label="Total Fee" value={`$${Number(data.totalFee || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`} accent />
          </div>

          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-faint)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>Enrolled Courses</div>

          {isMobile ? (
            <div>
              {data.courseList?.map((c, i) => (
                <div key={c.id || i} style={{ padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text)', marginBottom: 4 }}>{c.courseName}</div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, border: '1px solid var(--border)', borderRadius: 3, padding: '2px 6px', color: 'var(--ink-muted)' }}>{c.courseCode}</span>
                    <span style={{ color: 'var(--ink-muted)', fontSize: 12 }}>{c.duration}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 12, marginLeft: 'auto' }}>${Number(c.fee).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ background: 'var(--cream)' }}>
                  {['Course Name', 'Code', 'Duration', 'Fee'].map(h => (
                    <th key={h} style={{ padding: '9px 14px', textAlign: 'left', fontSize: 10, fontWeight: 500, fontFamily: 'var(--font-mono)', color: 'var(--ink-faint)', textTransform: 'uppercase', letterSpacing: '0.07em', borderBottom: '1px solid var(--border)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.courseList?.map((c, i) => (
                  <tr key={c.id || i} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 600, color: 'var(--text)' }}>{c.courseName}</td>
                    <td style={{ padding: '10px 14px' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, border: '1px solid var(--border)', borderRadius: 3, padding: '2px 6px', color: 'var(--ink-muted)' }}>{c.courseCode}</span>
                    </td>
                    <td style={{ padding: '10px 14px', color: 'var(--ink-muted)' }}>{c.duration}</td>
                    <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', fontWeight: 500 }}>${Number(c.fee).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
            <Btn variant="secondary" onClick={onClose}>Close</Btn>
          </div>
        </>
      )}
    </Modal>
  );
}

function SummaryItem({ label, value, accent, small }) {
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--ink-faint)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: small ? 11 : 14, fontWeight: 700, fontFamily: small ? 'var(--font-mono)' : 'var(--font-body)', color: accent ? 'var(--green)' : 'var(--text)', letterSpacing: '-0.01em', wordBreak: 'break-all' }}>{value}</div>
    </div>
  );
}