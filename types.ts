
export interface LawyerMatch {
  name: string;
  category: string;
  state: string;
  urgency: string;
  summary: string;
}

export interface AnalysisResult {
  category: string;
  state: string;
  urgency: 'Low' | 'Medium' | 'High';
  shortSummary: string;
}

export interface Lawyer {
  id: string;
  name: string;
  initials: string;
  title: string;
  rating: number;
  reviews: number;
  specialty: string;
  yearsExperience: number;
  barNumber: string;
  responseTime: string;
  consultationRate: string;
  languages: string[];
  online: boolean;
}
