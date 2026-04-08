import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const ACCEPTED_TYPES = ['application/pdf', 'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const MAX_SIZE_MB = 5;

export default function UploadResume() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [success, setSuccess] = useState(false);
  const inputRef = useRef(null);

  // Redirect if not logged in
  if (!user) {
    return (
      <div className="form-page">
        <div className="form-card">
          <div className="form-card-body" style={{ padding: '2.5rem 2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
              Login Required
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              You must be logged in as a Candidate to upload your resume.
            </p>
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => navigate('/login')}>
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  const validateFile = (f) => {
    if (!ACCEPTED_TYPES.includes(f.type)) {
      return 'Only PDF and Word documents (.doc, .docx) are accepted.';
    }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      return `File size must be under ${MAX_SIZE_MB}MB.`;
    }
    return null;
  };

  const handleFileSelect = (f) => {
    setAlert(null);
    setSuccess(false);
    const err = validateFile(f);
    if (err) { setAlert({ type: 'error', msg: err }); return; }
    setFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFileSelect(dropped);
  };

  const handleUpload = async () => {
    if (!file) { setAlert({ type: 'error', msg: 'Please select a file first.' }); return; }
    setAlert(null);
    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    // Send userId from logged in user
    if (user?.id) formData.append('userId', user.id);

    try {
      await api.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess(true);
      setFile(null);
    } catch (err) {
      setAlert({ type: 'error', msg: err.message });
    } finally {
      setUploading(false);
    }
  };

  const handleReset = () => { setFile(null); setAlert(null); setSuccess(false); };

  function formatBytes(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

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
                Resume Uploaded!
              </h2>
              <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', marginBottom: '1.75rem' }}>
                Your resume has been submitted. Recruiters will review it shortly.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={handleReset}>
                  Upload Another
                </button>
                <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }} onClick={() => navigate('/fairs')}>
                  Back to Fairs
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="form-page">
      <div className="form-card" style={{ maxWidth: 500 }}>
        <div className="form-card-header">
          <div className="form-card-icon">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="form-card-title">Upload Your Resume</h1>
          <p className="form-card-subtitle">
            Uploading as <strong style={{ color: 'var(--primary)' }}>{user.name}</strong>
          </p>
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

          {/* Drop Zone */}
          <div
            className={`form-input-file${dragging ? ' drag-over' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => { if (e.target.files[0]) handleFileSelect(e.target.files[0]); e.target.value = ''; }}
            />
            <div className="file-upload-icon">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div className="file-upload-text">
              {dragging ? 'Drop your file here' : 'Click or drag & drop to upload'}
            </div>
            <div className="file-upload-hint">PDF, DOC, DOCX — max {MAX_SIZE_MB}MB</div>
          </div>

          {/* Selected File */}
          {file && (
            <div className="file-selected">
              <div className="file-selected-icon">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <div className="file-selected-name">{file.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--primary)', opacity: 0.7 }}>{formatBytes(file.size)}</div>
              </div>
              <button
                className="btn btn-ghost btn-sm"
                onClick={(e) => { e.stopPropagation(); setFile(null); }}
                style={{ marginLeft: 'auto', padding: '0.25rem', borderRadius: 4 }}
              >
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          <button
            className="btn btn-primary"
            disabled={!file || uploading}
            onClick={handleUpload}
            style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', marginTop: '1.25rem' }}
          >
            {uploading ? <span className="spinner" /> : (
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            )}
            {uploading ? 'Uploading…' : 'Upload Resume'}
          </button>
        </div>
      </div>
    </div>
  );
}