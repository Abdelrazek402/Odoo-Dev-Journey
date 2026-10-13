import { ActivityLog, Project, RoadmapTask, Skill, WeeklyReview } from '../types';
import { calculateLearningStreak, getCairoTodayString, getWeekDateRange } from './dateUtils';

export interface DashboardMetrics {
  coreCompletionPercentage: number; // 0-100
  completedCoreTasksCount: number; // out of 60
  totalCoreTasksCount: number; // 60
  tasksInProgressCount: number;
  blockedTasksCount: number;
  actualStudyHours: number; // sum of actual activity durations in hours
  targetStudyHours: number; // 120
  remainingStudyHours: number;
  daysWithActivitiesCount: number;
  averageAssessmentScore: number | null; // null if no assessments entered yet
  currentStreak: number;
  longestStreak: number;
  todayRecordedMinutes: number;
  weekActualHours: number;
}

export function computeDashboardMetrics(
  tasks: RoadmapTask[],
  activities: ActivityLog[],
  reviews: WeeklyReview[],
  startDateStr: string,
  targetCoreHours: number = 120
): DashboardMetrics {
  const coreTasks = tasks.filter(t => !t.isOptionalReview);
  const totalCoreTasksCount = coreTasks.length || 60;
  const completedCoreTasksCount = coreTasks.filter(t => t.status === 'completed').length;
  const coreCompletionPercentage = Math.round((completedCoreTasksCount / totalCoreTasksCount) * 100);

  const tasksInProgressCount = tasks.filter(t => t.status === 'in_progress').length;
  const blockedTasksCount = tasks.filter(t => t.status === 'blocked').length;

  // Actual study hours from real activity logs only
  const totalRecordedMinutes = activities.reduce((acc, act) => acc + (act.durationMinutes || 0), 0);
  const actualStudyHours = Number((totalRecordedMinutes / 60).toFixed(1));
  const remainingStudyHours = Number(Math.max(0, targetCoreHours - actualStudyHours).toFixed(1));

  // Unique activity dates
  const uniqueDates = Array.from(new Set(activities.map(a => a.date)));
  const daysWithActivitiesCount = uniqueDates.length;

  // Real assessment scores only
  const assessmentsWithScore = reviews.filter(r => r.selfAssessedQuizScore !== undefined && r.selfAssessedQuizScore !== null);
  const averageAssessmentScore = assessmentsWithScore.length > 0
    ? Math.round(assessmentsWithScore.reduce((sum, r) => sum + (r.selfAssessedQuizScore || 0), 0) / assessmentsWithScore.length)
    : null;

  // Streak
  const todayStr = getCairoTodayString();
  const { currentStreak, longestStreak } = calculateLearningStreak(uniqueDates, todayStr);

  // Today's minutes
  const todayRecordedMinutes = activities
    .filter(a => a.date === todayStr)
    .reduce((sum, a) => sum + (a.durationMinutes || 0), 0);

  // Current week actual hours
  // Find current week range
  const now = new Date();
  const start = new Date(startDateStr);
  const diffDays = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const currentWeek = Math.max(1, Math.min(12, Math.floor(diffDays / 7) + 1));
  const weekRange = getWeekDateRange(startDateStr, currentWeek);

  const weekActualMinutes = activities
    .filter(a => a.date >= weekRange.start && a.date <= weekRange.end)
    .reduce((sum, a) => sum + (a.durationMinutes || 0), 0);
  const weekActualHours = Number((weekActualMinutes / 60).toFixed(1));

  return {
    coreCompletionPercentage,
    completedCoreTasksCount,
    totalCoreTasksCount,
    tasksInProgressCount,
    blockedTasksCount,
    actualStudyHours,
    targetStudyHours: targetCoreHours,
    remainingStudyHours,
    daysWithActivitiesCount,
    averageAssessmentScore,
    currentStreak,
    longestStreak,
    todayRecordedMinutes,
    weekActualHours
  };
}

export interface WeeklyComparisonItem {
  week: number;
  plannedCoreHours: number; // 10 hrs default
  actualHours: number;
  coreTasksCompleted: number;
  totalCoreTasks: number; // 5
  reviewCompleted: boolean;
  assessmentScore?: number | null;
}

export function computeWeeklySummary(
  tasks: RoadmapTask[],
  activities: ActivityLog[],
  reviews: WeeklyReview[],
  startDateStr: string
): WeeklyComparisonItem[] {
  const result: WeeklyComparisonItem[] = [];

  for (let w = 1; w <= 12; w++) {
    const weekRange = getWeekDateRange(startDateStr, w);
    const weekActivities = activities.filter(a => {
      // either logged with week tag or falls within date range
      if (a.week === w) return true;
      return a.date >= weekRange.start && a.date <= weekRange.end;
    });

    const totalMinutes = weekActivities.reduce((acc, act) => acc + (act.durationMinutes || 0), 0);
    const actualHours = Number((totalMinutes / 60).toFixed(1));

    const weekCoreTasks = tasks.filter(t => t.week === w && !t.isOptionalReview);
    const completedCount = weekCoreTasks.filter(t => t.status === 'completed').length;
    const reviewTask = tasks.find(t => t.week === w && t.isOptionalReview);
    const reviewCompleted = reviewTask ? reviewTask.status === 'completed' : false;

    const reviewObj = reviews.find(r => r.week === w);

    result.push({
      week: w,
      plannedCoreHours: 10,
      actualHours,
      coreTasksCompleted: completedCount,
      totalCoreTasks: 5,
      reviewCompleted,
      assessmentScore: reviewObj?.selfAssessedQuizScore ?? null
    });
  }

  return result;
}

/**
 * Compute progress percentage for a project from actual milestones and deliverables.
 */
export function computeProjectProgress(project: Project): {
  percentage: number;
  completedMilestones: number;
  totalMilestones: number;
  completedDeliverables: number;
  totalDeliverables: number;
} {
  const totalMilestones = project.milestones.length;
  const completedMilestones = project.milestones.filter(m => m.completed).length;

  const totalDeliverables = project.deliverables.length;
  const completedDeliverables = project.deliverables.filter(d => d.completed).length;

  const totalItems = totalMilestones + totalDeliverables;
  if (totalItems === 0) {
    return { percentage: 0, completedMilestones: 0, totalMilestones: 0, completedDeliverables: 0, totalDeliverables: 0 };
  }

  const completedItems = completedMilestones + completedDeliverables;
  const percentage = Math.round((completedItems / totalItems) * 100);

  return {
    percentage,
    completedMilestones,
    totalMilestones,
    completedDeliverables,
    totalDeliverables
  };
}

/**
 * Find next uncompleted core task
 */
export function findNextTask(tasks: RoadmapTask[]): RoadmapTask | null {
  // First look for any task in_progress
  const inProgress = tasks.find(t => t.status === 'in_progress');
  if (inProgress) return inProgress;

  // Then look for first not_started core task
  const notStartedCore = tasks.find(t => !t.isOptionalReview && t.status === 'not_started');
  if (notStartedCore) return notStartedCore;

  // Then any not started
  return tasks.find(t => t.status === 'not_started') || null;
}
