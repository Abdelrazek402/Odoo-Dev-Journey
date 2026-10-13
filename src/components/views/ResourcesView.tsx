import React, { useState } from 'react';
import {
  Library,
  ExternalLink,
  PlusCircle,
  Search,
  BookMarked,
  Tag,
  Trash2,
  BookmarkCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LearningResource } from '../../types';
import { Modal } from '../common/Modal';

export const ResourcesView: React.FC = () => {
  const { state, addResource, deleteResource } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // New Resource Form
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState<LearningResource['category']>('custom');
  const [week, setWeek] = useState<string>('');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  const categories = [
    { id: 'all', label: 'جميع المصادر' },
    { id: 'odoo_backend', label: 'أودو باكنيد و ORM' },
    { id: 'odoo_frontend', label: 'أودو و OWL' },
    { id: 'python', label: 'لغة بايثون' },
    { id: 'git', label: 'أدوات Git' },
    { id: 'postgresql', label: 'قواعد بيانات SQL' },
    { id: 'web_tech', label: 'تقنيات الويب' },
    { id: 'custom', label: 'مصادر مخصصة' }
  ];

  const filteredResources = state.resources.filter((res) => {
    if (selectedCategory !== 'all' && res.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = res.title.toLowerCase().includes(q);
      const matchDesc = res.description.toLowerCase().includes(q);
      const matchTags = res.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchTags) return false;
    }
    return true;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) {
      alert('يرجى ملء عنوان ورابط المصدر');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    addResource({
      title: title.trim(),
      url: url.trim(),
      category,
      week: week ? Number(week) : undefined,
      description: description.trim(),
      isOfficial: false,
      tags
    });

    setTitle('');
    setUrl('');
    setDescription('');
    setTagsInput('');
    setWeek('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Library className="w-5 h-5 text-indigo-600" />
              <span>مكتبة المصادر والمراجع الرسمية (Official Resources)</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              مجموعة منتقاة من أدلة Odoo 19 و Python و PostgreSQL الرسمية، مع إمكانية إضافة مراجعك المفضلة.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-indigo-600/20"
          >
            <PlusCircle className="w-4 h-4" />
            <span>إضافة مصدر جديد</span>
          </button>
        </div>

        {/* Filter & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="ابحث في المصادر والوسوم..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-9 pl-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Resources Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredResources.map((resource) => (
          <div
            key={resource.id}
            className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-4 hover:border-indigo-400 dark:hover:border-indigo-600 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {resource.isOfficial ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      مرجع رسمي موثوق
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                      مصدر شخصي
                    </span>
                  )}
                  {resource.week && (
                    <span className="text-[11px] text-slate-400 font-semibold">
                      الأسبوع {resource.week}
                    </span>
                  )}
                </div>

                {!resource.isOfficial && (
                  <button
                    type="button"
                    onClick={() => deleteResource(resource.id)}
                    className="p-1 text-slate-400 hover:text-rose-500 rounded-lg"
                    title="حذف المصدر"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5 leading-snug">
                {resource.title}
              </h4>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                {resource.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap items-center gap-1.5">
                {resource.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Visit link button */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400 truncate max-w-[200px]" dir="ltr">
                {resource.url}
              </span>
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 text-xs font-bold transition-colors"
              >
                <span>فتح المرجع</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Add Resource Modal */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="إضافة مصدر أو مرجع تعليمي جديد"
          maxWidth="md"
          footer={
            <>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleAddSubmit}
                className="px-5 py-2 text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md"
              >
                إضافة المصدر
              </button>
            </>
          }
        >
          <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                عنوان المصدر *
              </label>
              <input
                type="text"
                required
                placeholder="مثال: مقال شرح Odoo 19 Record Rules بالتفصيل"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                الرابط (URL) *
              </label>
              <input
                type="url"
                required
                placeholder="https://..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                dir="ltr"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  التصنيف
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as LearningResource['category'])}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="custom">مخصص</option>
                  <option value="odoo_backend">أودو باكنيد</option>
                  <option value="odoo_frontend">أودو و OWL</option>
                  <option value="python">بايثون</option>
                  <option value="git">Git</option>
                  <option value="postgresql">PostgreSQL</option>
                  <option value="web_tech">تقنيات الويب</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  الأسبوع المرتبط (اختياري)
                </label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  placeholder="1 - 12"
                  value={week}
                  onChange={(e) => setWeek(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                وصف المصدر وما يحتويه
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="نبذة عن الفائدة المرجوة من هذا المرجع..."
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                الوسوم (مفصولة بفواصل)
              </label>
              <input
                type="text"
                placeholder="odoo, security, tutorial"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
