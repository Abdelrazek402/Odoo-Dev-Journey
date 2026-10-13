import React, { useState } from 'react';
import { Play, Pause, Square, Timer, CheckCircle, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TimerWidget: React.FC<{ onFinishSession?: (minutes: number, taskId?: string) => void }> = ({
  onFinishSession
}) => {
  const { timer, startTimer, pauseTimer, resumeTimer, stopTimer, resetTimer, state } = useApp();
  const [showTaskSelector, setShowTaskSelector] = useState(false);
  const [selectedTask, setSelectedTask] = useState<string>('');

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (n: number) => String(n).padStart(2, '0');
    if (hours > 0) {
      return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }
    return `${pad(minutes)}:${pad(seconds)}`;
  };

  const handleStop = () => {
    const taskId = timer.taskId;
    const minutes = stopTimer();
    if (onFinishSession) {
      onFinishSession(minutes, taskId);
    }
  };

  if (!timer.isActive) {
    return (
      <div className="relative">
        {showTaskSelector ? (
          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-1.5 shadow-lg text-xs">
            <select
              value={selectedTask}
              onChange={(e) => setSelectedTask(e.target.value)}
              className="bg-transparent text-slate-800 dark:text-slate-200 outline-none pr-1 max-w-[200px] truncate"
            >
              <option value="">جلسة مذاكرة عامة</option>
              {state.tasks
                .filter((t) => t.status !== 'completed')
                .map((t) => (
                  <option key={t.id} value={t.id}>
                    أ{t.week} ي{t.day}: {t.titleAr}
                  </option>
                ))}
            </select>
            <button
              type="button"
              onClick={() => {
                const target = state.tasks.find((t) => t.id === selectedTask);
                startTimer(selectedTask || undefined, target?.titleAr);
                setShowTaskSelector(false);
              }}
              className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold flex items-center gap-1"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>بدء</span>
            </button>
            <button
              type="button"
              onClick={() => setShowTaskSelector(false)}
              className="px-2 py-1 text-slate-500 hover:text-slate-700"
            >
              إلغاء
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowTaskSelector(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/60 rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>بدء مؤقت المذاكرة</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 bg-indigo-600 text-white px-3.5 py-1.5 rounded-xl shadow-md shadow-indigo-600/30 text-xs font-semibold animate-in fade-in duration-200">
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        <span className="font-mono tracking-wider text-sm">{formatTime(timer.elapsedSeconds)}</span>
      </div>

      {timer.taskTitle && (
        <span className="max-w-[140px] truncate text-indigo-100 text-[11px] hidden md:inline">
          {timer.taskTitle}
        </span>
      )}

      <div className="flex items-center gap-1 border-r border-indigo-500 pr-2 mr-1">
        {timer.isPaused ? (
          <button
            type="button"
            onClick={resumeTimer}
            className="p-1 hover:bg-indigo-700 rounded-lg transition-colors"
            title="استئناف المؤقت"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
          </button>
        ) : (
          <button
            type="button"
            onClick={pauseTimer}
            className="p-1 hover:bg-indigo-700 rounded-lg transition-colors"
            title="إيقاف مؤقت"
          >
            <Pause className="w-3.5 h-3.5 fill-current" />
          </button>
        )}

        <button
          type="button"
          onClick={handleStop}
          className="p-1 hover:bg-rose-600 rounded-lg transition-colors text-rose-200 hover:text-white"
          title="إنهاء الجلسة وتسجيلها"
        >
          <Square className="w-3.5 h-3.5 fill-current" />
        </button>
      </div>
    </div>
  );
};
