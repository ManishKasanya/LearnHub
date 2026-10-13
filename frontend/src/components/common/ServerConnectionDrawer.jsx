import React, { useState, useEffect } from 'react';
import { getApiBaseUrl, setApiBaseUrl, resetApiBaseUrl, testBackendConnection } from '../../services/api';
import { Server, CheckCircle2, AlertCircle, RefreshCw, X, Settings2, ExternalLink } from 'lucide-react';

export default function ServerConnectionDrawer({ isOpen, onClose }) {
  const [currentUrl, setCurrentUrl] = useState(getApiBaseUrl());
  const [inputUrl, setInputUrl] = useState(getApiBaseUrl());
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const active = getApiBaseUrl();
    setCurrentUrl(active);
    setInputUrl(active);
  }, [isOpen]);

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    const res = await testBackendConnection(inputUrl);
    setTesting(false);
    setTestResult(res);
  };

  const handleSave = () => {
    if (!inputUrl.trim()) {
      handleReset();
      return;
    }
    const saved = setApiBaseUrl(inputUrl);
    setCurrentUrl(saved);
    setInputUrl(saved);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleReset = () => {
    const fallback = resetApiBaseUrl();
    setCurrentUrl(fallback);
    setInputUrl(fallback);
    setTestResult(null);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handlePreset = (presetUrl) => {
    setInputUrl(presetUrl);
  };

  if (!isOpen) return null;

  const isCloudHost = typeof window !== 'undefined' &&
    !['localhost', '127.0.0.1'].includes(window.location.hostname);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '16px'
    }}>
      <div style={{
        background: 'var(--card-bg, #1e293b)',
        border: '1px solid var(--border-color, rgba(255, 255, 255, 0.1))',
        borderRadius: '16px',
        maxWidth: '520px',
        width: '100%',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        overflow: 'hidden',
        color: '#f8fafc'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(15, 23, 42, 0.6)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366f1, #a855f7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Server size={22} color="#ffffff" />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>Backend Server Settings</h3>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: '2px 0 0' }}>
                Connect frontend to your Spring Boot API
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {isCloudHost && currentUrl === '/api' && (
            <div style={{
              padding: '12px 14px',
              borderRadius: '10px',
              background: 'rgba(234, 179, 8, 0.12)',
              border: '1px solid rgba(234, 179, 8, 0.3)',
              color: '#fef08a',
              fontSize: '13px',
              lineHeight: 1.4
            }}>
              <strong>Tip for Cloud Deployments:</strong> You are browsing from a cloud domain. If your backend is deployed on Render/Railway/EC2, enter its URL below (e.g. <code>https://my-backend.onrender.com</code>) so login & signup can connect.
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#cbd5e1' }}>
              Target API Base URL
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="https://your-learnhub-backend.onrender.com"
                style={{
                  flex: 1,
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  background: 'rgba(15, 23, 42, 0.7)',
                  color: '#ffffff',
                  fontSize: '14px',
                  outline: 'none',
                  fontFamily: 'monospace'
                }}
              />
              <button
                type="button"
                onClick={handleTest}
                disabled={testing}
                style={{
                  padding: '0 16px',
                  borderRadius: '10px',
                  background: 'rgba(99, 102, 241, 0.2)',
                  border: '1px solid rgba(99, 102, 241, 0.4)',
                  color: '#a5b4fc',
                  fontWeight: '600',
                  fontSize: '13px',
                  cursor: testing ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <RefreshCw size={14} className={testing ? 'spin' : ''} />
                {testing ? 'Testing...' : 'Test'}
              </button>
            </div>
            <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#94a3b8' }}>
              <span>Quick Presets:</span>
              <button
                type="button"
                onClick={() => handlePreset('http://localhost:8080')}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: 'none',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  color: '#cbd5e1',
                  cursor: 'pointer',
                  fontSize: '11px'
                }}
              >
                Localhost:8080
              </button>
              <button
                type="button"
                onClick={() => handlePreset('/api')}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: 'none',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  color: '#cbd5e1',
                  cursor: 'pointer',
                  fontSize: '11px'
                }}
              >
                Relative (/api)
              </button>
            </div>
          </div>

          {/* Test connection results */}
          {testResult && (
            <div style={{
              padding: '12px 14px',
              borderRadius: '10px',
              background: testResult.ok ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.12)',
              border: `1px solid ${testResult.ok ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
              color: testResult.ok ? '#4ade80' : '#f87171',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px'
            }}>
              {testResult.ok ? <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: '2px' }} /> : <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />}
              <div>
                <div style={{ fontWeight: '600' }}>
                  {testResult.ok ? 'Backend Connection Successful!' : 'Connection Failed'}
                </div>
                <div style={{ fontSize: '12px', marginTop: '2px', opacity: 0.9 }}>
                  {testResult.message}
                </div>
                {testResult.latency !== undefined && (
                  <div style={{ fontSize: '11px', marginTop: '4px', opacity: 0.75 }}>
                    Latency: {testResult.latency}ms | Target: {testResult.url}
                  </div>
                )}
              </div>
            </div>
          )}

          {saveSuccess && (
            <div style={{
              padding: '10px 14px',
              borderRadius: '8px',
              background: 'rgba(34, 197, 94, 0.15)',
              color: '#4ade80',
              fontSize: '13px',
              textAlign: 'center'
            }}>
              Settings saved! All API requests now target this URL.
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
            <button
              type="button"
              onClick={handleSave}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                border: 'none',
                color: '#ffffff',
                fontWeight: '700',
                fontSize: '14px',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.3)'
              }}
            >
              Save & Apply
            </button>
            <button
              type="button"
              onClick={handleReset}
              style={{
                padding: '12px 18px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#cbd5e1',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
