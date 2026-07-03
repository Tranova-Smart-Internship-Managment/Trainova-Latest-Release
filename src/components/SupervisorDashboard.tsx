import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, AlertTriangle, FileText, Send, Star, Users, MessageSquare, 
  Clock, Sparkles, BookOpen, User, GraduationCap, ChevronRight, Check
} from 'lucide-react';
import { Supervisor, WeeklyReport, Student, Message, Evaluation, TrainingProvider, Application } from '../types';

interface SupervisorDashboardProps {
  supervisor: Supervisor;
  students: Student[];
  applications: Application[];
  reports: WeeklyReport[];
  messages: Message[];
  evaluations: Evaluation[];
  providers: TrainingProvider[];
  lang: 'ar' | 'en';
  onReviewReport: (reportId: string, feedback: string) => void;
  onSubmitSupervisorEvaluation: (studentId: string, scores: { reportsScore: number; finalDefenseScore: number; notes: string }) => void;
  onSendMessage: (receiverId: string, receiverRole: any, content: string) => void;
}

export default function SupervisorDashboard({
  supervisor,
  students,
  applications,
  reports,
  messages,
  evaluations,
  providers,
  lang,
  onReviewReport,
  onSubmitSupervisorEvaluation,
  onSendMessage
}: SupervisorDashboardProps) {
  const [activeTab, setActiveTab] = useState<'roster' | 'reports_review' | 'final_grades' | 'chat'>('roster');

  // Input states for report review action
  const [selectedReportId, setSelectedReportId] = useState<string>('');
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  // Input states for grading
  const [selectedStudentGradeId, setSelectedStudentGradeId] = useState<string>('');
  const [scoreReports, setScoreReports] = useState<number>(22);
  const [scoreDefense, setScoreDefense] = useState<number>(23);
  const [intelNotes, setIntelNotes] = useState('');
  const [gradingSuccess, setGradingSuccess] = useState(false);

  // Chat states
  const [chatPartnerId, setChatPartnerId] = useState<string>('');
  const [newMessage, setNewMessage] = useState('');

  // Supervisor specific data filter
  // Map students assigned to this supervisor
  const myStudents = students.filter(s => s.supervisorId === supervisor.id);
  const myStudentsIds = myStudents.map(s => s.id);

  // Reports submitted by this supervisor's students
  const studentReports = reports.filter(r => myStudentsIds.includes(r.studentId)).sort((a,b) => b.weekNumber - a.weekNumber);
  const pendingReportsCount = studentReports.filter(r => !r.isReviewed).length;

  const myMessages = messages.filter(m => m.senderId === supervisor.id || m.receiverId === supervisor.id);

  // Identify students who failed to submit recent reports (e.g. they should submit at least 2 reports by week 2, let's flags students with 0 or only 1 reports)
  const missingReportStudents = myStudents.filter(s => {
    const sReports = reports.filter(r => r.studentId === s.id);
    return sReports.length < 2; // For simulation, under-performing or delayed interns
  });

  const getChatPartners = () => {
    const list: { id: string; name: string; roleLabel: string; role: any }[] = [];
    
    // 1. Add their supervised students only
    const supervisedStudents = students.filter(s => s.supervisorId === supervisor.id);
    supervisedStudents.forEach(s => {
      list.push({ 
        id: s.id, 
        name: s.name, 
        roleLabel: lang === 'ar' ? `طالبي المباشر - ${s.major}` : `My Intern - ${s.major}`, 
        role: 'student' 
      });
    });

    // 2. Add Training Providers where their supervised students are accepted
    const supervisedStudentIds = supervisedStudents.map(s => s.id);
    const acceptedApplicationsOfMyStudents = applications.filter(
      a => supervisedStudentIds.includes(a.studentId) && a.status === 'accepted'
    );
    
    acceptedApplicationsOfMyStudents.forEach(a => {
      const p = providers.find(prov => prov.id === a.providerId);
      if (p && !list.find(x => x.id === p.id)) {
        list.push({ 
          id: p.id, 
          name: p.companyName, 
          roleLabel: lang === 'ar' ? 'جهة تدريب طلابي' : "My Students' Training Provider", 
          role: 'provider' 
        });
      }
    });

    return list;
  };

  const chatPartners = getChatPartners();
  const activeChatPartner = chatPartners.find(p => p.id === chatPartnerId) || chatPartners[0];

  // Conversation history
  const activeConversation = myMessages.filter(
    m => (m.senderId === supervisor.id && m.receiverId === activeChatPartner?.id) ||
         (m.senderId === activeChatPartner?.id && m.receiverId === supervisor.id)
  ).sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeTab === 'chat' && chatEndRef.current) {
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  }, [activeConversation.length, activeChatPartner?.id, activeTab]);

  // Handle Report Review
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReportId || !feedbackText) return;
    onReviewReport(selectedReportId, feedbackText);
    setFeedbackText('');
    setSelectedReportId('');
    setFeedbackSuccess(true);
    setTimeout(() => setFeedbackSuccess(false), 3000);
  };

  // Handle Academic Evaluation register
  const handleGradingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentGradeId) return;
    onSubmitSupervisorEvaluation(selectedStudentGradeId, {
      reportsScore: Number(scoreReports),
      finalDefenseScore: Number(scoreDefense),
      notes: intelNotes
    });
    setGradingSuccess(true);
    setIntelNotes('');
    setTimeout(() => setGradingSuccess(false), 3000);
  };

  // Handle Send Chat Message
  const handleSendMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChatPartner) return;
    onSendMessage(activeChatPartner.id, activeChatPartner.role, newMessage);
    setNewMessage('');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased text-slate-800 pb-12" id="supervisor-portal-container">
      
      {/* Supervisor Credentials Hero */}
      <div className="bg-white border-b border-slate-200 py-6 px-4 sm:px-6 lg:px-8 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex gap-4 items-center text-right font-sans">
            <div className="bg-rose-50 text-rose-600 h-14 w-14 rounded-full flex items-center justify-center font-bold text-xl border border-rose-200">
              {supervisor.name.substring(2, 4).trim()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-bold text-slate-900">{supervisor.name}</h1>
                <span className="text-xs bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-full font-medium">
                  {lang === 'ar' ? 'عضو الهيئة الأكاديمية' : 'Faculty Adviser'}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-sm text-slate-500 mt-1">
                <span className="flex items-center gap-1">
                  <GraduationCap className="h-4 w-4 text-slate-400" />
                  {supervisor.university === 'Islamic University' ? 'الجامعة الإسلامية بغزة' : supervisor.university === 'Al-Azhar University' ? 'جامعة الأزهر' : 'جامعة الأقصى'}
                </span>
                <span className="text-slate-300">•</span>
                <span>{supervisor.department}</span>
                <span className="text-slate-300">•</span>
                <span className="font-mono text-xs text-rose-700 font-semibold">{supervisor.universityEmail}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 px-1.5 py-1.5 bg-slate-100 rounded-lg w-full md:w-auto">
            <button
              onClick={() => setActiveTab('roster')}
              className={`flex-1 md:flex-initial px-4 py-2 rounded-md text-sm font-medium transition ${
                activeTab === 'roster' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {lang === 'ar' ? 'الطلاب المشرف عليهم' : 'My Interns'}
            </button>
            <button
              onClick={() => setActiveTab('reports_review')}
              className={`flex-1 md:flex-initial px-4 py-2 rounded-md text-sm font-medium transition relative ${
                activeTab === 'reports_review' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>{lang === 'ar' ? 'مراجعة التقارير' : 'Review Reports'}</span>
              {pendingReportsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold">
                  {pendingReportsCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('final_grades')}
              className={`flex-1 md:flex-initial px-4 py-2 rounded-md text-sm font-medium transition ${
                activeTab === 'final_grades' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {lang === 'ar' ? 'إدخال التقييم الأكاديمي' : 'Final Jury Grading'}
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 md:flex-initial px-4 py-2 rounded-md text-sm font-medium transition relative ${
                activeTab === 'chat' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>{lang === 'ar' ? 'توجيه الطلاب' : 'Adviser Chat'}</span>
              {myMessages.filter(m => !m.isRead && m.senderId !== supervisor.id).length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold">
                  {myMessages.filter(m => !m.isRead && m.senderId !== supervisor.id).length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* Alerts and Quick Notices on missing reports as requested by SRS */}
        {missingReportStudents.length > 0 && activeTab === 'roster' && (
          <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-right flex items-start gap-3 flex-row-reverse text-xs text-amber-900 shadow-xs">
            <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
            <div className="flex-1">
              <strong className="font-bold text-sm text-slate-900 block mb-1">
                {lang === 'ar' ? '⚠️ تنبيه المتابعة الأكاديمية: طلاب تخلفوا عن مواعيد رفع التقارير!' : '⚠️ Academic Warning: Delayed Report Submissions'}
              </strong>
              <p className="leading-relaxed text-slate-700">
                {lang === 'ar' 
                  ? `الطلاب التالية أسماؤهم قاموا برفع أقل من تقريرين منذ بدء الفصل التدريبي الميداني الحالي. يرجى التواصل معهم عبر شات المنصة للتوجيه وحثّهم على تعبئة التقارير المتبقية تفادياً لعلامة الحرمان:` 
                  : `The following interns have recorded less than 2 weekly logs. Please reach out to them immediately to maintain training eligibility:`
                }
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {missingReportStudents.map(ms => (
                  <span key={ms.id} className="bg-amber-100 text-amber-950 font-semibold px-2.5 py-1 rounded border border-amber-300">
                    {ms.name} ( {ms.major.substring(0, 15)}... )
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          
          {/* TAB 1: Assigned students roster */}
          {activeTab === 'roster' && (
            <motion.div
              key="roster-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs text-right"
            >
              <div className="px-5 py-4 border-b border-slate-200 bg-slate-50">
                <h3 className="font-bold text-slate-900">{lang === 'ar' ? 'كشف طلاب شريحة الإشراف الميداني الفعلي' : 'Assigned Training Roster'}</h3>
                <p className="text-xs text-slate-400">{lang === 'ar' ? 'قائمة الطلبة المسجلين تحت مسؤوليتك الأكاديمية وحالة التحاقهم بالمؤسسات الشريكة بغزة.' : 'All student details, placement corporate, and reports activity.'}</p>
              </div>

              {myStudents.length === 0 ? (
                <div className="p-12 text-center text-slate-500">
                  <Users className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                  <p>{lang === 'ar' ? 'ليس لديك طلاب مسجلين للإشراف في هذا الفصل حالياً.' : 'No students assigned beneath your desk currently.'}</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-150">
                  {myStudents.map(student => {
                    const sReports = reports.filter(r => r.studentId === student.id);
                    const sEval = evaluations.find(e => e.studentId === student.id);
                    const placement = sEval ? providers.find(p => p.id === sEval.providerId) : null;

                    return (
                      <div key={student.id} className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-slate-50 transition">
                        
                        <div className="space-y-1">
                          <h4 className="font-bold text-slate-950 text-sm">{student.name}</h4>
                          <p className="text-xs text-indigo-700 font-semibold">{student.major}</p>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400 mt-1">
                            <span>{lang === 'ar' ? `رقم الطالب: ${student.studentId}` : `ID: ${student.studentId}`}</span>
                            <span>•</span>
                            <span className="font-mono">{student.universityEmail}</span>
                            <span>•</span>
                            <span>{lang === 'ar' ? `الجوال: ${student.phone}` : `Phone: ${student.phone}`}</span>
                          </div>

                          <div className="pt-2 text-xs">
                            <span className="text-slate-500">{lang === 'ar' ? 'مؤسسة التدريب المنتسب لها:' : 'Placement Agency:'}</span>
                            {placement ? (
                              <strong className="text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded mr-1">
                                {placement.companyName}
                              </strong>
                            ) : (
                              <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded text-[11px] mr-1">
                                {lang === 'ar' ? 'قيد التقدم والالتحاق ولم يُقبل بعد' : 'Unplaced / Applying'}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-end flex-col gap-1.5 shrink-0 self-start md:self-center">
                          <div className="text-xs uppercase bg-slate-100 px-3 py-1.5 rounded-lg text-slate-700 font-medium">
                            <strong>{sReports.length}</strong> {lang === 'ar' ? 'تقارير مرفوعة بالموقع' : 'reports logged'}
                          </div>

                          {sEval?.isAdminApproved ? (
                            <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">
                              {lang === 'ar' ? `الدرجة النهائية المعتمدة: ${sEval.calculatedGrade}/100` : `Final grade: ${sEval.calculatedGrade}`}
                            </span>
                          ) : sEval?.providerSubmittedDate ? (
                            <span className="text-[10px] bg-indigo-100 text-indigo-800 px-2.5 py-1 rounded-full font-bold border border-indigo-200">
                              {lang === 'ar' ? 'تقييم الشركة جاهز - بانتظار إدخالك' : 'Provider graded - Jury pending'}
                            </span>
                          ) : (
                            <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                              {lang === 'ar' ? 'قيد العمليات الميدانية' : 'Active training period'}
                            </span>
                          )}
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 2: Review student reports */}
          {activeTab === 'reports_review' && (
            <motion.div
              key="reports-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-right"
            >
              {/* Feedback Form */}
              <div className="lg:col-span-1 bg-white p-5 rounded-xl border border-slate-200 h-fit shadow-xs">
                <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2 justify-end">
                  <FileText className="h-4.5 w-4.5 text-indigo-500" />
                  <span>{lang === 'ar' ? 'كتابة ملاحظات المراجعة للتقرير' : 'Add Report Feedback'}</span>
                </h3>

                {studentReports.filter(r => !r.isReviewed).length === 0 ? (
                  <p className="text-slate-500 text-xs py-6 text-center bg-slate-50 rounded mt-4">
                    {lang === 'ar' 
                      ? 'لا يوجد أي تقارير معلقة بانتظار المراجعة حالياً. عمل مذهل!' 
                      : 'All student reports from your interns reviewed.'
                    }
                  </p>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="space-y-4 mt-4 select-text">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">{lang === 'ar' ? 'اختر التقرير المراد التعليق عليه:' : 'Select pending log'}</label>
                      <select
                        value={selectedReportId}
                        onChange={(e) => setSelectedReportId(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-rose-500 text-right"
                        required
                      >
                        <option value="">-- {lang === 'ar' ? 'اختر تقرير الطالب مع رقم الأسبوع' : 'Choose report'} --</option>
                        {studentReports.filter(r => !r.isReviewed).map(r => (
                          <option key={r.id} value={r.id}>
                            {r.studentName} - {lang === 'ar' ? `الأسبوع ${r.weekNumber}` : `Week ${r.weekNumber}`} ({r.reportDate})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">{lang === 'ar' ? 'التوجيه والملاحظات والتعليق الإرشادي:' : 'Supervisor Feedback Remarks'}</label>
                      <textarea
                        rows={5}
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        placeholder="وجه الطالب لتحسين الأداء أو تدوين الثناء والملاحظات..."
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-rose-500 text-right"
                        required
                      ></textarea>
                    </div>

                    {feedbackSuccess && (
                      <div className="bg-emerald-50 text-emerald-850 p-2 text-xs rounded border border-emerald-100 text-center">
                        {lang === 'ar' ? 'تثبيت وحفظ التقييم مع كود المراجعة!' : 'Review saved successfully!'}
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 rounded-lg text-xs transition"
                    >
                      {lang === 'ar' ? 'حفظ وإرسال الملاحظات للطالب' : 'Save & Push Feedback'}
                    </button>
                  </form>
                )}
              </div>

              {/* Reports List */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                  <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-3">
                    {lang === 'ar' ? 'التقارير الأسبوعية المرفوعة من طلابك' : 'Review Interns Weekly Logs Catalog'}
                  </h3>

                  {studentReports.length === 0 ? (
                    <div className="py-12 text-center text-slate-500">
                      <FileText className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                      <p>{lang === 'ar' ? 'لا يوجد تقارير تتبع مرفوعة حالياً من قبل متدربيك.' : 'No reports submitted by your student interns.'}</p>
                    </div>
                  ) : (
                    <div className="space-y-4 mt-4 select-text font-sans">
                      {studentReports.map(rep => (
                        <div key={rep.id} className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
                          <div className="flex justify-between items-center bg-white p-2.5 rounded-md border border-slate-150">
                            <div>
                              <strong className="text-slate-900 font-extrabold text-xs block mr-1 text-right">{rep.studentName}</strong>
                              <span className="text-[11px] font-semibold text-rose-700 block text-right">
                                {lang === 'ar' ? `الأسبوع التدريبي رقم [ ${rep.weekNumber} ]` : `Training Week ${rep.weekNumber}`}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-500">
                                <strong>{rep.trainingHours}</strong> {lang === 'ar' ? 'ساعة عمل' : 'Hrs'}
                              </span>
                              <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                                rep.isReviewed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-805'
                              }`}>
                                {rep.isReviewed ? (lang === 'ar' ? 'تمت المراجعة والاعتماد' : 'معلّق بانتظارك') : (lang === 'ar' ? 'معلّق بانتظارك' : 'Pending')}
                              </span>
                            </div>
                          </div>

                          <div className="text-xs space-y-2 leading-relaxed text-slate-700">
                            <div>
                              <strong className="text-slate-800 text-[11px] block">{lang === 'ar' ? '● مهام العمل المنفذة بالشركة:' : '• Tasks logged:'}</strong>
                              <p className="bg-white p-2.5 rounded border border-slate-150 mt-1">{rep.completedTasks}</p>
                            </div>
                            <div>
                              <strong className="text-slate-800 text-[11px] block">{lang === 'ar' ? '● التحديات اللوجستية والفنية:' : '• Roadblocks counteracted:'}</strong>
                              <p className="bg-white p-2.5 rounded border border-slate-150 mt-1 text-slate-600">{rep.challenges}</p>
                            </div>
                          </div>

                          {rep.fileAttachments && rep.fileAttachments.length > 0 && (
                            <span className="inline-block text-[10px] text-indigo-700 bg-white border px-2 py-0.5 rounded font-mono">
                              📎 {lang === 'ar' ? `الملف المرفق المرجعي: ${rep.fileAttachments[0].name}` : `Documentation file: ${rep.fileAttachments[0].name}`}
                            </span>
                          )}

                          {rep.supervisorFeedback && (
                            <div className="p-3 bg-emerald-50 rounded border-r-4 border-emerald-500 text-xs">
                              <strong className="text-emerald-950 font-bold block mb-1">{lang === 'ar' ? 'تعليقك المسجل:' : 'Your Logged Comments:'}</strong>
                              <p className="text-emerald-800 italic">"{rep.supervisorFeedback}"</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 3: Academic grading presentation jury */}
          {activeTab === 'final_grades' && (
            <motion.div
              key="final-grades-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs text-right select-text"
            >
              <div className="border-b border-slate-150 pb-3">
                <h3 className="font-bold text-slate-900 flex items-center gap-1.5 justify-end">
                  <Star className="h-5 w-5 text-rose-500 fill-rose-500" />
                  <span>{lang === 'ar' ? 'رصد درجات المشرف والتقييم الأكاديمي التراكمي' : 'Academic Evaluation & Defence Defense Grading'}</span>
                </h3>
                <p className="text-xs text-slate-400">{lang === 'ar' ? 'يمنح المشرف علامة من ٥٠٪ (٢٥٪ جودة رفع وقراءة التقارير، ٢٥٪ لمناقشة التقرير الفني والمشروع الميداني أمام اللجنة).' : 'Grade students from 50 (25 for reports quality, 25 for panel presentation defense).'}</p>
              </div>

              {myStudents.length === 0 ? (
                <p className="text-slate-500 text-xs text-center py-6">{lang === 'ar' ? 'لا يوجد طلاب مسجلين للتقييم.' : 'No student assigned.'}</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  {/* Evaluation form */}
                  <form onSubmit={handleGradingSubmit} className="md:col-span-1 space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">{lang === 'ar' ? 'اختر الطالب للرَّصد:' : 'Trainee student'}</label>
                      <select
                        value={selectedStudentGradeId}
                        onChange={(e) => {
                          const sId = e.target.value;
                          setSelectedStudentGradeId(sId);
                          const existingEv = evaluations.find(ev => ev.studentId === sId);
                          if (existingEv) {
                            setScoreReports(existingEv.reportsScore);
                            setScoreDefense(existingEv.finalDefenseScore);
                            setIntelNotes(existingEv.supervisorNotes);
                          } else {
                            setScoreReports(22);
                            setScoreDefense(23);
                            setIntelNotes('');
                          }
                        }}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-right"
                        required
                      >
                        <option value="">-- {lang === 'ar' ? 'اختر الطالب' : 'Select Intern'} --</option>
                        {myStudents.map(s => (
                          <option key={s.id} value={s.id}>{s.name} ({s.studentId})</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span className="font-semibold text-slate-700">{lang === 'ar' ? 'درجة التقييم الفني للملف والتقارير (من ٢٥):' : 'Reports quality (Max 25):'}</span>
                          <strong className="font-mono text-indigo-900">{scoreReports} / 25</strong>
                        </div>
                        <input
                          type="range" min={0} max={25} value={scoreReports}
                          onChange={(e) => setScoreReports(Number(e.target.value))}
                          className="w-full accent-rose-600 cursor-pointer"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span className="font-semibold text-slate-700">{lang === 'ar' ? 'درجة مناقشة لجنة التحكيم الأكاديمية (من ٢٥):' : 'Defense jury (Max 25):'}</span>
                          <strong className="font-mono text-indigo-900">{scoreDefense} / 25</strong>
                        </div>
                        <input
                          type="range" min={0} max={25} value={scoreDefense}
                          onChange={(e) => setScoreDefense(Number(e.target.value))}
                          className="w-full accent-rose-600 cursor-pointer"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">{lang === 'ar' ? 'ملاحظات وتوصيات التقرير الأكاديمي:' : 'Jury advisory notes'}</label>
                      <textarea
                        rows={3}
                        value={intelNotes}
                        onChange={(e) => setIntelNotes(e.target.value)}
                        placeholder="دون الملاحظات والقرارات التي تم اتخاذها في جلسة الدفاع الأكاديمية..."
                        className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-rose-500 text-right"
                        required
                      ></textarea>
                    </div>

                    {gradingSuccess && (
                      <div className="bg-emerald-50 text-emerald-800 p-2 text-xs rounded border border-emerald-100 text-center">
                        {lang === 'ar' ? 'تم حفظ التقييم الأكاديمي بنجاح!' : 'Academic grading registered!'}
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 rounded-lg text-xs transition"
                    >
                      {lang === 'ar' ? 'حفظ رصد العلامات' : 'Save & Publish Grade'}
                    </button>
                  </form>

                  {/* Registered overview list */}
                  <div className="md:col-span-2 space-y-3.5">
                    <h4 className="font-bold text-xs text-slate-500 uppercase tracking-wider">{lang === 'ar' ? 'وضع الدرجات للطلاب المشرف عليهم' : 'Students performance overview'}</h4>
                    {myStudents.map(student => {
                      const studentEval = evaluations.find(e => e.studentId === student.id);
                      return (
                        <div key={student.id} className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                          <div className="flex justify-between items-center pb-1">
                            <strong className="text-slate-950 text-xs font-bold">{student.name}</strong>
                            <span className="text-[11px] text-slate-400 font-mono">ID: {student.studentId}</span>
                          </div>

                          {studentEval ? (
                            <div className="mt-2 space-y-2 text-xs">
                              <div className="flex justify-between items-center bg-white p-2 rounded border border-slate-150">
                                <span>{lang === 'ar' ? '● علامة جودة التقارير الميدانية:' : '• Reports score:'}</span>
                                <strong className="font-mono">{studentEval.reportsScore} / 25</strong>
                              </div>
                              <div className="flex justify-between items-center bg-white p-2 rounded border border-slate-150">
                                <span>{lang === 'ar' ? '● مناقشة اللجنة الفنية والدفاع:' : '• Defence jury score:'}</span>
                                <strong className="font-mono">{studentEval.finalDefenseScore} / 25</strong>
                              </div>
                              <div className="bg-white p-2 text-slate-500 rounded border mt-2">
                                <strong>{lang === 'ar' ? 'توصيات الجنة:' : 'Panel Notes:'}</strong> "{studentEval.supervisorNotes || 'لا توجد ملاحظات مدونة'}"
                              </div>

                              <div className="pt-2 flex justify-between items-center text-[10px] text-slate-405">
                                <span>{lang === 'ar' ? `رصد بـ: ${studentEval.supervisorSubmittedDate || '2026-06-20'}` : `Saved: ${studentEval.supervisorSubmittedDate || '2026'}`}</span>
                                <span className="text-rose-700 font-bold font-mono">
                                  {lang === 'ar' ? `الممنوح منكم: ${studentEval.reportsScore + studentEval.finalDefenseScore} / 50` : `Supervisor: ${studentEval.reportsScore + studentEval.finalDefenseScore} / 50`}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="mt-2 text-xs py-2 bg-amber-50 border border-amber-100 text-amber-700 rounded text-center">
                              {lang === 'ar' ? 'لم تمنح الدرجات بعد لهذا المتدرب. املأ الاستمارة لتوثيقه.' : 'Pending supervisor evaluation inputs.'}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 4: Communications and Direct chat with students */}
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
                    <h3 className="font-bold text-slate-900 text-sm">{lang === 'ar' ? 'قنوات التوجيه والإرشاد الأكاديمي' : 'Adviser Channels'}</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">{lang === 'ar' ? 'تفاعل فوري وتتبع خطط التدريب.' : 'Direct messages logs with interns.'}</p>
                  </div>
                  
                  <div className="divide-y divide-slate-150">
                    {chatPartners.length === 0 ? (
                      <div className="p-4 text-center text-slate-400 text-xs">
                        <p>{lang === 'ar' ? 'لا توجد قنوات تواصل مفعلة حالياً. يمكنك التراسل فور اعتماد وقبول طلاب تحت إشرافك في جهات التدريب.' : 'No active communication channels yet. You can chat once students under your supervision are accepted at training providers.'}</p>
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
                              isActive ? 'bg-rose-50 border-r-4 border-rose-600' : 'bg-transparent hover:bg-slate-100'
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
              <div className="md:col-span-2 flex flex-col justify-between h-[400px] md:h-full bg-slate-100 min-h-0">
                {activeChatPartner ? (
                  <>
                    <div className="p-3.5 bg-white border-b border-slate-200 flex justify-between items-center px-5">
                      <div className="text-right">
                        <h4 className="font-bold text-slate-900 text-xs">{activeChatPartner.name}</h4>
                        <span className="text-[10px] text-rose-600 font-semibold">{activeChatPartner.roleLabel}</span>
                      </div>
                      <span className="text-[10px] uppercase font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded">
                        {lang === 'ar' ? 'بوابة الأستاذ الميداني' : 'Supervisor Portal'}
                      </span>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3.5 select-text min-h-0">
                      {activeConversation.length === 0 ? (
                        <div className="text-center py-12 text-slate-400 text-xs">
                          <MessageSquare className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                          <p>{lang === 'ar' ? 'ابدأ دردشة فنية مع المتدرب أو الشركة لتنسيق وتثبيت الأهداف وعقود العمل.' : 'Send a message to sync coordinates or schedule live defense.'}</p>
                        </div>
                      ) : (
                        activeConversation.map(msg => {
                          const isMe = msg.senderId === supervisor.id;
                          return (
                            <div key={msg.id} className={`flex ${isMe ? 'justify-start' : 'justify-end'}`}>
                              <div className={`max-w-md p-3 rounded-lg text-xs leading-relaxed ${
                                isMe 
                                  ? 'bg-rose-600 text-white rounded-br-none shadow-sm' 
                                  : 'bg-white border border-slate-300 text-slate-800 rounded-bl-none shadow-xs'
                              }`}>
                                <p className="text-right">{msg.content}</p>
                                <span className={`block text-[8px] mt-1.5 text-left font-mono ${isMe ? 'text-rose-200' : 'text-slate-400'}`}>
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
                        className="flex-1 bg-slate-50 border border-slate-300 text-xs rounded-lg px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white text-right"
                      />
                      <button
                        type="submit"
                        className="bg-rose-600 hover:bg-rose-700 text-white rounded-lg p-2.5 transition flex items-center justify-center shrink-0 w-11 h-11"
                      >
                        <Send className="h-4 w-4 rotate-180" />
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center p-6 text-slate-400">
                    <MessageSquare className="h-10 w-10 text-slate-300 mb-2" />
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
