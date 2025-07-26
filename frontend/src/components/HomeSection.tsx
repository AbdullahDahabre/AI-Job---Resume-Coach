interface HomeSectionProps {
  backendMsg: string;
  isExtractingResume: boolean;
  resumeText: string;
  onFileUpload: (file: File) => void;
  topRef: React.RefObject<HTMLDivElement | null>;
}

const HomeSection = ({ 
  backendMsg, 
  isExtractingResume, 
  resumeText, 
  onFileUpload,
  topRef 
}: HomeSectionProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) onFileUpload(uploadedFile);
  };

  return (
    <section
      style={{
        width: '100vw',
        background: '#343a40',
        padding: '8rem 2rem 4rem 2rem', // Increased top padding for navigation
        margin: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div ref={topRef} />
      <h1 style={{
        fontSize: '5rem',
        fontWeight: '800',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 30%, #e9ecef 60%, #dee2e6 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textAlign: 'center',
        marginBottom: '2rem',
        letterSpacing: '4px',
        textShadow: '2px 2px 4px rgba(255,255,255,0.3)',
        lineHeight: '1.1'
      }}>
        AI JOB & RESUME COACH
      </h1>
      <p style={{ 
        textAlign: 'center', 
        fontSize: '1.3rem', 
        marginBottom: '3rem',
        color: '#ced4da',
        fontWeight: '600'
      }}>{backendMsg}</p>

      <div style={{ textAlign: 'center' }}>
        <label style={{
          fontSize: '1.2rem',
          color: '#ffffff',
          marginBottom: '1rem',
          display: 'block',
          fontWeight: '600'
        }}>
          📄 Upload Your Resume (PDF)
        </label>
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          style={{ 
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            border: '2px solid #6c757d',
            backgroundColor: '#fff',
            color: '#212529',
            fontSize: '1.1rem',
            fontWeight: '500',
            boxShadow: '0 3px 6px rgba(0,0,0,0.3)',
            cursor: 'pointer'
          }}
        />
        
        {isExtractingResume && (
          <div style={{ marginTop: '2rem' }}>
            <div style={{
              display: 'inline-block',
              width: '40px',
              height: '40px',
              border: '4px solid #ced4da',
              borderRadius: '50%',
              borderTopColor: '#6c757d',
              animation: 'spin 1s ease-in-out infinite',
              marginBottom: '1rem'
            }}></div>
            <p style={{ 
              fontSize: '1.2rem',
              color: '#ced4da',
              fontWeight: '600'
            }}>📄 Extracting resume content...</p>
          </div>
        )}
        
        {resumeText && (
          <p style={{ 
            marginTop: '1.5rem',
            fontSize: '1.1rem',
            color: '#90EE90',
            fontWeight: '600'
          }}>✅ Resume uploaded successfully!</p>
        )}
      </div>
    </section>
  );
};

export default HomeSection;
