import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, UserPlus, ShieldCheck, GraduationCap, Building2, Star, Award, BarChart2,
  Settings, RefreshCw, FileSpreadsheet, Download, CheckCircle2, UserCheck, AlertCircle, X
} from 'lucide-react';
import { Student, Supervisor, TrainingProvider, Evaluation, WeeklyReport, Opportunity } from '../types';

interface AdminDashboardProps {
  students: Student[];
  supervisors: Supervisor[];
  providers: TrainingProvider[];
  evaluations: Evaluation[];
  reports: WeeklyReport[];
  opportunities: Opportunity[];
  lang: 'ar' | 'en';
  onUpdateStudentSupervisor: (studentId: string, supervisorId: string) => void;
  onApproveEvaluation: (evaluationId: string) => void;
  onAddStudent: (newStudent: any) => void;
  onAddSupervisor: (newSupervisor: any) => void;
  onApproveSupervisor?: (supervisorId: string) => void;
  onRejectSupervisor?: (supervisorId: string) => void;
}

export default function AdminDashboard({
  students,
  supervisors,
  providers,
  evaluations,
  reports,
  opportunities,
  lang,
  onUpdateStudentSupervisor,
  onApproveEvaluation,
  onAddStudent,
  onAddSupervisor,
  onApproveSupervisor,
  onRejectSupervisor
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'supervisors' | 'approvals'>('overview');

  // Input state for assigning supervisor
  const [assigningStudentId, setAssigningStudentId] = useState<string>('');
  const [assignedSupervisorId, setAssignedSupervisorId] = useState<string>('');
  const [assignSuccess, setAssignSuccess] = useState(false);

  // New Student registration modal states
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [stdName, setStdName] = useState('');
  const [stdId, setStdId] = useState('');
  const [stdEmail, setStdEmail] = useState('');
  const [stdMajor, setStdMajor] = useState('');
  const [stdUni, setStdUni] = useState<'Islamic University' | 'Al-Azhar University' | 'Al-Aqsa University'>('Islamic University');
  const [stdPhone, setStdPhone] = useState('');

  // New Supervisor registration modal states
  const [isAddingSupervisor, setIsAddingSupervisor] = useState(false);
  const [supName, setSupName] = useState('');
  const [supDept, setSupDept] = useState('');
  const [supEmail, setSupEmail] = useState('');
  const [supUni, setSupUni] = useState<'Islamic University' | 'Al-Azhar University' | 'Al-Aqsa University'>('Islamic University');

  // Catalog Report print Simulation variables
  const [isPrinting, setIsPrinting] = useState(false);
  const [printLogs, setPrintLogs] = useState<string[]>([]);

  // Math metrics
  const totalStudents = students.length;
  const totalSupervisors = supervisors.length;
  const totalProviders = providers.length;
  const totalOppsOpen = opportunities.filter(o => o.status === 'active').length;

  // Placement metrics
  const placedCount = evaluations.length;
  const placementRate = totalStudents > 0 ? Math.round((placedCount / totalStudents) * 100) : 0;

  // University counts
  const iugCount = students.filter(s => s.university === 'Islamic University').length;
  const azharCount = students.filter(s => s.university === 'Al-Azhar University').length;
  const aqsaCount = students.filter(s => s.university === 'Al-Aqsa University').length;

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigningStudentId || !assignedSupervisorId) return;
    onUpdateStudentSupervisor(assigningStudentId, assignedSupervisorId);
    setAssignSuccess(true);
    setTimeout(() => {
      setAssignSuccess(false);
      setAssigningStudentId('');
      setAssignedSupervisorId('');
    }, 2500);
  };
/// هذا الجزء مسؤول عن ترتيب العناصر حسب الكونت الأول
  const handleAddStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stdName || !stdId || !stdEmail || !stdMajor) return;
    onAddStudent({
      id: `std-custom-${Date.now()}`,
      name: stdName,
      studentId: stdId,
      universityEmail: stdEmail,
      major: stdMajor,
      university: stdUni,
      phone: stdPhone || '0599000000',
      supervisorId: null
    });

    // Reset fields
    setStdName('');
    setStdId('');
    setStdEmail('');
    setStdMajor('');
    setStdPhone('');
    setIsAddingStudent(false);
  };

  const handleAddSupervisorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supName || !supEmail || !supDept) return;
    onAddSupervisor({
      id: `sup-custom-${Date.now()}`,
      name: supName,
      universityEmail: supEmail,
      university: supUni,
      department: supDept
    });

    // Reset fields
    setSupName('');
    setSupDept('');
    setSupEmail('');
    setIsAddingSupervisor(false);
  };

  // Simulate PDF Report Generation
  const triggerPdfGeneration = () => {
    setIsPrinting(true);
    setPrintLogs([]);
    const logs = [
      lang === 'ar' ? '🔍 بدء جمع بيانات التدريب الميداني لجامعات قطاع غزة...' : '🔍 Fetching field logs...',
      lang === 'ar' ? '📈 احتساب متوسطات الأداء للفصل التدريبي الحالي...' : '📈 Evaluating grade dynamics...',
      lang === 'ar' ? '🏢 تجميع إحصائيات شركة جوال، أوريدو، ومجمعات الشفاء الطبي...' : '🏢 Consolidating corporate indices...',
      lang === 'ar' ? '✅ تصدير وثيقة التقرير الإحصائي الشامل ومقاييس الأداء الميداني بنجاح!' : '✅ PDF document created successfully!'
    ];

    logs.forEach((log, idx) => {
      setTimeout(() => {
        setPrintLogs(prev => [...prev, log]);
        if (idx === logs.length - 1) {
          setTimeout(() => setIsPrinting(false), 2000);
        }
      }, (idx + 1) * 900);
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased text-slate-800 pb-12" id="admin-portal-container font-sans">
      
      {/* Admin Hero Header */}
      <div className="bg-slate-900 border-b border-slate-950 py-6 px-4 sm:px-6 lg:px-8 text-white shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex gap-4 items-center text-right font-sans">
            <div className="bg-emerald-500 text-slate-900 h-14 w-14 rounded-2xl flex items-center justify-center font-extrabold text-2xl shadow-lg border border-emerald-400">
              U
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">{lang === 'ar' ? 'بوابة عمادة الشؤون الأكاديمية والتسجيل' : 'University Administration Bureau'}</h1>
                <span className="text-[10px] bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full font-bold border border-emerald-500/20 uppercase">
                  {lang === 'ar' ? 'شريحة التحكيم العام' : 'ROOT DEAN ACCESS'}
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-1">
                {lang === 'ar' ? 'تنسيق متكامل وتدقيق الدرجات لجامعة الأزهر، الجامعة الإسلامية، وجامعة الأقصى.' : 'Consolidated portal for Gaza Universities internship alignments & outputs.'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 p-1 bg-slate-850 rounded-lg w-full md:w-auto text-xs">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 md:flex-initial px-4 py-2.5 rounded-md font-semibold transition ${
                activeTab === 'overview' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              {lang === 'ar' ? 'لوحة تحليلات غزة' : 'Gaza Analytics'}
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`flex-1 md:flex-initial px-4 py-2.5 rounded-md font-semibold transition ${
                activeTab === 'students' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              {lang === 'ar' ? 'إدارة شؤون الطلاب' : 'Interns Alignment'}
            </button>
            <button
              onClick={() => setActiveTab('supervisors')}
              className={`flex-1 md:flex-initial px-4 py-2.5 rounded-md font-semibold transition ${
                activeTab === 'supervisors' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              {lang === 'ar' ? 'أعضاء هيئة الإشراف' : 'Supervisors'}
            </button>
            <button
              onClick={() => setActiveTab('approvals')}
              className={`flex-1 md:flex-initial px-4 py-2.5 rounded-md font-semibold transition relative ${
                activeTab === 'approvals' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>{lang === 'ar' ? 'اعتماد النتائج النهائية' : 'Certify Grades'}</span>
              {evaluations.filter(e => !e.isAdminApproved && e.calculatedGrade !== null).length > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-900 border border-slate-950 text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-black animate-pulse">
                  {evaluations.filter(e => !e.isAdminApproved && e.calculatedGrade !== null).length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Grid wrapper */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 font-sans select-none">
        
        <AnimatePresence mode="wait">
          
          {/* TAB 1: System-wide analytics overview and statistics */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6 text-right"
            >
              {/* Quick statistics cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-205 shadow-xs flex items-center justify-between">
                  <div className="h-11 w-11 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Users className="h-5.5 w-5.5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">{lang === 'ar' ? 'إجمالي طلاب التدريب' : 'Active Interns'}</span>
                    <strong className="text-xl font-bold text-slate-900 font-mono">{totalStudents}</strong>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-205 shadow-xs flex items-center justify-between">
                  <div className="h-11 w-11 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Building2 className="h-5.5 w-5.5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">{lang === 'ar' ? 'الشركات والمستشفيات الشريكة' : 'Registered Corporates'}</span>
                    <strong className="text-xl font-bold text-slate-900 font-mono">{totalProviders}</strong>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-205 shadow-xs flex items-center justify-between">
                  <div className="h-11 w-11 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                    <GraduationCap className="h-5.5 w-5.5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">{lang === 'ar' ? 'هيئة الإشراف المعتمدة' : 'Advisory Faculty'}</span>
                    <strong className="text-xl font-bold text-slate-900 font-mono">{totalSupervisors}</strong>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-205 shadow-xs flex items-center justify-between">
                  <div className="h-11 w-11 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                    <UserCheck className="h-5.5 w-5.5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">{lang === 'ar' ? 'نسبة التحاق الطلاب الحالية' : 'Placement Index'}</span>
                    <strong className="text-xl font-bold text-slate-900 font-mono">{placementRate}%</strong>
                  </div>
                </div>
              </div>

              {/* PDF Print simulation area */}
              <div className="bg-gradient-to-l from-emerald-50 to-teal-50/50 p-5 rounded-xl border border-emerald-100 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-right">
                  <h4 className="font-bold text-emerald-950 text-sm">{lang === 'ar' ? '📥 تصدير تقرير التقييم والمشاركة للفصل التدريبي' : '📥 Extract Aggregate PDF Roster & Performance Analytics'}</h4>
                  <p className="text-xs text-emerald-800/80 leading-relaxed mt-1">
                    {lang === 'ar' 
                      ? 'قم بمحاكاة سحب کتيب الدرجات المعتمدة وتقرير شراكات القطاع الخاص والجامعات بغزة بصيغة PDF قابلة للطباعة.' 
                      : 'Download clean consolidated spreadsheet summaries for administrative records and stakeholders.'
                    }
                  </p>
                </div>

                <div className="shrink-0">
                  <button
                    onClick={triggerPdfGeneration}
                    disabled={isPrinting}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-5 rounded-lg text-xs transition flex items-center gap-1.5 shadow"
                  >
                    <Download className="h-4 w-4" />
                    <span>{isPrinting ? (lang === 'ar' ? 'جاري التوليد...' : 'Extracting...') : (lang === 'ar' ? 'توليد التقرير الشامل' : 'Generate PDF Catalog')}</span>
                  </button>
                </div>
              </div>

              {/* Simulation logs print window */}
              {isPrinting && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-slate-900 text-emerald-400 font-mono text-[11px] p-4 rounded-lg border border-slate-950 space-y-1 select-text shadow-inner"
                >
                  {printLogs.map((log, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-slate-600">{`>`}</span>
                      <span>{log}</span>
                    </div>
                  ))}
                </motion.div>
              )}

              {/* SVG Charts section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 1. Chart: University distribution metrics */}
                <div className="bg-white p-5 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-slate-900 text-sm border-b pb-2 mb-4 flex items-center gap-2 justify-end">
                    <BarChart2 className="h-4.5 w-4.5 text-indigo-500" />
                    <span>{lang === 'ar' ? 'أعداد طلاب التدريب حسب جامعات قطاع غزة' : 'Interns Distribution by Gaza Universities'}</span>
                  </h4>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-8 py-4 select-text">
                    {/* SVG Pie/Arc visualization */}
                    <div className="relative w-36 h-36">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 42 42">
                        <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#e2e8f0" strokeWidth="4" />
                        
                        {/* 1. Islamic Uni (slice size matches percentage, e.g. 50%) */}
                        <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#059669" strokeWidth="5.5" 
                                strokeDasharray="50 50" strokeDashoffset="0" />
                        
                        {/* 2. Al-Azhar (e.g. 25%) */}
                        <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#4f46e5" strokeWidth="5.5" 
                                strokeDasharray="25 75" strokeDashoffset="-50" />

                        {/* 3. Al-Aqsa (e.g. 25%) */}
                        <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#e11d48" strokeWidth="5.5" 
                                strokeDasharray="25 75" strokeDashoffset="-75" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white rounded-full m-3 shadow-xs">
                        <strong className="text-lg font-extrabold text-slate-900 font-mono">{totalStudents}</strong>
                        <span className="text-[9px] text-slate-400 font-sans uppercase">{lang === 'ar' ? 'طالب وطالبة' : 'students'}</span>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs text-slate-600">
                      <div className="flex items-center gap-2 justify-end">
                        <span>{lang === 'ar' ? `الجامعة الإسلامية بغزة (${iugCount})` : `Islamic Uni (${iugCount})`}</span>
                        <span className="w-3.5 h-3.5 rounded bg-emerald-600" />
                      </div>
                      <div className="flex items-center gap-2 justify-end">
                        <span>{lang === 'ar' ? `جامعة الأزهر - غزة (${azharCount})` : `Al-Azhar Uni (${azharCount})`}</span>
                        <span className="w-3.5 h-3.5 rounded bg-indigo-600" />
                      </div>
                      <div className="flex items-center gap-2 justify-end">
                        <span>{lang === 'ar' ? `جامعة الأقصى (${aqsaCount})` : `Al-Aqsa Uni (${aqsaCount})`}</span>
                        <span className="w-3.5 h-3.5 rounded bg-rose-600" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Chart: Grade Range analytics */}
                <div className="bg-white p-5 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-slate-900 text-sm border-b pb-2 mb-4 flex items-center gap-2 justify-end">
                    <Star className="h-4.5 w-4.5 text-amber-500" />
                    <span>{lang === 'ar' ? 'مقاييس متوسط العلامات والاعتماد التدريبي' : 'Cumulative Grades Breakdown & Statuses'}</span>
                  </h4>

                  {/* Geometric bar visualization */}
                  <div className="space-y-4 py-2 select-text">
                    <div>
                      <div className="flex justify-between items-center text-xs mb-1">
                        <span className="text-slate-500">{lang === 'ar' ? 'الطلاب المستكملين وجرى تصديق شهاداتهم' : 'Certified & Grade Approved'}</span>
                        <strong className="font-bold text-slate-800 font-mono">
                          {evaluations.filter(e => e.isAdminApproved).length} {lang === 'ar' ? 'طالب' : 'interns'}
                        </strong>
                      </div>
                      <div className="w-full h-3 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                        <div className="bg-emerald-600 h-full transition-all" style={{ width: `${evaluations.length > 0 ? (evaluations.filter(e => e.isAdminApproved).length / evaluations.length) * 100 : 0}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center text-xs mb-1">
                        <span className="text-slate-500">{lang === 'ar' ? 'قيد المراجعة الفنية وتقييم اللجنة الأكاديمية' : 'Pending Academic Jury Defence'}</span>
                        <strong className="font-bold text-slate-800 font-mono">
                          {evaluations.filter(e => !e.isAdminApproved).length} {lang === 'ar' ? 'طالب' : 'interns'}
                        </strong>
                      </div>
                      <div className="w-full h-3 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                        <div className="bg-amber-500 h-full transition-all" style={{ width: `${evaluations.length > 0 ? (evaluations.filter(e => !e.isAdminApproved).length / evaluations.length) * 100 : 0}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center text-xs mb-1">
                        <span className="text-slate-500">{lang === 'ar' ? 'نسبة الالتزام ومشر كفاءة الحضور الميداني' : 'Trainee Attendance & Professional Commitment index'}</span>
                        <strong className="font-bold text-emerald-700 font-mono">94%</strong>
                      </div>
                      <div className="w-full h-3 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                        <div className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full transition-all" style={{ width: '94%' }} />
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* TAB 2: Manage Student credentials, view details, assign academic supervisor */}
          {activeTab === 'students' && (
            <motion.div
              key="students-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6 text-right"
            >
              <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 flex-wrap gap-2">
                <div className="text-right">
                  <h3 className="font-bold text-slate-900">{lang === 'ar' ? 'تنسيق شؤون الطلاب وربط المشرفين الأكاديميين' : 'Gaza Interns Directory & Faculty Alignment'}</h3>
                  <p className="text-[11px] text-slate-400">{lang === 'ar' ? 'تسجيل الطلاب الجدد وتدارك ربطهم مع موجهي هيئة التدريب والأستاذ المشرف لكل فرع.' : 'Add new students to the roster and associate them with available academic advisors.'}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setIsAddingStudent(!isAddingStudent)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg text-xs transition shadow flex items-center gap-1.5"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>{lang === 'ar' ? 'تسجيل طالب جديد' : 'Enroll New Intern'}</span>
                  </button>
                </div>
              </div>

              {/* Collapsible Student Addition Form */}
              {isAddingStudent && (
                <motion.form 
                  onSubmit={handleAddStudentSubmit}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="bg-white p-5 rounded-xl border border-emerald-200 space-y-4 shadow-sm"
                >
                  <h4 className="font-bold text-emerald-950 text-xs border-b pb-1 flex items-center gap-1.5 justify-end">
                    <UserPlus className="h-4 w-4 text-emerald-600" />
                    <span>{lang === 'ar' ? 'تعبئة كرت الطالب الجديد بالمنصة' : 'Interactive Registrations Input'}</span>
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">{lang === 'ar' ? 'اسم الطالب الكامل ثنائياً أو ثلاثياً:' : 'Full Name'}</label>
                      <input
                        type="text" value={stdName} onChange={(e) => setStdName(e.target.value)}
                        placeholder="مثال: يوسف محمود عجور"
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-right"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">{lang === 'ar' ? 'الرقم الجامعي الصادر عن قضايا الطلاب:' : 'Student registration ID'}</label>
                      <input
                        type="text" value={stdId} onChange={(e) => setStdId(e.target.value)}
                        placeholder="مثال: 120204321"
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-right font-mono"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">{lang === 'ar' ? 'تخصص الطالب المعتمد بكشف الكلية:' : 'Major path'}</label>
                      <input
                        type="text" value={stdMajor} onChange={(e) => setStdMajor(e.target.value)}
                        placeholder="مثال: علم الحاسوب وتحليل النظم"
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-right"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">{lang === 'ar' ? 'الجامعة المقيد بها غزة:' : 'Gaza University'}</label>
                      <select
                        value={stdUni} onChange={(e) => setStdUni(e.target.value as any)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="Islamic University">الجامعة الإسلامية بغزة (IUG)</option>
                        <option value="Al-Azhar University">جامعة الأزهر ب غزة (Al-Azhar)</option>
                        <option value="Al-Aqsa University">جامعة الأقصى (Al-Aqsa)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">{lang === 'ar' ? 'بريد الطالب الجامعي (@domain.edu.ps):' : 'Official student email'}</label>
                      <input
                        type="email" value={stdEmail} onChange={(e) => setStdEmail(e.target.value)}
                        placeholder="y.ajjour@student.iugaza.edu.ps"
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-emerald-500 text-left font-mono"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">{lang === 'ar' ? 'جوال الاتصال للتنسيق المباشر:' : 'Mobile phone context'}</label>
                      <input
                        type="text" value={stdPhone} onChange={(e) => setStdPhone(e.target.value)}
                        placeholder="0599112233"
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-left font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button" onClick={() => setIsAddingStudent(false)}
                      className="bg-slate-100 text-slate-700 font-medium px-4 py-2 rounded-lg text-xs"
                    >
                      {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      className="bg-emerald-600 text-white font-bold px-6 py-2 rounded-lg text-xs shadow-sm hover:bg-emerald-700 transition"
                    >
                      {lang === 'ar' ? 'تسجيل وتثبيت الطالب' : 'Save registration'}
                    </button>
                  </div>
                </motion.form>
              )}

              {/* Interactive Supervisor Assignment form */}
              <div className="bg-white p-5 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 text-xs border-b pb-2 mb-4 flex items-center gap-1.5 justify-end">
                  <Settings className="h-4.5 w-4.5 text-indigo-505" />
                  <span>{lang === 'ar' ? 'تعديل أو تعيين المشرف الأكاديمي للطلاب' : 'Reassign Academic Adviser'}</span>
                </h4>

                <form onSubmit={handleAssignSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end select-text">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">{lang === 'ar' ? '١. حدد طالب من الغرفة الطلابية:' : '1. Choose student'}</label>
                    <select
                      value={assigningStudentId}
                      onChange={(e) => {
                        const sId = e.target.value;
                        setAssigningStudentId(sId);
                        const currentS = students.find(s => s.id === sId);
                        if (currentS) {
                          setAssignedSupervisorId(currentS.supervisorId || '');
                        }
                      }}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-right"
                      required
                    >
                      <option value="">-- {lang === 'ar' ? 'اختر الطالب' : 'Select Intern'} --</option>
                      {students.map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({s.studentId})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">{lang === 'ar' ? '٢. حدد المشرف الأكاديمي المسؤول:' : '2. Associate supervisor adviser'}</label>
                    <select
                      value={assignedSupervisorId}
                      onChange={(e) => setAssignedSupervisorId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-right"
                      required
                    >
                      <option value="">-- {lang === 'ar' ? 'اختر الاستاذ المشرف' : 'Associate Academic Supervisor'} --</option>
                      {supervisors.map(sup => (
                        <option key={sup.id} value={sup.id}>{sup.name} ({sup.university === 'Islamic University' ? 'الإسلامية' : 'الأزهر'})</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    {assignSuccess && (
                      <div className="bg-emerald-50 text-emerald-800 p-1.5 text-[10px] rounded border text-center animate-pulse">
                        {lang === 'ar' ? 'تم حفظ التحديث وتثبيت التعيين بنجاح!' : 'Relationship updated!'}
                      </div>
                    )}
                    <button
                      type="submit"
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-lg text-xs transition"
                    >
                      {lang === 'ar' ? 'تحديث وتثبيت علاقة الإشراف' : 'Update Alignment Link'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Students directory table */}
              <div className="bg-white rounded-xl border border-slate-205 overflow-x-auto shadow-xs select-text">
                <table className="w-full text-right border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold">
                      <th className="p-4">{lang === 'ar' ? 'اسم الطالب الرقم الجامعي' : 'Intern details'}</th>
                      <th className="p-4">{lang === 'ar' ? 'الكلية والتخصص' : 'University & Major'}</th>
                      <th className="p-4">{lang === 'ar' ? 'بريد الاتصال' : 'E-mail'}</th>
                      <th className="p-4">{lang === 'ar' ? 'المشرف الأكاديمي المتابع' : 'Associated Advising Faculty'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150">
                    {students.map(s => {
                      const sup = supervisors.find(x => x.id === s.supervisorId);
                      return (
                        <tr key={s.id} className="hover:bg-slate-50 transition">
                          <td className="p-4 font-bold text-slate-900">
                            <div>{s.name}</div>
                            <span className="font-mono text-[10px] text-slate-400 block">{s.studentId}</span>
                          </td>
                          <td className="p-4 text-slate-600">
                            <div>{s.major}</div>
                            <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-indigo-700 font-bold inline-block mt-0.5">
                              {s.university === 'Islamic University' ? 'الجامعة الإسلامية بغزة' : s.university === 'Al-Azhar University' ? 'جامعة الأزهر' : 'جامعة الأقصى'}
                            </span>
                          </td>
                          <td className="p-4 font-mono text-slate-500">{s.universityEmail}</td>
                          <td className="p-4">
                            {sup ? (
                              <span className="text-emerald-800 font-bold bg-emerald-50 px-2 py-1 rounded inline-block">
                                {sup.name}
                              </span>
                            ) : (
                              <span className="text-rose-700 bg-rose-50 px-2 py-1 rounded inline-block text-[10px]">
                                {lang === 'ar' ? '⚠️ غير معين بعد - استخدام الاداة اعلاه' : '⚠️ No adviser associated'}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* TAB 3: Faculty Supervisors list management */}
          {activeTab === 'supervisors' && (
            <motion.div
              key="supervisors-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6 text-right"
            >
              <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200">
                <div className="text-right">
                  <h3 className="font-bold text-slate-900">{lang === 'ar' ? 'إدارة أعضاء الهيئة التدريسية المشرفين' : 'Academic Advisory Faculty'}</h3>
                  <p className="text-[11px] text-slate-400">{lang === 'ar' ? 'رصد وتحديث بيانات طاقم الإشراف الأكاديمي لجامعات غزة وتفويض مهام مراجعة الأنشطة للطلبة.' : 'Monitor total assigned student loads per faculty representative.'}</p>
                </div>

                <button
                  onClick={() => setIsAddingSupervisor(!isAddingSupervisor)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg text-xs transition shadow flex items-center gap-1.5"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>{lang === 'ar' ? 'إضافة مشرف أكاديمي' : 'Add Academic supervisor'}</span>
                </button>
              </div>

              {/* Collapsible Supervisor form */}
              {isAddingSupervisor && (
                <motion.form 
                  onSubmit={handleAddSupervisorSubmit}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="bg-white p-5 rounded-xl border border-emerald-200 space-y-4 shadow-sm"
                >
                  <h4 className="font-bold text-emerald-950 text-xs border-b pb-1 flex items-center gap-1.5 justify-end">
                    <UserPlus className="h-4 w-4 text-emerald-600" />
                    <span>{lang === 'ar' ? 'تعبئة كرت المشرف الأكاديمي الجديد بالمنصة' : 'Interactive Registrations Input'}</span>
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">{lang === 'ar' ? 'اسم المشرف الكامل (من قضايا الموظفين):' : 'Full Name'}</label>
                      <input
                        type="text" value={supName} onChange={(e) => setSupName(e.target.value)}
                        placeholder="مثال: د. كمال غانم"
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-right"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">{lang === 'ar' ? 'القسم الأكاديمي / الكلية التابع لها المشرف:' : 'Department path'}</label>
                      <input
                        type="text" value={supDept} onChange={(e) => setSupDept(e.target.value)}
                        placeholder="مثال: قسم التمريض والعناية"
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-right"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">{lang === 'ar' ? 'الجامعة المنتمي لها بالمحاكاة:' : 'University associated'}</label>
                      <select
                        value={supUni} onChange={(e) => setSupUni(e.target.value as any)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="Islamic University">الجامعة الإسلامية بغزة (IUG)</option>
                        <option value="Al-Azhar University">جامعة الأزهر ب غزة (Al-Azhar)</option>
                        <option value="Al-Aqsa University">جامعة الأقصى (Al-Aqsa)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">{lang === 'ar' ? 'بريد الأستاذ الأكاديمي المتابع (@domain.edu.ps):' : 'Supervisor email'}</label>
                      <input
                        type="email" value={stdEmail} onChange={(e) => setStdEmail(e.target.value)}
                        placeholder="aradwan@iugaza.edu.ps"
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-emerald-500 text-left font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button" onClick={() => setIsAddingSupervisor(false)}
                      className="bg-slate-100 text-slate-700 font-medium px-4 py-2 rounded-lg text-xs"
                    >
                      {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      className="bg-emerald-600 text-white font-bold px-6 py-2 rounded-lg text-xs shadow-sm hover:bg-emerald-700 transition"
                    >
                      {lang === 'ar' ? 'تسجيل وتفويض المشرف' : 'Confirm Advisor'}
                    </button>
                  </div>
                </motion.form>
              )}

              {/* Pending Supervisors Approval Section */}
              {supervisors.some(sup => sup.isPendingApproval) && (
                <div className="space-y-4 bg-amber-50/30 p-5 rounded-xl border border-amber-200">
                  <h4 className="font-bold text-amber-900 text-xs flex items-center gap-2 justify-end">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <span>{lang === 'ar' ? 'طلبات تسجيل المشرفين الأكاديميين الجدد (بانتظار موافقة الإدارة)' : 'New Supervisor Registration Requests (Awaiting Dean Approval)'}</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {supervisors.filter(sup => sup.isPendingApproval).map(sup => (
                      <div key={sup.id} className="bg-white p-4 rounded-xl border border-amber-200 shadow-xs flex flex-col justify-between">
                        <div className="text-right">
                          <div className="flex justify-between items-center text-xs pb-1.5 border-b mb-2">
                            <span className="text-[9px] bg-amber-100 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded font-bold">
                              {lang === 'ar' ? 'طلب جديد معلق' : 'Pending Request'}
                            </span>
                            <span className="text-slate-400 font-mono text-[10px]">ID: {sup.id}</span>
                          </div>
                          <h5 className="font-bold text-slate-900 text-sm">{sup.name}</h5>
                          <p className="text-xs text-slate-500 mt-1">{sup.department}</p>
                          <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-indigo-700 font-bold inline-block mt-1">
                            {sup.university === 'Islamic University' ? 'الجامعة الإسلامية بغزة' : sup.university === 'Al-Azhar University' ? 'جامعة الأزهر' : 'جامعة الأقصى'}
                          </span>
                          <span className="font-mono text-[11px] text-slate-400 block mt-2 text-left">{sup.universityEmail}</span>
                        </div>
                        
                        <div className="flex gap-2 mt-4 pt-3 border-t border-slate-100 justify-end">
                          <button
                            type="button"
                            onClick={() => onRejectSupervisor && onRejectSupervisor(sup.id)}
                            className="bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs px-3.5 py-1.5 rounded-lg transition cursor-pointer"
                          >
                            {lang === 'ar' ? 'رفض الطلب' : 'Reject'}
                          </button>
                          <button
                            type="button"
                            onClick={() => onApproveSupervisor && onApproveSupervisor(sup.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-1.5 rounded-lg transition shadow-sm cursor-pointer"
                          >
                            {lang === 'ar' ? 'قبول واعتماد' : 'Approve & Accept'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* supervisors deck */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5 justify-end mt-2">
                  <GraduationCap className="h-4 w-4 text-emerald-600" />
                  <span>{lang === 'ar' ? 'أعضاء هيئة الإشراف الأكاديمي المعتمدين' : 'Approved University Supervisors & Faculty'}</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {supervisors.filter(sup => !sup.isPendingApproval).map(sup => {
                    const assignedCount = students.filter(s => s.supervisorId === sup.id).length;
                    return (
                      <div key={sup.id} className="bg-white p-5 rounded-xl border border-slate-205 hover:border-emerald-400 hover:shadow-sm transition select-text">
                        <div className="flex justify-between items-center text-xs pb-2 border-b">
                          <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-indigo-700 font-bold">
                            {sup.university === 'Islamic University' ? 'الجامعة الإسلامية' : sup.university === 'Al-Azhar University' ? 'جامعة الأزهر' : 'جامعة الأقصى'}
                          </span>
                          <span className="text-slate-400 font-mono">ID: {sup.id}</span>
                        </div>

                        <h4 className="font-bold text-slate-900 text-sm mt-3">{sup.name}</h4>
                        <p className="text-xs text-slate-500">{sup.department}</p>
                        <span className="font-mono text-[11px] text-slate-400 block mt-2 text-left">{sup.universityEmail}</span>

                        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                          <span>{lang === 'ar' ? 'الطلاب المشرف عليهم:' : 'Assigned Intern Load:'}</span>
                          <strong className="text-indigo-805 bg-indigo-50/50 rounded px-2 text-sm font-mono border border-indigo-150">
                            {assignedCount} {lang === 'ar' ? 'طلاب' : 'interns'}
                          </strong>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 4: Final grading review and official university certification */}
          {activeTab === 'approvals' && (
            <motion.div
              key="approvals-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-white rounded-xl border border-slate-200 shadow-xs text-right"
            >
              <div className="px-5 py-4 border-b border-slate-205 bg-slate-50">
                <h3 className="font-bold text-slate-900">{lang === 'ar' ? 'قسم تدقيق واعتماد مخرجات ودرجات التدريب الميداني' : 'Certification and Grade Approvals Bureau'}</h3>
                <p className="text-xs text-slate-400">{lang === 'ar' ? 'مراجعة وتوثيق تقارير الحضور الميداني (من ٥٠٪) والتقييم والبحث الأكاديمي (من ٥٠٪) للمصادقة المباشرة.' : 'Official Dean registry to authorize and lock finalized student transcripts.'}</p>
              </div>

              {evaluations.length === 0 ? (
                <div className="p-12 text-center text-slate-500">
                  <Award className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                  <p>{lang === 'ar' ? 'لا يوجد استمارات تقييم مسجلة بالمنصة حالياً لتدقيقها.' : 'No evaluations generated in simulated databases yet.'}</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-150 select-text">
                  {evaluations.map(ev => {
                    // Combine score metrics
                    const companyScore = ev.attendance + ev.commitment + ev.technicalSkills + ev.teamwork;
                    const academicScore = ev.reportsScore + ev.finalDefenseScore;
                    const accumulatedSum = companyScore + academicScore;

                    return (
                      <div key={ev.id} className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:bg-slate-50 transition font-sans">
                        
                        <div className="space-y-1 bg-white p-4 rounded-lg border border-slate-200 flex-1 max-w-4xl">
                          <div className="flex items-center gap-2 flex-wrap pb-1.5 border-b mb-2.5">
                            <strong className="text-slate-950 font-bold text-sm block">{ev.studentName}</strong>
                            <span className="text-[10px] bg-slate-100 text-indigo-700 border px-1.5 py-0.5 rounded font-bold">
                              {ev.studentUniversity === 'Islamic University' ? 'الجامعة الإسلامية بغزة' : ev.studentUniversity === 'Al-Azhar University' ? 'جامعة الأزهر' : 'جامعة الأقصى'}
                            </span>
                            <span className="text-[10px] text-slate-450 italic font-mono mr-auto">Evaluation ID: {ev.id}</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
                            <div className="bg-slate-50 p-2.5 rounded border border-slate-150 space-y-1">
                              <span className="text-[10px] text-slate-400 block font-bold">{lang === 'ar' ? '🏢 تقييم المهارات العملياتية (الشركة):' : 'Company Scores:'}</span>
                              <strong className="text-indigo-950 block">{companyScore} / 50</strong>
                              <p className="text-[10px] text-slate-450 italic bg-white p-1 rounded mt-1">"{ev.providerNotes}"</p>
                            </div>

                            <div className="bg-slate-50 p-2.5 rounded border border-slate-150 space-y-1">
                              <span className="text-[10px] text-slate-400 block font-bold">{lang === 'ar' ? '🎓 المناقشة ولجنة الأبحاث (الجامعة):' : 'Academic Scores:'}</span>
                              <strong className="text-rose-950 block">{academicScore} / 50</strong>
                              <p className="text-[10px] text-slate-450 italic bg-white p-1 rounded mt-1">"{ev.supervisorNotes}"</p>
                            </div>
                          </div>
                        </div>

                        {/* Approvals Control Badge */}
                        <div className="flex flex-col items-center justify-center gap-2 shrink-0 md:w-52">
                          <div className="text-center bg-slate-100 p-3 rounded-lg border w-full">
                            <span className="text-3xl font-extrabold text-slate-900 font-mono block">
                              {accumulatedSum}
                            </span>
                            <span className="text-[9px] uppercase tracking-widest text-slate-400 block">{lang === 'ar' ? 'العلامة الإجمالية' : 'CUMULATIVE SCORE'}</span>
                          </div>

                          {ev.isAdminApproved ? (
                            <div className="text-center text-emerald-700 bg-emerald-50 border border-emerald-100 p-2 rounded-lg w-full flex items-center justify-center gap-1.5 select-none">
                              <CheckCircle2 className="h-4 w-4 shrink-0" />
                              <span className="text-xs font-bold">{lang === 'ar' ? 'شهادة معتمدة ومقفلة' : 'Certified & Saved'}</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => onApproveEvaluation(ev.id)}
                              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-2.5 px-4 rounded-lg flex items-center justify-center gap-1 shadow-sm transition"
                            >
                              <ShieldCheck className="h-4 w-4" />
                              <span>{lang === 'ar' ? 'اعتماد النتائج وطباعتها' : 'dean authorize & lock'}</span>
                            </button>
                          )}
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
