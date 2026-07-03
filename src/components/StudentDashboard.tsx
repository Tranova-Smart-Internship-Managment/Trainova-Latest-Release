import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, BookOpen, Briefcase, Calendar, CheckCircle2, Clock, FileText, Send, 
  Upload, AlertCircle, Sparkles, MapPin, Building, ChevronRight, GraduationCap,
  MessageSquare, User, BarChart, ShieldAlert, Award, ChevronDown, ChevronUp, RotateCcw
} from 'lucide-react';
import { Student, Opportunity, Application, WeeklyReport, Message, Evaluation, Supervisor, TrainingProvider } from '../types';

interface StudentDashboardProps {
  student: Student;
  opportunities: Opportunity[];
  applications: Application[];
  reports: WeeklyReport[];
  messages: Message[];
  evaluations: Evaluation[];
  supervisors: Supervisor[];
  providers: TrainingProvider[];
  lang: 'ar' | 'en';
  onApply: (oppId: string, cvName: string) => void;
  onSubmitReport: (report: Partial<WeeklyReport>) => void;
  onSendMessage: (receiverId: string, receiverRole: any, content: string) => void;
}

export default function StudentDashboard({
  student,
  opportunities,
  applications,
  reports,
  messages,
  evaluations,
  supervisors,
  providers,
  lang,
  onApply,
  onSubmitReport,
  onSendMessage
}: StudentDashboardProps) {
  // Tab control
  const [activeTab, setActiveTab] = useState<'dashboard' | 'explore' | 'applications' | 'reports' | 'chat' | 'grades'>('dashboard');

  // Search/Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMajor, setSelectedMajor] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('');

  // Selected Opportunity Detail Modal state
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvText, setCvText] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  // New report form states
  const [weekNum, setWeekNum] = useState<number>(3);
  const [hours, setHours] = useState<number>(35);
  const [tasks, setTasks] = useState('');
  const [challenges, setChallenges] = useState('');
  const [attachedFile, setAttachedFile] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);
  const [expandedReportId, setExpandedReportId] = useState<string | null>(null);

  // Chat conversation state
  const [chatPartnerId, setChatPartnerId] = useState<string>('');
  const [newMessage, setNewMessage] = useState('');

  // Find student-specific entities
  const supervisor = supervisors.find(s => s.id === student.supervisorId);
  const studentEval = evaluations.find(e => e.studentId === student.id);
  const myApplications = applications.filter(a => a.studentId === student.id);
  const myReports = reports.filter(r => r.studentId === student.id).sort((a,b) => b.weekNumber - a.weekNumber);
  const myMessages = messages.filter(m => m.senderId === student.id || m.receiverId === student.id);

  // Find unique majors from available opportunities for filters
  const majorsList = Array.from(new Set(opportunities.map(o => o.requiredMajor.split(' / ')[0])));

  // Match active chat partner by default
  const getChatPartners = () => {
    const list: { id: string; name: string; roleLabel: string; role: any }[] = [];
    
    // 1. Add their assigned supervisor
    if (supervisor) {
      list.push({ 
        id: supervisor.id, 
        name: supervisor.name, 
        roleLabel: lang === 'ar' ? 'المشرف الأكاديمي المباشر' : 'Academic Supervisor', 
        role: 'supervisor' 
      });
    }

    // 2. Add Training Provider where they are accepted
    const acceptedApplications = myApplications.filter(a => a.status === 'accepted');
    acceptedApplications.forEach(a => {
      const p = providers.find(prov => prov.id === a.providerId);
      if (p && !list.find(x => x.id === p.id)) {
        list.push({ 
          id: p.id, 
          name: p.companyName, 
          roleLabel: lang === 'ar' ? 'جهة التدريب المقبول بها' : 'Accepted Training Provider', 
          role: 'provider' 
        });
      }
    });

    return list;
  };

  const chatPartners = getChatPartners();
  const activeChatPartner = chatPartners.find(p => p.id === chatPartnerId) || chatPartners[0];

  // Filtered opportunities
  const filteredOpps = opportunities.filter(opp => {
    const matchesSearch = 
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMajor = selectedMajor ? opp.requiredMajor.includes(selectedMajor) : true;
    const matchesProvider = selectedProvider ? opp.providerId === selectedProvider : true;
    return matchesSearch && matchesMajor && matchesProvider;
  });

  // Handle Opportunity apply action
  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOpp) return;
    setIsApplying(true);
    setTimeout(() => {
      onApply(selectedOpp.id, cvText || 'Student_Gaza_CV.pdf');
      setIsApplying(false);
      setSelectedOpp(null);
      setCvText('');
      setActiveTab('applications');
    }, 1000);
  };

  // Handle Weekly report submit action
  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tasks || !challenges) return;
    onSubmitReport({
      studentId: student.id,
      studentName: student.name,
      weekNumber: Number(weekNum),
      reportDate: new Date().toISOString().split('T')[0],
      trainingHours: Number(hours),
      completedTasks: tasks,
      challenges: challenges,
      fileAttachments: attachedFile ? [{ name: attachedFile, url: '#' }] : [],
      submitDate: new Date().toISOString().split('T')[0],
      isLate: false,
      isReviewed: false
    });
    setTasks('');
    setChallenges('');
    setAttachedFile('');
    setReportSuccess(true);
    setTimeout(() => setReportSuccess(false), 4000);
  };

  // Handle Send Chat Message action
  const handleSendMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChatPartner) return;
    onSendMessage(activeChatPartner.id, activeChatPartner.role, newMessage);
    setNewMessage('');
  };

  // Chat window messages specifically between student and activeChatPartner
  const activeConversation = myMessages.filter(
    m => (m.senderId === student.id && m.receiverId === activeChatPartner?.id) ||
         (m.senderId === activeChatPartner?.id && m.receiverId === student.id)
  ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeTab === 'chat' && chatEndRef.current) {
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  }, [activeConversation.length, activeChatPartner?.id, activeTab]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased text-slate-800 pb-12" id="student-portal-container">
      
      {/* Hero Header Area with student credentials */}
      <div className="bg-white border-b border-slate-200 py-6 px-4 sm:px-6 lg:px-8 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex gap-4 items-center">
            <div className="bg-indigo-50 text-indigo-600 h-14 w-14 rounded-full flex items-center justify-center font-bold text-xl border border-indigo-200">
              {student.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-bold text-slate-900">{student.name}</h1>
                <span className="text-xs bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full font-medium">
                  {lang === 'ar' ? 'طالب تدريب نشط' : 'Active Intern'}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-sm text-slate-500 mt-1">
                <span className="flex items-center gap-1">
                  <GraduationCap className="h-4 w-4 text-slate-400" />
                  {student.university === 'Islamic University' ? 'الجامعة الإسلامية بغزة' : student.university === 'Al-Azhar University' ? 'جامعة الأزهر' : 'جامعة الأقصى'}
                </span>
                <span className="text-slate-300">•</span>
                <span>{lang === 'ar' ? 'الرقم الجامعي:' : 'Student ID:'} <strong className="font-mono text-slate-700">{student.studentId}</strong></span>
                <span className="text-slate-300">•</span>
                <span className="text-indigo-700 font-medium">{student.major}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 bg-slate-100 p-1.5 rounded-lg w-full md:w-auto">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex-1 md:flex-initial px-4 py-2 rounded-md text-sm font-medium transition ${
                activeTab === 'dashboard' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {lang === 'ar' ? 'الرئيسية' : 'Overview'}
            </button>
            <button
              onClick={() => setActiveTab('explore')}
              className={`flex-1 md:flex-initial px-4 py-2 rounded-md text-sm font-medium transition ${
                activeTab === 'explore' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {lang === 'ar' ? 'استكشاف الفرص' : 'Explore Opps'}
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`flex-1 md:flex-initial px-4 py-2 rounded-md text-sm font-medium transition relative ${
                activeTab === 'applications' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>{lang === 'ar' ? 'طلباتي' : 'Applications'}</span>
              {myApplications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {myApplications.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`flex-1 md:flex-initial px-4 py-2 rounded-md text-sm font-medium transition ${
                activeTab === 'reports' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {lang === 'ar' ? 'التقرير الأسبوعي' : 'Reports'}
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 md:flex-initial px-4 py-2 rounded-md text-sm font-medium transition relative ${
                activeTab === 'chat' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>{lang === 'ar' ? 'المحادثة' : 'Messages'}</span>
              {myMessages.filter(m => !m.isRead && m.senderId !== student.id).length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold ping">
                  {myMessages.filter(m => !m.isRead && m.senderId !== student.id).length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('grades')}
              className={`flex-1 md:flex-initial px-4 py-2 rounded-md text-sm font-medium transition ${
                activeTab === 'grades' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {lang === 'ar' ? 'الدرجات والتقييم' : 'Grades & Evalu'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">

        {/* Dynamic Display based on activeTab */}
        <AnimatePresence mode="wait">

          {/* TAB 0: Student Dashboard Overview */}
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Dashboard Welcome Header */}
              <div className="bg-gradient-to-l from-indigo-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
                <div className="absolute top-0 left-0 transform -translate-x-12 -translate-y-12 opacity-10">
                  <GraduationCap className="h-64 w-64" />
                </div>
                <div className="relative z-10 max-w-xl text-right">
                  <h2 className="text-xl md:text-2xl font-bold mb-2">
                    {lang === 'ar' ? `مرحباً بك مجدداً، ${student.name} 👋` : `Welcome back, ${student.name} 👋`}
                  </h2>
                  <p className="text-sm text-indigo-200 leading-relaxed">
                    {lang === 'ar' 
                      ? 'بوابة ترينوفا لمتابعة التدريب الميداني والتقييمات الأكاديمية والمهنية. اضغط على أي من البطاقات السريعة أدناه للانتقال للمطلوب مباشرةً.' 
                      : 'Trainova portal for monitoring field training, academic evaluations, and communications. Click on any card below to navigate directly to that section.'}
                  </p>
                </div>
              </div>

              {/* Interactive Dashboard Grid / Quick Actions */}
              <div>
                <h3 className="text-sm font-bold text-slate-500 mb-3 text-right">
                  {lang === 'ar' ? 'بطاقات الوصول السريع والمتابعة المباشرة:' : 'Quick Access & Direct Tracking Cards:'}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Card 1: Supervisor -> goes to chat if assigned */}
                  <div 
                    onClick={() => {
                      if (supervisor) {
                        setActiveTab('chat');
                        setChatPartnerId(supervisor.id);
                      }
                    }}
                    className={`bg-white p-5 rounded-xl border border-slate-200 flex items-center gap-3 text-right group ${
                      supervisor 
                        ? 'cursor-pointer hover:border-indigo-500 hover:shadow-md transition' 
                        : 'opacity-85 cursor-not-allowed'
                    }`}
                  >
                    <div className={`h-11 w-11 rounded-lg flex items-center justify-center transition shrink-0 ${
                      supervisor 
                        ? 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white' 
                        : 'bg-slate-100 text-slate-400'
                    }`}>
                      <User className="h-5.5 w-5.5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium">{lang === 'ar' ? 'المشرف الأكاديمي' : 'Academic Supervisor'}</p>
                      <h4 className="text-sm font-bold text-slate-800 transition mt-0.5">
                        {supervisor?.name || (lang === 'ar' ? 'بانتظار التعيين من الكلية' : 'Awaiting Faculty Assignment')}
                      </h4>
                      {supervisor ? (
                        <span className="text-[10px] text-indigo-600 font-medium underline mt-1 block opacity-0 group-hover:opacity-100 transition">
                          {lang === 'ar' ? 'اضغط لمراسلته 💬' : 'Click to chat 💬'}
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-medium mt-1 block">
                          {lang === 'ar' ? 'يتم التعيين من إدارة الجامعة ⏳' : 'Assigned by university dean ⏳'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card 2: Placement -> goes to explore or applications */}
                  <div 
                    onClick={() => {
                      if (myApplications.length > 0) {
                        setActiveTab('applications');
                      } else {
                        setActiveTab('explore');
                      }
                    }}
                    className="bg-white p-5 rounded-xl border border-slate-200 flex items-center gap-3 cursor-pointer hover:border-indigo-500 hover:shadow-md transition text-right group"
                  >
                    <div className="h-11 w-11 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition shrink-0">
                      <Briefcase className="h-5.5 w-5.5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium">{lang === 'ar' ? 'حالة التدريب الحالية' : 'Active Placement'}</p>
                      <h4 className="text-sm font-bold text-slate-800 group-hover:text-indigo-700 transition mt-0.5">
                        {myApplications.find(a => a.status === 'accepted')?.providerName || (lang === 'ar' ? 'لم تلتحق بمؤسسة بعد' : 'Unplaced')}
                      </h4>
                      <span className="text-[10px] text-indigo-600 font-medium underline mt-1 block opacity-0 group-hover:opacity-100 transition">
                        {lang === 'ar' ? 'اضغط لمتابعة الطلبات 💼' : 'Click to track applications 💼'}
                      </span>
                    </div>
                  </div>

                  {/* Card 3: Reports -> goes to reports */}
                  <div 
                    onClick={() => setActiveTab('reports')}
                    className="bg-white p-5 rounded-xl border border-slate-200 flex items-center gap-3 cursor-pointer hover:border-rose-500 hover:shadow-md transition text-right group"
                  >
                    <div className="h-11 w-11 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition shrink-0">
                      <FileText className="h-5.5 w-5.5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium">{lang === 'ar' ? 'التقارير المقدمة' : 'Weekly Reports'}</p>
                      <h4 className="text-sm font-bold text-slate-800 group-hover:text-rose-700 transition mt-0.5">
                        {myReports.length} {lang === 'ar' ? 'تقارير معتمدة' : 'reports logs'}
                      </h4>
                      <span className="text-[10px] text-rose-600 font-medium underline mt-1 block opacity-0 group-hover:opacity-100 transition">
                        {lang === 'ar' ? 'اضغط لرفع التقارير 📝' : 'Click to submit reports 📝'}
                      </span>
                    </div>
                  </div>

                  {/* Card 4: Grading -> goes to grades */}
                  <div 
                    onClick={() => setActiveTab('grades')}
                    className="bg-white p-5 rounded-xl border border-slate-200 flex items-center gap-3 cursor-pointer hover:border-amber-500 hover:shadow-md transition text-right group"
                  >
                    <div className="h-11 w-11 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition shrink-0">
                      <Award className="h-5.5 w-5.5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium">{lang === 'ar' ? 'الدرجة والاعتماد' : 'Final Grading'}</p>
                      <h4 className="text-sm font-bold text-slate-800 group-hover:text-amber-700 transition mt-0.5">
                        {studentEval?.isAdminApproved 
                          ? `${studentEval.calculatedGrade}/100 (${lang === 'ar' ? 'معتمدة' : 'Approved'})`
                          : (lang === 'ar' ? 'قيد الدراسة والتقييم' : 'Under Assessment')
                        }
                      </h4>
                      <span className="text-[10px] text-amber-600 font-medium underline mt-1 block opacity-0 group-hover:opacity-100 transition">
                        {lang === 'ar' ? 'اضغط لعرض الدرجات والتقييم 🏆' : 'Click to view grades 🏆'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Overview recent activity summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Recent Application status */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 text-right">
                  <h4 className="font-bold text-slate-900 text-sm mb-3 border-b border-slate-100 pb-2">
                    {lang === 'ar' ? 'آخر تحديث لطلباتك:' : 'Latest Applications Status:'}
                  </h4>
                  {myApplications.length === 0 ? (
                    <p className="text-xs text-slate-400 py-4">{lang === 'ar' ? 'لا يوجد طلبات مقدمة حالياً.' : 'No submitted applications.'}</p>
                  ) : (
                    <div className="space-y-3">
                      {myApplications.slice(0, 2).map(app => (
                        <div key={app.id} className="flex justify-between items-center text-xs p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            app.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' :
                            app.status === 'rejected' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {app.status === 'accepted' ? (lang === 'ar' ? 'مقبول' : 'Accepted') :
                             app.status === 'rejected' ? (lang === 'ar' ? 'مرفوض' : 'Rejected') : (lang === 'ar' ? 'قيد المراجعة' : 'Pending')}
                          </span>
                          <div className="text-right">
                            <strong className="text-slate-800 block">{app.opportunityTitle}</strong>
                            <span className="text-[10px] text-slate-400 block">{app.providerName}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Latest Supervisor Message */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 text-right">
                  <h4 className="font-bold text-slate-900 text-sm mb-3 border-b border-slate-100 pb-2">
                    {lang === 'ar' ? 'آخر رسالة واردة:' : 'Latest Received Message:'}
                  </h4>
                  {myMessages.filter(m => m.senderId !== student.id).length === 0 ? (
                    <p className="text-xs text-slate-400 py-4">{lang === 'ar' ? 'لا يوجد رسائل واردة بعد.' : 'No received messages.'}</p>
                  ) : (
                    (() => {
                      const latestIncoming = myMessages.filter(m => m.senderId !== student.id).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
                      return (
                        <div className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-100/50 text-xs">
                          <p className="text-slate-800 font-medium leading-relaxed italic">"{latestIncoming.content}"</p>
                          <span className="block text-[10px] text-emerald-600 mt-2 font-mono">
                            {new Date(latestIncoming.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                      );
                    })()
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 1: Explore Opportunities */}
          {activeTab === 'explore' && (
            <motion.div
              key="explore-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              {/* Search filter deck */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between shadow-xs">
                <div className="relative w-full md:w-96">
                  <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
                    <Search className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={lang === 'ar' ? 'ابحث عن فرصة، شركة، أو مجال...' : 'Search for title, company, keyword...'}
                    className="w-full pr-10 pl-4 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-right"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                  <select
                    value={selectedMajor}
                    onChange={(e) => setSelectedMajor(e.target.value)}
                    className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">{lang === 'ar' ? 'جميع التخصصات' : 'All Majors'}</option>
                    {majorsList.map((m, idx) => (
                      <option key={idx} value={m}>{m}</option>
                    ))}
                  </select>

                  <select
                    value={selectedProvider}
                    onChange={(e) => setSelectedProvider(e.target.value)}
                    className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">{lang === 'ar' ? 'جميع جهات التدريب' : 'All Providers'}</option>
                    {providers.map(p => (
                      <option key={p.id} value={p.id}>{p.companyName}</option>
                    ))}
                  </select>

                  {/* Reset Filters Button */}
                  {(searchQuery || selectedMajor || selectedProvider) && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedMajor('');
                        setSelectedProvider('');
                      }}
                      className="flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg px-3 py-2 text-xs transition border border-indigo-200 font-medium cursor-pointer"
                      title={lang === 'ar' ? 'إعادة ضبط الفلاتر' : 'Reset Filters'}
                    >
                      <RotateCcw className="h-3 w-3" />
                      <span>{lang === 'ar' ? 'إعادة ضبط' : 'Reset'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Opportunities Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredOpps.length === 0 ? (
                  <div className="col-span-2 text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
                    <ShieldAlert className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-slate-500">{lang === 'ar' ? 'لا يوجد فرص تتطابق مع بحثك حالياً.' : 'No opportunities matched your filters.'}</p>
                  </div>
                ) : (
                  filteredOpps.map(opp => {
                    // Check if already applied
                    const alreadyApplied = myApplications.find(a => a.opportunityId === opp.id);
                    const provider = providers.find(p => p.id === opp.providerId);
                    
                    return (
                      <div 
                        key={opp.id}
                        className="bg-white rounded-xl border border-slate-200 p-5 hover:border-emerald-500 hover:shadow-md transition duration-200 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex justify-between items-start gap-3">
                            <div>
                              <span className={`inline-block text-[11px] font-medium px-2 py-0.5 rounded-full mb-2 bg-gradient-to-r ${provider?.logoColor || 'from-slate-600 to-slate-500'} text-white`}>
                                {opp.providerName}
                              </span>
                              <h3 className="text-base font-bold text-slate-950 mt-1">{opp.title}</h3>
                            </div>
                            {alreadyApplied && (
                              <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold ${
                                alreadyApplied.status === 'accepted' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                                alreadyApplied.status === 'rejected' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                                'bg-amber-50 text-amber-700 border border-amber-100'
                              }`}>
                                {alreadyApplied.status === 'accepted' ? (lang === 'ar' ? 'مقبول' : 'Accepted') :
                                 alreadyApplied.status === 'rejected' ? (lang === 'ar' ? 'مرفوض' : 'Rejected') :
                                 (lang === 'ar' ? 'قيد المراجعة' : 'Pending')}
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                            {opp.description}
                          </p>

                          <div className="mt-4 flex flex-wrap gap-1.5">
                            {opp.requiredSkills.map((skill, idx) => (
                              <span key={idx} className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded font-mono">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                          <div className="flex flex-col gap-1">
                            <span className="flex items-center gap-1 text-[11px]">
                              <MapPin className="h-3 w-3 text-slate-400" /> {opp.location}
                            </span>
                            <span className="flex items-center gap-1 text-[11px]">
                              <Clock className="h-3 w-3 text-slate-400" /> {opp.durationWeeks} {lang === 'ar' ? 'أسبوعاً' : 'weeks'}
                            </span>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => setSelectedOpp(opp)}
                              className="px-4 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold Transition"
                            >
                              {lang === 'ar' ? 'التفاصيل / التقديم' : 'Details / Apply'}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          )}

          {/* TAB 2: Applications Tracker */}
          {activeTab === 'applications' && (
            <motion.div
              key="applications-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="px-5 py-4 border-b border-slate-200 bg-slate-50">
                  <h3 className="font-bold text-slate-900">{lang === 'ar' ? 'متابعة طلبات التدريب المرفوعة' : 'My Submitted Applications'}</h3>
                  <p className="text-xs text-slate-400">{lang === 'ar' ? 'قائمة بكافة الفرص التي تقدمت لها والملاحظات والردود المتلقاة من ممثلي الموارد البشرية بغزة.' : 'All applications sent to Gaza corporates with decision outputs.'}</p>
                </div>

                {myApplications.length === 0 ? (
                  <div className="text-center py-12">
                    <Briefcase className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-slate-500">{lang === 'ar' ? 'لم تتقدم لأي فرصة تدريب بعد. تصفح الفرص وقدم الآن.' : 'You have not submitted any applications yet.'}</p>
                    <button
                      onClick={() => setActiveTab('explore')}
                      className="mt-3 inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-4 py-2 rounded-md font-medium"
                    >
                      {lang === 'ar' ? 'استكشف الفرص المتاحة' : 'Discover Opportunities'}
                      <ChevronRight className="h-3 w-3 rotate-180" />
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-150">
                    {myApplications.map(app => {
                      const opp = opportunities.find(o => o.id === app.opportunityId);
                      return (
                        <div key={app.id} className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-slate-50 transition">
                          <div className="space-y-1">
                            <span className="text-[10px] text-slate-400 block">{lang === 'ar' ? `تاريخ التقديم: ${app.appliedDate}` : `Applied: ${app.appliedDate}`}</span>
                            <h4 className="font-bold text-slate-900">{app.opportunityTitle}</h4>
                            <p className="text-xs text-slate-600 flex items-center gap-1">
                              <Building className="h-3 w-3 text-slate-400" />
                              {app.providerName}
                            </p>
                            <span className="inline-block text-[10px] text-slate-500 font-mono bg-slate-150 px-2 py-0.5 rounded">
                              {lang === 'ar' ? `الملف المرفق: ${app.cvName}` : `CV attached: ${app.cvName}`}
                            </span>
                            
                            {/* HR feedback notes */}
                            {app.notes && (
                              <div className="mt-3 p-3 bg-slate-100 border-l-2 border-slate-400 rounded-md text-xs text-slate-600 leading-relaxed max-w-xl">
                                <strong>{lang === 'ar' ? 'ملاحظة مسؤول التدريب:' : 'Provider Note:'}</strong> {app.notes}
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col items-end gap-1.5 w-full md:w-auto self-start md:self-center">
                            <span className={`text-xs px-3 py-1.5 rounded-full font-bold text-center w-32 ${
                              app.status === 'accepted' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                              app.status === 'rejected' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                              'bg-amber-100 text-amber-800 border border-amber-200'
                            }`}>
                              {app.status === 'accepted' ? (lang === 'ar' ? 'مقبول للتدريب' : 'Accepted') :
                               app.status === 'rejected' ? (lang === 'ar' ? 'نعتذر، مرفوض' : 'Declined') :
                               (lang === 'ar' ? 'قيد الدراسة' : 'Under Review')}
                            </span>
                            
                            {app.status === 'accepted' && (
                              <span className="text-[10px] text-emerald-600 font-sans flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3" />
                                {lang === 'ar' ? 'ابدأ بتوثيق تقارير الأسبوعية' : 'Start logging weekly reports'}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* TAB 3: Weekly Reports */}
          {activeTab === 'reports' && (
            <motion.div
              key="reports-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Report submission form */}
              <div className="lg:col-span-1 bg-white p-5 rounded-xl border border-slate-200 h-fit shadow-xs">
                <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                  <FileText className="h-4.5 w-4.5 text-emerald-500" />
                  {lang === 'ar' ? 'رفع تقرير أسبوعي جديد' : 'Submit Weekly Report'}
                </h3>

                <form onSubmit={handleReportSubmit} className="space-y-4 mt-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">{lang === 'ar' ? 'رقم الأسبوع:' : 'Week number'}</label>
                    <select
                      value={weekNum}
                      onChange={(e) => setWeekNum(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm text-right focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map(w => (
                        <option key={w} value={w}>{lang === 'ar' ? `الأسبوع رقم ${w}` : `Week ${w}`}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">{lang === 'ar' ? 'مجموع الساعات التدريبية بالأسبوع:' : 'Total training hours'}</label>
                    <input
                      type="number"
                      value={hours}
                      onChange={(e) => setHours(Number(e.target.value))}
                      min={1}
                      max={60}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm text-right focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">{lang === 'ar' ? 'المهام التي تم إنجازها:' : 'Tasks completed'}</label>
                    <textarea
                      rows={4}
                      value={tasks}
                      onChange={(e) => setTasks(e.target.value)}
                      placeholder={lang === 'ar' ? 'اكتب بالتفصيل ما الذي قمت بالعمل عليه وإنجازه بمؤسسة التدريب...' : 'Detail core achievements, logs, work completed...'}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-right focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">{lang === 'ar' ? 'المشاكل أو التحديات التي واجهتك:' : 'Encountered challenges'}</label>
                    <textarea
                      rows={3}
                      value={challenges}
                      onChange={(e) => setChallenges(e.target.value)}
                      placeholder={lang === 'ar' ? 'صف الصعوبات الفنية واللوجستية وكيف تعاملت معها...' : 'List roadblocks, hard concepts, powercuts countermeasures...'}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-right focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    ></textarea>
                  </div>

                                   {reportSuccess && (
                    <div className="bg-indigo-50 text-indigo-950 text-xs p-3 rounded-lg flex items-center gap-2 border border-indigo-150">
                      <Sparkles className="h-4 w-4 text-indigo-600" />
                      <span>{lang === 'ar' ? 'تم تقديم تقرير الأسبوع بنجاح للمشرف الأكاديمي!' : 'Weekly report submitted to your supervisor successfully!'}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg text-xs transition cursor-pointer"
                  >
                    {lang === 'ar' ? 'تقديم التقرير الأسبوعي المعتمد' : 'Submit Fortnightly Report'}
                  </button>
                </form>
              </div>

              {/* Reports history */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                  <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-3">
                    {lang === 'ar' ? 'سجل التقارير الأسبوعية المقدمة' : 'Submitted Weekly Logs & Comments'}
                  </h3>

                  {myReports.length === 0 ? (
                    <div className="text-center py-12">
                      <Clock className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                      <p className="text-slate-500 text-xs">{lang === 'ar' ? 'لا يوجد تقارير مسجلة في الأرشيف لك حالياً.' : 'Your history is empty.'}</p>
                    </div>
                  ) : (
                    <div className="space-y-4 mt-4">
                      {myReports.map(rep => {
                        const isExpanded = expandedReportId === rep.id;
                        return (
                          <div key={rep.id} className="p-1 rounded-lg bg-slate-50 border border-slate-200 overflow-hidden transition">
                            {/* Accordion clickable header */}
                            <div 
                              onClick={() => setExpandedReportId(isExpanded ? null : rep.id)}
                              className="flex justify-between items-center bg-white p-3 rounded-md cursor-pointer hover:bg-slate-50 transition select-none text-right"
                            >
                              <div className="flex items-center gap-3">
                                {isExpanded ? (
                                  <ChevronUp className="h-4 w-4 text-indigo-600 shrink-0" />
                                ) : (
                                  <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
                                )}
                                <div>
                                  <span className="font-extrabold text-sm text-indigo-700">
                                    {lang === 'ar' ? `الأسبوع رقم [ ${rep.weekNumber} ]` : `Week ${rep.weekNumber}`}
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-mono ml-4 block sm:inline">
                                    {lang === 'ar' ? `بتاريخ: ${rep.reportDate}` : `Submitted: ${rep.reportDate}`}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-500 font-medium">
                                  <strong>{rep.trainingHours}</strong> {lang === 'ar' ? 'ساعة تدريبية' : 'Hrs completed'}
                                </span>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                  rep.isReviewed ? 'bg-indigo-100 text-indigo-800' : 'bg-amber-100 text-amber-800'
                                }`}>
                                  {rep.isReviewed ? (lang === 'ar' ? 'تمت المراجعة' : 'Reviewed') : (lang === 'ar' ? 'في انتظار المراجعة' : 'Pending Review')}
                                </span>
                              </div>
                            </div>

                            {/* Accordion expanded content */}
                            <AnimatePresence initial={false}>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="overflow-hidden bg-slate-50/50"
                                >
                                  <div className="p-4 pt-1 space-y-4 border-t border-slate-100">
                                    <div className="text-xs space-y-2 leading-relaxed text-slate-700">
                                      <div>
                                        <strong className="text-slate-900 block">{lang === 'ar' ? '● ما تم إنجازه:' : '• Work Completed:'}</strong>
                                        <p className="bg-white p-2.5 rounded border border-slate-150 mt-1">{rep.completedTasks}</p>
                                      </div>
                                      <div>
                                        <strong className="text-slate-900 block">{lang === 'ar' ? '● التحديات والحلول:' : '• Countered Obstacles:'}</strong>
                                        <p className="bg-white p-2.5 rounded border border-slate-150 mt-1 text-slate-600">{rep.challenges}</p>
                                      </div>
                                    </div>

                                    {/* File evidence badge */}
                                    {rep.fileAttachments && rep.fileAttachments.length > 0 && (
                                      <div className="flex items-center gap-1 text-[11px] text-slate-500 font-mono bg-indigo-50/50 p-2 rounded max-w-sm">
                                        <FileText className="h-3.5 w-3.5 text-indigo-500" />
                                        <span>{lang === 'ar' ? 'مرفق داعم للمهمة:' : 'Evidence document:'}</span>
                                        <strong className="text-indigo-900 font-semibold underline cursor-pointer">{rep.fileAttachments[0].name}</strong>
                                      </div>
                                    )}

                                    {/* Academic Supervisor feedback panel with calm academic slate/blue borders */}
                                    <div className="p-3.5 rounded-lg bg-indigo-50/60 border-r-4 border-indigo-500 text-xs text-right">
                                      <strong className="text-indigo-950 font-bold block mb-1">
                                        {lang === 'ar' ? `✍️ تعليق المشرف الأكاديمي (${supervisor?.name || 'مراجعة أولية'}):` : `✍️ Academic Feedback (${supervisor?.name || 'Reviewer'}):`}
                                      </strong>
                                      <p className="text-indigo-900/90 leading-relaxed font-sans">
                                        {rep.supervisorFeedback || (lang === 'ar' ? 'بانتظار مراجعة المشرف وإضافة ملاحظات التوجيه والتحسين قريباً.' : 'Pending supervisor evaluation and tips.')}
                                      </p>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 4: Internal Communications */}
          {activeTab === 'chat' && (
            <motion.div
              key="chat-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col md:grid md:grid-cols-3 h-auto md:h-[550px] shadow-xs"
            >
              {/* Partner switcher list */}
              <div className="md:col-span-1 border-l border-slate-200 bg-slate-50 flex flex-col justify-between h-[180px] md:h-full overflow-y-auto">
                <div>
                  <div className="p-4 border-b border-slate-200">
                    <h3 className="font-bold text-slate-900 text-sm">{lang === 'ar' ? 'القنوات والتواصل الداخلي' : 'Channels / Contacts'}</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">{lang === 'ar' ? 'تراسل فوري ومشفر مع الموجهين.' : 'Instant channels with supervisors & institutions.'}</p>
                  </div>
                  
                  <div className="divide-y divide-slate-150">
                    {chatPartners.length === 0 ? (
                      <div className="p-4 text-center text-slate-400 text-xs">
                        <p>{lang === 'ar' ? 'لا توجد قنوات تواصل مفعلة حالياً. يمكنك التراسل فور قبولك في فرصة تدريبية أو تعيين مشرف أكاديمي لك.' : 'No active communication channels yet. You can chat once you are accepted by a training provider or assigned a supervisor.'}</p>
                      </div>
                    ) : (
                      chatPartners.map(partner => {
                        const isActive = activeChatPartner?.id === partner.id;
                        // unread status count
                        const unreadCount = myMessages.filter(m => m.senderId === partner.id && !m.isRead).length;

                        return (
                          <button
                            key={partner.id}
                            onClick={() => setChatPartnerId(partner.id)}
                            className={`w-full text-right p-4 transition flex items-center justify-between ${
                              isActive ? 'bg-indigo-50 border-r-4 border-indigo-600' : 'bg-transparent hover:bg-slate-100'
                            }`}
                          >
                            <div>
                              <h4 className="font-bold text-slate-900 text-xs text-right">{partner.name}</h4>
                              <span className="text-[10px] text-slate-500 block text-right mt-1">{partner.roleLabel}</span>
                            </div>

                            {unreadCount > 0 && (
                              <span className="bg-red-500 text-white font-mono text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                {unreadCount}
                              </span>
                            )}
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>

                <div className="p-3 bg-slate-150 border-t border-slate-200 text-center">
                  <span className="text-[10px] font-mono text-slate-500 block uppercase">
                    {lang === 'ar' ? 'نظام دردشة ترينوفا الداخلي' : 'Trainova Chat System'}
                  </span>
                </div>
              </div>

              {/* Chat View */}
              <div className="md:col-span-2 flex flex-col justify-between h-[400px] md:h-full bg-slate-100 min-h-0">
                {activeChatPartner ? (
                  <>
                    <div className="p-3.5 bg-white border-b border-slate-200 flex justify-between items-center px-5">
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs">{activeChatPartner.name}</h4>
                        <span className="text-[10px] text-indigo-600 font-semibold">{activeChatPartner.roleLabel}</span>
                      </div>
                      <span className="text-[10px] uppercase font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded">
                        {lang === 'ar' ? 'مؤمن ومشفر' : 'secured channel'}
                      </span>
                    </div>

                    {/* Speech Bubbles */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3.5 select-text min-h-0">
                      {activeConversation.length === 0 ? (
                        <div className="text-center py-12 text-slate-400 text-xs">
                          <MessageSquare className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                          <p>{lang === 'ar' ? 'لا توجد رسائل سابقة في هذه القناة. ابدأ التراسل الآن.' : 'Send a friendly message to kickstart the discussion.'}</p>
                        </div>
                      ) : (
                        activeConversation.map(msg => {
                          const isMe = msg.senderId === student.id;
                          return (
                            <div key={msg.id} className={`flex ${isMe ? 'justify-start' : 'justify-end'}`}>
                              <div className={`max-w-md p-3 rounded-lg text-xs leading-relaxed ${
                                isMe 
                                  ? 'bg-indigo-600 text-white rounded-br-none shadow-sm' 
                                  : 'bg-white border border-slate-300 text-slate-800 rounded-bl-none shadow-xs'
                              }`}>
                                <p>{msg.content}</p>
                                <span className={`block text-[8px] mt-1.5 text-right font-mono ${isMe ? 'text-indigo-200' : 'text-slate-400'}`}>
                                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            </div>
                          );
                        })
                      )}
                      <div ref={chatEndRef} />
                    </div>

                    {/* Chat Editor Input */}
                    <form onSubmit={handleSendMessageSubmit} className="p-3 bg-white border-t border-slate-200 flex gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={lang === 'ar' ? `اكتب رسالتك لـ ${activeChatPartner.name}...` : 'Write your message...'}
                        className="flex-1 bg-slate-50 border border-slate-300 text-xs rounded-lg px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-right"
                      />
                      <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg p-2.5 transition flex items-center justify-center shrink-0 w-11 h-11"
                      >
                        <Send className="h-4 w-4 rotate-180" />
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center p-6 text-slate-400">
                    <MessageSquare className="h-10 w-10 text-slate-300 mb-2" />
                    <p className="text-sm">{lang === 'ar' ? 'اختر قناة أو جهة لمحادثتها' : 'Please select a contact to begin.'}</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
          {/* TAB 5: Grades & Evaluations */}
          {activeTab === 'grades' && (
            <motion.div
              key="grades-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
                <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                  <BarChart className="h-5 w-5 text-indigo-500" />
                  {lang === 'ar' ? 'التفاصيل الأكاديمية ونظام احتساب الدرجات' : 'Academic Graduation Grading Summary'}
                </h3>

                {!studentEval ? (
                  <div className="text-center py-12 text-slate-500">
                    <ShieldAlert className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                    <p>{lang === 'ar' ? 'لم يقم مشرفك أو جهة تدريبك بإدخال التقييمات بعد.' : 'No evaluations recorded yet.'}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    {/* Provider evaluation detail */}
                    <div className="p-5 rounded-lg border border-slate-150 bg-slate-50 space-y-4">
                      <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                        <h4 className="font-bold text-slate-900 text-xs">{lang === 'ar' ? '1. تقييم المهارات العملياتية (جهة التدريب)' : '1. Operational Skills (Provider)'}</h4>
                        <span className="text-xs bg-indigo-100 text-indigo-900 font-bold px-2.5 py-0.5 rounded-full font-mono">
                          {studentEval.attendance + studentEval.commitment + studentEval.technicalSkills + studentEval.teamwork} / 50
                        </span>
                      </div>

                      <div className="space-y-3.5 text-xs text-slate-600">
                        <div className="flex justify-between">
                          <span>{lang === 'ar' ? '● الحضور والالتزام بالمواعيد:' : '• Attendance & punctuality:'}</span>
                          <strong className="font-mono text-slate-900">{studentEval.attendance} / 10</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>{lang === 'ar' ? '● الانضباط والتمثيل المهني والمسؤولية:' : '• Professional commitment & responsibility:'}</span>
                          <strong className="font-mono text-slate-900">{studentEval.commitment} / 10</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>{lang === 'ar' ? '● المهارات الفنية والإنتاجية:' : '• Code craftsmanship / technical actions:'}</span>
                          <strong className="font-mono text-slate-900">{studentEval.technicalSkills} / 15</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>{lang === 'ar' ? '● العمل الجماعي ومهارات التواصل:' : '• Peer communication & teamwork:'}</span>
                          <strong className="font-mono text-slate-900">{studentEval.teamwork} / 15</strong>
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded border border-slate-200 text-xs text-slate-500 mt-2">
                        <strong className="text-slate-700 block mb-1">{lang === 'ar' ? '● تعليق جهة الموارد البشرية والتدريب:' : '● Corporate Mentor Remarks:'}</strong>
                        <p className="italic leading-relaxed">"{studentEval.providerNotes}"</p>
                      </div>
                    </div>

                    {/* Academic Supervisor evaluation detail */}
                    <div className="p-5 rounded-lg border border-slate-150 bg-slate-50 space-y-4">
                      <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                        <h4 className="font-bold text-slate-900 text-xs">{lang === 'ar' ? '2. التقييم الأكاديمي والتقرير والشهادة' : '2. Academic / Documentation Score'}</h4>
                        <span className="text-xs bg-rose-100 text-rose-950 font-bold px-2.5 py-0.5 rounded-full font-mono">
                          {studentEval.reportsScore + studentEval.finalDefenseScore} / 50
                        </span>
                      </div>

                      <div className="space-y-3.5 text-xs text-slate-600">
                        <div className="flex justify-between">
                          <span>{lang === 'ar' ? '● علامة جودة ومثابرة رفع التقارير الأسبوعية:' : '• Weekly reports logs standard:'}</span>
                          <strong className="font-mono text-slate-900">{studentEval.reportsScore} / 25</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>{lang === 'ar' ? '● درجة المانقشة والأنشطة البحثية:' : '• Final defense or report jury grade:'}</span>
                          <strong className="font-mono text-slate-900">{studentEval.finalDefenseScore} / 25</strong>
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded border border-slate-200 text-xs text-slate-500 mt-2">
                        <strong className="text-slate-700 block mb-1">{lang === 'ar' ? '● ملاحظات المشرف الفنية والجامعية:' : '● Supervisor Jury Remarks:'}</strong>
                        <p className="italic leading-relaxed">"{studentEval.supervisorNotes}"</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {studentEval && (
                  <div className="mt-6 pt-5 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                    <div className="space-y-1 text-right">
                      <h4 className="font-bold text-slate-900 text-xs">{lang === 'ar' ? 'الدرجة الموزونة النهائية التراكمية' : 'Consolidated Overall Normalized Grade'}</h4>
                      <p className="text-slate-500 text-[11px] leading-relaxed">
                        {lang === 'ar' 
                          ? 'تُجمع الدرجات من 100 تلقائياً (٥٠٪ للمؤسسة و ٥٠٪ للجامعة) وتعتمد رسمياً من عمادة شؤون الطلاب.' 
                          : 'Sum of provider scores (max 50) and university scores (max 50) registered and approved by Student Affairs.'
                        }
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <span className="text-3xl font-extrabold text-emerald-700 font-mono block">
                          {studentEval.calculatedGrade !== null ? studentEval.calculatedGrade : studentEval.attendance + studentEval.commitment + studentEval.technicalSkills + studentEval.teamwork + studentEval.reportsScore + studentEval.finalDefenseScore}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono uppercase">out of 100</span>
                      </div>

                      <div className="flex flex-col gap-1 select-none">
                        <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold text-center ${
                          studentEval.isAdminApproved ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'
                        }`}>
                          {studentEval.isAdminApproved ? (lang === 'ar' ? 'معتمد من عميد الكلية' : 'Dean Approved') : (lang === 'ar' ? 'قيد التثبيت الإداري' : 'Pending Appro')}
                        </span>
                        {studentEval.approvalDate && (
                          <span className="font-mono text-[9px] text-slate-400 text-center">
                            {studentEval.approvalDate}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Opportunity Detail Modal / apply form */}
      <AnimatePresence>
        {selectedOpp && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-2xl overflow-hidden text-right font-sans"
            >
              <div className="p-6 border-b border-rose-100 bg-slate-50 flex items-start justify-between">
                <button
                  onClick={() => setSelectedOpp(null)}
                  className="bg-slate-200 hover:bg-slate-300 rounded-full w-8 h-8 flex items-center justify-center text-slate-700 transition leading-none shrink-0"
                >
                  ✕
                </button>
                <div className="text-right">
                  <span className="inline-block bg-indigo-100 text-indigo-800 text-[10px] px-2.5 py-0.5 rounded font-bold uppercase mb-2">
                    {selectedOpp.providerName}
                  </span>
                  <h3 className="text-base md:text-lg font-bold text-slate-950">{selectedOpp.title}</h3>
                </div>
              </div>

              <div className="p-6 space-y-4 max-h-[380px] overflow-y-auto">
                <div>
                  <h4 className="text-xs font-bold text-slate-600 mb-1">{lang === 'ar' ? 'الوصف التفصيلي للتدريب:' : 'Job Description:'}</h4>
                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                    {selectedOpp.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
                    <h5 className="text-[10px] text-slate-500 font-bold">{lang === 'ar' ? 'التخصص المطلوب:' : 'Specialization:'}</h5>
                    <strong className="text-xs text-indigo-950 block mt-0.5">{selectedOpp.requiredMajor}</strong>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
                    <h5 className="text-[10px] text-slate-500 font-bold">{lang === 'ar' ? 'مقر وموقع التدريب:' : 'Office Location:'}</h5>
                    <strong className="text-xs text-indigo-950 block mt-0.5">{selectedOpp.location}</strong>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-50 p-2 rounded">
                    <span className="text-[9px] text-slate-400 block">{lang === 'ar' ? 'المدة الزمنية:' : 'Duration:'}</span>
                    <strong className="text-xs text-slate-800">{selectedOpp.durationWeeks} {lang === 'ar' ? 'أسبوعاً' : 'weeks'}</strong>
                  </div>
                  <div className="bg-slate-50 p-2 rounded">
                    <span className="text-[9px] text-slate-400 block">{lang === 'ar' ? 'المقاعد المتبقية:' : 'Open Seats:'}</span>
                    <strong className="text-xs text-slate-800">{selectedOpp.availablePositions} {} </strong>
                  </div>
                  <div className="bg-slate-50 p-2 rounded">
                    <span className="text-[9px] text-slate-400 block">{lang === 'ar' ? 'الميعاد النهائي للتسجيل:' : 'Apply Deadline:'}</span>
                    <strong className="text-xs text-rose-700 font-mono">{selectedOpp.deadline}</strong>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-600 mb-1">{lang === 'ar' ? 'المهارات المستهدفة بالتدريب الميداني:' : 'Skills required:'}</h4>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {selectedOpp.requiredSkills.map((skill, idx) => (
                      <span key={idx} className="bg-emerald-50 text-emerald-800 text-[10px] px-2.5 py-1 rounded font-semibold font-mono border border-emerald-100">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Apply section */}
                <form id="apply-submission-form" onSubmit={handleApplySubmit} className="pt-4 border-t border-slate-200 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">{lang === 'ar' ? 'السيرة الذاتية (اسم الملف المقترن لطلب التقديم):' : 'Candidate CV filename:'}</label>
                    <input
                      type="text"
                      value={cvText}
                      onChange={(e) => setCvText(e.target.value)}
                      placeholder="e.g. Rami_Al_Kahlout_Software_CV.pdf"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-left font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>

                  <div className="flex gap-2 justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedOpp(null)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-4 py-2 rounded-lg text-xs transition"
                    >
                      {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      disabled={isApplying}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-2 rounded-lg text-xs transition flex items-center gap-1.5"
                    >
                      {isApplying ? (
                        <>
                          <Clock className="h-3 w-3 animate-spin" />
                          <span>{lang === 'ar' ? 'جاري إرسال طلبك للشركة...' : 'Submitting to HR...'}</span>
                        </>
                      ) : (
                        <span>{lang === 'ar' ? 'تأكيد تقديم طلب الالتحاق' : 'Confirm Application'}</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
