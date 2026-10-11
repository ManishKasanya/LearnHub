import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, BookOpen, CheckCircle, ArrowRight } from 'lucide-react';

const CourseCard = ({ course }) => {
  const formatDuration = (seconds) => {
    if (!seconds) return '2 hrs';
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}m` : ''}`;
    }
    return `${mins}m`;
  };

  const getLevelBadge = (level) => {
    switch (level) {
      case 'BEGINNER': return <span className="badge badge-success">Beginner</span>;
      case 'INTERMEDIATE': return <span className="badge badge-warning">Intermediate</span>;
      case 'ADVANCED': return <span className="badge badge-danger">Advanced</span>;
      default: return <span className="badge badge-primary">All Levels</span>;
    }
  };

  // Fallback image gradient if thumbnail not available
  const defaultThumbnail = `https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80`;

  return (
    <div className="glass-panel" style={{
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      borderRadius: 'var(--radius-lg)',
      transition: 'all 0.3s ease',
      height: '100%',
      position: 'relative',
    }}>
      {/* Thumbnail */}
      <div style={{ position: 'relative', width: '100%', height: '175px', overflow: 'hidden' }}>
        <img
          src={course.thumbnailUrl || defaultThumbnail}
          alt={course.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1.0)'}
        />
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          display: 'flex',
          gap: '6px'
        }}>
          {getLevelBadge(course.level)}
          {course.categoryName && (
            <span className="badge badge-secondary" style={{ backdropFilter: 'blur(8px)', background: 'rgba(0,0,0,0.6)' }}>
              {course.categoryName}
            </span>
          )}
        </div>
      </div>

      {/* Body Content */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '0.65rem' }}>
        <h3 style={{
          fontSize: '1.05rem',
          fontWeight: 700,
          lineHeight: 1.4,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          minHeight: '2.8rem'
        }}>
          <Link to={`/courses/${course.id}`} style={{ color: 'var(--text-main)' }}>
            {course.title}
          </Link>
        </h3>

        {/* Instructor */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: 'var(--accent-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.75rem',
            color: '#fff',
            fontWeight: 700
          }}>
            {course.instructorName ? course.instructorName[0] : 'I'}
          </div>
          <span>{course.instructorName || 'Instructor'}</span>
        </div>

        {/* Meta Stats: Duration, Lessons, Rating */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.8rem',
          color: 'var(--text-dim)',
          borderTop: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)',
          padding: '0.5rem 0',
          marginTop: '0.25rem'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={14} color="var(--accent-secondary)" />
            {formatDuration(course.totalDurationSeconds)}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <BookOpen size={14} color="var(--accent-purple)" />
            {course.totalLessonsCount || 4} Lessons
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#fbbf24', fontWeight: 600 }}>
            <Star size={14} fill="#fbbf24" color="#fbbf24" />
            {course.averageRating || 4.9}
          </span>
        </div>

        {/* Enrolled Progress OR Pricing CTA */}
        <div style={{ marginTop: 'auto', paddingTop: '0.5rem' }}>
          {course.isEnrolled ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.775rem', marginBottom: '4px', fontWeight: 600 }}>
                <span style={{ color: 'var(--accent-secondary)' }}>Progress</span>
                <span>{Math.round(course.studentProgressPercentage || 0)}%</span>
              </div>
              <div className="progress-bar-container" style={{ height: '6px', marginBottom: '0.85rem' }}>
                <div
                  className="progress-bar-fill"
                  style={{ width: `${course.studentProgressPercentage || 0}%` }}
                />
              </div>
              <Link
                to={`/learn/${course.id}`}
                className="btn btn-sm btn-primary"
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
              >
                Resume Course <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block' }}>Tuition</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>
                  {course.price > 0 ? `₹${Number(course.price).toLocaleString('en-IN')}` : 'Free'}
                </span>
              </div>
              <Link to={`/courses/${course.id}`} className="btn btn-sm btn-primary">
                View Course
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
