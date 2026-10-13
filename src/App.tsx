import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { NotificationToast } from './components/layout/NotificationToast';
import { DashboardView } from './components/views/DashboardView';
import { RoadmapView } from './components/views/RoadmapView';
import { TodayView } from './components/views/TodayView';
import { ActivityJournalView } from './components/views/ActivityJournalView';
import { ProjectsView } from './components/views/ProjectsView';
import { SkillsView } from './components/views/SkillsView';
import { WeeklyReviewsView } from './components/views/WeeklyReviewsView';
import { ResourcesView } from './components/views/ResourcesView';
import { ReportsView } from './components/views/ReportsView';
import { SettingsView } from './components/views/SettingsView';
import { TaskDetailModal } from './components/views/TaskDetailModal';
import { LogActivityModal } from './components/views/LogActivityModal';
import { OnboardingModal } from './components/views/OnboardingModal';
import { ActivityLog } from './types';

const MainAppContent: React.FC = () => {
  const { state, isLoading, activeView, selectedTaskId, setSelectedTaskId } = useApp();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Modals state
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [logModalInitialMinutes, setLogModalInitialMinutes] = useState<number | undefined>(undefined);
  const [logModalInitialTaskId, setLogModalInitialTaskId] = useState<string | undefined>(undefined);
  const [logModalActivityToEdit, setLogModalActivityToEdit] = useState<ActivityLog | null>(null);

  const [isOnboardingDismissed, setIsOnboardingDismissed] = useState(false);

  const handleOpenLogModal = (
    initialMinutes?: number,
    initialTaskId?: string,
    activityToEdit?: ActivityLog
  ) => {
    setLogModalInitialMinutes(initialMinutes);
    setLogModalInitialTaskId(initialTaskId);
    setLogModalActivityToEdit(activityToEdit || null);
    setIsLogModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center font-black text-xl mb-4 animate-bounce">
          Od
        </div>
        <h2 className="text-base font-bold">Odoo Dev Journey</h2>
        <p className="text-xs text-slate-400 mt-1">جاري تحميل قاعدة البيانات المحلية...</p>
      </div>
    );
  }

  const showOnboarding = !state.settings.onboardingCompleted && !isOnboardingDismissed;

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 antialiased font-['Cairo',sans-serif]">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        {/* Top Header Bar */}
        <TopBar
          onMobileMenuOpen={() => setIsMobileSidebarOpen(true)}
          onOpenLogActivityModal={(minutes, taskId) => handleOpenLogModal(minutes, taskId)}
        />

        {/* View Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeView === 'dashboard' && (
            <DashboardView
              onOpenTaskModal={(id) => setSelectedTaskId(id)}
              onOpenLogActivityModal={(min, id) => handleOpenLogModal(min, id)}
            />
          )}

          {activeView === 'roadmap' && (
            <RoadmapView
              onOpenTaskModal={(id) => setSelectedTaskId(id)}
              onOpenLogActivityModal={(min, id) => handleOpenLogModal(min, id)}
            />
          )}

          {activeView === 'today' && (
            <TodayView
              onOpenTaskModal={(id) => setSelectedTaskId(id)}
              onOpenLogActivityModal={(min, id) => handleOpenLogModal(min, id)}
            />
          )}

          {activeView === 'activities' && (
            <ActivityJournalView
              onOpenLogModal={(min, id, toEdit) => handleOpenLogModal(min, id, toEdit)}
            />
          )}

          {activeView === 'projects' && <ProjectsView />}

          {activeView === 'skills' && <SkillsView />}

          {activeView === 'reviews' && <WeeklyReviewsView />}

          {activeView === 'resources' && <ResourcesView />}

          {activeView === 'reports' && <ReportsView />}

          {activeView === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Global Modals */}
      {selectedTaskId && (
        <TaskDetailModal
          taskId={selectedTaskId}
          onClose={() => setSelectedTaskId(null)}
          onLogActivityForTask={(tId) => handleOpenLogModal(undefined, tId)}
        />
      )}

      {isLogModalOpen && (
        <LogActivityModal
          isOpen={isLogModalOpen}
          onClose={() => {
            setIsLogModalOpen(false);
            setLogModalActivityToEdit(null);
          }}
          initialMinutes={logModalInitialMinutes}
          initialTaskId={logModalInitialTaskId}
          activityToEdit={logModalActivityToEdit}
        />
      )}

      {showOnboarding && (
        <OnboardingModal
          isOpen={showOnboarding}
          onClose={() => setIsOnboardingDismissed(true)}
        />
      )}

      {/* Notifications Toast */}
      <NotificationToast />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}

export default App;
