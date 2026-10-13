import { LearningResource } from '../types';

export const INITIAL_RESOURCES: LearningResource[] = [
  {
    id: 'res-python-official',
    title: 'دليل بايثون الرسمي للمبتدئين (The Python 3 Tutorial)',
    url: 'https://docs.python.org/3/tutorial/',
    category: 'python',
    week: 1,
    description: 'المرجع الرسمي الأساسي لتعلم بايثون، يشمل الأساسيات، التحكم، الدوال، وهياكل البيانات.',
    isOfficial: true,
    tags: ['Python', 'Official', 'Fundamentals', 'Beginner'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'res-git-tutorial',
    title: 'دليل Git الرسمي للمبتدئين (Git Tutorial)',
    url: 'https://git-scm.com/docs/gittutorial',
    category: 'git',
    week: 3,
    description: 'الشرح الرسمي المباشر لأوامر Git وسير العمل مع الفروع وتتبع الملفات.',
    isOfficial: true,
    tags: ['Git', 'VCS', 'CLI', 'GitHub'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'res-postgres-tutorial',
    title: 'دليل PostgreSQL الرسمي (PostgreSQL Tutorial)',
    url: 'https://www.postgresql.org/docs/current/tutorial.html',
    category: 'postgresql',
    week: 3,
    description: 'دليل تعلم لغة SQL وبوستجري: إنشاء الجداول، الاستعلامات، والربط Joins والمفاتيح.',
    isOfficial: true,
    tags: ['Database', 'SQL', 'PostgreSQL', 'Backend'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'res-odoo-dev-tutorials',
    title: 'دروس مطوري أودو 19 الرسمية (Odoo 19 Developer Tutorials)',
    url: 'https://www.odoo.com/documentation/19.0/developer/tutorials.html',
    category: 'odoo_backend',
    week: 4,
    description: 'سلسلة التدريب الرسمية من شركة أودو لبناء أول موديول خطوة بخطوة في Odoo 19.',
    isOfficial: true,
    tags: ['Odoo 19', 'Official', 'Tutorial', 'Getting Started'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'res-odoo-backend-ref',
    title: 'مرجع الواجهة الخلفية والـ ORM في أودو 19 (Odoo Backend Reference)',
    url: 'https://www.odoo.com/documentation/19.0/developer/reference/backend.html',
    category: 'odoo_backend',
    week: 5,
    description: 'التوثيق الشامل لـ Odoo ORM، الحقول، النماذج، الصلاحيات، الوراثة، وقواعد السجلات.',
    isOfficial: true,
    tags: ['Odoo 19', 'ORM', 'Backend', 'Models', 'Security'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'res-odoo-http-ref',
    title: 'مرجع متحكمات HTTP والويب في أودو 19 (Odoo HTTP Reference)',
    url: 'https://www.odoo.com/documentation/19.0/developer/reference/backend/http.html',
    category: 'odoo_backend',
    week: 9,
    description: 'توثيق بناء مسارات الويب وبناء REST / JSON APIs ومصادقة المستخدمين في أودو.',
    isOfficial: true,
    tags: ['Odoo 19', 'HTTP', 'API', 'Controllers', 'REST'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'res-odoo-frontend-ref',
    title: 'مرجع إطار عمل الواجهة الأمامية و OWL (Odoo Frontend Framework)',
    url: 'https://www.odoo.com/documentation/19.0/developer/reference/frontend.html',
    category: 'odoo_frontend',
    week: 11,
    description: 'التوثيق الرسمي لمكتبة OWL، تسجيل المكونات، Client Actions، واستدعاء خدمات أودو.',
    isOfficial: true,
    tags: ['Odoo 19', 'OWL', 'Frontend', 'Client Action', 'JavaScript'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'res-mdn-js-guide',
    title: 'دليل جافاسكريبت الشامل من شبكة موزيلا (MDN JavaScript Guide)',
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide',
    category: 'web_tech',
    week: 8,
    description: 'المرجع القياسي العالمي لإتقان جافاسكريبت الحديثة، DOM، البرمجة غير المتزامنة، والـ APIs.',
    isOfficial: true,
    tags: ['JavaScript', 'MDN', 'Web', 'ES6'],
    createdAt: new Date().toISOString()
  }
];
