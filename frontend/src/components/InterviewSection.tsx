interface QAPair {
  question: string;
  answer: string;
}

interface InterviewSectionProps {
  resumeText: string;
  jobPost: string;
  qaLoading: boolean;
  qaPairs: QAPair[];
  qaExpanded: boolean[];
  setQaExpanded: (expanded: boolean[]) => void;
  interviewRef: React.RefObject<HTMLElement | null>;
  onGenerateInterviewQAPairs: () => void;
  btnStyle: React.CSSProperties;
}

const InterviewSection = ({ 
  resumeText,
  jobPost,
  qaLoading,
  qaPairs,
  qaExpanded,
  setQaExpanded,
  interviewRef,
  onGenerateInterviewQAPairs,
  btnStyle 
}: InterviewSectionProps) => {
  const handleCopyAll = () => {
    const text = qaPairs.map((p, i) => `${i + 1}. ${p.question}\nAnswer: ${p.answer}`).join('\n\n');
    navigator.clipboard.writeText(text);
  };

  const handleSaveAsFile = () => {
    const text = qaPairs.map((p, i) => `${i + 1}. ${p.question}\nAnswer: ${p.answer}`).join('\n\n');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'interview_answers.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleAnswer = (index: number) => {
    const updated = [...qaExpanded];
    updated[index] = !updated[index];
    setQaExpanded(updated);
  };

  return (
    <section ref={interviewRef} style={{
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
          🧠 Interview Q&A Trainer
        </h2>
        
        {!resumeText ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ 
              fontSize: '1.3rem',
              color: '#6c757d',
              marginBottom: '1rem',
              fontWeight: '600'
            }}>
              Please upload your resume first to practice interview questions
            </p>
            <p style={{ 
              fontSize: '1.2rem',
              color: '#8a8a8a'
            }}>
              Go back to the Home section to upload your PDF resume
            </p>
          </div>
        ) : !jobPost ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ 
              fontSize: '1.3rem',
              color: '#6c757d',
              marginBottom: '1rem',
              fontWeight: '600'
            }}>
              Please add a job description to generate relevant interview questions
            </p>
            <p style={{ 
              fontSize: '1.2rem',
              color: '#8a8a8a'
            }}>
              Go to the Cover Letter section to paste a job description
            </p>
          </div>
        ) : (
          <>
            <button 
              onClick={onGenerateInterviewQAPairs}
              style={{ 
                ...btnStyle, 
                backgroundColor: '#6c757d', 
                marginBottom: '2rem',
                display: 'block',
                margin: '0 auto 2rem auto'
              }}
              disabled={!resumeText || !jobPost}
            >
              🧠 Generate Q&A
            </button>
          </>
        )}
        
        {qaLoading && (
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
              color: '#495057',
              textAlign: 'center',
              fontSize: '1.2rem',
              fontWeight: '600'
            }}>⏳ Generating interview questions...</p>
          </div>
        )}

        {qaPairs.length > 0 && (
          <div
            style={{
              background: '#fff',
              color: '#212529',
              padding: '2rem',
              borderRadius: '12px',
              border: '1px solid #dee2e6',
              boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
              width: '100%',
              maxWidth: '900px'
            }}
          >
            <h4 style={{ marginBottom: '1.5rem' }}>🎤 Sample Interview Q&A</h4>
            
            <p style={{ fontWeight: '700', marginBottom: '1rem', color: '#212529' }}>
              🎯 These 5 questions are based on your resume:
            </p>
            {qaPairs.slice(0, 5).map((pair, idx) => (
              <div key={idx} style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>
                  {pair.question}
                </div>
                <button
                  onClick={() => toggleAnswer(idx)}
                  style={{ ...btnStyle, backgroundColor: '#6c757d', fontSize: '0.9rem' }}
                >
                  {qaExpanded[idx] ? 'Hide Answer' : '💡 Show Answer'}
                </button>
                {qaExpanded[idx] && (
                  <div
                    style={{
                      backgroundColor: '#d1ecf1',
                      color: '#0c5460',
                      padding: '0.75rem 1rem',
                      marginTop: '0.75rem',
                      borderRadius: '8px',
                      whiteSpace: 'pre-wrap'
                    }}
                  >
                    {pair.answer}
                  </div>
                )}
              </div>
            ))}
            
            <p style={{ fontWeight: '700', marginBottom: '1rem', marginTop: '2rem', color: '#212529' }}>
              💼 These 5 questions are based on the job description:
            </p>
            {qaPairs.slice(5).map((pair, idx) => (
              <div key={idx + 5} style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>
                  {pair.question}
                </div>
                <button
                  onClick={() => toggleAnswer(idx + 5)}
                  style={{ ...btnStyle, backgroundColor: '#6c757d', fontSize: '0.9rem' }}
                >
                  {qaExpanded[idx + 5] ? 'Hide Answer' : '💡 Show Answer'}
                </button>
                {qaExpanded[idx + 5] && (
                  <div
                    style={{
                      backgroundColor: '#d1ecf1',
                      color: '#0c5460',
                      padding: '0.75rem 1rem',
                      marginTop: '0.75rem',
                      borderRadius: '8px',
                      whiteSpace: 'pre-wrap'
                    }}
                  >
                    {pair.answer}
                  </div>
                )}
              </div>
            ))}
            
            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
              <button
                onClick={handleCopyAll}
                style={{ ...btnStyle, backgroundColor: '#6c757d' }}
              >
                📋 Copy All
              </button>
              <button
                onClick={handleSaveAsFile}
                style={{ ...btnStyle, backgroundColor: '#495057' }}
              >
                💾 Save as .txt
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default InterviewSection;
