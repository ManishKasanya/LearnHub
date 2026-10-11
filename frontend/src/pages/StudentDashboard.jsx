import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen,
  CheckCircle,
  Award,
  Clock,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Receipt,
  CreditCard,
  IndianRupee,
  Printer,
  X,
  ShieldCheck,
  Radio,
  Calendar
} from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  const [enrollments, setEnrollments] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [liveClasses, setLiveClasses] = useState([]);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('courses');
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || '',
    headline: user?.headline || '',
    bio: user?.bio || ''
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState(null);

  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.fullName || '',
        headline: user.headline || '',
        bio: user.bio || ''
      });
    }
  }, [user]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg(null);
    try {
      const res = await api.put('/auth/profile', profileData);
      if (res.data) {
        setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
        // Update local storage
        const storedUser = localStorage.getItem('learnhub_user');
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          const updated = { ...parsed, ...res.data };
          localStorage.setItem('learnhub_user', JSON.stringify(updated));
        }
      }
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
    } finally {
      setSavingProfile(false);
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [enrRes, certRes, txnRes, liveRes] = await Promise.all([
          api.get('/enrollments/my-courses?size=20'),
          api.get('/certificates/my-certificates?size=20'),
          api.get('/transactions/my-history?size=20'),
          api.get('/live-classes/student/my').catch(() => ({ data: [] }))
        ]);
        if (enrRes.data && enrRes.data.content) {
          setEnrollments(enrRes.data.content);
        }
        if (certRes.data && certRes.data.content) {
          setCertificates(certRes.data.content);
        }
        if (txnRes.data && txnRes.data.content) {
          setTransactions(txnRes.data.content);
        }
        const liveList = Array.isArray(liveRes?.data) ? liveRes.data : (Array.isArray(liveRes) ? liveRes : []);
        setLiveClasses(liveList);
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const completedCount = enrollments.filter(e => e.status === 'COMPLETED' || e.progressPercentage >= 100).length;

  return (
    <div className="container" style={{ padding: '3.5rem 1.5rem', minHeight: '80vh' }}>
      
      {/* Header Banner */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span className="badge badge-primary">Student Portal</span>
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800 }}>
          Welcome back, {user?.fullName || 'Student'}!
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
          Track your course completion, resume active lectures, and download accredited certificates.
        </p>
      </div>

      {/* Metrics Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1.25rem',
        marginBottom: '3rem'
      }}>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Enrolled Courses</span>
            <BookOpen size={20} color="#818cf8" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{enrollments.length}</div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Live Classes</span>
            <Radio size={20} color="#ef4444" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{ fontSize: '2rem', fontWeight: 800 }}>{liveClasses.length}</span>
            {liveClasses.some(l => l.status === 'LIVE') && (
              <span className="badge badge-danger" style={{ fontSize: '0.7rem', animation: 'pulse 1.8s infinite' }}>
                1 LIVE NOW
              </span>
            )}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Completed</span>
            <CheckCircle size={20} color="#34d399" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{completedCount}</div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Certificates</span>
            <Award size={20} color="#fbbf24" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{certificates.length}</div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Status</span>
            <Sparkles size={20} color="#c084fc" />
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#c084fc' }}>Active Scholar</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border)', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveTab('courses')}
          style={{
            background: 'transparent',
            border: 'none',
            padding: '0.75rem 0',
            fontSize: '1rem',
            fontWeight: 600,
            color: activeTab === 'courses' ? '#fff' : 'var(--text-muted)',
            borderBottom: activeTab === 'courses' ? '2px solid var(--accent-primary)' : '2px solid transparent',
            cursor: 'pointer'
          }}
        >
          My Courses ({enrollments.length})
        </button>

        <button
          onClick={() => setActiveTab('live')}
          style={{
            background: 'transparent',
            border: 'none',
            padding: '0.75rem 0',
            fontSize: '1rem',
            fontWeight: 600,
            color: activeTab === 'live' ? '#fff' : 'var(--text-muted)',
            borderBottom: activeTab === 'live' ? '2px solid #ef4444' : '2px solid transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Radio size={16} color={liveClasses.some(l => l.status === 'LIVE') ? '#ef4444' : 'currentColor'} />
          Live Classes ({liveClasses.length})
          {liveClasses.some(l => l.status === 'LIVE') && (
            <span style={{
              background: '#ef4444',
              color: '#fff',
              fontSize: '0.65rem',
              padding: '1px 6px',
              borderRadius: '9999px',
              fontWeight: 800,
              animation: 'pulse 1.8s infinite'
            }}>
              LIVE
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('certificates')}
          style={{
            background: 'transparent',
            border: 'none',
            padding: '0.75rem 0',
            fontSize: '1rem',
            fontWeight: 600,
            color: activeTab === 'certificates' ? '#fff' : 'var(--text-muted)',
            borderBottom: activeTab === 'certificates' ? '2px solid var(--accent-primary)' : '2px solid transparent',
            cursor: 'pointer'
          }}
        >
          My Certificates ({certificates.length})
        </button>
        <button
          onClick={() => setActiveTab('transactions')}
          style={{
            background: 'transparent',
            border: 'none',
            padding: '0.75rem 0',
            fontSize: '1rem',
            fontWeight: 600,
            color: activeTab === 'transactions' ? '#fff' : 'var(--text-muted)',
            borderBottom: activeTab === 'transactions' ? '2px solid var(--accent-primary)' : '2px solid transparent',
            cursor: 'pointer'
          }}
        >
          Payment Receipts ({transactions.length})
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          style={{
            background: 'transparent',
            border: 'none',
            padding: '0.75rem 0',
            fontSize: '1rem',
            fontWeight: 600,
            color: activeTab === 'profile' ? '#fff' : 'var(--text-muted)',
            borderBottom: activeTab === 'profile' ? '2px solid var(--accent-primary)' : '2px solid transparent',
            cursor: 'pointer'
          }}
        >
          My Profile
        </button>
      </div>

      {/* Tab 1: Enrolled Courses List */}
      {activeTab === 'courses' && (
        <div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
              Loading courses...
            </div>
          ) : enrollments.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {enrollments.map((enr) => {
                const c = enr.course;
                return (
                  <div key={enr.id} className="glass-panel" style={{
                    padding: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1.5rem',
                    borderRadius: 'var(--radius-lg)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', minWidth: '280px' }}>
                      <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '12px',
                        background: 'var(--accent-gradient)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <BookOpen size={28} color="#fff" />
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.15rem', marginBottom: '0.35rem' }}>
                          <Link to={`/courses/${c.id}`}>{c.title}</Link>
                        </h3>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                          Enrolled on {new Date(enr.enrolledAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar & Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flex: 1, justifyContent: 'flex-end', minWidth: '240px' }}>
                      <div style={{ width: '160px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.775rem', marginBottom: '4px' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Completion</span>
                          <strong>{Math.round(enr.progressPercentage)}%</strong>
                        </div>
                        <div className="progress-bar-container" style={{ height: '6px' }}>
                          <div className="progress-bar-fill" style={{ width: `${enr.progressPercentage}%` }} />
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link to={`/learn/${c.id}`} className="btn btn-sm btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          Resume <ArrowRight size={14} />
                        </Link>
                        {enr.progressPercentage >= 100 && (
                          <Link to={`/certificates`} className="btn btn-sm btn-outline">
                            Certificate
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="glass-panel" style={{ padding: '3.5rem', textAlign: 'center' }}>
              <BookOpen size={48} color="var(--text-dim)" style={{ marginBottom: '1rem' }} />
              <h3 style={{ marginBottom: '0.5rem' }}>No Courses Enrolled Yet</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Browse our catalog of engineering courses to get started.</p>
              <Link to="/courses" className="btn btn-primary">
                Browse Courses
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Tab: Live Interactive Classes */}
      {activeTab === 'live' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Radio size={20} color="#ef4444" /> Live Interactive Classes
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '4px 0 0 0' }}>
                Join HD live video sessions, live coding walkthroughs, and Q&amp;A discussions for your enrolled courses.
              </p>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
              Loading live classes...
            </div>
          ) : liveClasses.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {liveClasses.map((item) => {
                const isLive = item.status === 'LIVE';
                const rawDate = item.scheduledStartTime || item.scheduledAt;
                const formattedDate = rawDate ? new Date(rawDate).toLocaleString('en-IN', {
                  dateStyle: 'medium',
                  timeStyle: 'short'
                }) : 'Scheduled';

                return (
                  <div
                    key={item.id}
                    className="glass-panel"
                    style={{
                      padding: '1.75rem',
                      borderRadius: 'var(--radius-lg)',
                      border: isLive ? '1px solid #ef4444' : '1px solid var(--border)',
                      boxShadow: isLive ? '0 0 24px rgba(239, 68, 68, 0.2)' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.25rem' }}>
                      <div style={{ flex: 1, minWidth: '280px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem', flexWrap: 'wrap' }}>
                          {isLive ? (
                            <span className="badge badge-danger" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', animation: 'pulse 1.8s infinite' }}>
                              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fff' }} />
                              LIVE CLASSROOM BROADCASTING NOW
                            </span>
                          ) : isScheduled ? (
                            <span className="badge badge-warning" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <Clock size={12} /> UPCOMING SESSION
                            </span>
                          ) : (
                            <span className="badge badge-secondary">
                              SESSION COMPLETED
                            </span>
                          )}

                          <span className="badge badge-primary">{item.courseTitle}</span>
                        </div>

                        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.4rem', color: '#fff' }}>
                          {item.title}
                        </h3>

                        {item.description && (
                          <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', marginBottom: '0.85rem', lineHeight: '1.5' }}>
                            {item.description}
                          </p>
                        )}

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.875rem', color: 'var(--text-dim)', flexWrap: 'wrap' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Calendar size={15} color="#818cf8" /> {formattedDate}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Clock size={15} color="#38bdf8" /> Duration: {item.durationMinutes} mins
                          </span>
                          <span>
                            Host: <strong style={{ color: '#fff' }}>{item.instructorName}</strong>
                          </span>
                        </div>
                      </div>

                      {/* Join Action Button */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {isLive ? (
                          <Link
                            to={`/live/${item.id}`}
                            className="btn btn-primary btn-lg"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '8px',
                              background: '#ef4444',
                              borderColor: '#ef4444',
                              fontWeight: 800,
                              padding: '12px 24px',
                              boxShadow: '0 4px 14px rgba(239, 68, 68, 0.4)'
                            }}
                          >
                            <Radio size={18} /> Join Live Classroom Now
                          </Link>
                        ) : isScheduled ? (
                          <Link
                            to={`/live/${item.id}`}
                            className="btn btn-outline"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                          >
                            <Clock size={16} /> Enter Waiting Room
                          </Link>
                        ) : (
                          <span className="badge badge-secondary" style={{ padding: '8px 12px' }}>
                            Class Concluded
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
              <Radio size={48} color="var(--text-dim)" style={{ marginBottom: '1rem' }} />
              <h3>No Live Classes Scheduled Yet</h3>
              <p style={{ color: 'var(--text-muted)', maxWidth: '480px', margin: '0.5rem auto 1.5rem auto' }}>
                When instructors schedule live Q&amp;A sessions, webinars, or interactive lectures for courses you are enrolled in, they will be listed here.
              </p>
              <Link to="/courses" className="btn btn-primary">
                Explore More Courses
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Certificates List */}
      {activeTab === 'certificates' && (
        <div>
          {certificates.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '1.5rem'
            }}>
              {certificates.map((cert) => (
                <div key={cert.id} className="glass-panel" style={{
                  padding: '2rem',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Award size={22} color="#fbbf24" />
                    </div>
                    <div>
                      <span className="badge badge-warning" style={{ fontSize: '0.65rem' }}>Accredited</span>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{cert.courseTitle}</h4>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Instructor: <strong>{cert.instructorName}</strong><br />
                    Issued: {new Date(cert.issuedAt).toLocaleDateString()}
                  </div>

                  <div style={{
                    padding: '0.5rem',
                    background: 'rgba(0,0,0,0.3)',
                    borderRadius: '6px',
                    fontFamily: 'monospace',
                    fontSize: '0.75rem',
                    color: '#fbbf24'
                  }}>
                    {cert.certificateCode}
                  </div>

                  <Link
                    to={`/certificates/${cert.certificateCode}`}
                    className="btn btn-primary btn-sm"
                    style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                  >
                    View &amp; Print Certificate <ExternalLink size={14} />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-panel" style={{ padding: '3.5rem', textAlign: 'center' }}>
              <Award size={48} color="var(--text-dim)" style={{ marginBottom: '1rem' }} />
              <h3 style={{ marginBottom: '0.5rem' }}>No Certificates Earned Yet</h3>
              <p style={{ color: 'var(--text-muted)' }}>Complete 100% of any enrolled course to automatically unlock your official certificate.</p>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: My Profile */}
      {activeTab === 'profile' && (
        <div className="glass-panel" style={{ padding: '2.5rem', maxWidth: '720px', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ marginBottom: '1.75rem' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.35rem' }}>Student Profile</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Update your personal bio, headline, and public learning portfolio details.
            </p>
          </div>

          {profileMsg && (
            <div style={{
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              backgroundColor: profileMsg.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              border: `1px solid ${profileMsg.type === 'success' ? '#10b981' : '#ef4444'}`,
              color: profileMsg.type === 'success' ? '#34d399' : '#f87171',
              fontSize: '0.9rem'
            }}>
              {profileMsg.text}
            </div>
          )}

          <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Full Name
              </label>
              <input
                type="text"
                value={profileData.fullName}
                onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  background: 'rgba(15, 23, 42, 0.6)',
                  color: '#fff',
                  fontSize: '0.95rem',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Registered Email (Immutable)
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  background: 'rgba(15, 23, 42, 0.3)',
                  color: 'var(--text-dim)',
                  fontSize: '0.95rem',
                  cursor: 'not-allowed'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Professional Headline / Major
              </label>
              <input
                type="text"
                placeholder="e.g. Computer Science Undergrad | Aspiring Cloud Architect"
                value={profileData.headline}
                onChange={(e) => setProfileData({ ...profileData, headline: e.target.value })}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  background: 'rgba(15, 23, 42, 0.6)',
                  color: '#fff',
                  fontSize: '0.95rem',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                About Me (Bio)
              </label>
              <textarea
                rows={4}
                placeholder="Share your academic interests, coding projects, and learning objectives..."
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  background: 'rgba(15, 23, 42, 0.6)',
                  color: '#fff',
                  fontSize: '0.95rem',
                  outline: 'none',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ marginTop: '0.5rem' }}>
              <button
                type="submit"
                disabled={savingProfile}
                className="btn btn-primary"
                style={{ padding: '11px 24px', fontWeight: 700 }}
              >
                {savingProfile ? 'Saving Changes...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 4: Transactions & Receipts */}
      {activeTab === 'transactions' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 700, margin: 0 }}>Enrollment &amp; Payment Receipts</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: '4px 0 0 0' }}>
                Official payment invoices and transaction verification records for course enrollments
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: '8px', fontSize: '0.8rem', color: '#a5b4fc' }}>
              <ShieldCheck size={14} color="#38bdf8" />
              <span>Verified Gateway Payee: <strong>LearnHub Official</strong></span>
            </div>
          </div>

          {transactions.length === 0 ? (
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Receipt size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
              <h3>No transaction receipts yet</h3>
              <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                When you enroll in paid courses using PhonePe/GooglePay/UPI, receipts appear here.
              </p>
              <Link to="/courses" className="btn btn-primary">
                Browse Courses
              </Link>
            </div>
          ) : (
            <div className="glass-panel" style={{ overflowX: 'auto', borderRadius: 'var(--radius-lg)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(255, 255, 255, 0.04)', borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>Transaction ID</th>
                    <th style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>Course</th>
                    <th style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>Amount</th>
                    <th style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>Payment Method</th>
                    <th style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>Bank UTR / Ref</th>
                    <th style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>Date</th>
                    <th style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>Status</th>
                    <th style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((txn, idx) => (
                    <tr key={txn.id || idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}>
                      <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontWeight: 700, color: '#38bdf8' }}>
                        {txn.transactionCode}
                      </td>
                      <td style={{ padding: '12px 16px', fontWeight: 600, color: '#fff' }}>
                        {txn.courseTitle}
                      </td>
                      <td style={{ padding: '12px 16px', fontWeight: 800, color: '#34d399' }}>
                        ₹{Number(txn.amount || 0).toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>
                        {txn.paymentMethod || 'UPI'}
                      </td>
                      <td style={{ padding: '12px 16px', fontFamily: 'monospace', color: '#94a3b8' }}>
                        {txn.utrNumber}
                      </td>
                      <td style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        {txn.createdAt ? new Date(txn.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Today'}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span className="badge badge-success" style={{ fontSize: '0.75rem', padding: '3px 8px' }}>
                          {txn.status || 'COMPLETED'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <button
                          type="button"
                          onClick={() => setSelectedReceipt(txn)}
                          className="btn btn-sm btn-secondary"
                          style={{ padding: '4px 10px', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        >
                          <Receipt size={14} /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Printable Receipt Modal */}
      {selectedReceipt && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          backgroundColor: 'rgba(5, 7, 15, 0.85)',
          backdropFilter: 'blur(6px)'
        }}>
          <div style={{
            maxWidth: '520px',
            width: '100%',
            background: '#0f172a',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: '16px',
            padding: '2rem',
            position: 'relative',
            color: '#fff',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)'
          }}>
            <button
              onClick={() => setSelectedReceipt(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#94a3b8',
                cursor: 'pointer'
              }}
            >
              <X size={16} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Receipt size={18} color="#fff" />
              </div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>LearnHub Tax Invoice / Receipt</h3>
            </div>

            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', padding: '1rem 0', margin: '1rem 0', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#94a3b8' }}>Transaction Ref:</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#38bdf8' }}>{selectedReceipt.transactionCode}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#94a3b8' }}>Course Enrolled:</span>
                <span style={{ fontWeight: 700, color: '#fff', textAlign: 'right', maxWidth: '60%' }}>{selectedReceipt.courseTitle}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#94a3b8' }}>Student Name:</span>
                <span style={{ color: '#fff' }}>{selectedReceipt.studentName || user?.fullName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#94a3b8' }}>Student Email:</span>
                <span style={{ color: '#fff' }}>{selectedReceipt.studentEmail || user?.email}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#94a3b8' }}>Payment Method:</span>
                <span style={{ fontWeight: 700, color: '#e2e8f0' }}>{selectedReceipt.paymentMethod || 'UPI'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#94a3b8' }}>Merchant:</span>
                <span style={{ fontWeight: 700, color: '#c084fc' }}>LearnHub Official Verified Merchant</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#94a3b8' }}>Bank UTR / Ref:</span>
                <span style={{ fontFamily: 'monospace', color: '#cbd5e1' }}>{selectedReceipt.utrNumber}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', paddingTop: '10px', borderTop: '1px dashed rgba(255, 255, 255, 0.15)' }}>
                <span style={{ fontWeight: 700, fontSize: '1rem', color: '#fff' }}>Total Paid:</span>
                <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#34d399' }}>₹{Number(selectedReceipt.amount || 0).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => window.print()}
                className="btn btn-primary"
                style={{ flex: 1, padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <Printer size={16} /> Print Receipt
              </button>
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="btn btn-secondary"
                style={{ padding: '10px 18px' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default StudentDashboard;
