export interface Student {
  id: string;
  name: string;
  studentId: string;
  universityEmail: string;
  major: string;
  university: 'Islamic University' | 'Al-Azhar University' | 'Al-Aqsa University';
  phone: string;
  supervisorId: string | null;
  cvUrl?: string;
  cvName?: string;
}

export interface TrainingProvider {
  id: string;
  companyName: string;
  email: string;
  phone: string;
  address: string;
  description: string;
  isVerified: boolean;
  logoColor: string;
}

export interface Supervisor {
  id: string;
  name: string;
  universityEmail: string;
  university: 'Islamic University' | 'Al-Azhar University' | 'Al-Aqsa University';
  department: string;
  phone?: string;
  isPendingApproval?: boolean;
}

export interface Opportunity {
  id: string;
  providerId: string;
  providerName: string;
  title: string;
  description: string;
  requiredMajor: string;
  requiredSkills: string[];
  availablePositions: number;
  location: string;
  deadline: string;
  status: 'active' | 'closed';
  durationWeeks: number;
}

export interface Application {
  id: string;
  studentId: string;
  studentName: string;
  studentMajor: string;
  studentUniversity: string;
  opportunityId: string;
  opportunityTitle: string;
  providerId: string;
  providerName: string;
  appliedDate: string;
  cvName: string;
  cvUrl: string;
  status: 'pending' | 'accepted' | 'rejected';
  notes?: string;
}

export interface WeeklyReport {
  id: string;
  studentId: string;
  studentName: string;
  weekNumber: number;
  reportDate: string;
  trainingHours: number;
  completedTasks: string;
  challenges: string;
  fileAttachments?: { name: string; url: string }[];
  supervisorFeedback?: string;
  submitDate: string;
  isLate: boolean;
  isReviewed: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'student' | 'provider' | 'supervisor' | 'admin';
  receiverId: string;
  receiverName: string;
  receiverRole: 'student' | 'provider' | 'supervisor' | 'admin';
  content: string;
  timestamp: string;
  isRead: boolean;
}

export interface Evaluation {
  id: string;
  studentId: string;
  studentName: string;
  studentMajor: string;
  studentUniversity: string;
  providerId: string;
  providerName: string;
  supervisorId: string;
  supervisorName: string;
  // Criteria-based provider scores (out of 50)
  attendance: number;       // Max 10
  commitment: number;       // Max 10
  technicalSkills: number;  // Max 15
  teamwork: number;         // Max 15
  providerNotes: string;
  providerSubmittedDate?: string;
  
  // Supervisor scores (out of 50)
  reportsScore: number;     // Max 25
  finalDefenseScore: number; // Max 25
  supervisorNotes: string;
  supervisorSubmittedDate?: string;
  
  // Automated final grade aggregation (out of 100)
  calculatedGrade: number | null;
  isAdminApproved: boolean;
  approvalDate?: string;
}
