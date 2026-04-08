import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);

    if (!form.email.trim() || !form.password.trim()) {
      setAlert({ type: 'error', msg: 'Please fill in all fields.' });
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/users/login', form);

      // Save user to localStorage
      localStorage.setItem('user', JSON.stringify(data));

      // Redirect based on role
      if (data.role === 'Admin') {
        navigate('/admin');
      } else if (data.role === 'Recruiter') {
        navigate('/fairs');
      } else {
        navigate('/fairs');
      }
    } catch (err) {
      setAlert({ type: 'error', msg: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page">
      <div className="form-card">
        <div className="form-card-header">
          <div className="form-card-icon">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
          </div>
          <h1 className="form-card-title">Welcome back</h1>
          <p className="form-card-subtitle">Sign in to your CareerFair account</p>
        </div>

        <div className="form-card-body">
          {alert && (
            <div className={`alert alert-${alert.type}`}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ flexShrink: 0 }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a1 1 0 00.89 1.5h18.58a1 1 0 00.89-1.5L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
              {alert.msg}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                name="email"
                type="email"
                className="form-input"
                placeholder="john@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                name="password"
                type="password"
                className="form-input"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', marginTop: '0.5rem' }}
            >
              {loading ? <span className="spinner" /> : null}
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
                Register here
              </Link>
            </span>
          </div>

          {/* Role hint */}
          <div style={{
            marginTop: '1.5rem',
            padding: '1rem',
            background: 'var(--surface-alt)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border)',
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Role-based access
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              {[
                { role: 'Candidate', desc: 'Browse fairs & upload resume', color: '#16a34a', bg: '#f0fdf4' },
                { role: 'Recruiter', desc: 'View applicants (needs approval)', color: '#c2410c', bg: '#fff7ed' },
                { role: 'Admin', desc: 'Full access & manage platform', color: '#1d4ed8', bg: '#eff6ff' },
              ].map((r) => (
                <div key={r.role} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem' }}>
                  <span style={{ background: r.bg, color: r.color, padding: '0.15rem 0.5rem', borderRadius: 999, fontWeight: 700, fontSize: '0.75rem' }}>{r.role}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{r.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}