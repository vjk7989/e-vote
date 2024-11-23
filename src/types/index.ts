export interface User {
  id: string;
  name: string;
  email: string;
  voterId: string;
  aadhar: string;
  phone: string;
  password: string;
  role: 'admin' | 'voter';
  hasVoted: boolean;
  photoUrl?: string;
  votePhotoUrl?: string;
  lastLogin?: string;
}

export interface Election {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  candidates: Candidate[];
  isActive: boolean;
  results?: ElectionResult[];
}

export interface Candidate {
  id: string;
  name: string;
  party: string;
  description: string;
  imageUrl: string;
  partySymbol: string;
  voteCount: number;
}

export interface ElectionResult {
  candidateId: string;
  candidateName: string;
  partyName: string;
  voteCount: number;
  percentage: number;
}

export interface LoginCredentials {
  identifier: string;
  password: string;
}

export const VALIDATION_PATTERNS = {
  name: /^[a-zA-Z\s]{2,50}$/,
  email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  voterId: /^[A-Z]{3}[0-9]{7}$/,
  aadhar: /^\d{12}$/,
  phone: /^[6-9]\d{9}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
};