import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

const ROLES = ['Candidate', 'Recruiter', 'Admin'];

// Real-time validation rules
const validate = (name, value, form) => {
  switch (name) {
    case 'name':
      if (!value.trim()) return 'Full name is required';
      if (value.trim().length < 2) return 'Name must be at least 2 characters';
      return '';
    case 'email':
      if (!value.trim()) return 'Email is required';
      if (!/\S+@\S+\.\S+/.test(value)) return 'Enter a valid email address';
      return '';
    case 'password':
      if (!value) return 'Password is required';
      if (value.length < 6) return 'Password must be at least 6 characters';
      return '';
    default:
      return '';
  }
};

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'Candidate' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // Real-time validation
    if (touched[name]) {
      setErrors(prev => ({ ...prev, [name]: validate(name, value, form) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validate(name, value, form) }));
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' };
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    if (score <= 1) return { strength: 20, label: 'Weak', color: '#ef4444' };
    if (score <= 2) return { strength: 40, label: 'Fair', color: '#f97316' };
    if (score <= 3) return { strength: 60, label: 'Good', color: '#eab308' };
    if (score <= 4) return { strength: 80, label: 'Strong', color: '#22c55e' };
    return { strength: 100, label: 'Very Strong', color: '#16a34a' };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);

    // Validate all fields
    const newErrors = {
      name: validate('name', form.name, form),
      email: validate('email', form.email, form),
      password: validate('password', form.password, form),
    };
    setErrors(newErrors);
    setTouched({ name: true, email: true, password: true });

    if (Object.values(newErrors).some(e => e)) return;

    setLoading(true);
    try {
      await api.post('/users/register', form);
      setSuccess(true);
    } catch (err) {
      setAlert({ type: 'error', msg: String(err.message) });
    } finally {
      setLoading(false);
    }
  };

  const pwStrength = getPasswordStrength(form.password);

  if (success) {
    return (
      <div className="form-page">
        <div className="form-card">
          <div className="form-card-body" style={{ padding: '2.5rem 2rem' }}>
            <div className="success-screen">
              <div className="success-circle">
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                Account Created!
              </h2>
              <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', marginBottom: '1.75rem' }}>
                Welcome, <strong>{form.name}</strong>!{' '}
                {form.role === 'Recruiter'
                  ? 'Your account is pending Admin approval.'
                  : 'You can now sign in.'}
              </p>
              {form.role === 'Recruiter' && (
                <div style={{ background: '#fef9c3', border: '1px solid #fde047', color: '#854d0e',
                  borderRadius: 'var(--radius-sm)', padding: '0.875rem 1rem', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                  ⏳ Your recruiter account needs Admin approval before you can log in.
                </div>
              )}
              <Link to="/login" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Go to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="form-page">
      <div className="form-card">
        <div className="form-card-header">
          <div className="form-card-icon">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="form-card-title">Create your account</h1>
          <p className="form-card-subtitle">Join thousands of candidates and recruiters</p>
        </div>

        <div className="form-card-body">
          {alert && (
            <div className="alert alert-error">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ flexShrink: 0 }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a1 1 0 00.89 1.5h18.58a1 1 0 00.89-1.5L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
              <span>{alert.msg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Full Name */}
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                name="name" type="text" className="form-input"
                placeholder="John Doe" value={form.name}
                onChange={handleChange} onBlur={handleBlur}
                style={{ borderColor: errors.name && touched.name ? '#ef4444' : '' }}
              />
              {errors.name && touched.name && (
                <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01" />
                  </svg>
                  {errors.name}
                </div>
              )}
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                name="email" type="email" className="form-input"
                placeholder="john@example.com" value={form.email}
                onChange={handleChange} onBlur={handleBlur}
                style={{ borderColor: errors.email && touched.email ? '#ef4444' : touched.email && !errors.email ? '#22c55e' : '' }}
              />
              {errors.email && touched.email && (
                <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01" />
                  </svg>
                  {errors.email}
                </div>
              )}
              {!errors.email && touched.email && form.email && (
                <div style={{ color: '#16a34a', fontSize: '0.8rem', marginTop: '0.3rem' }}>✓ Valid email</div>
              )}
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label">Password *</label>
              <div style={{ position: 'relative' }}>
                <input
                  name="password" type={showPassword ? 'text' : 'password'}
                  className="form-input" placeholder="Min. 6 characters"
                  value={form.password} onChange={handleChange} onBlur={handleBlur}
                  style={{ borderColor: errors.password && touched.password ? '#ef4444' : '', paddingRight: '2.5rem' }}
                />
                <button type="button" onClick={() => setShowPassword(v => !v)}
                  style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0 }}>
                  {showPassword
                    ? <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    : <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  }
                </button>
              </div>
              {/* Password strength bar */}
              {form.password && (
                <div style={{ marginTop: '0.5rem' }}>
                  <div style={{ height: 4, background: '#e2e8f0', borderRadius: 999, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pwStrength.strength}%`, background: pwStrength.color, borderRadius: 999, transition: 'all 0.3s' }} />
                  </div>
                  <div style={{ fontSize: '0.75rem', color: pwStrength.color, marginTop: '0.25rem', fontWeight: 600 }}>
                    {pwStrength.label}
                  </div>
                </div>
              )}
              {errors.password && touched.password && (
                <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.3rem' }}>⚠ {errors.password}</div>
              )}
            </div>

            {/* Role */}
            <div className="form-group">
              <label className="form-label">I am a</label>
              <select name="role" className="form-input" value={form.role} onChange={handleChange}>
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            {form.role === 'Recruiter' && (
              <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 'var(--radius-sm)',
                padding: '0.75rem 1rem', fontSize: '0.8125rem', color: '#c2410c', marginBottom: '1rem',
                display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <span>⚠️</span>
                <span>Recruiter accounts require Admin approval before you can log in.</span>
              </div>
            )}

            <button type="submit" className="btn btn-primary" disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', marginTop: '0.25rem' }}>
              {loading ? <span className="spinner" /> : null}
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Sign In</Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}