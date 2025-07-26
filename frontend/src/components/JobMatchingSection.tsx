interface Job {
  platform: string;
  url: string;
}

interface JobMatchingSectionProps {
  isGeneratingLinks: boolean;
  jobMatches: Job[];
  jobRef: React.RefObject<HTMLElement | null>;
  onGenerateLinks: () => void;
  btnStyle: React.CSSProperties;
  resumeText: string;
}

const JobMatchingSection = ({ 
  isGeneratingLinks,
  jobMatches,
  jobRef,
  onGenerateLinks,
  btnStyle,
  resumeText // Used for validation check
}: JobMatchingSectionProps) => {
  return (
    <section ref={jobRef} style={{
      width: '100vw',
      background: '#343a40',
      padding: '4rem 0',
      margin: 0,
      border: 'none',
      boxShadow: 'none',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: '600px', // Ensure consistent height for navigation
    }}>
      <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto', padding: '0 2rem' }}>
        <h2 style={{
          fontSize: '2rem',
          marginBottom: '2rem',
          color: '#ffffff',
          textAlign: 'center'
        }}>
          💼 Job Listings
        </h2>
        
        {!resumeText ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ 
              fontSize: '1.3rem',
              color: '#ced4da',
              marginBottom: '1rem',
              fontWeight: '600'
            }}>
              Please upload your resume first to find matching jobs
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
              onClick={onGenerateLinks} 
              style={{ 
                ...btnStyle, 
                marginBottom: '2rem', 
                backgroundColor: '#495057',
                display: 'block',
                margin: '0 auto 2rem auto'
              }}
            >
              🔗 Generate Job Search Links
            </button>
          </>
        )}
        
        {isGeneratingLinks && (
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
            }}>🔍 Finding personalized job matches...</p>
          </div>
        )}
        
        {jobMatches.length > 0 && (
          <>
            <h3 style={{ 
              fontSize: '1.75rem', 
              marginBottom: '1rem', 
              textAlign: 'center',
              color: '#ffffff'
            }}>
              🎯 Personalized Job Matches
            </h3>
            <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
              {jobMatches.map((job, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#fff',
                    padding: '1.25rem',
                    borderRadius: '10px',
                    border: '1px solid #ccc',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                >
                  <h4 style={{ color: '#343a40' }}>{job.platform}</h4>
                  <a 
                    href={job.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ wordBreak: 'break-all', color: '#007bff' }}
                  >
                    🔗 Visit {job.platform}
                  </a>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default JobMatchingSection;
