export interface ResumeScore {
  category: string;
  score: number;
}

export interface Job {
  platform: string;
  url: string;
}

export interface QAPair {
  question: string;
  answer: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface ResumeAnalysisResponse {
  feedback: string;
  scores: Record<string, number>;
}

export interface CoverLetterResponse {
  letter: string;
}

export interface InterviewResponse {
  pairs: QAPair[];
}

export interface JobLinksResponse {
  search_links: Job[];
}
