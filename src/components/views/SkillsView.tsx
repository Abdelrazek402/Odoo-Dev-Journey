import React, { useState } from 'react';
import {
  Award,
  Star,
  PlusCircle,
  Clock,
  ExternalLink,
  History,
  CheckCircle,
  HelpCircle,
  BookOpen
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Skill, SkillAssessmentEntry } from '../../types';
import { SkillRadarChart } from '../common/Charts';
import { Modal } from '../common/Modal';

export const SkillsView: React.FC = () => {
  const { state, updateSkillRating } = useApp();
  const [selectedSkillForRating, setSelectedSkillForRating] = useState<Skill | null>(null);
  const [ratingVal, setRatingVal] = useState<number>(3);
  const [evidenceText, setEvidenceText] = useState<string>('');
  const [improvementText, setImprovementText] = useState<string>('');
  const [nextPracticeText, setNextPracticeText] = useState<string>('');

  const [historyModalSkill, setHistoryModalSkill] = useState<Skill | null>(null);

  const openRatingModal = (skill: Skill) => {
    setSelectedSkillForRating(skill);
    setRatingVal(skill.currentRating || 3);
    setEvidenceText('');
    setImprovementText('');
    setNextPracticeText('');
  };

  const handleSaveRating = () => {
    if (!selectedSkillForRating) return;
    if (!evidenceText.trim()) {
      alert('يرجى ذكر دليل تقني يثبت استحقاق هذا المستوى (كود قمت بكتابته أو ميزة نفذتها)');
      return;
    }

    updateSkillRating(
      selectedSkillForRating.id,
      ratingVal,
      evidenceText.trim(),
      improvementText.trim(),
      nextPracticeText.trim()
    );

    setSelectedSkillForRating(null);
  };

  const levelDescriptions: Record<number, { title: string; desc: string }> = {
    1: { title: '1 - مبتدئ (Beginner)', desc: 'فهم أولي للمفاهيم مع الحاجة للرجوع المستمر للأمثلة' },
    2: { title: '2 - أساسي (Basic)', desc: 'القدرة على كتابة أوامر برمجية بسيطة مع وجود أخطاء شائعة' },
    3: { title: '3 - معرفة تطبيقية (Working Knowledge)', desc: 'تنفيذ مهام عملية اعتيادية وحل مشكلات شائعة باستقلالية معقولة' },
    4: { title: '4 - متمكن (Strong)', desc: 'بناء موديولات متكاملة والتعامل مع الأمان والـ ORM والـ APIs بكفاءة' },
    5: { title: '5 - تنفيذ مستقل واثق (Confident Independent)', desc: 'بناء معمارية برمجية متكاملة وحل أصعب الأخطاء وتوجيه الآخرين' }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm space-y-3">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-indigo-600" />
          <span>مصفوفة الكفاءات التقنية والتقييم الذاتي (15 Technical Skills)</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
          وفق متطلبات رحلتك، لا يتم رفع مستوى المهارة تلقائياً بمجرد إكمال مهمة؛ بل تقوم أنت بتقييم نفسك وإرفاق الدليل البرمجي وتحديد نقاط التحسين القادمة.
        </p>

        {/* Level Guides */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px]">
          {[1, 2, 3, 4, 5].map((lvl) => (
            <div key={lvl} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
              <span className="font-bold text-indigo-600 dark:text-indigo-400 block mb-0.5">
                {levelDescriptions[lvl].title}
              </span>
              <p className="text-slate-500 leading-tight">{levelDescriptions[lvl].desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Radar Chart */}
      <SkillRadarChart skills={state.skills} />

      {/* Skills Matrix Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {state.skills.map((skill) => {
          return (
            <div
              key={skill.id}
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-4 transition-all hover:border-indigo-300 dark:hover:border-indigo-700"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-500">
                    {skill.category}
                  </span>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          skill.currentRating >= star
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-200 dark:text-slate-700'
                        }`}
                      />
                    ))}
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mr-1">
                      {skill.currentRating > 0 ? `${skill.currentRating}/5` : 'غير مقيم'}
                    </span>
                  </div>
                </div>

                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                  {skill.nameAr}
                </h4>
                <div className="text-[11px] text-slate-400 font-mono mb-2">{skill.nameEn}</div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                  {skill.description}
                </p>

                {/* Latest Evaluation evidence preview */}
                {skill.history.length > 0 && (
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-[11px] space-y-1">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>آخر تقييم: {skill.history[0].date}</span>
                      <button
                        type="button"
                        onClick={() => setHistoryModalSkill(skill)}
                        className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5 font-bold"
                      >
                        <History className="w-3 h-3" />
                        <span>السجل ({skill.history.length})</span>
                      </button>
                    </div>
                    <div className="text-slate-700 dark:text-slate-300 font-medium line-clamp-2">
                      <span className="font-bold">الدليل: </span>
                      {skill.history[0].supportingEvidence}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => openRatingModal(skill)}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 rounded-xl text-xs font-bold transition-colors"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>تسجيل تقييم ذاتي للمهارة</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rating Entry Modal */}
      {selectedSkillForRating && (
        <Modal
          isOpen={Boolean(selectedSkillForRating)}
          onClose={() => setSelectedSkillForRating(null)}
          title={`تسجيل تقييم ذاتي: ${selectedSkillForRating.nameAr}`}
          subtitle="سجل مستواك الفعلي مع تقديم أدلة من كودك أو مشروعاتك"
          maxWidth="lg"
          footer={
            <>
              <button
                type="button"
                onClick={() => setSelectedSkillForRating(null)}
                className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleSaveRating}
                className="px-5 py-2 text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md"
              >
                حفظ التقييم الذاتي
              </button>
            </>
          }
        >
          <div className="space-y-4 text-xs">
            {/* Choose Rating */}
            <div>
              <label className="block font-bold text-slate-800 dark:text-slate-200 mb-2">
                حدد مستواك الحالي (من 1 إلى 5):
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setRatingVal(lvl)}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      ratingVal === lvl
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                        : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-sm font-black mb-0.5">{lvl}</div>
                    <div className="text-[10px] leading-tight">
                      {lvl === 1 ? 'مبتدئ' : lvl === 2 ? 'أساسي' : lvl === 3 ? 'تطبيقي' : lvl === 4 ? 'متمكن' : 'واثق'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Supporting Evidence */}
            <div>
              <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                الدليل الداعم للتقييم (Supporting Evidence) *
              </label>
              <textarea
                required
                rows={3}
                value={evidenceText}
                onChange={(e) => setEvidenceText(e.target.value)}
                placeholder="مثال: قمت ببناء فئات الـ ORM وتطبيق قيود @api.constrains واختبارها بنجاح في موديول التدريب..."
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            {/* Improvement area */}
            <div>
              <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                مجالات لا تزال بحاجة لتحسين (Areas for Improvement)
              </label>
              <textarea
                rows={2}
                value={improvementText}
                onChange={(e) => setImprovementText(e.target.value)}
                placeholder="مثال: بحاجة لمزيد من الممارسة على علاقة Many2many و domain المعقد..."
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            {/* Next Practice Activity */}
            <div>
              <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                نشاط التدريب القادم المقترح (Next Practice Activity)
              </label>
              <input
                type="text"
                value={nextPracticeText}
                onChange={(e) => setNextPracticeText(e.target.value)}
                placeholder="مثال: إعادة بناء استعلامات تجميع البيانات على جدول account_move..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </Modal>
      )}

      {/* Evaluation History Modal */}
      {historyModalSkill && (
        <Modal
          isOpen={Boolean(historyModalSkill)}
          onClose={() => setHistoryModalSkill(null)}
          title={`سجل التقييمات التاريخي: ${historyModalSkill.nameAr}`}
          maxWidth="lg"
          footer={
            <button
              type="button"
              onClick={() => setHistoryModalSkill(null)}
              className="px-4 py-2 text-sm font-medium bg-slate-200 dark:bg-slate-800 rounded-xl"
            >
              إغلاق
            </button>
          }
        >
          <div className="space-y-3 text-xs">
            {historyModalSkill.history.length > 0 ? (
              historyModalSkill.history.map((entry) => (
                <div
                  key={entry.id}
                  className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-800 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      المستوى: {entry.rating} من 5
                    </span>
                    <span className="text-slate-400 text-[11px]">{entry.date}</span>
                  </div>
                  <div className="text-slate-700 dark:text-slate-300">
                    <span className="font-semibold text-slate-500">الدليل: </span>
                    {entry.supportingEvidence}
                  </div>
                  {entry.areasForImprovement && (
                    <div className="text-slate-700 dark:text-slate-300">
                      <span className="font-semibold text-slate-500">نقاط التطوير: </span>
                      {entry.areasForImprovement}
                    </div>
                  )}
                  {entry.nextPracticeActivity && (
                    <div className="text-indigo-600 dark:text-indigo-400">
                      <span className="font-semibold text-slate-500">النشاط القادم: </span>
                      {entry.nextPracticeActivity}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-slate-400">
                لا توجد تقييمات سابقة مسجلة لهذه المهارة.
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
