import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{ minHeight: 'calc(100vh - var(--nav-height))', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ textAlign: 'center', maxWidth: 480 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(5rem, 15vw, 9rem)', color: 'var(--primary-light)', lineHeight: 1, marginBottom: '1rem', fontWeight: 700 }}>
          404
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.875rem', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
          Page Not Found
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '2rem' }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn-primary">Go Home</Link>
          <Link to="/fairs" className="btn btn-outline">Browse Fairs</Link>
        </div>
      </div>
    </div>
  );
}