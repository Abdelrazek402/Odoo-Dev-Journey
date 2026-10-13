import React, { useState } from 'react';
import {
  ListChecks,
  CheckCircle2,
  Clock,
  Award,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Edit2,
  Save,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { WeeklyReview } from '../../types';
import { getWeekDateRange, formatArabicDate } from '../../services/dateUtils';
import { computeWeeklySummary } from '../../services/calculations';

export const WeeklyReviewsView: React.FC = () => {
  const { state, updateWeeklyReview } = useApp();
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const weeklySummaries = computeWeeklySummary(
    state.tasks,
    state.activities,
    state.reviews,
    state.settings.startDate
  );

  const currentSummary = weeklySummaries.find((s) => s.week === selectedWeek) || weeklySummaries[0];
  const previousSummary = weeklySummaries.find((s) => s.week === selectedWeek - 1);
  const currentReview = state.reviews.find((r) => r.week === selectedWeek) || {
    id: `review-w${selectedWeek}`,
    week: selectedWeek,
    title: `مراجعة الأسبوع ${selectedWeek}`,
    whatLearned: '',
    whatBuilt: '',
    completedTaskIds: [],
    hardestProblem: '',
    solution: '',
    stillNotUnderstood: '',
    needsRevisionTopic: '',
    actualHours: currentSummary.actualHours,
    confidenceRating: 0,
    evidenceLinks: [],
    prioritiesNextWeek: '',
    completed: false
  };

  // Local form state
  const [whatLearned, setWhatLearned] = useState(currentReview.whatLearned);
  const [whatBuilt, setWhatBuilt] = useState(currentReview.whatBuilt);
  const [hardestProblem, setHardestProblem] = useState(currentReview.hardestProblem);
  const [solution, setSolution] = useState(currentReview.solution);
  const [stillNotUnderstood, setStillNotUnderstood] = useState(currentReview.stillNotUnderstood);
  const [needsRevisionTopic, setNeedsRevisionTopic] = useState(currentReview.needsRevisionTopic);
  const [confidenceRating, setConfidenceRating] = useState(currentReview.confidenceRating || 3);
  const [quizScore, setQuizScore] = useState<string>(
    currentReview.selfAssessedQuizScore !== undefined ? String(currentReview.selfAssessedQuizScore) : ''
  );
  const [prioritiesNextWeek, setPrioritiesNextWeek] = useState(currentReview.prioritiesNextWeek);

  // Sync state when week changes
  const handleSelectWeek = (w: number) => {
    setSelectedWeek(w);
    setIsEditing(false);
    const r = state.reviews.find((item) => item.week === w);
    if (r) {
      setWhatLearned(r.whatLearned || '');
      setWhatBuilt(r.whatBuilt || '');
      setHardestProblem(r.hardestProblem || '');
      setSolution(r.solution || '');
      setStillNotUnderstood(r.stillNotUnderstood || '');
      setNeedsRevisionTopic(r.needsRevisionTopic || '');
      setConfidenceRating(r.confidenceRating || 3);
      setQuizScore(r.selfAssessedQuizScore !== undefined ? String(r.selfAssessedQuizScore) : '');
      setPrioritiesNextWeek(r.prioritiesNextWeek || '');
    } else {
      setWhatLearned('');
      setWhatBuilt('');
      setHardestProblem('');
      setSolution('');
      setStillNotUnderstood('');
      setNeedsRevisionTopic('');
      setConfidenceRating(3);
      setQuizScore('');
      setPrioritiesNextWeek('');
    }
  };

  const handleSaveReview = () => {
    updateWeeklyReview(currentReview.id, {
      whatLearned,
      whatBuilt,
      hardestProblem,
      solution,
      stillNotUnderstood,
      needsRevisionTopic,
      actualHours: currentSummary.actualHours,
      confidenceRating: Number(confidenceRating),
      selfAssessedQuizScore: quizScore !== '' ? Number(quizScore) : undefined,
      prioritiesNextWeek,
      completed: true
    });
    setIsEditing(false);
  };

  const weekRange = getWeekDateRange(state.settings.startDate, selectedWeek);
  const weekCoreTasks = state.tasks.filter((t) => t.week === selectedWeek && !t.isOptionalReview);
  const weekReviewTask = state.tasks.find((t) => t.week === selectedWeek && t.isOptionalReview);

  return (
    <div className="space-y-6">
      {/* Week Selector Ribbon */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 shadow-sm flex items-center gap-2 overflow-x-auto">
        {Array.from({ length: 12 }, (_, i) => i + 1).map((w) => {
          const isSelected = selectedWeek === w;
          const rObj = state.reviews.find((r) => r.week === w);
          const isDone = rObj?.completed;

          return (
            <button
              key={w}
              type="button"
              onClick={() => handleSelectWeek(w)}
              className={`flex-shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <span>أسبوع {w}</span>
              {isDone && <Check className="w-3.5 h-3.5 text-emerald-400" />}
            </button>
          );
        })}
      </div>

      {/* Week Real Metrics Dashboard Report */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900">
                تقرير المراجعة الأسبوعية
              </span>
              <span className="text-xs text-slate-500">
                من {formatArabicDate(weekRange.start)} إلى {formatArabicDate(weekRange.end)}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              تقييم الأسبوع {selectedWeek}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>{currentReview.completed ? 'تعديل التقييم' : 'ملء استمارة المراجعة'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSaveReview}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
              >
                <Save className="w-3.5 h-3.5" />
                <span>حفظ التقييم الأسبوعي</span>
              </button>
            )}
          </div>
        </div>

        {/* Real Metrics Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
            <span className="text-slate-500 block mb-1">المهام الأساسية المكتملة</span>
            <div className="text-lg font-black text-slate-900 dark:text-white">
              {currentSummary.coreTasksCompleted} / 5
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">
              {Math.round((currentSummary.coreTasksCompleted / 5) * 100)}% من المستهدف
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
            <span className="text-slate-500 block mb-1">ساعات المذاكرة الفعلية</span>
            <div className="text-lg font-black text-indigo-600 dark:text-indigo-400">
              {currentSummary.actualHours} ساعة
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">
              مقارنة بـ 10 ساعات مخططة
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
            <span className="text-slate-500 block mb-1">جلسة المراجعة الاختيارية (يوم 6)</span>
            <div className="text-sm font-bold text-slate-900 dark:text-white mt-1">
              {weekReviewTask?.status === 'completed' ? (
                <span className="text-emerald-600">تم إنجازها بنجاح</span>
              ) : (
                <span className="text-slate-400">لم تكتمل بعد</span>
              )}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
            <span className="text-slate-500 block mb-1">درجة الاختبار الذاتي (Quiz)</span>
            <div className="text-lg font-black text-slate-900 dark:text-white">
              {currentReview.selfAssessedQuizScore !== undefined
                ? `${currentReview.selfAssessedQuizScore}%`
                : '—'}
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">
              {currentReview.selfAssessedQuizScore !== undefined ? 'مُدخلة يدوياً' : 'غير مسجلة'}
            </span>
          </div>
        </div>

        {/* Previous Week Mathematical Comparison */}
        {previousSummary && (
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-200/60 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <span className="font-bold text-slate-800 dark:text-slate-200 block">
              المقارنة الإحصائية مع الأسبوع السابق (الأسبوع {selectedWeek - 1}):
            </span>
            <div className="flex flex-wrap items-center gap-4 text-[11px]">
              <span>
                الساعات الفعلية: {currentSummary.actualHours} س (السابق: {previousSummary.actualHours} س • الفرق: {Number((currentSummary.actualHours - previousSummary.actualHours).toFixed(1))} س)
              </span>
              <span>•</span>
              <span>
                إنجاز المهام: {currentSummary.coreTasksCompleted} (السابق: {previousSummary.coreTasksCompleted})
              </span>
            </div>
          </div>
        )}

        {/* Mathematical Observation & Constructive Recommendation */}
        {currentSummary.coreTasksCompleted < 5 && (
          <div className="p-3.5 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-xl text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-bold">ملاحظة الخطة: </span>
              لديك {5 - currentSummary.coreTasksCompleted} مهام أساسية لم تكتمل في هذا الأسبوع. ننصح بجدولة جلسة استدراك في يوم المراجعة أو ترحيل المتبقي دون حذف السجلات السابقة للحفاظ على سلامة التسلسل التعليمي.
            </div>
          </div>
        )}

        {/* Review Form / Display */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-4">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            ملاحظات واستخلاص المراجعة الأسبوعية
          </h4>

          {isEditing ? (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ماذا تعلمت هذا الأسبوع بالتفصيل؟
                </label>
                <textarea
                  rows={3}
                  value={whatLearned}
                  onChange={(e) => setWhatLearned(e.target.value)}
                  placeholder="لخص المفاهيم الفنية البرمجية الأساسية..."
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ماذا بنيت أو قمت بتطبيقه عملياً؟
                </label>
                <textarea
                  rows={2}
                  value={whatBuilt}
                  onChange={(e) => setWhatBuilt(e.target.value)}
                  placeholder="البرامج، النماذج، الشاشات أو السكريبتات التي قمت بإنشائها..."
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    أصعب مشكلة أو خطأ واجهك؟
                  </label>
                  <textarea
                    rows={2}
                    value={hardestProblem}
                    onChange={(e) => setHardestProblem(e.target.value)}
                    placeholder="وصف المشكلة الفنية..."
                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    كيف قمت بحلها؟
                  </label>
                  <textarea
                    rows={2}
                    value={solution}
                    onChange={(e) => setSolution(e.target.value)}
                    placeholder="خطوات الحل..."
                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ما الذي ما زلت لا تفهمه تماماً ويحتاج تركيز؟
                  </label>
                  <textarea
                    rows={2}
                    value={stillNotUnderstood}
                    onChange={(e) => setStillNotUnderstood(e.target.value)}
                    placeholder="مفاهيم لا تزال غامضة..."
                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    الموضوع الذي يحتاج لمراجعة إضافية
                  </label>
                  <textarea
                    rows={2}
                    value={needsRevisionTopic}
                    onChange={(e) => setNeedsRevisionTopic(e.target.value)}
                    placeholder="الموضوع المستهدف للمراجعة..."
                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    مستوى ثقتك في مادة هذا الأسبوع (1 إلى 5)
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setConfidenceRating(star)}
                        className={`w-9 h-9 rounded-xl font-bold ${
                          confidenceRating >= star
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                        }`}
                      >
                        {star}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    درجة الاختبار الذاتي (إن وجد) %
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="0 - 100"
                    value={quizScore}
                    onChange={(e) => setQuizScore(e.target.value)}
                    className="w-32 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  أولويات الأسبوع القادم
                </label>
                <textarea
                  rows={2}
                  value={prioritiesNextWeek}
                  onChange={(e) => setPrioritiesNextWeek(e.target.value)}
                  placeholder="أهم الأهداف التي ستركز عليها في الأسبوع التالي..."
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={handleSaveReview}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold"
                >
                  حفظ المراجعة
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3 text-xs">
              {currentReview.whatLearned ? (
                <>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-800">
                    <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                      ما تم تعلمه هذا الأسبوع:
                    </span>
                    <p className="text-slate-600 dark:text-slate-400 whitespace-pre-line leading-relaxed">
                      {currentReview.whatLearned}
                    </p>
                  </div>

                  {currentReview.whatBuilt && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-800">
                      <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                        ما تم تطبيقه وبناؤه:
                      </span>
                      <p className="text-slate-600 dark:text-slate-400 whitespace-pre-line leading-relaxed">
                        {currentReview.whatBuilt}
                      </p>
                    </div>
                  )}

                  {(currentReview.hardestProblem || currentReview.solution) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {currentReview.hardestProblem && (
                        <div className="p-3 bg-rose-50/50 dark:bg-rose-950/20 rounded-xl border border-rose-100 dark:border-rose-900/40">
                          <span className="font-bold text-rose-700 dark:text-rose-300 block mb-1">
                            أصعب مشكلة:
                          </span>
                          <p className="text-slate-700 dark:text-slate-300">{currentReview.hardestProblem}</p>
                        </div>
                      )}
                      {currentReview.solution && (
                        <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border border-emerald-100 dark:border-emerald-900/40">
                          <span className="font-bold text-emerald-700 dark:text-emerald-300 block mb-1">
                            حل المشكلة:
                          </span>
                          <p className="text-slate-700 dark:text-slate-300">{currentReview.solution}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {currentReview.prioritiesNextWeek && (
                    <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl border border-indigo-100 dark:border-indigo-900/40">
                      <span className="font-bold text-indigo-900 dark:text-indigo-300 block mb-1">
                        أولويات الأسبوع القادم:
                      </span>
                      <p className="text-slate-700 dark:text-slate-300">{currentReview.prioritiesNextWeek}</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400">
                  <p className="mb-3">لم تقم بكتابة مراجعة وتأملات الأسبوع {selectedWeek} بعد.</p>
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold"
                  >
                    ملء استمارة المراجعة الآن
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
