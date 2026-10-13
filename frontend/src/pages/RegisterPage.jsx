import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User, GraduationCap, Briefcase, AlertCircle, CheckCircle, Server } from 'lucide-react';
import { getApiBaseUrl } from '../services/api';
import ServerConnectionDrawer from '../components/common/ServerConnectionDrawer';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'ROLE_STUDENT'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isServerModalOpen, setIsServerModalOpen] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const user = await register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });
      if (user.role === 'ROLE_INSTRUCTOR') {
        navigate('/instructor', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const currentApiUrl = getApiBaseUrl();
  const isConnectionError = error && (
    error.includes('Unable to connect') ||
    error.includes('Network Error') ||
    error.includes('ERR_NETWORK') ||
    error.includes('404')
  );

  return (
    <div style={{
      minHeight: '85vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      position: 'relative'
    }}>
      {/* Background glow effects */}
      <div style={{
        position: 'absolute',
        top: '15%',
        right: '25%',
        width: '350px',
        height: '350px',
        background: 'rgba(99, 102, 241, 0.15)',
        filter: 'blur(110px)',
        borderRadius: '50%',
        pointerEvents: 'none'
      }} />

      <div style={{ maxWidth: '500px', width: '100%', zIndex: 1 }}>
        <div className="card glass-card" style={{ padding: '36px 32px' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #10b981, #6366f1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.35)'
            }}>
              <UserPlus size={26} color="#ffffff" />
            </div>
            <h2 style={{ fontSize: '26px', fontWeight: '800', marginBottom: '8px' }}>
              Create your account
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              Join thousands of learners and instructors on LearnHub
            </p>
          </div>

          {error && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              padding: '12px 14px',
              borderRadius: '10px',
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              fontSize: '13px',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{error}</span>
              </div>
              {isConnectionError && (
                <button
                  type="button"
                  onClick={() => setIsServerModalOpen(true)}
                  style={{
                    alignSelf: 'flex-start',
                    marginTop: '4px',
                    background: 'rgba(239, 68, 68, 0.25)',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    color: '#ffffff',
                    padding: '5px 10px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Configure Backend Server URL &rarr;
                </button>
              )}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Account Type Selector */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: 'var(--text-secondary)' }}>
                I want to join as:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <button
                  type="button"
                  id="role-student-btn"
                  onClick={() => setFormData({ ...formData, role: 'ROLE_STUDENT' })}
                  style={{
                    padding: '12px',
                    borderRadius: '10px',
                    border: formData.role === 'ROLE_STUDENT' ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
                    background: formData.role === 'ROLE_STUDENT' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(15, 23, 42, 0.4)',
                    color: formData.role === 'ROLE_STUDENT' ? 'var(--primary-color)' : 'var(--text-secondary)',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <GraduationCap size={18} />
                  <span>Student</span>
                </button>
                <button
                  type="button"
                  id="role-instructor-btn"
                  onClick={() => setFormData({ ...formData, role: 'ROLE_INSTRUCTOR' })}
                  style={{
                    padding: '12px',
                    borderRadius: '10px',
                    border: formData.role === 'ROLE_INSTRUCTOR' ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
                    background: formData.role === 'ROLE_INSTRUCTOR' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(15, 23, 42, 0.4)',
                    color: formData.role === 'ROLE_INSTRUCTOR' ? 'var(--primary-color)' : 'var(--text-secondary)',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <Briefcase size={18} />
                  <span>Instructor</span>
                </button>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: 'var(--text-secondary)' }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  name="fullName"
                  id="register-fullname-input"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  style={{
                    width: '100%',
                    padding: '13px 14px 13px 44px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-color)',
                    background: 'rgba(15, 23, 42, 0.6)',
                    color: 'var(--text-primary)',
                    fontSize: '15px',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: 'var(--text-secondary)' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  name="email"
                  id="register-email-input"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  required
                  style={{
                    width: '100%',
                    padding: '13px 14px 13px 44px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-color)',
                    background: 'rgba(15, 23, 42, 0.6)',
                    color: 'var(--text-primary)',
                    fontSize: '15px',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: 'var(--text-secondary)' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-muted)' }} />
                  <input
                    type="password"
                    name="password"
                    id="register-password-input"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    style={{
                      width: '100%',
                      padding: '13px 14px 13px 44px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-color)',
                      background: 'rgba(15, 23, 42, 0.6)',
                      color: 'var(--text-primary)',
                      fontSize: '15px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: 'var(--text-secondary)' }}>
                  Confirm Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-muted)' }} />
                  <input
                    type="password"
                    name="confirmPassword"
                    id="register-confirmpassword-input"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    style={{
                      width: '100%',
                      padding: '13px 14px 13px 44px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-color)',
                      background: 'rgba(15, 23, 42, 0.6)',
                      color: 'var(--text-primary)',
                      fontSize: '15px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              id="register-submit-btn"
              disabled={loading}
              className="btn btn-primary"
              style={{
                marginTop: '10px',
                padding: '14px',
                fontSize: '16px',
                fontWeight: '700',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {loading ? (
                <>
                  <div className="spinner" style={{ width: '18px', height: '18px' }} />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <UserPlus size={18} />
                  <span>Sign Up</span>
                </>
              )}
            </button>
          </form>

          {/* Footer link */}
          <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: '600', textDecoration: 'none' }}>
              Sign In
            </Link>
          </div>

          {/* Server Connection Indicator Pill */}
          <div style={{
            marginTop: '20px',
            paddingTop: '16px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <button
              type="button"
              onClick={() => setIsServerModalOpen(true)}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                padding: '5px 12px',
                color: '#94a3b8',
                fontSize: '11px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              title="Click to check or change backend API server"
            >
              <Server size={12} color="#818cf8" />
              <span>API: <code style={{ color: '#c7d2fe' }}>{currentApiUrl}</code></span>
            </button>
          </div>
        </div>
      </div>

      {/* Backend Server Settings Drawer */}
      <ServerConnectionDrawer
        isOpen={isServerModalOpen}
        onClose={() => setIsServerModalOpen(false)}
      />
    </div>
  );
}
