interface NavigationProps {
  isScrolled: boolean;
  onScrollToSection: (ref: React.RefObject<any>) => void;
  topRef: React.RefObject<HTMLDivElement | null>;
  feedbackRef: React.RefObject<HTMLElement | null>;
  letterRef: React.RefObject<HTMLElement | null>;
  interviewRef: React.RefObject<HTMLElement | null>;
  jobRef: React.RefObject<HTMLElement | null>;
  resumeText: string;
  jobPost: string;
  onShowNotification: (message: string) => void;
}

const Navigation = ({ 
  isScrolled, 
  onScrollToSection,
  topRef,
  feedbackRef,
  letterRef,
  interviewRef,
  jobRef,
  resumeText,
  jobPost,
  onShowNotification
}: NavigationProps) => {
  
  const handleNavClick = (ref: React.RefObject<any>, requiresResume = false, requiresJob = false) => {
    console.log('🔧 Nav click:', { requiresResume, requiresJob, hasResume: !!resumeText, hasJob: !!jobPost });
    
    // Check for Interview Q&A Trainer specific requirements
    if (requiresResume && requiresJob) {
      if (!resumeText && !jobPost) {
        console.log('🔧 Showing notification: resume and job required');
        onShowNotification('Please upload your resume and add a job description first');
        return;
      } else if (!resumeText) {
        console.log('🔧 Showing notification: resume required');
        onShowNotification('Please upload your resume first');
        return;
      } else if (!jobPost) {
        console.log('🔧 Showing notification: job required');
        onShowNotification('Please add a job description first');
        return;
      }
    } else if (requiresResume && !resumeText) {
      console.log('🔧 Showing notification: resume required');
      onShowNotification('Please upload your resume first');
      return;
    }
    
    console.log('🔧 Scrolling to section');
    onScrollToSection(ref);
  };

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      width: '100%',
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'center',
      gap: isScrolled ? '1.5rem' : '3rem',
      padding: isScrolled ? '0.8rem 0' : '1.2rem 0',
      backgroundColor: '#ffffff',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid #dee2e6',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      transition: 'all 0.3s ease',
      alignItems: 'center'
    }}>
      <button 
        onClick={() => handleNavClick(topRef)}
        className="nav-link"
      >
        🏠 Home
      </button>
      <button 
        onClick={() => handleNavClick(feedbackRef, true)}
        className="nav-link"
        style={{
          opacity: !resumeText ? 0.5 : 1,
          cursor: !resumeText ? 'not-allowed' : 'pointer'
        }}
      >
        📄 Resume Feedback
      </button>
      <button 
        onClick={() => handleNavClick(letterRef, true)}
        className="nav-link"
        style={{
          opacity: !resumeText ? 0.5 : 1,
          cursor: !resumeText ? 'not-allowed' : 'pointer'
        }}
      >
        ✍🏻 Cover Letter
      </button>
      <button 
        onClick={() => handleNavClick(interviewRef, true, true)}
        className="nav-link"
        style={{
          opacity: (!resumeText || !jobPost) ? 0.5 : 1,
          cursor: (!resumeText || !jobPost) ? 'not-allowed' : 'pointer'
        }}
      >
        🧠 Interview Q&A Trainer
      </button>
      <button 
        onClick={() => handleNavClick(jobRef, true)}
        className="nav-link"
        style={{
          opacity: !resumeText ? 0.5 : 1,
          cursor: !resumeText ? 'not-allowed' : 'pointer'
        }}
      >
        💼 Job Listings
      </button>
    </nav>
  );
};

export default Navigation;
