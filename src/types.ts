export interface PracticeArea {
  id: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  baseRetainer: number;
  hourlyRate: number;
  typicalHours: number;
  iconName: string;
  keyIssues: string[];
}

export interface Attorney {
  id: string;
  name: string;
  title: string;
  education: string;
  experienceYears: number;
  hourlyRate: number;
  successRate: number;
  image: string;
  specialties: string[];
  bio: string;
  notableCase: string;
}

export interface CaseEstimation {
  practiceAreaId: string;
  complexity: 'standard' | 'complex' | 'high-stakes';
  urgency: 'routine' | 'urgent' | 'immediate';
  attorneyId: string;
  customHours?: number;
}
