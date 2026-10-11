import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import {
  Sparkles,
  Clock,
  CheckCircle2,
  XCircle,
  Award,
  ChevronLeft,
  RotateCcw,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

const QuizPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await api.get(`/quizzes/${id}`);
        if (res.data) {
          setQuiz(res.data);
          if (res.data.timeLimitMinutes > 0) {
            setTimeLeft(res.data.timeLimitMinutes * 60);
          }
        }
      } catch (err) {
        console.error("Failed to fetch quiz:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  // Timer countdown
  useEffect(() => {
    if (!quiz || quiz.timeLimitMinutes <= 0 || result || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quiz, result, timeLeft]);

  const handleSelectOption = (questionId, optionIndex) => {
    if (result) return; // Prevent changing after submission
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleSubmitQuiz = async () => {
    if (submitting || result) return;
    setSubmitting(true);
    try {
      const timeSpent = quiz.timeLimitMinutes > 0 ? (quiz.timeLimitMinutes * 60 - timeLeft) : 60;
      const res = await api.post(`/quizzes/${id}/submit`, {
        answers: answers,
        timeSpentSeconds: timeSpent
      });

      if (res.data) {
        setResult(res.data);
        if (res.data.passed) {
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.6 }
          });
        }
      }
    } catch (err) {
      alert(err.message || "Failed to submit quiz");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetake = () => {
    setResult(null);
    setAnswers({});
    if (quiz.timeLimitMinutes > 0) {
      setTimeLeft(quiz.timeLimitMinutes * 60);
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 0', color: 'var(--text-muted)' }}>
        Loading quiz questions...
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <h2>Quiz Not Found</h2>
        <Link to="/courses" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '850px', minHeight: '80vh' }}>
      
      {/* Quiz Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <button
            onClick={() => navigate(-1)}
            className="btn btn-sm btn-outline"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.75rem' }}
          >
            <ChevronLeft size={16} /> Return to Course
          </button>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{quiz.title}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{quiz.description}</p>
        </div>

        {/* Timer Badge if timed */}
        {quiz.timeLimitMinutes > 0 && !result && (
          <div className="glass-panel" style={{
            padding: '0.65rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            border: timeLeft < 60 ? '1px solid var(--danger)' : '1px solid var(--border)'
          }}>
            <Clock size={18} color={timeLeft < 60 ? 'var(--danger)' : 'var(--accent-secondary)'} />
            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: timeLeft < 60 ? 'var(--danger)' : 'var(--text-main)' }}>
              {formatTime(timeLeft)}
            </span>
          </div>
        )}
      </div>

      {/* Result Card (shown after submission) */}
      {result && (
        <div className="glass-panel animate-fade-in" style={{
          padding: '2.5rem',
          marginBottom: '2.5rem',
          textAlign: 'center',
          borderRadius: 'var(--radius-xl)',
          border: result.passed ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(239, 68, 68, 0.4)',
          boxShadow: result.passed ? 'var(--success-glow)' : 'var(--shadow-lg)'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: result.passed ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem auto'
          }}>
            {result.passed ? (
              <CheckCircle2 size={36} color="var(--success)" />
            ) : (
              <XCircle size={36} color="var(--danger)" />
            )}
          </div>

          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>
            {result.passed ? 'Congratulations! You Passed!' : 'Review and Try Again'}
          </h2>

          <div style={{ fontSize: '2.8rem', fontWeight: 800, color: result.passed ? 'var(--success)' : 'var(--danger)', margin: '0.5rem 0' }}>
            {result.scorePercentage}%
          </div>

          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            You scored {result.correctAnswers} out of {result.totalQuestions} questions correct. Passing requirement: {result.passingScore}%.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button onClick={handleRetake} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <RotateCcw size={16} /> Retake Quiz
            </button>
            <button onClick={() => navigate(-1)} className="btn btn-primary">
              Continue Learning <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Questions List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        {quiz.questions && quiz.questions.map((q, qIndex) => {
          const feedback = result?.feedbackList?.find(f => f.questionId === q.id);
          const selectedOption = answers[q.id];

          return (
            <div key={q.id} className="glass-panel" style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)' }}>
              
              {/* Question Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-secondary)', textTransform: 'uppercase' }}>
                  Question {qIndex + 1} of {quiz.questions.length}
                </span>

                {feedback && (
                  feedback.correct ? (
                    <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={14} /> Correct (+{q.points || 1} pt)
                    </span>
                  ) : (
                    <span className="badge badge-danger" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <XCircle size={14} /> Incorrect
                    </span>
                  )
                )}
              </div>

              <h3 style={{ fontSize: '1.15rem', fontWeight: 600, lineHeight: 1.5, marginBottom: '1.25rem' }}>
                {q.questionText}
              </h3>

              {/* Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {[q.optionA, q.optionB, q.optionC, q.optionD].filter(Boolean).map((optText, optIdx) => {
                  const isSelected = selectedOption === optIdx;
                  let borderStyle = '1px solid var(--border)';
                  let bgStyle = 'rgba(255, 255, 255, 0.02)';

                  if (result && feedback) {
                    if (optIdx === feedback.correctOption) {
                      borderStyle = '1px solid var(--success)';
                      bgStyle = 'rgba(16, 185, 129, 0.1)';
                    } else if (isSelected && !feedback.correct) {
                      borderStyle = '1px solid var(--danger)';
                      bgStyle = 'rgba(239, 68, 68, 0.1)';
                    }
                  } else if (isSelected) {
                    borderStyle = '1px solid var(--accent-primary)';
                    bgStyle = 'rgba(79, 70, 229, 0.15)';
                  }

                  return (
                    <div
                      key={optIdx}
                      onClick={() => handleSelectOption(q.id, optIdx)}
                      style={{
                        padding: '0.85rem 1.25rem',
                        borderRadius: 'var(--radius-md)',
                        border: borderStyle,
                        background: bgStyle,
                        cursor: result ? 'default' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        border: isSelected ? '2px solid var(--accent-primary)' : '1px solid var(--border)',
                        background: isSelected ? 'var(--accent-primary)' : 'transparent',
                        color: isSelected ? '#fff' : 'var(--text-dim)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        flexShrink: 0
                      }}>
                        {String.fromCharCode(65 + optIdx)}
                      </div>
                      <span style={{ fontSize: '0.925rem', color: 'var(--text-main)' }}>
                        {optText}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Feedback Explanation (shown after grading) */}
              {feedback && feedback.explanation && (
                <div style={{
                  marginTop: '1.25rem',
                  padding: '1rem',
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: 'var(--radius-sm)',
                  borderLeft: '3px solid var(--accent-secondary)',
                  fontSize: '0.875rem',
                  lineHeight: 1.6,
                  color: 'var(--text-muted)'
                }}>
                  <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '0.25rem' }}>Explanation:</strong>
                  {feedback.explanation}
                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* Submit Button */}
      {!result && (
        <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button
            onClick={() => navigate(-1)}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmitQuiz}
            disabled={submitting || Object.keys(answers).length === 0}
            className="btn btn-primary btn-lg"
          >
            {submitting ? 'Submitting & Grading...' : `Submit Quiz (${Object.keys(answers).length}/${quiz.questions.length} answered)`}
          </button>
        </div>
      )}

    </div>
  );
};

export default QuizPage;
