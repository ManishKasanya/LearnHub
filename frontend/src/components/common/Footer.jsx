import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Heart, ShieldCheck } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: 'var(--bg-primary)',
      borderTop: '1px solid var(--border)',
      marginTop: 'auto',
      padding: '3rem 0 1.5rem 0',
      position: 'relative',
      zIndex: 10
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2.5rem',
          marginBottom: '2.5rem'
        }}>
          {/* Brand Col */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <div style={{
                background: 'var(--accent-gradient)',
                borderRadius: '10px',
                width: '34px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <GraduationCap size={20} color="#fff" />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>LearnHub</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1rem' }}>
              Next-generation Full-Stack Online Learning Platform engineered for modern developers, universities, and industry certifications.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <span className="badge badge-primary">Java 17</span>
              <span className="badge badge-primary">Spring Boot 3</span>
              <span className="badge badge-primary">React 18</span>
              <span className="badge badge-primary">MySQL 8</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)' }}>Platform</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              <li><Link to="/courses" style={{ hover: { color: '#fff' } }}>Browse All Courses</Link></li>
              <li><Link to="/verify">Certificate Verification</Link></li>
              <li><Link to="/courses?category=web-development">Web Development</Link></li>
              <li><Link to="/courses?category=cloud-devops">Cloud &amp; DevOps</Link></li>
              <li><Link to="/courses?category=data-science-ai">Data Science &amp; AI</Link></li>
            </ul>
          </div>

          {/* Roles & Access */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)' }}>Portals</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              <li><Link to="/dashboard">Student Dashboard</Link></li>
              <li><Link to="/instructor">Instructor Studio</Link></li>
              <li><Link to="/admin">Administrator Portal</Link></li>
              <li><Link to="/login">Account Login</Link></li>
              <li><Link to="/register">Join as Instructor or Student</Link></li>
            </ul>
          </div>

          {/* Academic Project Info */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)' }}>Academic Project</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
              Final-Year Computer Science Engineering Project featuring decoupled multi-tier architecture, JWT stateless tokens, and relational modeling.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-secondary)', fontSize: '0.8rem' }}>
              <ShieldCheck size={16} /> Backend Quiz Verification
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid var(--border)',
          paddingTop: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          fontSize: '0.8rem',
          color: 'var(--text-dim)'
        }}>
          <div>
            &copy; {new Date().getFullYear()} LearnHub Inc. Final-Year Computer Science Project.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            Built with <Heart size={14} color="#ef4444" fill="#ef4444" /> for CS Engineering Final Project Evaluation
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
