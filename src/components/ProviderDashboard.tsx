import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, ClipboardList, Users, Check, X, FileText, Send, Star, UserCheck, 
  MapPin, Calendar, Clock, Sparkles, Building2, Eye, ShieldAlert, BookOpen
} from 'lucide-react';
import { TrainingProvider, Opportunity, Application, Student, Evaluation, Message, Supervisor } from '../types';

interface ProviderDashboardProps {
  provider: TrainingProvider;
  opportunities: Opportunity[];
  applications: Application[];
  students: Student[];
  supervisors: Supervisor[];
  messages: Message[];
  evaluations: Evaluation[];
  lang: 'ar' | 'en';
  onCreateOpportunity: (opp: Partial<Opportunity>) => void;
  onUpdateOpportunityStatus: (oppId: string, status: 'active' | 'closed') => void;
  onReviewApplication: (appId: string, status: 'accepted' | 'rejected', notes: string) => void;
  onSubmitEvaluation: (studentId: string, scores: { attendance: number; commitment: number; technicalSkills: number; teamwork: number; notes: string }) => void;
  onSendMessage: (receiverId: string, receiverRole: any, content: string) => void;
}

export default function ProviderDashboard({
  provider,
  opportunities,
  applications,
  students,
  supervisors,
  messages,
  evaluations,
  lang,
  onCreateOpportunity,
  onUpdateOpportunityStatus,
  onReviewApplication,
  onSubmitEvaluation,
  onSendMessage
}: ProviderDashboardProps) {
  const [activeTab, setActiveTab] = useState<'listings' | 'applicants' | 'evals' | 'chat'>('listings');

  // New posting form states
  const [isPostingNew, setIsPostingNew] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newMajor, setNewMajor] = useState('');
  const [newSkillsStr, setNewSkillsStr] = useState('');
  const [newSeats, setNewSeats] = useState(3);
  const [newLoc, setNewLoc] = useState('');
  const [newDeadline, setNewDeadline] = useState('2026-08-31');
  const [newWeeks, setNewWeeks] = useState(12);

  // Application decision states
  const [decisionNotes, setDecisionNotes] = useState('');
  const [reviewingApp, setReviewingApp] = useState<Application | null>(null);

  // Student grading states
  const [selectedStudentEvalId, setSelectedStudentEvalId] = useState<string>('');
  const [scoreAttendance, setScoreAttendance] = useState<number>(10);
  const [scoreCommitment, setScoreCommitment] = useState<number>(10);
  const [scoreTech, setScoreTech] = useState<number>(13);
  const [scoreTeam, setScoreTeam] = useState<number>(14);
  const [gradingNotes, setGradingNotes] = useState('');
  const [gradingSuccess, setGradingSuccess] = useState(false);

  // Chat conversation state
  const [chatPartnerId, setChatPartnerId] = useState<string>('');
  const [newMessage, setNewMessage] = useState('');

  // Provider filter data
  const myOpps = opportunities.filter(o => o.providerId === provider.id);
  const myApps = applications.filter(a => a.providerId === provider.id);
  const myMessages = messages.filter(m => m.senderId === provider.id || m.receiverId === provider.id);

  // Students who are accepted and actively training here
  const activeTrainees = students.filter(s => {
    const app = myApps.find(a => a.studentId === s.id && a.status === 'accepted');
    return !!app;
  });

  // Determine chat contacts (Students who applied / Supervisors of training students)
  const getChatPartners = () => {
    const list: { id: string; name: string; roleLabel: string; role: any }[] = [];
    
    // 1. Add their accepted training students only
    const acceptedTrainees = students.filter(s => {
      return myApps.some(a => a.studentId === s.id && a.status === 'accepted');
    });

    acceptedTrainees.forEach(s => {
      const isArabic = lang === 'ar';
      const uniName = s.university === 'Islamic University' 
        ? (isArabic ? 'الجامعة الإسلامية بغزة' : 'Islamic University') 
        : s.university === 'Al-Azhar University' 
          ? (isArabic ? 'جامعة الأزهر' : 'Al-Azhar University') 
          : (isArabic ? 'جامعة الأقصى' : 'Al-Aqsa University');

      list.push({ 
        id: s.id, 
        name: s.name, 
        roleLabel: isArabic 
          ? `طالب متدرب لدينا (${uniName})` 
          : `My Intern (${uniName})`, 
        role: 'student' 
      });
    });

    // 2. Add the academic supervisors of those accepted students
    acceptedTrainees.forEach(s => {
      if (s.supervisorId) {
        const sup = supervisors.find(x => x.id === s.supervisorId);
        if (sup && !list.find(x => x.id === sup.id)) {
          list.push({ 
            id: sup.id, 
            name: sup.name, 
            roleLabel: lang === 'ar' ? `المشرف الأكاديمي للمتدرب ${s.name}` : `Supervisor for ${s.name}`, 
            role: 'supervisor' 
          });
        }
      }
    });

    return list;
  };

  const chatPartners = getChatPartners();
  const activeChatPartner = chatPartners.find(p => p.id === chatPartnerId) || chatPartners[0];

  // Specific conversation messages
  const activeConversation = myMessages.filter(
    m => (m.senderId === provider.id && m.receiverId === activeChatPartner?.id) ||
         (m.senderId === activeChatPartner?.id && m.receiverId === provider.id)
  ).sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeTab === 'chat' && chatEndRef.current) {
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  }, [activeConversation.length, activeChatPartner?.id, activeTab]);

  // Handle new opportunity post submit
  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDesc || !newMajor) return;
    onCreateOpportunity({
      providerId: provider.id,
      providerName: provider.companyName,
      title: newTitle,
      description: newDesc,
      requiredMajor: newMajor,
      requiredSkills: newSkillsStr.split(',').map(s => s.trim()).filter(Boolean),
      availablePositions: Number(newSeats),
      location: newLoc || provider.address,
      deadline: newDeadline,
      status: 'active',
      durationWeeks: Number(newWeeks)
    });

    // Reset fields
    setNewTitle('');
    setNewDesc('');
    setNewMajor('');
    setNewSkillsStr('');
    setNewLoc('');
    setIsPostingNew(false);
  };

  const handleReviewAction = (appId: string, status: 'accepted' | 'rejected') => {
    onReviewApplication(appId, status, decisionNotes || (status === 'accepted' ? 'تهانينا، تم قبول طلبك للتدريب لدينا!' : 'نعتذر منك، لم يحالفك الحظ هذه المرة لضيق الشواغر.'));
    setDecisionNotes('');
    setReviewingApp(null);
  };

  const handleGradingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentEvalId) return;
    onSubmitEvaluation(selectedStudentEvalId, {
      attendance: Number(scoreAttendance),
      commitment: Number(scoreCommitment),
      technicalSkills: Number(scoreTech),
      teamwork: Number(scoreTeam),
      notes: gradingNotes
    });
    setGradingSuccess(true);
    setGradingNotes('');
    setTimeout(() => setGradingSuccess(false), 3000);
  };

  const handleSendMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChatPartner) return;
    onSendMessage(activeChatPartner.id, activeChatPartner.role, newMessage);
    setNewMessage('');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased text-slate-800 pb-12" id="provider-portal-container">
      
      {/* Brand Hero Header */}
      <div className="bg-white border-b border-slate-200 py-6 px-4 sm:px-6 lg:px-8 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex gap-4 items-center text-right font-sans">
            <div className={`bg-gradient-to-tr ${provider.logoColor} text-white h-14 w-14 rounded-2xl flex items-center justify-center font-bold text-2xl border shadow-md`}>
              {provider.companyName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-bold text-slate-900">{provider.companyName}</h1>
                <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-bold border border-indigo-250 uppercase">
                  {lang === 'ar' ? 'مؤسسة معتمدة' : 'Verified Partner'}
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-1">{provider.description}</p>
              <span className="text-xs text-slate-400 block mt-1 font-mono">{lang === 'ar' ? 'العنوان:' : 'Address:'} {provider.address}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 px-1.5 py-1.5 bg-slate-100 rounded-lg w-full md:w-auto">
            <button
              onClick={() => setActiveTab('listings')}
              className={`flex-1 md:flex-initial px-4 py-2 rounded-md text-sm font-medium transition ${
                activeTab === 'listings' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {lang === 'ar' ? 'شواغر التدريب' : 'Our Listings'}
            </button>
            <button
              onClick={() => setActiveTab('applicants')}
              className={`flex-1 md:flex-initial px-4 py-2 rounded-md text-sm font-medium transition relative ${
                activeTab === 'applicants' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>{lang === 'ar' ? 'المتقدمين' : 'Applicants'}</span>
              {myApps.filter(a => a.status === 'pending').length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold font-mono">
                  {myApps.filter(a => a.status === 'pending').length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('evals')}
              className={`flex-1 md:flex-initial px-4 py-2 rounded-md text-sm font-medium transition ${
                activeTab === 'evals' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {lang === 'ar' ? 'تقييم المتدربين' : 'Trainees Grading'}
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 md:flex-initial px-4 py-2 rounded-md text-sm font-medium transition relative ${
                activeTab === 'chat' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>{lang === 'ar' ? 'الاتصال والدردشة' : 'Direct Messages'}</span>
              {myMessages.filter(m => !m.isRead && m.senderId !== provider.id).length > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold">
                  {myMessages.filter(m => !m.isRead && m.senderId !== provider.id).length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Grid Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* Statistics overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-3">
            <div className="h-10 w-10 text-emerald-600 bg-emerald-50 rounded-lg flex items-center justify-center">
              <ClipboardList className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">{lang === 'ar' ? 'الفرص المنشورة' : 'Posted Listings'}</p>
              <h4 className="text-sm font-bold text-slate-800 font-mono">{myOpps.length} {lang === 'ar' ? 'فرصة تدريب' : 'items'}</h4>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-3">
            <div className="h-10 w-10 text-indigo-600 bg-indigo-50 rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">{lang === 'ar' ? 'المتقدمين الإجمالي' : 'Total Applicants'}</p>
              <h4 className="text-sm font-bold text-slate-800 font-mono">{myApps.length} {lang === 'ar' ? 'طلبات توظيف' : 'candidates'}</h4>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-3">
            <div className="h-10 w-10 text-amber-500 bg-amber-50 rounded-lg flex items-center justify-center">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">{lang === 'ar' ? 'طلبات معلقة للدراسة' : 'Pending Decisions'}</p>
              <h4 className="text-sm font-bold text-slate-800 font-mono text-amber-700">
                {myApps.filter(a => a.status === 'pending').length} {lang === 'ar' ? 'طلبات جديدة' : 'pending'}
              </h4>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-3">
            <div className="h-10 w-10 text-violet-600 bg-violet-50 rounded-lg flex items-center justify-center">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">{lang === 'ar' ? 'طلاب تحت التدريب' : 'Active Trainees'}</p>
              <h4 className="text-sm font-bold text-slate-800 font-mono text-violet-700">
                {activeTrainees.length} {lang === 'ar' ? 'متدربين نشطين' : 'active'}
              </h4>
            </div>
          </div>
        </div>

        {/* Tab view containers */}
        <AnimatePresence mode="wait">
          
          {/* TAB 1: listings & posting listings */}
          {activeTab === 'listings' && (
            <motion.div
              key="listings-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200">
                <div className="text-right">
                  <h3 className="font-bold text-slate-900">{lang === 'ar' ? 'إدارة فرص وشواغر التدريب الميداني' : 'Our Active Field Training Postings'}</h3>
                  <p className="text-[11px] text-slate-400">{lang === 'ar' ? 'عرض أو تعديل أو إغلاق الشواغر التي يقدم عليها طلاب جامعات غزة.' : 'Manage available internship vacancies.'}</p>
                </div>
                <button
                  onClick={() => setIsPostingNew(!isPostingNew)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center gap-1.5 transition shadow"
                >
                  <Plus className="h-4 w-4" />
                  <span>{lang === 'ar' ? 'إعلان عن فرصة تدريبية' : 'Create New Posting'}</span>
                </button>
              </div>

              {/* Collapsible New Posting Form */}
              {isPostingNew && (
                <motion.form 
                  onSubmit={handlePostSubmit}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="bg-white p-6 rounded-xl border border-indigo-200 space-y-4 shadow-sm text-right"
                >
                  <h4 className="font-bold text-slate-950 text-sm border-b border-indigo-50 pb-2 text-indigo-900 flex items-center gap-2 justify-end">
                    <Sparkles className="h-4 w-4 text-indigo-500 animate-pulse" />
                    <span>{lang === 'ar' ? 'تعبئة استمارة إعلان التدريب الجديد' : 'New Internship Vacancy Specs'}</span>
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">{lang === 'ar' ? 'عنوان التدريب (اسم الفرصة):' : 'Opportunity title'}</label>
                      <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="مثال: هندسة صيانة الشبكات اللاسلكية"
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm text-right focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">{lang === 'ar' ? 'التخصص الأكاديمي المطلوب:' : 'Required Major'}</label>
                      <input
                        type="text"
                        value={newMajor}
                        onChange={(e) => setNewMajor(e.target.value)}
                        placeholder="مثال: هندسة برمجيات / هندسة كمبيوتر"
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm text-right focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">{lang === 'ar' ? 'شرح تفصيلي للمهام ومكتسبات التدريب:' : 'Description'}</label>
                    <textarea
                      rows={4}
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      placeholder="صف بالتفصيل ما سيتعلمه المتدرب في هذه الفرصة..."
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 md:p-3 text-xs text-right focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">{lang === 'ar' ? 'المهارات المطلوبة (بينها فاصلة):' : 'Key skills requested (comma separated)'}</label>
                      <input
                        type="text"
                        value={newSkillsStr}
                        onChange={(e) => setNewSkillsStr(e.target.value)}
                        placeholder="React, Git, CSS, REST"
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-left font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">{lang === 'ar' ? 'عدد المقاعد المتاحة:' : 'Available Positions'}</label>
                      <input
                        type="number"
                        min={1}
                        value={newSeats}
                        onChange={(e) => setNewSeats(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm text-right focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">{lang === 'ar' ? 'موقع تدريب الميداني بالتفصيل:' : 'Placement Location'}</label>
                      <input
                        type="text"
                        value={newLoc}
                        onChange={(e) => setNewLoc(e.target.value)}
                        placeholder="مثال: فرع الرمال، غزة"
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm text-right focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">{lang === 'ar' ? 'آخر موعد للتقديم:' : 'Deadline to apply'}</label>
                      <input
                        type="date"
                        value={newDeadline}
                        onChange={(e) => setNewDeadline(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">{lang === 'ar' ? 'مدة التدريب بالأسابيع:' : 'Duration (weeks)'}</label>
                      <input
                        type="number"
                        min={1}
                        value={newWeeks}
                        onChange={(e) => setNewWeeks(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm text-right focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end pt-3">
                    <button
                      type="button"
                      onClick={() => setIsPostingNew(false)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-xs font-medium transition"
                    >
                      {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg text-xs font-bold transition shadow-sm"
                    >
                      {lang === 'ar' ? 'نشر الإعلان للطلاب فوراً' : 'Publish Opportunity'}
                    </button>
                  </div>
                </motion.form>
              )}

              {/* listings list */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {myOpps.length === 0 ? (
                  <div className="col-span-2 text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
                    <ClipboardList className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-slate-500 text-xs">{lang === 'ar' ? 'لم تقم بنشر أي شواغر للتدريب بعد.' : 'You have not posted any opportunities yet.'}</p>
                  </div>
                ) : (
                  myOpps.map(opp => {
                    const matchedApps = myApps.filter(a => a.opportunityId === opp.id);
                    return (
                      <div key={opp.id} className="bg-white p-5 rounded-xl border border-slate-200 hover:border-indigo-400 hover:shadow-sm transition duration-150 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                              opp.status === 'active' ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : 'bg-rose-50 text-rose-800 border border-rose-105'
                            }`}>
                              {opp.status === 'active' ? (lang === 'ar' ? 'نشط وقابل للتقديم' : 'Active') : (lang === 'ar' ? 'مغلق ومكتمل الشواغر' : 'Closed')}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono italic">ID: {opp.id}</span>
                          </div>

                          <h4 className="font-bold text-slate-900 text-sm mt-2">{opp.title}</h4>
                          <span className="text-[11px] text-indigo-700 block font-medium mt-0.5">{opp.requiredMajor}</span>
                          <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">{opp.description}</p>

                          <div className="mt-4 flex flex-wrap gap-1">
                            {opp.requiredSkills.map((sk, idx) => (
                              <span key={idx} className="bg-slate-100 text-slate-600 text-[9px] font-mono px-2 py-px rounded">
                                {sk}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                          <div className="flex flex-col gap-1">
                            <span>{lang === 'ar' ? `المقاعد المتاحة: ${opp.availablePositions}` : `Remaining seats: ${opp.availablePositions}`}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{lang === 'ar' ? `الموعد: ${opp.deadline}` : `Limit: ${opp.deadline}`}</span>
                          </div>

                          <div className="flex gap-2">
                            {opp.status === 'active' ? (
                              <button
                                onClick={() => onUpdateOpportunityStatus(opp.id, 'closed')}
                                className="bg-rose-50 hover:bg-rose-100 text-rose-800 text-[11px] px-3 py-1.5 rounded transition"
                              >
                                {lang === 'ar' ? 'إغلاق الفرصة' : 'Close Vacancy'}
                              </button>
                            ) : (
                              <button
                                onClick={() => onUpdateOpportunityStatus(opp.id, 'active')}
                                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] px-3 py-1.5 rounded transition"
                              >
                                {lang === 'ar' ? 'إعادة فتح' : 'Reactivate'}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          )}

          {/* TAB 2: Applicants manager */}
          {activeTab === 'applicants' && (
            <motion.div
              key="applicants-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs"
            >
              <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 text-right">
                <h3 className="font-bold text-slate-900">{lang === 'ar' ? 'طلبات توظيف وتدريب الطلاب المقدمة للشركة' : 'Student Recruitment Candidates'}</h3>
                <p className="text-xs text-slate-400">{lang === 'ar' ? 'قائمة الطلبات المرفوعة من طلاب غزة. يرجى مراجعة التخصص والبروتوكول لاتخاذ القرار.' : 'Review credentials, CV files, and record recruitment status output.'}</p>
              </div>

              {myApps.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-500 text-xs">{lang === 'ar' ? 'لم يتقدم أي طالب لأي فرصة تدريب تابعة لك حالياً.' : 'No candidates logged for your opportunities.'}</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-150">
                  {myApps.map(app => (
                    <div key={app.id} className="p-5 flex flex-col md:flex-row justify-between gap-4 hover:bg-slate-50 transition">
                      
                      <div className="space-y-1 text-right flex-1 select-text">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-slate-950 text-sm">{app.studentName}</h4>
                          <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium border border-slate-200">
                            {app.studentUniversity === 'Islamic University' ? 'الجامعة الإسلامية بغزة' : app.studentUniversity === 'Al-Azhar University' ? 'جامعة الأزهر' : 'جامعة الأقصى'}
                          </span>
                        </div>
                        <p className="text-xs text-indigo-700 font-medium">{app.studentMajor}</p>
                        
                        <div className="pt-2 text-xs text-slate-600 block">
                          <span>{lang === 'ar' ? 'التقديم بخصوص شاغر:' : 'For Opportunity:'} </span>
                          <strong className="text-slate-900 font-bold">{app.opportunityTitle}</strong>
                        </div>

                        <div className="flex items-center gap-2 pt-2 text-[10px] text-slate-400">
                          <span>{lang === 'ar' ? `تاريخ الطلب: ${app.appliedDate}` : `Submitted date: ${app.appliedDate}`}</span>
                          <span>•</span>
                          <span className="font-mono">{lang === 'ar' ? `السيرة الذاتية المرفقة: ${app.cvName}` : `CV name: ${app.cvName}`}</span>
                          <span className="text-indigo-600 underline cursor-pointer hover:text-indigo-800 text-[11px] font-semibold flex items-center gap-0.5">
                            <Eye className="h-3.5 w-3.5" />
                            {lang === 'ar' ? 'معاينة الملف' : 'View CV'}
                          </span>
                        </div>

                        {app.notes && (
                          <div className="mt-3 p-3 bg-slate-100 border-r-2 border-indigo-500 rounded text-xs text-slate-600 max-w-xl">
                            <strong>{lang === 'ar' ? 'ملاحظتك المدونة:' : 'Your Decisional Note:'}</strong> {app.notes}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-2 justify-center w-full md:w-56 shrink-0">
                        {app.status === 'pending' ? (
                          <div className="w-full space-y-2">
                            <textarea
                              value={decisionNotes}
                              onChange={(e) => setDecisionNotes(e.target.value)}
                              placeholder={lang === 'ar' ? 'أضف ملاحظات أو توجيهات للرَّد (اختياري)...' : 'Optional notes for acceptance/rejection'}
                              className="w-full bg-slate-50 text-[11px] border border-slate-300 p-1.5 rounded-md text-right focus:outline-none"
                            />
                            <div className="flex gap-2 w-full">
                              <button
                                onClick={() => {
                                  setReviewingApp(app);
                                  handleReviewAction(app.id, 'rejected');
                                }}
                                className="flex-1 bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-bold py-1.5 px-3 rounded-lg border border-rose-200 transition text-center"
                              >
                                {lang === 'ar' ? 'رفض' : 'Decline'}
                              </button>
                              <button
                                onClick={() => {
                                  setReviewingApp(app);
                                  handleReviewAction(app.id, 'accepted');
                                }}
                                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-1.5 px-3 rounded-lg border border-emerald-700 transition text-center"
                              >
                                {lang === 'ar' ? 'قبول' : 'Accept'}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center w-full">
                            <span className={`inline-block text-xs px-3.5 py-1.5 rounded-full font-extrabold w-36 ${
                              app.status === 'accepted' ? 'bg-emerald-50 text-emerald-800 border border-emerald-250' : 'bg-rose-50 text-rose-800 border border-rose-250'
                            }`}>
                              {app.status === 'accepted' ? (lang === 'ar' ? 'تم القبول والالتحاق' : 'Accepted Intern') : (lang === 'ar' ? 'تم الاعتذار بالرفض' : 'Declined Candidate')}
                            </span>
                          </div>
                        )}
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 3: Student Evaluations */}
          {activeTab === 'evals' && (
            <motion.div
              key="evals-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-right"
            >
              {/* Grading Entry Deck */}
              <div className="lg:col-span-1 bg-white p-5 rounded-xl border border-slate-200 h-fit shadow-xs">
                <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2 justify-end">
                  <Star className="h-4.5 w-4.5 text-amber-500 fill-amber-500" />
                  <span>{lang === 'ar' ? 'إدخال درجات المتدربين' : 'Enter Trainee Grades'}</span>
                </h3>

                {activeTrainees.length === 0 ? (
                  <p className="text-slate-500 text-xs text-center py-6">
                    {lang === 'ar' 
                      ? 'لا يوجد أي طلاب مقبولين للتدريب حالياً لإدخال درجات لهم. يلزم قبول طالب أولاً من قسم المتقدمين.' 
                      : 'Accept a student first to generate training evaluations.'
                    }
                  </p>
                ) : (
                  <form onSubmit={handleGradingSubmit} className="space-y-4 mt-4 select-text">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">{lang === 'ar' ? 'اختر طالب التدريب:' : 'Select trainee student'}</label>
                      <select
                        value={selectedStudentEvalId}
                        onChange={(e) => {
                          const sId = e.target.value;
                          setSelectedStudentEvalId(sId);
                          // Pull previous evaluation variables if any
                          const existingEv = evaluations.find(ev => ev.studentId === sId);
                          if (existingEv) {
                            setScoreAttendance(existingEv.attendance);
                            setScoreCommitment(existingEv.commitment);
                            setScoreTech(existingEv.technicalSkills);
                            setScoreTeam(existingEv.teamwork);
                            setGradingNotes(existingEv.providerNotes);
                          } else {
                            // reset
                            setScoreAttendance(10);
                            setScoreCommitment(10);
                            setScoreTech(13);
                            setScoreTeam(14);
                            setGradingNotes('');
                          }
                        }}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-indigo-500"
                        required
                      >
                        <option value="">-- {lang === 'ar' ? 'اختر الطالب للتقييم' : 'Choose student'} --</option>
                        {activeTrainees.map(s => (
                          <option key={s.id} value={s.id}>{s.name} ({s.major.substring(0, 15)}...)</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-3.5 bg-slate-50 p-3 rounded-lg border border-slate-205">
                      <h4 className="font-bold text-indigo-950 text-xs border-b pb-1 mb-2">{lang === 'ar' ? 'المعايير الخمسة (مجموع ٥٠٪ للدرجة):' : 'Criteria variables (50% max)'}</h4>
                      
                      <div>
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span className="font-semibold text-slate-700">{lang === 'ar' ? 'الالتزام والعمل والمواعيد (العلامة القصوى: ١٠):' : 'Attendance & regularity (Max 10)'}</span>
                          <strong className="font-mono text-indigo-900">{scoreAttendance} / 10</strong>
                        </div>
                        <input
                          type="range" min={0} max={10} value={scoreAttendance}
                          onChange={(e) => setScoreAttendance(Number(e.target.value))}
                          className="w-full accent-indigo-600"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span className="font-semibold text-slate-700">{lang === 'ar' ? 'المسؤولية وأخلاقيات المهنة (العلامة القصوى: ١٠):' : 'Commitment & Responsibility (Max 10)'}</span>
                          <strong className="font-mono text-indigo-900">{scoreCommitment} / 10</strong>
                        </div>
                        <input
                          type="range" min={0} max={10} value={scoreCommitment}
                          onChange={(e) => setScoreCommitment(Number(e.target.value))}
                          className="w-full accent-indigo-600"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span className="font-semibold text-slate-700">{lang === 'ar' ? 'مهارة الإنماء التقني والفني (العلامة القصوى: ١٥):' : 'Technical & coding skills (Max 15)'}</span>
                          <strong className="font-mono text-indigo-900">{scoreTech} / 15</strong>
                        </div>
                        <input
                          type="range" min={0} max={15} value={scoreTech}
                          onChange={(e) => setScoreTech(Number(e.target.value))}
                          className="w-full accent-indigo-600"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span className="font-semibold text-slate-700">{lang === 'ar' ? 'مرونة العمل الجماعي وفريق جوال (العلامة القصوى: ١٥):' : 'Teamwork index (Max 15)'}</span>
                          <strong className="font-mono text-indigo-900">{scoreTeam} / 15</strong>
                        </div>
                        <input
                          type="range" min={0} max={15} value={scoreTeam}
                          onChange={(e) => setScoreTeam(Number(e.target.value))}
                          className="w-full accent-indigo-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">{lang === 'ar' ? 'توصيات وملاحظات الموارد البشرية للمتدرب:' : 'Professional mentor evaluation notes'}</label>
                      <textarea
                        rows={3}
                        value={gradingNotes}
                        onChange={(e) => setGradingNotes(e.target.value)}
                        placeholder="اكتب الثناء، التوصيات، أو النصائح التقنية..."
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-indigo-500 text-right"
                        required
                      ></textarea>
                    </div>

                    {gradingSuccess && (
                      <div className="bg-emerald-50 border border-emerald-100 p-2.5 rounded-lg text-xs text-emerald-800 flex items-center justify-center gap-2">
                        <Sparkles className="h-4 w-4 text-emerald-600 animate-spin" />
                        <span>{lang === 'ar' ? 'تم تسجيل وتوثيق كشف الدرجات بنجاح!' : 'Training scores logged securely!'}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-lg text-xs transition"
                    >
                      {lang === 'ar' ? 'حفظ وتثبيت التقييم الميداني' : 'Save and Register Grades'}
                    </button>
                  </form>
                )}
              </div>

              {/* Trainees history evaluation roster */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs text-right">
                  <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-3">
                    {lang === 'ar' ? 'سجل تقييمات المتدربين النشطين ومجموع الدرجات' : 'Trainees Evaluation Records & Academic Synergy'}
                  </h3>

                  <div className="space-y-4 mt-4 select-text">
                    {activeTrainees.length === 0 ? (
                      <p className="text-slate-500 text-xs text-center py-6">{lang === 'ar' ? 'لا يوجد تقييمات مسجلة حالياً.' : 'No trainees currently active.'}</p>
                    ) : (
                      activeTrainees.map(trainee => {
                        const traineeEval = evaluations.find(e => e.studentId === trainee.id && e.providerId === provider.id);
                        return (
                          <div key={trainee.id} className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                            <div className="flex justify-between items-center pb-2 border-b border-slate-200 flex-wrap gap-2">
                              <div>
                                <h4 className="font-bold text-slate-950 text-xs inline-block ml-2">{trainee.name}</h4>
                                <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">
                                  {trainee.studentId}
                                </span>
                              </div>
                              <span className="text-[11px] text-slate-400 font-mono">
                                {trainee.major}
                              </span>
                            </div>

                            {traineeEval ? (
                              <div className="mt-3 space-y-2">
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs text-slate-600">
                                  <div className="bg-white p-1 rounded border">
                                    <span className="text-[9px] text-slate-400 block">{lang === 'ar' ? 'الحضور والالتزام' : 'Attendance'}</span>
                                    <strong className="text-slate-800 font-mono">{traineeEval.attendance} / 10</strong>
                                  </div>
                                  <div className="bg-white p-1 rounded border">
                                    <span className="text-[9px] text-slate-400 block">{lang === 'ar' ? 'المسؤولية والانضباط' : 'Commitment'}</span>
                                    <strong className="text-slate-800 font-mono">{traineeEval.commitment} / 10</strong>
                                  </div>
                                  <div className="bg-white p-1 rounded border">
                                    <span className="text-[9px] text-slate-400 block">{lang === 'ar' ? 'المهام والنمو الفني' : 'Technical'}</span>
                                    <strong className="text-slate-800 font-mono">{traineeEval.technicalSkills} / 15</strong>
                                  </div>
                                  <div className="bg-white p-1 rounded border">
                                    <span className="text-[9px] text-slate-400 block">{lang === 'ar' ? 'العمل والانسجام' : 'Teamwork'}</span>
                                    <strong className="text-slate-800 font-mono">{traineeEval.teamwork} / 15</strong>
                                  </div>
                                </div>

                                <div className="mt-2 text-xs bg-white p-2 text-slate-500 rounded border">
                                  <strong>{lang === 'ar' ? 'ملاحظتك:' : 'HR Evaluation Notes:'}</strong> "{traineeEval.providerNotes}"
                                </div>

                                <div className="flex justify-between items-center pt-2 text-[11px] text-slate-400">
                                  <span>{lang === 'ar' ? `تحديث التوثيق: ${traineeEval.providerSubmittedDate || '2026-06-20'}` : `Saved at: ${traineeEval.providerSubmittedDate || '2026'}`}</span>
                                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                                    {lang === 'ar' ? `المجموع الممنوح منكم: ${traineeEval.attendance + traineeEval.commitment + traineeEval.technicalSkills + traineeEval.teamwork} / 50` : `Provider Score: ${traineeEval.attendance + traineeEval.commitment + traineeEval.technicalSkills + traineeEval.teamwork} / 50`}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <div className="mt-3 text-center py-2 text-amber-600 bg-amber-50 text-xs rounded border border-amber-100 flex items-center justify-center gap-1.5">
                                <ShieldAlert className="h-4 w-4" />
                                <span>{lang === 'ar' ? 'لم تقم بتسجيل درجات هذا المتدرب بعد. يرجى ملء الاستمارة الجانبية لتثبيته.' : 'Please enter scores in the left panel to register grades.'}</span>
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
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
              className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col md:grid md:grid-cols-3 h-auto md:h-[550px]"
            >
              <div className="md:col-span-1 border-l border-slate-200 bg-slate-50 flex flex-col justify-between h-[180px] md:h-full overflow-y-auto">
                <div>
                  <div className="p-4 border-b border-slate-200 text-right">
                    <h3 className="font-bold text-slate-900 text-sm">{lang === 'ar' ? 'المحادثات وتواصل الجامعات' : 'Corporate Messaging Desk'}</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">{lang === 'ar' ? 'تواصل فوري لحل أي عقبات.' : 'Instant channels with students & supervisors.'}</p>
                  </div>
                  
                  <div className="divide-y divide-slate-150">
                    {chatPartners.length === 0 ? (
                      <div className="p-4 text-center text-slate-400 text-xs">
                        <p>{lang === 'ar' ? 'لا توجد قنوات تواصل مفعلة حالياً. يمكنك التراسل فور قبول واعتماد طلاب للتدريب لديكم.' : 'No active communication channels yet. You can chat once students are accepted for training with you.'}</p>
                      </div>
                    ) : (
                      chatPartners.map(partner => {
                        const isActive = activeChatPartner?.id === partner.id;
                        const unread = myMessages.filter(m => m.senderId === partner.id && !m.isRead).length;

                        return (
                          <button
                            key={partner.id}
                            onClick={() => setChatPartnerId(partner.id)}
                            className={`w-full text-right p-4 transition flex items-center justify-between ${
                              isActive ? 'bg-indigo-50 border-r-4 border-indigo-600' : 'bg-transparent hover:bg-slate-100'
                            }`}
                          >
                            <div className="text-right">
                              <h4 className="font-bold text-slate-900 text-xs">{partner.name}</h4>
                              <span className="text-[10px] text-slate-500 block leading-tight mt-0.5">{partner.roleLabel}</span>
                            </div>

                            {unread > 0 && (
                              <span className="bg-red-500 text-white font-mono text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                {unread}
                              </span>
                            )}
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              {/* Chat view */}
              <div className="md:col-span-2 flex flex-col justify-between h-[400px] md:h-full bg-slate-100 select-text min-h-0">
                {activeChatPartner ? (
                  <>
                    <div className="p-3.5 bg-white border-b border-slate-200 flex justify-between items-center px-5">
                      <div className="text-right">
                        <h4 className="font-bold text-slate-900 text-xs">{activeChatPartner.name}</h4>
                        <span className="text-[10px] text-indigo-600 font-semibold">{activeChatPartner.roleLabel}</span>
                      </div>
                      <span className="text-[10px] uppercase font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded">
                        {lang === 'ar' ? 'بوابة الشركات الآمنة' : 'secured HR terminal'}
                      </span>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3.5 min-h-0">
                      {activeConversation.length === 0 ? (
                        <div className="text-center py-12 text-slate-400 text-xs">
                          <Eye className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                          <p>{lang === 'ar' ? 'أرسل رسالة فورية للتنسيق بخصوص الطلاب ومواعيد المقابلات.' : 'Reach out to clarify student schedules and interviews.'}</p>
                        </div>
                      ) : (
                        activeConversation.map(msg => {
                          const isMe = msg.senderId === provider.id;
                          return (
                            <div key={msg.id} className={`flex ${isMe ? 'justify-start' : 'justify-end'}`}>
                              <div className={`max-w-md p-3 rounded-lg text-xs leading-relaxed ${
                                isMe 
                                  ? 'bg-indigo-600 text-white rounded-br-none shadow-sm' 
                                  : 'bg-white border border-slate-300 text-slate-800 rounded-bl-none shadow-xs'
                              }`}>
                                <p className="text-right">{msg.content}</p>
                                <span className={`block text-[8px] mt-1.5 text-left font-mono ${isMe ? 'text-indigo-200' : 'text-slate-400'}`}>
                                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            </div>
                          );
                        })
                      )}
                      <div ref={chatEndRef} />
                    </div>

                    <form onSubmit={handleSendMessageSubmit} className="p-3 bg-white border-t border-slate-200 flex gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={lang === 'ar' ? `اضغط هنا ومراسلة ${activeChatPartner?.name}...` : 'Say something friendly...'}
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
                    <Eye className="h-10 w-10 text-slate-300 mb-2" />
                    <p className="text-sm">{lang === 'ar' ? 'اختر ممثلاً أو متدرباً لمراسلته' : 'Choose a contact from the panel to begin.'}</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
