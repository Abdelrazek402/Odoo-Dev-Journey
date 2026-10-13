import React, { useState, useEffect } from 'react';
import {
  Menu,
  Moon,
  Sun,
  PlusCircle,
  Download,
  Calendar,
  Clock,
  Search
} from 'lucide-react';
import { useApp, ActiveView } from '../../context/AppContext';
import { formatArabicDate, getCairoTodayString } from '../../services/dateUtils';
import { exportDatabaseToJSON } from '../../services/storage';
import { TimerWidget } from '../common/TimerWidget';

interface TopBarProps {
  onMobileMenuOpen: () => void;
  onOpenLogActivityModal: (initialMinutes?: number, initialTaskId?: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onMobileMenuOpen,
  onOpenLogActivityModal
}) => {
  const { activeView, state, updateSettings } = useApp();
  const [cairoTime, setCairoTime] = useState<string>('');

  // View Title Map
  const viewTitles: Record<ActiveView, { title: string; subtitle: string }> = {
    dashboard: { title: 'لوحة التحكم', subtitle: 'نظرة عامة على التقدم ومؤشرات رحلة التعلم' },
    roadmap: { title: 'خطة الـ 12 أسبوع', subtitle: 'المنهج الدراسي التفصيلي للانتقال إلى مطور أودو' },
    today: { title: 'مهام اليوم', subtitle: 'المحطة اليومية للمذاكرة والتطبيق العملي' },
    activities: { title: 'سجل المذاكرة والأنشطة', subtitle: 'توثيق دقيق لكل جلسة مذاكرة وتحدي برمجي' },
    projects: { title: 'المشروعات العملية', subtitle: 'المشروعات الأربعة التطبيقية ومعالم الإنجاز' },
    skills: { title: 'المهارات والتقييمات', subtitle: 'مصفوفة الكفاءات الـ 15 والتقييم الذاتي' },
    reviews: { title: 'المراجعة الأسبوعية', subtitle: 'استخلاص الدروس وتثبيت المفاهيم أسبوعياً' },
    resources: { title: 'مكتبة المصادر', subtitle: 'المراجع الرسمية لأودو وبايثون والمصادر المخصصة' },
    reports: { title: 'التقارير والتحليلات', subtitle: 'التقارير الشاملة وجاهزية الطباعة وتصدير CSV' },
    settings: { title: 'الإعدادات والنسخ الاحتياطي', subtitle: 'تخصيص الخطة ومزامنة البيانات وتصدير النسخ' }
  };

  const currentViewInfo = viewTitles[activeView] || viewTitles.dashboard;

  // Live Cairo Time Clock
  useEffect(() => {
    const updateTime = () => {
      try {
        const timeStr = new Intl.DateTimeFormat('ar-EG', {
          timeZone: 'Africa/Cairo',
          hour: '2-digit',
          minute: '2-digit'
        }).format(new Date());
        setCairoTime(timeStr);
      } catch {
        setCairoTime('');
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    const nextTheme = state.settings.theme === 'dark' ? 'light' : 'dark';
    updateSettings({ theme: nextTheme });
  };

  return (
    <header className="sticky top-0 z-20 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-6 py-3 transition-colors">
      <div className="flex items-center justify-between gap-4">
        {/* Left / Title section */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onMobileMenuOpen}
            className="md:hidden p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            aria-label="فتح القائمة"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white truncate">
              {currentViewInfo.title}
            </h2>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 truncate">
              <span className="hidden sm:inline">{currentViewInfo.subtitle}</span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-1 font-medium text-indigo-600 dark:text-indigo-400">
                <Calendar className="w-3 h-3" />
                {formatArabicDate(getCairoTodayString(), { withWeekday: true })}
              </span>
              {cairoTime && (
                <span className="hidden md:flex items-center gap-1 text-slate-400">
                  <Clock className="w-3 h-3" />
                  {cairoTime} بتوقيت القاهرة
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right / Actions section */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Study Timer Widget */}
          <TimerWidget
            onFinishSession={(minutes, taskId) => {
              onOpenLogActivityModal(minutes, taskId);
            }}
          />

          {/* Quick Log Activity Button */}
          <button
            type="button"
            onClick={() => onOpenLogActivityModal()}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-indigo-600/20 transition-all active:scale-95"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>تسجيل نشاط</span>
          </button>

          {/* Quick JSON Backup Button */}
          <button
            type="button"
            onClick={() => exportDatabaseToJSON(state)}
            className="p-2 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            title="تصدير نسخة احتياطية JSON فورية"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            title={state.settings.theme === 'dark' ? 'التحويل للوضع المضيء' : 'التحويل للوضع الليلي'}
          >
            {state.settings.theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
