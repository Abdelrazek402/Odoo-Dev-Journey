import React from 'react';
import { ActivityOutcome, ActivityType, TaskDifficulty, TaskStatus } from '../../types';

export const StatusBadge: React.FC<{ status: TaskStatus; className?: string }> = ({ status, className = '' }) => {
  switch (status) {
    case 'completed':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          مكتملة
        </span>
      );
    case 'in_progress':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
          قيد التنفيذ
        </span>
      );
    case 'blocked':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          متوقفة / عائق
        </span>
      );
    case 'not_started':
    default:
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
          لم تبدأ
        </span>
      );
  }
};

export const DifficultyBadge: React.FC<{ difficulty: TaskDifficulty; className?: string }> = ({ difficulty, className = '' }) => {
  switch (difficulty) {
    case 'advanced':
      return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 ${className}`}>
          متقدم
        </span>
      );
    case 'intermediate':
      return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 ${className}`}>
          متوسط
        </span>
      );
    case 'beginner':
    default:
      return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 ${className}`}>
          مبتدئ
        </span>
      );
  }
};

export const ActivityTypeBadge: React.FC<{ type: ActivityType; className?: string }> = ({ type, className = '' }) => {
  const labels: Record<ActivityType, { label: string; color: string }> = {
    lesson: { label: 'درس نظري', color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20' },
    coding: { label: 'برمجة وتطبيق', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
    debugging: { label: 'تصحيح أخطاء', color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' },
    project: { label: 'مشروع عملي', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' },
    revision: { label: 'مراجعة وتثبيت', color: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20' },
    assessment: { label: 'تقييم واختبار', color: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20' },
    documentation: { label: 'توثيق وقراءة', color: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20' },
    other: { label: 'نشاط آخر', color: 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20' }
  };

  const item = labels[type] || labels.other;

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${item.color} ${className}`}>
      {item.label}
    </span>
  );
};

export const OutcomeBadge: React.FC<{ outcome: ActivityOutcome; className?: string }> = ({ outcome, className = '' }) => {
  switch (outcome) {
    case 'completed':
      return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 ${className}`}>
          مكتمل بالكامل
        </span>
      );
    case 'partially_completed':
      return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 ${className}`}>
          مكتمل جزئياً
        </span>
      );
    case 'needs_follow_up':
    default:
      return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 ${className}`}>
          يحتاج متابعة
        </span>
      );
  }
};
