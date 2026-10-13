import React, { createContext, useContext, useEffect, useState, useTransition } from 'react';
import {
  ActivityLog,
  AppNotification,
  LearningResource,
  Project,
  RoadmapTask,
  Skill,
  UserSettings,
  WeeklyReview
} from '../types';
import {
  AppDatabaseState,
  getInitialDefaultState,
  storageAdapter
} from '../services/storage';
import { getCairoTodayString } from '../services/dateUtils';

export type ActiveView =
  | 'dashboard'
  | 'roadmap'
  | 'today'
  | 'activities'
  | 'projects'
  | 'skills'
  | 'reviews'
  | 'resources'
  | 'reports'
  | 'settings';

interface TimerState {
  isActive: boolean;
  isPaused: boolean;
  elapsedSeconds: number;
  taskId?: string;
  taskTitle?: string;
}

interface AppContextType {
  state: AppDatabaseState;
  isLoading: boolean;
  isSaving: boolean;
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  selectedTaskId: string | null;
  setSelectedTaskId: (id: string | null) => void;
  notifications: AppNotification[];
  addToast: (message: string, type?: AppNotification['type']) => void;
  removeToast: (id: string) => void;

  // Actions
  updateSettings: (partial: Partial<UserSettings>) => void;
  updateTask: (taskId: string, partial: Partial<RoadmapTask>) => void;
  addActivity: (activity: Omit<ActivityLog, 'id' | 'createdAt' | 'updatedAt'>) => ActivityLog;
  updateActivity: (activityId: string, partial: Partial<ActivityLog>) => void;
  deleteActivity: (activityId: string) => void;
  updateProject: (projectId: string, partial: Partial<Project>) => void;
  toggleProjectDeliverable: (projectId: string, deliverableIndex: number) => void;
  toggleProjectMilestone: (projectId: string, milestoneId: string) => void;
  updateSkillRating: (
    skillId: string,
    rating: number,
    evidence: string,
    improvement: string,
    nextPractice: string
  ) => void;
  updateWeeklyReview: (reviewId: string, partial: Partial<WeeklyReview>) => void;
  addResource: (resource: Omit<LearningResource, 'id' | 'createdAt'>) => void;
  deleteResource: (resourceId: string) => void;
  resetProgress: (mode: 'reset_tasks_keep_logs' | 'clear_all') => Promise<void>;
  importBackupState: (importedState: AppDatabaseState) => Promise<void>;

  // Timer
  timer: TimerState;
  startTimer: (taskId?: string, taskTitle?: string) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: () => number; // returns elapsed minutes
  resetTimer: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppDatabaseState>(getInitialDefaultState());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [, startTransition] = useTransition();

  // Timer
  const [timer, setTimer] = useState<TimerState>({
    isActive: false,
    isPaused: false,
    elapsedSeconds: 0
  });

  // Load from IndexedDB on startup
  useEffect(() => {
    let isMounted = true;
    storageAdapter
      .loadState()
      .then((loaded) => {
        if (isMounted) {
          setState(loaded);
          setIsLoading(false);
          // Apply theme
          if (loaded.settings.theme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      })
      .catch((err) => {
        console.error('Failed to load initial state:', err);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Timer interval
  useEffect(() => {
    let interval: any = null;
    if (timer.isActive && !timer.isPaused) {
      interval = setInterval(() => {
        setTimer((prev) => ({ ...prev, elapsedSeconds: prev.elapsedSeconds + 1 }));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer.isActive, timer.isPaused]);

  // Persist helper
  const persistState = (nextState: AppDatabaseState) => {
    setState(nextState);
    setIsSaving(true);
    storageAdapter.saveState(nextState).finally(() => {
      setIsSaving(false);
    });
  };

  const addToast = (message: string, type: AppNotification['type'] = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newNote: AppNotification = { id, message, type, timestamp: Date.now() };
    setNotifications((prev) => [...prev, newNote]);

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const updateSettings = (partial: Partial<UserSettings>) => {
    const nextSettings = { ...state.settings, ...partial };
    // Theme toggle side-effect
    if (partial.theme) {
      if (partial.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    persistState({ ...state, settings: nextSettings });
    addToast('تم تحديث الإعدادات بنجاح', 'success');
  };

  const updateTask = (taskId: string, partial: Partial<RoadmapTask>) => {
    const updatedTasks = state.tasks.map((task) => {
      if (task.id === taskId) {
        const isNowCompleted = partial.status === 'completed' && task.status !== 'completed';
        return {
          ...task,
          ...partial,
          completedAt: isNowCompleted ? new Date().toISOString() : task.completedAt,
          updatedAt: new Date().toISOString()
        };
      }
      return task;
    });

    persistState({ ...state, tasks: updatedTasks });
    addToast('تم تحديث بيانات المهمة', 'success');
  };

  const addActivity = (activityData: Omit<ActivityLog, 'id' | 'createdAt' | 'updatedAt'>): ActivityLog => {
    const nowIso = new Date().toISOString();
    const newActivity: ActivityLog = {
      ...activityData,
      id: `act-${Date.now()}`,
      createdAt: nowIso,
      updatedAt: nowIso
    };

    // If linked to a task, update the task's actual duration as well
    let updatedTasks = state.tasks;
    if (activityData.taskId) {
      updatedTasks = state.tasks.map((t) => {
        if (t.id === activityData.taskId) {
          return {
            ...t,
            actualDurationMinutes: (t.actualDurationMinutes || 0) + activityData.durationMinutes,
            updatedAt: nowIso
          };
        }
        return t;
      });
    }

    const nextActivities = [newActivity, ...state.activities];
    persistState({ ...state, tasks: updatedTasks, activities: nextActivities });
    addToast('تم تسجيل جلسة المذاكرة بنجاح', 'success');
    return newActivity;
  };

  const updateActivity = (activityId: string, partial: Partial<ActivityLog>) => {
    const nextActivities = state.activities.map((act) => {
      if (act.id === activityId) {
        return { ...act, ...partial, updatedAt: new Date().toISOString() };
      }
      return act;
    });

    persistState({ ...state, activities: nextActivities });
    addToast('تم تعديل سجل النشاط', 'success');
  };

  const deleteActivity = (activityId: string) => {
    const target = state.activities.find((a) => a.id === activityId);
    const nextActivities = state.activities.filter((a) => a.id !== activityId);

    // If linked to a task, subtract duration
    let updatedTasks = state.tasks;
    if (target && target.taskId && target.durationMinutes) {
      updatedTasks = state.tasks.map((t) => {
        if (t.id === target.taskId) {
          return {
            ...t,
            actualDurationMinutes: Math.max(0, (t.actualDurationMinutes || 0) - target.durationMinutes),
            updatedAt: new Date().toISOString()
          };
        }
        return t;
      });
    }

    persistState({ ...state, tasks: updatedTasks, activities: nextActivities });
    addToast('تم حذف السجل بنجاح', 'info');
  };

  const updateProject = (projectId: string, partial: Partial<Project>) => {
    const nextProjects = state.projects.map((p) => {
      if (p.id === projectId) {
        return { ...p, ...partial, updatedAt: new Date().toISOString() };
      }
      return p;
    });
    persistState({ ...state, projects: nextProjects });
    addToast('تم تحديث بيانات المشروع', 'success');
  };

  const toggleProjectDeliverable = (projectId: string, deliverableIndex: number) => {
    const nextProjects = state.projects.map((p) => {
      if (p.id === projectId) {
        const nextDeliverables = p.deliverables.map((del, idx) => {
          if (idx === deliverableIndex) {
            return { ...del, completed: !del.completed };
          }
          return del;
        });
        return { ...p, deliverables: nextDeliverables, updatedAt: new Date().toISOString() };
      }
      return p;
    });
    persistState({ ...state, projects: nextProjects });
  };

  const toggleProjectMilestone = (projectId: string, milestoneId: string) => {
    const nextProjects = state.projects.map((p) => {
      if (p.id === projectId) {
        const nextMilestones = p.milestones.map((m) => {
          if (m.id === milestoneId) {
            return {
              ...m,
              completed: !m.completed,
              completedAt: !m.completed ? new Date().toISOString() : undefined
            };
          }
          return m;
        });
        return { ...p, milestones: nextMilestones, updatedAt: new Date().toISOString() };
      }
      return p;
    });
    persistState({ ...state, projects: nextProjects });
  };

  const updateSkillRating = (
    skillId: string,
    rating: number,
    evidence: string,
    improvement: string,
    nextPractice: string
  ) => {
    const todayStr = getCairoTodayString();
    const nextSkills = state.skills.map((skill) => {
      if (skill.id === skillId) {
        const newEntry = {
          id: `eval-${Date.now()}`,
          rating,
          date: todayStr,
          supportingEvidence: evidence,
          areasForImprovement: improvement,
          nextPracticeActivity: nextPractice
        };
        return {
          ...skill,
          currentRating: rating,
          history: [newEntry, ...skill.history]
        };
      }
      return skill;
    });

    persistState({ ...state, skills: nextSkills });
    addToast('تم تسجيل التقييم الذاتي للمهارة', 'success');
  };

  const updateWeeklyReview = (reviewId: string, partial: Partial<WeeklyReview>) => {
    const nextReviews = state.reviews.map((r) => {
      if (r.id === reviewId) {
        return {
          ...r,
          ...partial,
          reviewedAt: new Date().toISOString()
        };
      }
      return r;
    });
    persistState({ ...state, reviews: nextReviews });
    addToast('تم حفظ المراجعة الأسبوعية بنجاح', 'success');
  };

  const addResource = (resData: Omit<LearningResource, 'id' | 'createdAt'>) => {
    const newRes: LearningResource = {
      ...resData,
      id: `res-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    persistState({ ...state, resources: [newRes, ...state.resources] });
    addToast('تمت إضافة المصدر إلى المكتبة', 'success');
  };

  const deleteResource = (resourceId: string) => {
    const nextResources = state.resources.filter((r) => r.id !== resourceId);
    persistState({ ...state, resources: nextResources });
    addToast('تم حذف المصدر', 'info');
  };

  const resetProgress = async (mode: 'reset_tasks_keep_logs' | 'clear_all') => {
    if (mode === 'clear_all') {
      const fresh = getInitialDefaultState();
      await storageAdapter.clearDatabase();
      await storageAdapter.saveState(fresh);
      setState(fresh);
      addToast('تم مسح جميع السجلات وإعادة التهيئة', 'warning');
    } else {
      // reset tasks to not started, keep activity logs intact
      const defaultState = getInitialDefaultState();
      const updatedTasks = defaultState.tasks;
      const nextState = {
        ...state,
        tasks: updatedTasks
      };
      await storageAdapter.saveState(nextState);
      setState(nextState);
      addToast('تمت إعادة تعيين حالة المهام مع الاحتفاظ بسجلات المذاكرة', 'info');
    }
  };

  const importBackupState = async (importedState: AppDatabaseState) => {
    await storageAdapter.saveState(importedState);
    setState(importedState);
    addToast('تم استعادة النسخة الاحتياطية بنجاح', 'success');
  };

  // Timer controls
  const startTimer = (taskId?: string, taskTitle?: string) => {
    setTimer({
      isActive: true,
      isPaused: false,
      elapsedSeconds: 0,
      taskId,
      taskTitle
    });
    addToast('بدأ مؤقت المذاكرة! بالتوفيق والتركيز.', 'info');
  };

  const pauseTimer = () => {
    setTimer((prev) => ({ ...prev, isPaused: true }));
  };

  const resumeTimer = () => {
    setTimer((prev) => ({ ...prev, isPaused: false }));
  };

  const stopTimer = (): number => {
    const minutes = Math.max(1, Math.round(timer.elapsedSeconds / 60));
    setTimer({ isActive: false, isPaused: false, elapsedSeconds: 0 });
    return minutes;
  };

  const resetTimer = () => {
    setTimer({ isActive: false, isPaused: false, elapsedSeconds: 0 });
  };

  return (
    <AppContext.Provider
      value={{
        state,
        isLoading,
        isSaving,
        activeView,
        setActiveView,
        selectedTaskId,
        setSelectedTaskId,
        notifications,
        addToast,
        removeToast,
        updateSettings,
        updateTask,
        addActivity,
        updateActivity,
        deleteActivity,
        updateProject,
        toggleProjectDeliverable,
        toggleProjectMilestone,
        updateSkillRating,
        updateWeeklyReview,
        addResource,
        deleteResource,
        resetProgress,
        importBackupState,
        timer,
        startTimer,
        pauseTimer,
        resumeTimer,
        stopTimer,
        resetTimer
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
