import React from 'react';
import {
  CheckCircle2,
  Clock,
  Play,
  Flame,
  Award,
  AlertTriangle,
  Calendar,
  ArrowLeft,
  BookOpen,
  ArrowUpRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  computeDashboardMetrics,
  computeWeeklySummary,
  findNextTask
} from '../../services/calculations';
import {
  calculateTaskPlannedDate,
  formatArabicDate,
  getCairoTodayString
} from '../../services/dateUtils';
import {
  MetricCard,
  WeeklyHoursBarChart,
  CoreTaskCompletionBarChart,
  SkillRadarChart
} from '../common/Charts';
import { StatusBadge } from '../common/Badge';

interface DashboardViewProps {
  onOpenTaskModal: (taskId: string) => void;
  onOpenLogActivityModal: (initialMinutes?: number, initialTaskId?: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenTaskModal,
  onOpenLogActivityModal
}) => {
  const { state, setActiveView, startTimer } = useApp();

  const metrics = computeDashboardMetrics(
    state.tasks,
    state.activities,
    state.reviews,
    state.settings.startDate,
    state.settings.targetCoreHours
  );

  const weeklyItems = computeWeeklySummary(
    state.tasks,
    state.activities,
    state.reviews,
    state.settings.startDate
  );

  const nextTask = findNextTask(state.tasks);
  const nextTaskPlannedDate = nextTask
    ? calculateTaskPlannedDate(state.settings.startDate, nextTask.week, nextTask.day)
    : '';

  const todayStr = getCairoTodayString();
  const todayTasks = state.tasks.filter((t) => {
    const pDate = calculateTaskPlannedDate(state.settings.startDate, t.week, t.day);
    return pDate === todayStr;
  });

  const blockedTasks = state.tasks.filter((t) => t.status === 'blocked');
  const recentActivities = state.activities.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Resume */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl relative overflow-hidden border border-indigo-900/40">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3 border border-indigo-500/30">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-current" />
              <span>
                {metrics.currentStreak > 0
                  ? `أنت في سلسلة مذاكرة نشطة: ${metrics.currentStreak} أيام متتالية!`
                  : 'ابدأ اليوم لتسجيل أول يوم في سلسلة إنجازاتك'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
              رحلة التحول إلى Odoo 19 Full-Stack Developer
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
              الخطة: 12 أسبوعاً • 60 جلسة أساسية • 120 ساعة مذاكرة مستهدفة • توقيت القاهرة
            </p>
          </div>

          {nextTask && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto">
              <button
                type="button"
                onClick={() => onOpenTaskModal(nextTask.id)}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>استئناف التعلم: {nextTask.titleAr.slice(0, 22)}...</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Core Roadmap Completion */}
        <MetricCard
          title="نسبة إنجاز الخطة الأساسية"
          value={`${metrics.coreCompletionPercentage}%`}
          subtitle={`${metrics.completedCoreTasksCount} من أصل ${metrics.totalCoreTasksCount} مهمة أساسية`}
          icon={CheckCircle2}
          badge={{
            text: metrics.completedCoreTasksCount === 60 ? 'مكتمل' : 'قيد التقدم',
            variant: metrics.completedCoreTasksCount > 0 ? 'success' : 'neutral'
          }}
          progress={{
            current: metrics.completedCoreTasksCount,
            total: metrics.totalCoreTasksCount,
            color: 'bg-emerald-500'
          }}
        />

        {/* Card 2: Actual Study Hours */}
        <MetricCard
          title="ساعات المذاكرة الفعلية"
          value={`${metrics.actualStudyHours} س`}
          subtitle={`المستهدف: ${metrics.targetStudyHours} س (متبقي ${metrics.remainingStudyHours} س)`}
          icon={Clock}
          badge={{
            text: `${metrics.actualStudyHours} ساعة مسجلة`,
            variant: metrics.actualStudyHours > 0 ? 'info' : 'neutral'
          }}
          progress={{
            current: metrics.actualStudyHours,
            total: metrics.targetStudyHours,
            color: 'bg-indigo-600'
          }}
        />

        {/* Card 3: Days with Activities & Streak */}
        <MetricCard
          title="أيام المذاكرة المسجلة"
          value={`${metrics.daysWithActivitiesCount} يوم`}
          subtitle={`سلسلة الالتزام الحالية: ${metrics.currentStreak} يوم (الأطول: ${metrics.longestStreak})`}
          icon={Flame}
          badge={{
            text: metrics.currentStreak > 0 ? 'سلسلة نشطة' : 'جاهز للبدء',
            variant: metrics.currentStreak > 0 ? 'warning' : 'neutral'
          }}
        />

        {/* Card 4: Assessment Score (strictly real) */}
        <MetricCard
          title="متوسط التقييم الأسبوعي"
          value={metrics.averageAssessmentScore !== null ? `${metrics.averageAssessmentScore}%` : '—'}
          subtitle={
            metrics.averageAssessmentScore !== null
              ? 'مبني على التقييمات الذاتية المسجلة'
              : 'لم يتم تسجيل تقييم أسبوعي بعد'
          }
          icon={Award}
          badge={{
            text: metrics.averageAssessmentScore !== null ? 'تقييم حقيقي' : 'في انتظار التقييم',
            variant: metrics.averageAssessmentScore !== null ? 'success' : 'neutral'
          }}
        />
      </div>

      {/* Blocked Tasks Alert (if any) */}
      {blockedTasks.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300">
          <div className="flex items-center gap-2 mb-2 font-bold text-sm">
            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
            <span>تنبيه: لديك {blockedTasks.length} مهام متوقفة أو تحتوي عائقاً يتطلب المتابعة</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {blockedTasks.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => onOpenTaskModal(t.id)}
                className="px-3 py-1 bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700 rounded-xl text-xs font-semibold hover:border-amber-500 text-slate-800 dark:text-slate-200"
              >
                أ{t.week} ي{t.day}: {t.titleAr}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeeklyHoursBarChart items={weeklyItems} />
        <CoreTaskCompletionBarChart items={weeklyItems} />
      </div>

      {/* Skills Radar & Next Tasks Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Skill Radar Chart (7 cols) */}
        <div className="lg:col-span-7">
          <SkillRadarChart skills={state.skills} />
        </div>

        {/* Right: Today's Tasks & Next Task (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Today's Tasks Box */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-indigo-500" />
                <span>مهام الموعد اليوم ({formatArabicDate(todayStr)})</span>
              </h3>
              <button
                type="button"
                onClick={() => setActiveView('today')}
                className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
              >
                عرض اليوم
              </button>
            </div>

            {todayTasks.length > 0 ? (
              <div className="space-y-2">
                {todayTasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => onOpenTaskModal(task.id)}
                    className="p-3 rounded-xl border border-slate-200/60 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-800/20"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-slate-900 dark:text-white">
                        {task.titleAr}
                      </span>
                      <StatusBadge status={task.status} />
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{task.learningObjective}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-slate-400 text-xs">
                لا توجد مهام مجدولة بدقة لتاريخ اليوم في الخطة، يمكنك استعراض مهام الأسبوع من صفحة الخطة.
              </div>
            )}
          </div>

          {/* Next Task Detail Box */}
          {nextTask && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm">
              <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block mb-1">
                المهمة القادمة في الخطة
              </span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                الأسبوع {nextTask.week} — اليوم {nextTask.day}: {nextTask.titleAr}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
                {nextTask.learningObjective}
              </p>
              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span>الموعد المخطط: {formatArabicDate(nextTaskPlannedDate)}</span>
                <button
                  type="button"
                  onClick={() => onOpenTaskModal(nextTask.id)}
                  className="font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                >
                  <span>عرض التفاصيل</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Recent Activity Log Snippet */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-emerald-500" />
                <span>آخر الأنشطة المسجلة</span>
              </h3>
              <button
                type="button"
                onClick={() => setActiveView('activities')}
                className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
              >
                سجل الأنشطة كامل
              </button>
            </div>

            {recentActivities.length > 0 ? (
              <div className="space-y-2">
                {recentActivities.map((act) => (
                  <div
                    key={act.id}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 text-xs"
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                      <span>{formatArabicDate(act.date)}</span>
                      <span className="font-bold text-indigo-600">{act.durationMinutes} دقيقة</span>
                    </div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {act.summary}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-slate-400 text-xs">
                لم تسجل أي جلسات مذاكرة بعد. استخدم زر "تسجيل نشاط" أو شغّل المؤقت لبدء تدوين إنجازاتك!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
