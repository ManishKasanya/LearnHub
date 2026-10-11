import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  ShieldAlert,
  Users,
  BookOpen,
  Award,
  CheckCircle,
  XCircle,
  ToggleLeft,
  ToggleRight,
  PlusCircle,
  IndianRupee,
  AlertTriangle,
  Database,
  Play,
  ExternalLink,
  Terminal,
  CreditCard,
  Phone,
  Receipt
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();

  if (!user || user.role !== 'ROLE_ADMIN') {
    return <Navigate to="/login" replace />;
  }
  const [stats, setStats] = useState(null);
  const [pendingCourses, setPendingCourses] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState('courses');
  const [loading, setLoading] = useState(true);

  // Database Studio State
  const [sqlQuery, setSqlQuery] = useState('SELECT id, full_name, email, role, is_active FROM users;');
  const [queryResult, setQueryResult] = useState(null);
  const [queryLoading, setQueryLoading] = useState(false);
  const [queryMsg, setQueryMsg] = useState(null);

  // New Category Form
  const [newCat, setNewCat] = useState({ name: '', slug: '', description: '', icon: 'code' });
  const [rejectReason, setRejectReason] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  const fetchAdminData = async () => {
    try {
      const [statsRes, pendingRes, usersRes, catRes, txnRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/courses/pending'),
        api.get('/admin/users?size=20'),
        api.get('/categories'),
        api.get('/transactions/admin/all?size=50')
      ]);

      if (statsRes.data) setStats(statsRes.data);
      if (pendingRes.data) setPendingCourses(pendingRes.data.content || []);
      if (usersRes.data) setUsersList(usersRes.data.content || []);
      if (catRes.data) setCategories(catRes.data);
      if (txnRes.data) setTransactions(txnRes.data.content || []);
    } catch (err) {
      console.error("Admin portal error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleCourseStatus = async (courseId, status) => {
    try {
      await api.patch(`/courses/${courseId}/status`, {
        status: status,
        reason: status === 'REJECTED' ? rejectReason : null
      });
      setSelectedCourseId(null);
      setRejectReason('');
      fetchAdminData();
    } catch (err) {
      alert(err.message || "Failed to update course status");
    }
  };

  const handleToggleUser = async (userId) => {
    try {
      await api.patch(`/admin/users/${userId}/toggle-status`);
      fetchAdminData();
    } catch (err) {
      alert(err.message || "Failed to update user status");
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/categories', newCat);
      setNewCat({ name: '', slug: '', description: '', icon: 'code' });
      fetchAdminData();
    } catch (err) {
      alert(err.message || "Failed to create category");
    }
  };

  const handleExecuteQuery = async (queryToRun) => {
    const q = queryToRun || sqlQuery;
    if (!q || !q.trim()) return;
    setQueryLoading(true);
    setQueryMsg(null);
    try {
      const res = await api.post('/admin/database/query', { query: q });
      if (res.data) {
        setQueryResult(res.data);
        setQueryMsg({ type: 'success', text: res.message || 'Query executed successfully' });
      }
    } catch (err) {
      setQueryMsg({ type: 'error', text: err.response?.data?.message || err.message || 'SQL Execution failed' });
    } finally {
      setQueryLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '3.5rem 1.5rem', minHeight: '80vh' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span className="badge badge-danger">Administrator Root</span>
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Platform Administration</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Review submitted courses, monitor platform enrollment metrics, manage accounts, and configure taxonomies.
        </p>
      </div>

      {/* Overview Metrics Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1.25rem',
        marginBottom: '3rem'
      }}>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            <span>Total Users</span>
            <Users size={20} color="#818cf8" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{stats?.totalUsers || 3}</div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            {stats?.totalStudents || 1} Students &bull; {stats?.totalInstructors || 1} Instructors
          </span>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            <span>Total Courses</span>
            <BookOpen size={20} color="#38bdf8" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{stats?.totalCourses || 1}</div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            {stats?.publishedCourses || 1} Published &bull; {stats?.pendingApprovalCourses || 0} Pending
          </span>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            <span>Enrollments</span>
            <Award size={20} color="#34d399" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{stats?.totalEnrollments || 1}</div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            Active course registrations
          </span>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            <span>Platform Revenue</span>
            <IndianRupee size={20} color="#fbbf24" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fbbf24' }}>
            ₹{stats?.totalRevenue ? Number(stats.totalRevenue).toLocaleString('en-IN') : '4,999'}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            Simulated tuition volume
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border)', marginBottom: '2rem' }}>
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
          Pending Approvals ({pendingCourses.length})
        </button>

        <button
          onClick={() => setActiveTab('users')}
          style={{
            background: 'transparent',
            border: 'none',
            padding: '0.75rem 0',
            fontSize: '1rem',
            fontWeight: 600,
            color: activeTab === 'users' ? '#fff' : 'var(--text-muted)',
            borderBottom: activeTab === 'users' ? '2px solid var(--accent-primary)' : '2px solid transparent',
            cursor: 'pointer'
          }}
        >
          User Accounts ({usersList.length})
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          style={{
            background: 'transparent',
            border: 'none',
            padding: '0.75rem 0',
            fontSize: '1rem',
            fontWeight: 600,
            color: activeTab === 'categories' ? '#fff' : 'var(--text-muted)',
            borderBottom: activeTab === 'categories' ? '2px solid var(--accent-primary)' : '2px solid transparent',
            cursor: 'pointer'
          }}
        >
          Categories Manager ({categories.length})
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
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <CreditCard size={16} /> Transactions ({transactions.length})
        </button>

        <button
          onClick={() => setActiveTab('database')}
          style={{
            background: 'transparent',
            border: 'none',
            padding: '0.75rem 0',
            fontSize: '1rem',
            fontWeight: 600,
            color: activeTab === 'database' ? '#fff' : 'var(--text-muted)',
            borderBottom: activeTab === 'database' ? '2px solid var(--accent-primary)' : '2px solid transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <Database size={16} /> Database Studio
        </button>
      </div>

      {/* Tab 1: Course Approvals */}
      {activeTab === 'courses' && (
        <div>
          {pendingCourses.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {pendingCourses.map(course => (
                <div key={course.id} className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <span className="badge badge-warning" style={{ marginBottom: '0.5rem' }}>Pending Review</span>
                      <h3 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>{course.title}</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{course.subtitle}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.4rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                          Instructor: <strong style={{ color: '#fff' }}>{course.instructor?.fullName || course.instructorName || 'Instructor'}</strong> &bull; Category: <strong style={{ color: '#fff' }}>{course.category?.name || course.categoryName || 'General'}</strong>
                        </span>
                        <span className="badge badge-secondary" style={{ fontSize: '0.75rem' }}>{course.level || 'BEGINNER'}</span>
                        <span style={{ fontWeight: 700, color: '#34d399', fontSize: '0.85rem' }}>
                          {course.price && Number(course.price) > 0 ? `₹${Number(course.price).toLocaleString('en-IN')}` : 'Free'}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <button
                        onClick={() => handleCourseStatus(course.id, 'PUBLISHED')}
                        className="btn btn-sm btn-success"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                      >
                        <CheckCircle size={16} /> Approve &amp; Publish
                      </button>
                      <button
                        onClick={() => setSelectedCourseId(course.id)}
                        className="btn btn-sm btn-danger"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                      >
                        <XCircle size={16} /> Reject
                      </button>
                    </div>
                  </div>

                  {selectedCourseId === course.id && (
                    <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                      <label className="form-label" style={{ fontSize: '0.85rem' }}>Rejection Reason (Sent to Instructor):</label>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g. Please add a video preview or expand section 2..."
                          value={rejectReason}
                          onChange={e => setRejectReason(e.target.value)}
                        />
                        <button
                          onClick={() => handleCourseStatus(course.id, 'REJECTED')}
                          className="btn btn-sm btn-danger"
                        >
                          Confirm Rejection
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-panel" style={{ padding: '3.5rem', textAlign: 'center' }}>
              <CheckCircle size={48} color="var(--success)" style={{ marginBottom: '1rem' }} />
              <h3>All Courses Reviewed!</h3>
              <p style={{ color: 'var(--text-muted)' }}>There are currently no courses pending administrator approval.</p>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: User Accounts Table */}
      {activeTab === 'users' && (
        <div className="glass-panel" style={{ overflowX: 'auto', borderRadius: 'var(--radius-lg)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.03)' }}>
                <th style={{ padding: '1rem 1.25rem' }}>User</th>
                <th style={{ padding: '1rem 1.25rem' }}>Role</th>
                <th style={{ padding: '1rem 1.25rem' }}>Status</th>
                <th style={{ padding: '1rem 1.25rem' }}>Joined</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {usersList.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <div style={{ fontWeight: 600 }}>{u.fullName}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{u.email}</div>
                  </td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <span className={`badge ${u.role === 'ROLE_ADMIN' ? 'badge-danger' : u.role === 'ROLE_INSTRUCTOR' ? 'badge-primary' : 'badge-secondary'}`}>
                      {u.role.replace('ROLE_', '')}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <span className={`badge ${u.active ? 'badge-success' : 'badge-danger'}`}>
                      {u.active ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', color: 'var(--text-dim)', fontSize: '0.825rem' }}>
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                    {u.role !== 'ROLE_ADMIN' && (
                      <button
                        onClick={() => handleToggleUser(u.id)}
                        className={`btn btn-sm ${u.active ? 'btn-outline' : 'btn-success'}`}
                      >
                        {u.active ? 'Suspend' : 'Activate'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: Category Management */}
      {activeTab === 'categories' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {/* Add Category Form */}
          <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>Add New Domain</h3>
            <form onSubmit={handleCreateCategory}>
              <div className="form-group">
                <label className="form-label">Category Name</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  placeholder="e.g. Artificial Intelligence"
                  value={newCat.name}
                  onChange={e => setNewCat({ ...newCat, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-') })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Slug</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={newCat.slug}
                  onChange={e => setNewCat({ ...newCat, slug: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="Brief overview of topic..."
                  value={newCat.description}
                  onChange={e => setNewCat({ ...newCat, description: e.target.value })}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                Create Category
              </button>
            </form>
          </div>

          {/* Existing Categories List */}
          <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>Active Domains</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {categories.map(c => (
                <div key={c.id} style={{ padding: '0.85rem 1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ fontSize: '0.95rem' }}>{c.name}</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>/{c.slug}</div>
                  </div>
                  <span className="badge badge-success">Live</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Database Studio & SQL Console */}
      {activeTab === 'database' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Top Banner: H2 Console Direct Link */}
          <div className="glass-panel" style={{
            padding: '1.75rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.25rem'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <Database size={20} color="var(--primary-color)" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Master Database Access (H2 / MySQL)</h3>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>
                Direct file database connection: <code>jdbc:h2:file:./data/learnhub_db</code> &bull; User: <code>sa</code> &bull; Password: <em>(blank)</em>
              </p>
            </div>

            <a
              href="http://localhost:8080/h2-console"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '10px 18px' }}
            >
              Open H2 Web Console <ExternalLink size={16} />
            </a>
          </div>

          {/* Interactive SQL Console */}
          <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Terminal size={18} color="var(--accent-secondary)" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Interactive SQL Query Runner</h3>
            </div>

            {/* Quick Query Presets */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', alignSelf: 'center', marginRight: '0.25rem' }}>
                Quick Tables:
              </span>
              {[
                { label: 'Users', q: 'SELECT id, full_name, email, role, is_active FROM users;' },
                { label: 'Courses', q: 'SELECT id, title, price, status, level FROM courses;' },
                { label: 'Enrollments', q: 'SELECT id, student_id, course_id, progress_percentage, status FROM enrollments;' },
                { label: 'Certificates', q: 'SELECT id, certificate_code, student_id, course_id, issued_at FROM certificates;' },
                { label: 'Quizzes', q: 'SELECT id, title, passing_score, time_limit_minutes FROM quizzes;' },
                { label: 'Questions', q: 'SELECT id, quiz_id, question_text, correct_option_index FROM questions;' },
                { label: 'Categories', q: 'SELECT id, name, slug FROM categories;' },
                { label: 'Show Tables', q: 'SHOW TABLES;' }
              ].map(preset => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => { setSqlQuery(preset.q); handleExecuteQuery(preset.q); }}
                  className="btn btn-sm btn-secondary"
                  style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* SQL Input Area */}
            <div style={{ marginBottom: '1rem' }}>
              <textarea
                rows={3}
                value={sqlQuery}
                onChange={e => setSqlQuery(e.target.value)}
                placeholder="Enter SQL statement (e.g. SELECT * FROM users;)"
                style={{
                  width: '100%',
                  fontFamily: 'monospace',
                  fontSize: '0.9rem',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  background: 'rgba(15, 23, 42, 0.7)',
                  color: '#38bdf8',
                  outline: 'none',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                type="button"
                disabled={queryLoading}
                onClick={() => handleExecuteQuery()}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '9px 20px', fontWeight: 700 }}
              >
                <Play size={16} fill="currentColor" />
                {queryLoading ? 'Executing SQL...' : 'Run Query'}
              </button>

              {queryResult?.rowCount !== undefined && (
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Returned <strong>{queryResult.rowCount}</strong> rows
                </span>
              )}
            </div>

            {/* Status Message */}
            {queryMsg && (
              <div style={{
                marginTop: '1rem',
                padding: '10px 14px',
                borderRadius: '8px',
                background: queryMsg.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                border: `1px solid ${queryMsg.type === 'success' ? '#10b981' : '#ef4444'}`,
                color: queryMsg.type === 'success' ? '#34d399' : '#f87171',
                fontSize: '0.85rem'
              }}>
                {queryMsg.text}
              </div>
            )}

            {/* Query Results Table */}
            {queryResult?.rows && queryResult.rows.length > 0 && (
              <div style={{ marginTop: '1.5rem', overflowX: 'auto', border: '1px solid var(--border)', borderRadius: '8px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.825rem', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255, 255, 255, 0.05)', borderBottom: '1px solid var(--border)' }}>
                      {queryResult.columns.map(col => (
                        <th key={col} style={{ padding: '10px 12px', color: 'var(--text-muted)', fontWeight: 700 }}>
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {queryResult.rows.map((row, idx) => (
                      <tr key={idx} style={{
                        borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
                        background: idx % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.015)'
                      }}>
                        {queryResult.columns.map(col => (
                          <td key={col} style={{ padding: '8px 12px', color: '#fff', fontFamily: typeof row[col] === 'number' ? 'monospace' : 'inherit' }}>
                            {row[col] !== null && row[col] !== undefined ? String(row[col]) : <em style={{ color: 'var(--text-dim)' }}>NULL</em>}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 5: Transactions & Payment Reconciliation */}
      {activeTab === 'transactions' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Payee Info Banner */}
          <div className="glass-panel" style={{
            padding: '1.5rem 2rem',
            borderRadius: 'var(--radius-xl)',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(168, 85, 247, 0.12) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <Receipt size={18} color="#38bdf8" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>Platform Payment &amp; Transaction Reconciliation</h3>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>
                Real-time tracking of all verified transactions, course enrollment revenue, and payment reconciliation records.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '10px 16px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.1)', textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Transactions</span>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#38bdf8' }}>{transactions.length}</div>
              </div>
              <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '10px 16px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.1)', textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Revenue</span>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#34d399' }}>
                  ₹{transactions.reduce((sum, t) => sum + Number(t.amount || 0), 0).toLocaleString('en-IN')}
                </div>
              </div>
            </div>
          </div>

          {/* Transactions Table */}
          {transactions.length === 0 ? (
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <CreditCard size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
              <h3>No transaction records yet</h3>
              <p style={{ fontSize: '0.9rem' }}>
                New student enrollments and verified payment records will immediately show here.
              </p>
            </div>
          ) : (
            <div className="glass-panel" style={{ overflowX: 'auto', borderRadius: 'var(--radius-lg)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(255, 255, 255, 0.04)', borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '12px 14px', color: 'var(--text-muted)' }}>TXN ID</th>
                    <th style={{ padding: '12px 14px', color: 'var(--text-muted)' }}>Student Name &amp; Email</th>
                    <th style={{ padding: '12px 14px', color: 'var(--text-muted)' }}>Course</th>
                    <th style={{ padding: '12px 14px', color: 'var(--text-muted)' }}>Amount</th>
                    <th style={{ padding: '12px 14px', color: 'var(--text-muted)' }}>Reference ID</th>
                    <th style={{ padding: '12px 14px', color: 'var(--text-muted)' }}>Method</th>
                    <th style={{ padding: '12px 14px', color: 'var(--text-muted)' }}>Bank UTR / Ref</th>
                    <th style={{ padding: '12px 14px', color: 'var(--text-muted)' }}>Date &amp; Time</th>
                    <th style={{ padding: '12px 14px', color: 'var(--text-muted)' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((txn, idx) => (
                    <tr key={txn.id || idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}>
                      <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontWeight: 700, color: '#38bdf8' }}>
                        {txn.transactionCode}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: 600, color: '#fff' }}>{txn.studentName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{txn.studentEmail}</div>
                      </td>
                      <td style={{ padding: '12px 14px', fontWeight: 600, color: '#e2e8f0', maxWidth: '200px' }}>
                        {txn.courseTitle}
                      </td>
                      <td style={{ padding: '12px 14px', fontWeight: 800, color: '#34d399', fontSize: '0.95rem' }}>
                        ₹{Number(txn.amount || 0).toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '12px 14px', color: '#38bdf8', fontFamily: 'monospace', fontWeight: 700 }}>
                        {txn.orderId || txn.transactionCode}
                      </td>
                      <td style={{ padding: '12px 14px', color: 'var(--text-muted)' }}>
                        {txn.paymentMethod || 'UPI'}
                      </td>
                      <td style={{ padding: '12px 14px', fontFamily: 'monospace', color: '#cbd5e1' }}>
                        {txn.utrNumber}
                      </td>
                      <td style={{ padding: '12px 14px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        {txn.createdAt ? new Date(txn.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span className="badge badge-success" style={{ fontSize: '0.75rem', padding: '3px 8px' }}>
                          {txn.status || 'COMPLETED'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
