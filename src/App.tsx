import { useState, useEffect } from 'react';
import { dbService } from './services/db';
import type { School, User } from './services/db';
import { useTranslation } from './locales/translations';
import type { Language } from './locales/translations';
import { Dashboard } from './components/Dashboard';
import { StudentManagement } from './components/StudentManagement';
import { MarksManagement } from './components/MarksManagement';
import { ExcelUpload } from './components/ExcelUpload';
import { BrandingSettings } from './components/BrandingSettings';
import { PublicResultPortal } from './components/PublicResultPortal';
import { 
  School as SchoolIcon, 
  LayoutDashboard, 
  Users, 
  FileSpreadsheet, 
  GraduationCap, 
  Settings, 
  LogIn, 
  LogOut, 
  Globe, 
  Lock, 
  User as UserIcon,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import './App.css';

type ActiveView = 'public-portal' | 'login' | 'dashboard' | 'students' | 'marks' | 'upload' | 'settings';

function App() {
  const [activeView, setActiveView] = useState<ActiveView>('public-portal');
  const [language, setLanguage] = useState<Language>('en');
  const { t } = useTranslation(language);

  const [school, setSchool] = useState<School | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Auth Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Load school branding & current user session
  const loadSchoolAndUser = async () => {
    try {
      const data = await dbService.getSchoolSettings();
      setSchool(data);
      
      const user = await dbService.getCurrentUser();
      setCurrentUser(user);
      if (user && activeView === 'public-portal') {
        setActiveView('dashboard');
      }
    } catch (err) {
      console.error("Failed to load school/user data", err);
    }
  };

  useEffect(() => {
    loadSchoolAndUser();
  }, []);

  // Update URL state or view direct results if params are present
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hasParams = params.has('roll') && params.has('dob');
    if (hasParams && activeView !== 'public-portal') {
      setActiveView('public-portal');
    }
  }, [activeView]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      const user = await dbService.login(loginEmail, loginPassword);
      setCurrentUser(user);
      setActiveView('dashboard');
      setLoginEmail('');
      setLoginPassword('');
    } catch (err: any) {
      setAuthError(t('authError'));
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await dbService.logout();
    setCurrentUser(null);
    setActiveView('public-portal');
  };

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'en' ? 'te' : 'en'));
  };

  const navigateTo = (view: ActiveView) => {
    setActiveView(view);
  };

  // Nav link item configuration
  const navItems = [
    { view: 'dashboard', label: t('dashboard'), icon: LayoutDashboard, roles: ['admin', 'teacher'] },
    { view: 'students', label: t('studentManagement'), icon: Users, roles: ['admin', 'teacher'] },
    { view: 'marks', label: t('marksManagement'), icon: GraduationCap, roles: ['admin', 'teacher'] },
    { view: 'upload', label: t('excelUpload'), icon: FileSpreadsheet, roles: ['admin', 'teacher'] },
    { view: 'settings', label: t('schoolSettings'), icon: Settings, roles: ['admin'] }
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans selection:bg-blue-500/10 selection:text-blue-600">
      
      {/* ----------------------------------------------------
          NAVBAR / HEADER (Glassmorphic & Floating Design)
         ---------------------------------------------------- */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand Info */}
          <div className="flex items-center space-x-3">
            <div 
              onClick={() => navigateTo(currentUser ? 'dashboard' : 'public-portal')}
              className="flex items-center space-x-2.5 cursor-pointer hover:opacity-90 transition-opacity"
            >
              {school?.logo_url ? (
                <img 
                  src={school.logo_url} 
                  alt="School Logo" 
                  className="w-9 h-9 rounded-xl object-contain border border-slate-100 p-0.5 shadow-sm"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=200";
                  }}
                />
              ) : (
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-primary flex items-center justify-center border border-blue-100 shadow-sm">
                  <SchoolIcon className="h-5 w-5" />
                </div>
              )}
              <div>
                <h1 className="text-sm sm:text-base font-bold tracking-tight text-slate-900 leading-none">
                  {school ? school.school_name : t('portalTitle')}
                </h1>
                <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-0.5 block">
                  {school ? `${school.address.split(',')[1] || 'Madugulapally'}, ${school.address.split(',')[2] || 'Nalgonda'}` : 'Telangana'}
                </span>
              </div>
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center space-x-2.5 sm:space-x-3.5">
            
            {/* Language Switcher (Pill style toggle button) */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100 active:bg-slate-200/70 border border-slate-200/60 text-slate-700 text-xs sm:text-sm font-semibold rounded-2xl transition-custom cursor-pointer"
              title="Switch Language"
            >
              <Globe className="h-4 w-4 text-slate-400" />
              <span>{language === 'en' ? 'తెలుగు' : 'English'}</span>
            </button>

            {/* View Result / Login Portal toggle */}
            {!currentUser ? (
              activeView === 'public-portal' ? (
                <button
                  onClick={() => navigateTo('login')}
                  className="flex items-center gap-1.5 px-4.5 py-2 bg-primary hover:bg-primary-dark active:scale-[0.98] text-white rounded-2xl text-xs sm:text-sm font-bold shadow-sm shadow-blue-500/10 transition-custom cursor-pointer"
                >
                  <LogIn className="h-4 w-4" />
                  <span>{t('login')}</span>
                </button>
              ) : (
                <button
                  onClick={() => navigateTo('public-portal')}
                  className="flex items-center gap-1.5 px-4.5 py-2 bg-slate-50 hover:bg-slate-100 active:scale-[0.98] text-slate-700 border border-slate-200 rounded-2xl text-xs sm:text-sm font-bold transition-custom cursor-pointer"
                >
                  <GraduationCap className="h-4 w-4 text-primary" />
                  <span>{t('studentPortal')}</span>
                </button>
              )
            ) : (
              // Logged in User profile & logout
              <div className="flex items-center space-x-3">
                <div className="hidden lg:flex flex-col text-right">
                  <span className="text-xs font-bold text-slate-800 leading-tight">{currentUser.name}</span>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                    {currentUser.role === 'admin' ? t('adminRole') : t('teacherRole')}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 bg-red-50 hover:bg-red-100 hover:text-red-700 text-red-600 border border-red-100 rounded-xl transition-custom cursor-pointer"
                  title={t('logout')}
                >
                  <LogOut className="h-4.5 w-4.5" />
                </button>
              </div>
            )}

          </div>

        </div>
      </header>

      {/* ----------------------------------------------------
          MAIN WRAPPER
         ---------------------------------------------------- */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto px-0 sm:px-6 lg:px-8 py-0 sm:py-8 gap-8">
        
        {/* --- DESKTOP SIDEBAR (Sleek SaaS design) --- */}
        {currentUser && (
          <aside className="w-64 flex-shrink-0 hidden md:flex flex-col gap-6 self-start">
            {/* User Profile Summary */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/5 text-primary rounded-xl flex items-center justify-center font-bold border border-primary/10">
                <UserIcon className="h-5 w-5" />
              </div>
              <div className="overflow-hidden">
                <h4 className="text-sm font-bold text-slate-800 truncate">{currentUser.name}</h4>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">
                  {currentUser.role === 'admin' ? 'Administrator' : 'Class Teacher'}
                </p>
              </div>
            </div>

            {/* Sidebar navigation */}
            <nav className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm space-y-1">
              {navItems
                .filter(item => item.roles.includes(currentUser.role))
                .map(item => {
                  const isActive = activeView === item.view;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.view}
                      onClick={() => navigateTo(item.view as ActiveView)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-custom cursor-pointer ${
                        isActive
                          ? 'bg-primary text-white shadow-sm shadow-blue-500/10'
                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
            </nav>
          </aside>
        )}

        {/* --- APP PAGES OUTLET --- */}
        <main className="flex-1 bg-white/70 backdrop-blur-md p-4 sm:p-8 rounded-none sm:rounded-3xl border-0 sm:border border-slate-100 shadow-sm min-w-0 pb-20 md:pb-8">
          
          {/* Public Results Portal */}
          {activeView === 'public-portal' && (
            <PublicResultPortal language={language} />
          )}

          {/* Teacher Login (Stripe/Linear card style) */}
          {activeView === 'login' && (
            <div className="max-w-md mx-auto py-8 sm:py-16 space-y-8 animate-in fade-in zoom-in-95 duration-300">
              <div className="text-center space-y-2.5">
                <div className="inline-flex p-3.5 bg-primary/5 text-primary rounded-2xl border border-primary/10 shadow-sm mb-1">
                  <Lock className="h-7 w-7" />
                </div>
                <h2 className="text-2xl font-bold text-slate-950 tracking-tight">{t('login')}</h2>
                <p className="text-sm text-slate-400 font-medium">{t('loginDesc')}</p>
              </div>

              {authError && (
                <div className="p-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl flex items-center gap-3 text-sm">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-500" />
                  <span className="font-medium">{authError}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="bg-white p-7 rounded-2xl border border-slate-200/60 shadow-sm space-y-5">
                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">
                    {t('email')}
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="teacher@zphs.edu"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-primary text-slate-800 text-sm font-medium transition-all duration-200 bg-white"
                  />
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">
                    {t('password')}
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-primary text-slate-800 text-sm font-medium transition-all duration-200 bg-white"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3.5 bg-primary hover:bg-primary-dark active:scale-[0.99] disabled:bg-slate-200 text-white font-bold rounded-xl shadow-md shadow-blue-500/10 transition-custom flex items-center justify-center gap-2 mt-6 cursor-pointer text-sm"
                >
                  {authLoading ? t('loading') : t('signIn')}
                </button>
              </form>

              {/* Login credentials helper card */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/60 text-xs text-slate-500 space-y-2">
                <span className="font-bold flex items-center gap-1.5 text-slate-600">
                  <HelpCircle className="h-4 w-4 text-primary" />
                  Credentials for Father's Day Demo:
                </span>
                <div className="grid grid-cols-2 gap-4 text-[11px] pt-1">
                  <div>
                    <strong className="text-slate-700 block mb-0.5">1. Teacher Login:</strong>
                    <div className="text-slate-400">Email: <code>teacher@zphs.edu</code></div>
                    <div className="text-slate-400">Pass: <code>password</code></div>
                  </div>
                  <div>
                    <strong className="text-slate-700 block mb-0.5">2. Admin Login:</strong>
                    <div className="text-slate-400">Email: <code>admin@zphs.edu</code></div>
                    <div className="text-slate-400">Pass: <code>password</code></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Teacher Logged-In Sub-views */}
          {currentUser && activeView === 'dashboard' && (
            <Dashboard language={language} />
          )}

          {currentUser && activeView === 'students' && (
            <StudentManagement language={language} />
          )}

          {currentUser && activeView === 'marks' && (
            <MarksManagement language={language} />
          )}

          {currentUser && activeView === 'upload' && (
            <ExcelUpload language={language} />
          )}

          {currentUser && activeView === 'settings' && currentUser.role === 'admin' && (
            <BrandingSettings language={language} onBrandingChange={loadSchoolAndUser} />
          )}

        </main>
      </div>

      {/* --- MOBILE BOTTOM NAVIGATION (Apple-style pill tabs fixed at bottom) --- */}
      {currentUser && (
        <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-md border-t border-slate-100 flex justify-around items-center px-2 z-40 shadow-[0_-1px_10px_rgba(0,0,0,0.03)] md:hidden">
          {navItems
            .filter(item => item.roles.includes(currentUser.role))
            .map(item => {
              const isActive = activeView === item.view;
              const Icon = item.icon;
              return (
                <button
                  key={item.view}
                  onClick={() => navigateTo(item.view as ActiveView)}
                  className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-custom cursor-pointer ${
                    isActive ? 'text-primary font-bold' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <Icon className="h-5.5 w-5.5" />
                  <span className="text-[9px] mt-0.5 tracking-tight truncate max-w-full">
                    {item.view === 'settings' ? 'Settings' : item.label.split(' ')[0]}
                  </span>
                </button>
              );
            })}
        </nav>
      )}

      {/* Footer Branding Banner */}
      <footer className="bg-slate-900 border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 pb-20 md:pb-0">
          <p>© {new Date().getFullYear()} {school ? school.school_name : 'ZPHS AGAMOTHKUR'}. All rights reserved.</p>
          <p className="text-[10px] text-slate-600 mt-1">U-DISE Code: {school ? school.school_code : '28160200501'} | Built for Government School Teachers</p>
        </div>
      </footer>

    </div>
  );
}

export default App;
