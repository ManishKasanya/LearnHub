import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {
  CheckCircle,
  Copy,
  Check,
  Smartphone,
  QrCode,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  ArrowRight,
  X,
  CreditCard
} from 'lucide-react';

const TARGET_PHONE = '8251085981';
const TARGET_UPI = '8251085981@upi';

export default function PaymentModal({ course, isOpen, onClose, onSuccess }) {
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState('PhonePe');
  const [payerPhone, setPayerPhone] = useState('');
  const [payerUpiId, setPayerUpiId] = useState('');
  const [utrNumber, setUtrNumber] = useState('');
  const [copiedField, setCopiedField] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successData, setSuccessData] = useState(null);

  if (!isOpen || !course) return null;

  const price = course.price ? Number(course.price) : 0;
  const priceFormatted = price.toLocaleString('en-IN');

  const upiDeepLink = `upi://pay?pa=${TARGET_UPI}&pn=LearnHub%20Official&am=${price}&cu=INR&tn=Course_${course.id}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiDeepLink)}`;

  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleAutoFillTestUTR = () => {
    const randomUtr = '8251' + Math.floor(10000000 + Math.random() * 90000000);
    setUtrNumber(randomUtr);
    setPayerPhone('+91 98765 ' + Math.floor(10000 + Math.random() * 90000));
    setPayerUpiId('student@okhdfcbank');
  };

  const handleProcessPayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.post('/transactions/pay', {
        courseId: course.id,
        paymentMethod: paymentMethod,
        payerPhone: payerPhone || null,
        payerUpiId: payerUpiId || null,
        utrNumber: utrNumber || ('UTR8251' + Date.now().toString().slice(-8)),
        note: `Payment for ${course.title} to ${TARGET_PHONE}`
      });

      if (res.data) {
        setSuccessData(res.data);
        if (onSuccess) onSuccess(res.data);
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.response?.data?.message || err.message || 'Payment processing failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      backgroundColor: 'rgba(5, 7, 15, 0.85)',
      backdropFilter: 'blur(8px)',
      animation: 'fadeIn 0.2s ease-out'
    }}>
      <div style={{
        maxWidth: '560px',
        width: '100%',
        maxHeight: '92vh',
        overflowY: 'auto',
        background: '#0d1117',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        borderRadius: '20px',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 35px rgba(99, 102, 241, 0.25)',
        position: 'relative',
        color: '#f0f6fc'
      }}>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            borderRadius: '50%',
            width: '34px',
            height: '34px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#94a3b8',
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          <X size={18} />
        </button>

        {successData ? (
          /* Payment Success Screen */
          <div style={{ padding: '2.5rem 2rem', textAlign: 'center' }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '2px solid #10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              color: '#10b981'
            }}>
              <CheckCircle size={40} />
            </div>

            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
              Payment Verified &amp; Enrolled!
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              Transaction successfully confirmed &bull; Transaction ID: <strong style={{ color: '#38bdf8' }}>{successData.transactionCode}</strong>
            </p>

            {/* Receipt Summary Box */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '1.25rem',
              textAlign: 'left',
              marginBottom: '1.75rem',
              fontSize: '0.875rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                <span style={{ color: '#94a3b8' }}>Transaction ID:</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#38bdf8' }}>
                  {successData.transactionCode}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                <span style={{ color: '#94a3b8' }}>Course:</span>
                <span style={{ fontWeight: 600, color: '#fff', textAlign: 'right', maxWidth: '65%' }}>
                  {course.title}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                <span style={{ color: '#94a3b8' }}>Amount Paid:</span>
                <span style={{ fontWeight: 800, color: '#34d399', fontSize: '1.05rem' }}>
                  ₹{priceFormatted}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                <span style={{ color: '#94a3b8' }}>Payment Method:</span>
                <span style={{ fontWeight: 700, color: '#e2e8f0' }}>
                  {successData.paymentMethod || paymentMethod} UPI
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                <span style={{ color: '#94a3b8' }}>Merchant:</span>
                <span style={{ fontWeight: 700, color: '#c084fc' }}>
                  LearnHub Official Verified Merchant
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Bank UTR / Ref:</span>
                <span style={{ fontFamily: 'monospace', color: '#cbd5e1' }}>
                  {successData.utrNumber}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate(`/learn/${course.id}`);
                }}
                className="btn btn-primary"
                style={{ flex: 1, padding: '12px', fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                Start Learning Now <ArrowRight size={18} />
              </button>
            </div>
          </div>
        ) : (
          /* Payment Processing Screen */
          <div style={{ padding: '2rem' }}>
            
            {/* Modal Header */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: '20px', color: '#a5b4fc', fontSize: '0.75rem', fontWeight: 700, marginBottom: '8px' }}>
                <ShieldCheck size={14} color="#818cf8" />
                SECURE UPI PAYMENT GATEWAY
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>
                Complete Course Enrollment
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: 0 }}>
                {course.title}
              </p>
            </div>

            {/* Recipient Phone Number & UPI Banner */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.18) 0%, rgba(168, 85, 247, 0.18) 100%)',
              border: '1px solid rgba(99, 102, 241, 0.4)',
              borderRadius: '14px',
              padding: '1.15rem',
              marginBottom: '1.25rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                <span style={{ fontSize: '0.8rem', color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Total Tuition Amount:
                </span>
                <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff' }}>
                  ₹{priceFormatted}
                </span>
              </div>

              {/* Transaction Reference ID Row */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'rgba(15, 23, 42, 0.7)',
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                marginBottom: '8px'
              }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase' }}>
                    Transaction Reference ID:
                  </div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.5px', fontFamily: 'monospace' }}>
                    TXN-REF-{course.id}-{price}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(`TXN-REF-${course.id}-${price}`, 'txnid')}
                  className="btn btn-sm btn-secondary"
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', padding: '6px 10px' }}
                >
                  {copiedField === 'txnid' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                  <span>{copiedField === 'txnid' ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>

              {/* Verified Payee Row */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'rgba(15, 23, 42, 0.7)',
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase' }}>
                    Verified Gateway Payee:
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#c084fc' }}>
                    LearnHub Official (Instant UPI Reconciliation)
                  </div>
                </div>
                <span className="badge badge-success" style={{ fontSize: '0.7rem', padding: '4px 8px' }}>
                  Verified Merchant
                </span>
              </div>
            </div>

            {/* QR Code & Payment Instructions */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '170px 1fr',
              gap: '1.25rem',
              alignItems: 'center',
              background: 'rgba(15, 23, 42, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '1rem',
              marginBottom: '1.25rem'
            }}>
              {/* QR Code */}
              <div style={{
                textAlign: 'center',
                background: '#fff',
                padding: '8px',
                borderRadius: '10px',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)'
              }}>
                <img
                  src={qrCodeUrl}
                  alt="UPI QR Code"
                  style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '4px' }}
                />
                <div style={{ fontSize: '0.65rem', color: '#0f172a', fontWeight: 800, marginTop: '4px' }}>
                  SCAN TO PAY ₹{priceFormatted}
                </div>
              </div>

              {/* Steps Instructions */}
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
                  Instant Payment Steps:
                </h4>
                <ol style={{ margin: 0, paddingLeft: '1.2rem', color: '#94a3b8', fontSize: '0.8rem', lineHeight: 1.6 }}>
                  <li>Open <strong>PhonePe</strong>, <strong>Google Pay</strong>, or <strong>Paytm</strong></li>
                  <li>Scan the secure QR code to transfer <strong style={{ color: '#34d399' }}>₹{priceFormatted}</strong></li>
                  <li>Your bank generates a 12-digit UPI Reference / UTR Number</li>
                  <li>Enter the UTR Number below to verify and unlock your course immediately!</li>
                </ol>

                <div style={{ marginTop: '10px' }}>
                  <button
                    type="button"
                    onClick={handleAutoFillTestUTR}
                    style={{
                      background: 'rgba(56, 189, 248, 0.1)',
                      border: '1px dashed #38bdf8',
                      color: '#38bdf8',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '5px 10px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Sparkles size={12} /> Auto-Generate Test UTR (1-Click Test)
                  </button>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid #ef4444',
                color: '#f87171',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '0.825rem',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleProcessPayment}>
              {/* Payment Method Selector */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px' }}>
                  Select Payment App Used:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                  {['PhonePe', 'Google Pay', 'Paytm', 'Other UPI'].map(app => (
                    <button
                      key={app}
                      type="button"
                      onClick={() => setPaymentMethod(app)}
                      style={{
                        padding: '8px 4px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        borderRadius: '8px',
                        border: paymentMethod === app ? '1px solid #6366f1' : '1px solid rgba(255, 255, 255, 0.1)',
                        background: paymentMethod === app ? 'rgba(99, 102, 241, 0.25)' : 'rgba(15, 23, 42, 0.6)',
                        color: paymentMethod === app ? '#a5b4fc' : '#94a3b8',
                        cursor: 'pointer',
                        textAlign: 'center'
                      }}
                    >
                      {app}
                    </button>
                  ))}
                </div>
              </div>

              {/* UTR Input */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px' }}>
                  12-Digit UPI Reference / UTR Number: <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 439018274619 or Click Auto-Generate"
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontFamily: 'monospace',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '1rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)'
                }}
              >
                {loading ? (
                  <span>Verifying Payment &amp; Activating Course...</span>
                ) : (
                  <>
                    <CreditCard size={18} />
                    <span>Confirm Payment &amp; Enroll (₹{priceFormatted})</span>
                  </>
                )}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '0.75rem', color: '#64748b' }}>
              🔒 Protected by 256-bit SSL encryption &bull; Real-time UPI reconciliation &amp; instant course unlock
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
