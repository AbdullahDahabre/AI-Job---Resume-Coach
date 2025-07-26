import { useEffect, useState, useRef } from 'react';
import HomeSection from './components/HomeSection';
import FeedbackSection from './components/FeedbackSection';
import CoverLetterSection from './components/CoverLetterSection';
import InterviewSection from './components/InterviewSection';
import JobMatchingSection from './components/JobMatchingSection';
import Navigation from './components/Navigation';
import Notification from './components/Notification';

type Job = {
  platform: string;
  url: string;
};

type QAPair = {
  question: string;
  answer: string;
};

function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showNotification, setShowNotification] = useState('');
  const [backendMsg, setBackendMsg] = useState('Connecting...');
  const [file, setFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [feedback, setFeedback] = useState('');
  const [jobPost, setJobPost] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [isFeedbackLoading, setIsFeedbackLoading] = useState(false);
  const [isCoverLetterLoading, setIsCoverLetterLoading] = useState(false);
  const [isExtractingResume, setIsExtractingResume] = useState(false);
  const [isGeneratingLinks, setIsGeneratingLinks] = useState(false);
  const [qaLoading, setQaLoading] = useState(false);
  const [qaPairs, setQaPairs] = useState<QAPair[]>([]);
  const [qaExpanded, setQaExpanded] = useState<boolean[]>([]);
  const [resumeScore, setResumeScore] = useState<Record<string, number>>({});
  const [jobMatches, setJobMatches] = useState<Job[]>([]);

  useEffect(() => {
    // Inject global styles ONCE and keep them permanent
    let style = document.getElementById('app-global-styles') as HTMLStyleElement;
    
    if (!style) {
      style = document.createElement('style');
      style.id = 'app-global-styles';
      document.head.appendChild(style);
    }
    
    style.textContent = `
      html, body {
        overflow-x: hidden !important;
        width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        box-sizing: border-box !important;
      }

      *, *::before, *::after {
        box-sizing: border-box !important;
      }

      ::-webkit-scrollbar {
        width: ${isScrolled ? '6px' : '10px'};
        transition: width 0.3s ease;
      }

      ::-webkit-scrollbar-track {
        background: #343a40;
        border-radius: 10px;
      }

      ::-webkit-scrollbar-thumb {
        background: linear-gradient(45deg, #6c757d, #495057);
        border-radius: 10px;
        border: 1px solid #495057;
      }

      ::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(45deg, #495057, #343a40);
      }

      html {
        scrollbar-width: ${isScrolled ? 'thin' : 'auto'};
        scrollbar-color: #6c757d #343a40;
      }

      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateX(-50%) translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      /* PERMANENT Navigation styles that NEVER change */
      .nav-link {
        cursor: pointer !important;
        background-color: #fff !important;
        color: #343a40 !important;
        text-decoration: none !important;
        padding: ${isScrolled ? '0.4rem 0.8rem' : '0.6rem 1.2rem'} !important;
        border-radius: 8px !important;
        font-weight: 600 !important;
        display: inline-block !important;
        border: 1px solid #dee2e6 !important;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08) !important;
        transition: all 0.3s ease !important;
        font-size: ${isScrolled ? '0.9rem' : '1rem'} !important;
      }
      button.nav-link {
        background-color: #fff !important;
        border: 1px solid #dee2e6 !important;
        color: #343a40 !important;
        appearance: none !important;
      }
      .nav-link:hover,
      .nav-link:focus,
      .nav-link:focus-visible,
      .nav-link:active,
      .nav-link:visited {
        background-color: #fff !important;
        color: #343a40 !important;
        outline: none !important;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important;
      }
    `;
  }, [isScrolled]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const topRef = useRef<HTMLDivElement>(null);
  const feedbackRef = useRef<HTMLElement>(null);
  const letterRef = useRef<HTMLElement>(null);
  const interviewRef = useRef<HTMLElement>(null);
  const jobRef = useRef<HTMLElement>(null);

  useEffect(() => {
    fetch('http://localhost:8000/')
      .then((res) => res.json())
      .then((data) => setBackendMsg(data.message))
      .catch(() => setBackendMsg('❌ Failed to connect to backend'));
  }, []);

  useEffect(() => {
    if (showNotification) {
      const timeout = setTimeout(() => {
        setShowNotification('');
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [showNotification]);

  const scrollTo = (ref: React.RefObject<any>, isHome = false) => {
    if (isHome) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (ref.current) {
      const element = ref.current;
      const navHeight = 60;
      const extraSpacing = 20;
      const rect = element.getBoundingClientRect();
      const offsetTop = rect.top + window.pageYOffset - navHeight - extraSpacing;
      
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  };

  const handleFileUpload = async (uploadedFile: File) => {
    setFile(uploadedFile);
    setIsExtractingResume(true);
    setResumeText('');
    setJobMatches([]);

    const formData = new FormData();
    formData.append('file', uploadedFile);

    try {
      console.log("🔄 Uploading resume...");
      const res = await fetch('http://localhost:8000/extract-resume', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      console.log("📄 Resume extracted:", data);
      const resumeText = data.text || '';
      setResumeText(resumeText);
    } catch (err) {
      console.error("❌ Resume extraction failed:", err);
    } finally {
      setIsExtractingResume(false);
    }
  };

  const generateLinks = async () => {
    if (!resumeText) return;  
    setIsGeneratingLinks(true);
    try {
      const res = await fetch('http://localhost:8000/generate-links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume: resumeText }),
      });
      const data = await res.json();
      console.log("🔗 Generated search links:", data);
      setJobMatches(Array.isArray(data?.search_links) ? data.search_links : []);
    } catch (err) {
      console.error('❌ Link generation failed:', err);
    } finally {
      setIsGeneratingLinks(false);
    }
  };

  const getFeedback = async () => {
    if (!file) return;

    setIsFeedbackLoading(true);
    setFeedback('');
    setResumeScore({});

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:8000/upload-resume', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      setFeedback(data.feedback || data.error);

      if (data.scores) {
        setResumeScore(data.scores);
      } else {
        console.warn("No scores found in response");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsFeedbackLoading(false);
    }
  };
  
  const generateInterviewQAPairs = async () => {
    if (!resumeText || !jobPost) return;

    setQaLoading(true);
    setQaPairs([]);
    setQaExpanded([]);

    try {
      const res = await fetch('http://localhost:8000/interview-trainer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume: resumeText, job: jobPost })
      });

      const data = await res.json();

      if (data.pairs && Array.isArray(data.pairs)) {
        setQaPairs(data.pairs);
        setQaExpanded(data.pairs.map(() => false));
      } else {
        console.error('Invalid response:', data);
      }
    } catch (err) {
      console.error('Interview Q&A fetch failed:', err);
    } finally {
      setQaLoading(false);
    }
  };

  const generateCoverLetter = async () => {
    if (!resumeText || !jobPost) return;

    setIsCoverLetterLoading(true);
    setCoverLetter('');

    try {
      const res = await fetch('http://localhost:8000/generate-cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume: resumeText,
          job: jobPost,
        }),
      });

      const data = await res.json();
      setCoverLetter(data.letter || data.error);
    } catch (err) {
      console.error(err);
      setCoverLetter('❌ Failed to generate cover letter');
    } finally {
      setIsCoverLetterLoading(false);
    }
  };

  const saveAsTxt = () => {
    const blob = new Blob([coverLetter], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'cover_letter.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const btnStyle: React.CSSProperties = {
    padding: '0.8rem 1.5rem',
    backgroundColor: '#6c757d',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    boxShadow: '0 3px 6px rgba(0,0,0,0.3)',
    transition: 'all 0.3s ease',
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#343a40',
        color: '#212529',
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
        paddingBottom: '2rem',
        overflowX: 'hidden',
        width: '100vw',
        maxWidth: '100vw'
      }}
    >
      <Navigation
        isScrolled={isScrolled}
        onScrollToSection={(ref) => scrollTo(ref, ref === topRef)}
        topRef={topRef}
        feedbackRef={feedbackRef}
        letterRef={letterRef}
        interviewRef={interviewRef}
        jobRef={jobRef}
        resumeText={resumeText}
        jobPost={jobPost}
        onShowNotification={setShowNotification}
      />

      <Notification 
        message={showNotification}
        isVisible={!!showNotification}
      />

      <HomeSection
        backendMsg={backendMsg}
        isExtractingResume={isExtractingResume}
        resumeText={resumeText}
        onFileUpload={handleFileUpload}
        topRef={topRef}
      />

      <main
        style={{
          width: '100%',
          margin: '0',
          padding: '0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxSizing: 'border-box',
          maxWidth: '100vw',
          overflowX: 'hidden'
        }}
      >
        <FeedbackSection
          isLoading={isFeedbackLoading}
          resumeScore={resumeScore}
          feedback={feedback}
          feedbackRef={feedbackRef}
          onGetFeedback={getFeedback}
          btnStyle={btnStyle}
          resumeText={resumeText}
        />

        <CoverLetterSection
          resumeText={resumeText}
          jobPost={jobPost}
          setJobPost={setJobPost}
          isLoading={isCoverLetterLoading}
          coverLetter={coverLetter}
          letterRef={letterRef}
          onGenerateCoverLetter={generateCoverLetter}
          onSaveAsTxt={saveAsTxt}
          btnStyle={btnStyle}
        />

        <InterviewSection
          resumeText={resumeText}
          jobPost={jobPost}
          qaLoading={qaLoading}
          qaPairs={qaPairs}
          qaExpanded={qaExpanded}
          setQaExpanded={setQaExpanded}
          interviewRef={interviewRef}
          onGenerateInterviewQAPairs={generateInterviewQAPairs}
          btnStyle={btnStyle}
        />

        <JobMatchingSection
          isGeneratingLinks={isGeneratingLinks}
          jobMatches={jobMatches}
          jobRef={jobRef}
          onGenerateLinks={generateLinks}
          btnStyle={btnStyle}
          resumeText={resumeText}
        />
      </main>
    </div>
  );
}

export default App;
