
import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, Users, Lock, Mail, BookOpen, Calendar, LogOut, Plus, Settings, 
  Database, CheckCircle2, ChevronRight, UserPlus, Calculator, BarChart3, 
  FileSpreadsheet, AlertCircle, TrendingUp, Clock, ArrowRight, Filter, Search, 
  GraduationCap, Save, UserCheck, Trash2, X, Key, Percent, Target, ChevronDown,
  ClipboardCheck, LayoutDashboard, History, FileText, MoreVertical, Layers,
  Wand2, Send, Download, Check, BarChart, UserCog, Building2, ListTodo
} from 'lucide-react';
import { 
  BarChart as ReBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { User, Course, CourseOutcome, ProgramOutcome, OBEConfig, WorkflowStatus, ProgramSpecificOutcome, CoPoMapping, StudentMark } from './types';
import { generateCourseOutcomes } from './services/geminiService';

const BIET_LOGO = "https://upload.wikimedia.org/wikipedia/en/3/36/Bundelkhand_Institute_of_Engineering_and_Technology_Logo.png";

const App: React.FC = () => {
  // Navigation & Identity
  const [view, setView] = useState('LOGIN');
  const [user, setUser] = useState<User | null>(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  
  // Active Management States
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [activeYear, setActiveYear] = useState('2024-25');
  const [activeDept, setActiveDept] = useState('Information Technology');
  const [courseTab, setCourseTab] = useState<'CO' | 'MAPPING' | 'MARKS' | 'ATTAINMENT'>('CO');

  // Config (Institutional Policy)
  const [config, setConfig] = useState<OBEConfig>({
    institutionName: "BIET Jhansi",
    internalWeightage: 30,
    externalWeightage: 70,
    defaultTargetPercentage: 60,
    attainmentLevels: { level1: 50, level2: 60, level3: 70 }
  });

  // Mock Database
  const [users, setUsers] = useState<User[]>([
    { id: 'a1', name: 'Dean Academics', email: 'admin@bietj.ac.in', password: 'admin', role: 'ADMIN', departmentId: 'IT' },
    { id: 't1', name: 'Dr. S.K. Gupta', email: 'skgupta@bietj.ac.in', password: '123', role: 'TEACHER', departmentId: 'IT' },
    { id: 't2', name: 'Prof. Anjali Sharma', email: 'asharma@bietj.ac.in', password: '123', role: 'TEACHER', departmentId: 'IT' },
  ]);

  const [courses, setCourses] = useState<Course[]>([
    { id: 'c1', code: 'KCS-501', name: 'Theory of Computation', departmentId: 'IT', academicYear: '2024-25', teacherId: 't1', workflowStatus: 'DRAFT', lastModified: '2024-10-12', completionProgress: 65, description: 'Formal languages, automata theory, and computability.' },
    { id: 'c2', code: 'KCS-502', name: 'Computer Networks', departmentId: 'IT', academicYear: '2024-25', teacherId: 't2', workflowStatus: 'SUBMITTED', lastModified: '2024-10-10', completionProgress: 100 },
    { id: 'c3', code: 'KCS-301', name: 'Data Structures', departmentId: 'IT', academicYear: '2023-24', teacherId: 't1', workflowStatus: 'APPROVED', lastModified: '2023-12-05', completionProgress: 100 },
  ]);

  const [courseOutcomes, setCourseOutcomes] = useState<CourseOutcome[]>([
    { id: 'co1', courseId: 'c1', code: 'CO1', description: 'Analyze and design finite automata.', targetMarksPercentage: 60 },
    { id: 'co2', courseId: 'c1', code: 'CO2', description: 'Understand regular expressions and languages.', targetMarksPercentage: 60 },
    { id: 'co3', courseId: 'c1', code: 'CO3', description: 'Construct pushdown automata and CFGs.', targetMarksPercentage: 60 },
  ]);

  const [psos, setPsos] = useState<ProgramSpecificOutcome[]>([
    { id: 'pso1', code: 'PSO1', description: 'Analyze and solve complex problems in Information Technology.' },
    { id: 'pso2', code: 'PSO2', description: 'Design and develop software solutions using modern tools.' }
  ]);

  const [mappings, setMappings] = useState<CoPoMapping[]>([]);
  const [studentMarks, setStudentMarks] = useState<StudentMark[]>([
    { studentId: 'S01', studentName: 'Aditya Kumar', coMarks: { co1: 85, co2: 40, co3: 70 } },
    { studentId: 'S02', studentName: 'Priya Singh', coMarks: { co1: 65, co2: 75, co3: 30 } },
    { studentId: 'S03', studentName: 'Rahul Verma', coMarks: { co1: 90, co2: 88, co3: 85 } },
    { studentId: 'S04', studentName: 'Sneha Gupta', coMarks: { co1: 45, co2: 55, co3: 60 } },
    { studentId: 'S05', studentName: 'Vikram Das', coMarks: { co1: 72, co2: 68, co3: 74 } },
  ]);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const pos: ProgramOutcome[] = useMemo(() => Array.from({ length: 12 }, (_, i) => ({ 
    id: `po${i+1}`, code: `PO${i+1}`, description: `Program Outcome ${i+1}` 
  })), []);

  const attainmentData = useMemo(() => {
    return courseOutcomes.map(co => {
      const studentScores = studentMarks.map(s => s.coMarks[co.id] || 0);
      const countAboveThreshold = studentScores.filter(s => s >= config.defaultTargetPercentage).length;
      const percentageAbove = (countAboveThreshold / studentMarks.length) * 100;
      let level = 0;
      if (percentageAbove >= config.attainmentLevels.level3) level = 3;
      else if (percentageAbove >= config.attainmentLevels.level2) level = 2;
      else if (percentageAbove >= config.attainmentLevels.level1) level = 1;
      return { name: co.code, attainment: level, percentage: percentageAbove, threshold: config.defaultTargetPercentage };
    });
  }, [courseOutcomes, studentMarks, config]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const foundUser = users.find(u => u.email === loginEmail && u.password === loginPassword);
    if (foundUser) {
      setUser(foundUser);
      setView(foundUser.role === 'ADMIN' ? 'DASHBOARD' : 'MY_COURSES');
      setLoginError('');
      showNotification(`Welcome, ${foundUser.name}`);
    } else {
      setLoginError('Invalid institutional credentials.');
    }
  };

  const handleQuickLogin = (role: 'ADMIN' | 'TEACHER') => {
    const creds = role === 'ADMIN' 
      ? { email: 'admin@bietj.ac.in', pass: 'admin' }
      : { email: 'skgupta@bietj.ac.in', pass: '123' };
    setLoginEmail(creds.email);
    setLoginPassword(creds.pass);
  };

  const updateWorkflow = (courseId: string, newStatus: WorkflowStatus) => {
    setCourses(prev => prev.map(c => c.id === courseId ? { ...c, workflowStatus: newStatus, lastModified: new Date().toISOString().split('T')[0] } : c));
    showNotification(`Workflow updated to ${newStatus}`);
  };

  const updateAllotment = (courseId: string, teacherId: string) => {
    setCourses(prev => prev.map(c => c.id === courseId ? { ...c, teacherId } : c));
  };

  const handleAddFaculty = () => {
    const name = prompt("Enter Faculty Full Name:");
    if (!name) return;
    const email = prompt("Enter Institutional Email (@bietj.ac.in):");
    if (!email || !email.includes('@')) {
      alert("Invalid email format.");
      return;
    }
    const newUser: User = {
      id: `t_${Date.now()}`,
      name,
      email,
      password: '123',
      role: 'TEACHER',
      departmentId: activeDept
    };
    setUsers(prev => [...prev, newUser]);
    showNotification("Faculty onboarded successfully.");
  };

  const handleDeleteFaculty = (id: string) => {
    if (window.confirm("Are you sure you want to remove this faculty member? This action cannot be undone.")) {
      setUsers(prev => prev.filter(u => u.id !== id));
      showNotification("Faculty removed from registry.");
    }
  };

  const toggleMapping = (coId: string, poId: string) => {
    setMappings(prev => {
      const existing = prev.find(m => m.coId === coId && m.poId === poId);
      if (existing) {
        const nextLevel = (existing.level + 1) % 4;
        return prev.map(m => (m.coId === coId && m.poId === poId) ? { ...m, level: nextLevel } : m);
      }
      return [...prev, { courseId: activeCourse!.id, coId, poId, level: 1 }];
    });
  };

  const getMappingLevel = (coId: string, poId: string) => mappings.find(m => m.coId === coId && m.poId === poId)?.level || 0;

  const getStatusColor = (status: WorkflowStatus) => {
    const colors = {
      DRAFT: 'bg-slate-100 text-slate-600 border-slate-200',
      SUBMITTED: 'bg-blue-50 text-blue-700 border-blue-200',
      REVIEWED: 'bg-purple-50 text-purple-700 border-purple-200',
      APPROVED: 'bg-green-50 text-green-700 border-green-200',
      LOCKED: 'bg-slate-900 text-white border-slate-800',
      REJECTED: 'bg-red-50 text-red-700 border-red-200'
    };
    return colors[status];
  };

  if (view === 'LOGIN') {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 antialiased">
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-200">
          <div className="bg-[#003399] p-12 text-white flex flex-col justify-between">
            <div>
              <img src={BIET_LOGO} className="w-20 h-20 mb-8 bg-white rounded-full p-2" alt="BIET" />
              <h1 className="text-4xl font-black uppercase tracking-tighter leading-none mb-4">ERP OBE<br/>System</h1>
              <p className="text-blue-100/60 text-xs font-bold uppercase tracking-widest">Bundelkhand Institute of Engineering & Technology</p>
            </div>
            <div className="space-y-4">
               <button onClick={() => handleQuickLogin('ADMIN')} className="w-full flex items-center justify-between p-5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl transition-all group">
                 <div className="flex items-center gap-4">
                   <div className="p-3 bg-white/10 rounded-xl group-hover:bg-blue-500 transition-colors"><ShieldCheck size={20}/></div>
                   <div className="text-left"><p className="text-[10px] font-black uppercase tracking-widest opacity-60">Access Panel</p><p className="font-bold text-sm">Institutional Admin</p></div>
                 </div>
                 <ChevronRight size={18} className="opacity-40 group-hover:opacity-100 translate-x-0 group-hover:translate-x-1 transition-all" />
               </button>
               <button onClick={() => handleQuickLogin('TEACHER')} className="w-full flex items-center justify-between p-5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl transition-all group">
                 <div className="flex items-center gap-4">
                   <div className="p-3 bg-white/10 rounded-xl group-hover:bg-slate-800 transition-colors"><Users size={20}/></div>
                   <div className="text-left"><p className="text-[10px] font-black uppercase tracking-widest opacity-60">Access Panel</p><p className="font-bold text-sm">Faculty Workstation</p></div>
                 </div>
                 <ChevronRight size={18} className="opacity-40 group-hover:opacity-100 translate-x-0 group-hover:translate-x-1 transition-all" />
               </button>
            </div>
          </div>
          <div className="p-12">
            <div className="mb-10">
              <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">System Login</h2>
              <p className="text-slate-400 text-sm font-medium">Enter your institutional credentials to continue.</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Institutional ID</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-4 text-slate-300" size={20} />
                    <input type="email" required value={loginEmail} onChange={e => setLoginEmail(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none font-bold" placeholder="name@bietj.ac.in" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Passcode</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-4 text-slate-300" size={20} />
                    <input type="password" required value={loginPassword} onChange={e => setLoginPassword(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none font-bold" placeholder="••••••••" />
                  </div>
                </div>
              </div>
              {loginError && <p className="text-red-500 text-[10px] font-black uppercase text-center">{loginError}</p>}
              <button type="submit" className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200">Authenticate session</button>
              <div className="mt-8 p-4 bg-slate-50 border border-slate-100 rounded-xl text-center">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Institutional Support: support@bietj.ac.in</p>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-900 font-sans relative">
      {notification && (
        <div className="fixed top-6 right-6 z-[100] animate-in slide-in-from-right duration-300">
           <div className={`px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border ${notification.type === 'success' ? 'bg-green-600 text-white border-green-500' : 'bg-red-600 text-white border-red-500'}`}>
              {notification.type === 'success' ? <Check size={20}/> : <AlertCircle size={20}/>}
              <p className="text-xs font-black uppercase tracking-widest">{notification.message}</p>
           </div>
        </div>
      )}

      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col fixed inset-y-0 shadow-sm z-50">
        <div className="p-8 border-b">
          <div className="flex items-center gap-3">
            <img src={BIET_LOGO} className="w-8 h-8" alt="BIET" />
            <span className="font-black text-xs uppercase tracking-tighter">OBE Console v2.0</span>
          </div>
        </div>
        <nav className="flex-1 p-6 space-y-1">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-3">Main Navigation</p>
          <NavItem icon={<LayoutDashboard size={18}/>} label="Dashboard" active={view === 'DASHBOARD'} onClick={() => setView('DASHBOARD')} />
          
          {user?.role === 'ADMIN' && (
            <div className="pt-6 space-y-1">
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-4 px-3">Admin Control Panel</p>
              <NavItem icon={<Users size={18}/>} label="Faculty Registry" active={view === 'FACULTY'} onClick={() => setView('FACULTY')} />
              <NavItem icon={<Layers size={18}/>} label="Allotment Matrix" active={view === 'ALLOTMENT'} onClick={() => setView('ALLOTMENT')} />
              <NavItem icon={<ListTodo size={18}/>} label="PSO Management" active={view === 'PSOS'} onClick={() => setView('PSOS')} />
              <NavItem icon={<Settings size={18}/>} label="OBE Master Config" active={view === 'CONFIG'} onClick={() => setView('CONFIG')} />
            </div>
          )}

          {user?.role === 'TEACHER' && (
            <div className="pt-6 space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-3">Instructional Tools</p>
              <NavItem icon={<BookOpen size={18}/>} label="My Workload" active={view === 'MY_COURSES' || view === 'COURSE_MANAGE'} onClick={() => setView('MY_COURSES')} />
              <NavItem icon={<ClipboardCheck size={18}/>} label="Attainment Sheets" active={false} />
            </div>
          )}
        </nav>
        <div className="p-6 mt-auto border-t bg-slate-50/50">
          <div className="flex items-center gap-4 mb-4">
             <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-xs uppercase">{user?.name.charAt(0)}</div>
             <div className="overflow-hidden text-ellipsis">
               <p className="text-[10px] font-black text-slate-800 uppercase truncate">{user?.name}</p>
               <p className="text-[9px] text-slate-400 font-bold uppercase truncate">{user?.role} Mode</p>
             </div>
          </div>
          <button onClick={() => { setUser(null); setView('LOGIN'); }} className="w-full py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-red-600 transition-all shadow-sm">Terminate Session</button>
        </div>
      </aside>

      <main className="flex-1 ml-72">
        <header className="h-20 bg-white border-b flex items-center justify-between px-10 sticky top-0 z-40">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-slate-400" />
              <select value={activeYear} onChange={e => setActiveYear(e.target.value)} className="bg-transparent font-black text-xs uppercase tracking-tight outline-none cursor-pointer">
                <option>2024-25</option>
                <option>2023-24</option>
              </select>
            </div>
            <div className="w-px h-6 bg-slate-100"></div>
            <div className="flex items-center gap-2">
              <GraduationCap size={16} className="text-slate-400" />
              <span className="font-black text-xs uppercase tracking-tight">{activeDept} Branch</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-200">
               <UserCog size={14} className="text-blue-600" />
               <span className="text-[10px] font-black uppercase text-slate-800">{user?.role} Workspace</span>
            </div>
          </div>
        </header>

        <div className="p-10 max-w-7xl mx-auto space-y-10 pb-24">
          
          {/* DASHBOARD (ADMIN/HOD) */}
          {view === 'DASHBOARD' && (
            <div className="space-y-10 animate-in fade-in duration-500">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 <StatCard label="Institutional Allotments" value={courses.length.toString()} icon={<Layers size={20}/>} trend="SAR Cycle 2024" color="blue" />
                 <StatCard label="Awaiting Approval" value={courses.filter(c => c.workflowStatus === 'SUBMITTED').length.toString()} icon={<Clock size={20}/>} trend="Pending HOD Review" color="indigo" />
                 <StatCard label="Audit Ready" value={courses.filter(c => c.workflowStatus === 'APPROVED').length.toString()} icon={<CheckCircle2 size={20}/>} trend="Locked Submissions" color="green" />
                 <StatCard label="Faculty Strength" value={users.filter(u => u.role === 'TEACHER').length.toString()} icon={<Users size={20}/>} trend="Verified Staff" color="blue" />
               </div>

               <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                  <div className="xl:col-span-2 bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                      <h3 className="text-sm font-black uppercase tracking-widest text-slate-800 flex items-center gap-3">
                        <History size={18} className="text-blue-600"/> Approval & Review Queue
                      </h3>
                      <button className="text-[10px] font-black uppercase text-blue-600">View All Queue</button>
                    </div>
                    <div className="space-y-3">
                      {courses.map(course => (
                        <div key={course.id} className="flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-slate-300 transition-all group">
                          <div className="flex items-center gap-5">
                             <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center font-black text-xs text-blue-600 border border-slate-100 group-hover:bg-blue-600 group-hover:text-white transition-all">{course.code}</div>
                             <div>
                               <p className="font-bold text-sm text-slate-800">{course.name}</p>
                               <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">Lead: {users.find(u => u.id === course.teacherId)?.name}</p>
                             </div>
                          </div>
                          <div className="flex items-center gap-4">
                             <span className={`px-3 py-1.5 rounded-full text-[8px] font-black uppercase border ${getStatusColor(course.workflowStatus)}`}>{course.workflowStatus}</span>
                             {user?.role === 'ADMIN' && course.workflowStatus === 'SUBMITTED' && (
                               <div className="flex gap-2">
                                  <button onClick={() => updateWorkflow(course.id, 'APPROVED')} className="p-2.5 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-colors" title="Approve"><Check size={18}/></button>
                                  <button onClick={() => updateWorkflow(course.id, 'REJECTED')} className="p-2.5 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-colors" title="Reject"><X size={18}/></button>
                               </div>
                             )}
                             <button onClick={() => { setActiveCourse(course); setView('COURSE_MANAGE'); }} className="p-2.5 hover:bg-slate-200 rounded-xl transition-colors"><ChevronRight size={18}/></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white flex flex-col justify-between shadow-2xl">
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-widest text-blue-400 mb-6">Departmental Health</h4>
                      <div className="space-y-6">
                         <div>
                            <div className="flex justify-between text-[10px] font-black uppercase mb-2"><span>Syllabus Mapping</span><span>92%</span></div>
                            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-blue-500" style={{width: '92%'}}></div></div>
                         </div>
                         <div>
                            <div className="flex justify-between text-[10px] font-black uppercase mb-2"><span>Marks Entry Compliance</span><span>45%</span></div>
                            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-amber-500" style={{width: '45%'}}></div></div>
                         </div>
                         <div>
                            <div className="flex justify-between text-[10px] font-black uppercase mb-2"><span>Attainment Calculations</span><span>30%</span></div>
                            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-red-500" style={{width: '30%'}}></div></div>
                         </div>
                      </div>
                    </div>
                    <div className="mt-10 p-5 bg-white/5 rounded-2xl border border-white/10">
                       <p className="text-[10px] font-bold text-slate-400 uppercase leading-relaxed">System alerted 3 faculty members regarding pending mark entries for KCS-502, KCS-301.</p>
                    </div>
                  </div>
               </div>
            </div>
          )}

          {/* FACULTY REGISTRY (ADMIN) */}
          {view === 'FACULTY' && (
            <div className="space-y-8 animate-in fade-in">
               <div className="flex justify-between items-end">
                  <div>
                    <h2 className="text-2xl font-black text-slate-800 uppercase">Institutional Faculty Directory</h2>
                    <p className="text-slate-400 text-sm">Review teaching staff and access credentials.</p>
                  </div>
                  <button onClick={handleAddFaculty} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl">Onboard New Faculty</button>
               </div>
               <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse">
                     <thead className="bg-slate-50 border-b">
                        <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                           <th className="p-8">Faculty Member</th>
                           <th className="p-8">Institutional Email</th>
                           <th className="p-8">Department</th>
                           <th className="p-8">Access Status</th>
                           <th className="p-8 text-right">Actions</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                        {users.filter(u => u.role === 'TEACHER').map(f => (
                          <tr key={f.id} className="hover:bg-slate-50/50 transition-all">
                             <td className="p-8">
                               <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xs uppercase">{f.name.charAt(0)}</div>
                                  <p className="font-bold text-slate-800">{f.name}</p>
                               </div>
                             </td>
                             <td className="p-8 text-xs font-bold text-slate-400 font-mono tracking-tight">{f.email}</td>
                             <td className="p-8 text-[10px] font-black text-slate-500 uppercase">{f.departmentId}</td>
                             <td className="p-8">
                                <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-[8px] font-black uppercase border border-green-100">Verified</span>
                             </td>
                             <td className="p-8 text-right">
                                <button className="p-2 text-slate-300 hover:text-blue-600 transition-colors"><Settings size={18}/></button>
                                <button onClick={() => handleDeleteFaculty(f.id)} className="p-2 text-slate-300 hover:text-red-600 transition-colors"><Trash2 size={18}/></button>
                             </td>
                          </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
          )}

          {/* PSO MANAGEMENT (ADMIN) */}
          {view === 'PSOS' && (
            <div className="space-y-10 animate-in fade-in duration-500">
               <div className="flex justify-between items-end">
                 <div>
                   <h2 className="text-2xl font-black text-slate-800 uppercase">Program Specific Outcomes (PSO)</h2>
                   <p className="text-slate-500 text-sm">Define outcomes that specifically describe what students of {activeDept} will be able to do.</p>
                 </div>
                 <button onClick={() => {
                   const newPso: ProgramSpecificOutcome = { id: `pso_${Date.now()}`, code: `PSO${psos.length + 1}`, description: 'New PSO description' };
                   setPsos(prev => [...prev, newPso]);
                   showNotification("New PSO defined.");
                 }} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 shadow-xl">Define New PSO</button>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {psos.map(pso => (
                   <div key={pso.id} className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm hover:border-blue-300 transition-all flex flex-col">
                      <div className="flex justify-between items-center mb-6">
                         <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-sm">{pso.code}</div>
                         <button onClick={() => {
                           setPsos(prev => prev.filter(p => p.id !== pso.id));
                           showNotification("PSO deleted.");
                         }} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                      </div>
                      <textarea 
                        className="flex-1 bg-slate-50 rounded-2xl p-4 text-sm font-medium text-slate-700 outline-none focus:ring-4 focus:ring-blue-100 min-h-[100px] border border-slate-100"
                        value={pso.description}
                        onChange={(e) => {
                          const val = e.target.value;
                          setPsos(prev => prev.map(p => p.id === pso.id ? {...p, description: val} : p));
                        }}
                      />
                   </div>
                 ))}
               </div>
            </div>
          )}

          {/* ALLOTMENT MATRIX (ADMIN) */}
          {view === 'ALLOTMENT' && (
            <div className="space-y-10 animate-in fade-in duration-500">
               <div className="flex justify-between items-end">
                 <div>
                   <h2 className="text-2xl font-black text-slate-800 uppercase">Course Allotment Master</h2>
                   <p className="text-slate-500 text-sm">Assign faculty members to institutional courses for the {activeYear} session.</p>
                 </div>
                 <div className="flex gap-4">
                   <button onClick={() => showNotification("Bulk allotment utility active.")} className="px-6 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase text-slate-500 hover:bg-slate-50 transition-all">Bulk Allotment (Excel)</button>
                 </div>
               </div>
               <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
                 <table className="w-full text-left">
                   <thead className="bg-slate-50 border-b">
                     <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                       <th className="p-8">Subject Code</th>
                       <th className="p-8">Course Name</th>
                       <th className="p-8">Allotted Instructor</th>
                       <th className="p-8 text-right">Status</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                      {courses.map(c => (
                        <tr key={c.id} className="hover:bg-slate-50/50 transition-all">
                          <td className="p-8 font-black text-blue-600 text-sm">{c.code}</td>
                          <td className="p-8 font-bold text-slate-800 text-sm">{c.name}</td>
                          <td className="p-8">
                             <div className="relative max-w-xs">
                               <select 
                                 value={c.teacherId} 
                                 onChange={(e) => {
                                   updateAllotment(c.id, e.target.value);
                                   showNotification(`Re-assigned ${c.code} successfully.`);
                                 }}
                                 className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-black outline-none focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer pr-10"
                               >
                                 {users.filter(u => u.role === 'TEACHER').map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                               </select>
                               <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                             </div>
                          </td>
                          <td className="p-8 text-right">
                             <span className={`px-3 py-1.5 rounded-full text-[8px] font-black uppercase border ${getStatusColor(c.workflowStatus)}`}>{c.workflowStatus}</span>
                          </td>
                        </tr>
                      ))}
                   </tbody>
                 </table>
               </div>
               <div className="flex justify-end">
                  <button onClick={() => showNotification("Institutional allotments finalized.")} className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl">Confirm Allotment Sync</button>
               </div>
            </div>
          )}

          {/* CONFIGURATION (ADMIN) */}
          {view === 'CONFIG' && (
            <div className="max-w-4xl mx-auto space-y-10 animate-in slide-in-from-bottom-4 duration-700">
              <div className="text-center">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Institutional Policy Controls</h2>
                <p className="text-slate-500 text-sm font-medium">Standardize institution-wide calculation and threshold parameters.</p>
              </div>
              <div className="bg-white rounded-[3rem] border border-slate-200 p-12 shadow-sm space-y-12">
                 <section className="space-y-6">
                   <h4 className="text-xs font-black text-blue-600 uppercase tracking-widest flex items-center gap-2"><Percent size={18}/> Global Weightage Balancer</h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Internal Assessment (%)</label>
                       <input 
                         type="number" value={config.internalWeightage} 
                         onChange={e => {
                           const val = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
                           setConfig({...config, internalWeightage: val, externalWeightage: 100 - val});
                         }} 
                         className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl font-black text-xl outline-none focus:ring-4 focus:ring-blue-100" 
                       />
                     </div>
                     <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">External/End-Sem (%)</label>
                       <input 
                         type="number" value={config.externalWeightage} 
                         onChange={e => {
                           const val = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
                           setConfig({...config, externalWeightage: val, internalWeightage: 100 - val});
                         }} 
                         className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl font-black text-xl outline-none focus:ring-4 focus:ring-blue-100" 
                       />
                     </div>
                   </div>
                 </section>
                 <section className="space-y-6">
                   <h4 className="text-xs font-black text-blue-600 uppercase tracking-widest flex items-center gap-2"><Target size={18}/> Attainment Level Entry Thresholds</h4>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     {[1, 2, 3].map(lvl => (
                       <div key={lvl} className="p-8 bg-slate-900 rounded-[2rem] text-white shadow-xl shadow-slate-200 group">
                         <p className="text-[10px] font-black text-blue-400 uppercase mb-4">Level {lvl}</p>
                         <div className="flex items-end gap-2">
                            <input 
                              type="number" value={(config.attainmentLevels as any)[`level${lvl}`]} 
                              onChange={e => {
                                const val = parseInt(e.target.value) || 0;
                                setConfig(prev => ({...prev, attainmentLevels: {...prev.attainmentLevels, [`level${lvl}`]: val}}))
                              }} 
                              className="bg-transparent text-3xl font-black w-full outline-none border-b-2 border-white/20 focus:border-blue-400 transition-all" 
                            />
                            <span className="text-white/40 font-black mb-1 text-xl">%</span>
                         </div>
                       </div>
                     ))}
                   </div>
                 </section>
                 <button onClick={() => showNotification("Policy pushed to all departments.")} className="w-full py-6 bg-blue-600 text-white rounded-3xl font-black uppercase tracking-[0.2em] text-xs hover:bg-blue-700 transition-all shadow-2xl">Push Policy to Departments</button>
              </div>
            </div>
          )}

          {/* TEACHER WORKLOAD VIEW */}
          {view === 'MY_COURSES' && (
            <div className="space-y-10 animate-in fade-in duration-500">
               <div>
                 <h2 className="text-3xl font-black text-slate-800 tracking-tight uppercase">Faculty Workstation</h2>
                 <p className="text-slate-500 text-sm font-medium">Manage course outcomes and calculate attainment for Session {activeYear}.</p>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {courses.filter(c => c.teacherId === user?.id).map(course => (
                   <div key={course.id} onClick={() => { setActiveCourse(course); setView('COURSE_MANAGE'); }} className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all group cursor-pointer flex flex-col">
                     <div className="p-8 flex-1">
                       <div className="flex justify-between items-start mb-6">
                         <span className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">{course.code}</span>
                         <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusColor(course.workflowStatus)}`}>{course.workflowStatus}</span>
                       </div>
                       <h4 className="text-xl font-black text-slate-800 leading-tight mb-2 group-hover:text-blue-600 transition-colors">{course.name}</h4>
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-8">Branch: {course.departmentId}</p>
                       <div className="space-y-4">
                         <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                           <span>Progress</span>
                           <span>{course.completionProgress}%</span>
                         </div>
                         <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-blue-600" style={{ width: `${course.completionProgress}%` }}></div></div>
                       </div>
                     </div>
                     <div className="px-8 py-5 bg-slate-50 border-t flex justify-between items-center">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Open Workstation</span>
                        <ChevronRight size={16} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          )}

          {/* COURSE MANAGEMENT (TEACHER) */}
          {view === 'COURSE_MANAGE' && activeCourse && (
            <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
               <div className="flex items-center gap-4">
                 <button onClick={() => setView(user?.role === 'ADMIN' ? 'DASHBOARD' : 'MY_COURSES')} className="p-3 bg-white border rounded-2xl text-slate-400 hover:text-slate-800 shadow-sm transition-all"><ArrowRight size={20} className="rotate-180"/></button>
                 <div>
                   <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">{activeCourse.code}: {activeCourse.name}</h2>
                   <div className="flex gap-4 mt-1">
                     <button onClick={() => setCourseTab('CO')} className={`text-[10px] font-black uppercase tracking-widest py-2 border-b-2 transition-all ${courseTab === 'CO' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400'}`}>1. Outcomes (CO)</button>
                     <button onClick={() => setCourseTab('MAPPING')} className={`text-[10px] font-black uppercase tracking-widest py-2 border-b-2 transition-all ${courseTab === 'MAPPING' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400'}`}>2. Articulation Matrix</button>
                     <button onClick={() => setCourseTab('MARKS')} className={`text-[10px] font-black uppercase tracking-widest py-2 border-b-2 transition-all ${courseTab === 'MARKS' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400'}`}>3. Mark Entry</button>
                     <button onClick={() => setCourseTab('ATTAINMENT')} className={`text-[10px] font-black uppercase tracking-widest py-2 border-b-2 transition-all ${courseTab === 'ATTAINMENT' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400'}`}>4. Attainment Results</button>
                   </div>
                 </div>
               </div>

               <div className="bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-sm min-h-[500px]">
                  {courseTab === 'CO' && (
                    <div className="space-y-8 animate-in fade-in">
                       <div className="flex justify-between items-center">
                         <h3 className="font-black text-sm uppercase tracking-widest text-slate-800">CO Registry</h3>
                         <button onClick={() => showNotification("AI engine generating CO suggestions...")} className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase hover:bg-black shadow-xl"><Wand2 size={16}/> AI Suggest COs</button>
                       </div>
                       <div className="space-y-4">
                         {courseOutcomes.map(co => (
                           <div key={co.id} className="flex gap-6 p-6 bg-slate-50 border border-slate-100 rounded-3xl hover:border-blue-200 transition-all">
                             <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center font-black text-blue-600 text-xs shadow-sm">{co.code}</div>
                             <div className="flex-1">
                               <p className="text-sm font-semibold text-slate-700 leading-relaxed mb-4">{co.description}</p>
                               <div className="flex gap-4">
                                  <div className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-[9px] font-black uppercase">Target: {co.targetMarksPercentage}% Marks</div>
                               </div>
                             </div>
                           </div>
                         ))}
                         <button onClick={() => showNotification("Direct entry module active.")} className="w-full py-6 border-2 border-dashed border-slate-200 rounded-3xl text-slate-300 font-black uppercase text-[10px] tracking-widest hover:border-blue-300 hover:text-blue-400 transition-all">Add New Outcome Component</button>
                       </div>
                    </div>
                  )}

                  {courseTab === 'MAPPING' && (
                    <div className="space-y-8 animate-in fade-in">
                       <h3 className="font-black text-sm uppercase tracking-widest text-slate-800">CO-PO/PSO Articulation Matrix</h3>
                       <div className="overflow-x-auto pb-6">
                         <table className="w-full border-collapse">
                            <thead>
                              <tr className="border-b border-slate-100">
                                <th className="p-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest sticky left-0 bg-white z-10">Outcomes</th>
                                {pos.map(po => <th key={po.id} className="p-5 text-center text-[10px] font-black text-slate-400 uppercase">{po.code}</th>)}
                                {psos.map(pso => <th key={pso.id} className="p-5 text-center text-[10px] font-black text-blue-600 uppercase">{pso.code}</th>)}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                              {courseOutcomes.map(co => (
                                <tr key={co.id} className="hover:bg-slate-50/50 transition-all">
                                  <td className="p-5 font-black text-slate-800 text-xs sticky left-0 bg-white z-10">{co.code}</td>
                                  {pos.map(po => (
                                    <td key={po.id} className="p-3 text-center">
                                       <button onClick={() => toggleMapping(co.id, po.id)} className={`w-9 h-9 rounded-xl font-black text-xs transition-all ${getMappingLevel(co.id, po.id) > 0 ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 text-slate-300 hover:bg-slate-200'}`}>
                                         {getMappingLevel(co.id, po.id) || '-'}
                                       </button>
                                    </td>
                                  ))}
                                  {psos.map(pso => (
                                    <td key={pso.id} className="p-3 text-center">
                                       <button onClick={() => toggleMapping(co.id, pso.id)} className={`w-9 h-9 rounded-xl font-black text-xs transition-all ${getMappingLevel(co.id, pso.id) > 0 ? 'bg-indigo-600 text-white shadow-lg' : 'bg-indigo-50 text-indigo-200 hover:bg-indigo-100'}`}>
                                         {getMappingLevel(co.id, pso.id) || '-'}
                                       </button>
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                         </table>
                       </div>
                    </div>
                  )}

                  {courseTab === 'MARKS' && (
                    <div className="space-y-8 animate-in fade-in">
                       <div className="flex justify-between items-center">
                         <h3 className="font-black text-sm uppercase tracking-widest text-slate-800">Marks Entry Console</h3>
                         <div className="flex gap-3">
                           <button onClick={() => showNotification("Assessment grid saved.")} className="px-5 py-2.5 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase shadow-lg hover:bg-blue-700 transition-all"><Save size={16} className="inline mr-2"/> Save Current Grid</button>
                         </div>
                       </div>
                       <div className="border border-slate-100 rounded-[2rem] overflow-hidden">
                         <table className="w-full text-left">
                           <thead className="bg-slate-50">
                             <tr>
                               <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Roll ID</th>
                               <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Candidate Name</th>
                               {courseOutcomes.map(co => <th key={co.id} className="p-6 text-center text-[10px] font-black text-blue-600 uppercase">{co.code} (%)</th>)}
                             </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-100">
                             {studentMarks.map((student) => (
                               <tr key={student.studentId} className="hover:bg-slate-50/30 transition-all">
                                 <td className="p-6 font-black text-slate-400 text-xs">{student.studentId}</td>
                                 <td className="p-6 font-bold text-slate-800 text-sm">{student.studentName}</td>
                                 {courseOutcomes.map(co => (
                                   <td key={co.id} className="p-4">
                                     <input 
                                       type="number" 
                                       value={student.coMarks[co.id] || ''} 
                                       onChange={(e) => {
                                         const val = parseInt(e.target.value);
                                         setStudentMarks(prev => prev.map(s => s.studentId === student.studentId ? { ...s, coMarks: { ...s.coMarks, [co.id]: val } } : s));
                                       }}
                                       className="w-20 mx-auto block p-3 bg-white border border-slate-100 rounded-xl text-center font-black text-slate-700 outline-none focus:ring-4 focus:ring-blue-100 transition-all" 
                                     />
                                   </td>
                                 ))}
                               </tr>
                             ))}
                           </tbody>
                         </table>
                       </div>
                    </div>
                  )}

                  {courseTab === 'ATTAINMENT' && (
                    <div className="space-y-10 animate-in fade-in">
                       <h3 className="font-black text-sm uppercase tracking-widest text-slate-800">Final Attainment Visualization</h3>
                       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                         <div className="lg:col-span-2 bg-slate-50 rounded-[2.5rem] p-10 border border-slate-100">
                           <div className="h-[300px] w-full">
                              <ResponsiveContainer width="100%" height="100%">
                                <ReBarChart data={attainmentData}>
                                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} dy={10} />
                                  <YAxis domain={[0, 3]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} />
                                  <Tooltip cursor={{ fill: '#f1f5f9' }} />
                                  <Bar dataKey="attainment" radius={[8, 8, 0, 0]} barSize={40}>
                                    {attainmentData.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={entry.attainment === 3 ? '#2563eb' : entry.attainment === 2 ? '#6366f1' : '#94a3b8'} />
                                    ))}
                                  </Bar>
                                </ReBarChart>
                              </ResponsiveContainer>
                           </div>
                         </div>
                         <div className="space-y-6">
                            <div className="bg-white border border-slate-200 rounded-[2rem] p-8">
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Attainment Level Summary</p>
                               <div className="space-y-4">
                                  {attainmentData.map(d => (
                                    <div key={d.name} className="flex justify-between items-center border-b border-slate-50 pb-2">
                                       <span className="font-black text-slate-800 text-xs">{d.name}</span>
                                       <span className={`px-3 py-1 rounded-lg text-[10px] font-black ${d.attainment === 3 ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>Level {d.attainment}</span>
                                    </div>
                                  ))}
                               </div>
                            </div>
                            <div className="bg-blue-600 rounded-[2rem] p-8 text-white shadow-xl shadow-blue-100">
                               <h5 className="font-black text-[10px] uppercase tracking-widest mb-4">Calculated Average</h5>
                               <h2 className="text-4xl font-black">{(attainmentData.reduce((acc, curr) => acc + curr.attainment, 0) / attainmentData.length).toFixed(2)}</h2>
                               <p className="text-[9px] font-bold uppercase opacity-60">Attainment Scale (0-3)</p>
                            </div>
                         </div>
                       </div>
                    </div>
                  )}
               </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// ERP Components
const NavItem = ({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 p-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${active ? 'bg-blue-600 text-white shadow-xl shadow-blue-100 translate-x-1' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}>
    <span className={active ? 'text-white' : ''}>{icon}</span>
    <span className="flex-1 text-left">{label}</span>
  </button>
);

const StatCard = ({ label, value, icon, trend, color }: { label: string, value: string, icon: React.ReactNode, trend: string, color: 'blue' | 'green' | 'red' | 'indigo' }) => {
  const colorStyles = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    green: 'bg-green-50 text-green-600 border-green-100',
    red: 'bg-red-50 text-red-600 border-red-100',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100'
  };
  return (
    <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm hover:shadow-lg transition-all group">
       <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 border transition-transform group-hover:scale-110 ${colorStyles[color]}`}>{icon}</div>
       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
       <h2 className="text-3xl font-black text-slate-900 mb-2">{value}</h2>
       <p className={`text-[10px] font-black uppercase tracking-tight opacity-60`}>{trend}</p>
    </div>
  );
};

export default App;
