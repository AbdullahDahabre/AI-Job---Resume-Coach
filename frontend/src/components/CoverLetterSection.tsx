import { marked } from 'marked';

interface CoverLetterSectionProps {
  resumeText: string;
  jobPost: string;
  setJobPost: (value: string) => void;
  isLoading: boolean;
  coverLetter: string;
  letterRef: React.RefObject<HTMLElement | null>;
  onGenerateCoverLetter: () => void;
  onSaveAsTxt: () => void;
  btnStyle: React.CSSProperties;
}

const CoverLetterSection = ({ 
  resumeText,
  jobPost,
  setJobPost,
  isLoading,
  coverLetter,
  letterRef,
  onGenerateCoverLetter,
  onSaveAsTxt,
  btnStyle 
}: CoverLetterSectionProps) => {
  return (
    <section ref={letterRef} style={{
      width: '100vw',
      background: '#343a40',
      padding: '4rem 0',
      margin: 0,
      border: 'none',
      boxShadow: 'none',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto', padding: '0 2rem' }}>
        <h2 style={{
          fontSize: '2rem',
          marginBottom: '2rem',
          color: '#ffffff',
          textAlign: 'center'
        }}>
          ✍🏻 Cover Letter
        </h2>
        
        {!resumeText ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ 
              fontSize: '1.3rem',
              color: '#ced4da',
              marginBottom: '1rem',
              fontWeight: '600'
            }}>
              Please upload your resume first to generate a cover letter
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
            <textarea
              rows={8}
              placeholder="📝 Paste the job description here..."
              value={jobPost}
              onChange={(e) => setJobPost(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '1.2rem',
                borderRadius: '8px',
                border: '2px solid #6c757d',
                fontSize: '1rem',
                fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
                resize: 'vertical',
                marginBottom: '1.5rem',
                backgroundColor: '#fff',
                color: '#212529',
                boxShadow: '0 3px 6px rgba(0,0,0,0.2)'
              }}
            />
            <button 
              onClick={onGenerateCoverLetter} 
              style={{ 
                ...btnStyle, 
                backgroundColor: '#495057',
                marginBottom: '2rem',
                display: 'block',
                margin: '0 auto 2rem auto'
              }}
              disabled={!jobPost.trim()}
            >
              ✍🏻 Generate Cover Letter
            </button>
            
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
                  textAlign: 'center', 
                  fontSize: '1.2rem',
                  color: '#ffffff',
                  fontWeight: '600'
                }}>✍🏻 Crafting your personalized cover letter...</p>
              </div>
            )}
            
            {coverLetter && (
              <div style={{ width: '100%', marginTop: '2rem' }}>
                <h3 style={{ 
                  color: '#ffffff', 
                  marginBottom: '1rem',
                  fontSize: '1.6rem',
                  fontWeight: '600',
                  textAlign: 'center'
                }}>
                  ✍🏻 Your Cover Letter
                </h3>
                <div style={{ 
                  backgroundColor: '#fff',
                  padding: '2rem',
                  color: '#212529',
                  whiteSpace: 'pre-wrap',
                  lineHeight: '1.6',
                  fontSize: '1rem',
                  borderRadius: '10px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
                }}>
                  <div dangerouslySetInnerHTML={{ __html: marked(coverLetter) }} />
                </div>
                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                  <button 
                    onClick={() => navigator.clipboard.writeText(coverLetter)} 
                    style={{ ...btnStyle, backgroundColor: '#6c757d' }}
                  >
                    📋 Copy
                  </button>
                  <button 
                    onClick={onSaveAsTxt} 
                    style={{ ...btnStyle, backgroundColor: '#495057' }}
                  >
                    💾 Save as .txt
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default CoverLetterSection;
