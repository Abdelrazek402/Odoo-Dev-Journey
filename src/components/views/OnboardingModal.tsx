import React, { useState } from 'react';
import { Sparkles, Calendar, Clock, HardDrive, Check, ArrowLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { getCairoTodayString } from '../../services/dateUtils';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const { state, updateSettings } = useApp();
  const [startDate, setStartDate] = useState(state.settings.startDate || getCairoTodayString());
  const [dailyMinutes, setDailyMinutes] = useState(state.settings.dailyTargetMinutes || 120);

  const handleConfirm = () => {
    updateSettings({
      startDate,
      dailyTargetMinutes: Number(dailyMinutes),
      onboardingCompleted: true
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {}} // User must confirm or finish
      title="مرحباً بك في رحلة مطور أودو 19 🚀"
      subtitle="نظامك الشخصي لإدارة خطة الـ 12 أسبوع والتحول من Implementor إلى Full-Stack"
      maxWidth="xl"
      footer={
        <button
          type="button"
          onClick={handleConfirm}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.01] active:scale-[0.98]"
        >
          <span>تأكيد الإعدادات وبدء رحلة التعلم</span>
          <ArrowLeft className="w-4 h-4" />
        </button>
      }
    >
      <div className="space-y-6 text-sm text-slate-600 dark:text-slate-300">
        {/* Intro Banner */}
        <div className="p-4 bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 rounded-2xl">
          <p className="leading-relaxed text-slate-800 dark:text-slate-200">
            أهلاً بك! هذا النظام صُمم خصيصاً لمساعدتك على الانتقال البرمجي الرصين من الصفر في بايثون وصولاً إلى تطوير أودو 19 الكامل (Backend & Frontend OWL)، وفق جدول مدروس بدقة:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 text-xs font-semibold">
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-indigo-100 dark:border-indigo-950 flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
              <Calendar className="w-4 h-4 text-indigo-500" />
              <span>12 أسبوعاً (60 جلسة أساسية)</span>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-indigo-100 dark:border-indigo-950 flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
              <Clock className="w-4 h-4 text-indigo-500" />
              <span>120 ساعة مذاكرة مستهدفة</span>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-indigo-100 dark:border-indigo-950 flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
              <HardDrive className="w-4 h-4 text-emerald-500" />
              <span>تخزين محلي IndexedDB مؤمّن</span>
            </div>
          </div>
        </div>

        {/* Form Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              تاريخ بدء الرحلة المعتمد (Start Date)
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              سيتم حساب كافة المواعيد المخططة للمهام والأسابيع انطلاقاً من هذا التاريخ بتوقيت القاهرة.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              الهدف اليومي للمذاكرة الأساسية (دقائق)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="30"
                max="360"
                step="15"
                value={dailyMinutes}
                onChange={(e) => setDailyMinutes(Number(e.target.value))}
                className="w-32 px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <span className="text-xs text-slate-500 dark:text-slate-400">
                ({(dailyMinutes / 60).toFixed(1)} ساعة يومياً — الافتراضي ساعتان)
              </span>
            </div>
          </div>
        </div>

        {/* Zero fake data pledge */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl text-xs text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-slate-800 flex items-start gap-2.5">
          <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
          <span>
            ستبدأ لوحة التحكم بنسبة إنجاز صفرية حقيقية تماماً دون أي أرقام أو إنجازات وهمية. كل دقيقة تسجلها ستعكس تقدمك الحقيقي!
          </span>
        </div>
      </div>
    </Modal>
  );
};
