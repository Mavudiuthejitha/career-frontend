import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

function FairCardSkeleton() {
  return (
    <div className="skeleton-card">
      <div className="card-header-stripe" style={{ background: '#e2e8f0' }} />
      <div className="card-body">
        <div className="skeleton skeleton-line medium" style={{ marginBottom: '0.875rem' }} />
        <div className="skeleton skeleton-line full" />
        <div className="skeleton skeleton-line long" style={{ marginTop: '0.375rem' }} />
        <div className="skeleton skeleton-line short" style={{ marginTop: '0.375rem' }} />
        <div className="skeleton skeleton-line" style={{ height: 28, width: 90, marginTop: '1rem', borderRadius: 6 }} />
      </div>
      <div className="card-footer" style={{ background: '#f8fafc' }}>
        <div className="skeleton skeleton-line" style={{ width: 70, height: 24, borderRadius: 999 }} />
        <div className="skeleton skeleton-line" style={{ width: 100, height: 32, borderRadius: 6 }} />
      </div>
    </div>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return null;
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

export default function Fairs() {
  const [fairs, setFairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Admin create fair
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({ title: '', description: '', date: '' });
  const [creating, setCreating] = useState(false);
  const [createAlert, setCreateAlert] = useState(null);

  const fetchFairs = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/fairs');
      setFairs(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFairs();
  }, []);

  const handleCreateChange = (e) => {
    setCreateForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setCreateAlert(null);
    if (!createForm.title.trim()) {
      setCreateAlert({ type: 'error', msg: 'Title is required.' });
      return;
    }
    setCreating(true);
    try {
      await api.post('/fairs', createForm);
      setCreateAlert({ type: 'success', msg: 'Fair created successfully!' });
      setCreateForm({ title: '', description: '', date: '' });
      fetchFairs();
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
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 className="page-title">Career Fairs</h1>
              <p className="page-subtitle">Browse upcoming virtual career events and connect with top employers</p>
            </div>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => setShowCreate((v) => !v)}
              style={{ alignSelf: 'flex-start', marginTop: '0.375rem' }}
            >
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              {showCreate ? 'Close Panel' : 'Add Fair'}
            </button>
          </div>
        </div>
      </div>

      <div className="page-body">
        <div className="container">

          {/* Admin Panel */}
          {showCreate && (
            <div className="admin-panel" style={{ marginBottom: '1.75rem' }}>
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)' }} />
                <span style={{ fontWeight: 700, fontSize: '0.9375rem' }}>Create New Fair</span>
              </div>
              <div className="admin-panel-body">
                {createAlert && (
                  <div className={`alert alert-${createAlert.type}`} style={{ gridColumn: '1/-1' }}>
                    {createAlert.msg}
                  </div>
                )}
                <form onSubmit={handleCreateSubmit} style={{ display: 'contents' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Fair Title *</label>
                    <input name="title" className="form-input" placeholder="e.g. Tech Career Fair 2025" value={createForm.title} onChange={handleCreateChange} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Description</label>
                    <input name="description" className="form-input" placeholder="Brief description…" value={createForm.description} onChange={handleCreateChange} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Date</label>
                    <input name="date" type="date" className="form-input" value={createForm.date} onChange={handleCreateChange} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                    <button type="submit" className="btn btn-primary" disabled={creating} style={{ width: '100%', justifyContent: 'center' }}>
                      {creating ? <span className="spinner" /> : null}
                      {creating ? 'Creating…' : 'Create Fair'}
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
              <button className="btn btn-sm btn-ghost" onClick={fetchFairs} style={{ marginLeft: 'auto', padding: '0.25rem 0.5rem' }}>Retry</button>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="cards-grid">
              {[...Array(6)].map((_, i) => <FairCardSkeleton key={i} />)}
            </div>
          )}

          {/* Empty */}
          {!loading && !error && fairs.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">
                <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="empty-state-title">No Career Fairs Yet</div>
              <div className="empty-state-desc">
                There are no career fairs scheduled right now. Check back soon or create one using the panel above.
              </div>
              <button className="btn btn-outline" onClick={() => setShowCreate(true)}>
                + Create First Fair
              </button>
            </div>
          )}

          {/* Fairs Grid */}
          {!loading && fairs.length > 0 && (
            <div className="cards-grid">
              {fairs.map((fair, idx) => (
                <div className="card" key={fair.id ?? idx}>
                  <div className="card-header-stripe" />
                  <div className="card-body">
                    <div className="card-title">{fair.title || fair.name || 'Untitled Fair'}</div>
                    {fair.description && (
                      <p className="card-desc">{fair.description}</p>
                    )}
                    {(fair.date || fair.eventDate) && (
                      <div className="fair-card-meta" style={{ marginTop: '0.875rem' }}>
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {formatDate(fair.date || fair.eventDate)}
                      </div>
                    )}
                  </div>
                  <div className="card-footer">
                    <span className="tag tag-blue">
                      <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
                      </svg>
                      Career Fair
                    </span>
                    <Link to={`/booths/${fair.id}`} className="btn btn-primary btn-sm">
                      View Booths
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
