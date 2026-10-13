import React, { useState } from 'react';
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  ExternalLink,
  AlertTriangle,
  BookOpen,
  Edit2,
  ChevronDown,
  Layers,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Project } from '../../types';
import { computeProjectProgress } from '../../services/calculations';
import { Modal } from '../common/Modal';

export const ProjectsView: React.FC = () => {
  const { state, updateProject, toggleProjectDeliverable, toggleProjectMilestone } = useApp();
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Edit project modal state
  const [editStatus, setEditStatus] = useState<Project['status']>('planned');
  const [editActualHours, setEditActualHours] = useState<number>(0);
  const [editBlockers, setEditBlockers] = useState<string>('');
  const [editLessons, setEditLessons] = useState<string>('');
  const [editRetro, setEditRetro] = useState<string>('');
  const [newLinkTitle, setNewLinkTitle] = useState<string>('');
  const [newLinkUrl, setNewLinkUrl] = useState<string>('');

  const openEditModal = (p: Project) => {
    setEditingProject(p);
    setEditStatus(p.status);
    setEditActualHours(p.actualHours);
    setEditBlockers(p.blockers || '');
    setEditLessons(p.lessonsLearned || '');
    setEditRetro(p.retrospectiveNotes || '');
    setNewLinkTitle('');
    setNewLinkUrl('');
  };

  const handleSaveEdit = () => {
    if (!editingProject) return;

    let updatedLinks = editingProject.evidenceLinks || [];
    if (newLinkTitle.trim() && newLinkUrl.trim()) {
      updatedLinks = [...updatedLinks, { title: newLinkTitle.trim(), url: newLinkUrl.trim() }];
    }

    updateProject(editingProject.id, {
      status: editStatus,
      actualHours: Number(editActualHours),
      blockers: editBlockers.trim() || undefined,
      lessonsLearned: editLessons.trim() || undefined,
      retrospectiveNotes: editRetro.trim() || undefined,
      evidenceLinks: updatedLinks,
      completedAt: editStatus === 'completed' && !editingProject.completedAt ? new Date().toISOString() : editingProject.completedAt
    });

    setEditingProject(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FolderKanban className="w-5 h-5 text-indigo-600" />
          <span>المشروعات العملية الأربعة (Practical Projects Portfolio)</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
          يتم احتساب نسبة تقدم كل مشروع آلياً من خلال معالم الإنجاز (Milestones) والمخرجات المسلمة (Deliverables) التي تكتمل فعلياً، وليس عبر أرقام افتراضية.
        </p>
      </div>

      {/* Projects List */}
      <div className="grid grid-cols-1 gap-6">
        {state.projects.map((project) => {
          const progress = computeProjectProgress(project);

          const statusBadge = {
            planned: { label: 'مخطط', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
            in_progress: { label: 'قيد التنفيذ', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20' },
            completed: { label: 'مكتمل بالكامل', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' },
            blocked: { label: 'يواجه عائقاً', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20' }
          }[project.status];

          return (
            <div
              key={project.id}
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5"
            >
              {/* Project Title Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${statusBadge.color}`}>
                      {statusBadge.label}
                    </span>
                    <span className="text-xs font-mono text-slate-400">{project.code}</span>
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                    {project.titleAr}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {project.purpose}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right sm:text-left">
                    <div className="text-xs text-slate-400">نسبة الإنجاز الفعلية</div>
                    <div className="text-xl font-black text-indigo-600 dark:text-indigo-400">
                      {progress.percentage}%
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => openEditModal(project)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 transition-colors"
                    title="تعديل تفاصيل المشروع"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-xs text-slate-500 mb-1 font-semibold">
                  <span>المعالم: {progress.completedMilestones}/{progress.totalMilestones} • المخرجات: {progress.completedDeliverables}/{progress.totalDeliverables}</span>
                  <span>الساعات: {project.actualHours} س فعلية من أصل {project.estimatedHours} س مقدرة</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: `${progress.percentage}%` }}
                  />
                </div>
              </div>

              {/* Description & Objectives */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-800">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                    وصف المشروع:
                  </span>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                <div className="p-3.5 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl border border-indigo-100 dark:border-indigo-900/40">
                  <span className="font-bold text-indigo-900 dark:text-indigo-300 block mb-1">
                    الأهداف التقنية المحددة:
                  </span>
                  <ul className="space-y-1 text-slate-700 dark:text-slate-300">
                    {project.objectives.map((obj, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-indigo-500 font-bold">•</span>
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Milestones & Deliverables Checklists */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Milestones */}
                <div>
                  <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-indigo-500" />
                    <span>المعالم المرحلية (Milestones)</span>
                  </h5>
                  <div className="space-y-2">
                    {project.milestones.map((m) => (
                      <label
                        key={m.id}
                        className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-colors ${
                          m.completed
                            ? 'bg-emerald-50/40 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900/50'
                            : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={m.completed}
                          onChange={() => toggleProjectMilestone(project.id, m.id)}
                          className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <div>
                          <div className={`font-bold ${m.completed ? 'text-emerald-700 dark:text-emerald-400 line-through' : 'text-slate-800 dark:text-slate-200'}`}>
                            {m.title}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">{m.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Deliverables Checklist */}
                <div>
                  <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>قائمة المخرجات المسلمة (Deliverables)</span>
                  </h5>
                  <div className="space-y-1.5">
                    {project.deliverables.map((del, idx) => (
                      <label
                        key={idx}
                        className={`flex items-start gap-2 p-2 rounded-xl border cursor-pointer transition-colors ${
                          del.completed
                            ? 'bg-emerald-50/40 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900/50'
                            : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={del.completed}
                          onChange={() => toggleProjectDeliverable(project.id, idx)}
                          className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className={`text-[11px] font-semibold ${del.completed ? 'text-emerald-700 dark:text-emerald-400 line-through' : 'text-slate-700 dark:text-slate-300'}`}>
                          {del.title}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Blockers, Evidence Links & Retrospective */}
              {(project.blockers || project.evidenceLinks.length > 0 || project.lessonsLearned) && (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs space-y-2">
                  {project.blockers && (
                    <div className="p-2.5 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-900/40 text-amber-800 dark:text-amber-300 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">العائق الحالي: </span>
                        {project.blockers}
                      </div>
                    </div>
                  )}

                  {project.lessonsLearned && (
                    <div className="p-2.5 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl border border-indigo-100 dark:border-indigo-900/40 text-indigo-900 dark:text-indigo-300">
                      <span className="font-bold">الدروس المستفادة: </span>
                      {project.lessonsLearned}
                    </div>
                  )}

                  {project.evidenceLinks.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-500">روابط الأدلة والكود:</span>
                      {project.evidenceLinks.map((link, i) => (
                        <a
                          key={i}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>{link.title}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Edit Project Modal */}
      {editingProject && (
        <Modal
          isOpen={Boolean(editingProject)}
          onClose={() => setEditingProject(null)}
          title={`تعديل مشروع: ${editingProject.titleAr}`}
          maxWidth="lg"
          footer={
            <>
              <button
                type="button"
                onClick={() => setEditingProject(null)}
                className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="px-5 py-2 text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md"
              >
                حفظ التعديلات
              </button>
            </>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  حالة المشروع
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as Project['status'])}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="planned">مخطط</option>
                  <option value="in_progress">قيد التنفيذ</option>
                  <option value="completed">مكتمل</option>
                  <option value="blocked">متوقف / عائق</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  الساعات الفعلية المقضية
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={editActualHours}
                  onChange={(e) => setEditActualHours(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                أي عوائق تواجه المشروع؟ (Blockers)
              </label>
              <textarea
                rows={2}
                value={editBlockers}
                onChange={(e) => setEditBlockers(e.target.value)}
                placeholder="اذكر أي مشكلة فنية أو عدم وضوح في المتطلبات..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                الدروس المستفادة (Lessons Learned)
              </label>
              <textarea
                rows={2}
                value={editLessons}
                onChange={(e) => setEditLessons(e.target.value)}
                placeholder="ما الذي تعلمته من تنفيذ هذا المشروع؟..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            {/* Add Evidence Link */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                إضافة رابط دليل / GitHub للمشروع
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="عنوان الرابط (مثل: Pull Request)"
                  value={newLinkTitle}
                  onChange={(e) => setNewLinkTitle(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
                <input
                  type="url"
                  placeholder="https://github.com/..."
                  value={newLinkUrl}
                  onChange={(e) => setNewLinkUrl(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  dir="ltr"
                />
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
