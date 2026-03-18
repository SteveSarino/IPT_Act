import { useState, useEffect } from 'react';
import { BASE_URL } from '../services/api';
import { CheckCircle, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  // Check backend connection
  useEffect(() => {
    fetch(`${BASE_URL}/students/`)
      .then(res => setBackendStatus(res.ok ? 'online' : 'offline'))
      .catch(() => setBackendStatus('offline'));
  }, []);

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
};

export default Dashboard;
