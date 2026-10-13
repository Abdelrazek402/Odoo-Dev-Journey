import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const NotificationToast: React.FC = () => {
  const { notifications, removeToast } = useApp();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-5 left-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {notifications.map((n) => {
        const iconConfig = {
          success: { icon: CheckCircle2, bg: 'bg-emerald-950/90 border-emerald-800 text-emerald-200' },
          error: { icon: AlertCircle, bg: 'bg-rose-950/90 border-rose-800 text-rose-200' },
          warning: { icon: AlertTriangle, bg: 'bg-amber-950/90 border-amber-800 text-amber-200' },
          info: { icon: Info, bg: 'bg-slate-900/95 border-slate-700 text-slate-200' }
        }[n.type];

        const IconComponent = iconConfig.icon;

        return (
          <div
            key={n.id}
            className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-2xl shadow-xl border backdrop-blur-md transition-all animate-in slide-in-from-bottom-2 duration-200 ${iconConfig.bg}`}
          >
            <div className="flex items-center gap-2.5">
              <IconComponent className="w-5 h-5 flex-shrink-0" />
              <p className="text-xs font-semibold leading-relaxed">{n.message}</p>
            </div>
            <button
              type="button"
              onClick={() => removeToast(n.id)}
              className="p-1 hover:opacity-75 rounded-lg mr-2 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
