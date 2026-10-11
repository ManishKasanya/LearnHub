import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  GraduationCap,
  Search,
  BookOpen,
  LayoutDashboard,
  ShieldAlert,
  LogOut,
  User as UserIcon,
  ChevronDown,
  Award,
  Radio
} from 'lucide-react';

const Navbar = () => {
  const { user, logout, isStudent, isInstructor, isAdmin } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backdropFilter: 'blur(16px)',
      backgroundColor: 'rgba(13, 17, 23, 0.85)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px', gap: '1.5rem' }}>
        
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}>
          <div style={{
            background: 'var(--accent-gradient)',
            borderRadius: '12px',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--accent-glow)'
          }}>
            <GraduationCap size={24} color="#ffffff" />
          </div>
          <div>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.03em', background: 'linear-gradient(90deg, #fff 0%, #a5b4fc 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              LearnHub
            </span>
            <span style={{ fontSize: '0.65rem', display: 'block', color: 'var(--accent-secondary)', fontWeight: 600, marginTop: '-3px' }}>
              ONLINE ACADEMY
            </span>
          </div>
        </Link>

        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} style={{ flex: '1', maxWidth: '400px', position: 'relative' }}>
          <Search size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-control"
            placeholder="Search courses, skills, instructors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '40px', height: '42px', fontSize: '0.875rem' }}
          />
        </form>

        {/* Center / Right Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <Link to="/courses" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-main)' }}>
            <BookOpen size={16} /> Explore
          </Link>

          {user && (
            <Link
              to={isInstructor ? "/instructor" : "/dashboard"}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: '#f87171'
              }}
            >
              <Radio size={16} color="#ef4444" /> Live Classes
            </Link>
          )}

          <Link to="/verify" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-muted)' }}>
            <Award size={16} /> Verify Certificate
          </Link>

          {/* User Status / Profile */}
          {user ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-full)',
                  padding: '4px 12px 4px 6px',
                  cursor: 'pointer',
                  color: 'var(--text-main)'
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'var(--accent-gradient)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.85rem',
                  fontWeight: 700
                }}>
                  {user.fullName ? user.fullName[0].toUpperCase() : 'U'}
                </div>
                <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.825rem', fontWeight: 600 }}>{user.fullName || user.email}</span>
                  <span style={{ fontSize: '0.675rem', color: 'var(--accent-secondary)' }}>
                    {isAdmin ? 'Admin' : isInstructor ? 'Instructor' : 'Student'}
                  </span>
                </div>
                <ChevronDown size={14} color="var(--text-muted)" />
              </button>

              {dropdownOpen && (
                <div className="glass-panel" style={{
                  position: 'absolute',
                  top: '115%',
                  right: 0,
                  width: '210px',
                  padding: '0.5rem',
                  borderRadius: 'var(--radius-md)',
                  zIndex: 100,
                  boxShadow: 'var(--shadow-lg)'
                }}>
                  {isStudent && (
                    <Link
                      to="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 0.75rem', fontSize: '0.875rem', borderRadius: '6px' }}
                      onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.06)'}
                      onMouseLeave={(e) => e.target.style.background = 'transparent'}
                    >
                      <LayoutDashboard size={16} /> My Dashboard
                    </Link>
                  )}

                  {isInstructor && (
                    <Link
                      to="/instructor"
                      onClick={() => setDropdownOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 0.75rem', fontSize: '0.875rem', borderRadius: '6px' }}
                      onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.06)'}
                      onMouseLeave={(e) => e.target.style.background = 'transparent'}
                    >
                      <BookOpen size={16} /> Instructor Studio
                    </Link>
                  )}

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setDropdownOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 0.75rem', fontSize: '0.875rem', borderRadius: '6px' }}
                      onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.06)'}
                      onMouseLeave={(e) => e.target.style.background = 'transparent'}
                    >
                      <ShieldAlert size={16} /> Admin Portal
                    </Link>
                  )}

                  <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '0.35rem 0' }} />

                  <button
                    onClick={() => { logout(); setDropdownOpen(false); navigate('/'); }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.6rem 0.75rem',
                      fontSize: '0.875rem',
                      color: 'var(--danger)',
                      background: 'transparent',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.1)'}
                    onMouseLeave={(e) => e.target.style.background = 'transparent'}
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Link to="/login" className="btn btn-sm btn-outline">
                Log In
              </Link>
              <Link to="/register" className="btn btn-sm btn-primary">
                Get Started
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
