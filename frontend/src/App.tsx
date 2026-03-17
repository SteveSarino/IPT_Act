import { useState, useEffect } from 'react'
import { BASE_URL } from './services/api'
import StudentManager from './pages/StudentManager'
import TeacherManager from './pages/TeacherManager'
import CourseManager from './pages/CourseManager'
import EnrollmentManager from './pages/EnrollmentManager'
import { LayoutDashboard, Users, GraduationCap, BookOpen, ScrollText, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

type Entity = 'dashboard' | 'students' | 'teachers' | 'courses' | 'enrollments';

function App() {
  const [activeTab, setActiveTab] = useState<Entity>('dashboard');
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  // Check backend connection
  useEffect(() => {
    fetch(`${BASE_URL}/students/`)
      .then(res => setBackendStatus(res.ok ? 'online' : 'offline'))
      .catch(() => setBackendStatus('offline'));
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
            
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 transition-all hover:shadow-md">
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">Welcome to the Student Management System.</p>
              
              <div className={`mt-4 p-4 rounded-lg flex items-center gap-3 ${
                backendStatus === 'online' 
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800' 
                  : 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
              }`}>
                {backendStatus === 'online' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                <span>Backend Status: <strong>{backendStatus.toUpperCase()}</strong></span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 transition-all hover:shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Start Guide</h3>
              <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                <li className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-sm font-bold">1</div>
                  <span>Start by adding <strong>Students</strong> and <strong>Teachers</strong>.</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-sm font-bold">2</div>
                  <span>Assign Teachers to <strong>Courses</strong>.</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-sm font-bold">3</div>
                  <span>Finally, manage <strong>Enrollments</strong>.</span>
                </li>
              </ul>
            </div>
          </div>
        );
      case 'students': return <StudentManager />;
      case 'teachers': return <TeacherManager />;
      case 'courses': return <CourseManager />;
      case 'enrollments': return <EnrollmentManager />;
      default: return <StudentManager />;
    }
  };

  const NavItem = ({ id, icon: Icon, label }: { id: Entity, icon: any, label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
        activeTab === id 
          ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400 font-medium shadow-sm' 
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-gray-200'
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 flex flex-col shadow-sm z-10">
        <div className="p-6 flex items-center gap-3 border-b border-gray-100 dark:border-slate-700/50">
          <div className="p-2 bg-indigo-600 rounded-lg text-white shadow-lg shadow-indigo-500/30">
            <GraduationCap size={24} />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">STEVE SAN</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-4 mt-2">Menu</div>
          <NavItem id="dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem id="students" icon={Users} label="Students" />
          <NavItem id="teachers" icon={BookOpen} label="Teachers" />
          <NavItem id="courses" icon={BookOpen} label="Courses" />
          <NavItem id="enrollments" icon={ScrollText} label="Enrollments" />
        </nav>

        <div className="p-4 border-t border-gray-100 dark:border-slate-700/50">
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-50 dark:bg-slate-700/50">
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">Admin User</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">admin@school.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  )
}

export default App
