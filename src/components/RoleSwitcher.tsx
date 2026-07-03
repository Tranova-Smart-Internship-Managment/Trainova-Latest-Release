import { useState } from 'react';
import { Shield, Users, RefreshCw, Languages, GraduationCap, Building2, UserCheck, HelpCircle } from 'lucide-react';

interface RoleSwitcherProps {
  currentRole: 'student' | 'provider' | 'supervisor' | 'admin';
  onChangeRole: (role: 'student' | 'provider' | 'supervisor' | 'admin') => void;
  currentLang: 'ar' | 'en';
  onChangeLang: (lang: 'ar' | 'en') => void;
  activeUserId: string;
  onChangeUser: (userId: string) => void;
  students: any[];
  providers: any[];
  supervisors: any[];
  onResetData: () => void;
  isAuthenticated: boolean;
  onLogout: () => void;
}

export default function RoleSwitcher({
  currentRole,
  onChangeRole,
  currentLang,
  onChangeLang,
  activeUserId,
  onChangeUser,
  students,
  providers,
  supervisors,
  onResetData,
  isAuthenticated,
  onLogout
}: RoleSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getActiveRoleLabel = () => {
    if (currentLang === 'ar') {
      switch (currentRole) {
        case 'student': return 'بوابة الطالب';
        case 'provider': return 'جهة التدريب';
        case 'supervisor': return 'المشرف الأكاديمي';
        case 'admin': return 'إدارة الجامعة';
      }
    } else {
      switch (currentRole) {
        case 'student': return 'Student Portal';
        case 'provider': return 'Training Provider';
        case 'supervisor': return 'Academic Supervisor';
        case 'admin': return 'University Admin';
      }
    }
  };

  const getActiveUserEmail = () => {
    if (currentRole === 'student') {
      const s = students.find(x => x.id === activeUserId);
      return s ? s.universityEmail : '';
    }
    if (currentRole === 'provider') {
      const p = providers.find(x => x.id === activeUserId);
      return p ? p.email : '';
    }
    if (currentRole === 'supervisor') {
      const sup = supervisors.find(x => x.id === activeUserId);
      return sup ? sup.universityEmail : '';
    }
    return 'admin@trainova.edu.ps';
  };

  return (
    <div className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50 transition-all shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-4">
        
        {/* Brand Meta with Gaza Location badge */}
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-indigo-600 to-indigo-400 p-1.5 rounded-lg flex items-center justify-center shadow-indigo-950/40 shadow-md">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight font-sans bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-sky-200">
                Trainova
              </span>
              <span className="text-[10px] uppercase font-mono bg-indigo-500/10 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-500/20">
                Gaza Domain
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-sans leading-none mt-0.5">
              {currentLang === 'ar' ? 'منصة تنسيق التدريب الميداني بغزة' : 'Gaza Internship Management Engine'}
            </p>
          </div>
        </div>

        {/* Interaction Center */}
        <div className="flex items-center gap-3 flex-wrap">
          
          {/* Language Selector */}
          <button
            onClick={() => onChangeLang(currentLang === 'ar' ? 'en' : 'ar')}
            className="flex items-center gap-1.5 text-xs font-sans px-2.5 py-1.5 rounded-md text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition"
            title="Toggle Language / تغيير اللغة"
          >
            <Languages className="h-3.5 w-3.5" />
            <span>{currentLang === 'ar' ? 'English' : 'العربية'}</span>
          </button>

          {/* Reset simulation data */}
          <button
            onClick={() => {
              if (confirm(currentLang === 'ar' ? 'هل تود استعادة البيانات الافتراضية للمنصة؟ سيتم مسح أي تدريب أو تقرير قمت بإضافته.' : 'Reset all simulation data to system defaults? Any updates will be cleared.')) {
                onResetData();
              }
            }}
            className="flex items-center gap-1 bg-slate-800 hover:bg-red-950/40 text-slate-300 hover:text-red-400 px-2.5 py-1.5 rounded-md text-xs transition border border-slate-700 hover:border-red-900/30"
            title="Reset simulation data to default / تصفير البيانات"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{currentLang === 'ar' ? 'إعادة ضبط المنصة' : 'Reset Platform'}</span>
          </button>

          {/* Sign Out Button */}
          {isAuthenticated && (
            <button
              onClick={onLogout}
              className="flex items-center gap-1 bg-red-600/15 hover:bg-red-600 text-red-400 hover:text-white px-2.5 py-1.5 rounded-md text-xs transition border border-red-500/20 font-bold shadow-md cursor-pointer"
              title="Sign Out / تسجيل الخروج"
            >
              <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>{currentLang === 'ar' ? 'تسجيل الخروج' : 'Log Out'}</span>
            </button>
          )}

        </div>
      </div>

      {/* Identity Sub-bar highlighting who you are acting as */}
      <div className="bg-slate-950 py-1.5 px-4 sm:px-6 lg:px-8 border-t border-slate-900 text-xs flex justify-between items-center text-slate-400 flex-wrap gap-2">
        <div className="flex items-center gap-2 font-sans text-[11px] flex-wrap">
          <span className="text-sky-400">● {currentLang === 'ar' ? 'متصل الآن بصفة' : 'Online as'} :</span>
          <span className="font-semibold text-slate-200">{getActiveRoleLabel()}</span>
          {currentRole !== 'admin' && (
            <>
              <span className="text-slate-600">|</span>
              <span className="text-slate-300 flex items-center gap-1.5">
                <span className="text-slate-400">
                  {currentLang === 'ar' ? 'المستخدم النشط:' : 'Active User:'}
                </span>
                
                {currentRole === 'student' && (
                  <select
                    value={activeUserId}
                    onChange={(e) => onChangeUser(e.target.value)}
                    className="bg-slate-800 text-slate-100 font-sans text-xs border border-slate-700 rounded px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer text-right"
                  >
                    {students.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                )}

                {currentRole === 'provider' && (
                  <select
                    value={activeUserId}
                    onChange={(e) => onChangeUser(e.target.value)}
                    className="bg-slate-800 text-slate-100 font-sans text-xs border border-slate-700 rounded px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer text-right"
                  >
                    {providers.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.companyName}
                      </option>
                    ))}
                  </select>
                )}

                {currentRole === 'supervisor' && (
                  <select
                    value={activeUserId}
                    onChange={(e) => onChangeUser(e.target.value)}
                    className="bg-slate-800 text-slate-100 font-sans text-xs border border-slate-700 rounded px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer text-right"
                  >
                    {supervisors.map(sup => (
                      <option key={sup.id} value={sup.id}>
                        {sup.name}
                      </option>
                    ))}
                  </select>
                )}
              </span>
            </>
          )}
          <span className="text-slate-600">|</span>
          <span className="font-mono text-slate-400">{getActiveUserEmail()}</span>
        </div>
      </div>

    </div>
  );
}
