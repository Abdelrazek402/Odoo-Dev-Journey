import React, { useState, useRef } from 'react';
import {
  Settings,
  HardDrive,
  Cloud,
  Download,
  Upload,
  RefreshCw,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Clock,
  Calendar,
  Shield,
  FileSpreadsheet
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  exportDatabaseToJSON,
  validateBackupJSON,
  exportActivitiesToCSV
} from '../../services/storage';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { formatArabicDateTime } from '../../services/dateUtils';

export const SettingsView: React.FC = () => {
  const { state, updateSettings, resetProgress, importBackupState, addToast } = useApp();

  const [startDate, setStartDate] = useState(state.settings.startDate);
  const [dailyMinutes, setDailyMinutes] = useState(state.settings.dailyTargetMinutes);
  const [timezone, setTimezone] = useState(state.settings.timezone || 'Africa/Cairo');
  const [storageMode, setStorageMode] = useState(state.settings.storageMode || 'local');

  const [isResetTasksConfirmOpen, setIsResetTasksConfirmOpen] = useState(false);
  const [isClearAllConfirmOpen, setIsClearAllConfirmOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      startDate,
      dailyTargetMinutes: Number(dailyMinutes),
      timezone,
      storageMode: storageMode as any
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        const { isValid, error, state: validatedState } = validateBackupJSON(parsed);

        if (!isValid || !validatedState) {
          alert(`فشل التحقق من صحة الملف: ${error}`);
          return;
        }

        const confirmRestore = window.confirm(
          `تم فحص النسخة الاحتياطية بنجاح وتتضمن (${validatedState.activities.length} نشاط و ${validatedState.tasks.length} مهمة).\nهل تود استبدال البيانات الحالية بالنسخة الاحتياطية؟`
        );

        if (confirmRestore) {
          await importBackupState(validatedState);
        }
      } catch (err) {
        alert('حدث خطأ أثناء قراءة ملف النسخة الاحتياطية. تأكد من أن الملف بصيغة JSON صالحة.');
      }
    };
    reader.readAsText(file);
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-indigo-600" />
          <span>إعدادات النظام والنسخ الاحتياطي (Settings & Backup)</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          إدارة تاريخ بداية الخطة، أهداف المذاكرة، وتصدير واستيراد قواعد البيانات المحلية والسحابية.
        </p>
      </div>

      {/* 1. Schedule & General Settings */}
      <form onSubmit={handleSaveGeneral} className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm space-y-4 text-xs">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
          <Calendar className="w-4 h-4 text-indigo-500" />
          <span>جدول الخطة والمواعيد المعتمدة</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              تاريخ بدء الرحلة المعتمد (Start Date)
            </label>
            <input
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
            />
            <span className="text-[10px] text-slate-500 mt-0.5 block">
              يتم حساب مواعيد كافة المهام والأسابيع الـ 12 تلقائياً انطلاقاً من هذا اليوم.
            </span>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              الهدف اليومي لجلسة المذاكرة الأساسية (دقائق)
            </label>
            <input
              type="number"
              min="30"
              max="360"
              step="15"
              required
              value={dailyMinutes}
              onChange={(e) => setDailyMinutes(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
            />
            <span className="text-[10px] text-slate-500 mt-0.5 block">
              {(dailyMinutes / 60).toFixed(1)} ساعة يومياً (120 دقيقة = ساعتان للدراسة المركزة).
            </span>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              المنطقة الزمنية المعتمدة (Timezone)
            </label>
            <input
              type="text"
              readOnly
              value={timezone}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 font-mono"
            />
            <span className="text-[10px] text-slate-500 mt-0.5 block">
              توقيت جمهورية مصر العربية (Africa/Cairo) لضبط مواعيد الجلسات واليوم الحالي.
            </span>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              المظهر العام للواجهة (Theme)
            </label>
            <div className="flex items-center gap-2 mt-1">
              <button
                type="button"
                onClick={() => updateSettings({ theme: 'dark' })}
                className={`flex-1 py-2 rounded-xl font-bold border transition-colors ${
                  state.settings.theme === 'dark'
                    ? 'bg-slate-900 text-white border-slate-900 dark:bg-slate-800 dark:border-indigo-500'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                }`}
              >
                الوضع الليلي (Dark)
              </button>
              <button
                type="button"
                onClick={() => updateSettings({ theme: 'light' })}
                className={`flex-1 py-2 rounded-xl font-bold border transition-colors ${
                  state.settings.theme === 'light'
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                }`}
              >
                الوضع المضيء (Light)
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-sm transition-colors"
          >
            حفظ تعديلات الجدول
          </button>
        </div>
      </form>

      {/* 2. Storage Mode & Persistence Engine */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm space-y-4 text-xs">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
          <HardDrive className="w-4 h-4 text-indigo-500" />
          <span>نظام التخزين واستمرارية البيانات (Storage Architecture)</span>
        </h4>

        {/* Local mode details */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="font-bold text-sm text-slate-900 dark:text-white">
                وضع التخزين المحلي النشط: IndexedDB
              </span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
              بياناتك محفوظة محلياً
            </span>
          </div>

          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            يتم حفظ جميع مهامك، وسجلات الأنشطة، وتقييمات المهارات، والمشروعات في قاعدة بيانات IndexedDB داخل متصفحك بشكل فوري ودائم، مع نسخة احتياطية فورية في localStorage.
          </p>

          <div className="text-[11px] text-slate-500 pt-1">
            آخر وقت حفظ في قاعدة البيانات: {formatArabicDateTime(state.lastSavedAt)}
          </div>
        </div>

        {/* Cloud Mode Explanation */}
        <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 text-slate-600 dark:text-slate-400 space-y-2">
          <div className="flex items-center gap-2 font-bold text-indigo-900 dark:text-indigo-300">
            <Cloud className="w-4 h-4 text-indigo-500" />
            <span>المزامنة السحابية (Cloud Mode):</span>
          </div>
          <p className="leading-relaxed">
            محول التخزين البرمجي (Storage Adapter) مصمم ليعمل باستقلالية تامة في وضع التخزين المحلي دون الحاجة لأي مفاتيح أو اشتراكات خارجية. يمكنك في أي وقت تصدير ملف النسخة الاحتياطية الكامل لنقله بين أجهزتك أو استعادته بنقرة واحدة.
          </p>
        </div>
      </div>

      {/* 3. Backup, Export & Import */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm space-y-4 text-xs">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
          <Download className="w-4 h-4 text-indigo-500" />
          <span>تصدير واستيراد النسخ الاحتياطية (Export & Restore)</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* JSON Export */}
          <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2 text-center">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 mx-auto">
              <Download className="w-5 h-5" />
            </div>
            <h5 className="font-bold text-slate-800 dark:text-slate-200">نسخة JSON الشاملة</h5>
            <p className="text-slate-500 text-[11px]">
              تصدير كافة المهام، الأنشطة، المشروعات، المهارات والتقييمات.
            </p>
            <button
              type="button"
              onClick={() => exportDatabaseToJSON(state)}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors shadow-sm"
            >
              تصدير JSON الآن
            </button>
          </div>

          {/* CSV Export */}
          <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2 text-center">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 mx-auto">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h5 className="font-bold text-slate-800 dark:text-slate-200">سجل الأنشطة CSV</h5>
            <p className="text-slate-500 text-[11px]">
              تصدير سجلات المذاكرة لفتحها في Excel أو Google Sheets.
            </p>
            <button
              type="button"
              onClick={() => exportActivitiesToCSV(state.activities, state.tasks)}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors shadow-sm"
            >
              تصدير ملف CSV
            </button>
          </div>

          {/* JSON Import */}
          <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2 text-center">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950 flex items-center justify-center text-purple-600 mx-auto">
              <Upload className="w-5 h-5" />
            </div>
            <h5 className="font-bold text-slate-800 dark:text-slate-200">استعادة نسخة احتياطية</h5>
            <p className="text-slate-500 text-[11px]">
              استيراد ملف JSON تم تصديره مسبقاً بعد التحقق الأمني.
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-colors shadow-sm"
            >
              اختيار ملف JSON
            </button>
          </div>
        </div>
      </div>

      {/* 4. Danger Zone & Progress Resets */}
      <div className="bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-950 rounded-2xl p-5 shadow-sm space-y-4 text-xs">
        <h4 className="text-sm font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2 border-b border-rose-100 dark:border-rose-900/50 pb-2">
          <AlertTriangle className="w-4 h-4" />
          <span>منطقة العمليات الحساسة وإعادة التهيئة (Danger Zone)</span>
        </h4>

        <div className="space-y-3">
          {/* Option A: Reset task statuses only, keep activity logs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
            <div>
              <div className="font-bold text-slate-800 dark:text-slate-200">
                إعادة تعيين حالات المهام إلى "لم تبدأ" (مع الاحتفاظ بسجلات المذاكرة)
              </div>
              <p className="text-slate-500 text-[11px] mt-0.5">
                تصفير حالة إنجاز المهام الـ 72 للبدء من جديد مع بقاء تاريخ ساعات وأنشطة المذاكرة المسجلة بأمان.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsResetTasksConfirmOpen(true)}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold flex-shrink-0 transition-colors"
            >
              إعادة تعيين المهام
            </button>
          </div>

          {/* Option B: Clear all user records completely */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40">
            <div>
              <div className="font-bold text-rose-900 dark:text-rose-200">
                مسح شامل لكافة السجلات (Factory Reset)
              </div>
              <p className="text-rose-700/80 dark:text-rose-300/80 text-[11px] mt-0.5">
                حذف جميع سجلات الأنشطة، التقييمات الذاتية، وإعادة تهيئة قاعدة البيانات بالكامل. لا يمكن التراجع عن هذا الإجراء إلا بوجود ملف نسخة احتياطية.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsClearAllConfirmOpen(true)}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold flex-shrink-0 transition-colors shadow-sm"
            >
              مسح شامل وإعادة التهيئة
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        isOpen={isResetTasksConfirmOpen}
        onClose={() => setIsResetTasksConfirmOpen(false)}
        onConfirm={() => resetProgress('reset_tasks_keep_logs')}
        title="تأكيد إعادة تعيين المهام"
        message="هل أنت متأكد من رغبتك في إعادة تعيين كافة مهام الخطة إلى (لم تبدأ)؟ لن يتم حذف أي من سجلات المذاكرة الخاصة بك."
        confirmLabel="نعم، أعد تعيين المهام"
        isDestructive={false}
      />

      <ConfirmDialog
        isOpen={isClearAllConfirmOpen}
        onClose={() => setIsClearAllConfirmOpen(false)}
        onConfirm={() => resetProgress('clear_all')}
        title="تحذير: تأكيد المسح الشامل للبيانات"
        message="هذا الإجراء سيقوم بحذف كافة سجلات الأنشطة وساعات المذاكرة وتقييمات المهارات المسجلة نهائياً من قاعدة بيانات المتصفح. هل تود الاستمرار حقاً؟"
        confirmLabel="نعم، امسح كل السجلات"
        isDestructive={true}
      />
    </div>
  );
};
