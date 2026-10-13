import React, { useState } from 'react';
import {
  BarChart3,
  Printer,
  Download,
  Calendar,
  Clock,
  CheckCircle2,
  Award,
  AlertTriangle,
  FolderKanban,
  FileSpreadsheet
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  computeDashboardMetrics,
  computeWeeklySummary,
  computeProjectProgress
} from '../../services/calculations';
import { exportActivitiesToCSV, exportDatabaseToJSON } from '../../services/storage';
import { formatArabicDate, getCairoTodayString } from '../../services/dateUtils';
import { WeeklyHoursBarChart, CoreTaskCompletionBarChart } from '../common/Charts';

export const ReportsView: React.FC = () => {
  const { state } = useApp();
  const [selectedReportType, setSelectedReportType] = useState<
    'comprehensive' | 'weekly' | 'tasks' | 'skills' | 'projects' | 'blockers'
  >('comprehensive');

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

  const blockedTasks = state.tasks.filter((t) => t.status === 'blocked' || Boolean(t.blockerReason));

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Control Bar (hidden during print) */}
      <div className="no-print bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              <span>مركز التقارير والتحليلات الشاملة (Analytics & Reports)</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              توليد وطباعة تقارير الإنجاز الدورية وتصدير ملفات البيانات بصيغتي CSV و JSON.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة كـ PDF (Browser Print)</span>
            </button>

            <button
              type="button"
              onClick={() => exportActivitiesToCSV(state.activities, state.tasks)}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>تصدير الأنشطة CSV</span>
            </button>

            <button
              type="button"
              onClick={() => exportDatabaseToJSON(state)}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-colors"
            >
              <Download className="w-4 h-4 text-indigo-600" />
              <span>نسخة JSON كاملة</span>
            </button>
          </div>
        </div>

        {/* Tab select */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 overflow-x-auto text-xs">
          {[
            { id: 'comprehensive', label: 'التقرير الشامل التراكمي' },
            { id: 'weekly', label: 'تقرير تفصيل الأسابيع' },
            { id: 'tasks', label: 'تقرير حالة المهام' },
            { id: 'skills', label: 'سجل تقييم المهارات' },
            { id: 'projects', label: 'تقرير المشروعات العملية' },
            { id: 'blockers', label: 'تقرير العوائق والمشكلات' }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedReportType(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
                selectedReportType === tab.id
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Printable Report Canvas */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 print:border-none print:shadow-none print:p-0">
        {/* Printable Official Header */}
        <div className="border-b-2 border-slate-900 dark:border-slate-100 pb-4 flex items-start justify-between">
          <div>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 block mb-1">
              تقرير الإنجاز الرسمي • Odoo Dev Journey
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              رحلة الانتقال إلى Odoo 19 Full-Stack Developer
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              تاريخ إصدار التقرير: {formatArabicDate(getCairoTodayString(), { withWeekday: true })} بتوقيت القاهرة
            </p>
          </div>

          <div className="text-left text-xs text-slate-500 font-mono" dir="ltr">
            <div>Mode: Local (IndexedDB)</div>
            <div>Timezone: Africa/Cairo</div>
            <div>Target: 120 Core Hours</div>
          </div>
        </div>

        {/* 1. Summary Metrics Overview */}
        {(selectedReportType === 'comprehensive' || selectedReportType === 'weekly') && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              1. المؤشرات التراكمية العامة (Executive Metrics)
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 block mb-1">إنجاز المهام الأساسية</span>
                <span className="text-lg font-black text-slate-900 dark:text-white">
                  {metrics.completedCoreTasksCount} من 60 ({metrics.coreCompletionPercentage}%)
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 block mb-1">الساعات الفعلية المقضية</span>
                <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">
                  {metrics.actualStudyHours} ساعة
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  من أصل {metrics.targetStudyHours} ساعة مستهدفة
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 block mb-1">أيام المذاكرة المسجلة</span>
                <span className="text-lg font-black text-slate-900 dark:text-white">
                  {metrics.daysWithActivitiesCount} يوم
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  سلسلة الالتزام: {metrics.currentStreak} يوم
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 block mb-1">المهام قيد التنفيذ أو المتوقفة</span>
                <span className="text-lg font-black text-slate-900 dark:text-white">
                  {metrics.tasksInProgressCount} جارية • {metrics.blockedTasksCount} متوقفة
                </span>
              </div>
            </div>

            {/* Charts section (rendered into print too!) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2">
              <WeeklyHoursBarChart items={weeklyItems} />
              <CoreTaskCompletionBarChart items={weeklyItems} />
            </div>
          </div>
        )}

        {/* 2. Detailed Weekly Table */}
        {(selectedReportType === 'comprehensive' || selectedReportType === 'weekly') && (
          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              2. جدول تفصيل الأسابيع الـ 12 (Weekly Breakdown Table)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300">
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <th className="py-2.5 px-3 font-bold">الأسبوع</th>
                    <th className="py-2.5 px-3 font-bold">الموضوع الرئيسي</th>
                    <th className="py-2.5 px-3 font-bold">المهام الأساسية (من 5)</th>
                    <th className="py-2.5 px-3 font-bold">الساعات المخططة</th>
                    <th className="py-2.5 px-3 font-bold">الساعات الفعلية</th>
                    <th className="py-2.5 px-3 font-bold">مراجعة يوم 6</th>
                    <th className="py-2.5 px-3 font-bold">درجة الاختبار</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {weeklyItems.map((w) => (
                    <tr key={w.week} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-2 px-3 font-bold text-indigo-600">الأسبوع {w.week}</td>
                      <td className="py-2 px-3 text-slate-700 dark:text-slate-300 font-medium">
                        {w.week === 1 && 'أساسيات بايثون'}
                        {w.week === 2 && 'OOP والكائنات'}
                        {w.week === 3 && 'Git و SQL وويندوز'}
                        {w.week === 4 && 'موديول الأصول الأول'}
                        {w.week === 5 && 'ORM وعلاقات النماذج'}
                        {w.week === 6 && 'عروض XML والقوائم'}
                        {w.week === 7 && 'الأمان ووراثة النماذج'}
                        {w.week === 8 && 'HTML, CSS, JS'}
                        {w.week === 9 && 'متحكمات أودو و APIs'}
                        {w.week === 10 && 'تقارير QWeb واختبارات'}
                        {w.week === 11 && 'مكونات OWL والواجهة'}
                        {w.week === 12 && 'مشروع التخرج الشامل'}
                      </td>
                      <td className="py-2 px-3 font-bold">
                        <span className={w.coreTasksCompleted === 5 ? 'text-emerald-600' : 'text-slate-600'}>
                          {w.coreTasksCompleted} / 5
                        </span>
                      </td>
                      <td className="py-2 px-3 text-slate-500">10 س</td>
                      <td className="py-2 px-3 font-bold text-slate-800 dark:text-slate-200">
                        {w.actualHours} س
                      </td>
                      <td className="py-2 px-3">
                        {w.reviewCompleted ? (
                          <span className="text-emerald-600 font-semibold">مكتملة</span>
                        ) : (
                          <span className="text-slate-400">غير مكتملة</span>
                        )}
                      </td>
                      <td className="py-2 px-3 font-bold">
                        {w.assessmentScore !== null ? `${w.assessmentScore}%` : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. Projects Portfolio Report */}
        {(selectedReportType === 'comprehensive' || selectedReportType === 'projects') && (
          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              3. تقرير المشروعات العملية الأربعة (Projects Progress)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {state.projects.map((proj) => {
                const prog = computeProjectProgress(proj);
                return (
                  <div
                    key={proj.id}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">{proj.titleAr}</span>
                      <span className="font-black text-indigo-600">{prog.percentage}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full"
                        style={{ width: `${prog.percentage}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>المعالم: {prog.completedMilestones}/{prog.totalMilestones}</span>
                      <span>المخرجات: {prog.completedDeliverables}/{prog.totalDeliverables}</span>
                      <span>الساعات: {proj.actualHours}/{proj.estimatedHours} س</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. Skills Matrix Breakdown */}
        {(selectedReportType === 'comprehensive' || selectedReportType === 'skills') && (
          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              4. تقرير الكفاءات التقنية الـ 15 والتقييم الذاتي (Skills Status)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs border border-slate-200 dark:border-slate-800 rounded-xl">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <th className="py-2 px-3 font-bold">المهارة التقنية</th>
                    <th className="py-2 px-3 font-bold">المستوى الذاتي (1 - 5)</th>
                    <th className="py-2 px-3 font-bold">تاريخ التقييم</th>
                    <th className="py-2 px-3 font-bold">الدليل المسجل</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {state.skills.map((s) => (
                    <tr key={s.id}>
                      <td className="py-2 px-3 font-bold text-slate-900 dark:text-white">{s.nameAr}</td>
                      <td className="py-2 px-3 font-bold text-indigo-600">
                        {s.currentRating > 0 ? `${s.currentRating} / 5` : 'لم يتم التقييم بعد'}
                      </td>
                      <td className="py-2 px-3 text-slate-500">{s.history[0]?.date || '—'}</td>
                      <td className="py-2 px-3 text-slate-600 dark:text-slate-400 line-clamp-1">
                        {s.history[0]?.supportingEvidence || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 5. Blockers & Problems Report */}
        {(selectedReportType === 'comprehensive' || selectedReportType === 'blockers') && (
          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>5. سجل العوائق والتحديات البرمجية (Blockers Log)</span>
            </h3>

            {blockedTasks.length > 0 ? (
              <div className="space-y-2 text-xs">
                {blockedTasks.map((t) => (
                  <div
                    key={t.id}
                    className="p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40"
                  >
                    <div className="flex items-center justify-between mb-1 font-bold">
                      <span className="text-amber-900 dark:text-amber-200">
                        الأسبوع {t.week} — اليوم {t.day}: {t.titleAr}
                      </span>
                      <span className="text-amber-600">{t.status}</span>
                    </div>
                    {t.blockerReason && (
                      <p className="text-slate-700 dark:text-slate-300 mb-1">
                        <span className="font-semibold text-amber-800">سبب العائق: </span>
                        {t.blockerReason}
                      </p>
                    )}
                    {t.blockerResolution && (
                      <p className="text-slate-700 dark:text-slate-300">
                        <span className="font-semibold text-emerald-800">الحل أو التجاوز: </span>
                        {t.blockerResolution}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center rounded-xl bg-slate-50 dark:bg-slate-800/40 text-slate-500 text-xs">
                لا توجد عوائق مسجلة حالياً. جميع المهام تسير بشكل طبيعي!
              </div>
            )}
          </div>
        )}

        {/* Calculation Logic Explanation Box */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-500 space-y-1">
          <span className="font-bold text-slate-700 dark:text-slate-300 block">
            كيفية احتساب المعايير الرياضية بالتقرير:
          </span>
          <p>
            • نسبة إنجاز الخطة = (عدد المهام الأساسية المكتملة ÷ 60 مهمة أساسية) × 100، وتستثنى مهام المراجعة الاختيارية من المقام.
          </p>
          <p>
            • الساعات الفعلية = مجموع دقائق أنشطة المذاكرة المسجلة فعلياً مقسوماً على 60، ولا يُحتسب أي وقت افتراضي.
          </p>
          <p>
            • نسبة إنجاز المشروعات = (المعالم المكتملة + المخرجات المسلمة) ÷ إجمالي المعالم والمخرجات.
          </p>
        </div>
      </div>
    </div>
  );
};
