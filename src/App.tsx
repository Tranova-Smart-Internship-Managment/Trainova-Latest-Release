import { useState, useEffect } from 'react';
import { 
  Student, TrainingProvider, Supervisor, Opportunity, Application, WeeklyReport, Message, Evaluation 
} from './types';
import { 
  INITIAL_STUDENTS, INITIAL_SUPERVISORS, INITIAL_PROVIDERS, INITIAL_OPPORTUNITIES, 
  INITIAL_APPLICATIONS, INITIAL_REPORTS, INITIAL_MESSAGES, INITIAL_EVALUATIONS, 
  getSavedState, saveState 
} from './data/mockData';
import RoleSwitcher from './components/RoleSwitcher';
import StudentDashboard from './components/StudentDashboard';
import ProviderDashboard from './components/ProviderDashboard';
import SupervisorDashboard from './components/SupervisorDashboard';
import AdminDashboard from './components/AdminDashboard';
import LoginRegister from './components/LoginRegister';

export default function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('trainova_auth') === 'true';
  });

  // Locale state
  const [lang, setLang] = useState<'ar' | 'en'>(() => {
    return localStorage.getItem('trainova_lang') as 'ar' | 'en' || 'ar';
  });

  // Current simulation identity details
  const [role, setRole] = useState<'student' | 'provider' | 'supervisor' | 'admin'>(() => {
    return localStorage.getItem('trainova_role') as any || 'student';
  });

  const [activeUserId, setActiveUserId] = useState<string>(() => {
    return localStorage.getItem('trainova_active_id') || 'std-001';
  });

  // Data persistence layers
  const [students, setStudents] = useState<Student[]>(() => getSavedState('students', INITIAL_STUDENTS));
  const [supervisors, setSupervisors] = useState<Supervisor[]>(() => getSavedState('supervisors', INITIAL_SUPERVISORS));
  const [providers, setProviders] = useState<TrainingProvider[]>(() => getSavedState('providers', INITIAL_PROVIDERS));
  const [opportunities, setOpportunities] = useState<Opportunity[]>(() => getSavedState('opportunities', INITIAL_OPPORTUNITIES));
  const [applications, setApplications] = useState<Application[]>(() => getSavedState('applications', INITIAL_APPLICATIONS));
  const [reports, setReports] = useState<WeeklyReport[]>(() => getSavedState('reports', INITIAL_REPORTS));
  const [messages, setMessages] = useState<Message[]>(() => getSavedState('messages', INITIAL_MESSAGES));
  const [evaluations, setEvaluations] = useState<Evaluation[]>(() => getSavedState('evaluations', INITIAL_EVALUATIONS));

  // Sync lang, role, active user into localStorage for consistency between page reloads
  useEffect(() => {
    localStorage.setItem('trainova_lang', lang);
    localStorage.setItem('trainova_role', role);
    localStorage.setItem('trainova_active_id', activeUserId);
    localStorage.setItem('trainova_auth', isAuthenticated ? 'true' : 'false');
    
    // Set document orientation based on translation language chosen
    document.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang, role, activeUserId, isAuthenticated]);

  const handleRoleChange = (newRole: 'student' | 'provider' | 'supervisor' | 'admin') => {
    setRole(newRole);
    if (newRole === 'student' && students.length > 0) {
      setActiveUserId(students[0].id);
    } else if (newRole === 'provider' && providers.length > 0) {
      setActiveUserId(providers[0].id);
    } else if (newRole === 'supervisor' && supervisors.length > 0) {
      setActiveUserId(supervisors[0].id);
    } else if (newRole === 'admin') {
      setActiveUserId('admin-root');
    }
  };

  const handleUserChange = (userId: string) => {
    setActiveUserId(userId);
  };

  const handleLangChange = (newLang: 'ar' | 'en') => {
    setLang(newLang);
  };

  // Auth Operations
  const handleLoginSuccess = (userId: string, newRole: 'student' | 'provider' | 'supervisor' | 'admin') => {
    setActiveUserId(userId);
    setRole(newRole);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleRegisterStudentRegister = (newStudent: any) => {
    const updated = [...students, newStudent];
    setStudents(updated);
    saveState('students', updated);
  };

  const handleRegisterSupervisorRegister = (newSupervisor: any) => {
    const updated = [...supervisors, newSupervisor];
    setSupervisors(updated);
    saveState('supervisors', updated);
  };

  const handleRegisterProviderRegister = (newProvider: any) => {
    const updated = [...providers, newProvider];
    setProviders(updated);
    saveState('providers', updated);
  };

  // Re-usable helper to recalculate evaluations score
  const recalculateAndSaveGrades = (currentEvals: Evaluation[]) => {
    const updated = currentEvals.map(e => {
      if (e.providerSubmittedDate && e.supervisorSubmittedDate) {
        const providerSum = e.attendance + e.commitment + e.technicalSkills + e.teamwork;
        const supervisorSum = e.reportsScore + e.finalDefenseScore;
        return {
          ...e,
          calculatedGrade: providerSum + supervisorSum
        };
      }
      return e;
    });
    setEvaluations(updated);
    saveState('evaluations', updated);
  };

  // Student Actions
  const handleApply = (oppId: string, cvName: string) => {
    const opp = opportunities.find(o => o.id === oppId);
    if (!opp) return;
    const currentStudent = students.find(s => s.id === activeUserId);
    if (!currentStudent) return;

    const newApp: Application = {
      id: `app-custom-${Date.now()}`,
      studentId: activeUserId,
      studentName: currentStudent.name,
      studentMajor: currentStudent.major,
      studentUniversity: currentStudent.university === 'Islamic University' ? 'الجامعة الإسلامية بغزة' : currentStudent.university === 'Al-Azhar University' ? 'جامعة الأزهر' : 'جامعة الأقصى',
      opportunityId: oppId,
      opportunityTitle: opp.title,
      providerId: opp.providerId,
      providerName: opp.providerName,
      appliedDate: new Date().toISOString().split('T')[0],
      cvName,
      cvUrl: '#',
      status: 'pending'
    };
    
    const updated = [...applications, newApp];
    setApplications(updated);
    saveState('applications', updated);
  };

  const handleSubmitReport = (report: Partial<WeeklyReport>) => {
    const currentStudent = students.find(s => s.id === activeUserId);
    if (!currentStudent) return;

    const newRep: WeeklyReport = {
      id: `rep-custom-${Date.now()}`,
      studentId: activeUserId,
      studentName: currentStudent.name,
      weekNumber: report.weekNumber || 1,
      reportDate: report.reportDate || new Date().toISOString().split('T')[0],
      trainingHours: report.trainingHours || 35,
      completedTasks: report.completedTasks || '',
      challenges: report.challenges || '',
      fileAttachments: report.fileAttachments || [],
      submitDate: report.submitDate || new Date().toISOString().split('T')[0],
      isLate: report.isLate || false,
      isReviewed: false
    };

    const updated = [...reports, newRep];
    setReports(updated);
    saveState('reports', updated);
  };

  // Provider Actions
  const handleCreateOpportunity = (opp: Partial<Opportunity>) => {
    const currentProv = providers.find(p => p.id === activeUserId);
    if (!currentProv) return;

    const newOpp: Opportunity = {
      id: `opp-custom-${Date.now()}`,
      providerId: activeUserId,
      providerName: currentProv.companyName,
      title: opp.title || '',
      description: opp.description || '',
      requiredMajor: opp.requiredMajor || '',
      requiredSkills: opp.requiredSkills || [],
      availablePositions: opp.availablePositions || 1,
      location: opp.location || '',
      deadline: opp.deadline || '',
      status: 'active',
      durationWeeks: opp.durationWeeks || 12
    };

    const updated = [...opportunities, newOpp];
    setOpportunities(updated);
    saveState('opportunities', updated);
  };

  const handleUpdateOpportunityStatus = (oppId: string, status: 'active' | 'closed') => {
    const updated = opportunities.map(o => o.id === oppId ? { ...o, status } : o);
    setOpportunities(updated);
    saveState('opportunities', updated);
  };

  const handleReviewApplication = (appId: string, status: 'accepted' | 'rejected', notes: string) => {
    const updated = applications.map(a => {
      if (a.id === appId) {
        if (status === 'accepted') {
          const exists = evaluations.some(e => e.studentId === a.studentId);
          if (!exists) {
            const currentStudent = students.find(s => s.id === a.studentId);
            const supervisorId = currentStudent?.supervisorId || 'sup-001';
            const supName = supervisors.find(sup => sup.id === supervisorId)?.name || 'د. أحمد رضوان';

            const newEval: Evaluation = {
              id: `eval-custom-${Date.now()}`,
              studentId: a.studentId,
              studentName: a.studentName,
              studentMajor: a.studentMajor,
              studentUniversity: a.studentUniversity,
              providerId: a.providerId,
              providerName: a.providerName,
              supervisorId,
              supervisorName: supName,
              attendance: 10,
              commitment: 10,
              technicalSkills: 12,
              teamwork: 13,
              providerNotes: '',
              reportsScore: 22,
              finalDefenseScore: 0,
              supervisorNotes: '',
              calculatedGrade: null,
              isAdminApproved: false
            };
            const updatedEvals = [...evaluations, newEval];
            setEvaluations(updatedEvals);
            saveState('evaluations', updatedEvals);
          }
        }
        return { ...a, status, notes };
      }
      return a;
    });

    setApplications(updated);
    saveState('applications', updated);
  };

  const handleSubmitEvaluation = (
    studentId: string, 
    scores: { attendance: number; commitment: number; technicalSkills: number; teamwork: number; notes: string }
  ) => {
    const updated = evaluations.map(e => {
      if (e.studentId === studentId && e.providerId === activeUserId) {
        return {
          ...e,
          attendance: scores.attendance,
          commitment: scores.commitment,
          technicalSkills: scores.technicalSkills,
          teamwork: scores.teamwork,
          providerNotes: scores.notes,
          providerSubmittedDate: new Date().toISOString().split('T')[0]
        };
      }
      return e;
    });

    recalculateAndSaveGrades(updated);
  };

  // Supervisor Actions
  const handleReviewReport = (reportId: string, feedback: string) => {
    const updated = reports.map(r => r.id === reportId ? { ...r, isReviewed: true, supervisorFeedback: feedback } : r);
    setReports(updated);
    saveState('reports', updated);
  };

  const handleSubmitSupervisorEvaluation = (
    studentId: string, 
    scores: { reportsScore: number; finalDefenseScore: number; notes: string }
  ) => {
    const updated = evaluations.map(e => {
      if (e.studentId === studentId && e.supervisorId === activeUserId) {
        return {
          ...e,
          reportsScore: scores.reportsScore,
          finalDefenseScore: scores.finalDefenseScore,
          supervisorNotes: scores.notes,
          supervisorSubmittedDate: new Date().toISOString().split('T')[0]
        };
      }
      return e;
    });

    recalculateAndSaveGrades(updated);
  };

  // Message Delivery Logic
  const handleSendMessage = (receiverId: string, receiverRole: any, content: string) => {
    const senderName = activeUserId === 'admin-root' 
      ? (lang === 'ar' ? 'إدارة المنصة والجامعة' : 'University Root Admin') 
      : role === 'student' 
        ? students.find(s => s.id === activeUserId)?.name || 'Student'
        : role === 'supervisor' 
          ? supervisors.find(s => s.id === activeUserId)?.name || 'Supervisor'
          : providers.find(p => p.id === activeUserId)?.companyName || 'Provider';

    let receiverName = '';
    if (receiverRole === 'student') {
      receiverName = students.find(s => s.id === receiverId)?.name || '';
    } else if (receiverRole === 'supervisor') {
      receiverName = supervisors.find(s => s.id === receiverId)?.name || '';
    } else if (receiverRole === 'provider') {
      receiverName = providers.find(p => p.id === receiverId)?.companyName || '';
    } else {
      receiverName = lang === 'ar' ? 'إدارة الجامعة' : 'University Registry Admin';
    }

    const newMsg: Message = {
      id: `msg-custom-${Date.now()}`,
      senderId: activeUserId === 'admin-root' ? 'admin' : activeUserId,
      senderName,
      senderRole: role === 'admin' ? 'admin' : role,
      receiverId,
      receiverName,
      receiverRole,
      content,
      timestamp: new Date().toISOString(),
      isRead: false
    };

    const updated = [...messages, newMsg];
    setMessages(updated);
    saveState('messages', updated);
  };

  // Admin Actions
  const handleUpdateStudentSupervisor = (studentId: string, supervisorId: string) => {
    const updatedStudents = students.map(s => s.id === studentId ? { ...s, supervisorId } : s);
    setStudents(updatedStudents);
    saveState('students', updatedStudents);

    const updatedEvals = evaluations.map(e => {
      if (e.studentId === studentId) {
        return {
          ...e,
          supervisorId,
          supervisorName: supervisors.find(x => x.id === supervisorId)?.name || 'مشرف'
        };
      }
      return e;
    });
    setEvaluations(updatedEvals);
    saveState('evaluations', updatedEvals);
  };

  const handleApproveEvaluation = (evaluationId: string) => {
    const updated = evaluations.map(e => e.id === evaluationId ? { ...e, isAdminApproved: true, approvalDate: new Date().toISOString().split('T')[0] } : e);
    setEvaluations(updated);
    saveState('evaluations', updated);
  };

  const handleAddStudent = (newStudent: any) => {
    const updated = [...students, newStudent];
    setStudents(updated);
    saveState('students', updated);
  };

  const handleAddSupervisor = (newSupervisor: any) => {
    const updated = [...supervisors, newSupervisor];
    setSupervisors(updated);
    saveState('supervisors', updated);
  };

  const handleApproveSupervisor = (supervisorId: string) => {
    const updated = supervisors.map(sup => sup.id === supervisorId ? { ...sup, isPendingApproval: false } : sup);
    setSupervisors(updated);
    saveState('supervisors', updated);
  };

  const handleRejectSupervisor = (supervisorId: string) => {
    const updated = supervisors.filter(sup => sup.id !== supervisorId);
    setSupervisors(updated);
    saveState('supervisors', updated);
  };

  // Reset System Databases
  const handleResetData = () => {
    localStorage.clear();
    setStudents(INITIAL_STUDENTS);
    setSupervisors(INITIAL_SUPERVISORS);
    setProviders(INITIAL_PROVIDERS);
    setOpportunities(INITIAL_OPPORTUNITIES);
    setApplications(INITIAL_APPLICATIONS);
    setReports(INITIAL_REPORTS);
    setMessages(INITIAL_MESSAGES);
    setEvaluations(INITIAL_EVALUATIONS);
    setActiveUserId('std-001');
    setRole('student');
  };

  // Render the current active route/dashboard
  const renderDashboard = () => {
    switch (role) {
      case 'student':
        const studentObj = students.find(s => s.id === activeUserId) || students[0];
        return (
          <StudentDashboard
            student={studentObj}
            opportunities={opportunities}
            applications={applications}
            reports={reports}
            messages={messages}
            evaluations={evaluations}
            supervisors={supervisors}
            providers={providers}
            lang={lang}
            onApply={handleApply}
            onSubmitReport={handleSubmitReport}
            onSendMessage={handleSendMessage}
          />
        );
      case 'provider':
        const providerObj = providers.find(p => p.id === activeUserId) || providers[0];
        return (
          <ProviderDashboard
            provider={providerObj}
            opportunities={opportunities}
            applications={applications}
            students={students}
            supervisors={supervisors}
            messages={messages}
            evaluations={evaluations}
            lang={lang}
            onCreateOpportunity={handleCreateOpportunity}
            onUpdateOpportunityStatus={handleUpdateOpportunityStatus}
            onReviewApplication={handleReviewApplication}
            onSubmitEvaluation={handleSubmitEvaluation}
            onSendMessage={handleSendMessage}
          />
        );
      case 'supervisor':
        const supervisorObj = supervisors.find(sup => sup.id === activeUserId) || supervisors[0];
        return (
          <SupervisorDashboard
            supervisor={supervisorObj}
            students={students}
            applications={applications}
            reports={reports}
            messages={messages}
            evaluations={evaluations}
            providers={providers}
            lang={lang}
            onReviewReport={handleReviewReport}
            onSubmitSupervisorEvaluation={handleSubmitSupervisorEvaluation}
            onSendMessage={handleSendMessage}
          />
        );
      case 'admin':
        return (
          <AdminDashboard
            students={students}
            supervisors={supervisors}
            providers={providers}
            evaluations={evaluations}
            reports={reports}
            opportunities={opportunities}
            lang={lang}
            onUpdateStudentSupervisor={handleUpdateStudentSupervisor}
            onApproveEvaluation={handleApproveEvaluation}
            onAddStudent={handleAddStudent}
            onAddSupervisor={handleAddSupervisor}
            onApproveSupervisor={handleApproveSupervisor}
            onRejectSupervisor={handleRejectSupervisor}
          />
        );
    }
  };

  if (!isAuthenticated) {
    return (
      <LoginRegister
        lang={lang}
        onChangeLang={handleLangChange}
        students={students}
        providers={providers}
        supervisors={supervisors}
        onLoginSuccess={handleLoginSuccess}
        onRegisterStudent={handleRegisterStudentRegister}
        onRegisterSupervisor={handleRegisterSupervisorRegister}
        onRegisterProvider={handleRegisterProviderRegister}
      />
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 selection:bg-emerald-600 selection:text-white antialiased transition-all">
      <RoleSwitcher
        currentRole={role}
        onChangeRole={handleRoleChange}
        currentLang={lang}
        onChangeLang={handleLangChange}
        activeUserId={activeUserId}
        onChangeUser={handleUserChange}
        students={students}
        providers={providers}
        supervisors={supervisors}
        onResetData={handleResetData}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
      />
      
      <main className="transition-all duration-350">
        {renderDashboard()}
      </main>
    </div>
  );
}

