import React, { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen,
  Users,
  PlusCircle,
  Eye,
  FileText,
  Video,
  X,
  CheckCircle2,
  AlertCircle,
  UploadCloud,
  Image,
  Film,
  Check,
  RefreshCw,
  IndianRupee,
  Radio,
  Calendar,
  Clock,
  Trash2,
  ExternalLink,
  Copy,
  Play
} from 'lucide-react';

const InstructorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user || (user.role !== 'ROLE_INSTRUCTOR' && user.role !== 'ROLE_ADMIN')) {
    return <Navigate to="/login" replace />;
  }
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('courses'); // 'courses' | 'live'

  // Price Reset Modal
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [selectedCourseForPrice, setSelectedCourseForPrice] = useState(null);
  const [newPriceInput, setNewPriceInput] = useState('0');
  const [updatingPrice, setUpdatingPrice] = useState(false);

  // Live Classes State
  const [liveClasses, setLiveClasses] = useState([]);
  const [loadingLive, setLoadingLive] = useState(false);
  const [showLiveModal, setShowLiveModal] = useState(false);
  const [submittingLive, setSubmittingLive] = useState(false);
  const [copiedLinkIndex, setCopiedLinkIndex] = useState(null);
  const [liveForm, setLiveForm] = useState({
    courseId: '',
    title: '',
    description: '',
    scheduledAt: '',
    durationMinutes: 60,
    meetingPlatform: 'JITSI',
    externalMeetingUrl: ''
  });

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedSectionId, setSelectedSectionId] = useState(null);

  // Upload states
  const [thumbnailSourceMode, setThumbnailSourceMode] = useState('upload'); // 'upload' | 'url'
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [videoSourceMode, setVideoSourceMode] = useState('upload'); // 'upload' | 'url'
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [videoFile, setVideoFile] = useState(null);

  // Form states
  const [courseForm, setCourseForm] = useState({
    title: '',
    subtitle: '',
    description: '',
    categoryId: '',
    price: '0.00',
    level: 'BEGINNER',
    thumbnailUrl: '',
    language: 'English'
  });

  const [sectionTitle, setSectionTitle] = useState('');
  const [lessonForm, setLessonForm] = useState({
    title: '',
    content: '',
    videoUrl: '',
    durationSeconds: 600,
    lessonType: 'VIDEO',
    freePreview: false
  });

  // Handle Thumbnail File Upload from Device
  const handleThumbnailUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingThumbnail(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post('/upload?folder=thumbnails', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const serverUrl = res.data?.url || res.url;
      setCourseForm(prev => ({ ...prev, thumbnailUrl: serverUrl }));
    } catch (err) {
      alert("Failed to upload thumbnail: " + (err.message || "Unknown error"));
    } finally {
      setUploadingThumbnail(false);
    }
  };

  // Handle Lecture Video Upload from Device
  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setVideoFile(file);

    // Auto-detect duration from HTML5 video metadata
    const localUrl = URL.createObjectURL(file);
    const tempVideo = document.createElement('video');
    tempVideo.preload = 'metadata';
    tempVideo.src = localUrl;
    tempVideo.onloadedmetadata = () => {
      window.URL.revokeObjectURL(tempVideo.src);
      if (tempVideo.duration && !isNaN(tempVideo.duration)) {
        setLessonForm(prev => ({
          ...prev,
          durationSeconds: Math.round(tempVideo.duration)
        }));
      }
    };

    setUploadingVideo(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post('/upload?folder=videos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const serverUrl = res.data?.url || res.url;
      setLessonForm(prev => ({ ...prev, videoUrl: serverUrl }));
    } catch (err) {
      alert("Failed to upload video lecture: " + (err.message || "Unknown error"));
    } finally {
      setUploadingVideo(false);
    }
  };

  const fetchInstructorCourses = async () => {
    try {
      const [coursesRes, catRes] = await Promise.all([
        api.get('/courses/instructor/my-courses'),
        api.get('/categories')
      ]);
      if (coursesRes.data) {
        setCourses(coursesRes.data);
      }
      if (catRes.data) {
        setCategories(catRes.data);
        if (catRes.data.length > 0 && !courseForm.categoryId) {
          setCourseForm(prev => ({ ...prev, categoryId: catRes.data[0].id }));
        }
      }
    } catch (err) {
      console.error("Instructor dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLiveClasses = async () => {
    setLoadingLive(true);
    try {
      const res = await api.get('/live-classes/instructor/my');
      const list = Array.isArray(res.data) ? res.data : (Array.isArray(res) ? res : []);
      setLiveClasses(list);
    } catch (err) {
      console.error("Failed to fetch instructor live classes:", err);
    } finally {
      setLoadingLive(false);
    }
  };

  useEffect(() => {
    fetchInstructorCourses();
    fetchLiveClasses();
  }, []);

  // Update Course Price Handler
  const handleUpdatePrice = async (e) => {
    e.preventDefault();
    if (!selectedCourseForPrice) return;
    const numericPrice = parseFloat(newPriceInput);
    if (isNaN(numericPrice) || numericPrice < 0) {
      alert("Please enter a valid price (₹0 or greater).");
      return;
    }
    setUpdatingPrice(true);
    try {
      await api.patch(`/courses/${selectedCourseForPrice.id}/price`, { price: numericPrice });
      setCourses(prev => prev.map(c => c.id === selectedCourseForPrice.id ? { ...c, price: numericPrice } : c));
      setShowPriceModal(false);
      setSelectedCourseForPrice(null);
    } catch (err) {
      alert("Failed to update course price: " + (err.response?.data?.message || err.message));
    } finally {
      setUpdatingPrice(false);
    }
  };

  // Schedule Live Class Handler
  const handleCreateLiveClass = async (e) => {
    e.preventDefault();
    if (!liveForm.courseId) {
      alert("Please select a course for this live session.");
      return;
    }
    if (!liveForm.scheduledAt) {
      alert("Please specify the scheduled date and time.");
      return;
    }
    setSubmittingLive(true);
    try {
      await api.post('/live-classes', {
        courseId: parseInt(liveForm.courseId),
        title: liveForm.title.trim(),
        description: liveForm.description.trim(),
        scheduledStartTime: new Date(liveForm.scheduledAt).toISOString(),
        scheduledAt: new Date(liveForm.scheduledAt).toISOString(),
        durationMinutes: parseInt(liveForm.durationMinutes) || 60,
        meetingPlatform: liveForm.meetingPlatform,
        meetingUrl: liveForm.meetingPlatform !== 'JITSI' && liveForm.externalMeetingUrl ? liveForm.externalMeetingUrl.trim() : null
      });
      setShowLiveModal(false);
      setLiveForm({
        courseId: courses[0]?.id || '',
        title: '',
        description: '',
        scheduledAt: '',
        durationMinutes: 60,
        meetingPlatform: 'JITSI',
        externalMeetingUrl: ''
      });
      fetchLiveClasses();
    } catch (err) {
      alert("Failed to schedule live class: " + (err.response?.data?.message || err.message));
    } finally {
      setSubmittingLive(false);
    }
  };

  const handleUpdateLiveStatus = async (liveClassId, newStatus) => {
    try {
      await api.patch(`/live-classes/${liveClassId}/status`, { status: newStatus });
      fetchLiveClasses();
      if (newStatus === 'LIVE') {
        navigate(`/live/${liveClassId}`);
      }
    } catch (err) {
      alert("Failed to update status: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteLiveClass = async (liveClassId) => {
    if (!window.confirm("Are you sure you want to cancel and delete this live class session?")) return;
    try {
      await api.delete(`/live-classes/${liveClassId}`);
      fetchLiveClasses();
    } catch (err) {
      alert("Failed to delete live class: " + (err.response?.data?.message || err.message));
    }
  };

  const handleCopyMeetingLink = (url, index) => {
    navigator.clipboard.writeText(url);
    setCopiedLinkIndex(index);
    setTimeout(() => setCopiedLinkIndex(null), 2500);
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      await api.post('/courses', {
        ...courseForm,
        price: parseFloat(courseForm.price) || 0
      });
      setShowCreateModal(false);
      setThumbnailSourceMode('upload');
      setUploadingThumbnail(false);
      setCourseForm({
        title: '',
        subtitle: '',
        description: '',
        categoryId: categories[0]?.id || '',
        price: '0.00',
        level: 'BEGINNER',
        thumbnailUrl: '',
        language: 'English'
      });
      fetchInstructorCourses();
    } catch (err) {
      alert(err.message || "Failed to create course");
    }
  };

  const handleAddSection = async (e) => {
    e.preventDefault();
    if (!selectedCourse || !sectionTitle.trim()) return;
    try {
      await api.post(`/courses/${selectedCourse.id}/sections`, {
        title: sectionTitle.trim(),
        orderIndex: (selectedCourse.sections?.length || 0) + 1
      });
      setShowSectionModal(false);
      setSectionTitle('');
      fetchInstructorCourses();
    } catch (err) {
      alert(err.message || "Failed to add section");
    }
  };

  const handleAddLesson = async (e) => {
    e.preventDefault();
    if (!selectedSectionId) return;
    try {
      await api.post(`/courses/sections/${selectedSectionId}/lessons`, {
        ...lessonForm,
        durationSeconds: parseInt(lessonForm.durationSeconds) || 300
      });
      setShowLessonModal(false);
      setVideoSourceMode('upload');
      setUploadingVideo(false);
      setVideoFile(null);
      setLessonForm({
        title: '',
        content: '',
        videoUrl: '',
        durationSeconds: 600,
        lessonType: 'VIDEO',
        freePreview: false
      });
      fetchInstructorCourses();
    } catch (err) {
      alert(err.message || "Failed to add lesson");
    }
  };

  const totalStudents = courses.reduce((acc, c) => acc + (c.enrolledStudentsCount || 0), 0);

  return (
    <div className="container" style={{ padding: '3.5rem 1.5rem', minHeight: '80vh' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span className="badge badge-primary">Instructor Studio</span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Welcome, {user?.fullName || 'Professor'}</h1>
          <p style={{ color: 'var(--text-muted)' }}>Publish engineering courses, manage dynamic pricing, and broadcast interactive live classes.</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => {
              setLiveForm(prev => ({ ...prev, courseId: courses[0]?.id || '' }));
              setShowLiveModal(true);
            }}
            className="btn btn-outline btn-lg"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderColor: '#ef4444', color: '#ef4444' }}
          >
            <Radio size={20} /> Schedule Live Class
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary btn-lg"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <PlusCircle size={20} /> Create New Course
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            <span>Courses Created</span>
            <BookOpen size={20} color="#818cf8" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{courses.length}</div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            <span>Total Students</span>
            <Users size={20} color="#38bdf8" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{totalStudents}</div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            <span>Live Class Sessions</span>
            <Radio size={20} color="#ef4444" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span style={{ fontSize: '2rem', fontWeight: 800 }}>{liveClasses.length}</span>
            {liveClasses.some(l => l.status === 'LIVE') && (
              <span className="badge badge-danger" style={{ fontSize: '0.75rem', animation: 'pulse 1.8s infinite' }}>
                1 LIVE NOW
              </span>
            )}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            <span>Platform Status</span>
            <CheckCircle2 size={20} color="#34d399" />
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#34d399' }}>Verified Instructor</div>
        </div>
      </div>

      {/* Studio Tabs Navigation */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border)', marginBottom: '2rem' }}>
        <button
          onClick={() => setActiveTab('courses')}
          style={{
            background: 'transparent',
            border: 'none',
            padding: '0.85rem 0.5rem',
            fontSize: '1.05rem',
            fontWeight: 700,
            color: activeTab === 'courses' ? '#fff' : 'var(--text-muted)',
            borderBottom: activeTab === 'courses' ? '3px solid var(--accent-primary)' : '3px solid transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <BookOpen size={18} />
          Courses &amp; Curriculum ({courses.length})
        </button>

        <button
          onClick={() => setActiveTab('live')}
          style={{
            background: 'transparent',
            border: 'none',
            padding: '0.85rem 0.5rem',
            fontSize: '1.05rem',
            fontWeight: 700,
            color: activeTab === 'live' ? '#fff' : 'var(--text-muted)',
            borderBottom: activeTab === 'live' ? '3px solid #ef4444' : '3px solid transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Radio size={18} color={liveClasses.some(l => l.status === 'LIVE') ? '#ef4444' : 'currentColor'} />
          Live Classes Studio ({liveClasses.length})
          {liveClasses.some(l => l.status === 'LIVE') && (
            <span style={{
              background: '#ef4444',
              color: '#fff',
              fontSize: '0.65rem',
              padding: '2px 7px',
              borderRadius: '9999px',
              fontWeight: 800,
              letterSpacing: '0.04em'
            }}>
              LIVE
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: Courses & Curriculum */}
      {activeTab === 'courses' && (
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Your Published &amp; Draft Courses</h2>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
              Loading courses...
            </div>
          ) : courses.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {courses.map((course) => (
                <div key={course.id} className="glass-panel" style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                    <div>
                      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <span className="badge badge-primary">{course.categoryName}</span>
                        <span className={`badge ${course.status === 'PUBLISHED' ? 'badge-success' : 'badge-warning'}`}>
                          {course.status}
                        </span>
                        <span className="badge badge-secondary">{course.level}</span>
                      </div>
                      <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.35rem' }}>{course.title}</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{course.subtitle}</p>

                      {/* Course Pricing and Meta */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginTop: '0.35rem' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px',
                          background: 'rgba(16, 185, 129, 0.12)',
                          color: '#34d399',
                          padding: '3px 10px',
                          borderRadius: '6px',
                          fontSize: '0.95rem',
                          fontWeight: 800
                        }}>
                          <IndianRupee size={14} />
                          {course.price > 0 ? course.price.toLocaleString('en-IN') : 'FREE'}
                        </span>
                        <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                          {course.enrolledStudentsCount || 0} Students &bull; {course.sections?.length || 0} Sections
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                      {/* Course Price Reset Button */}
                      <button
                        onClick={() => {
                          setSelectedCourseForPrice(course);
                          setNewPriceInput(course.price !== undefined && course.price !== null ? course.price.toString() : '0');
                          setShowPriceModal(true);
                        }}
                        className="btn btn-sm btn-outline"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', borderColor: '#10b981', color: '#10b981' }}
                        title="Reset or update course price"
                      >
                        <IndianRupee size={15} /> Reset Price
                      </button>

                      <button
                        onClick={() => { setSelectedCourse(course); setShowSectionModal(true); }}
                        className="btn btn-sm btn-outline"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                      >
                        <PlusCircle size={15} /> Add Section
                      </button>
                      <Link to={`/courses/${course.id}`} className="btn btn-sm btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Eye size={15} /> View
                      </Link>
                    </div>
                  </div>

                  {/* Sections & Lessons Explorer */}
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: '0.75rem' }}>
                      Curriculum Breakdown ({course.sections?.length || 0} Sections)
                    </span>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {course.sections && course.sections.map((sec) => (
                        <div key={sec.id} style={{ background: 'rgba(255,255,255,0.02)', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <strong style={{ fontSize: '0.9rem' }}>{sec.title}</strong>
                            <button
                              onClick={() => { setSelectedSectionId(sec.id); setShowLessonModal(true); }}
                              className="btn btn-sm btn-outline"
                              style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                            >
                              + Add Lesson
                            </button>
                          </div>

                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {sec.lessons && sec.lessons.map(l => (
                              <span key={l.id} className="badge badge-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                {l.lessonType === 'VIDEO' ? <Video size={12} /> : <FileText size={12} />}
                                {l.title}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center' }}>
              <BookOpen size={48} color="var(--text-dim)" style={{ marginBottom: '1rem' }} />
              <h3>No Courses Created Yet</h3>
              <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 1.5rem 0' }}>Click the button below to start authoring your first course.</p>
              <button onClick={() => setShowCreateModal(true)} className="btn btn-primary">
                Create First Course
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Live Classes Studio */}
      {activeTab === 'live' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Radio size={22} color="#ef4444" /> Live Classes Studio
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '4px 0 0 0' }}>
                Broadcast live lectures to enrolled students with interactive WebRTC camera, audio, screen sharing &amp; chat.
              </p>
            </div>

            <button
              onClick={() => {
                setLiveForm(prev => ({ ...prev, courseId: courses[0]?.id || '' }));
                setShowLiveModal(true);
              }}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#ef4444', borderColor: '#ef4444' }}
            >
              <PlusCircle size={18} /> Schedule Live Class
            </button>
          </div>

          {loadingLive ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
              Loading live sessions...
            </div>
          ) : liveClasses.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {liveClasses.map((item, idx) => {
                const isLiveNow = item.status === 'LIVE';
                const isScheduled = item.status === 'SCHEDULED';
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
                      padding: '1.5rem 1.75rem',
                      borderRadius: 'var(--radius-lg)',
                      border: isLiveNow ? '1px solid #ef4444' : '1px solid var(--border)',
                      boxShadow: isLiveNow ? '0 0 20px rgba(239, 68, 68, 0.15)' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                      <div style={{ flex: 1, minWidth: '280px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                          {isLiveNow ? (
                            <span className="badge badge-danger" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', animation: 'pulse 1.8s infinite' }}>
                              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fff' }} />
                              LIVE BROADCAST NOW
                            </span>
                          ) : isScheduled ? (
                            <span className="badge badge-warning" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <Clock size={12} /> SCHEDULED
                            </span>
                          ) : (
                            <span className="badge badge-secondary">
                              COMPLETED
                            </span>
                          )}

                          <span className="badge badge-primary">{item.courseTitle}</span>
                          <span className="badge badge-secondary" style={{ textTransform: 'uppercase' }}>
                            {item.meetingPlatform || 'JITSI'}
                          </span>
                        </div>

                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.35rem', color: '#fff' }}>
                          {item.title}
                        </h3>
                        {item.description && (
                          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                            {item.description}
                          </p>
                        )}

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.85rem', color: 'var(--text-dim)', flexWrap: 'wrap' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Calendar size={14} color="#818cf8" /> {formattedDate}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={14} color="#38bdf8" /> {item.durationMinutes} Minutes
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons for Instructor */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                        {isScheduled && (
                          <button
                            onClick={() => handleUpdateLiveStatus(item.id, 'LIVE')}
                            className="btn btn-sm btn-success"
                            style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                          >
                            <Play size={14} /> Start Live Broadcast
                          </button>
                        )}

                        {isLiveNow && (
                          <>
                            <Link
                              to={`/live/${item.id}`}
                              className="btn btn-sm btn-primary"
                              style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#ef4444', borderColor: '#ef4444' }}
                            >
                              <Radio size={14} /> Enter Broadcast Room
                            </Link>
                            <button
                              onClick={() => handleUpdateLiveStatus(item.id, 'COMPLETED')}
                              className="btn btn-sm btn-outline"
                              style={{ borderColor: '#ef4444', color: '#ef4444' }}
                            >
                              End Session
                            </button>
                          </>
                        )}

                        {isScheduled && (
                          <Link
                            to={`/live/${item.id}`}
                            className="btn btn-sm btn-outline"
                            style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                          >
                            <Eye size={14} /> Preview Room
                          </Link>
                        )}

                        <button
                          onClick={() => handleCopyMeetingLink(`${window.location.origin}/live/${item.id}`, idx)}
                          className="btn btn-sm btn-secondary"
                          style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                          title="Copy student join link"
                        >
                          <Copy size={14} />
                          {copiedLinkIndex === idx ? 'Copied!' : 'Share Link'}
                        </button>

                        <button
                          onClick={() => handleDeleteLiveClass(item.id)}
                          className="btn btn-sm btn-outline"
                          style={{ borderColor: 'rgba(239, 68, 68, 0.4)', color: '#f87171' }}
                          title="Delete session"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
              <Radio size={48} color="var(--text-dim)" style={{ marginBottom: '1rem' }} />
              <h3>No Live Classes Scheduled</h3>
              <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 1.5rem 0' }}>
                Schedule interactive live classes with screen sharing, WebRTC video, and instant Q&amp;A for your enrolled students.
              </p>
              <button
                onClick={() => {
                  setLiveForm(prev => ({ ...prev, courseId: courses[0]?.id || '' }));
                  setShowLiveModal(true);
                }}
                className="btn btn-primary"
                style={{ background: '#ef4444', borderColor: '#ef4444' }}
              >
                Schedule First Live Class
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal: Create Course */}
      {showCreateModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1.5rem' }}>
          <div className="glass-panel" style={{ maxWidth: '650px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '2rem', borderRadius: 'var(--radius-xl)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.4rem' }}>Create New Course</h3>
              <button onClick={() => setShowCreateModal(false)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateCourse}>
              <div className="form-group">
                <label className="form-label">Course Title</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  placeholder="e.g. Distributed Microservices with Spring Boot &amp; Docker"
                  value={courseForm.title}
                  onChange={e => setCourseForm({ ...courseForm, title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Subtitle / Tagline</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Build enterprise-grade distributed systems from scratch"
                  value={courseForm.subtitle}
                  onChange={e => setCourseForm({ ...courseForm, subtitle: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-control"
                    value={courseForm.categoryId}
                    onChange={e => setCourseForm({ ...courseForm, categoryId: e.target.value })}
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Difficulty Level</label>
                  <select
                    className="form-control"
                    value={courseForm.level}
                    onChange={e => setCourseForm({ ...courseForm, level: e.target.value })}
                  >
                    <option value="BEGINNER">Beginner</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="ADVANCED">Advanced</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Price (₹ INR, 0 for Free)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    value={courseForm.price}
                    onChange={e => setCourseForm({ ...courseForm, price: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label className="form-label" style={{ margin: 0 }}>Course Thumbnail</label>
                    <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.06)', padding: '2px', borderRadius: '6px' }}>
                      <button
                        type="button"
                        onClick={() => setThumbnailSourceMode('upload')}
                        style={{
                          padding: '2px 8px',
                          fontSize: '0.72rem',
                          borderRadius: '4px',
                          border: 'none',
                          cursor: 'pointer',
                          background: thumbnailSourceMode === 'upload' ? '#6366f1' : 'transparent',
                          color: '#fff',
                          fontWeight: thumbnailSourceMode === 'upload' ? 600 : 400
                        }}
                      >
                        Upload Device File
                      </button>
                      <button
                        type="button"
                        onClick={() => setThumbnailSourceMode('url')}
                        style={{
                          padding: '2px 8px',
                          fontSize: '0.72rem',
                          borderRadius: '4px',
                          border: 'none',
                          cursor: 'pointer',
                          background: thumbnailSourceMode === 'url' ? '#6366f1' : 'transparent',
                          color: '#fff',
                          fontWeight: thumbnailSourceMode === 'url' ? 600 : 400
                        }}
                      >
                        Paste URL
                      </button>
                    </div>
                  </div>

                  {thumbnailSourceMode === 'upload' ? (
                    <div>
                      {courseForm.thumbnailUrl ? (
                        <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.15)', height: '110px' }}>
                          <img
                            src={courseForm.thumbnailUrl}
                            alt="Thumbnail Preview"
                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                          />
                          <div style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            padding: '4px 8px',
                            background: 'rgba(15, 23, 42, 0.85)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}>
                            <span style={{ fontSize: '0.75rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Check size={13} /> Selected
                            </span>
                            <label style={{ fontSize: '0.75rem', color: '#38bdf8', cursor: 'pointer', margin: 0 }}>
                              Change File
                              <input type="file" accept="image/*" onChange={handleThumbnailUpload} style={{ display: 'none' }} />
                            </label>
                          </div>
                        </div>
                      ) : (
                        <label style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '2px dashed rgba(99, 102, 241, 0.4)',
                          borderRadius: '8px',
                          padding: '14px 10px',
                          cursor: uploadingThumbnail ? 'wait' : 'pointer',
                          background: 'rgba(99, 102, 241, 0.05)',
                          transition: 'all 0.2s',
                          height: '110px'
                        }}>
                          {uploadingThumbnail ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#a5b4fc', fontSize: '0.8rem' }}>
                              <div className="spinner" style={{ width: '16px', height: '16px' }} />
                              <span>Uploading image...</span>
                            </div>
                          ) : (
                            <>
                              <UploadCloud size={24} color="#818cf8" style={{ marginBottom: '4px' }} />
                              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#e2e8f0' }}>Choose Thumbnail Image</span>
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>PNG, JPG, WEBP from device</span>
                            </>
                          )}
                          <input type="file" accept="image/*" disabled={uploadingThumbnail} onChange={handleThumbnailUpload} style={{ display: 'none' }} />
                        </label>
                      )}
                    </div>
                  ) : (
                    <input
                      type="url"
                      className="form-control"
                      placeholder="https://images.unsplash.com/..."
                      value={courseForm.thumbnailUrl}
                      onChange={e => setCourseForm({ ...courseForm, thumbnailUrl: e.target.value })}
                    />
                  )}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Course Description</label>
                <textarea
                  className="form-control"
                  rows={4}
                  required
                  placeholder="Detailed syllabus, prerequisites, and learning objectives..."
                  value={courseForm.description}
                  onChange={e => setCourseForm({ ...courseForm, description: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowCreateModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Publish Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Section */}
      {showSectionModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1.5rem' }}>
          <div className="glass-panel" style={{ maxWidth: '450px', width: '100%', padding: '2rem', borderRadius: 'var(--radius-xl)' }}>
            <h3 style={{ marginBottom: '1.25rem' }}>Add Curriculum Section</h3>
            <form onSubmit={handleAddSection}>
              <div className="form-group">
                <label className="form-label">Section Title</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  placeholder="e.g. Module 3: Security &amp; JWT Filters"
                  value={sectionTitle}
                  onChange={e => setSectionTitle(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowSectionModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Section
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Lesson */}
      {showLessonModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1.5rem' }}>
          <div className="glass-panel" style={{ maxWidth: '580px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '2rem', borderRadius: 'var(--radius-xl)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.3rem' }}>Add Lesson Lecture</h3>
              <button onClick={() => setShowLessonModal(false)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddLesson}>
              <div className="form-group">
                <label className="form-label">Lesson Title</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  placeholder="e.g. Understanding Stateless Authentication"
                  value={lessonForm.title}
                  onChange={e => setLessonForm({ ...lessonForm, title: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Lesson Type</label>
                  <select
                    className="form-control"
                    value={lessonForm.lessonType}
                    onChange={e => setLessonForm({ ...lessonForm, lessonType: e.target.value })}
                  >
                    <option value="VIDEO">Video Lecture</option>
                    <option value="ARTICLE">Article / Text Guide</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Duration (Seconds)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={lessonForm.durationSeconds}
                    onChange={e => setLessonForm({ ...lessonForm, durationSeconds: e.target.value })}
                  />
                </div>
              </div>

              {lessonForm.lessonType === 'VIDEO' && (
                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label className="form-label" style={{ margin: 0 }}>Lecture Video</label>
                    <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.06)', padding: '2px', borderRadius: '6px' }}>
                      <button
                        type="button"
                        onClick={() => setVideoSourceMode('upload')}
                        style={{
                          padding: '3px 10px',
                          fontSize: '0.75rem',
                          borderRadius: '4px',
                          border: 'none',
                          cursor: 'pointer',
                          background: videoSourceMode === 'upload' ? '#6366f1' : 'transparent',
                          color: '#fff',
                          fontWeight: videoSourceMode === 'upload' ? 600 : 400
                        }}
                      >
                        Upload Video from Device
                      </button>
                      <button
                        type="button"
                        onClick={() => setVideoSourceMode('url')}
                        style={{
                          padding: '3px 10px',
                          fontSize: '0.75rem',
                          borderRadius: '4px',
                          border: 'none',
                          cursor: 'pointer',
                          background: videoSourceMode === 'url' ? '#6366f1' : 'transparent',
                          color: '#fff',
                          fontWeight: videoSourceMode === 'url' ? 600 : 400
                        }}
                      >
                        Paste Video Link (YouTube / URL)
                      </button>
                    </div>
                  </div>

                  {videoSourceMode === 'upload' ? (
                    <div>
                      {lessonForm.videoUrl ? (
                        <div style={{
                          border: '1px solid rgba(99, 102, 241, 0.4)',
                          borderRadius: '10px',
                          padding: '12px',
                          background: 'rgba(15, 23, 42, 0.7)'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <Film size={18} color="#38bdf8" />
                              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>
                                {videoFile?.name || 'Uploaded Video Lecture'}
                              </span>
                              {videoFile?.size && (
                                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                                  ({(videoFile.size / (1024 * 1024)).toFixed(1)} MB)
                                </span>
                              )}
                            </div>
                            <label style={{
                              fontSize: '0.8rem',
                              color: '#818cf8',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              margin: 0
                            }}>
                              <RefreshCw size={12} /> Replace Video
                              <input
                                type="file"
                                accept="video/mp4,video/webm,video/ogg,video/quicktime,video/*"
                                onChange={handleVideoUpload}
                                style={{ display: 'none' }}
                              />
                            </label>
                          </div>

                          {/* Mini video preview */}
                          <div style={{ maxHeight: '180px', borderRadius: '8px', overflow: 'hidden', background: '#000' }}>
                            <video
                              controls
                              src={lessonForm.videoUrl}
                              style={{ width: '100%', maxHeight: '180px', objectFit: 'contain' }}
                            />
                          </div>

                          <div style={{ marginTop: '8px', fontSize: '0.75rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Check size={14} /> Uploaded &amp; Ready to Stream &bull; Auto-duration: {lessonForm.durationSeconds}s
                          </div>
                        </div>
                      ) : (
                        <label style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '2px dashed rgba(99, 102, 241, 0.4)',
                          borderRadius: '10px',
                          padding: '24px 16px',
                          cursor: uploadingVideo ? 'wait' : 'pointer',
                          background: 'rgba(99, 102, 241, 0.05)',
                          transition: 'all 0.2s',
                          textAlign: 'center'
                        }}>
                          {uploadingVideo ? (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: '#a5b4fc' }}>
                              <div className="spinner" style={{ width: '28px', height: '28px' }} />
                              <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Uploading video to server...</span>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                {videoFile?.name} ({(videoFile?.size / (1024 * 1024)).toFixed(1)} MB)
                              </span>
                            </div>
                          ) : (
                            <>
                              <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '50%',
                                background: 'rgba(99, 102, 241, 0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '10px'
                              }}>
                                <Film size={24} color="#818cf8" />
                              </div>
                              <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
                                Choose Video Lecture from Device
                              </span>
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                Supports MP4, WebM, MKV, MOV (up to 500MB)
                              </span>
                              <span style={{ fontSize: '0.75rem', color: '#38bdf8', marginTop: '6px' }}>
                                Duration will be automatically detected and filled
                              </span>
                            </>
                          )}
                          <input
                            type="file"
                            accept="video/mp4,video/webm,video/ogg,video/quicktime,video/*"
                            disabled={uploadingVideo}
                            onChange={handleVideoUpload}
                            style={{ display: 'none' }}
                          />
                        </label>
                      )}
                    </div>
                  ) : (
                    <div>
                      <input
                        type="url"
                        className="form-control"
                        placeholder="https://www.youtube.com/embed/... or direct MP4 link"
                        value={lessonForm.videoUrl}
                        onChange={e => setLessonForm({ ...lessonForm, videoUrl: e.target.value })}
                      />
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                        Tip: You can use YouTube embed link or any direct video URL
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Lesson Content / Notes</label>
                <textarea
                  className="form-control"
                  rows={4}
                  placeholder="Detailed lecture notes, code snippets, or key takeaways..."
                  value={lessonForm.content}
                  onChange={e => setLessonForm({ ...lessonForm, content: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <input
                  type="checkbox"
                  id="freePreviewCheck"
                  checked={lessonForm.freePreview}
                  onChange={e => setLessonForm({ ...lessonForm, freePreview: e.target.checked })}
                />
                <label htmlFor="freePreviewCheck" style={{ fontSize: '0.875rem', cursor: 'pointer' }}>
                  Allow as Free Preview Lecture (visible before enrollment)
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setShowLessonModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Lesson
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Reset Course Price */}
      {showPriceModal && selectedCourseForPrice && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 110, padding: '1.5rem' }}>
          <div className="glass-panel" style={{ maxWidth: '520px', width: '100%', padding: '2rem', borderRadius: 'var(--radius-xl)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <IndianRupee size={22} color="#10b981" />
                <h3 style={{ fontSize: '1.35rem', margin: 0 }}>Reset Course Price</h3>
              </div>
              <button onClick={() => setShowPriceModal(false)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Update the enrollment price for <strong>{selectedCourseForPrice.title}</strong>. Current price: <strong style={{ color: '#38bdf8' }}>{selectedCourseForPrice.price > 0 ? `₹${selectedCourseForPrice.price.toLocaleString('en-IN')}` : 'FREE (₹0)'}</strong>.
            </p>

            <form onSubmit={handleUpdatePrice}>
              <label className="form-label">Quick Price Presets</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
                {[0, 299, 499, 799, 999, 1499, 1999].map(preset => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setNewPriceInput(preset.toString())}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: '1px solid',
                      borderColor: parseFloat(newPriceInput) === preset ? '#10b981' : 'rgba(255,255,255,0.15)',
                      background: parseFloat(newPriceInput) === preset ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.03)',
                      color: parseFloat(newPriceInput) === preset ? '#34d399' : 'var(--text-main)',
                      transition: 'all 0.2s'
                    }}
                  >
                    {preset === 0 ? 'Free (₹0)' : `₹${preset}`}
                  </button>
                ))}
              </div>

              <div className="form-group">
                <label className="form-label">Custom Price (₹ INR)</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontWeight: 700 }}>₹</span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    required
                    className="form-control"
                    style={{ paddingLeft: '32px', fontSize: '1.1rem', fontWeight: 700 }}
                    placeholder="Enter amount (0 for Free)"
                    value={newPriceInput}
                    onChange={e => setNewPriceInput(e.target.value)}
                  />
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                  Enter 0 to make this course 100% free for all students.
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowPriceModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={updatingPrice} className="btn btn-primary" style={{ background: '#10b981', borderColor: '#10b981' }}>
                  {updatingPrice ? 'Updating...' : 'Save New Price'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Schedule Live Class */}
      {showLiveModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 110, padding: '1.5rem' }}>
          <div className="glass-panel" style={{ maxWidth: '620px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '2rem', borderRadius: 'var(--radius-xl)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Radio size={22} color="#ef4444" />
                <h3 style={{ fontSize: '1.35rem', margin: 0 }}>Schedule Live Class Session</h3>
              </div>
              <button onClick={() => setShowLiveModal(false)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateLiveClass}>
              <div className="form-group">
                <label className="form-label">Course</label>
                <select
                  className="form-control"
                  required
                  value={liveForm.courseId}
                  onChange={e => setLiveForm({ ...liveForm, courseId: e.target.value })}
                >
                  <option value="">-- Select Course --</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Session Title</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  placeholder="e.g. Live Q&amp;A &amp; Architecture Walkthrough: Microservices"
                  value={liveForm.title}
                  onChange={e => setLiveForm({ ...liveForm, title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Session Description / Agenda</label>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="What will be covered in this live session? Bring questions and code snippets..."
                  value={liveForm.description}
                  onChange={e => setLiveForm({ ...liveForm, description: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Scheduled Date &amp; Time</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    required
                    value={liveForm.scheduledAt}
                    onChange={e => setLiveForm({ ...liveForm, scheduledAt: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Duration (Minutes)</label>
                  <input
                    type="number"
                    min="15"
                    step="5"
                    className="form-control"
                    value={liveForm.durationMinutes}
                    onChange={e => setLiveForm({ ...liveForm, durationMinutes: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Video Meeting Platform</label>
                <select
                  className="form-control"
                  value={liveForm.meetingPlatform}
                  onChange={e => setLiveForm({ ...liveForm, meetingPlatform: e.target.value })}
                >
                  <option value="JITSI">LearnHub HD Classroom (In-App WebRTC with Screen Sharing &amp; Chat - Zero Setup)</option>
                  <option value="GOOGLE_MEET">Google Meet</option>
                  <option value="ZOOM">Zoom Meeting</option>
                  <option value="YOUTUBE_LIVE">YouTube Live Stream</option>
                </select>
              </div>

              {liveForm.meetingPlatform !== 'JITSI' && (
                <div className="form-group">
                  <label className="form-label">External Meeting URL</label>
                  <input
                    type="url"
                    className="form-control"
                    required
                    placeholder="https://meet.google.com/... or https://zoom.us/j/..."
                    value={liveForm.externalMeetingUrl}
                    onChange={e => setLiveForm({ ...liveForm, externalMeetingUrl: e.target.value })}
                  />
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowLiveModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={submittingLive} className="btn btn-primary" style={{ background: '#ef4444', borderColor: '#ef4444' }}>
                  {submittingLive ? 'Scheduling...' : 'Schedule Live Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default InstructorDashboard;
