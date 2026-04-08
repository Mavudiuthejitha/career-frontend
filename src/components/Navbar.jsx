import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
    setMobileOpen(false);
  };

  const NAV_LINKS = [
    { to: '/', label: 'Home', roles: ['all'] },
    { to: '/fairs', label: 'Career Fairs', roles: ['all'] },
    { to: '/upload-resume', label: 'Upload Resume', roles: ['Candidate'] },
    { to: '/resumes', label: 'View Resumes', roles: ['Recruiter', 'Admin'] },
    { to: '/admin', label: 'Admin Panel', roles: ['Admin'] },
    { to: '/register', label: 'Register', roles: ['guest'] },
  ].filter(link => {
    if (link.roles.includes('all')) return true;
    if (!user && link.roles.includes('guest')) return true;
    if (user && link.roles.includes(user.role)) return true;
    return false;
  });

  const getRoleBadgeStyle = (role) => {
    if (role === 'Admin') return { bg: '#eff6ff', color: '#1d4ed8' };
    if (role === 'Recruiter') return { bg: '#fff7ed', color: '#c2410c' };
    return { bg: '#f0fdf4', color: '#16a34a' };
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          <Link to="/" className="navbar-logo">
            <div className="logo-mark">CF</div>
            <span className="logo-text">Career<span>Fair</span></span>
          </Link>

          <div className="navbar-nav">
            {NAV_LINKS.map((link) => (
              <Link key={link.to} to={link.to}
                className={`nav-link${location.pathname === link.to ? ' active' : ''}`}>
                {link.label}
              </Link>
            ))}
          </div>

          <div className="navbar-actions">
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  background: 'var(--surface-alt)', border: '1px solid var(--border)',
                  borderRadius: 999, padding: '0.3rem 0.75rem 0.3rem 0.4rem',
                }}>
                  <div style={{
                    width: 26, height: 26, borderRadius: '50%',
                    background: 'var(--primary-light)', color: 'var(--primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, fontSize: '0.75rem',
                  }}>
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {user.name?.split(' ')[0]}
                  </span>
                  <span style={{
                    fontSize: '0.7rem', fontWeight: 700,
                    background: getRoleBadgeStyle(user.role).bg,
                    color: getRoleBadgeStyle(user.role).color,
                    padding: '0.1rem 0.45rem', borderRadius: 999,
                  }}>
                    {user.role}
                  </span>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={handleLogout} style={{ padding: '0.375rem 0.625rem' }}>
                  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link to="/login" className="btn btn-outline btn-sm">Sign In</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
              </div>
            )}
            <button className="mobile-menu-btn" onClick={() => setMobileOpen(v => !v)}>
              {mobileOpen
                ? <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                : <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
              }
            </button>
          </div>
        </div>
      </nav>

      {mobileOpen && (
        <div style={{
          position: 'fixed', top: 'var(--nav-height)', left: 0, right: 0,
          background: 'white', borderBottom: '1px solid var(--border)',
          zIndex: 99, padding: '0.75rem 1.25rem 1rem',
          display: 'flex', flexDirection: 'column', gap: '0.25rem',
          boxShadow: 'var(--shadow-lg)',
        }}>
          {NAV_LINKS.map((link) => (
            <Link key={link.to} to={link.to}
              className={`nav-link${location.pathname === link.to ? ' active' : ''}`}
              onClick={() => setMobileOpen(false)}
              style={{ padding: '0.625rem 0.75rem' }}>
              {link.label}
            </Link>
          ))}
          <div className="divider" />
          {user
            ? <button className="btn btn-outline" onClick={handleLogout} style={{ justifyContent: 'center' }}>Logout</button>
            : <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Link to="/login" className="btn btn-outline" onClick={() => setMobileOpen(false)} style={{ justifyContent: 'center' }}>Sign In</Link>
                <Link to="/register" className="btn btn-primary" onClick={() => setMobileOpen(false)} style={{ justifyContent: 'center' }}>Register</Link>
              </div>
          }
        </div>
      )}
    </>
  );
}