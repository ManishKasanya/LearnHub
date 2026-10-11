import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  Radio,
  ArrowLeft,
  Users,
  Video,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Clock,
  Sparkles,
  PhoneOff
} from 'lucide-react';

export default function LiveClassRoomPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [liveClass, setLiveClass] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [endingClass, setEndingClass] = useState(false);

  const fetchLiveClass = async () => {
    try {
      const res = await api.get(`/live-classes/${id}`);
      const session = res?.data?.id ? res.data : (res?.id ? res : res?.data);
      if (session) {
        setLiveClass(session);
      }
    } catch (err) {
      setError(err.message || 'Failed to load live class room');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveClass();
  }, [id]);

  const handleEndClass = async () => {
    if (!window.confirm("Are you sure you want to end this live class? This will complete the session for all students.")) return;
    setEndingClass(true);
    try {
      await api.patch(`/live-classes/${id}/status`, { status: 'COMPLETED' });
      alert("Live class has been marked as completed!");
      navigate('/instructor');
    } catch (err) {
      alert("Failed to end class: " + (err.message || "Unknown error"));
    } finally {
      setEndingClass(false);
    }
  };

  const handleStartClass = async () => {
    try {
      await api.patch(`/live-classes/${id}/status`, { status: 'LIVE' });
      fetchLiveClass();
    } catch (err) {
      alert("Failed to start class: " + (err.message || "Unknown error"));
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
        <div className="spinner" style={{ width: '40px', height: '40px' }} />
        <p style={{ color: 'var(--text-muted)' }}>Entering live classroom...</p>
      </div>
    );
  }

  if (error || !liveClass) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <AlertCircle size={48} color="var(--danger)" style={{ marginBottom: '1rem' }} />
        <h2>Live Classroom Unavailable</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{error || "The requested live class could not be found."}</p>
        <button onClick={() => navigate(-1)} className="btn btn-primary">
          Go Back
        </button>
      </div>
    );
  }

  const isHost = user && (user.id === liveClass.instructorId || user.role === 'ROLE_ADMIN');
  const isJitsi = !liveClass.meetingPlatform || liveClass.meetingPlatform === 'JITSI';
  
  // Format meeting URL for Jitsi iframe
  let iframeUrl = liveClass.meetingUrl;
  if (isJitsi && iframeUrl && !iframeUrl.includes('#')) {
    iframeUrl = `${iframeUrl}#config.prejoinPageEnabled=false&config.startWithAudioMuted=true`;
  }

  return (
    <div style={{ minHeight: '92vh', background: '#090d16', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Session Bar */}
      <header style={{
        padding: '12px 24px',
        background: 'rgba(15, 23, 42, 0.95)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => navigate(-1)}
            className="btn btn-sm btn-outline"
            style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <ArrowLeft size={16} /> Exit Room
          </button>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {liveClass.status === 'LIVE' ? (
                <span className="badge badge-danger" style={{ display: 'flex', alignItems: 'center', gap: '5px', animation: 'pulse 2s infinite' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fff' }} />
                  LIVE NOW
                </span>
              ) : (
                <span className="badge badge-warning">
                  {liveClass.status}
                </span>
              )}
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: '#fff' }}>
                {liveClass.title}
              </h2>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Course: <strong style={{ color: '#38bdf8' }}>{liveClass.courseTitle}</strong> &bull; Host: <strong>{liveClass.instructorName}</strong>
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {isHost && liveClass.status === 'SCHEDULED' && (
            <button
              onClick={handleStartClass}
              className="btn btn-sm btn-success"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Radio size={16} /> Broadcast Live
            </button>
          )}

          {isHost && liveClass.status === 'LIVE' && (
            <button
              onClick={handleEndClass}
              disabled={endingClass}
              className="btn btn-sm btn-danger"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <PhoneOff size={16} /> End Live Class
            </button>
          )}

          <a
            href={liveClass.meetingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm btn-outline"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <ExternalLink size={15} /> Open in External Window
          </a>
        </div>
      </header>

      {/* Main Classroom Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        {isJitsi ? (
          <iframe
            src={iframeUrl}
            title={liveClass.title}
            style={{
              width: '100%',
              height: '100%',
              flex: 1,
              border: 'none',
              minHeight: '82vh'
            }}
            allow="camera; microphone; fullscreen; display-capture; autoplay; clipboard-write"
          />
        ) : (
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
          }}>
            <div className="glass-panel" style={{
              maxWidth: '540px',
              width: '100%',
              padding: '3rem 2rem',
              textAlign: 'center',
              borderRadius: 'var(--radius-xl)'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(99, 102, 241, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem'
              }}>
                <Video size={32} color="#818cf8" />
              </div>
              <h2 style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>External Live Class Session</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                This live session is hosted on <strong>{liveClass.meetingPlatform}</strong>. Click below to launch the video meeting.
              </p>
              <a
                href={liveClass.meetingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-lg"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 28px' }}
              >
                <Video size={20} /> Join on {liveClass.meetingPlatform} <ExternalLink size={16} />
              </a>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
