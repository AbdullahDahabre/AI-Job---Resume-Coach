import type { 
  ResumeAnalysisResponse, 
  CoverLetterResponse, 
  InterviewResponse, 
  JobLinksResponse 
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class ApiService {
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async analyzeResume(file: File): Promise<ResumeAnalysisResponse> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_BASE_URL}/upload-resume`, {
      method: 'POST',
      body: formData,
    });
    
    return this.handleResponse<ResumeAnalysisResponse>(response);
  }

  async extractResumeText(file: File): Promise<{ text: string; score: any[] }> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_BASE_URL}/extract-resume`, {
      method: 'POST',
      body: formData,
    });
    
    return this.handleResponse<{ text: string; score: any[] }>(response);
  }

  async generateCoverLetter(resume: string, job: string): Promise<CoverLetterResponse> {
    const response = await fetch(`${API_BASE_URL}/generate-cover-letter`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ resume, job }),
    });
    
    return this.handleResponse<CoverLetterResponse>(response);
  }

  async generateInterviewQuestions(resume: string, job: string): Promise<InterviewResponse> {
    const response = await fetch(`${API_BASE_URL}/interview-trainer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ resume, job }),
    });
    
    return this.handleResponse<InterviewResponse>(response);
  }

  async generateJobLinks(resume: string): Promise<JobLinksResponse> {
    const response = await fetch(`${API_BASE_URL}/generate-links`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ resume }),
    });
    
    return this.handleResponse<JobLinksResponse>(response);
  }
}

export const apiService = new ApiService();
