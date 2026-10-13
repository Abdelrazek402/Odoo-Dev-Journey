import React, { useState } from 'react';
import {
  BookOpenCheck,
  PlusCircle,
  Download,
  Search,
  Filter,
  Calendar,
  Clock,
  Trash2,
  Edit2,
  ExternalLink,
  Code2,
  AlertCircle,
  Tag,
  Star
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ActivityLog, ActivityType, ActivityOutcome } from '../../types';
import { exportActivitiesToCSV } from '../../services/storage';
import { formatArabicDate } from '../../services/dateUtils';
import { ActivityTypeBadge, OutcomeBadge, DifficultyBadge } from '../common/Badge';
import { EmptyState } from '../common/EmptyState';
import { ConfirmDialog } from '../common/ConfirmDialog';

interface ActivityJournalViewProps {
  onOpenLogModal: (initialMinutes?: number, initialTaskId?: string, activityToEdit?: ActivityLog) => void;
}

export const ActivityJournalView: React.FC<ActivityJournalViewProps> = ({
  onOpenLogModal
}) => {
  const { state, deleteActivity } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterOutcome, setFilterOutcome] = useState<string>('all');
  const [filterWeek, setFilterWeek] = useState<string>('all');
  const [activityToDelete, setActivityToDelete] = useState<ActivityLog | null>(null);

  // Filter activities
  const filteredActivities = state.activities.filter((act) => {
    if (filterType !== 'all' && act.activityType !== filterType) return false;
    if (filterOutcome !== 'all' && act.outcome !== filterOutcome) return false;
    if (filterWeek !== 'all' && String(act.week) !== filterWeek) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchSummary = act.summary.toLowerCase().includes(q);
      const matchLearned = act.whatLearned.toLowerCase().includes(q);
      const matchNotes = (act.detailedNotes || '').toLowerCase().includes(q);
      const matchTags = (act.tags || []).some((t) => t.toLowerCase().includes(q));
      if (!matchSummary && !matchLearned && !matchNotes && !matchTags) return false;
    }
    return true;
  });

  const totalMinutes = filteredActivities.reduce((s, a) => s + (a.durationMinutes || 0), 0);
  const totalHours = Number((totalMinutes / 60).toFixed(1));

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpenCheck className="w-5 h-5 text-indigo-600" />
              <span>سجل المذاكرة والأنشطة ({filteredActivities.length} نشاط مسجل)</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              إجمالي الساعات المسجلة بالنتائج المعروضة: {totalHours} ساعة ({totalMinutes} دقيقة)
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => exportActivitiesToCSV(state.activities, state.tasks)}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>تصدير CSV</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenLogModal()}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>تسجيل نشاط جديد</span>
            </button>
          </div>
        </div>

        {/* Filters & Search Row */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="ابحث في الملخص، المكتسبات، الملاحظات، أو الوسوم..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-9 pl-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
          >
            <option value="all">كل أنواع الأنشطة</option>
            <option value="coding">برمجة وتطبيق</option>
            <option value="lesson">درس وشرح نظري</option>
            <option value="debugging">تصحيح أخطاء</option>
            <option value="project">مشروع عملي</option>
            <option value="revision">مراجعة</option>
            <option value="assessment">تقييم</option>
            <option value="documentation">توثيق وقراءة</option>
            <option value="other">أخرى</option>
          </select>

          <select
            value={filterOutcome}
            onChange={(e) => setFilterOutcome(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
          >
            <option value="all">جميع النتائج</option>
            <option value="completed">مكتمل بالكامل</option>
            <option value="partially_completed">مكتمل جزئياً</option>
            <option value="needs_follow_up">يحتاج متابعة</option>
          </select>
        </div>
      </div>

      {/* Activity Logs Cards List */}
      {filteredActivities.length > 0 ? (
        <div className="space-y-4">
          {filteredActivities.map((activity) => {
            const linkedTask = state.tasks.find((t) => t.id === activity.taskId);

            return (
              <div
                key={activity.id}
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm space-y-3 transition-all hover:shadow-md"
              >
                {/* Header line */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-black text-xs text-indigo-600 dark:text-indigo-400">
                      {formatArabicDate(activity.date)}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="font-bold text-xs text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {activity.durationMinutes} دقيقة ({(activity.durationMinutes / 60).toFixed(1)} س)
                    </span>
                    <ActivityTypeBadge type={activity.activityType} />
                    <OutcomeBadge outcome={activity.outcome} />
                    <DifficultyBadge difficulty={activity.difficultyRating} />
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    {/* Confidence Stars */}
                    <div className="flex items-center gap-0.5" title={`مستوى الثقة: ${activity.confidenceRating}/5`}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3 h-3 ${
                            activity.confidenceRating >= s
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-300 dark:text-slate-700'
                          }`}
                        />
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => onOpenLogModal(undefined, undefined, activity)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      title="تعديل السجل"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setActivityToDelete(activity)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      title="حذف السجل"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Summary & Task Reference */}
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                    {activity.summary}
                  </h4>
                  {linkedTask && (
                    <span className="inline-block text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
                      مرتبط بمهمة: الأسبوع {linkedTask.week} — {linkedTask.titleAr}
                    </span>
                  )}
                </div>

                {/* What Learned */}
                <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl border border-indigo-100 dark:border-indigo-900/40 text-xs">
                  <span className="font-bold text-indigo-900 dark:text-indigo-300 block mb-0.5">
                    ما تم تعلمه:
                  </span>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {activity.whatLearned}
                  </p>
                </div>

                {/* Problems & Solutions (if logged) */}
                {(activity.problemEncountered || activity.solutionTroubleshooting) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {activity.problemEncountered && (
                      <div className="p-3 bg-rose-50/50 dark:bg-rose-950/20 rounded-xl border border-rose-100 dark:border-rose-900/40">
                        <span className="font-bold text-rose-700 dark:text-rose-300 block mb-0.5 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          التحدي / المشكلة:
                        </span>
                        <p className="text-slate-700 dark:text-slate-300">{activity.problemEncountered}</p>
                      </div>
                    )}

                    {activity.solutionTroubleshooting && (
                      <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border border-emerald-100 dark:border-emerald-900/40">
                        <span className="font-bold text-emerald-700 dark:text-emerald-300 block mb-0.5">
                          الحل المتبع:
                        </span>
                        <p className="text-slate-700 dark:text-slate-300">{activity.solutionTroubleshooting}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Code Snippet (if logged) */}
                {activity.codeSnippet && (
                  <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 text-slate-200 p-3 text-xs font-mono" dir="ltr">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1 border-b border-slate-800 pb-1">
                      <span>Code Snippet</span>
                      <Code2 className="w-3.5 h-3.5" />
                    </div>
                    <pre className="overflow-x-auto whitespace-pre-wrap">{activity.codeSnippet}</pre>
                  </div>
                )}

                {/* Footer with GitHub link & Tags */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {activity.tags && activity.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-semibold"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {activity.githubReference && (
                    <a
                      href={activity.githubReference}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-bold hover:underline text-[11px]"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>رابط GitHub المرفق</span>
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={BookOpenCheck}
          title="لم تسجل أي أنشطة بعد"
          description="سجل الأنشطة هو أرشيفك الحقيقي الذي يوثق كل جلسة عمل، الكود المكتوب، والأخطاء التي قمت بتجاوزها."
          actionButton={{
            label: 'تسجيل أول جلسة مذاكرة الآن',
            onClick: () => onOpenLogModal(),
            icon: PlusCircle
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(activityToDelete)}
        onClose={() => setActivityToDelete(null)}
        onConfirm={() => {
          if (activityToDelete) {
            deleteActivity(activityToDelete.id);
            setActivityToDelete(null);
          }
        }}
        title="تأكيد حذف سجل النشاط"
        message="هل أنت متأكد من رغبتك في حذف هذا السجل نهائياً؟ سيتم إنقاص عدد الساعات المسجلة تلقائياً."
      />
    </div>
  );
};
