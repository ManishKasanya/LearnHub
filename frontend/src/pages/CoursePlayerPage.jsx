import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  PlayCircle,
  FileText,
  CheckCircle,
  Circle,
  Award,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

const CoursePlayerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingProgress, setUpdatingProgress] = useState(false);

  useEffect(() => {
    fetchCourseData();
  }, [id]);

  const fetchCourseData = async () => {
    try {
      const res = await api.get(`/courses/${id}`);
      if (res.data) {
        setCourse(res.data);
        // Find first incomplete lesson or first lesson
        if (res.data.sections && res.data.sections.length > 0) {
          let foundLesson = null;
          for (const s of res.data.sections) {
            if (s.lessons && s.lessons.length > 0) {
              const incomplete = s.lessons.find(l => !l.completed);
              if (incomplete) {
                foundLesson = incomplete;
                break;
              }
              if (!foundLesson) foundLesson = s.lessons[0];
            }
          }
          if (foundLesson && !currentLesson) {
            setCurrentLesson(foundLesson);
          }
        }
      }
    } catch (err) {
      console.error("Failed to load course player:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (lesson) => {
    if (!lesson) return;
    setUpdatingProgress(true);
    const newStatus = !lesson.completed;
    try {
      await api.post(`/lessons/${lesson.id}/progress`, {
        completed: newStatus,
        watchPosition: lesson.durationSeconds || 0
      });

      // Update local state
      lesson.completed = newStatus;
      setCurrentLesson({ ...lesson });
      
      // Refresh course to update progress percentage
      await fetchCourseData();

      if (newStatus) {
        // Subtle confetti celebrate
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 }
        });
      }
    } catch (err) {
      console.error("Failed to update progress:", err);
    } finally {
      setUpdatingProgress(false);
    }
  };

  const findNextLesson = () => {
    if (!course || !course.sections || !currentLesson) return null;
    let foundCurrent = false;
    for (const section of course.sections) {
      if (section.lessons) {
        for (const l of section.lessons) {
          if (foundCurrent) return l;
          if (l.id === currentLesson.id) foundCurrent = true;
        }
      }
    }
    return null;
  };

  const nextLesson = findNextLesson();

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 0', color: 'var(--text-muted)' }}>
        Loading interactive classroom...
      </div>
    );
  }

  if (!course || !course.isEnrolled) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <h2>You are not enrolled in this course</h2>
        <p style={{ color: 'var(--text-muted)', margin: '1rem 0' }}>Please enroll to access classroom lectures and quizzes.</p>
        <Link to={`/courses/${id}`} className="btn btn-primary">
          View Course Details
        </Link>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 72px)', overflow: 'hidden' }}>
      
      {/* Top Learning Bar */}
      <div style={{
        height: '56px',
        backgroundColor: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.5rem',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to={`/courses/${course.id}`} className="btn btn-sm btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <ChevronLeft size={16} /> Course Details
          </Link>
          <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', maxWidth: '400px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {course.title}
          </span>
        </div>

        {/* Progress & Certificate Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Progress:</span>
            <div className="progress-bar-container" style={{ width: '120px', height: '8px' }}>
              <div className="progress-bar-fill" style={{ width: `${course.studentProgressPercentage || 0}%` }} />
            </div>
            <span style={{ fontSize: '0.825rem', fontWeight: 700 }}>
              {Math.round(course.studentProgressPercentage || 0)}%
            </span>
          </div>

          {course.studentProgressPercentage >= 100 && (
            <Link to="/dashboard" className="btn btn-sm btn-success" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Award size={16} /> View Certificate
            </Link>
          )}
        </div>
      </div>

      {/* Main Classroom Grid */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* Left: Player Stage & Lecture Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {currentLesson ? (
            <div>
              {/* Video Player or Article View */}
              {currentLesson.lessonType === 'VIDEO' ? (
                <div style={{
                  width: '100%',
                  aspectRatio: '16/9',
                  maxHeight: '520px',
                  backgroundColor: '#000',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-lg)',
                  marginBottom: '1.5rem'
                }}>
                  {currentLesson.videoUrl && (currentLesson.videoUrl.startsWith('/uploads/') || currentLesson.videoUrl.includes('.mp4') || currentLesson.videoUrl.includes('.webm') || currentLesson.videoUrl.includes('.mov') || currentLesson.videoUrl.includes('.ogg')) ? (
                    <video
                      key={currentLesson.videoUrl}
                      controls
                      controlsList="nodownload"
                      style={{ width: '100%', height: '100%', objectFit: 'contain', backgroundColor: '#000' }}
                      src={currentLesson.videoUrl}
                    />
                  ) : (
                    <iframe
                      width="100%"
                      height="100%"
                      src={currentLesson.videoUrl && currentLesson.videoUrl.includes('embed') ? currentLesson.videoUrl : (currentLesson.videoUrl && currentLesson.videoUrl.includes('watch?v=') ? currentLesson.videoUrl.replace('watch?v=', 'embed/') : "https://www.youtube.com/embed/dQw4w9WgXcQ")}
                      title={currentLesson.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  )}
                </div>
              ) : (
                <div className="glass-panel" style={{ padding: '2.5rem', marginBottom: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--accent-secondary)' }}>
                    <FileText size={20} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>Reading Lecture</span>
                  </div>
                  <h1 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>{currentLesson.title}</h1>
                  <div style={{ fontSize: '1rem', lineHeight: 1.8, color: 'var(--text-main)', whiteSpace: 'pre-line' }}>
                    {currentLesson.content}
                  </div>
                </div>
              )}

              {/* Lesson Control Header */}
              <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{currentLesson.title}</h2>
                  <span style={{ fontSize: '0.825rem', color: 'var(--text-dim)' }}>
                    {currentLesson.lessonType} &bull; {currentLesson.durationSeconds ? `${Math.round(currentLesson.durationSeconds / 60)} minutes` : 'Self-paced'}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <button
                    onClick={() => handleToggleComplete(currentLesson)}
                    disabled={updatingProgress}
                    className={`btn ${currentLesson.completed ? 'btn-success' : 'btn-outline'}`}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    <CheckCircle size={18} />
                    {currentLesson.completed ? 'Completed' : 'Mark as Complete'}
                  </button>

                  {nextLesson && (
                    <button
                      onClick={() => setCurrentLesson(nextLesson)}
                      className="btn btn-primary"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                      Next Lesson <ChevronRight size={18} />
                    </button>
                  )}
                </div>
              </div>

              {/* Lecture Notes */}
              {currentLesson.lessonType === 'VIDEO' && currentLesson.content && (
                <div className="glass-panel" style={{ padding: '1.5rem', marginTop: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>Lecture Summary &amp; Notes</h3>
                  <p style={{ fontSize: '0.925rem', color: 'var(--text-muted)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                    {currentLesson.content}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <h3>Select a lesson from the curriculum sidebar to start learning</h3>
            </div>
          )}

        </div>

        {/* Right: Curriculum Playlist Sidebar */}
        <div style={{
          width: '380px',
          backgroundColor: 'var(--bg-secondary)',
          borderLeft: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0
        }}>
          <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Course Content</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              {course.totalLessonsCount} lessons total
            </span>
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {course.sections && course.sections.map((section, sIdx) => (
              <div key={section.id} style={{ borderBottom: '1px solid var(--border)' }}>
                
                {/* Section Header */}
                <div style={{ padding: '0.85rem 1.25rem', background: 'rgba(255,255,255,0.02)', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-main)' }}>
                  {section.title}
                </div>

                {/* Lessons in section */}
                <div>
                  {section.lessons && section.lessons.map((lesson) => {
                    const isActive = currentLesson && currentLesson.id === lesson.id;
                    return (
                      <div
                        key={lesson.id}
                        onClick={() => setCurrentLesson(lesson)}
                        style={{
                          padding: '0.85rem 1.25rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          cursor: 'pointer',
                          backgroundColor: isActive ? 'rgba(79, 70, 229, 0.15)' : 'transparent',
                          borderLeft: isActive ? '3px solid var(--accent-primary)' : '3px solid transparent',
                          borderBottom: '1px solid rgba(255,255,255,0.03)',
                          transition: 'background 0.15s ease'
                        }}
                      >
                        <button
                          onClick={(e) => { e.stopPropagation(); handleToggleComplete(lesson); }}
                          style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
                        >
                          {lesson.completed ? (
                            <CheckCircle size={18} color="var(--success)" />
                          ) : (
                            <Circle size={18} color="var(--text-dim)" />
                          )}
                        </button>

                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.85rem', color: isActive ? '#fff' : 'var(--text-muted)', fontWeight: isActive ? 600 : 400 }}>
                            {lesson.title}
                          </div>
                          <span style={{ fontSize: '0.725rem', color: 'var(--text-dim)' }}>
                            {lesson.lessonType} {lesson.durationSeconds ? `&bull; ${Math.round(lesson.durationSeconds / 60)} min` : ''}
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  {/* Quizzes in section */}
                  {section.quizzes && section.quizzes.map((quiz) => (
                    <div
                      key={quiz.id}
                      onClick={() => navigate(`/quiz/${quiz.id}`)}
                      style={{
                        padding: '0.85rem 1.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        background: 'rgba(139, 92, 246, 0.08)',
                        borderLeft: '3px solid #8b5cf6',
                        borderBottom: '1px solid rgba(255,255,255,0.03)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <Sparkles size={16} color="#8b5cf6" />
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#c4b5fd' }}>
                            {quiz.title}
                          </div>
                          <span style={{ fontSize: '0.725rem', color: 'var(--text-dim)' }}>
                            Quiz &bull; Pass mark: {quiz.passingScore}%
                          </span>
                        </div>
                      </div>
                      <ArrowRight size={14} color="#8b5cf6" />
                    </div>
                  ))}
                </div>

              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
};

export default CoursePlayerPage;
