import { useState } from 'react';
import { enrollmentsApi } from '../../api/client';
import { usePaginated, useFetch } from '../../hooks/useFetch';
import { Spinner, Pagination, Toast, Modal, Btn, EmptyState, Card, CardHeader } from '../common/UI';

export function Enrollments({ onNavigate }) {
  const { data, loading, error, page, setPage } = usePaginated(enrollmentsApi.list, 0, 8);
  const [detailModal, setDetailModal] = useState(null); // studentId
  const [toast, setToast] = useState(null);

  const notify = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <>
      <Toast message={toast?.msg} type={toast?.type} onClose={() => setToast(null)} />

      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', margin: 0 }}>Enrollments</h1>
          <p style={{ color: 'var(--text-muted)', margin: '4px 0 0', fontSize: 13 }}>
            {data?.totalElements ?? 0} students enrolled in courses
          </p>
        </div>
        <Btn onClick={() => onNavigate('enroll')}>+ Enroll Student</Btn>
      </div>

      <Card>
        <CardHeader title="Enrolled Students" />
        {loading ? <Spinner /> : error ? (
          <div style={{ padding: 24, color: 'var(--red)' }}>Error: {error}</div>
        ) : !data?.content?.length ? (
          <EmptyState icon="📋" title="No enrollments yet" subtitle="Enroll a student to a course to see them here" />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: 'var(--bg)' }}>
                  {['#', 'Student Name', 'Email', 'Courses', 'Total Fee', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.4, borderBottom: '1px solid var(--border)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.content.map((s, i) => (
                  <tr key={s.studentId} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.015)' }}>
                    <td style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: 13 }}>#{s.studentId}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text)' }}>{s.studentName}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>{s.email}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        background: 'rgba(99,102,241,0.1)', color: 'var(--accent)',
                        padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700,
                      }}>{s.courseCount} {s.courseCount === 1 ? 'course' : 'courses'}</span>
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--green)' }}>
                      ₹{Number(s.totalFee || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <Btn size="sm" variant="ghost" onClick={() => setDetailModal(s.studentId)}>View Details</Btn>
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

      {detailModal && (
        <EnrollmentDetailModal studentId={detailModal} onClose={() => setDetailModal(null)} />
      )}
    </>
  );
}

function EnrollmentDetailModal({ studentId, onClose }) {
  const { data, loading, error } = useFetch(() => enrollmentsApi.details(studentId), [studentId]);

  return (
    <Modal title="Enrollment Details" onClose={onClose} width={680}>
      {loading ? <Spinner /> : error ? (
        <div style={{ color: 'var(--red)' }}>Error loading details: {error}</div>
      ) : (
        <>
          {/* Student Summary */}
          <div style={{
            background: 'var(--bg)', borderRadius: 10, padding: '16px 18px',
            marginBottom: 20, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12,
          }}>
            <SummaryItem label="Student" value={data.studentName} />
            <SummaryItem label="Email" value={data.email} />
            <SummaryItem label="Total Courses" value={data.courseCount} />
            <SummaryItem label="Total Fee" value={`₹${Number(data.totalFee || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`} accent />
          </div>

          {/* Course Table */}
          <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text)', marginBottom: 10 }}>Enrolled Courses</div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--bg)' }}>
                {['Course Name', 'Code', 'Duration', 'Fee'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', borderBottom: '1px solid var(--border)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.courseList?.map((c, i) => (
                <tr key={c.id || i} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600, color: 'var(--text)' }}>{c.courseName}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{ background: 'rgba(99,102,241,0.1)', color: 'var(--accent)', padding: '2px 7px', borderRadius: 4, fontSize: 11, fontWeight: 700 }}>{c.courseCode}</span>
                  </td>
                  <td style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>{c.duration}</td>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>₹{Number(c.fee).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
            <Btn variant="secondary" onClick={onClose}>Close</Btn>
          </div>
        </>
      )}
    </Modal>
  );
}

function SummaryItem({ label, value, accent }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: 700, color: accent ? 'var(--green)' : 'var(--text)' }}>{value}</div>
    </div>
  );
}