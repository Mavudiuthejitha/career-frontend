import { Link } from 'react-router-dom';
import { useState } from 'react';

const FEATURES = [
  {
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    bg: '#eff6ff',
    color: '#1d4ed8',
    title: 'Top Company Booths',
    desc: 'Explore virtual booths from hundreds of leading companies actively hiring.',
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    bg: '#f0fdf4',
    color: '#16a34a',
    title: 'Scheduled Career Fairs',
    desc: 'Join live virtual career fairs organized by industry, location, and role.',
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    bg: '#faf5ff',
    color: '#7c3aed',
    title: 'One-Click Resume Upload',
    desc: 'Share your resume instantly with recruiters across all booths you visit.',
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    bg: '#fff7ed',
    color: '#c2410c',
    title: 'Networking Opportunities',
    desc: 'Connect with recruiters and peers, schedule chats, and grow your network.',
  },
];

export default function Home() {
  const [searchValue, setSearchValue] = useState('');

  return (
    <div className="page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-grid" />
        <div className="hero-inner">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            New fairs added weekly
          </div>
          <h1 className="hero-title">
            Your next career move<br />
            starts <em>here</em>
          </h1>
          <p className="hero-subtitle">
            Connect with top employers at virtual career fairs. Explore booths,
            upload your resume, and land interviews — all from one platform.
          </p>

          <div className="hero-search">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#94a3b8" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
            </svg>
            <input
              type="text"
              placeholder="Search fairs by company, role, or location…"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <Link to="/fairs" className="btn btn-primary btn-sm" style={{ borderRadius: '6px' }}>
              Search
            </Link>
          </div>

          <div className="hero-ctas">
            <Link to="/fairs" className="btn btn-primary btn-lg">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Browse Career Fairs
            </Link>
            <Link to="/register" className="btn btn-lg btn-hero-secondary">
              Create Account
            </Link>
          </div>

          <div className="hero-stats">
            <div className="stat">
              <div className="stat-number">200+</div>
              <div className="stat-label">Companies</div>
            </div>
            <div className="stat">
              <div className="stat-number">50+</div>
              <div className="stat-label">Career Fairs</div>
            </div>
            <div className="stat">
              <div className="stat-number">12K+</div>
              <div className="stat-label">Candidates</div>
            </div>
            <div className="stat">
              <div className="stat-number">3.4K</div>
              <div className="stat-label">Placements</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section" style={{ background: 'var(--surface-alt)' }}>
        <div className="section-inner">
          <div style={{ maxWidth: '520px' }}>
            <div className="section-label">Why CareerFair</div>
            <h2 className="section-title">Everything you need to get hired</h2>
            <p className="section-subtitle">
              A purpose-built platform to help candidates and employers connect
              faster at virtual career events.
            </p>
          </div>
          <div className="features-grid">
            {FEATURES.map((f) => (
              <div className="feature-card" key={f.title}>
                <div
                  className="feature-icon"
                  style={{ background: f.bg, color: f.color }}
                >
                  {f.icon}
                </div>
                <div className="feature-title">{f.title}</div>
                <div className="feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section
        className="section"
        style={{
          background: 'linear-gradient(135deg, var(--primary) 0%, #1e40af 100%)',
        }}
      >
        <div className="section-inner" style={{ textAlign: 'center' }}>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.5rem,3vw,2.25rem)',
              color: 'white',
              marginBottom: '0.75rem',
              letterSpacing: '-0.3px',
            }}
          >
            Ready to find your next opportunity?
          </h2>
          <p
            style={{
              color: 'rgba(255,255,255,0.75)',
              fontSize: '1rem',
              marginBottom: '2rem',
            }}
          >
            Create a free account and start exploring fairs today.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-lg" style={{ background: 'white', color: 'var(--primary)', borderColor: 'white' }}>
              Register Free
            </Link>
            <Link to="/fairs" className="btn btn-lg btn-hero-secondary">
              View All Fairs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
