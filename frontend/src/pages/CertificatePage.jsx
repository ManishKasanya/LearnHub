import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { Award, Printer, ShieldCheck, CheckCircle2, ChevronLeft } from 'lucide-react';

const CertificatePage = () => {
  const { code } = useParams();
  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCert = async () => {
      try {
        const res = await api.get(`/certificates/verify/${code}`);
        if (res.data) {
          setCert(res.data);
        }
      } catch (err) {
        console.error("Certificate fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCert();
  }, [code]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 0', color: 'var(--text-muted)' }}>
        Validating certificate credentials...
      </div>
    );
  }

  if (!cert) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <h2>Certificate Not Found</h2>
        <p style={{ color: 'var(--text-muted)', margin: '1rem 0' }}>The specified certificate code could not be verified.</p>
        <Link to="/verify" className="btn btn-primary">
          Verify Another Code
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '960px' }}>
      
      {/* Top Action Bar (hidden when printing) */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <Link to="/dashboard" className="btn btn-sm btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <ChevronLeft size={16} /> Back to Dashboard
        </Link>
        <button onClick={handlePrint} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Printer size={18} /> Print or Save as PDF
        </button>
      </div>

      {/* Official Certificate Card */}
      <div style={{
        background: 'linear-gradient(145deg, #0e131d 0%, #151b26 100%)',
        border: '12px solid #232c3d',
        borderRadius: '16px',
        padding: '3.5rem 3rem',
        position: 'relative',
        boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
        color: '#f0f6fc',
        textAlign: 'center',
        overflow: 'hidden'
      }}>
        {/* Subtle Watermark Seal */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          opacity: 0.03,
          pointerEvents: 'none'
        }}>
          <Award size={480} color="#fff" />
        </div>

        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Award size={24} color="#000" />
          </div>
          <span style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#f59e0b' }}>
            LearnHub Academy
          </span>
        </div>

        <h1 style={{
          fontSize: '2.5rem',
          fontFamily: 'var(--font-heading)',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          background: 'linear-gradient(90deg, #fef3c7 0%, #fbbf24 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '1rem'
        }}>
          Certificate of Completion
        </h1>

        <p style={{ fontSize: '1rem', color: '#94a3b8', fontStyle: 'italic', marginBottom: '1.5rem' }}>
          This official credential certifies that
        </p>

        {/* Student Name */}
        <div style={{
          fontSize: '2.5rem',
          fontWeight: 800,
          color: '#ffffff',
          borderBottom: '2px solid rgba(245, 158, 11, 0.4)',
          display: 'inline-block',
          padding: '0 2rem 0.5rem 2rem',
          marginBottom: '1.5rem',
          letterSpacing: '-0.02em'
        }}>
          {cert.studentName}
        </div>

        <p style={{ fontSize: '1rem', color: '#94a3b8', marginBottom: '1rem' }}>
          has successfully satisfied all academic lectures, assignments, and secure examinations for
        </p>

        {/* Course Title */}
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#38bdf8', marginBottom: '2.5rem' }}>
          {cert.courseTitle}
        </h2>

        {/* Signatures & Verification Details Footer */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '2rem',
          alignItems: 'flex-end',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: '2rem',
          marginTop: '2rem'
        }}>
          {/* Instructor Signature */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'cursive', fontSize: '1.4rem', color: '#fef3c7', marginBottom: '0.25rem' }}>
              {cert.instructorName}
            </div>
            <div style={{ borderTop: '1px solid #475569', paddingTop: '0.35rem', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>
              Lead Instructor
            </div>
          </div>

          {/* Verification Badge */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#34d399', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>
              <ShieldCheck size={18} /> Verified Credential
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              Issued: {new Date(cert.issuedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>

          {/* Verification Code */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#fbbf24', fontWeight: 700, marginBottom: '0.25rem' }}>
              {cert.certificateCode}
            </div>
            <div style={{ borderTop: '1px solid #475569', paddingTop: '0.35rem', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>
              Verification Serial Code
            </div>
          </div>
        </div>

      </div>

      <style>{`
        @media print {
          body { background: #fff !important; color: #000 !important; }
          .no-print { display: none !important; }
          header, footer { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default CertificatePage;
