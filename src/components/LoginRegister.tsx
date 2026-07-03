import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GraduationCap, Building2, UserCheck, Shield, Mail, Lock, User, 
  MapPin, Phone, Briefcase, FileText, CheckCircle2, AlertCircle, Sparkles, LogIn, ArrowRight
} from 'lucide-react';
import { Student, TrainingProvider, Supervisor } from '../types';

interface LoginRegisterProps {
  lang: 'ar' | 'en';
  onChangeLang: (lang: 'ar' | 'en') => void;
  students: Student[];
  providers: TrainingProvider[];
  supervisors: Supervisor[];
  onLoginSuccess: (userId: string, role: 'student' | 'provider' | 'supervisor' | 'admin') => void;
  onRegisterStudent: (newStudent: Partial<Student>) => void;
  onRegisterSupervisor: (newSupervisor: Partial<Supervisor>) => void;
  onRegisterProvider: (newProvider: Partial<TrainingProvider>) => void;
}

export default function LoginRegister({
  lang,
  onChangeLang,
  students,
  providers,
  supervisors,
  onLoginSuccess,
  onRegisterStudent,
  onRegisterSupervisor,
  onRegisterProvider
}: LoginRegisterProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [activeRole, setActiveRole] = useState<'student' | 'provider' | 'supervisor' | 'admin'>('student');
  
  // Form States (Login & Register)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Common Register States
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  
  // Student Specific
  const [studentId, setStudentId] = useState('');
  const [studentMajor, setStudentMajor] = useState('');
  const [studentUni, setStudentUni] = useState<'Islamic University' | 'Al-Azhar University' | 'Al-Aqsa University'>('Islamic University');
  const [studentCvName, setStudentCvName] = useState('');

  // Supervisor Specific
  const [supervisorDept, setSupervisorDept] = useState('');
  const [supervisorUni, setSupervisorUni] = useState<'Islamic University' | 'Al-Azhar University' | 'Al-Aqsa University'>('Islamic University');

  // Provider Specific
  const [companyName, setCompanyName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [companyDesc, setCompanyDesc] = useState('');

  // Translations
  const t = {
    ar: {
      appName: 'ترينوفا',
      appSubtitle: 'منصة تنسيق التدريب الميداني الموحدة',
      appDesc: 'حلقة الوصل الذكية بين الطلبة المتميزين، كبرى شركات قطاع غزة، والمشرفين الأكاديميين المعتمدين.',
      loginTab: 'تسجيل الدخول',
      registerTab: 'إنشاء حساب جديد',
      studentRole: 'طالب متدرب',
      providerRole: 'جهة التدريب',
      supervisorRole: 'مشرف أكاديمي',
      adminRole: 'مسؤول لوحة الإدارة',
      emailLabel: 'البريد الإلكتروني',
      emailPlaceholder: 'أدخل البريد الإلكتروني المعتمد...',
      passwordLabel: 'كلمة المرور',
      passwordPlaceholder: 'أدخل كلمة المرور الخاصة بك...',
      fullNameLabel: 'الاسم الكامل',
      fullNamePlaceholder: 'الاسم رباعي باللغة العربية...',
      phoneLabel: 'رقم الجوال والاتصال',
      phonePlaceholder: 'مثال: 0599123456',
      studentIdLabel: 'الرقم الجامعي',
      studentIdPlaceholder: 'أدخل الرقم الجامعي المكون من 9 أرقام...',
      majorLabel: 'التخصص الدراسي بدقة',
      majorPlaceholder: 'مثال: هندسة برمجيات (Software Engineering)...',
      uniLabel: 'الجامعة المقيد بها',
      cvLabel: 'اسم ملف السيرة الذاتية (PDF)',
      cvPlaceholder: 'أدخل اسم ملف السيرة الذاتية لتدعيم ملفك...',
      deptLabel: 'القسم أو الكلية',
      deptPlaceholder: 'مثال: قسم هندسة الحاسوب وتكنولوجيا المعلومات...',
      companyNameLabel: 'اسم المؤسسة / الشركة الشريكة',
      companyNamePlaceholder: 'أدخل اسم الشركة التجاري بالكامل...',
      companyAddressLabel: 'العنوان الجغرافي للشركة',
      companyAddressPlaceholder: 'مثال: غزة، شارع الجلاء، الطابق الثالث...',
      companyDescLabel: 'نبذة عن الشركة ومجال عملها الأساسي',
      companyDescPlaceholder: 'اكتب سطرين تصف فيهما رؤية وعمل الشركة لتعريف المتدربين بها...',
      forgotPass: 'نسيت كلمة المرور؟',
      dontHaveAccount: 'ليس لديك حساب بعد؟',
      alreadyHaveAccount: 'لديك حساب بالفعل؟',
      submitLogin: 'تسجيل الدخول الآمن',
      submitRegister: 'إتمام التسجيل وبدء المحاكاة',
      demoTitle: 'لوحة الاختبار السريع والوصول المباشر (Reviewer Sandbox)',
      demoDesc: 'اضغط على أي بطاقة لتعبئة بيانات الحساب المعتمد مسبقاً وسيقوم النظام فوراً بتوجيهك لبوابته المخصصة.',
      demoRami: 'رامي الكحلوت (طالب)',
      demoRadwan: 'د. أحمد رضوان (مشرف)',
      demoJawwal: 'شركة جوال (جهة تدريب)',
      demoAdmin: 'إدارة الجامعة (كامل الصلاحيات)',
      regSuccess: 'تم إنشاء الحساب بنجاح! نرحب بك في منصتنا.',
      loginError: 'بريد إلكتروني غير مسجل أو كلمة مرور خاطئة. يرجى مراجعة الحساب المعتمد أدناه.',
      welcomeTitle: 'أهلاً بك مجدداً!',
      welcomeSubtitle: 'اختر بوابة الدخول المعتمدة وتابع ملفات التدريب الفعال لغزة المتميزة.'
    },
    en: {
      appName: 'Trainova',
      appSubtitle: 'Unified Field Training System',
      appDesc: 'The smart nexus linking elite students, Gaza\'s leading enterprises, and certified academic supervisors.',
      loginTab: 'Sign In',
      registerTab: 'Register Account',
      studentRole: 'Student Trainee',
      providerRole: 'Training Provider',
      supervisorRole: 'Supervisor',
      adminRole: 'University Admin',
      emailLabel: 'Email Address',
      emailPlaceholder: 'Enter registered email...',
      passwordLabel: 'Password',
      passwordPlaceholder: 'Enter your password...',
      fullNameLabel: 'Full Name',
      fullNamePlaceholder: 'Full name in Arabic/English...',
      phoneLabel: 'Phone / Contact Number',
      phonePlaceholder: 'Example: 0599123456',
      studentIdLabel: 'Student ID Number',
      studentIdPlaceholder: 'Enter 9-digit university ID...',
      majorLabel: 'Academic Major',
      majorPlaceholder: 'Example: Software Engineering...',
      uniLabel: 'Associated University',
      cvLabel: 'CV File Name (PDF)',
      cvPlaceholder: 'CV filename to support your profile...',
      deptLabel: 'Department / Faculty',
      deptPlaceholder: 'Example: Computer Engineering & IT Dept...',
      companyNameLabel: 'Company Name',
      companyNamePlaceholder: 'Complete corporate/brand name...',
      companyAddressLabel: 'Company Headquarters',
      companyAddressPlaceholder: 'Example: Jala\'a St., Gaza City...',
      companyDescLabel: 'Corporate Summary',
      companyDescPlaceholder: 'Write a brief description of company expertise...',
      forgotPass: 'Forgot password?',
      dontHaveAccount: 'Don\'t have an account?',
      alreadyHaveAccount: 'Already have an account?',
      submitLogin: 'Secure Sign In',
      submitRegister: 'Complete Registration',
      demoTitle: 'Reviewer Sandbox Access (One-Click Quick Login)',
      demoDesc: 'Click any card below to automatically fill credentials and log directly into that specific interface tier.',
      demoRami: 'Rami Al-Kahlout (Student)',
      demoRadwan: 'Dr. Ahmad Radwan (Supervisor)',
      demoJawwal: 'PalTel - Jawwal (Provider)',
      demoAdmin: 'Platform Admin (Full Controller)',
      regSuccess: 'Account registered successfully! Welcome aboard.',
      loginError: 'Invalid email/credentials. Please use one of the predefined profiles below.',
      welcomeTitle: 'Welcome Back!',
      welcomeSubtitle: 'Choose your portal entry and easily track or evaluate Gaza field training outcomes.'
    }
  }[lang];

  // Quick Sandbox Logins
  const handleQuickLogin = (roleType: 'student' | 'provider' | 'supervisor' | 'admin') => {
    setErrorMsg('');
    setSuccessMsg('');
    setActiveTab('login');
    setActiveRole(roleType);

    if (roleType === 'student') {
      setEmail('r.alkahlout@student.iugaza.edu.ps');
      setPassword('123456');
    } else if (roleType === 'supervisor') {
      setEmail('aradwan@iugaza.edu.ps');
      setPassword('123456');
    } else if (roleType === 'provider') {
      setEmail('hr@jawwal.ps');
      setPassword('123456');
    } else if (roleType === 'admin') {
      setEmail('admin@trainova.edu.ps');
      setPassword('123456');
    }

    // Direct Login triggering with a slight timeout for beautiful animation feel
    setTimeout(() => {
      let finalId = '';
      if (roleType === 'student') {
        finalId = 'std-001';
      } else if (roleType === 'supervisor') {
        finalId = 'sup-001';
      } else if (roleType === 'provider') {
        finalId = 'prov-001';
      } else {
        finalId = 'admin-root';
      }
      onLoginSuccess(finalId, roleType);
    }, 450);
  };

  const handleQuickProviderLogin = (providerId: string) => {
    setErrorMsg('');
    setSuccessMsg('');
    setActiveTab('login');
    setActiveRole('provider');

    const found = providers.find(p => p.id === providerId);
    if (found) {
      setEmail(found.email);
      setPassword('123456');

      setTimeout(() => {
        onLoginSuccess(found.id, 'provider');
      }, 450);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (activeTab === 'login') {
      // Login Logic
      if (activeRole === 'admin') {
        if (email.toLowerCase() === 'admin@trainova.edu.ps') {
          onLoginSuccess('admin-root', 'admin');
          return;
        }
      } else if (activeRole === 'student') {
        const found = students.find(s => s.universityEmail.toLowerCase().trim() === email.toLowerCase().trim());
        if (found) {
          onLoginSuccess(found.id, 'student');
          return;
        }
      } else if (activeRole === 'supervisor') {
        const found = supervisors.find(sup => sup.universityEmail.toLowerCase().trim() === email.toLowerCase().trim());
        if (found) {
          if (found.isPendingApproval) {
            setErrorMsg(lang === 'ar' 
              ? 'حسابك كمشرف أكاديمي قيد المراجعة والاعتماد من قبل إدارة الجامعة حالياً.' 
              : 'Your academic supervisor account is currently pending review and approval by the university administration.');
            return;
          }
          onLoginSuccess(found.id, 'supervisor');
          return;
        }
      } else if (activeRole === 'provider') {
        const found = providers.find(p => p.email.toLowerCase().trim() === email.toLowerCase().trim());
        if (found) {
          onLoginSuccess(found.id, 'provider');
          return;
        }
      }
      
      setErrorMsg(t.loginError);
    } else {
      // Registration Logic
      if (!fullName || !email) {
        setErrorMsg(lang === 'ar' ? 'يرجى تعبئة كافة الحقول الأساسية المطلوبة.' : 'Please fill all required primary fields.');
        return;
      }

      // Check phone number format for Gaza/Palestine
      const cleanPhone = phoneNumber.trim().replace(/\s+/g, '');
      if (!cleanPhone) {
        setErrorMsg(
          lang === 'ar'
            ? 'يرجى إدخال رقم الجوال والاتصال لحسابك الجديد.'
            : 'Please enter a contact/phone number for your new account.'
        );
        return;
      }

      // Gaza/Palestine phone validation:
      // Accepts:
      // - 059XXXXXXX (10 digits)
      // - 056XXXXXXX (10 digits)
      // - 08XXXXXXX (9 digits)
      // - +970/00970 followed by 59, 56 or 8 and digits
      const isGazaPhone = /^(059\d{7}|056\d{7}|08\d{7}|(\+970|00970)(59\d{7}|56\d{7}|8\d{7}))$/.test(cleanPhone);
      if (!isGazaPhone) {
        setErrorMsg(
          lang === 'ar'
            ? 'يرجى إدخال رقم اتصال غزة/فلسطين/ صحيح ومؤلف من 10 أرقام (مثال جوال: 0599123456 أو 0569123456، أو أرضي: 0828XXXXX).'
            : 'Please enter a valid Gaza/Palestine contact number with 10 digits (e.g. mobile: 0599123456 or 0569123456, or landline: 0828XXXXX).'
        );
        return;
      }

      if (activeRole === 'student') {
        const cleanStudentId = studentId.trim();
        if (!cleanStudentId) {
          setErrorMsg(
            lang === 'ar'
              ? 'الرجاء إدخال الرقم الجامعي الخاص بك.'
              : 'Please enter your university ID.'
          );
          return;
        }
        if (!/^\d{8,9}$/.test(cleanStudentId)) {
          setErrorMsg(
            lang === 'ar'
              ? 'يجب أن يتكون الرقم الجامعي من 8 أو 9 أرقام فقط.'
              : 'University ID must be exactly 8 or 9 digits.'
          );
          return;
        }
      }

      if (activeRole === 'supervisor') {
        const emailExists = supervisors.some(sup => sup.universityEmail.toLowerCase().trim() === email.toLowerCase().trim());
        if (emailExists) {
          setErrorMsg(
            lang === 'ar'
              ? 'لقد قمت بتقديم طلب مسبقاً بهذا البريد الإلكتروني. لا يمكن تقديم أكثر من طلب للحساب الواحد.'
              : 'You have already submitted a request with this email. Only one request is allowed per account.'
          );
          return;
        }
      }

      const generatedId = `custom-reg-${Date.now()}`;

      if (activeRole === 'student') {
        const newStudentObj: Partial<Student> = {
          id: generatedId,
          name: fullName,
          studentId: studentId.trim(),
          universityEmail: email,
          major: studentMajor || 'هندسة حاسوب وعلم بيانات',
          university: studentUni,
          phone: cleanPhone,
          supervisorId: null, // No pre-assigned supervisor until chosen by university admin
          cvName: studentCvName || 'Resume_Trainee.pdf',
          cvUrl: '#'
        };
        onRegisterStudent(newStudentObj);
        setSuccessMsg(t.regSuccess);
        setTimeout(() => {
          onLoginSuccess(generatedId, 'student');
        }, 1200);

      } else if (activeRole === 'supervisor') {
        const newSupervisorObj: Partial<Supervisor> = {
          id: generatedId,
          name: fullName,
          universityEmail: email,
          university: supervisorUni,
          department: supervisorDept || 'قسم تكنولوجيا المعلومات وهندسة البرمجيات',
          phone: cleanPhone,
          isPendingApproval: true
        };
        onRegisterSupervisor(newSupervisorObj);
        setSuccessMsg(
          lang === 'ar' 
            ? 'تم إرسال طلب تسجيلك لعمادة القبول والتسجيل بنجاح! يرجى الانتظار حتى يتم اعتماده.' 
            : 'Your registration request has been successfully sent to the Dean of Admission! Please wait for approval.'
        );
        // Note: we do NOT log them in automatically because they require approval.
      } else if (activeRole === 'provider') {
        const newProviderObj: Partial<TrainingProvider> = {
          id: generatedId,
          companyName: companyName || fullName,
          email: email,
          phone: cleanPhone,
          address: companyAddress || 'غزة، فلسطين',
          description: companyDesc || 'شريك منصة ترينوفا لتأهيل المبتكرين والطلاب الجامعيين.',
          isVerified: false,
          logoColor: 'from-blue-600 to-indigo-500' // Base default color
        };
        onRegisterProvider(newProviderObj);
        setSuccessMsg(t.regSuccess);
        setTimeout(() => {
          onLoginSuccess(generatedId, 'provider');
        }, 1200);
      }
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 overflow-hidden bg-slate-50 font-sans">
      
      {/* BRAND & VISUAL DEEP NAVY LEFT (RIGHT IN RTL) SIDEBAR */}
      <div className="lg:col-span-5 bg-gradient-to-br from-[#0B132B] via-[#101F42] to-[#1C2541] text-white p-8 lg:p-12 flex flex-col justify-between relative relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.1),transparent_50%)] z-0"></div>
        <div className="absolute inset-x-0 bottom-0 top-1/2 bg-[radial-gradient(ellipse_at_bottom,rgba(99,102,241,0.12),transparent_75%)] z-0"></div>

        {/* Header Branding with Language switcher */}
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/10 border border-indigo-400/30 rounded-xl shadow-inner flex items-center justify-center">
              {/* Specialized Interactive Trainova Premium Logo Icon */}
              <svg className="h-6 w-6 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-sky-200 to-indigo-300">
                  {t.appName}
                </h1>
                <span className="text-[9px] uppercase font-mono bg-indigo-400/10 text-indigo-300 px-1 border border-indigo-400/20 rounded">
                  v2.0
                </span>
              </div>
              <p className="text-[10px] text-slate-300">{lang === 'ar' ? 'منظومة التدريب لجامعات غزة' : 'Gaza Unified Internship Portal'}</p>
            </div>
          </div>

          <button
            onClick={() => onChangeLang(lang === 'ar' ? 'en' : 'ar')}
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-sm transition"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
          </button>
        </div>

        {/* Feature Highlights Showcase with Animation */}
        <div className="my-12 lg:my-0 space-y-8 z-10 max-w-md">
          <div className="space-y-3">
            <span className="text-xs uppercase font-semibold text-sky-400 tracking-wider">
              {t.appSubtitle}
            </span>
            <h2 className="text-2xl lg:text-3xl font-bold font-sans tracking-tight leading-snug">
              {lang === 'ar' ? 'مهندسو ومبدعو غزة بجهوزية للغد' : 'Empowering Tomorrow\'s Tech Leaders'}
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              {t.appDesc}
            </p>
          </div>

          {/* Interactive Feature List Cards */}
          <div className="space-y-4">
            <div className="flex gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.05] transition-all duration-300">
              <div className="h-10 w-10 shrink-0 bg-gradient-to-br from-indigo-500 to-sky-500 rounded-lg flex items-center justify-center text-white shadow-md">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-slate-100">{lang === 'ar' ? 'تنسيق آلي للفرص' : 'AI Opportunity Matching'}</h4>
                <p className="text-slate-400 text-xs mt-1">
                  {lang === 'ar' ? 'ربط مباشر تلقائي مع اهتماماتك بناءً على تخصصك ومعدلك الدراسي.' : 'Direct pairing with companies based on your academic path.'}
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.05] transition-all duration-300">
              <div className="h-10 w-10 shrink-0 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-lg flex items-center justify-center text-slate-100 shadow-md">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-slate-100">{lang === 'ar' ? 'تقارير أسبوعية حية' : 'Live Interactive Reporting'}</h4>
                <p className="text-slate-400 text-xs mt-1">
                  {lang === 'ar' ? 'رفع تقارير الأداء ومراجعتها فاعلياً مع المشرف والجامعة في غضون ثوانٍ.' : 'Track weekly tasks, timesheets, and handle immediate academic feedback.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Brand Endorsement */}
        <div className="z-10 border-t border-slate-800 pt-6 text-slate-500 text-xs flex justify-between items-center bg-white/[0.01] -mx-8 -mb-8 p-8 lg:-mx-12 lg:-mb-12">
          <span>{lang === 'ar' ? '© ٢٠٢٦ منصة ترينوفا غزة' : '© 2026 Trainova Gaza'}</span>
          <span className="flex items-center gap-1 font-semibold text-slate-400">
            {lang === 'ar' ? 'مشروع جامعي معتمد' : 'Authorized Domain'} 🇵🇸
          </span>
        </div>
      </div>

      {/* COMPACT & ELEGANT DYNAMIC FORM CARD RIGHT (LEFT IN RTL) SECTION */}
      <div className="lg:col-span-7 flex flex-col justify-between py-8 px-6 sm:px-12 lg:px-16 overflow-y-auto max-h-screen bg-white">
        
        {/* Simple top intro text */}
        <div className="mb-6 flex justify-between items-center border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">{t.welcomeTitle}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{t.welcomeSubtitle}</p>
          </div>
          <span className="h-2.5 w-2.5 rounded-full bg-indigo-600 animate-pulse" title="Systems Active"></span>
        </div>

        {/* Main interactive form card container */}
        <div className="my-auto max-w-xl w-full mx-auto space-y-6">
          <div className="bg-[#1C2541]/5 p-4 rounded-xl border border-[#1C2541]/10 text-center flex items-center justify-center gap-2">
            {activeTab === 'login' ? <LogIn className="h-4 w-4 text-[#1C2541]" /> : <Sparkles className="h-4 w-4 text-[#1C2541]" />}
            <span className="text-xs font-bold text-[#1C2541] font-sans">
              {activeTab === 'login' 
                ? (lang === 'ar' ? 'بوابة تسجيل الدخول الآمن لمنتسبي منصة ترينوفا' : 'Secure Sign In Portal for Trainova Members')
                : (lang === 'ar' ? 'بوابة التسجيل الذاتي لمنتسبي منصة ترينوفا الجدد' : 'Self-Registration Portal for New Trainova Members')
              }
            </span>
          </div>

          {/* Login / Register Tab Switcher */}
          <div className="flex p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setErrorMsg('');
                setSuccessMsg('');
                if (activeRole === 'admin') setActiveRole('student');
              }}
              className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all duration-200 text-center cursor-pointer ${
                activeTab === 'login'
                  ? 'bg-white text-indigo-950 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {t.loginTab}
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('register');
                setErrorMsg('');
                setSuccessMsg('');
                if (activeRole === 'admin') setActiveRole('student');
              }}
              className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all duration-200 text-center cursor-pointer ${
                activeTab === 'register'
                  ? 'bg-white text-indigo-950 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {t.registerTab}
            </button>
          </div>

          {/* Dual-Level Role Pill Selection bar */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500">
              {activeTab === 'login' 
                ? (lang === 'ar' ? 'حدد مسار الدخول وبوابة الحساب:' : 'Select Portal Access Tier:')
                : (lang === 'ar' ? 'حدد مسار الحساب المراد تسجيله:' : 'Select Account Type to Register:')}
            </label>
            <div className={`grid gap-2 ${activeTab === 'login' ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3'}`}>
              <button
                type="button"
                onClick={() => { setActiveRole('student'); setErrorMsg(''); }}
                className={`py-2 px-3 text-xs font-medium rounded-lg border text-center transition flex flex-col items-center justify-center gap-1 ${
                  activeRole === 'student'
                    ? 'bg-sky-50 border-sky-400 text-sky-950 font-bold shadow-sm shadow-sky-200'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <GraduationCap className={`h-4 w-4 ${activeRole === 'student' ? 'text-sky-500' : 'text-slate-400'}`} />
                <span>{lang === 'ar' ? 'طالب' : 'Student'}</span>
              </button>

              <button
                type="button"
                onClick={() => { setActiveRole('provider'); setErrorMsg(''); }}
                className={`py-2 px-3 text-xs font-medium rounded-lg border text-center transition flex flex-col items-center justify-center gap-1 ${
                  activeRole === 'provider'
                    ? 'bg-indigo-50 border-indigo-400 text-indigo-950 font-bold shadow-sm shadow-indigo-200'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <Building2 className={`h-4 w-4 ${activeRole === 'provider' ? 'text-indigo-500' : 'text-slate-400'}`} />
                <span>{lang === 'ar' ? 'شركة / جهة' : 'Provider'}</span>
              </button>

              <button
                type="button"
                onClick={() => { setActiveRole('supervisor'); setErrorMsg(''); }}
                className={`py-2 px-3 text-xs font-medium rounded-lg border text-center transition flex flex-col items-center justify-center gap-1 ${
                  activeRole === 'supervisor'
                    ? 'bg-rose-50 border-rose-400 text-rose-950 font-bold shadow-sm shadow-rose-200'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <UserCheck className={`h-4 w-4 ${activeRole === 'supervisor' ? 'text-rose-500' : 'text-slate-400'}`} />
                <span>{lang === 'ar' ? 'مشرف' : 'Supervisor'}</span>
              </button>

              {activeTab === 'login' && (
                <button
                  type="button"
                  onClick={() => { setActiveRole('admin'); setErrorMsg(''); }}
                  className={`py-2 px-3 text-xs font-medium rounded-lg border text-center transition flex flex-col items-center justify-center gap-1 ${
                    activeRole === 'admin'
                      ? 'bg-slate-100 border-slate-400 text-slate-950 font-bold shadow-sm shadow-slate-200'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                  title="Admin only supports Login mode"
                >
                  <Shield className={`h-4 w-4 ${activeRole === 'admin' ? 'text-slate-700' : 'text-slate-400'}`} />
                  <span>{lang === 'ar' ? 'إدارة' : 'Admin'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Validation Alert Displays */}
          <AnimatePresence mode="wait">
            {errorMsg && (
              <motion.div 
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs flex items-center gap-2"
              >
                <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                <span>{errorMsg}</span>
              </motion.div>
            )}

            {successMsg && (
              <motion.div 
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="p-3 bg-indigo-50 border border-indigo-200 text-indigo-800 rounded-xl text-xs flex items-center gap-2"
              >
                <CheckCircle2 className="h-4 w-4 text-indigo-500 shrink-0 animate-bounce" />
                <span>{successMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Dynamic Form Area */}
          <form onSubmit={handleFormSubmit} className="space-y-4">
            
            {/* REGISTER ACTIVE: FULL NAME */}
            {activeTab === 'register' && (
              <div className="space-y-1.5 focus-within:text-slate-900 transition text-slate-600">
                <label className="text-xs font-semibold block">{t.fullNameLabel} <span className="text-red-500">*</span></label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 rtl:right-3.5 rtl:left-auto" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={t.fullNamePlaceholder}
                    className="w-full text-sm py-2.5 pl-10 pr-4 rtl:pr-10 rtl:pl-4 bg-white border border-slate-200 focus:border-slate-800 outline-none rounded-xl font-medium placeholder-slate-400 transition"
                  />
                </div>
              </div>
            )}

            {/* REGISTER ACTIVE: PHONE */}
            {activeTab === 'register' && (
              <div className="space-y-1.5 focus-within:text-slate-900 transition text-slate-600 pb-0.5">
                <label className="text-xs font-semibold block">{t.phoneLabel}</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 rtl:right-3.5 rtl:left-auto" />
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder={t.phonePlaceholder}
                    className="w-full text-sm py-2.5 pl-10 pr-4 rtl:pr-10 rtl:pl-4 bg-white border border-slate-200 focus:border-slate-800 outline-none rounded-xl font-medium placeholder-slate-400 transition"
                  />
                </div>
              </div>
            )}

            {/* SHARED FIELD: EMAIL ADDRESS */}
            <div className="space-y-1.5 focus-within:text-slate-900 transition text-slate-600">
              <label className="text-xs font-semibold block">
                {t.emailLabel} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 rtl:right-3.5 rtl:left-auto" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.emailPlaceholder}
                  className="w-full text-sm py-2.5 pl-10 pr-4 rtl:pr-10 rtl:pl-4 bg-white border border-slate-200 focus:border-slate-800 outline-none rounded-xl font-medium placeholder-slate-400 transition"
                />
              </div>
            </div>

            {/* SHARED FIELD: PASSWORD */}
            <div className="space-y-1.5 focus-within:text-slate-900 transition text-slate-600">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold block">
                  {t.passwordLabel} <span className="text-red-500">*</span>
                </label>
                {activeTab === 'login' && (
                  <button type="button" className="text-xs text-slate-500 hover:text-slate-800 hover:underline">
                    {t.forgotPass}
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 rtl:right-3.5 rtl:left-auto" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.passwordPlaceholder}
                  className="w-full text-sm py-2.5 pl-10 pr-4 rtl:pr-10 rtl:pl-4 bg-white border border-slate-200 focus:border-slate-800 outline-none rounded-xl font-medium placeholder-slate-400 transition animate-none"
                />
              </div>
            </div>

            {/* DYNAMIC REGISTER FIELD PACKETS */}
            {activeTab === 'register' && activeRole === 'student' && (
              <div className="p-4 bg-slate-50/70 border border-slate-100 rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-slate-500 font-semibold">{t.studentIdLabel}</label>
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder={t.studentIdPlaceholder}
                    className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg outline-none focus:border-slate-800"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs text-slate-500 font-semibold">{t.uniLabel}</label>
                  <select
                    value={studentUni}
                    onChange={(e: any) => setStudentUni(e.target.value)}
                    className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg outline-none focus:border-slate-800"
                  >
                    <option value="Islamic University">{lang === 'ar' ? 'الجامعة الإسلامية بغزة' : 'Islamic University'}</option>
                    <option value="Al-Azhar University">{lang === 'ar' ? 'جامعة الأزهر' : 'Al-Azhar University'}</option>
                    <option value="Al-Aqsa University">{lang === 'ar' ? 'جامعة الأقصى' : 'Al-Aqsa University'}</option>
                  </select>
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs text-slate-500 font-semibold">{t.majorLabel}</label>
                  <input
                    type="text"
                    value={studentMajor}
                    onChange={(e) => setStudentMajor(e.target.value)}
                    placeholder={t.majorPlaceholder}
                    className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg outline-none focus:border-slate-800"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs text-slate-500 font-semibold">{t.cvLabel}</label>
                  <div className="relative">
                    <FileText className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400 rtl:right-2.5 rtl:left-auto" />
                    <input
                      type="text"
                      value={studentCvName}
                      onChange={(e) => setStudentCvName(e.target.value)}
                      placeholder={t.cvPlaceholder}
                      className="w-full text-xs p-2 pl-8 rtl:pr-8 rtl:pl-2 bg-white border border-slate-200 rounded-lg outline-none focus:border-slate-800"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'register' && activeRole === 'supervisor' && (
              <div className="p-4 bg-slate-50/70 border border-slate-100 rounded-2xl space-y-3">
                <div className="space-y-1">
                  <label className="text-xs text-slate-500 font-semibold">{t.uniLabel}</label>
                  <select
                    value={supervisorUni}
                    onChange={(e: any) => setSupervisorUni(e.target.value)}
                    className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg outline-none focus:border-slate-800"
                  >
                    <option value="Islamic University">{lang === 'ar' ? 'الجامعة الإسلامية بغزة' : 'Islamic University'}</option>
                    <option value="Al-Azhar University">{lang === 'ar' ? 'جامعة الأزهر' : 'Al-Azhar University'}</option>
                    <option value="Al-Aqsa University">{lang === 'ar' ? 'جامعة الأقصى' : 'Al-Aqsa University'}</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-500 font-semibold">{t.deptLabel}</label>
                  <input
                    type="text"
                    value={supervisorDept}
                    onChange={(e) => setSupervisorDept(e.target.value)}
                    placeholder={t.deptPlaceholder}
                    className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg outline-none focus:border-slate-800"
                  />
                </div>
              </div>
            )}

            {activeTab === 'register' && activeRole === 'provider' && (
              <div className="p-4 bg-slate-50/70 border border-slate-100 rounded-2xl space-y-3">
                <div className="space-y-1">
                  <label className="text-xs text-slate-500 font-semibold">{t.companyNameLabel}</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder={t.companyNamePlaceholder}
                    className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg outline-none focus:border-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-500 font-semibold">{t.companyAddressLabel}</label>
                  <div className="relative">
                    <MapPin className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400 rtl:right-2.5" />
                    <input
                      type="text"
                      value={companyAddress}
                      onChange={(e) => setCompanyAddress(e.target.value)}
                      placeholder={t.companyAddressPlaceholder}
                      className="w-full text-xs p-2 pl-8 rtl:pr-8 rtl:pl-2 bg-white border border-slate-200 rounded-lg outline-none focus:border-slate-800"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-500 font-semibold">{t.companyDescLabel}</label>
                  <textarea
                    rows={2}
                    value={companyDesc}
                    onChange={(e) => setCompanyDesc(e.target.value)}
                    placeholder={t.companyDescPlaceholder}
                    className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg outline-none focus:border-slate-800 resize-none"
                  ></textarea>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <button
              type="submit"
              className="w-full py-3 bg-slate-900 border border-slate-800 hover:bg-indigo-700 hover:border-indigo-700 hover:scale-[1.01] text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-md shadow-slate-900/10 active:scale-95 cursor-pointer mt-6"
            >
              {activeTab === 'login' ? <LogIn className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
              <span>{activeTab === 'login' ? t.submitLogin : t.submitRegister}</span>
            </button>
          </form>

          {/* Toggle Link between Login and Register */}
          <div className="text-center pt-1">
            <button
              type="button"
              onClick={() => {
                setActiveTab(activeTab === 'login' ? 'register' : 'login');
                setErrorMsg('');
                setSuccessMsg('');
                if (activeRole === 'admin') setActiveRole('student');
              }}
              className="text-xs text-indigo-600 hover:text-indigo-800 hover:underline font-bold transition cursor-pointer"
            >
              {activeTab === 'login' ? t.dontHaveAccount : t.alreadyHaveAccount}
            </button>
          </div>

          {/* Prompt Info text */}
          <div className="text-center pt-1">
            <span className="text-xs text-slate-400 font-sans">
              {lang === 'ar' 
                ? 'ملاحظة: يتم إصدار وتنسيق الحسابات للمستخدمين حصرياً عبر منسق التدريب الميداني والعمادة.' 
                : 'Note: Accounts are issued and managed exclusively by field training coordinators.'}
            </span>
          </div>
        </div>

        {/* DEMO ACC PANEL DYNAMIC TRAY FOR QUICK REVIEW */}
        <div className="mt-8 border-t border-slate-100 pt-6">
          <div className="bg-gradient-to-tr from-slate-50 to-indigo-50/20 border border-slate-100 p-4 rounded-xl space-y-3 shadow-inner">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-600 shrink-0" />
              <h4 className="text-xs font-bold text-slate-800">
                {t.demoTitle}
              </h4>
            </div>
            <p className="text-[10px] text-slate-500 leading-normal">
              {t.demoDesc}
            </p>
            
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('student')}
                className="p-2 border border-slate-200 hover:border-sky-400 bg-white text-[10px] text-slate-700 hover:text-sky-950 hover:bg-sky-50 rounded-lg flex items-center justify-between text-right font-medium transition cursor-pointer"
              >
                <span>{t.demoRami}</span>
                <ArrowRight className="h-3 w-3 text-slate-400 rtl:rotate-180 shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('supervisor')}
                className="p-2 border border-slate-200 hover:border-rose-400 bg-white text-[10px] text-slate-700 hover:text-rose-950 hover:bg-rose-50 rounded-lg flex items-center justify-between text-right font-medium transition cursor-pointer"
              >
                <span>{t.demoRadwan}</span>
                <ArrowRight className="h-3 w-3 text-slate-400 rtl:rotate-180 shrink-0" />
              </button>

              <div className="relative">
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      handleQuickProviderLogin(e.target.value);
                      e.target.value = "";
                    }
                  }}
                  className="w-full p-2 border border-slate-200 hover:border-indigo-400 bg-white text-[10px] text-slate-700 hover:text-indigo-950 hover:bg-indigo-50 rounded-lg font-medium transition cursor-pointer focus:outline-none appearance-none text-right pr-2 pl-6"
                  defaultValue=""
                >
                  <option value="" disabled>
                    {lang === 'ar' ? '🏢 اختر جهة التدريب لولوجها...' : '🏢 Choose training provider...'}
                  </option>
                  {providers.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.companyName}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 left-2 flex items-center text-slate-400">
                  <ArrowRight className="h-3 w-3 rtl:rotate-180 shrink-0" />
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="p-2 border border-slate-200 hover:border-slate-400 bg-white text-[10px] text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-lg flex items-center justify-between text-right font-medium transition cursor-pointer"
              >
                <span>{t.demoAdmin}</span>
                <ArrowRight className="h-3 w-3 text-slate-400 rtl:rotate-180 shrink-0" />
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
