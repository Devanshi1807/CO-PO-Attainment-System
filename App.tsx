
import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Lock, 
  Mail, 
  BookOpen, 
  Calendar, 
  LogOut,
  Plus,
  Settings,
  Database,
  CheckCircle2,
  ChevronRight,
  UserPlus,
  Calculator,
  BarChart3,
  FileSpreadsheet,
  AlertCircle,
  TrendingUp,
  Clock,
  ArrowRight,
  Filter,
  Search,
  GraduationCap,
  Save,
  UserCheck,
  Trash2,
  X,
  Key
} from 'lucide-react';
import { User, Course, CourseOutcome, ProgramOutcome, OBEConfig, AssessmentTool } from './types';

type ViewState = 'LOGIN' | 'ADMIN_DASH' | 'ADMIN_FACULTY' | 'ADMIN_ALLOTMENT' | 'ADMIN_CONFIG' | 'TEACHER_DASH' | 'MY_COURSES' | 'CALCULATION_VIEW' | 'MARK_ENTRY';

const BIET_LOGO = "https://upload.wikimedia.org/wikipedia/en/3/36/Bundelkhand_Institute_of_Engineering_and_Technology_Logo.png";

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('LOGIN');
  const [user, setUser] = useState<User | null>(null);
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [isAddFacultyModalOpen, setIsAddFacultyModalOpen] = useState(false);
  
  // Filtering States
  const [yearFilter, setYearFilter] = useState<string>('All');
  const [deptFilter, setDeptFilter] = useState<string>('All');

  // Stateful Config
  const [config, setConfig] = useState<OBEConfig>({
    institutionName: "BIET Jhansi",
    attainmentLevels: { level1: 50, level2: 60, level3: 70 }
  });

  // Stateful Mock Data
  const [courses, setCourses] = useState<Course[]>([
    { id: 'c1', code: 'KCS-501', name: 'Theory of Computation', departmentId: 'IT', academicYear: '2024-25', teacherId: 't1' },
    { id: 'c2', code: 'KCS-502', name: 'Computer Networks', departmentId: 'IT', academicYear: '2024-25', teacherId: 't1' },
    { id: 'c3', code: 'KCS-301', name: 'Data Structures', departmentId: 'CS', academicYear: '2023-24', teacherId: 't1' },
    { id: 'c4', code: 'KAI-501', name: 'Machine Learning', departmentId: 'AI-ML', academicYear: '2024-25', teacherId: 't1' },
    { id: 'c5', code: 'KCS-501', name: 'Theory of Computation', departmentId: 'CS', academicYear: '2024-25', teacherId: 't2' }
  ]);

  const [faculty, setFaculty] = useState<(User & { password?: string })[]>([
    { id: 't1', name: 'Dr. S.K. Gupta', email: 'skgupta@bietj.ac.in', role: 'TEACHER', departmentId: 'IT' },
    { id: 't2', name: 'Prof. Amit Sharma', email: 'asharma@bietj.ac.in', role: 'TEACHER', departmentId: 'CS' },
    { id: 't3', name: 'Dr. Neha Verma', email: 'nverma@bietj.ac.in', role: 'TEACHER', departmentId: 'AI-ML' },
  ]);

  // Form State for Adding Faculty
  const [newFaculty, setNewFaculty] = useState({
    name: '',
    email: '',
    departmentId: 'IT',
    password: ''
  });

  const [pos] = useState<ProgramOutcome[]>(
    Array.from({ length: 12 }, (_, i) => ({ id: `po${i+1}`, code: `PO${i+1}`, description: `PO Desc ${i+1}`, programId: 'p1' }))
  );

  const [cos] = useState<CourseOutcome[]>([
    { id: 'co1', courseId: 'c1', code: 'CO1', description: 'Understand Automata', targetMarksPercentage: 60 },
    { id: 'co2', courseId: 'c1', code: 'CO2', description: 'Design CFGs', targetMarksPercentage: 60 }
  ]);

  const calculateAttainment = (coId: string) => {
    const percentAboveThreshold = 75; 
    if (percentAboveThreshold >= config.attainmentLevels.level3) return 3;
    if (percentAboveThreshold >= config.attainmentLevels.level2) return 2;
    if (percentAboveThreshold >= config.attainmentLevels.level1) return 1;
    return 0;
  };

  const handleLogin = (role: 'ADMIN' | 'TEACHER') => {
    setUser({
      id: role === 'ADMIN' ? 'a1' : 't1',
      name: role === 'ADMIN' ? 'Dean Academics' : 'Dr. S.K. Gupta',
      email: role === 'ADMIN' ? 'admin@bietj.ac.in' : 'skgupta@bietj.ac.in',
      role,
      departmentId: 'IT'
    });
    setView(role === 'ADMIN' ? 'ADMIN_DASH' : 'TEACHER_DASH');
  };

  const handleCourseSelect = (course: Course) => {
    setActiveCourse(course);
    setView('CALCULATION_VIEW');
  };

  const handleAllotmentChange = (courseId: string, teacherId: string) => {
    setCourses(prev => prev.map(c => c.id === courseId ? { ...c, teacherId } : c));
  };

  const handleAddFaculty = () => {
    if (!newFaculty.name || !newFaculty.email || !newFaculty.password) {
      alert("Please fill all fields");
      return;
    }
    const id = 't' + (faculty.length + 1);
    const facultyMember: User & { password?: string } = {
      id,
      name: newFaculty.name,
      email: newFaculty.email,
      role: 'TEACHER',
      departmentId: newFaculty.departmentId,
      password: newFaculty.password
    };
    setFaculty([...faculty, facultyMember]);
    setNewFaculty({ name: '', email: '', departmentId: 'IT', password: '' });
    setIsAddFacultyModalOpen(false);
  };

  const handleDeleteFaculty = (id: string) => {
    if (window.confirm("Are you sure you want to remove this faculty member? This will also unassign them from their courses.")) {
      setFaculty(faculty.filter(f => f.id !== id));
      setCourses(courses.map(c => c.teacherId === id ? { ...c, teacherId: '' } : c));
    }
  };

  const filteredCourses = useMemo(() => {
    return courses.filter(c => {
      const isMine = user?.role === 'ADMIN' ? true : c.teacherId === user?.id;
      const matchYear = yearFilter === 'All' || c.academicYear === yearFilter;
      const matchDept = deptFilter === 'All' || c.departmentId === deptFilter;
      return isMine && matchYear && matchDept;
    });
  }, [courses, user, yearFilter, deptFilter]);

  const uniqueYears = Array.from(new Set(courses.map(c => c.academicYear)));
  const uniqueDepts = Array.from(new Set(courses.map(c => c.departmentId)));

  if (view === 'LOGIN') {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
          <div className="bg-[#003399] p-8 text-center">
            <img src={BIET_LOGO} className="w-20 h-20 mx-auto mb-4 bg-white rounded-full p-1" alt="BIET Logo" />
            <h1 className="text-white font-bold text-xl uppercase tracking-wider">BIET OBE Portal</h1>
            <p className="text-blue-100 text-xs mt-1">Outcome Based Education System</p>
          </div>
          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Institutional Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                <input type="text" placeholder="faculty@bietj.ac.in" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <button onClick={() => handleLogin('ADMIN')} className="bg-[#003399] text-white py-4 rounded-xl font-bold text-sm hover:bg-blue-900 transition-all flex flex-col items-center gap-2 shadow-lg shadow-blue-200">
                <ShieldCheck size={20} /> ADMIN
              </button>
              <button onClick={() => handleLogin('TEACHER')} className="bg-slate-800 text-white py-4 rounded-xl font-bold text-sm hover:bg-slate-900 transition-all flex flex-col items-center gap-2 shadow-lg shadow-slate-200">
                <Users size={20} /> TEACHER
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shadow-sm">
        <div className="p-6 border-b flex items-center gap-3">
          <img src={BIET_LOGO} className="w-8 h-8" alt="BIET" />
          <div>
            <h2 className="font-black text-slate-800 text-sm leading-tight uppercase">OBE Console</h2>
            <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">{user?.role} SESSION</p>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1 mt-4">
          {user?.role === 'ADMIN' ? (
            <>
              <NavItem icon={<Database size={18}/>} label="Dashboard" active={view === 'ADMIN_DASH'} onClick={() => setView('ADMIN_DASH')} />
              <NavItem icon={<Users size={18}/>} label="Faculty Registry" active={view === 'ADMIN_FACULTY'} onClick={() => setView('ADMIN_FACULTY')} />
              <NavItem icon={<UserPlus size={18}/>} label="Course Allotment" active={view === 'ADMIN_ALLOTMENT'} onClick={() => setView('ADMIN_ALLOTMENT')} />
              <NavItem icon={<Settings size={18}/>} label="Attainment Config" active={view === 'ADMIN_CONFIG'} onClick={() => setView('ADMIN_CONFIG')} />
            </>
          ) : (
            <>
              <NavItem icon={<TrendingUp size={18}/>} label="Dashboard" active={view === 'TEACHER_DASH'} onClick={() => setView('TEACHER_DASH')} />
              <NavItem icon={<BookOpen size={18}/>} label="My Courses" active={view === 'MY_COURSES' || view === 'CALCULATION_VIEW'} onClick={() => setView('MY_COURSES')} />
              <NavItem icon={<FileSpreadsheet size={18}/>} label="Mark Sheets" active={view === 'MARK_ENTRY'} onClick={() => setView('MARK_ENTRY')} />
            </>
          )}
        </nav>
        <div className="p-4 border-t">
          <div className="bg-slate-50 rounded-xl p-3 mb-4 flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs uppercase">
               {user?.name.charAt(0)}
             </div>
             <div className="overflow-hidden">
               <p className="text-[10px] font-black text-slate-800 truncate">{user?.name}</p>
               <p className="text-[9px] text-slate-400 truncate">{user?.email}</p>
             </div>
          </div>
          <button onClick={() => setView('LOGIN')} className="w-full flex items-center gap-3 p-3 text-slate-500 font-bold text-xs hover:text-red-600 transition-all rounded-lg">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b flex items-center justify-between px-8">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium text-[10px] uppercase tracking-widest">Workspace /</span>
            <span className="text-slate-800 font-bold text-xs uppercase tracking-tight">{view.replace('_', ' ')}</span>
          </div>
          <div className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase border border-blue-100">
            {config.institutionName}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 relative">
          
          {/* FACULTY REGISTRY (ADMIN_FACULTY) */}
          {view === 'ADMIN_FACULTY' && (
            <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl">
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-2xl font-black text-slate-800">Faculty Registry</h2>
                  <p className="text-slate-400 text-sm">Create and manage institutional faculty accounts and credentials.</p>
                </div>
                <button 
                  onClick={() => setIsAddFacultyModalOpen(true)}
                  className="bg-[#003399] text-white px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-blue-900 transition-all shadow-lg shadow-blue-100"
                >
                  <UserPlus size={16} /> Add New Faculty
                </button>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <th className="p-6">Faculty Name</th>
                      <th className="p-6">Email / Username</th>
                      <th className="p-6">Department</th>
                      <th className="p-6 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {faculty.map(f => (
                      <tr key={f.id} className="hover:bg-slate-50/50 transition-all">
                        <td className="p-6 flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-black text-xs uppercase">
                             {f.name.charAt(0)}
                           </div>
                           <p className="font-bold text-slate-800 text-sm">{f.name}</p>
                        </td>
                        <td className="p-6">
                           <p className="text-xs font-medium text-slate-600">{f.email}</p>
                        </td>
                        <td className="p-6">
                           <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-[9px] font-black uppercase border border-blue-100">{f.departmentId}</span>
                        </td>
                        <td className="p-6 text-center space-x-2">
                           <button className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-all" title="Reset Password">
                             <Key size={16} />
                           </button>
                           <button onClick={() => handleDeleteFaculty(f.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all" title="Remove Faculty">
                             <Trash2 size={16} />
                           </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* FACULTY ALLOTMENT (ADMIN_ALLOTMENT) */}
          {view === 'ADMIN_ALLOTMENT' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-2xl font-black text-slate-800">Course Allotment</h2>
                  <p className="text-slate-400 text-sm font-medium">Map subject codes to corresponding faculty in-charges for specific years.</p>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <th className="p-6">Branch & Code</th>
                      <th className="p-6">Subject Name</th>
                      <th className="p-6">Academic Year</th>
                      <th className="p-6">Assigned Faculty</th>
                      <th className="p-6 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {courses.map(course => {
                      const currentTeacher = faculty.find(f => f.id === course.teacherId);
                      return (
                        <tr key={course.id} className="hover:bg-slate-50/50 transition-all">
                          <td className="p-6">
                            <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-[10px] font-black uppercase tracking-tighter border border-blue-100">{course.departmentId} • {course.code}</span>
                          </td>
                          <td className="p-6">
                            <p className="font-bold text-slate-800 text-sm leading-tight">{course.name}</p>
                          </td>
                          <td className="p-6 font-black text-slate-500 text-xs tracking-tight">{course.academicYear}</td>
                          <td className="p-6">
                            <select 
                              value={course.teacherId} 
                              onChange={(e) => handleAllotmentChange(course.id, e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer"
                            >
                              <option value="">Unassigned</option>
                              {faculty.map(f => <option key={f.id} value={f.id}>{f.name} ({f.departmentId})</option>)}
                            </select>
                          </td>
                          <td className="p-6 text-center">
                            {course.teacherId ? (
                              <span className="flex items-center justify-center gap-1.5 text-[9px] font-black text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-100 uppercase"><UserCheck size={12}/> Assigned</span>
                            ) : (
                              <span className="flex items-center justify-center gap-1.5 text-[9px] font-black text-red-600 bg-red-50 px-3 py-1.5 rounded-full border border-red-100 uppercase"><AlertCircle size={12}/> Pending</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ATTAINMENT CONFIG */}
          {view === 'ADMIN_CONFIG' && (
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto">
              <div className="text-center">
                <h2 className="text-3xl font-black text-slate-800">OBE Configuration</h2>
                <p className="text-slate-400 text-sm">Define global thresholds and institutional parameters.</p>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xl shadow-slate-200/50 space-y-8">
                <div className="space-y-4">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Institutional Identity</label>
                  <input 
                    type="text" 
                    value={config.institutionName} 
                    onChange={(e) => setConfig({...config, institutionName: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-800 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[1, 2, 3].map(level => (
                    <div key={level} className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase">Level {level} Threshold (%)</label>
                      <input 
                        type="number" 
                        value={(config.attainmentLevels as any)[`level${level}`]} 
                        onChange={(e) => setConfig({
                          ...config, 
                          attainmentLevels: { ...config.attainmentLevels, [`level${level}`]: parseInt(e.target.value) }
                        })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-black text-blue-600 text-center focus:ring-4 focus:ring-blue-100 outline-none"
                      />
                    </div>
                  ))}
                </div>

                <button className="w-full bg-[#003399] text-white py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-blue-200 hover:bg-blue-900 transition-all">
                  <Save size={20} /> Update Configuration
                </button>
              </div>
            </div>
          )}

          {/* TEACHER DASHBOARD, MY COURSES, etc. remain the same as previous updates */}
          {view === 'TEACHER_DASH' && (
            <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl">
              <div>
                <h2 className="text-2xl font-black text-slate-800">Hello, {user?.name}</h2>
                <p className="text-slate-400 text-sm">Overview of your multi-branch attainment status.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard label="Total Students" value="340" icon={<Users size={16} />} color="blue" />
                <StatCard label="My Subjects" value={filteredCourses.length.toString()} icon={<BookOpen size={16} />} color="indigo" />
                <StatCard label="Branches" value={uniqueDepts.length.toString()} icon={<GraduationCap size={16} />} color="orange" />
                <StatCard label="Avg Attainment" value="2.1" icon={<TrendingUp size={16} />} color="green" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                  <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Clock size={18} className="text-blue-600"/> Recent Activity</h3>
                  <div className="space-y-4">
                    <TaskItem title="Marks Calculated" subtitle="KCS-501 (IT Branch)" tag="COMPLETED" color="blue" />
                    <TaskItem title="Mapping Verified" subtitle="KCS-301 (CS Branch)" tag="COMPLETED" color="blue" />
                  </div>
                </section>
                <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-center items-center text-center">
                  <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
                    <Calculator size={32} />
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2">Branch-wise Reports</h3>
                  <p className="text-xs text-slate-500 mb-6 max-w-[240px]">Navigate to "My Courses" to view attainment for specific years and departments.</p>
                  <button onClick={() => setView('MY_COURSES')} className="bg-[#003399] text-white px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-blue-900 transition-all">
                    Go to My Courses <ArrowRight size={14} />
                  </button>
                </section>
              </div>
            </div>
          )}

          {view === 'MY_COURSES' && (
            <div className="space-y-6 animate-in fade-in duration-500 max-w-6xl">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-800">My Allotted Courses</h2>
                  <p className="text-slate-400 text-sm font-medium">Managing {filteredCourses.length} cohorts across branches.</p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                  <select value={yearFilter} onChange={(e) => setYearFilter(e.target.value)} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 outline-none">
                    <option value="All">All Years</option>
                    {uniqueYears.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                  <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 outline-none">
                    <option value="All">All Branches</option>
                    {uniqueDepts.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredCourses.map(course => (
                  <div key={course.id} onClick={() => handleCourseSelect(course)} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md cursor-pointer transition-all group border-l-4 border-l-blue-600">
                    <div className="flex justify-between mb-4">
                      <div className="flex gap-2">
                        <span className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider">{course.code}</span>
                        <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider">{course.academicYear}</span>
                      </div>
                      <ChevronRight className="text-slate-300 group-hover:text-blue-600" />
                    </div>
                    <h3 className="font-bold text-slate-800 text-lg group-hover:text-[#003399] transition-colors">{course.name}</h3>
                    <p className="text-blue-600 font-black text-[10px] uppercase tracking-widest mt-1">{course.departmentId} BRANCH</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ADMIN DASHBOARD HEATMAP */}
          {view === 'ADMIN_DASH' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Institutional Heatmap</h2>
                  <p className="text-slate-500 text-sm">Cross-branch attainment visibility for all allotted faculty.</p>
                </div>
                <button className="px-6 py-3 bg-[#003399] text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-900 transition-all">Generate SAR Report</button>
              </div>
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-[10px] font-black text-center border-collapse">
                    <thead className="bg-slate-900 text-white uppercase tracking-widest">
                      <tr>
                        <th className="p-6 text-left border-r border-slate-800 min-w-[280px]">Cohort Information</th>
                        {pos.map(po => <th key={po.id} className="p-6 border-r border-slate-800">{po.code}</th>)}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {courses.map(course => (
                        <tr key={course.id} className="hover:bg-slate-50 transition-all">
                          <td className="p-6 text-left border-r border-slate-100">
                            <p className="font-black text-sm text-slate-800 leading-none">{course.code}</p>
                            <p className="text-[10px] text-slate-500 uppercase mt-1">{course.name}</p>
                          </td>
                          {pos.map(po => {
                            const val = (Math.random() * 2 + 1).toFixed(2);
                            return <td key={po.id} className="p-6 border-r border-slate-50 font-black text-xs">{val}</td>;
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ADD FACULTY MODAL */}
          {isAddFacultyModalOpen && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
               <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                  <div className="bg-[#003399] p-6 text-white flex justify-between items-center">
                    <h3 className="font-black uppercase tracking-widest text-sm flex items-center gap-2"><UserPlus size={18}/> New Faculty Member</h3>
                    <button onClick={() => setIsAddFacultyModalOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition-all"><X size={20}/></button>
                  </div>
                  <div className="p-8 space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase">Full Name</label>
                      <input 
                        type="text" 
                        value={newFaculty.name}
                        onChange={e => setNewFaculty({...newFaculty, name: e.target.value})}
                        placeholder="Dr. Rajesh Kumar" 
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase">Institutional Email / Username</label>
                      <input 
                        type="email" 
                        value={newFaculty.email}
                        onChange={e => setNewFaculty({...newFaculty, email: e.target.value})}
                        placeholder="rkumar@bietj.ac.in" 
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase">Allotted Branch</label>
                      <select 
                        value={newFaculty.departmentId}
                        onChange={e => setNewFaculty({...newFaculty, departmentId: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      >
                        <option value="IT">Information Technology</option>
                        <option value="CS">Computer Science</option>
                        <option value="AI-ML">AI & ML</option>
                        <option value="ECE">Electronics & Communication</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase">Login Password</label>
                      <input 
                        type="password" 
                        value={newFaculty.password}
                        onChange={e => setNewFaculty({...newFaculty, password: e.target.value})}
                        placeholder="••••••••" 
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                      />
                    </div>
                    <button 
                      onClick={handleAddFaculty}
                      className="w-full bg-[#003399] text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-blue-900 transition-all shadow-xl shadow-blue-100"
                    >
                      Create Account
                    </button>
                  </div>
               </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) => (
  <button 
    onClick={onClick} 
    className={`w-full flex items-center gap-3 p-3.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all ${active ? 'bg-blue-50 text-[#003399] shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
  >
    <span className={active ? 'text-[#003399]' : 'text-slate-400'}>{icon}</span>
    <span className="flex-1 text-left">{label}</span>
    {active && <div className="w-1.5 h-1.5 rounded-full bg-[#003399]" />}
  </button>
);

const StatCard = ({ label, value, icon, color }: { label: string, value: string, icon: React.ReactNode, color: string }) => {
  const colorMap: Record<string, string> = {
    blue: 'text-blue-600 bg-blue-50 border-blue-100',
    indigo: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    orange: 'text-orange-600 bg-orange-50 border-orange-100',
    green: 'text-green-600 bg-green-50 border-green-100'
  };
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 border ${colorMap[color]}`}>
        {icon}
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-2xl font-black text-slate-800">{value}</p>
    </div>
  );
};

const TaskItem = ({ title, subtitle, tag, color }: { title: string, subtitle: string, tag: string, color: string }) => {
  const colorMap: Record<string, string> = {
    red: 'bg-red-50 text-red-600 border-red-100',
    orange: 'bg-orange-50 text-orange-600 border-orange-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100'
  };
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-slate-300 transition-all bg-slate-50/50">
      <div>
        <p className="text-xs font-black text-slate-800">{title}</p>
        <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter mt-0.5">{subtitle}</p>
      </div>
      <span className={`px-2.5 py-1 rounded text-[9px] font-black border ${colorMap[color]}`}>{tag}</span>
    </div>
  );
};

export default App;
