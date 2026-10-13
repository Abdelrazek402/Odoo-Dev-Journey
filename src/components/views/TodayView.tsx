import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Play,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  PlusCircle,
  FileText,
  Code2,
  Coffee
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  calculateTaskPlannedDate,
  formatArabicDate,
  getCairoTodayString,
  getRoadmapPositionForDate,
  toISODateString
} from '../../services/dateUtils';
import { DifficultyBadge, StatusBadge } from '../common/Badge';
import { EmptyState } from '../common/EmptyState';
import { TaskStatus } from '../../types';

interface TodayViewProps {
  onOpenTaskModal: (taskId: string) => void;
  onOpenLogActivityModal: (initialMinutes?: number, initialTaskId?: string) => void;
}

export const TodayView: React.FC<TodayViewProps> = ({
  onOpenTaskModal,
  onOpenLogActivityModal
}) => {
  const { state, updateTask, startTimer } = useApp();
  const [selectedDate, setSelectedDate] = useState<string>(getCairoTodayString());

  // Date navigation helpers
  const handleShiftDay = (delta: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + delta);
    setSelectedDate(toISODateString(d));
  };

  const handleSetToday = () => {
    setSelectedDate(getCairoTodayString());
  };

  // Find roadmap position for selected date
  const pos = getRoadmapPositionForDate(state.settings.startDate, selectedDate);

  // Find tasks scheduled for selected date
  const tasksForDate = state.tasks.filter((t) => {
    const planned = calculateTaskPlannedDate(state.settings.startDate, t.week, t.day);
    return planned === selectedDate;
  });

  // Find activities logged on this date
  const activitiesOnDate = state.activities.filter((a) => a.date === selectedDate);
  const totalActualMinutesOnDate = activitiesOnDate.reduce((s, a) => s + (a.durationMinutes || 0), 0);

  const handleStatusChange = (taskId: string, currentStatus: TaskStatus, newStatus: TaskStatus) => {
    if (newStatus === 'completed' && currentStatus !== 'completed') {
      const confirmDone = window.confirm(
        'هل تود تأكيد إكمال هذه المهمة؟ تأكد من أنك قمت بالتطبيق العملي واختبار الكود.'
      );
      if (!confirmDone) return;
    }
    updateTask(taskId, { status: newStatus });
  };

  return (
    <div className="space-y-6">
      {/* Date Navigation Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Date Selector with Next / Prev */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => handleShiftDay(-1)}
            className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            title="اليوم السابق"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs outline-none"
          />

          <button
            type="button"
            onClick={() => handleShiftDay(1)}
            className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            title="اليوم التالي"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {selectedDate !== getCairoTodayString() && (
            <button
              type="button"
              onClick={handleSetToday}
              className="px-3 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl hover:bg-indigo-100"
            >
              العودة لليوم
            </button>
          )}
        </div>

        {/* Roadmap position tag */}
        <div className="flex items-center gap-3 text-xs font-semibold">
          <div className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/50">
            {pos.isBeforeStart ? (
              <span>قبل تاريخ بداية الخطة</span>
            ) : pos.isAfterEnd ? (
              <span>بعد نهاية الخطة (12 أسبوعاً)</span>
            ) : pos.isRestDay ? (
              <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                <Coffee className="w-3.5 h-3.5" />
                الأسبوع {pos.week} — يوم الراحة الأسبوعي (اليوم 7)
              </span>
            ) : (
              <span>
                الخطة: الأسبوع {pos.week} — اليوم {pos.day}
              </span>
            )}
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            المذاكرة الفعلية اليوم: {(totalActualMinutesOnDate / 60).toFixed(1)} ساعة ({totalActualMinutesOnDate} دقيقة)
          </div>
        </div>
      </div>

      {/* Scheduled Tasks for Selected Day */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-600" />
            <span>المهام المقررة ليوم {formatArabicDate(selectedDate, { withWeekday: true })}</span>
          </h3>

          <button
            type="button"
            onClick={() => onOpenLogActivityModal(undefined, tasksForDate[0]?.id)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-indigo-600/20"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>تسجيل نشاط لهذا اليوم</span>
          </button>
        </div>

        {tasksForDate.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {tasksForDate.map((task) => (
              <div
                key={task.id}
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm space-y-4"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400">
                        الأسبوع {task.week} — اليوم {task.day}
                      </span>
                      <StatusBadge status={task.status} />
                      <DifficultyBadge difficulty={task.difficulty} />
                    </div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      {task.titleAr}
                    </h4>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => startTimer(task.id, task.titleAr)}
                      className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900 rounded-xl text-xs font-bold flex items-center gap-1"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>بدء المؤقت</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onOpenLogActivityModal(undefined, task.id)}
                      className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold"
                    >
                      تسجيل إنجاز
                    </button>

                    <button
                      type="button"
                      onClick={() => onOpenTaskModal(task.id)}
                      className="px-3 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-bold"
                    >
                      تفاصيل المهمة
                    </button>
                  </div>
                </div>

                {/* Objective & Practical Exercise */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-800">
                    <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                      الهدف التعليمي:
                    </span>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      {task.learningObjective}
                    </p>
                  </div>

                  <div className="p-3.5 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border border-emerald-100 dark:border-emerald-900/40">
                    <span className="font-bold text-emerald-800 dark:text-emerald-300 block mb-1">
                      التمرين والمخرج المتوقع:
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {task.practicalExercise}
                    </p>
                  </div>
                </div>

                {/* Status Quick Bar */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-500">تحديث الحالة:</span>
                    {(['not_started', 'in_progress', 'completed', 'blocked'] as TaskStatus[]).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => handleStatusChange(task.id, task.status, st)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                          task.status === st
                            ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                        }`}
                      >
                        {st === 'not_started' && 'لم تبدأ'}
                        {st === 'in_progress' && 'قيد التنفيذ'}
                        {st === 'completed' && 'مكتملة'}
                        {st === 'blocked' && 'متوقفة'}
                      </button>
                    ))}
                  </div>

                  <span className="text-slate-400 text-[11px]">
                    المخطط: {task.estimatedMinutes} دقيقة | الفعلي: {task.actualDurationMinutes || 0} دقيقة
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Coffee}
            title={pos.isRestDay ? 'يوم راحة أسبوعي مخصص' : 'لا توجد مهام مجدولة لهذا التاريخ'}
            description={
              pos.isRestDay
                ? 'وفق جدولك المدروس، اليوم السابع مخصص للراحة واستعادة الحيوية بعد إنجاز 5 أيام دراسة ويوم مراجعة.'
                : 'يمكنك اختيار تاريخ آخر باستخدام التقويم بالأعلى، أو تسجيل جلسة مذاكرة حرة إضافية لهذا اليوم.'
            }
            actionButton={{
              label: 'تسجيل نشاط حر لهذا اليوم',
              onClick: () => onOpenLogActivityModal(),
              icon: PlusCircle
            }}
          />
        )}
      </div>

      {/* Activities already logged on this day */}
      {activitiesOnDate.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm space-y-3">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>الأنشطة المسجلة في هذا التاريخ ({activitiesOnDate.length} أنشطة)</span>
          </h4>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {activitiesOnDate.map((act) => (
              <div key={act.id} className="py-2.5 first:pt-0 last:pb-0 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-800 dark:text-slate-200">{act.summary}</span>
                  <span className="font-bold text-indigo-600">{act.durationMinutes} دقيقة</span>
                </div>
                <p className="text-slate-500 text-[11px] line-clamp-1">{act.whatLearned}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
