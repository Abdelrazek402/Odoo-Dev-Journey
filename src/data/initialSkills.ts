import { Skill } from '../types';

export const INITIAL_SKILLS: Skill[] = [
  {
    id: 'skill-python-fundamentals',
    nameAr: 'أساسيات لغة بايثون',
    nameEn: 'Python Fundamentals',
    category: 'python',
    description: 'المتغيرات، الأنواع، العمليات، جمل التحكم الشرطية، الحلقات، القوائم، والقواميس.',
    currentRating: 0,
    history: [],
    relatedTaskIds: ['w1-d1', 'w1-d2', 'w1-d3', 'w1-d4', 'w1-d5', 'w1-d6', 'w2-d1', 'w2-d2', 'w2-d3', 'w2-d4'],
    relatedProjectIds: ['project-a']
  },
  {
    id: 'skill-oop',
    nameAr: 'البرمجة كائنية التوجه (OOP)',
    nameEn: 'Object-Oriented Programming',
    category: 'python',
    description: 'الفئات، الكائنات، دوال البناء __init__، المتغيرات، الدوال، والوراثة البرمجية.',
    currentRating: 0,
    history: [],
    relatedTaskIds: ['w2-d5', 'w2-d6', 'w4-d3', 'w7-d4'],
    relatedProjectIds: ['project-a', 'project-capstone']
  },
  {
    id: 'skill-git',
    nameAr: 'إدارة الإصدارات (Git & GitHub)',
    nameEn: 'Git & GitHub',
    category: 'devops_db',
    description: 'إنشاء المستودعات، تتبع التغييرات، الفروع (Branches)، الدمج، وملفات .gitignore.',
    currentRating: 0,
    history: [],
    relatedTaskIds: ['w3-d3', 'w4-d6', 'w12-d1', 'w12-d6'],
    relatedProjectIds: ['project-a', 'project-b', 'project-c', 'project-capstone']
  },
  {
    id: 'skill-sql',
    nameAr: 'قواعد بيانات SQL و PostgreSQL',
    nameEn: 'SQL & PostgreSQL',
    category: 'devops_db',
    description: 'استعلامات SELECT، التصفية WHERE، علاقات الربط JOIN، التجميع GROUP BY، وفحص جداول أودو.',
    currentRating: 0,
    history: [],
    relatedTaskIds: ['w3-d4', 'w3-d5'],
    relatedProjectIds: ['project-b']
  },
  {
    id: 'skill-odoo-architecture',
    nameAr: 'معمارية أودو وتطوير الموديولات',
    nameEn: 'Odoo Architecture & Module Development',
    category: 'odoo_backend',
    description: 'هيكل الموديول، ملف المانيفست __manifest__.py، مسارات addons، وترقية وتثبيت الإضافات.',
    currentRating: 0,
    history: [],
    relatedTaskIds: ['w3-d1', 'w4-d1', 'w4-d2', 'w4-d5', 'w7-d4'],
    relatedProjectIds: ['project-a', 'project-capstone']
  },
  {
    id: 'skill-odoo-orm',
    nameAr: 'Odoo ORM وعلاقات النماذج',
    nameEn: 'Odoo ORM & Relationships',
    category: 'odoo_backend',
    description: 'عمليات Recordsets CRUD، النطاقات Domains، علاقات Many2one و One2many و Many2many، والحقول المحسوبة @api.depends.',
    currentRating: 0,
    history: [],
    relatedTaskIds: ['w4-d4', 'w5-d1', 'w5-d2', 'w5-d3', 'w5-d4', 'w5-d5', 'w5-d6'],
    relatedProjectIds: ['project-a', 'project-b', 'project-capstone']
  },
  {
    id: 'skill-odoo-views',
    nameAr: 'عروض XML وواجهات أودو',
    nameEn: 'XML Views & Actions',
    category: 'odoo_backend',
    description: 'تصميم Form View و List View و Search View، وراثة الشاشات بـ XPath، وقوائم وأوامر النوافذ.',
    currentRating: 0,
    history: [],
    relatedTaskIds: ['w6-d1', 'w6-d2', 'w6-d3', 'w6-d4', 'w6-d5', 'w6-d6', 'w7-d5'],
    relatedProjectIds: ['project-a', 'project-capstone']
  },
  {
    id: 'skill-odoo-security',
    nameAr: 'أمان أودو وصلاحيات المستخدمين',
    nameEn: 'Odoo Security & Access Rights',
    category: 'odoo_backend',
    description: 'ملف ir.model.access.csv، مجموعات المستخدمين res.groups، وقواعد عزل السجلات ir.rule.',
    currentRating: 0,
    history: [],
    relatedTaskIds: ['w7-d1', 'w7-d2', 'w7-d3', 'w7-d6', 'w12-d3'],
    relatedProjectIds: ['project-a', 'project-capstone']
  },
  {
    id: 'skill-testing-debugging',
    nameAr: 'اختبارات بايثون وتصحيح الأخطاء',
    nameEn: 'Python Testing & Debugging',
    category: 'testing_arch',
    description: 'اختبارات الوحدة الآلية TransactionCase، تحليل الـ Traceback، واستخدام مكتبة logging و VS Code debugger.',
    currentRating: 0,
    history: [],
    relatedTaskIds: ['w3-d6', 'w10-d3', 'w10-d4', 'w10-d6', 'w12-d4'],
    relatedProjectIds: ['project-b', 'project-capstone']
  },
  {
    id: 'skill-qweb-reports',
    nameAr: 'تقارير QWeb وطباعة PDF',
    nameEn: 'QWeb & PDF Reports',
    category: 'odoo_backend',
    description: 'بناء قوالب التقارير المطبوعة QWeb، استخدام external_layout، وتوليد وثائق PDF الرسمية.',
    currentRating: 0,
    history: [],
    relatedTaskIds: ['w10-d1', 'w10-d2', 'w12-d4'],
    relatedProjectIds: ['project-capstone']
  },
  {
    id: 'skill-http-controllers',
    nameAr: 'متحكمات أودو وواجهات HTTP و APIs',
    nameEn: 'HTTP Controllers & APIs',
    category: 'odoo_backend',
    description: 'بناء مسارات الويب عبر @http.route، إرجاع بيانات JSON، استقبال طلبات POST، ومصادقة الـ API.',
    currentRating: 0,
    history: [],
    relatedTaskIds: ['w9-d1', 'w9-d2', 'w9-d3', 'w9-d4', 'w9-d5', 'w9-d6'],
    relatedProjectIds: ['project-capstone']
  },
  {
    id: 'skill-html-css',
    nameAr: 'تقنيات الويب HTML5 و CSS3',
    nameEn: 'HTML5 & CSS3',
    category: 'web_frontend',
    description: 'العناصر الدلالية، النماذج، تخطيطات Flexbox و CSS Grid، والتصميم المتجاوب مع الشاشات و RTL.',
    currentRating: 0,
    history: [],
    relatedTaskIds: ['w8-d1', 'w8-d2'],
    relatedProjectIds: ['project-c']
  },
  {
    id: 'skill-javascript',
    nameAr: 'لغة جافاسكريبت الحديثة (JavaScript ES6+)',
    nameEn: 'Modern JavaScript',
    category: 'web_frontend',
    description: 'أساسيات جافاسكريبت، معالجة المصفوفات والكائنات، التعامل مع الـ DOM، وطلبات Fetch و Async/Await.',
    currentRating: 0,
    history: [],
    relatedTaskIds: ['w8-d3', 'w8-d4', 'w8-d5', 'w8-d6'],
    relatedProjectIds: ['project-c']
  },
  {
    id: 'skill-owl-components',
    nameAr: 'مكونات OWL وتطوير واجهات أودو الحديثة',
    nameEn: 'OWL Components',
    category: 'web_frontend',
    description: 'مكونات إطار عمل OWL، قوالب XML، إدارة الحالة بـ useState، الخصائص Props، و Client Actions.',
    currentRating: 0,
    history: [],
    relatedTaskIds: ['w11-d1', 'w11-d2', 'w11-d3', 'w11-d4', 'w11-d5', 'w11-d6', 'w12-d5'],
    relatedProjectIds: ['project-c', 'project-capstone']
  },
  {
    id: 'skill-fullstack-integration',
    nameAr: 'التكامل والنشر الكامل Full-Stack',
    nameEn: 'Full-Stack Integration & Architecture',
    category: 'testing_arch',
    description: 'الربط المتكامل بين قاعدة البيانات ونماذج بايثون وواجهات الـ API ومكونات OWL في حل أعمال متكامل.',
    currentRating: 0,
    history: [],
    relatedTaskIds: ['w12-d1', 'w12-d2', 'w12-d3', 'w12-d4', 'w12-d5', 'w12-d6'],
    relatedProjectIds: ['project-capstone']
  }
];
