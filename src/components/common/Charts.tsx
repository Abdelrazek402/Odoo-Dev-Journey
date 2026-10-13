import React, { useState } from 'react';
import { LucideIcon } from 'lucide-react';
import { WeeklyComparisonItem } from '../../services/calculations';
import { Skill } from '../../types';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  badge?: {
    text: string;
    variant: 'success' | 'warning' | 'info' | 'neutral';
  };
  progress?: {
    current: number;
    total: number;
    color?: string;
  };
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  badge,
  progress
}) => {
  const badgeClasses = {
    success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    info: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    neutral: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20'
  }[badge?.variant || 'neutral'];

  const pct = progress ? Math.min(100, Math.round((progress.current / (progress.total || 1)) * 100)) : 0;

  return (
    <div className="relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm flex-shrink-0">
          <Icon className="w-5 h-5" />
        </div>
        {badge && (
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeClasses}`}>
            {badge.text}
          </span>
        )}
      </div>

      <div className="mt-4">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
          {title}
        </span>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {value}
          </span>
        </div>
        {subtitle && (
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
            {subtitle}
          </p>
        )}
      </div>

      {progress && (
        <div className="mt-4">
          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1 font-medium">
            <span>التقدم</span>
            <span>{pct}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                progress.color || 'bg-indigo-600'
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Bar Chart comparing Planned vs Actual Study Hours per Week
 */
export const WeeklyHoursBarChart: React.FC<{ items: WeeklyComparisonItem[] }> = ({ items }) => {
  const [hoveredWeek, setHoveredWeek] = useState<number | null>(null);

  const maxVal = Math.max(12, ...items.map(i => Math.max(i.plannedCoreHours, i.actualHours)));

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">ساعات المذاكرة المخططة مقابل الفعلية</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            مقارنة الساعات الفعلية المسجلة بساعات الخطة (10 ساعات أساسية لكل أسبوع)
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-indigo-500"></span>
            <span className="text-slate-600 dark:text-slate-300">ساعات فعلية</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-slate-200 dark:bg-slate-700"></span>
            <span className="text-slate-500 dark:text-slate-400">مخطط (10س)</span>
          </div>
        </div>
      </div>

      <div className="h-64 flex items-end justify-between gap-1 sm:gap-2 pt-6 pb-2 px-1 border-b border-slate-100 dark:border-slate-800">
        {items.map((item) => {
          const plannedHeight = (item.plannedCoreHours / maxVal) * 100;
          const actualHeight = (item.actualHours / maxVal) * 100;
          const isHovered = hoveredWeek === item.week;

          return (
            <div
              key={item.week}
              className="flex-1 flex flex-col items-center h-full justify-end group relative cursor-pointer"
              onMouseEnter={() => setHoveredWeek(item.week)}
              onMouseLeave={() => setHoveredWeek(null)}
            >
              {/* Tooltip */}
              {isHovered && (
                <div className="absolute -top-12 z-20 bg-slate-900 text-white text-[11px] rounded-lg px-2.5 py-1.5 shadow-xl whitespace-nowrap pointer-events-none transform -translate-x-1/2 left-1/2">
                  <div className="font-bold">الأسبوع {item.week}</div>
                  <div>الفعلي: {item.actualHours} ساعة</div>
                  <div>المخطط: {item.plannedCoreHours} ساعة</div>
                </div>
              )}

              {/* Bars container */}
              <div className="w-full flex items-end justify-center gap-1 h-full">
                {/* Actual Bar */}
                <div
                  className={`w-2.5 sm:w-4 rounded-t-sm transition-all duration-300 ${
                    item.actualHours > 0
                      ? 'bg-indigo-600 hover:bg-indigo-500'
                      : 'bg-indigo-200/40 dark:bg-indigo-950/40 h-1'
                  }`}
                  style={{ height: item.actualHours > 0 ? `${Math.max(4, actualHeight)}%` : '4px' }}
                />
                {/* Planned Bar */}
                <div
                  className="w-2.5 sm:w-4 rounded-t-sm bg-slate-200 dark:bg-slate-800"
                  style={{ height: `${plannedHeight}%` }}
                />
              </div>

              {/* Week Label */}
              <span className="mt-2 text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 transition-colors">
                أ{item.week}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/**
 * Task Completion By Week Bar Chart
 */
export const CoreTaskCompletionBarChart: React.FC<{ items: WeeklyComparisonItem[] }> = ({ items }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">إنجاز المهام الأساسية أسبوعياً</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            عدد المهام الأساسية المكتملة (من أصل 5 مهام لكل أسبوع)
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
          إجمالي 60 مهمة
        </span>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {items.map((item) => {
          const pct = Math.round((item.coreTasksCompleted / 5) * 100);
          const isDone = item.coreTasksCompleted === 5;

          return (
            <div
              key={item.week}
              className={`p-3 rounded-xl border transition-all ${
                isDone
                  ? 'bg-emerald-500/5 border-emerald-500/30 dark:bg-emerald-950/20'
                  : item.coreTasksCompleted > 0
                  ? 'bg-indigo-50/50 border-indigo-200 dark:bg-indigo-950/20 dark:border-indigo-900/50'
                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-slate-800 dark:text-slate-200">الأسبوع {item.week}</span>
                <span className={`font-semibold ${isDone ? 'text-emerald-600' : 'text-slate-500'}`}>
                  {item.coreTasksCompleted}/5
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    isDone ? 'bg-emerald-500' : 'bg-indigo-600'
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/**
 * Radar Chart for Technical Skills Matrix
 */
export const SkillRadarChart: React.FC<{ skills: Skill[] }> = ({ skills }) => {
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');

  // Filter skills or show all 15
  const size = 380;
  const center = size / 2;
  const radius = center - 50;
  const totalSkills = skills.length;

  // Compute vertices for polygon
  const angleStep = (Math.PI * 2) / totalSkills;

  // Level rings (1 to 5)
  const levels = [1, 2, 3, 4, 5];

  const getCoordinates = (index: number, value: number) => {
    // 0 rating sits at center or slightly out
    const normalized = Math.max(0, value) / 5;
    const currentRadius = radius * normalized;
    const angle = index * angleStep - Math.PI / 2;
    return {
      x: center + currentRadius * Math.cos(angle),
      y: center + currentRadius * Math.sin(angle)
    };
  };

  const polygonPoints = skills
    .map((s, idx) => {
      const coords = getCoordinates(idx, s.currentRating);
      return `${coords.x},${coords.y}`;
    })
    .join(' ');

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">مخطط الكفاءة والمهارات التقنية</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            التقييم الذاتي الفعلي للمهارات الـ 15 (من 1 إلى 5 نجوم)
          </p>
        </div>
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setViewMode('chart')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
              viewMode === 'chart'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            مخطط راداري
          </button>
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
              viewMode === 'table'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            جدول المهارات
          </button>
        </div>
      </div>

      {viewMode === 'chart' ? (
        <div className="flex flex-col items-center justify-center overflow-x-auto py-2">
          <svg width={size} height={size} className="overflow-visible max-w-full">
            {/* Background concentric circles */}
            {levels.map((lvl) => {
              const r = (radius / 5) * lvl;
              return (
                <circle
                  key={lvl}
                  cx={center}
                  cy={center}
                  r={r}
                  fill="none"
                  stroke="currentColor"
                  className="text-slate-200 dark:text-slate-800"
                  strokeDasharray={lvl === 5 ? 'none' : '3 3'}
                  strokeWidth="1"
                />
              );
            })}

            {/* Axis spokes from center */}
            {skills.map((_, idx) => {
              const outerCoords = getCoordinates(idx, 5);
              return (
                <line
                  key={idx}
                  x1={center}
                  y1={center}
                  x2={outerCoords.x}
                  y2={outerCoords.y}
                  stroke="currentColor"
                  className="text-slate-200 dark:text-slate-800"
                  strokeWidth="1"
                />
              );
            })}

            {/* Radar Polygon Area */}
            {polygonPoints && (
              <polygon
                points={polygonPoints}
                fill="rgba(99, 102, 241, 0.25)"
                stroke="#6366f1"
                strokeWidth="2.5"
                className="transition-all duration-500"
              />
            )}

            {/* Radar Data Points */}
            {skills.map((skill, idx) => {
              const coords = getCoordinates(idx, skill.currentRating);
              return (
                <circle
                  key={skill.id}
                  cx={coords.x}
                  cy={coords.y}
                  r={skill.currentRating > 0 ? '4' : '2'}
                  fill="#4f46e5"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  className="transition-all"
                />
              );
            })}

            {/* Skill Labels around perimeter */}
            {skills.map((skill, idx) => {
              const labelCoords = getCoordinates(idx, 5.7);
              return (
                <text
                  key={skill.id}
                  x={labelCoords.x}
                  y={labelCoords.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="text-[9px] sm:text-[10px] font-semibold fill-slate-700 dark:fill-slate-300"
                >
                  {skill.nameAr.slice(0, 16)}
                </text>
              );
            })}
          </svg>
          <div className="mt-3 text-center text-xs text-slate-500 dark:text-slate-400">
            {skills.every(s => s.currentRating === 0)
              ? 'لم تقم بتسجيل تقييمات ذاتية بعد. يمكنك تقييم مهاراتك من صفحة "المهارات والتقييمات".'
              : 'القيم ممثلة من 1 إلى 5 بناءً على آخر تقييم ذاتي تم تسجيله.'}
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-500">
                <th className="py-2.5 pr-2 font-semibold">المهارة التقنية</th>
                <th className="py-2.5 font-semibold">التصنيف</th>
                <th className="py-2.5 font-semibold">المستوى الحالي</th>
                <th className="py-2.5 font-semibold">تاريخ آخر تقييم</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {skills.map((skill) => (
                <tr key={skill.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-2.5 pr-2 font-bold text-slate-800 dark:text-slate-200">
                    {skill.nameAr}
                  </td>
                  <td className="py-2.5 text-slate-500">{skill.category}</td>
                  <td className="py-2.5">
                    {skill.currentRating > 0 ? (
                      <span className="inline-flex items-center gap-1 font-bold text-indigo-600 dark:text-indigo-400">
                        {skill.currentRating} / 5
                      </span>
                    ) : (
                      <span className="text-slate-400">لم يقيم بعد</span>
                    )}
                  </td>
                  <td className="py-2.5 text-slate-500">
                    {skill.history.length > 0 ? skill.history[0].date : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
