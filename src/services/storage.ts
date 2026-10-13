import {
  ActivityLog,
  LearningResource,
  Project,
  RoadmapTask,
  Skill,
  UserSettings,
  WeeklyReview
} from '../types';
import { INITIAL_ROADMAP_TASKS } from '../data/curriculum';
import { INITIAL_PROJECTS } from '../data/initialProjects';
import { INITIAL_RESOURCES } from '../data/initialResources';
import { INITIAL_SKILLS } from '../data/initialSkills';
import { getCairoTodayString } from './dateUtils';

export interface AppDatabaseState {
  settings: UserSettings;
  tasks: RoadmapTask[];
  activities: ActivityLog[];
  projects: Project[];
  skills: Skill[];
  reviews: WeeklyReview[];
  resources: LearningResource[];
  version: number;
  lastSavedAt: string;
}

const DB_NAME = 'OdooDevJourneyDB';
const DB_VERSION = 1;
const STORE_NAME = 'app_state';
const STATE_KEY = 'root_state';
const LOCAL_STORAGE_KEY = 'odoo_dev_journey_state_v1';

export const DEFAULT_USER_SETTINGS: UserSettings = {
  startDate: getCairoTodayString(),
  targetWeeks: 12,
  dailyTargetMinutes: 120,
  coreDaysPerWeek: 5,
  optionalReviewDayMinutes: 60,
  targetCoreHours: 120,
  timezone: 'Africa/Cairo',
  theme: 'dark',
  storageMode: 'local',
  onboardingCompleted: false,
  userName: 'مطور أودو'
};

export function getInitialDefaultState(): AppDatabaseState {
  const initialReviews: WeeklyReview[] = Array.from({ length: 12 }, (_, i) => ({
    id: `review-w${i + 1}`,
    week: i + 1,
    title: `مراجعة الأسبوع ${i + 1}`,
    whatLearned: '',
    whatBuilt: '',
    completedTaskIds: [],
    hardestProblem: '',
    solution: '',
    stillNotUnderstood: '',
    needsRevisionTopic: '',
    actualHours: 0,
    confidenceRating: 0,
    evidenceLinks: [],
    prioritiesNextWeek: '',
    completed: false
  }));

  return {
    settings: { ...DEFAULT_USER_SETTINGS },
    tasks: [...INITIAL_ROADMAP_TASKS],
    activities: [],
    projects: [...INITIAL_PROJECTS],
    skills: [...INITIAL_SKILLS],
    reviews: initialReviews,
    resources: [...INITIAL_RESOURCES],
    version: 1,
    lastSavedAt: new Date().toISOString()
  };
}

class IndexedDBStorageAdapter {
  private dbPromise: Promise<IDBDatabase> | null = null;

  private getDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        reject(new Error('IndexedDB is not available in this environment'));
        return;
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error || new Error('Failed to open IndexedDB'));
      };
    });

    return this.dbPromise;
  }

  async loadState(): Promise<AppDatabaseState> {
    try {
      const db = await this.getDB();
      return await new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(STATE_KEY);

        req.onsuccess = () => {
          if (req.result) {
            resolve(req.result as AppDatabaseState);
          } else {
            // Check fallback in localStorage
            const localFallback = this.loadFromLocalStorage();
            if (localFallback) {
              resolve(localFallback);
            } else {
              const defaultState = getInitialDefaultState();
              resolve(defaultState);
            }
          }
        };

        req.onerror = () => {
          const localFallback = this.loadFromLocalStorage();
          if (localFallback) resolve(localFallback);
          else resolve(getInitialDefaultState());
        };
      });
    } catch {
      // Fallback to localStorage
      const localFallback = this.loadFromLocalStorage();
      return localFallback || getInitialDefaultState();
    }
  }

  async saveState(state: AppDatabaseState): Promise<boolean> {
    const stateToSave = {
      ...state,
      lastSavedAt: new Date().toISOString()
    };

    // Always mirror to localStorage as synchronous safety net
    this.saveToLocalStorage(stateToSave);

    try {
      const db = await this.getDB();
      return await new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.put(stateToSave, STATE_KEY);

        req.onsuccess = () => resolve(true);
        req.onerror = () => resolve(false);
      });
    } catch {
      return true; // Already saved to localStorage
    }
  }

  private loadFromLocalStorage(): AppDatabaseState | null {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  private saveToLocalStorage(state: AppDatabaseState): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.warn('Could not write to localStorage:', err);
    }
  }

  async clearDatabase(): Promise<boolean> {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      } catch {}
    }
    try {
      const db = await this.getDB();
      return await new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.delete(STATE_KEY);
        req.onsuccess = () => resolve(true);
        req.onerror = () => resolve(false);
      });
    } catch {
      return true;
    }
  }
}

export const storageAdapter = new IndexedDBStorageAdapter();

/**
 * Export all application data to a downloadable JSON backup
 */
export function exportDatabaseToJSON(state: AppDatabaseState): void {
  const exportPayload = {
    app: 'OdooDevJourney',
    exportDate: new Date().toISOString(),
    version: state.version || 1,
    data: state
  };

  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(exportPayload, null, 2))}`;
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', jsonString);
  downloadAnchor.setAttribute('download', `odoo_dev_journey_backup_${getCairoTodayString()}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

/**
 * Validate imported JSON backup structure
 */
export function validateBackupJSON(parsed: any): { isValid: boolean; error?: string; state?: AppDatabaseState } {
  if (!parsed || typeof parsed !== 'object') {
    return { isValid: false, error: 'الملف لا يحتوي على كائن بيانات صالح' };
  }

  // Handle both direct state and wrapped backup format
  const data: AppDatabaseState = parsed.data ? parsed.data : parsed;

  if (!data.settings || !Array.isArray(data.tasks)) {
    return { isValid: false, error: 'تنسيق الملف غير صالح: عناصر الإعدادات أو المهام مفقودة' };
  }

  if (!Array.isArray(data.activities)) {
    data.activities = [];
  }
  if (!Array.isArray(data.projects)) {
    data.projects = [...INITIAL_PROJECTS];
  }
  if (!Array.isArray(data.skills)) {
    data.skills = [...INITIAL_SKILLS];
  }
  if (!Array.isArray(data.reviews)) {
    data.reviews = [];
  }
  if (!Array.isArray(data.resources)) {
    data.resources = [...INITIAL_RESOURCES];
  }

  return { isValid: true, state: data };
}

/**
 * Export Activity Logs to CSV
 */
export function exportActivitiesToCSV(activities: ActivityLog[], tasks: RoadmapTask[]): void {
  if (!activities || activities.length === 0) {
    alert('لا توجد سجلات أنشطة لتصديرها');
    return;
  }

  const taskMap = new Map<string, string>();
  tasks.forEach(t => taskMap.set(t.id, t.titleAr));

  const headers = [
    'ID',
    'التاريخ (Date)',
    'وقت البدء (Start Time)',
    'وقت الانتهاء (End Time)',
    'المدة بالدقائق (Duration Minutes)',
    'معرف المهمة (Task ID)',
    'عنوان المهمة (Task Title)',
    'الأسبوع (Week)',
    'نوع النشاط (Activity Type)',
    'المهارة التقنية (Technical Skill)',
    'ملخص النشاط (Summary)',
    'ما تعلمته (What Learned)',
    'المشكلة والتحدي (Problem Encountered)',
    'الحل وخطوات التصحيح (Solution)',
    'مستوى الثقة (Confidence 1-5)',
    'النتيجة (Outcome)',
    'رابط GitHub (Reference)'
  ];

  const escapeCSV = (str: string | number | undefined | null) => {
    if (str === undefined || str === null) return '""';
    const clean = String(str).replace(/"/g, '""');
    return `"${clean}"`;
  };

  const rows = activities.map(a => [
    escapeCSV(a.id),
    escapeCSV(a.date),
    escapeCSV(a.startTime || ''),
    escapeCSV(a.endTime || ''),
    escapeCSV(a.durationMinutes),
    escapeCSV(a.taskId || ''),
    escapeCSV(a.taskId ? taskMap.get(a.taskId) || '' : ''),
    escapeCSV(a.week || ''),
    escapeCSV(a.activityType),
    escapeCSV(a.technicalSkill || ''),
    escapeCSV(a.summary),
    escapeCSV(a.whatLearned),
    escapeCSV(a.problemEncountered || ''),
    escapeCSV(a.solutionTroubleshooting || ''),
    escapeCSV(a.confidenceRating),
    escapeCSV(a.outcome),
    escapeCSV(a.githubReference || '')
  ]);

  // Prepend UTF-8 BOM so Excel opens Arabic correctly
  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', url);
  downloadAnchor.setAttribute('download', `odoo_study_activities_${getCairoTodayString()}.csv`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  URL.revokeObjectURL(url);
}
