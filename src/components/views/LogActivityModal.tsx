import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ActivityLog, ActivityOutcome, ActivityType, TaskDifficulty } from '../../types';
import { Modal } from '../common/Modal';
import { getCairoTodayString } from '../../services/dateUtils';

interface LogActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMinutes?: number;
  initialTaskId?: string;
  activityToEdit?: ActivityLog | null;
}

export const LogActivityModal: React.FC<LogActivityModalProps> = ({
  isOpen,
  onClose,
  initialMinutes,
  initialTaskId,
  activityToEdit
}) => {
  const { state, addActivity, updateActivity } = useApp();

  const [date, setDate] = useState<string>(getCairoTodayString());
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [durationMinutes, setDurationMinutes] = useState<number>(120);
  const [taskId, setTaskId] = useState<string>('');
  const [activityType, setActivityType] = useState<ActivityType>('coding');
  const [summary, setSummary] = useState<string>('');
  const [whatLearned, setWhatLearned] = useState<string>('');
  const [detailedNotes, setDetailedNotes] = useState<string>('');
  const [codeSnippet, setCodeSnippet] = useState<string>('');
  const [problemEncountered, setProblemEncountered] = useState<string>('');
  const [solutionTroubleshooting, setSolutionTroubleshooting] = useState<string>('');
  const [confidenceRating, setConfidenceRating] = useState<number>(4);
  const [difficultyRating, setDifficultyRating] = useState<TaskDifficulty>('intermediate');
  const [outcome, setOutcome] = useState<ActivityOutcome>('completed');
  const [githubReference, setGithubReference] = useState<string>('');
  const [nextAction, setNextAction] = useState<string>('');
  const [tagInput, setTagInput] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    if (activityToEdit) {
      setDate(activityToEdit.date);
      setStartTime(activityToEdit.startTime || '');
      setEndTime(activityToEdit.endTime || '');
      setDurationMinutes(activityToEdit.durationMinutes);
      setTaskId(activityToEdit.taskId || '');
      setActivityType(activityToEdit.activityType);
      setSummary(activityToEdit.summary);
      setWhatLearned(activityToEdit.whatLearned);
      setDetailedNotes(activityToEdit.detailedNotes || '');
      setCodeSnippet(activityToEdit.codeSnippet || '');
      setProblemEncountered(activityToEdit.problemEncountered || '');
      setSolutionTroubleshooting(activityToEdit.solutionTroubleshooting || '');
      setConfidenceRating(activityToEdit.confidenceRating || 3);
      setDifficultyRating(activityToEdit.difficultyRating || 'intermediate');
      setOutcome(activityToEdit.outcome);
      setGithubReference(activityToEdit.githubReference || '');
      setNextAction(activityToEdit.nextAction || '');
      setTags(activityToEdit.tags || []);
    } else {
      // Default new form
      setDate(getCairoTodayString());
      setDurationMinutes(initialMinutes || 120);
      setTaskId(initialTaskId || '');
      setActivityType('coding');
      setSummary('');
      setWhatLearned('');
      setDetailedNotes('');
      setCodeSnippet('');
      setProblemEncountered('');
      setSolutionTroubleshooting('');
      setConfidenceRating(4);
      setDifficultyRating('intermediate');
      setOutcome('completed');
      setGithubReference('');
      setNextAction('');
      setTags([]);
    }
  }, [activityToEdit, initialMinutes, initialTaskId, isOpen]);

  // When task changes, sync week & technical skill default
  const selectedTaskObj = state.tasks.find((t) => t.id === taskId);

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!summary.trim()) {
      alert('يرجى كتابة ملخص ما قمت به');
      return;
    }
    if (!whatLearned.trim()) {
      alert('يرجى تسجيل ما تعلمته أو استخلصته من الجلسة');
      return;
    }

    const payload = {
      date,
      startTime: startTime || undefined,
      endTime: endTime || undefined,
      durationMinutes: Number(durationMinutes) || 0,
      taskId: taskId || undefined,
      week: selectedTaskObj?.week,
      technicalSkill: selectedTaskObj?.technicalSkills?.[0],
      activityType,
      summary: summary.trim(),
      whatLearned: whatLearned.trim(),
      detailedNotes: detailedNotes.trim() || undefined,
      codeSnippet: codeSnippet.trim() || undefined,
      problemEncountered: problemEncountered.trim() || undefined,
      solutionTroubleshooting: solutionTroubleshooting.trim() || undefined,
      confidenceRating: Number(confidenceRating),
      difficultyRating,
      outcome,
      githubReference: githubReference.trim() || undefined,
      nextAction: nextAction.trim() || undefined,
      tags
    };

    if (activityToEdit) {
      updateActivity(activityToEdit.id, payload);
    } else {
      addActivity(payload);
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={activityToEdit ? 'تعديل سجل النشاط' : 'تسجيل جلسة مذاكرة ونشاط جديد 📝'}
      subtitle="سجل تفاصيل جلسة التعلم والكود والتحديات للحفاظ على تاريخك البرمجي الدقيق"
      maxWidth="2xl"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2 text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md shadow-indigo-600/20"
          >
            {activityToEdit ? 'حفظ التعديلات' : 'تسجيل النشاط'}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Row 1: Date, duration, Task */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              التاريخ *
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              المدة الفعلية (دقائق) *
            </label>
            <input
              type="number"
              min="1"
              max="600"
              required
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
            <span className="text-[10px] text-slate-500 mt-0.5 block">
              {(durationMinutes / 60).toFixed(1)} ساعة
            </span>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              المهمة المرتبطة بالخطة
            </label>
            <select
              value={taskId}
              onChange={(e) => setTaskId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="">بدون ربط مباشر بمهمة</option>
              {state.tasks.map((t) => (
                <option key={t.id} value={t.id}>
                  أ{t.week} ي{t.day}: {t.titleAr.slice(0, 30)}...
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: Activity Type & Outcome & Difficulty */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              نوع النشاط
            </label>
            <select
              value={activityType}
              onChange={(e) => setActivityType(e.target.value as ActivityType)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="coding">برمجة وتطبيق عملي</option>
              <option value="lesson">درس وشرح نظري</option>
              <option value="debugging">تصحيح أخطاء وتتبع</option>
              <option value="project">عمل على مشروع</option>
              <option value="revision">مراجعة أسبوعية</option>
              <option value="assessment">اختبار وتقييم</option>
              <option value="documentation">قراءة وتوثيق</option>
              <option value="other">نشاط آخر</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              النتيجة المحققة
            </label>
            <select
              value={outcome}
              onChange={(e) => setOutcome(e.target.value as ActivityOutcome)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="completed">مكتمل بالكامل</option>
              <option value="partially_completed">مكتمل جزئياً</option>
              <option value="needs_follow_up">يحتاج متابعة لاحقة</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              درجة الصعوبة
            </label>
            <select
              value={difficultyRating}
              onChange={(e) => setDifficultyRating(e.target.value as TaskDifficulty)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="beginner">مبتدئ / سهل</option>
              <option value="intermediate">متوسط</option>
              <option value="advanced">متقدم / معقد</option>
            </select>
          </div>
        </div>

        {/* Row 3: Summary */}
        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
            ملخص ما تم إنجازه *
          </label>
          <input
            type="text"
            required
            placeholder="مثال: كتابة كود الفواتير مع الشروط والتحقق من صحة المدخلات"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
          />
        </div>

        {/* Row 4: What Learned */}
        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
            ما تعلمته واستفدته من الجلسة *
          </label>
          <textarea
            required
            rows={2}
            placeholder="النقاط الفنية الأساسية التي استوعبتها اليوم..."
            value={whatLearned}
            onChange={(e) => setWhatLearned(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          />
        </div>

        {/* Row 5: Problem & Solution (Debugging documentation) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              مشكلة أو خطأ برمجية واجهتك (إن وجد)
            </label>
            <textarea
              rows={2}
              placeholder="مثال: TypeError عند جمع النص والرقم أو ParseError في XML..."
              value={problemEncountered}
              onChange={(e) => setProblemEncountered(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              كيف قمت بحلها؟ (خطوات الحل)
            </label>
            <textarea
              rows={2}
              placeholder="مثال: استخدام دالة float() أو فحص إغلاق الوسم في ملف XML..."
              value={solutionTroubleshooting}
              onChange={(e) => setSolutionTroubleshooting(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Row 6: Code Snippet */}
        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
            مقتطف الكود البرمجي (Code Snippet)
          </label>
          <textarea
            rows={3}
            placeholder="ضع أهم سطرين أو دالة برمجية كتبتها اليوم هنا للرجوع إليها..."
            value={codeSnippet}
            onChange={(e) => setCodeSnippet(e.target.value)}
            className="w-full px-3 py-2 font-mono text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200"
            dir="ltr"
          />
        </div>

        {/* Row 7: Confidence Rating & GitHub Link */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              مستوى الثقة في الاستيعاب (1 إلى 5)
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setConfidenceRating(star)}
                  className={`w-8 h-8 rounded-lg font-bold text-xs transition-colors ${
                    confidenceRating >= star
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}
                >
                  {star}
                </button>
              ))}
              <span className="text-slate-500 mr-2">
                {confidenceRating === 5 ? 'ممتاز' : confidenceRating >= 3 ? 'جيد جداً' : 'يحتاج مراجعة'}
              </span>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              رابط GitHub أو التزام (Commit / Repo Link)
            </label>
            <input
              type="url"
              placeholder="https://github.com/username/odoo-repo/commit/..."
              value={githubReference}
              onChange={(e) => setGithubReference(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              dir="ltr"
            />
          </div>
        </div>

        {/* Row 8: Tags */}
        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
            وسوم التصنيف (Tags)
          </label>
          <div className="flex items-center gap-2 mb-2">
            <input
              type="text"
              placeholder="أضف وسم واضغط إضافة (مثل: python, orm, bugfix)..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl font-bold"
            >
              إضافة
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-[11px]"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-rose-500 font-bold ml-1"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </form>
    </Modal>
  );
};
