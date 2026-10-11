import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { ShieldCheck, Search, Award, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

const CertificateVerifyPage = () => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [cert, setCert] = useState(null);
  const [error, setError] = useState(null);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setError(null);
    setCert(null);

    try {
      const res = await api.get(`/certificates/verify/${code.trim()}`);
      if (res.data) {
        setCert(res.data);
      }
    } catch (err) {
      setError(err.message || 'No valid certificate found with this code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: '750px', minHeight: '80vh' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '16px',
          background: 'rgba(6, 182, 212, 0.15)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1rem',
          border: '1px solid rgba(6, 182, 212, 0.3)'
        }}>
          <ShieldCheck size={32} color="var(--accent-secondary)" />
        </div>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>Certificate Verification Portal</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '540px', margin: '0 auto' }}>
          Enter any LearnHub credential code below to verify the student's authenticity, academic completion date, and course credential.
        </p>
      </div>

      {/* Verification Search Form */}
      <form onSubmit={handleVerify} className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-xl)', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-control"
              placeholder="e.g. LH-1-1-A1B2C3D4"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              style={{ paddingLeft: '40px', height: '48px', fontSize: '1rem', textTransform: 'uppercase' }}
              required
            />
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '0 1.75rem', height: '48px' }}>
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </div>
      </form>

      {/* Verification Result */}
      {cert && (
        <div className="glass-panel animate-fade-in" style={{
          padding: '2.5rem',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          boxShadow: 'var(--success-glow)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--success)', marginBottom: '1.5rem' }}>
            <CheckCircle2 size={28} />
            <h2 style={{ fontSize: '1.4rem' }}>Official Certificate Verified</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Recipient Student</span>
              <div style={{ fontSize: '1.15rem', fontWeight: 700 }}>{cert.studentName}</div>
              <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>{cert.studentEmail}</div>
            </div>

            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Course Credential</span>
              <div style={{ fontSize: '1.15rem', fontWeight: 700 }}>{cert.courseTitle}</div>
              <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Instructor: {cert.instructorName}</div>
            </div>

            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Issue Date</span>
              <div style={{ fontSize: '1.15rem', fontWeight: 700 }}>
                {new Date(cert.issuedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Verification Code</span>
              <div style={{ fontSize: '1rem', fontWeight: 700, fontFamily: 'monospace', color: '#fbbf24' }}>
                {cert.certificateCode}
              </div>
            </div>
          </div>

          <Link to={`/certificates/${cert.certificateCode}`} className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            View Full Certificate <ArrowRight size={16} />
          </Link>
        </div>
      )}

      {error && (
        <div className="glass-panel animate-fade-in" style={{
          padding: '2rem',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          textAlign: 'center'
        }}>
          <XCircle size={36} color="var(--danger)" style={{ marginBottom: '0.75rem' }} />
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Verification Failed</h3>
          <p style={{ color: 'var(--text-muted)' }}>{error}</p>
        </div>
      )}

    </div>
  );
};

export default CertificateVerifyPage;
