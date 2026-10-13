import React, { useState } from 'react';
import {
  Search,
  Filter,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Play,
  Coffee,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RoadmapTask, TaskStatus } from '../../types';
import { calculateTaskPlannedDate, formatArabicDate, getWeekDateRange } from '../../services/dateUtils';
import { DifficultyBadge, StatusBadge } from '../common/Badge';

interface RoadmapViewProps {
  onOpenTaskModal: (taskId: string) => void;
  onOpenLogActivityModal: (initialMinutes?: number, initialTaskId?: string) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  onOpenTaskModal,
  onOpenLogActivityModal
}) => {
  const { state, updateTask } = useApp();

  const [selectedWeek, setSelectedWeek] = useState<number | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Weeks list 1-12 with metadata
  const weekTitles: Record<number, string> = {
    1: 'الأسبوع الأول: أساسيات لغة بايثون (Python Fundamentals)',
    2: 'الأسبوع الثاني: البرمجة الكائنية والبيانات المتقدمة (OOP & Collections)',
    3: 'الأسبوع الثالث: بيئة ويندوز وأدوات Git و PostgreSQL',
    4: 'الأسبوع الرابع: أول موديول مخصص في أودو 19 (training_asset)',
    5: 'الأسبوع الخامس: علاقات النماذج و Odoo ORM ومنطق الأعمال',
    6: 'الأسبوع السادس: واجهات العرض XML والقوائم والبحث المتقدم',
    7: 'الأسبوع السابع: الصلاحيات والأمان ووراثة النماذج والشاشات',
    8: 'الأسبوع الثامن: تقنيات الويب (HTML5, CSS3, Modern JavaScript)',
    9: 'الأسبوع التاسع: متحكمات أودو وواجهات HTTP و APIs',
    10: 'الأسبوع العاشر: تقارير QWeb PDF واختبارات الوحدة الآلية',
    11: 'الأسبوع الحادي عشر: إطار عمل OWL وتطوير واجهات أودو الحديثة',
    12: 'الأسبوع الثاني عشر: مشروع التخرج الشامل (asset_management_plus)'
  };

  // Filter tasks
  const filteredTasks = state.tasks.filter((t) => {
    if (selectedWeek !== 'all' && t.week !== selectedWeek) return false;
    if (selectedStatus !== 'all' && t.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.titleAr.toLowerCase().includes(q) || (t.titleEn?.toLowerCase().includes(q) ?? false);
      const matchObj = t.learningObjective.toLowerCase().includes(q);
      const matchSkills = t.technicalSkills.some((s) => s.toLowerCase().includes(q));
      if (!matchTitle && !matchObj && !matchSkills) return false;
    }
    return true;
  });

  // Group tasks by week
  const weeksToDisplay = selectedWeek === 'all'
    ? Array.from({ length: 12 }, (_, i) => i + 1)
    : [selectedWeek];

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="ابحث في عناوين المهام، الأهداف التعليمية، أو المهارات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Week Selector */}
          <div className="flex items-center gap-2">
            <select
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="px-3 py-2 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
            >
              <option value="all">كل الأسابيع (1 - 12)</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((w) => (
                <option key={w} value={w}>
                  الأسبوع {w}
                </option>
              ))}
            </select>

            {/* Status Selector */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
            >
              <option value="all">جميع الحالات</option>
              <option value="not_started">لم تبدأ</option>
              <option value="in_progress">قيد التنفيذ</option>
              <option value="completed">مكتملة</option>
              <option value="blocked">متوقفة / عائق</option>
            </select>
          </div>
        </div>
      </div>

      {/* Curriculum Weeks List */}
      <div className="space-y-8">
        {weeksToDisplay.map((weekNum) => {
          const weekTasks = filteredTasks.filter((t) => t.week === weekNum);
          const allTasksInWeek = state.tasks.filter((t) => t.week === weekNum);
          const coreTasks = allTasksInWeek.filter((t) => !t.isOptionalReview);
          const completedCore = coreTasks.filter((t) => t.status === 'completed').length;
          const weekRange = getWeekDateRange(state.settings.startDate, weekNum);

          // Week actual hours from activities
          const weekActivities = state.activities.filter(
            (a) => a.week === weekNum || (a.date >= weekRange.start && a.date <= weekRange.end)
          );
          const actualWeekHours = Number(
            (weekActivities.reduce((s, a) => s + (a.durationMinutes || 0), 0) / 60).toFixed(1)
          );

          if (weekTasks.length === 0 && selectedWeek !== 'all') {
            return null;
          }

          return (
            <div
              key={weekNum}
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-sm"
            >
              {/* Week Header */}
              <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-indigo-600 text-white">
                      الأسبوع {weekNum}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      من {formatArabicDate(weekRange.start)} إلى {formatArabicDate(weekRange.end)}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {weekTitles[weekNum]}
                  </h3>
                </div>

                <div className="flex items-center gap-3 text-xs font-bold">
                  <div className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-500 ml-1">إنجاز المهام الأساسية:</span>
                    <span className={completedCore === 5 ? 'text-emerald-600' : 'text-slate-800 dark:text-slate-200'}>
                      {completedCore} / 5
                    </span>
                  </div>

                  <div className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-500 ml-1">المذاكرة الفعلية:</span>
                    <span className="text-indigo-600 dark:text-indigo-400">{actualWeekHours} ساعة</span>
                  </div>
                </div>
              </div>

              {/* Tasks in Week */}
              <div className="p-4 sm:p-5 divide-y divide-slate-100 dark:divide-slate-800 space-y-3">
                {weekTasks.map((task) => {
                  const plannedDate = calculateTaskPlannedDate(state.settings.startDate, task.week, task.day);

                  return (
                    <div
                      key={task.id}
                      className="pt-3 first:pt-0 flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                    >
                      {/* Left: Day & Details */}
                      <div
                        className="flex-1 cursor-pointer"
                        onClick={() => onOpenTaskModal(task.id)}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-extrabold text-xs text-indigo-600 dark:text-indigo-400">
                            اليوم {task.day}:
                          </span>
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                            {task.titleAr}
                          </h4>
                          {task.isOptionalReview && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-500/10 text-cyan-600 border border-cyan-500/20">
                              مراجعة اختيارية
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                          {task.learningObjective}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-slate-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatArabicDate(plannedDate)}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            المخطط: {task.estimatedMinutes} دقيقة | المسجل: {task.actualDurationMinutes || 0} دقيقة
                          </span>
                          <span>•</span>
                          <DifficultyBadge difficulty={task.difficulty} />
                        </div>
                      </div>

                      {/* Right: Status Pill & Quick Action */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <StatusBadge status={task.status} />

                        <button
                          type="button"
                          onClick={() => onOpenTaskModal(task.id)}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
                        >
                          عرض التفاصيل
                        </button>
                      </div>
                    </div>
                  );
                })}

                {/* Day 7: Dedicated Rest Day Indicator */}
                <div className="pt-3 flex items-center justify-between text-xs text-slate-400 bg-slate-50/50 dark:bg-slate-800/20 p-3 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2 font-medium">
                    <Coffee className="w-4 h-4 text-amber-500" />
                    <span>اليوم 7: يوم راحة واستعادة نشاط مخصص (Rest Day)</span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {formatArabicDate(calculateTaskPlannedDate(state.settings.startDate, weekNum, 7))}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
