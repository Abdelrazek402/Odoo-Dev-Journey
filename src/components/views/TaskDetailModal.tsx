import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Play,
  AlertTriangle,
  ExternalLink,
  BookOpen,
  Code2,
  FileCheck,
  Plus
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RoadmapTask, TaskStatus } from '../../types';
import { Modal } from '../common/Modal';
import { DifficultyBadge, StatusBadge } from '../common/Badge';
import { calculateTaskPlannedDate, formatArabicDate } from '../../services/dateUtils';

interface TaskDetailModalProps {
  taskId: string | null;
  onClose: () => void;
  onLogActivityForTask: (taskId: string) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  taskId,
  onClose,
  onLogActivityForTask
}) => {
  const { state, updateTask, startTimer } = useApp();
  const [activeTab, setActiveTab] = useState<'details' | 'notes' | 'blockers'>('details');

  if (!taskId) return null;
  const task = state.tasks.find((t) => t.id === taskId);
  if (!task) return null;

  const plannedDate = calculateTaskPlannedDate(state.settings.startDate, task.week, task.day);

  const handleStatusChange = (newStatus: TaskStatus) => {
    if (newStatus === 'completed' && task.status !== 'completed') {
      const confirmDone = window.confirm(
        'هل تود تأكيد إكمال هذه المهمة؟ تأكد من أنك قمت بالتطبيق العملي واختبار الكود.'
      );
      if (!confirmDone) return;
    }
    updateTask(task.id, { status: newStatus });
  };

  const handleNotesSave = (notes: string) => {
    updateTask(task.id, { personalNotes: notes });
  };

  const handleBlockerSave = (reason: string, resolution: string) => {
    updateTask(task.id, {
      blockerReason: reason,
      blockerResolution: resolution,
      status: reason.trim() ? 'blocked' : task.status === 'blocked' ? 'in_progress' : task.status
    });
  };

  return (
    <Modal
      isOpen={Boolean(taskId)}
      onClose={onClose}
      title={`الأسبوع ${task.week} — اليوم ${task.day}: ${task.titleAr}`}
      subtitle={task.titleEn}
      maxWidth="2xl"
      footer={
        <div className="w-full flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-500">الحالة:</span>
            <select
              value={task.status}
              onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
            >
              <option value="not_started">لم تبدأ بعد</option>
              <option value="in_progress">قيد التنفيذ</option>
              <option value="completed">مكتملة</option>
              <option value="blocked">متوقفة / عائق</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                startTimer(task.id, task.titleAr);
                onClose();
              }}
              className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900 rounded-xl font-bold flex items-center gap-1.5 hover:bg-indigo-100"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>تشغيل المؤقت</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onLogActivityForTask(task.id);
                onClose();
              }}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-sm shadow-indigo-600/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>تسجيل نشاط</span>
            </button>
          </div>
        </div>
      }
    >
      <div className="space-y-5 text-xs text-slate-600 dark:text-slate-300">
        {/* Meta Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 rounded-xl">
          <div className="flex items-center gap-2">
            <StatusBadge status={task.status} />
            <DifficultyBadge difficulty={task.difficulty} />
            {task.isOptionalReview && (
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-cyan-500/10 text-cyan-600 border border-cyan-500/20">
                مراجعة أسبوعية اختيارية
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <span className="flex items-center gap-1 font-medium">
              <Clock className="w-3.5 h-3.5" />
              المخطط: {task.estimatedMinutes} دقيقة | الفعلي: {task.actualDurationMinutes || 0} دقيقة
            </span>
            <span>•</span>
            <span>الموعد: {formatArabicDate(plannedDate)}</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-1 font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('details')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'details'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            تفاصيل وتمرين المهمة
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('notes')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'notes'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            الملاحظات والكود الشخصي
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('blockers')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'blockers'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            العوائق والحلول {task.blockerReason ? '⚠️' : ''}
          </button>
        </div>

        {/* Tab 1: Details */}
        {activeTab === 'details' && (
          <div className="space-y-4">
            {/* Objective */}
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-1.5 text-xs">
                <BookOpen className="w-4 h-4 text-indigo-500" />
                الهدف التعليمي
              </h4>
              <p className="p-3 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl border border-indigo-100 dark:border-indigo-900/40 text-slate-700 dark:text-slate-200 leading-relaxed">
                {task.learningObjective}
              </p>
            </div>

            {/* Detailed Explanation */}
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-1">
                الشرح التفصيلي وما يجب مذاكرته
              </h4>
              <p className="leading-relaxed whitespace-pre-line text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800">
                {task.detailedExplanation}
              </p>
            </div>

            {/* Practical Exercise */}
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-emerald-500" />
                التمرين العملي المطلوب
              </h4>
              <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 rounded-xl text-slate-700 dark:text-slate-200 font-medium">
                {task.practicalExercise}
              </div>
            </div>

            {/* Deliverable & Acceptance criteria */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-blue-500" />
                  المخرج المتوقع
                </h4>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-800">
                  {task.expectedDeliverable}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-1">معايير القبول</h4>
                <ul className="space-y-1 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-800">
                  {task.acceptanceCriteria.map((crit, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 text-slate-600 dark:text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span>{crit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Technical Skills & Resource Links */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-500">المهارات:</span>
                {task.technicalSkills.map((sk) => (
                  <span
                    key={sk}
                    className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[11px]"
                  >
                    {sk}
                  </span>
                ))}
              </div>

              {task.resourceLinks.length > 0 && (
                <div className="flex items-center gap-2">
                  {task.resourceLinks.map((res, i) => (
                    <a
                      key={i}
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline font-bold text-[11px]"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>{res.title}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Notes & Code */}
        {activeTab === 'notes' && (
          <div className="space-y-4">
            <div>
              <label className="block font-bold text-slate-900 dark:text-white mb-1">
                ملاحظاتك الشخصية على هذه المهمة
              </label>
              <textarea
                rows={4}
                defaultValue={task.personalNotes || ''}
                onBlur={(e) => handleNotesSave(e.target.value)}
                placeholder="اكتب هنا ملخص فهمك، اختصارات، أو نقاط تريد تذكرها..."
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
              <span className="text-[10px] text-slate-500">يتم الحفظ تلقائياً بمجرد مغادرة الحقل.</span>
            </div>

            <div>
              <label className="block font-bold text-slate-900 dark:text-white mb-1">
                مقتطف الكود الذي قمت بكتابته (Snippet)
              </label>
              <textarea
                rows={5}
                defaultValue={task.codeSnippet || ''}
                onBlur={(e) => updateTask(task.id, { codeSnippet: e.target.value })}
                placeholder="# اكتب أو الصق كود بايثون أو XML الخاص بالمهمة هنا..."
                className="w-full p-3 font-mono text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-950 text-slate-100"
                dir="ltr"
              />
            </div>
          </div>
        )}

        {/* Tab 3: Blockers */}
        {activeTab === 'blockers' && (
          <div className="space-y-4">
            <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-xl text-amber-800 dark:text-amber-300">
              تسجيل العوائق بوضوح يساعدك في مراجعتها مع المدرب أو خلال جلسة المراجعة الأسبوعية.
            </div>

            <div>
              <label className="block font-bold text-slate-900 dark:text-white mb-1">
                سبب التوقف أو المشكلة (Blocker Reason)
              </label>
              <textarea
                rows={3}
                defaultValue={task.blockerReason || ''}
                placeholder="ما الذي يعيقك عن إكمال هذه المهمة؟..."
                id="blocker-reason-input"
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-900 dark:text-white mb-1">
                كيف تم الحل أو المقترح القادم (Resolution)
              </label>
              <textarea
                rows={3}
                defaultValue={task.blockerResolution || ''}
                placeholder="الحل بعد البحث، أو الاستفسار..."
                id="blocker-resolution-input"
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                const r = (document.getElementById('blocker-reason-input') as HTMLTextAreaElement)?.value || '';
                const s = (document.getElementById('blocker-resolution-input') as HTMLTextAreaElement)?.value || '';
                handleBlockerSave(r, s);
              }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold"
            >
              حفظ حالة العائق
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};
