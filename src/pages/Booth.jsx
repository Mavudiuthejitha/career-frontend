import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';

function BoothCardSkeleton() {
  return (
    <div className="skeleton-card" style={{ borderRadius: 'var(--radius-lg)' }}>
      <div className="card-body">
        <div style={{ display: 'flex', gap: '0.875rem', marginBottom: '0.875rem' }}>
          <div className="skeleton" style={{ width: 44, height: 44, borderRadius: 8, flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div className="skeleton skeleton-line medium" style={{ marginBottom: '0.4rem' }} />
            <div className="skeleton skeleton-line short" />
          </div>
        </div>
        <div className="skeleton skeleton-line full" />
        <div className="skeleton skeleton-line long" style={{ marginTop: '0.375rem' }} />
      </div>
      <div className="card-footer" style={{ background: '#f8fafc' }}>
        <div className="skeleton skeleton-line" style={{ width: 80, height: 24, borderRadius: 999 }} />
        <div className="skeleton skeleton-line" style={{ width: 110, height: 32, borderRadius: 6 }} />
      </div>
    </div>
  );
}

function getInitials(name = '') {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || '')
    .join('');
}

const AVATAR_COLORS = [
  ['#eff6ff', '#1d4ed8'],
  ['#f0fdf4', '#16a34a'],
  ['#faf5ff', '#7c3aed'],
  ['#fff7ed', '#c2410c'],
  ['#ecfdf5', '#0d9488'],
  ['#fdf4ff', '#a21caf'],
];

export default function Booth() {
  const { fairId } = useParams();
  const [booths, setBooths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fairTitle, setFairTitle] = useState('');

  // Admin create booth
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({ companyName: '', description: '' });
  const [creating, setCreating] = useState(false);
  const [createAlert, setCreateAlert] = useState(null);

  const fetchBooths = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/booths/${fairId}`);
      setBooths(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooths();
    // Optionally fetch fair title
    api.get('/fairs').then(({ data }) => {
      if (Array.isArray(data)) {
        const fair = data.find((f) => String(f.id) === String(fairId));
        if (fair) setFairTitle(fair.title || fair.name || '');
      }
    }).catch(() => {});
  }, [fairId]);

  const handleCreateChange = (e) => {
    setCreateForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setCreateAlert(null);
    if (!createForm.companyName.trim()) {
      setCreateAlert({ type: 'error', msg: 'Company name is required.' });
      return;
    }
    setCreating(true);
    try {
      await api.post('/booths', { ...createForm, fairId: Number(fairId) });
      setCreateAlert({ type: 'success', msg: 'Booth added successfully!' });
      setCreateForm({ companyName: '', description: '' });
      fetchBooths();
    } catch (err) {
      setCreateAlert({ type: 'error', msg: err.message });
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header" style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <div className="page-header-inner" style={{ padding: '2rem 2rem 1.5rem' }}>
          <div className="breadcrumb">
            <Link to="/fairs">Career Fairs</Link>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <span>Booths</span>
            {fairTitle && (
              <>
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
                <span style={{ color: 'var(--text-secondary)' }}>{fairTitle}</span>
              </>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 className="page-title">
                {fairTitle ? `${fairTitle} — Booths` : 'Company Booths'}
              </h1>
              <p className="page-subtitle">
                {loading ? 'Loading…' : `${booths.length} booth${booths.length !== 1 ? 's' : ''} available at this fair`}
              </p>
            </div>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => setShowCreate((v) => !v)}
              style={{ alignSelf: 'flex-start', marginTop: '0.375rem' }}
            >
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              {showCreate ? 'Close Panel' : 'Add Booth'}
            </button>
          </div>
        </div>
      </div>

      <div className="page-body">
        <div className="container">

          {/* Admin create booth */}
          {showCreate && (
            <div className="admin-panel" style={{ marginBottom: '1.75rem' }}>
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)' }} />
                <span style={{ fontWeight: 700, fontSize: '0.9375rem' }}>Add New Booth</span>
              </div>
              <div className="admin-panel-body">
                {createAlert && (
                  <div className={`alert alert-${createAlert.type}`} style={{ gridColumn: '1/-1' }}>
                    {createAlert.msg}
                  </div>
                )}
                <form onSubmit={handleCreateSubmit} style={{ display: 'contents' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Company Name *</label>
                    <input name="companyName" className="form-input" placeholder="e.g. Infosys" value={createForm.companyName} onChange={handleCreateChange} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Description</label>
                    <input name="description" className="form-input" placeholder="What the company is looking for…" value={createForm.description} onChange={handleCreateChange} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                    <button type="submit" className="btn btn-primary" disabled={creating} style={{ width: '100%', justifyContent: 'center' }}>
                      {creating ? <span className="spinner" /> : null}
                      {creating ? 'Adding…' : 'Add Booth'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ flexShrink: 0 }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a1 1 0 00.89 1.5h18.58a1 1 0 00.89-1.5L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
              {error}
              <button className="btn btn-sm btn-ghost" onClick={fetchBooths} style={{ marginLeft: 'auto' }}>Retry</button>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="cards-grid">
              {[...Array(6)].map((_, i) => <BoothCardSkeleton key={i} />)}
            </div>
          )}

          {/* Empty */}
          {!loading && !error && booths.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">
                <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="empty-state-title">No Booths Yet</div>
              <div className="empty-state-desc">
                No company booths have been added to this fair yet. Add one using the panel above.
              </div>
              <button className="btn btn-outline" onClick={() => setShowCreate(true)}>
                + Add First Booth
              </button>
            </div>
          )}

          {/* Booths Grid */}
          {!loading && booths.length > 0 && (
            <div className="cards-grid">
              {booths.map((booth, idx) => {
                const colorPair = AVATAR_COLORS[idx % AVATAR_COLORS.length];
                const name = booth.companyName || booth.company || booth.name || 'Company';
                return (
                  <div className="card" key={booth.id ?? idx}>
                    <div className="card-body">
                      <div className="booth-card-top">
                        <div
                          className="booth-avatar"
                          style={{ background: colorPair[0], color: colorPair[1] }}
                        >
                          {getInitials(name)}
                        </div>
                        <div className="booth-card-info">
                          <div className="card-title" style={{ marginBottom: 0, fontSize: '1rem' }}>{name}</div>
                          {booth.industry && (
                            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{booth.industry}</div>
                          )}
                        </div>
                      </div>
                      {booth.description && (
                        <p className="card-desc">{booth.description}</p>
                      )}
                    </div>
                    <div className="card-footer">
                      <span className="tag tag-green">
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor">
                          <circle cx="4" cy="4" r="4" />
                        </svg>
                        Hiring
                      </span>
                      <Link to="/upload-resume" className="btn btn-primary btn-sm">
                        Apply Now
                        <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
