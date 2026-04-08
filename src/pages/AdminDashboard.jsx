import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function StatCard({ label, value, color, bg, icon }) {
  return (
    <div style={{
      background: 'white',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: '1.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      boxShadow: 'var(--shadow-sm)',
    }}>
      <div style={{ width: 48, height: 48, borderRadius: 'var(--radius)', background: bg, color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '1.75rem', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{label}</div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const [tab, setTab] = useState('recruiters'); // recruiters | candidates | all
  const [pendingRecruiters, setPendingRecruiters] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [alert, setAlert] = useState(null);

  // Protect route — only admin
  useEffect(() => {
    if (!user || user.role !== 'Admin') {
      navigate('/login');
    }
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [pendingRes, candidatesRes, allRes] = await Promise.all([
        api.get('/users/pending-recruiters'),
        api.get('/users/candidates'),
        api.get('/users'),
      ]);
      setPendingRecruiters(pendingRes.data);
      setCandidates(candidatesRes.data);
      setAllUsers(allRes.data);
    } catch (err) {
      setAlert({ type: 'error', msg: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleApprove = async (id) => {
    setActionLoading(id + '-approve');
    try {
      await api.put(`/users/${id}/approve`);
      setAlert({ type: 'success', msg: 'Recruiter approved successfully!' });
      fetchAll();
    } catch (err) {
      setAlert({ type: 'error', msg: err.message });
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    setActionLoading(id + '-reject');
    try {
      await api.put(`/users/${id}/reject`);
      setAlert({ type: 'success', msg: 'Recruiter rejected.' });
      fetchAll();
    } catch (err) {
      setAlert({ type: 'error', msg: err.message });
    } finally {
      setActionLoading(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getRoleBadge = (role) => {
    const map = {
      Admin: { bg: '#eff6ff', color: '#1d4ed8' },
      Recruiter: { bg: '#fff7ed', color: '#c2410c' },
      Candidate: { bg: '#f0fdf4', color: '#16a34a' },
    };
    const style = map[role] || { bg: '#f1f5f9', color: '#475569' };
    return (
      <span style={{ background: style.bg, color: style.color, fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: 999 }}>
        {role}
      </span>
    );
  };

  const getStatusBadge = (status, approved, role) => {
    if (role === 'Recruiter') {
      if (approved) return <span style={{ background: '#f0fdf4', color: '#16a34a', fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: 999 }}>✅ Approved</span>;
      return <span style={{ background: '#fef9c3', color: '#854d0e', fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: 999 }}>⏳ Pending</span>;
    }
    const map = {
      Accepted: { bg: '#f0fdf4', color: '#16a34a', icon: '✅' },
      Rejected: { bg: '#fef2f2', color: '#b91c1c', icon: '❌' },
      Pending: { bg: '#fef9c3', color: '#854d0e', icon: '⏳' },
    };
    const s = map[status] || map['Pending'];
    return <span style={{ background: s.bg, color: s.color, fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: 999 }}>{s.icon} {status || 'Pending'}</span>;
  };

  const TABS = [
    { key: 'recruiters', label: `Pending Recruiters`, count: pendingRecruiters.length },
    { key: 'candidates', label: 'All Candidates', count: candidates.length },
    { key: 'all', label: 'All Users', count: allUsers.length },
  ];

  const tableData = tab === 'recruiters' ? pendingRecruiters : tab === 'candidates' ? candidates : allUsers;

  return (
    <div className="page">
      {/* Header */}
      <div style={{ background: 'white', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ padding: '1.75rem 2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                Logged in as <strong style={{ color: 'var(--primary)' }}>Admin</strong>
              </div>
              <h1 className="page-title">Admin Dashboard</h1>
              <p className="page-subtitle">Manage recruiters, candidates, and platform activity</p>
            </div>
            <button className="btn btn-outline btn-sm" onClick={handleLogout}>
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
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
              <button onClick={() => setAlert(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }}>×</button>
            </div>
          )}

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <StatCard
              label="Pending Recruiters"
              value={pendingRecruiters.length}
              color="#c2410c" bg="#fff7ed"
              icon={<svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            />
            <StatCard
              label="Total Candidates"
              value={candidates.length}
              color="#16a34a" bg="#f0fdf4"
              icon={<svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
            />
            <StatCard
              label="Total Users"
              value={allUsers.length}
              color="#1d4ed8" bg="#eff6ff"
              icon={<svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
            />
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '0.25rem', borderBottom: '1px solid var(--border)', marginBottom: '1.5rem' }}>
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                style={{
                  background: 'none',
                  border: 'none',
                  borderBottom: tab === t.key ? '2px solid var(--primary)' : '2px solid transparent',
                  color: tab === t.key ? 'var(--primary)' : 'var(--text-secondary)',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  padding: '0.75rem 1rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.15s',
                }}
              >
                {t.label}
                <span style={{
                  background: tab === t.key ? 'var(--primary-light)' : 'var(--surface-hover)',
                  color: tab === t.key ? 'var(--primary)' : 'var(--text-muted)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '0.1rem 0.45rem',
                  borderRadius: 999,
                }}>
                  {t.count}
                </span>
              </button>
            ))}
          </div>

          {/* Loading */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
              <span className="spinner spinner-dark" style={{ width: 28, height: 28 }} />
              <div style={{ marginTop: '1rem', fontSize: '0.9rem' }}>Loading data…</div>
            </div>
          )}

          {/* Empty */}
          {!loading && tableData.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">
                <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="empty-state-title">No records found</div>
              <div className="empty-state-desc">Nothing to show in this section yet.</div>
            </div>
          )}

          {/* Table */}
          {!loading && tableData.length > 0 && (
            <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--surface-alt)', borderBottom: '1px solid var(--border)' }}>
                    {['Name', 'Email', 'Role', 'Status', tab === 'recruiters' ? 'Actions' : ''].filter(Boolean).map((h) => (
                      <th key={h} style={{ padding: '0.875rem 1.25rem', textAlign: 'left', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.3px' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((u, idx) => (
                    <tr key={u.id} style={{ borderBottom: idx < tableData.length - 1 ? '1px solid var(--border-light)' : 'none', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-alt)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'white'}
                    >
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                          <div style={{
                            width: 34, height: 34, borderRadius: '50%',
                            background: 'var(--primary-light)', color: 'var(--primary)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 800, fontSize: '0.875rem', flexShrink: 0,
                          }}>
                            {u.name?.[0]?.toUpperCase() || '?'}
                          </div>
                          <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{u.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '1rem 1.25rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{u.email}</td>
                      <td style={{ padding: '1rem 1.25rem' }}>{getRoleBadge(u.role)}</td>
                      <td style={{ padding: '1rem 1.25rem' }}>{getStatusBadge(u.status, u.approved, u.role)}</td>
                      {tab === 'recruiters' && (
                        <td style={{ padding: '1rem 1.25rem' }}>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                              className="btn btn-sm"
                              style={{ background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', fontWeight: 700 }}
                              disabled={actionLoading === u.id + '-approve'}
                              onClick={() => handleApprove(u.id)}
                            >
                              {actionLoading === u.id + '-approve' ? <span className="spinner" style={{ borderColor: '#16a34a33', borderTopColor: '#16a34a', width: 12, height: 12 }} /> : '✅'} Approve
                            </button>
                            <button
                              className="btn btn-sm"
                              style={{ background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca', fontWeight: 700 }}
                              disabled={actionLoading === u.id + '-reject'}
                              onClick={() => handleReject(u.id)}
                            >
                              {actionLoading === u.id + '-reject' ? <span className="spinner" style={{ borderColor: '#b91c1c33', borderTopColor: '#b91c1c', width: 12, height: 12 }} /> : '❌'} Reject
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}