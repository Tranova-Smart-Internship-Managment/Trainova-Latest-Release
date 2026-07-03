import { Student, TrainingProvider, Supervisor, Opportunity, Application, WeeklyReport, Message, Evaluation } from '../types';

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'std-001',
    name: 'رامي الكحلوت',
    studentId: '120204321',
    universityEmail: 'r.alkahlout@student.iugaza.edu.ps',
    major: 'هندسة برمجيات (Software Engineering)',
    university: 'Islamic University',
    phone: '0599123456',
    supervisorId: 'sup-001',
    cvName: 'Rami_CV_Software_Eng.pdf',
    cvUrl: '#'
  },
  {
    id: 'std-002',
    name: 'آية الشوبكي',
    studentId: '120210987',
    universityEmail: 'a.shobaki@std.alazhar.edu.ps',
    major: 'الصيدلة السريرية (Clinical Pharmacy)',
    university: 'Al-Azhar University',
    phone: '0592987654',
    supervisorId: 'sup-002',
    cvName: 'Aya_Clinical_Pharmacy_Resume.pdf',
    cvUrl: '#'
  },
  {
    id: 'std-003',
    name: 'طارق المغني',
    studentId: '120221155',
    universityEmail: 't.almughanni@std.alaqsa.edu.ps',
    major: 'تكنولوجيا معلومات والوسائط المتعددة (IT & Graphics)',
    university: 'Al-Aqsa University',
    phone: '0595334455',
    supervisorId: null,
    cvName: 'Tarek_Mughanni_Portfolio.pdf',
    cvUrl: '#'
  },
  {
    id: 'std-004',
    name: 'فاطمة النخالة',
    studentId: '120202244',
    universityEmail: 'f.nakhala@student.iugaza.edu.ps',
    major: 'الهندسة الطبية الحيوية (Biomedical Eng.)',
    university: 'Islamic University',
    phone: '0597889900',
    supervisorId: 'sup-001',
    cvName: 'Fatima_Nakhala_CV.pdf',
    cvUrl: '#'
  }
];

export const INITIAL_SUPERVISORS: Supervisor[] = [
  {
    id: 'sup-001',
    name: 'د. أحمد رضوان',
    universityEmail: 'aradwan@iugaza.edu.ps',
    university: 'Islamic University',
    department: 'قسم هندسة الحاسوب وتكنولوجيا المعلومات'
  },
  {
    id: 'sup-002',
    name: 'د. ريناد الحتو',
    universityEmail: 'rhatto@alazhar.edu.ps',
    university: 'Al-Azhar University',
    department: 'كلية الصيدلة والعلوم الصحية'
  },
  {
    id: 'sup-003',
    name: 'أ. كمال غانم',
    universityEmail: 'kghanem@alaqsa.edu.ps',
    university: 'Al-Aqsa University',
    department: 'قسم الوسائط المتعددة والفنون الإلكترونية'
  }
];

export const INITIAL_PROVIDERS: TrainingProvider[] = [
  {
    id: 'prov-001',
    companyName: 'شركة جوال (مجموعة الاتصالات الفلسطينية)',
    email: 'hr@jawwal.ps',
    phone: '0599001122',
    address: 'غزة، شارع الجلاء، برج الجلاء الرئيسي',
    description: 'الشركة الرائدة في مجال الاتصالات المتنقلة وحلول تكنولوجيا المعلومات في فلسطين، توفر فرص تدريب متكاملة لطلاب الحاسوب، والتسويق، والإدارة.',
    isVerified: true,
    logoColor: 'from-emerald-600 to-teal-500'
  },
  {
    id: 'prov-002',
    companyName: 'مستشفى الشفاء الطبي (وزارة الصحة)',
    email: 'info@shifa.ps',
    phone: '082823555',
    address: 'غزة، تقاطع شارع عز الدين القسام مع شارع عمر المختار',
    description: 'المستشفى الطبي الأكبر في قطاع غزة، يقدم لطلبة كليات الطب البشري والتمريض والصيدلة السريرية تدريباً ميدانياً حيوياً بإشراف كبار الأطباء والعلماء والتنسيق الإداري.',
    isVerified: true,
    logoColor: 'from-blue-600 to-indigo-500'
  },
  {
    id: 'prov-003',
    companyName: 'شركة أوريدو فلسطين',
    email: 'careers@ooredoo.ps',
    phone: '0592002233',
    address: 'غزة، حي الرمال، بالقرب من دوار أبو مازن',
    description: 'إحدى كبرى شركات الاتصالات الدولية العاملة في فلسطين، توفر بيئة تدريب ريادية لتطبيقات الويب والاتصالات وتطوير شبكات الجيل الحديث والذكاء الاصطناعي.',
    isVerified: true,
    logoColor: 'from-rose-600 to-red-500'
  },
  {
    id: 'prov-004',
    companyName: 'مستشفى غزة الأوروبي',
    email: 'internship@egh.ps',
    phone: '082062000',
    address: 'خانيونس، الفخاري، الشارع المتفرع من طريق صلاح الدين',
    description: 'مستشفى رائد مجهز بأحدث الأجهزة الطبية في المنطقة الجنوبية، ويوفر تدريباً متخصصاً في مجال تشغيل وإصلاح وصيانة الأجهزة الطبية وهندسة الحاسوب الحيوية والمعدات التخصصية.',
    isVerified: true,
    logoColor: 'from-sky-600 to-cyan-500'
  }
];

export const INITIAL_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-001',
    providerId: 'prov-001',
    providerName: 'شركة جوال (مجموعة الاتصالات الفلسطينية)',
    title: 'تطوير تطبيقات الويب والهواتف الذكية (Full-Stack Dev)',
    description: 'الانخراط مع فريق تطوير البرمجيات في جوال للمساهمة في بناء وصيانة الأنظمة الداخلية وبوابات المشتركين باستخدام React و Node.js. يشمل التدريب معايير جودة الكود واختبار الحماية البرمجية وتكامل قواعد البيانات.',
    requiredMajor: 'هندسة برمجيات (Software Engineering) / علوم حاسوب',
    requiredSkills: ['React', 'Node.js', 'TypeScript', 'REST APIs', 'Git'],
    availablePositions: 3,
    location: 'غزة، فرع ش. الجلاء',
    deadline: '2026-07-15',
    status: 'active',
    durationWeeks: 12
  },
  {
    id: 'opp-002',
    providerId: 'prov-002',
    providerName: 'مستشفى الشفاء الطبي (وزارة الصحة)',
    title: 'تدريب ممارسات الصيدلة السريرية المتقدمة',
    description: 'التدريب العملي في أقسام العناية المركزة والقلب والباطنية برفقة صيادلة سريريين ذوي كفاءة عالية. يركز التدريب على متابعة خطط العلاج الدوائي للمرضى المحجوزين، وفحص التداخلات الدوائية ومراقبة الجرعات.',
    requiredMajor: 'الصيدلة السريرية (Clinical Pharmacy) / دكتور صيدلة',
    requiredSkills: ['معرفة التداخلات العلاجية', 'صياغة الملاحظات الإكلينيكية', 'فهم الفحوصات الطبية', 'تحليل الجرعات'],
    availablePositions: 5,
    location: 'غزة، مجمع الشفاء الطبي',
    deadline: '2026-07-20',
    status: 'active',
    durationWeeks: 16
  },
  {
    id: 'opp-003',
    providerId: 'prov-003',
    providerName: 'شركة أوريدو فلسطين',
    title: 'هندسة شبكات المحمول والاتصالات اللاسلكية',
    description: 'تدريب ميداني فريد يهدف لاكتساب المعرفة الكاملة في تخطيط وتحسين شبكات الجوال وتتبع جودة الإشارة وصيانة محطات البث الخلوية والميكروويف بإشراف مهندسو العمليات الميدانية في غزة.',
    requiredMajor: 'هندسة الاتصالات والتحكم / هندسة الحاسوب',
    requiredSkills: ['أساسيات شبكات GSM/LTE', 'تخطيط الترددات RF', 'أجهزة القياس اللاسلكية', 'تحليل البيانات الميدانية'],
    availablePositions: 2,
    location: 'غزة، فرع حي الرمال',
    deadline: '2026-07-10',
    status: 'active',
    durationWeeks: 10
  },
  {
    id: 'opp-004',
    providerId: 'prov-004',
    providerName: 'مستشفى غزة الأوروبي',
    title: 'صيانة ومعايرة الأجهزة الطبية الحيوية',
    description: 'فرصة تدريب تطبيقية ممتازة للطلبة لشرح وصيانة ومعايرة الأجهزة الطبية المتقدمة مثل أجهزة التنفس الصناعي، غسيل الكلى، تخطيط القلب ومستوى الإشعاع في غرف المختبرات والأشعة بالمستشفى.',
    requiredMajor: 'الهندسة الطبية الحيوية (Biomedical Eng.) / هندسة الإلكترونيات',
    requiredSkills: ['فهم الدوائر الطبية', 'معايرة الحساسات الحيوية', 'إجراءات السلامة الكهربائية للعيادات', 'قراءة المخططات الفنية'],
    availablePositions: 4,
    location: 'خانيونس، مستشفى غزة الأوروبي',
    deadline: '2026-07-30',
    status: 'active',
    durationWeeks: 12
  }
];

export const INITIAL_APPLICATIONS: Application[] = [
  {
    id: 'app-001',
    studentId: 'std-001',
    studentName: 'رامي الكحلوت',
    studentMajor: 'هندسة برمجيات (Software Engineering)',
    studentUniversity: 'Islamic University',
    opportunityId: 'opp-001',
    opportunityTitle: 'تطوير تطبيقات الويب والهواتف الذكية (Full-Stack Dev)',
    providerId: 'prov-001',
    providerName: 'شركة جوال (مجموعة الاتصالات الفلسطينية)',
    appliedDate: '2026-06-05',
    cvName: 'Rami_CV_Software_Eng.pdf',
    cvUrl: '#',
    status: 'accepted',
    notes: 'تمت المقابلة التقنية بنجاح وإظهار شغف رائع وفهم ممتاز بمفاهيم React. نرحب بك بفريق جوال.'
  },
  {
    id: 'app-002',
    studentId: 'std-002',
    studentName: 'آية الشوبكي',
    studentMajor: 'الصيدلة السريرية (Clinical Pharmacy)',
    studentUniversity: 'Al-Azhar University',
    opportunityId: 'opp-002',
    opportunityTitle: 'تدريب ممارسات الصيدلة السريرية المتقدمة',
    providerId: 'prov-002',
    providerName: 'مستشفى الشفاء الطبي (وزارة الصحة)',
    appliedDate: '2026-06-07',
    cvName: 'Aya_Clinical_Pharmacy_Resume.pdf',
    cvUrl: '#',
    status: 'accepted',
    notes: 'تم قبول طلبك للالتحاق بالتدريب الميداني في العناية المركزة بمجمع الشفاء بعد تجاوز المقابلة الشفهية الأولى.'
  },
  {
    id: 'app-003',
    studentId: 'std-003',
    studentName: 'طارق المغني',
    studentMajor: 'تكنولوجيا معلومات والوسائط المتعددة (IT & Graphics)',
    studentUniversity: 'Al-Aqsa University',
    opportunityId: 'opp-001',
    opportunityTitle: 'تطوير تطبيقات الويب والهواتف الذكية (Full-Stack Dev)',
    providerId: 'prov-001',
    providerName: 'شركة جوال (مجموعة الاتصالات الفلسطينية)',
    appliedDate: '2026-06-18',
    cvName: 'Tarek_Mughanni_Portfolio.pdf',
    cvUrl: '#',
    status: 'pending',
    notes: 'الملف قيد المراجعة والتدقيق الإداري من إدارة الموارد البشرية بجوال.'
  }
];

export const INITIAL_REPORTS: WeeklyReport[] = [
  {
    id: 'rep-001',
    studentId: 'std-001',
    studentName: 'رامي الكحلوت',
    weekNumber: 1,
    reportDate: '2026-06-12',
    trainingHours: 35,
    completedTasks: 'إنهاء اللقاء التعريفي بالشركة، وإعداد البيئة التطويرية للأنظمة والتحول إلى بيئة نظام لينكس الافتراضية. دراسة وتوثيق كود بوابة المشتركين، وإصلاح خطأ برمجي بسيط في شريط البحث العلوي باستخدام React.',
    challenges: 'صعوبة الفهم الأولي لبنية قواعد البيانات العملاقة والتوزيع الداخلي للمكونات البرمجية بجوال، ولكن تم التغلب عليها بمساعدة مرشد التدريب الميداني.',
    fileAttachments: [{ name: 'Week1_Worklog.pdf', url: '#' }],
    supervisorFeedback: 'بداية ممتازة يا رامي. نرى التزاماً حقيقياً منذ الأسبوع الأول. واصل هذا الشغف وتواصل معي للنقاش بخصوص تقريرك الشهري الأول.',
    submitDate: '2026-06-12',
    isLate: false,
    isReviewed: true
  },
  {
    id: 'rep-002',
    studentId: 'std-001',
    studentName: 'رامي الكحلوت',
    weekNumber: 2,
    reportDate: '2026-06-19',
    trainingHours: 40,
    completedTasks: 'العمل على تصميم وتطوير واجهات المستخدم لصفحة إدارة العقود الجديدة، وتفريع النماذج (Responsive Forms) وربطها مع خادم Express API الداخلي لنقل بيانات المشتركين الجدد.',
    challenges: 'واجهنا انقطاع بسيط بخطوط الاتصال التجريبية بالخادم المحلي للشركة، فقمنا بمحاكاة السيرفر محلياً (Mocking Express API REST) لمتابعة العمل دون توقف.',
    fileAttachments: [{ name: 'Week2_Layout_Design.png', url: '#' }],
    submitDate: '2026-06-19',
    isLate: false,
    isReviewed: false
  },
  {
    id: 'rep-003',
    studentId: 'std-002',
    studentName: 'آية الشوبكي',
    weekNumber: 1,
    reportDate: '2026-06-14',
    trainingHours: 30,
    completedTasks: 'التدريب العملي اليومي داخل صيدلية الطوارئ بمجمع الشفاء الطبي، والبدء بقراءة ومطابقة السجلات الطبية للمصابين ومراقبة جداول سحب عينات الدم للتأكيد من غلو التأثيرات العكسية للأدوية.',
    challenges: 'الضغط العالي جداً في قسم الطوارئ وضيق الوقت للإجابة المباشرة عن كل الاستفسارات، لحل ذلك بدأت بالتدوين الفوري للملاحظات في دفتري لمراجعتها بآخر المناوبة الفنية.',
    fileAttachments: [],
    supervisorFeedback: 'فخور بك يا آية. العمل تحت الضغط في مستشفى الشفاء يكسبك مهارات لن تجديها في الكتب. مراجعتك للتداخلات ممتازة ووافية.',
    submitDate: '2026-06-14',
    isLate: false,
    isReviewed: true
  }
];

export const INITIAL_MESSAGES: Message[] = [
  {
    id: 'msg-001',
    senderId: 'sup-001',
    senderName: 'د. أحمد رضوان',
    senderRole: 'supervisor',
    receiverId: 'std-001',
    receiverName: 'رامي الكحلوت',
    receiverRole: 'student',
    content: 'السلام عليكم يا رامي، هل بدأت التدريب الفعلي في شركة جوال؟ أرجو تزويدي بالمهام المتفق عليها ومراجعة استمارة التدريب قبل رفع تقريرك الأول.',
    timestamp: '2026-06-08T09:30:00Z',
    isRead: true
  },
  {
    id: 'msg-002',
    senderId: 'std-001',
    senderName: 'رامي الكحلوت',
    senderRole: 'student',
    receiverId: 'sup-001',
    receiverName: 'د. أحمد رضوان',
    receiverRole: 'supervisor',
    content: 'وعليكم السلام يا دكتور أحمد. نعم الحمد لله، بدأت يوم الأحد الماضي، والمهام تتركز على تطوير واجهات React لبوابة المشتركين، وسأقوم برفع التقرير الأسبوعي الأول غداً بإذن الله.',
    timestamp: '2026-06-11T14:15:00Z',
    isRead: true
  },
  {
    id: 'msg-003',
    senderId: 'prov-001',
    senderName: 'شركة جوال (مجموعة الاتصالات الفلسطينية)',
    senderRole: 'provider',
    receiverId: 'std-003',
    receiverName: 'طارق العالول',
    receiverRole: 'student',
    content: 'مرحباً طارق، تم استلام طلبك ومحفظة أعمالك الرائعة. نود دعوتك لإجراء مقابلة فنية عبر زوم ومناقشة بعض مشاريع التصميم السابقة. يرجى تأكيد تواجدك يوم الإثنين الساعة 11 صباحاً.',
    timestamp: '2026-06-19T10:00:00Z',
    isRead: false
  }
];

export const INITIAL_EVALUATIONS: Evaluation[] = [
  {
    id: 'eval-001',
    studentId: 'std-001',
    studentName: 'رامي الكحلوت',
    studentMajor: 'هندسة برمجيات (Software Engineering)',
    studentUniversity: 'Islamic University',
    providerId: 'prov-001',
    providerName: 'شركة جوال (مجموعة الاتصالات الفلسطينية)',
    supervisorId: 'sup-001',
    supervisorName: 'د. أحمد رضوان',
    // Currently in-progress, partially graded to simulate live tracking:
    attendance: 10,
    commitment: 9,
    technicalSkills: 13,
    teamwork: 14,
    providerNotes: 'أداء رامي مذهل وملتزم جداً بمواعيد العمل. ذكي وسريع في حل المشكلات البرمجية.',
    providerSubmittedDate: '2026-06-20',
    reportsScore: 23,
    finalDefenseScore: 0, // Not defended yet
    supervisorNotes: 'التقارير الأسبوعية شاملة، في انتظار مناقشة التدريب الميداني النهائية.',
    calculatedGrade: null,
    isAdminApproved: false
  },
  {
    id: 'eval-002',
    studentId: 'std-002',
    studentName: 'آية الشوبكي',
    studentMajor: 'الصيدلة السريرية (Clinical Pharmacy)',
    studentUniversity: 'Al-Azhar University',
    providerId: 'prov-002',
    providerName: 'مستشفى الشفاء الطبي (وزارة الصحة)',
    supervisorId: 'sup-002',
    supervisorName: 'د. ريناد الحتو',
    attendance: 10,
    commitment: 10,
    technicalSkills: 15,
    teamwork: 15,
    providerNotes: 'مستوى استثنائي في الملاحظة الطبية ومقارنة الجرع الدوائية. أثبتت تميزاً ملحوظاً في قسم الطوارئ الصعب بمستشفى الشفاء.',
    providerSubmittedDate: '2026-06-18',
    reportsScore: 24,
    finalDefenseScore: 24,
    supervisorNotes: 'أداء أكاديمي نموذجي من الطالبة آية بالتزام لا غبار عليه وتقارير رصينة جداً.',
    supervisorSubmittedDate: '2026-06-19',
    calculatedGrade: 98, // (10+10+15+15) + (24+24) = 98 / 100
    isAdminApproved: true,
    approvalDate: '2026-06-20'
  }
];

// Helper functions for persistent database state
export function getSavedState<T>(key: string, initial: T): T {
  try {
    const saved = localStorage.getItem(`trainova_${key}`);
    return saved ? JSON.parse(saved) : initial;
  } catch (e) {
    return initial;
  }
}

export function saveState<T>(key: string, data: T): void {
  try {
    localStorage.setItem(`trainova_${key}`, JSON.stringify(data));
  } catch (e) {
    console.warn(`Failed to save state for ${key}`, e);
  }
}
