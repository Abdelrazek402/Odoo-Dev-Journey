import React from 'react';
import {
  LayoutDashboard,
  Map,
  CalendarCheck2,
  BookOpenCheck,
  FolderKanban,
  Award,
  ListChecks,
  Library,
  BarChart3,
  Settings,
  Flame,
  HardDrive,
  Cloud,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { useApp, ActiveView } from '../../context/AppContext';
import { calculateLearningStreak, getCairoTodayString } from '../../services/dateUtils';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onToggle,
  isMobileOpen,
  onMobileClose
}) => {
  const { activeView, setActiveView, state, isSaving } = useApp();

  const navItems: { id: ActiveView; label: string; icon: any; count?: number }[] = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
    { id: 'roadmap', label: 'خطة الـ 12 أسبوع', icon: Map, count: 12 },
    { id: 'today', label: 'مهام اليوم', icon: CalendarCheck2 },
    { id: 'activities', label: 'سجل المذاكرة والأنشطة', icon: BookOpenCheck, count: state.activities.length },
    { id: 'projects', label: 'المشروعات العملية', icon: FolderKanban, count: state.projects.length },
    { id: 'skills', label: 'المهارات والتقييمات', icon: Award, count: state.skills.length },
    { id: 'reviews', label: 'المراجعة الأسبوعية', icon: ListChecks },
    { id: 'resources', label: 'مكتبة المصادر', icon: Library, count: state.resources.length },
    { id: 'reports', label: 'التقارير والتحليلات', icon: BarChart3 },
    { id: 'settings', label: 'الإعدادات والنسخ الاحتياطي', icon: Settings }
  ];

  // Calculate real streak
  const uniqueDates = Array.from(new Set(state.activities.map((a) => a.date)));
  const { currentStreak } = calculateLearningStreak(uniqueDates, getCairoTodayString());

  const handleNavClick = (viewId: ActiveView) => {
    setActiveView(viewId);
    if (isMobileOpen) onMobileClose();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0b132b] text-slate-300 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-black text-lg shadow-md shadow-indigo-500/20 flex-shrink-0">
            Od
          </div>
          {isOpen && (
            <div className="min-w-0">
              <h1 className="font-extrabold text-sm text-white tracking-tight leading-none truncate">
                Odoo Dev Journey
              </h1>
              <p className="text-[11px] text-slate-400 mt-1 truncate">
                من Implementor إلى Full-Stack
              </p>
            </div>
          )}
        </div>

        {/* Desktop Collapse Toggle */}
        <button
          type="button"
          onClick={onToggle}
          className="hidden md:flex p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors"
          title={isOpen ? 'طي القائمة' : 'توسيع القائمة'}
        >
          {isOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Streak Badge */}
      {isOpen && (
        <div className="p-3 mx-3 my-3 bg-indigo-950/40 border border-indigo-800/40 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Flame className="w-4 h-4 fill-current" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">
                {currentStreak > 0 ? `${currentStreak} أيام متتالية` : 'ابدأ حماس المذاكرة اليوم'}
              </div>
              <div className="text-[10px] text-slate-400">سلسلة الالتزام الفعلية</div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto px-2.5 py-2 space-y-1">
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
              title={item.label}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              {isOpen && (
                <div className="flex-1 flex items-center justify-between overflow-hidden">
                  <span className="truncate">{item.label}</span>
                  {item.count !== undefined && item.count > 0 && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isActive ? 'bg-indigo-700 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Storage & Environment Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-[#080e1e]">
        <div className="flex items-center gap-2.5 text-[11px] text-slate-400">
          <div className="w-7 h-7 rounded-lg bg-slate-800/80 flex items-center justify-center text-emerald-400 flex-shrink-0">
            {state.settings.storageMode === 'cloud' ? (
              <Cloud className="w-3.5 h-3.5" />
            ) : (
              <HardDrive className="w-3.5 h-3.5" />
            )}
          </div>
          {isOpen && (
            <div className="overflow-hidden min-w-0">
              <div className="flex items-center gap-1.5 font-bold text-slate-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>تخزين محلي مؤمّن</span>
              </div>
              <p className="text-[10px] text-slate-400 truncate">
                {isSaving ? 'جاري الحفظ...' : 'IndexedDB نشط ويدعم التصدير'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col flex-shrink-0 transition-all duration-300 h-screen sticky top-0 border-l border-slate-800 z-30 ${
          isOpen ? 'w-64' : 'w-18'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Backdrop & Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={onMobileClose}
            aria-hidden="true"
          />
          <div className="relative w-72 max-w-[80vw] h-full shadow-2xl z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
