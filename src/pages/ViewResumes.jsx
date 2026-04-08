import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function StatusBadge({ status }) {
  const map = {
    Accepted: { bg: '#f0fdf4', color: '#16a34a', icon: '✅' },
    Rejected:  { bg: '#fef2f2', color: '#b91c1c', icon: '❌' },
    Pending:   { bg: '#fef9c3', color: '#854d0e', icon: '⏳' },
  };
  const s = map[status] || map['Pending'];
  return (
    <span style={{ background: s.bg, color: s.color, fontSize: '0.75rem',
      fontWeight: 700, padding: '0.25rem 0.7rem', borderRadius: 999 }}>
      {s.icon} {status || 'Pending'}
    </span>
  );
}

export default function ViewResumes() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    if (!user || (user.role !== 'Admin' && user.role !== 'Recruiter')) {
      navigate('/login');
    }
  }, []);

  const fetchResumes = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/resume/all');
      setResumes(Array.isArray(data) ? data : []);
    } catch (err) {
      setAlert({ type: 'error', msg: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchResumes(); }, []);

  const handleAccept = async (id) => {
    setActionLoading(id + '-accept');
    try {
      await api.put(`/resume/${id}/accept`);
      setAlert({ type: 'success', msg: 'Resume accepted!' });
      fetchResumes();
    } catch (err) {
      setAlert({ type: 'error', msg: err.message });
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    setActionLoading(id + '-reject');
    try {
      await api.put(`/resume/${id}/reject`);
      setAlert({ type: 'success', msg: 'Resume rejected.' });
      fetchResumes();
    } catch (err) {
      setAlert({ type: 'error', msg: err.message });
    } finally {
      setActionLoading(null);
    }
  };

  // ✅ Open resume in new tab
  const handleView = (id) => {
    window.open(`http://localhost:8080/api/resume/view/${id}`, '_blank');
  };

  const filtered = filter === 'All' ? resumes : resumes.filter(r => (r.status || 'Pending') === filter);
  const counts = {
    All:      resumes.length,
    Pending:  resumes.filter(r => (r.status || 'Pending') === 'Pending').length,
    Accepted: resumes.filter(r => r.status === 'Accepted').length,
    Rejected: resumes.filter(r => r.status === 'Rejected').length,
  };

  return (
    <div className="page">
      {/* Header */}
      <div style={{ background: 'white', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ padding: '1.75rem 2rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                Viewing as <strong style={{ color: 'var(--primary)' }}>{user?.role}</strong>
              </div>
              <h1 className="page-title">Resume Applications</h1>
              <p className="page-subtitle">Review, open and manage candidate resumes</p>
            </div>
            <button className="btn btn-outline btn-sm" onClick={fetchResumes}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="page-body">
        <div className="container">

          {/* Alert */}
          {alert && (
            <div className={`alert alert-${alert.type}`} style={{ marginBottom: '1.5rem' }}>
              {alert.msg}
              <button onClick={() => setAlert(null)}
                style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }}>×</button>
            </div>
          )}

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
            {[
              { label: 'Total',    value: counts.All,      color: '#1d4ed8', bg: '#eff6ff' },
              { label: 'Pending',  value: counts.Pending,  color: '#854d0e', bg: '#fef9c3' },
              { label: 'Accepted', value: counts.Accepted, color: '#16a34a', bg: '#f0fdf4' },
              { label: 'Rejected', value: counts.Rejected, color: '#b91c1c', bg: '#fef2f2' },
            ].map((s) => (
              <div key={s.label} style={{
                background: 'white', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)', padding: '1.25rem',
                boxShadow: 'var(--shadow-sm)',
              }}>
                <div style={{ fontSize: '1.75rem', fontFamily: 'var(--font-display)', color: s.color, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{s.label} Resumes</div>
              </div>
            ))}
          </div>

          {/* Filter Tabs */}
          <div style={{ display: 'flex', gap: '0.25rem', borderBottom: '1px solid var(--border)', marginBottom: '1.5rem' }}>
            {['All', 'Pending', 'Accepted', 'Rejected'].map((f) => (
              <button key={f} onClick={() => setFilter(f)} style={{
                background: 'none', border: 'none',
                borderBottom: filter === f ? '2px solid var(--primary)' : '2px solid transparent',
                color: filter === f ? 'var(--primary)' : 'var(--text-secondary)',
                fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.875rem',
                padding: '0.75rem 1rem', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '0.4rem',
              }}>
                {f}
                <span style={{
                  background: filter === f ? 'var(--primary-light)' : 'var(--surface-hover)',
                  color: filter === f ? 'var(--primary)' : 'var(--text-muted)',
                  fontSize: '0.75rem', fontWeight: 700,
                  padding: '0.1rem 0.45rem', borderRadius: 999,
                }}>
                  {counts[f]}
                </span>
              </button>
            ))}
          </div>

          {/* Loading */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
              <span className="spinner spinner-dark" style={{ width: 28, height: 28 }} />
              <div style={{ marginTop: '1rem' }}>Loading resumes…</div>
            </div>
          )}

          {/* Empty */}
          {!loading && filtered.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">
                <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="empty-state-title">No Resumes Found</div>
              <div className="empty-state-desc">
                {filter === 'All' ? 'No resumes uploaded yet.' : `No ${filter.toLowerCase()} resumes.`}
              </div>
            </div>
          )}

          {/* Resume Cards */}
          {!loading && filtered.length > 0 && (
            <div className="cards-grid">
              {filtered.map((resume, idx) => (
                <div className="card" key={resume.id ?? idx}>
                  <div className="card-header-stripe" />
                  <div className="card-body">
                    {/* File Info */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem', marginBottom: '1rem' }}>
                      <div style={{
                        width: 48, height: 48, borderRadius: 'var(--radius-sm)',
                        background: '#eff6ff', color: 'var(--primary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {resume.fileName || 'resume.pdf'}
                        </div>
                        <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                          Candidate ID: #{resume.userId || 'N/A'} · Resume #{resume.id}
                        </div>
                      </div>
                    </div>

                    {/* Status */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <StatusBadge status={resume.status || 'Pending'} />
                    </div>

                    {/* ✅ VIEW RESUME BUTTON */}
                    <button
                      className="btn btn-outline"
                      style={{ width: '100%', justifyContent: 'center', gap: '0.5rem' }}
                      onClick={() => handleView(resume.id)}
                    >
                      <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Open Resume
                    </button>
                  </div>

                  {/* Accept / Reject */}
                  {(resume.status === 'Pending' || !resume.status) && (
                    <div className="card-footer" style={{ gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button
                        className="btn btn-sm"
                        style={{ background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca', fontWeight: 700 }}
                        disabled={actionLoading === resume.id + '-reject'}
                        onClick={() => handleReject(resume.id)}
                      >
                        {actionLoading === resume.id + '-reject'
                          ? <span className="spinner" style={{ width: 12, height: 12 }} />
                          : '❌'} Reject
                      </button>
                      <button
                        className="btn btn-sm"
                        style={{ background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', fontWeight: 700 }}
                        disabled={actionLoading === resume.id + '-accept'}
                        onClick={() => handleAccept(resume.id)}
                      >
                        {actionLoading === resume.id + '-accept'
                          ? <span className="spinner" style={{ width: 12, height: 12 }} />
                          : '✅'} Accept
                      </button>
                    </div>
                  )}

                  {resume.status && resume.status !== 'Pending' && (
                    <div className="card-footer" style={{ justifyContent: 'center' }}>
                      <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                        Decision already made
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}