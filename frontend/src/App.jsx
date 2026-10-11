import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// Pages
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailsPage from './pages/CourseDetailsPage';
import CoursePlayerPage from './pages/CoursePlayerPage';
import QuizPage from './pages/QuizPage';
import CertificatePage from './pages/CertificatePage';
import CertificateVerifyPage from './pages/CertificateVerifyPage';
import StudentDashboard from './pages/StudentDashboard';
import InstructorDashboard from './pages/InstructorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LiveClassRoomPage from './pages/LiveClassRoomPage';

// Scroll to top on every navigation
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Protected Route Guard
function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px'
      }}>
        <div className="spinner" style={{ width: '40px', height: '40px' }} />
        <p style={{ color: 'var(--text-secondary)' }}>Authenticating...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole) {
    // Admin has access to everything
    if (user.role === 'ROLE_ADMIN') {
      return children;
    }
    // Check specific role
    if (user.role !== requiredRole) {
      if (user.role === 'ROLE_INSTRUCTOR') {
        return <Navigate to="/instructor" replace />;
      }
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
}

// 404 Fallback
function NotFoundPage() {
  return (
    <div style={{
      minHeight: '65vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '40px 20px'
    }}>
      <h1 style={{ fontSize: '72px', fontWeight: '900', color: 'var(--primary-color)', marginBottom: '16px' }}>404</h1>
      <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>Page Not Found</h2>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '420px', marginBottom: '24px' }}>
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn btn-primary" style={{ padding: '10px 24px' }}>
        Return Home
      </Link>
    </div>
  );
}

export default function App() {
  const location = useLocation();
  const isPlayerView = location.pathname.startsWith('/learn/') || location.pathname.startsWith('/live/');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <ScrollToTop />
      <Navbar />

      <main style={{ flex: 1 }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:id" element={<CourseDetailsPage />} />
          <Route path="/verify" element={<CertificateVerifyPage />} />
          <Route path="/certificates/:code" element={<CertificatePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Student Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/learn/:id"
            element={
              <ProtectedRoute>
                <CoursePlayerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/live/:id"
            element={
              <ProtectedRoute>
                <LiveClassRoomPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz/:id"
            element={
              <ProtectedRoute>
                <QuizPage />
              </ProtectedRoute>
            }
          />

          {/* Instructor Protected Route */}
          <Route
            path="/instructor"
            element={
              <ProtectedRoute requiredRole="ROLE_INSTRUCTOR">
                <InstructorDashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin Protected Route */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="ROLE_ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* 404 Catch All */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {!isPlayerView && <Footer />}
    </div>
  );
}
