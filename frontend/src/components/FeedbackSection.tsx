import { marked } from 'marked';
import ResumeScoreChart from './ResumeScoreChart';

interface FeedbackSectionProps {
  isLoading: boolean;
  resumeScore: Record<string, number>;
  feedback: string;
  feedbackRef: React.RefObject<HTMLElement | null>;
  onGetFeedback: () => void;
  btnStyle: React.CSSProperties;
  resumeText: string;
}

const FeedbackSection = ({ 
  isLoading, 
  resumeScore, 
  feedback, 
  feedbackRef,
  onGetFeedback,
  btnStyle,
  resumeText // Used for validation check
}: FeedbackSectionProps) => {
  const resumeScoreArray = Object.entries(resumeScore).map(([category, score]) => ({
    category,
    score
  }));

  return (
    <section ref={feedbackRef} style={{
      width: '100vw',
      background: '#ffffff',
      padding: '4rem 0',
      margin: 0,
      border: 'none',
      boxShadow: 'none',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto' }}>
        <h2 style={{
          fontSize: '2rem',
          marginBottom: '2rem',
          color: '#495057',
          textAlign: 'center'
        }}>
          📄 Resume Feedback
        </h2>
        
        {!resumeText ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ 
              fontSize: '1.3rem',
              color: '#6c757d',
              marginBottom: '1rem',
              fontWeight: '600'
            }}>
              Please upload your resume first to get feedback
            </p>
            <p style={{ 
              fontSize: '1.2rem',
              color: '#8a8a8a'
            }}>
              Go back to the Home section to upload your PDF resume
            </p>
          </div>
        ) : (
          <>
            <button 
              onClick={onGetFeedback} 
              style={{ 
                ...btnStyle, 
                backgroundColor: '#495057',
                marginBottom: '2rem',
                display: 'block',
                margin: '0 auto 2rem auto'
              }}
            >
              📄 Get Feedback
            </button>
          </>
        )}
        
        {isLoading && (
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              display: 'inline-block',
              width: '40px',
              height: '40px',
              border: '4px solid #dee2e6',
              borderRadius: '50%',
              borderTopColor: '#495057',
              animation: 'spin 1s ease-in-out infinite',
              marginBottom: '1rem'
            }}></div>
            <p style={{ 
              fontSize: '1.2rem',
              color: '#495057',
              fontWeight: '600'
            }}>📝 Preparing detailed feedback...</p>
          </div>
        )}

        {Object.keys(resumeScore).length > 0 && (
          <div style={{
            marginBottom: '2rem',
            padding: '1.5rem 0',
            background: 'transparent',
            borderRadius: 0,
            border: 'none',
            boxShadow: 'none',
            color: '#495057',
            width: '100%',
            maxWidth: '900px',
          }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem', textAlign: 'center', color: '#495057' }}>📊 Resume Score Breakdown</h3>
            <ResumeScoreChart scores={resumeScoreArray} />
          </div>
        )}
        
        {feedback && (
          <div style={{
            background: '#fff',
            color: '#212529',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
            border: '1px solid #dee2e6',
            boxSizing: 'border-box',
            width: '100%',
            maxWidth: '900px',
            margin: '0 auto'
          }}>
            <h3 style={{
              color: '#343a40',
              marginBottom: '1.5rem',
              fontSize: '1.6rem',
              fontWeight: '600',
              borderBottom: '2px solid #6c757d',
              paddingBottom: '0.5rem'
            }}>📋 AI Feedback</h3>
            <div dangerouslySetInnerHTML={{ __html: marked(feedback) }} />
            <button
              onClick={() => navigator.clipboard.writeText(feedback)}
              style={{
                ...btnStyle,
                marginTop: '1.5rem',
                backgroundColor: '#6c757d'
              }}
            >
              📋 Copy Feedback
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeedbackSection;
