import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Clock,
  BookOpen,
  Award,
  PlayCircle,
  FileText,
  CheckCircle,
  Star,
  Users,
  Shield,
  ArrowRight,
  X,
  Sparkles
} from 'lucide-react';
import PaymentModal from '../components/payment/PaymentModal';

const CourseDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [previewLesson, setPreviewLesson] = useState(null);
  const [openSections, setOpenSections] = useState({});

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/courses/${id}`);
        if (res.data) {
          setCourse(res.data);
          // Expand all sections by default
          const initialSections = {};
          if (res.data.sections) {
            res.data.sections.forEach(s => initialSections[s.id] = true);
          }
          setOpenSections(initialSections);
        }
      } catch (err) {
        console.error("Failed to fetch course details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login?redirect=' + encodeURIComponent(`/courses/${id}`));
      return;
    }

    // If paid course, trigger UPI payment modal
    if (course.price && Number(course.price) > 0) {
      setShowPaymentModal(true);
      return;
    }

    setEnrolling(true);
    try {
      await api.post(`/enrollments/courses/${id}`);
      // Refresh course state or navigate directly to learning player
      navigate(`/learn/${id}`);
    } catch (err) {
      alert(err.message || "Enrollment failed");
    } finally {
      setEnrolling(false);
    }
  };

  const toggleSection = (sectionId) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading course details...
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <h2>Course Not Found</h2>
        <Link to="/courses" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '5rem' }}>
      
      {/* Course Banner Header */}
      <section style={{
        background: 'linear-gradient(180deg, rgba(22, 27, 34, 0.95) 0%, rgba(13, 17, 23, 0.98) 100%)',
        borderBottom: '1px solid var(--border)',
        padding: '3.5rem 0'
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3rem',
            alignItems: 'center'
          }}>
            {/* Info Col */}
            <div>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <span className="badge badge-primary">{course.categoryName}</span>
                <span className="badge badge-success">{course.level}</span>
                <span className="badge badge-secondary">{course.language}</span>
              </div>

              <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', lineHeight: 1.2, marginBottom: '1rem' }}>
                {course.title}
              </h1>

              {course.subtitle && (
                <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                  {course.subtitle}
                </p>
              )}

              {/* Instructor & Meta */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'var(--accent-gradient)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    color: '#fff'
                  }}>
                    {course.instructorName ? course.instructorName[0] : 'I'}
                  </div>
                  <span>Created by <strong>{course.instructorName}</strong></span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#fbbf24', fontWeight: 600 }}>
                  <Star size={16} fill="#fbbf24" color="#fbbf24" />
                  <span>{course.averageRating}</span>
                  <span style={{ color: 'var(--text-dim)' }}>({course.reviewsCount} reviews)</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Users size={16} color="var(--accent-secondary)" />
                  <span>{course.enrolledStudentsCount} students enrolled</span>
                </div>
              </div>
            </div>

            {/* Enrollment Action Card */}
            <div>
              <div className="glass-panel" style={{
                padding: '2rem',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid rgba(99, 102, 241, 0.4)',
                boxShadow: 'var(--shadow-glow)'
              }}>
                <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Tuition</span>
                    <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff' }}>
                      {course.price > 0 ? `₹${Number(course.price).toLocaleString('en-IN')}` : 'Free Access'}
                    </div>
                  </div>
                  {course.isEnrolled && (
                    <span className="badge badge-success">Enrolled</span>
                  )}
                </div>

                {course.isEnrolled ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--accent-secondary)' }}>Your Progress:</span>
                      <strong>{Math.round(course.studentProgressPercentage || 0)}%</strong>
                    </div>
                    <div className="progress-bar-container" style={{ height: '8px' }}>
                      <div className="progress-bar-fill" style={{ width: `${course.studentProgressPercentage || 0}%` }} />
                    </div>
                    <Link to={`/learn/${course.id}`} className="btn btn-primary btn-lg" style={{ marginTop: '0.5rem', textAlign: 'center' }}>
                      Resume Course <ArrowRight size={18} />
                    </Link>
                  </div>
                ) : (
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="btn btn-primary btn-lg"
                    style={{ width: '100%', marginBottom: '1rem' }}
                  >
                    {enrolling ? 'Enrolling...' : 'Enroll in Course Now'}
                  </button>
                )}

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem', marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock size={16} color="var(--accent-secondary)" />
                    <span>Lifetime self-paced access</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <BookOpen size={16} color="var(--accent-purple)" />
                    <span>{course.totalLessonsCount || 4} lectures &amp; quizzes</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Award size={16} color="#fbbf24" />
                    <span>Certificate of completion included</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="container" style={{ marginTop: '3rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem' }}>
          
          {/* Left Column: Description & Curriculum */}
          <div style={{ gridColumn: 'span 2' }}>
            
            {/* Description */}
            <div style={{ marginBottom: '3rem' }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Course Overview</h2>
              <div style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.975rem', whiteSpace: 'pre-line' }}>
                {course.description}
              </div>
            </div>

            {/* Curriculum Accordion */}
            <div style={{ marginBottom: '3rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.25rem' }}>
                <h2 style={{ fontSize: '1.5rem' }}>Curriculum Schedule</h2>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-dim)' }}>
                  {course.totalSectionsCount} Sections &bull; {course.totalLessonsCount} Lessons
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {course.sections && course.sections.map((section, sIndex) => (
                  <div key={section.id} className="glass-panel" style={{ overflow: 'hidden' }}>
                    
                    {/* Section Header */}
                    <div
                      onClick={() => toggleSection(section.id)}
                      style={{
                        padding: '1rem 1.25rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer',
                        background: 'rgba(255,255,255,0.03)'
                      }}
                    >
                      <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>
                        {section.title}
                      </h4>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                        {section.lessons ? section.lessons.length : 0} lectures
                      </span>
                    </div>

                    {/* Section Lessons List */}
                    {openSections[section.id] && (
                      <div style={{ borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
                        {section.lessons && section.lessons.map((lesson, lIndex) => (
                          <div
                            key={lesson.id}
                            style={{
                              padding: '0.85rem 1.25rem',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              borderBottom: lIndex < section.lessons.length - 1 ? '1px solid var(--border)' : 'none',
                              fontSize: '0.875rem'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              {lesson.lessonType === 'VIDEO' ? (
                                <PlayCircle size={18} color="var(--accent-secondary)" />
                              ) : (
                                <FileText size={18} color="var(--accent-purple)" />
                              )}
                              <span>{lesson.title}</span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                              {lesson.freePreview && (
                                <button
                                  onClick={() => setPreviewLesson(lesson)}
                                  className="btn btn-sm btn-outline"
                                  style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem', borderColor: 'var(--accent-secondary)', color: 'var(--accent-secondary)' }}
                                >
                                  Preview
                                </button>
                              )}
                              <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>
                                {lesson.durationSeconds ? `${Math.round(lesson.durationSeconds / 60)} min` : ''}
                              </span>
                            </div>
                          </div>
                        ))}

                        {/* Quizzes in section */}
                        {section.quizzes && section.quizzes.map((quiz) => (
                          <div
                            key={quiz.id}
                            style={{
                              padding: '0.85rem 1.25rem',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              background: 'rgba(99, 102, 241, 0.05)',
                              borderTop: '1px solid var(--border)'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <Sparkles size={18} color="#818cf8" />
                              <span style={{ fontWeight: 600 }}>{quiz.title}</span>
                              <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>Quiz</span>
                            </div>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                              Pass mark: {quiz.passingScore}%
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                  </div>
                ))}
              </div>
            </div>

            {/* Instructor Bio Box */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Your Instructor</h3>
              <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'var(--accent-gradient)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  color: '#fff',
                  flexShrink: 0
                }}>
                  {course.instructorName ? course.instructorName[0] : 'I'}
                </div>
                <div>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{course.instructorName}</h4>
                  <p style={{ color: 'var(--accent-secondary)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                    {course.instructorHeadline || "Senior Software Educator"}
                  </p>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    Passionate about modern software architecture, distributed systems, clean code, and preparing university students for top-tier software engineering careers.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Free Lesson Preview Modal */}
      {previewLesson && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1.5rem'
        }}>
          <div className="glass-panel" style={{
            maxWidth: '750px',
            width: '100%',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="badge badge-success">Free Preview</span>
                <h3 style={{ fontSize: '1.1rem' }}>{previewLesson.title}</h3>
              </div>
              <button
                onClick={() => setPreviewLesson(null)}
                style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '1.5rem', overflowY: 'auto' }}>
              {previewLesson.videoUrl ? (
                <div style={{ width: '100%', height: '380px', background: '#000', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', overflow: 'hidden' }}>
                  {previewLesson.videoUrl.startsWith('/uploads/') || previewLesson.videoUrl.includes('.mp4') || previewLesson.videoUrl.includes('.webm') || previewLesson.videoUrl.includes('.mov') || previewLesson.videoUrl.includes('.ogg') ? (
                    <video
                      controls
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      src={previewLesson.videoUrl}
                    />
                  ) : (
                    <iframe
                      width="100%"
                      height="100%"
                      src={previewLesson.videoUrl.includes('embed') ? previewLesson.videoUrl : (previewLesson.videoUrl.includes('watch?v=') ? previewLesson.videoUrl.replace('watch?v=', 'embed/') : "https://www.youtube.com/embed/dQw4w9WgXcQ")}
                      title={previewLesson.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ borderRadius: '12px' }}
                    />
                  )}
                </div>
              ) : null}

              <div style={{ lineHeight: 1.7, color: 'var(--text-main)', fontSize: '0.95rem' }}>
                {previewLesson.content || "Welcome to this preview lesson. Enroll in the full course to access all lectures, hands-on projects, code repositories, and verifiable certificates."}
              </div>
            </div>

            <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button onClick={() => setPreviewLesson(null)} className="btn btn-secondary">
                Close Preview
              </button>
              <button onClick={handleEnroll} className="btn btn-primary">
                Enroll to Unlock All Lessons
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UPI Payment Modal */}
      <PaymentModal
        course={course}
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSuccess={() => setCourse(prev => ({ ...prev, isEnrolled: true }))}
      />

    </div>
  );
};

export default CourseDetailsPage;
