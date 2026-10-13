import { Project } from '../types';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'project-a',
    code: 'TRAINING_ASSET',
    titleAr: 'مشروع أ: موديول الأصول التدريبي (Training Asset)',
    titleEn: 'Project A — Training Asset',
    purpose: 'تعلم الهيكل المعياري لموديولات أودو 19، النماذج، حقول العلاقات، واجهات العرض، ومنظومة الأمان.',
    description: 'موديول مخصص قابل للتثبيت على Odoo 19 يعرف نموذج أصول تجريبي مع كامل شاشات الإدخال وقواعد الأمان وسجلات الصيانة.',
    objectives: [
      'إنشاء موديول أودو متوافق مع معايير Odoo 19',
      'تعريف نموذج الأصول training.asset بحقوله الأساسية والمحسوبة',
      'بناء واجهات Form و List و Search مع الفلاتر',
      'ضبط صلاحيات الأمان عبر ir.model.access.csv ومجموعات المستخدمين'
    ],
    deliverables: [
      { title: 'موديول قابل للتثبيت في مجلد custom_addons', completed: false, notes: 'يشمل ملف المانيفست وملفات الاستدعاء' },
      { title: 'نموذج الأصل وحقوله (الكود، الاسم، القيمة، التواريخ)', completed: false },
      { title: 'واجهات Form View و List View مصممة بالـ XML', completed: false },
      { title: 'واجهة البحث والفلاتر والتجميع Search View', completed: false },
      { title: 'ملف الصلاحيات ir.model.access.csv ومجموعات الأمان', completed: false },
      { title: 'سجلات بيانات تجريبية حقيقية مدخلة بواسطة المستخدم', completed: false },
      { title: 'ملاحظات التثبيت ودليل الاستخدام README.md', completed: false }
    ],
    milestones: [
      { id: 'm-a1', title: 'تهيئة هيكل الموديول والمانيفست', description: 'إنشاء مجلدات الموديول وملف __manifest__.py والتثبيت في أودو', completed: false },
      { id: 'm-a2', title: 'برمجة النماذج والعلاقات', description: 'تعريف نموذج training.asset وحقول Many2one و One2many', completed: false },
      { id: 'm-a3', title: 'بناء الواجهات والقوائم', description: 'تصميم عروض XML وقوائم وأوامر تشغيل النوافذ', completed: false },
      { id: 'm-a4', title: 'ضبط الأمان واختبار الإدخال', description: 'إضافة صلاحيات المستخدمين وإدخال بيانات اختبارية كاملة', completed: false }
    ],
    status: 'planned',
    estimatedHours: 25,
    actualHours: 0,
    evidenceLinks: [],
    updatedAt: new Date().toISOString()
  },
  {
    id: 'project-b',
    code: 'LANDED_COST_EXT',
    titleAr: 'مشروع ب: توسعة تكاليف الشحن والتفريغ (Landed Cost Extension)',
    titleEn: 'Project B — Landed Cost Extension',
    purpose: 'ممارسة مفاهيم محاسبة ومخازن أودو الواقعية وتوسيع نماذج أودو القياسية دون تعديل الكود الأساسي.',
    description: 'تحليل دورة التكاليف الإضافية (Landed Costs) في أودو وتطوير إضافة مخصصة ترث النماذج القائمة وتحسن توزيع التكاليف أو الفحص.',
    objectives: [
      'توثيق تدفق العمل الحالي لتكاليف الشحن Landed Costs في Odoo 19',
      'تحديد تحسين نوعي محدد وقابل للقياس في آلية التوزيع أو التوثيق',
      'تصميم موديول وراثة آمن دون لمس ملفات Odoo Core',
      'اختبار وتقييم الأثر على تقييم المخزون في قاعدة بيانات تدريبية'
    ],
    deliverables: [
      { title: 'توثيق تدفق عمل تكاليف الشحن الحالي في أودو', completed: false },
      { title: 'تحديد وتوصيف التحسين البرمجي المقترح بدقة', completed: false },
      { title: 'كود الموديول المخصص المبني بالوراثة البرمجية _inherit', completed: false },
      { title: 'اختبارات عملية للتوزيع ومقارنة النتائج الحسابية', completed: false },
      { title: 'تقرير التحقق من صحة القيود وتقييم المخزون في بيئة الاختبار', completed: false }
    ],
    milestones: [
      { id: 'm-b1', title: 'تحليل وتوثيق التدفق القياسي', description: 'مراجعة شاشات وقيود landed cost ومخرجاتها المحاسبية', completed: false },
      { id: 'm-b2', title: 'تصميم وبناء موديول الوراثة', description: 'وراثة نموذج stock.landed.cost وإضافة المنطق المخصص', completed: false },
      { id: 'm-b3', title: 'الاختبار المحاسبي في قاعدة تدريبية', description: 'تنفيذ حالات اختبار وفحص قيود اليومية وتقييم المخزون', completed: false }
    ],
    status: 'planned',
    estimatedHours: 25,
    actualHours: 0,
    evidenceLinks: [],
    updatedAt: new Date().toISOString()
  },
  {
    id: 'project-c',
    code: 'FINANCIAL_DASHBOARD',
    titleAr: 'مشروع ج: لوحة المؤشرات المالية والأصول (Financial Dashboard)',
    titleEn: 'Project C — Financial Dashboard',
    purpose: 'ممارسة تقنيات الواجهة الأمامية الحديثة، مكتبة OWL، جلب بيانات أودو وتقديم تحليلات بصرية تفاعلية.',
    description: 'لوحة مؤشرات بصرية متقدمة مبنية بـ OWL مدمجة في أودو تعرض تحليلات استهلاك الأصول والمؤشرات المالية الحية.',
    objectives: [
      'تحديد المؤشرات المالية الرئيسية (KPIs) المطلوبة بدقة',
      'تصميم واجهة متجاوبة وأنيقة تراعي معايير تجربة المستخدم وأسلوب أودو',
      'تنفيذ جلب البيانات بكفاءة عبر خدمات الواجهة الأمامية useService',
      'عرض مخططات ومؤشرات تفاعلية تتحدث مع تغيير الفلاتر'
    ],
    deliverables: [
      { title: 'وثيقة مواصفات المؤشرات المالية ومصادر بياناتها', completed: false },
      { title: 'تصميم واجهة لوحة التحكم وتوزيع البطاقات والمخططات', completed: false },
      { title: 'تنفيذ مكونات OWL وقوالب XML الخاصة بها', completed: false },
      { title: 'ربط المكون ببيانات أودو الحقيقية من النماذج', completed: false },
      { title: 'اختبار تفاعل المستخدم والفلاتر وتحديث الأرقام الفوري', completed: false }
    ],
    milestones: [
      { id: 'm-c1', title: 'تحديد المؤشرات وتصميم الواجهة', description: 'رسم هيكل الشاشة وتحديد الحسابات الإجمالية', completed: false },
      { id: 'm-c2', title: 'بناء مكونات OWL', description: 'برمجة المكونات وإدارة الحالة باستخدام useState', completed: false },
      { id: 'm-c3', title: 'الربط ببيانات أودو واختبار الأداء', description: 'استخدام orm service وتحديث البيانات الحية في الوقت الفعلي', completed: false }
    ],
    status: 'planned',
    estimatedHours: 30,
    actualHours: 0,
    evidenceLinks: [],
    updatedAt: new Date().toISOString()
  },
  {
    id: 'project-capstone',
    code: 'CAPSTONE_PLUS',
    titleAr: 'مشروع التخرج: نظام إدارة الأصول المتقدم (asset_management_plus)',
    titleEn: 'Capstone Project — asset_management_plus',
    purpose: 'التطبيق الشامل لكل ما تم تعلمه في الرحلة في موديول احترافي كامل المواصفات جاهز للنشر في معرض الأعمال.',
    description: 'تطبيق أودو 19 متكامل وشامل يغطي دورة حياة الأصول بالكامل: النماذج والعلاقات، الصيانة الدورية، الإهلاك المالي، تدفقات الاعتماد، الصلاحيات، تقارير PDF، ولوحة تحكم OWL تفاعلية واختبارات آلية.',
    objectives: [
      'تطبيق هندسة برمجية نظيفة وفق أفضل ممارسات مجتمع أودو',
      'تغطية كاملة للواجهة الخلفية (Python, ORM, Security, Reports)',
      'تغطية كاملة للواجهة الأمامية (OWL, JS, XML, Client Actions)',
      'كتابة اختبارات آلية بنسبة نجاح 100% وتوثيق احترافي باللغتين'
    ],
    deliverables: [
      { title: 'الهيكل المعماري ومخطط الكيانات ERD ومستودع Git', completed: false },
      { title: 'النماذج والعلاقات والحقول المحسوبة وقيود التحقق', completed: false },
      { title: 'شاشات Form View و List View و Search View وقوائم متناسقة', completed: false },
      { title: 'ملفات الأمان، مجموعات الأدوار، وقواعد السجلات متعددة الشركات', completed: false },
      { title: 'تدفق الاعتماد الإداري للأصول وأزرار العمليات', completed: false },
      { title: 'تقرير رسمي بصيغة PDF لبطاقة وسجل الأصل', completed: false },
      { title: 'حزمة اختبارات وحدة آلية متكاملة عبر TransactionCase', completed: false },
      { title: 'لوحة تحكم تفاعلية متصلة ببيانات أودو مبنية بـ OWL', completed: false },
      { title: 'دليل تثبيت وتوثيق شامل README.md واختبارات البيئة النظيفة', completed: false }
    ],
    milestones: [
      { id: 'm-cap1', title: 'المعمارية وتصميم النماذج وقاعدة البيانات', description: 'تجهيز الموديول ومخطط العلاقات وتأسيس مستودع Git', completed: false },
      { id: 'm-cap2', title: 'تطوير النماذج والواجهات وقواعد الأمان', description: 'بناء الشاشات وضبط مجموعات المستخدمين وتدفق الاعتماد', completed: false },
      { id: 'm-cap3', title: 'التقارير المطبوعة والاختبارات الآلية', description: 'توليد PDF تقرير الأصول وتشغيل اختبارات TransactionCase', completed: false },
      { id: 'm-cap4', title: 'لوحة تحكم OWL والنشر النهائي والمراجعة', description: 'برمجة لوحة OWL التفاعلية وتوثيق README والنشر على GitHub', completed: false }
    ],
    status: 'planned',
    estimatedHours: 40,
    actualHours: 0,
    evidenceLinks: [],
    updatedAt: new Date().toISOString()
  }
];
