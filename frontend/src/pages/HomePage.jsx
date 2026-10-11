import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import CourseCard from '../components/common/CourseCard';
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  Code2,
  BrainCircuit,
  Cloud,
  ShieldCheck,
  Smartphone,
  CheckCircle2,
  Users,
  Award,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { demoLogin } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, catRes] = await Promise.all([
          api.get('/courses?size=6'),
          api.get('/categories')
        ]);
        if (courseRes.data && courseRes.data.content) {
          setCourses(courseRes.data.content);
        }
        if (catRes.data) {
          setCategories(catRes.data);
        }
      } catch (err) {
        console.error("Failed to fetch homepage data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getCategoryIcon = (iconName) => {
    switch (iconName) {
      case 'code': return <Code2 size={24} color="#60a5fa" />;
      case 'brain': return <BrainCircuit size={24} color="#c084fc" />;
      case 'cloud': return <Cloud size={24} color="#38bdf8" />;
      case 'shield': return <ShieldCheck size={24} color="#34d399" />;
      case 'smartphone': return <Smartphone size={24} color="#f472b6" />;
      default: return <BookOpen size={24} color="#818cf8" />;
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section style={{
        padding: '5rem 0 4rem 0',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid var(--border)'
      }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '880px', margin: '0 auto' }}>
          
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1rem', background: 'rgba(79, 70, 229, 0.15)', border: '1px solid rgba(79, 70, 229, 0.4)', borderRadius: 'var(--radius-full)', marginBottom: '1.5rem' }}>
            <Sparkles size={16} color="#818cf8" />
            <span style={{ fontSize: '0.825rem', fontWeight: 600, color: '#c7d2fe' }}>
              Final-Year CS Project &bull; Spring Boot 3 + React + MySQL
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.8rem)', lineHeight: 1.15, fontWeight: 800, marginBottom: '1.5rem', letterSpacing: '-0.03em' }}>
            Master Modern Computing with{' '}
            <span style={{
              background: 'linear-gradient(135deg, #818cf8 0%, #c084fc 50%, #38bdf8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              LearnHub
            </span>
          </h1>

          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '2.5rem', maxWidth: '720px', margin: '0 auto 2.5rem auto' }}>
            Full-stack online learning platform featuring interactive video classrooms, secure server-evaluated quizzes, progress tracking, and verifiable certificates.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '3.5rem' }}>
            <Link to="/courses" className="btn btn-lg btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Explore Courses <ArrowRight size={18} />
            </Link>
            <Link to="/verify" className="btn btn-lg btn-secondary">
              Verify Certificate
            </Link>
          </div>

          {/* Quick Viva Evaluator Panel */}
          <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: 'var(--radius-lg)', display: 'inline-flex', flexDirection: 'column', gap: '0.75rem', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              ⚡ 1-Click Evaluation Accounts (Auto-Login &amp; Route):
            </span>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => demoLogin('STUDENT')}
                className="btn btn-sm btn-outline"
                style={{ borderColor: 'rgba(56, 189, 248, 0.4)', color: '#38bdf8' }}
              >
                🎓 Student Account (Alice)
              </button>
              <button
                onClick={() => demoLogin('INSTRUCTOR')}
                className="btn btn-sm btn-outline"
                style={{ borderColor: 'rgba(192, 132, 252, 0.4)', color: '#c084fc' }}
              >
                👨‍🏫 Instructor Account (Dr. John)
              </button>
              <button
                onClick={() => demoLogin('ADMIN')}
                className="btn btn-sm btn-outline"
                style={{ borderColor: 'rgba(244, 63, 94, 0.4)', color: '#f43f5e' }}
              >
                🛡️ Admin Account (Review Courses)
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section style={{ padding: '3.5rem 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem'
          }}>
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(79, 70, 229, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <BookOpen size={22} color="#818cf8" />
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>Structured Curriculum</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Multi-section course progression with free previews, lecture notes, and downloadable resources.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <CheckCircle2 size={22} color="#34d399" />
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>Secure Quiz Grading</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Zero frontend score trust. Quizzes are validated and graded exclusively on the Spring Boot backend.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Award size={22} color="#38bdf8" />
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>Verifiable Certificates</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Cryptographically coded certificates automatically issued upon reaching 100% course completion.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(244, 63, 94, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Users size={22} color="#f43f5e" />
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>Role-Based Portals</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Tailored dashboards for Students, Instructors (course builders), and Admins (course moderation).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Course Categories */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
            <div>
              <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>Top Domains</span>
              <h2 style={{ fontSize: '1.85rem' }}>Explore by Category</h2>
            </div>
            <Link to="/courses" style={{ color: 'var(--accent-secondary)', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              View All <ArrowRight size={16} />
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.25rem'
          }}>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/courses?category=${cat.id}`}
                className="glass-panel"
                style={{
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  transition: 'transform 0.2s ease, border-color 0.2s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'var(--accent-primary)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
              >
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {getCategoryIcon(cat.icon)}
                </div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{cat.name}</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  {cat.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses Showcase */}
      <section style={{ padding: '3rem 0 5rem 0', backgroundColor: 'rgba(22, 27, 34, 0.3)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
            <div>
              <span className="badge badge-success" style={{ marginBottom: '0.5rem' }}>Featured Curriculum</span>
              <h2 style={{ fontSize: '1.85rem' }}>Popular Courses</h2>
            </div>
            <Link to="/courses" className="btn btn-sm btn-outline">
              See All Courses
            </Link>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
              Loading featured curriculum...
            </div>
          ) : courses.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '1.75rem'
            }}>
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)' }}>No courses published yet. Log in as Instructor or Admin to publish courses!</p>
            </div>
          )}
        </div>
      </section>

    </div>
  );
};

export default HomePage;
