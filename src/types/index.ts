export type TaskStatus = 'not_started' | 'in_progress' | 'completed' | 'blocked';
export type TaskDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type ActivityType = 'lesson' | 'coding' | 'debugging' | 'project' | 'revision' | 'assessment' | 'documentation' | 'other';
export type ActivityOutcome = 'completed' | 'partially_completed' | 'needs_follow_up';
export type StorageMode = 'local' | 'cloud';

export interface UserSettings {
  startDate: string; // YYYY-MM-DD
  targetWeeks: number; // 12
  dailyTargetMinutes: number; // 120 (2 hours)
  coreDaysPerWeek: number; // 5
  optionalReviewDayMinutes: number; // 60
  targetCoreHours: number; // 120
  timezone: string; // 'Africa/Cairo'
  theme: 'light' | 'dark' | 'system';
  storageMode: StorageMode;
  onboardingCompleted: boolean;
  userName: string;
}

export interface RoadmapTask {
  id: string; // e.g. "w1-d1"
  week: number; // 1-12
  day: number; // 1-6 (1-5 core, 6 optional review)
  isOptionalReview: boolean;
  titleAr: string;
  titleEn?: string;
  learningObjective: string;
  detailedExplanation: string;
  practicalExercise: string;
  expectedDeliverable: string;
  acceptanceCriteria: string[];
  estimatedMinutes: number;
  actualDurationMinutes: number;
  status: TaskStatus;
  difficulty: TaskDifficulty;
  technicalSkills: string[];
  resourceLinks: { title: string; url: string }[];
  personalNotes: string;
  codeSnippet?: string;
  blockerReason?: string;
  blockerResolution?: string;
  completedAt?: string; // ISO date
  createdAt: string;
  updatedAt: string;
}

export interface ActivityLog {
  id: string;
  date: string; // YYYY-MM-DD
  startTime?: string; // HH:mm
  endTime?: string; // HH:mm
  durationMinutes: number;
  taskId?: string; // linked roadmap task ID
  week?: number;
  technicalSkill?: string;
  activityType: ActivityType;
  summary: string;
  detailedNotes?: string;
  codeSnippet?: string;
  problemEncountered?: string;
  solutionTroubleshooting?: string;
  whatLearned: string;
  confidenceRating: number; // 1-5
  difficultyRating: TaskDifficulty;
  outcome: ActivityOutcome;
  githubReference?: string;
  nextAction?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  completedAt?: string;
}

export interface Project {
  id: string; // 'project-a', 'project-b', 'project-c', 'project-capstone'
  code: string;
  titleAr: string;
  titleEn: string;
  purpose: string;
  description: string;
  objectives: string[];
  deliverables: { title: string; completed: boolean; notes?: string }[];
  milestones: ProjectMilestone[];
  status: 'planned' | 'in_progress' | 'completed' | 'blocked';
  estimatedHours: number;
  actualHours: number;
  blockers?: string;
  evidenceLinks: { title: string; url: string }[];
  lessonsLearned?: string;
  retrospectiveNotes?: string;
  completedAt?: string;
  updatedAt: string;
}

export interface SkillAssessmentEntry {
  id: string;
  rating: number; // 1-5
  date: string; // YYYY-MM-DD
  supportingEvidence: string;
  areasForImprovement: string;
  nextPracticeActivity: string;
}

export interface Skill {
  id: string;
  nameAr: string;
  nameEn: string;
  category: 'python' | 'odoo_backend' | 'web_frontend' | 'devops_db' | 'testing_arch';
  description: string;
  currentRating: number; // 0-5 (0 = not assessed yet)
  history: SkillAssessmentEntry[];
  relatedTaskIds: string[];
  relatedProjectIds: string[];
}

export interface WeeklyReview {
  id: string; // e.g. "review-w1"
  week: number;
  title: string;
  whatLearned: string;
  whatBuilt: string;
  completedTaskIds: string[];
  hardestProblem: string;
  solution: string;
  stillNotUnderstood: string;
  needsRevisionTopic: string;
  actualHours: number; // calculated or confirmed
  confidenceRating: number; // 1-5
  selfAssessedQuizScore?: number; // 0-100
  evidenceLinks: { title: string; url: string }[];
  prioritiesNextWeek: string;
  completed: boolean;
  reviewedAt?: string;
}

export interface LearningResource {
  id: string;
  title: string;
  url: string;
  category: 'python' | 'git' | 'postgresql' | 'odoo_backend' | 'odoo_frontend' | 'web_tech' | 'custom';
  week?: number;
  description: string;
  isOfficial: boolean;
  tags: string[];
  notes?: string;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  timestamp: number;
}
