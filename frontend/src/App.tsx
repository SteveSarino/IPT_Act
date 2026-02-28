import { useState, useEffect } from 'react'
import './styles/Dashboard.css'
import './styles/Crud.css'
import { BASE_URL } from './services/api'
import StudentManager from './pages/StudentManager'
import TeacherManager from './pages/TeacherManager'
import CourseManager from './pages/CourseManager'
import EnrollmentManager from './pages/EnrollmentManager'

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
          <div className="content-header">
            <h2>Dashboard</h2>
            <div className="card">
              <p>Welcome to the Student Management System.</p>
              <div style={{ marginTop: '20px', padding: '10px', borderRadius: '8px', backgroundColor: backendStatus === 'online' ? '#064e3b' : '#451a03', color: 'white' }}>
                Backend Status: <strong>{backendStatus.toUpperCase()}</strong>
              </div>
            </div>
            <div className="card">
              <h3>Next Steps:</h3>
              <ul style={{ color: 'var(--text-muted)' }}>
                <li>Start adding <strong>Students</strong> and <strong>Teachers</strong> first.</li>
                <li>Assign Teachers to <strong>Courses</strong>.</li>
                <li>Finally, manage <strong>Enrollments</strong>.</li>
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

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span style={{ fontSize: '24px', marginRight: '10px' }}>🎓</span>
          <span>STEVE SAN</span>
        </div>
        <nav>
          <div className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <span style={{ width: '20px', marginRight: '10px' }}>📊</span>
            <span>Dashboard</span>
          </div>
          <div className={`nav-item ${activeTab === 'students' ? 'active' : ''}`} onClick={() => setActiveTab('students')}>
            <span style={{ width: '20px', marginRight: '10px' }}>👨‍🎓</span>
            <span>Students</span>
          </div>
          <div className={`nav-item ${activeTab === 'teachers' ? 'active' : ''}`} onClick={() => setActiveTab('teachers')}>
            <span style={{ width: '20px', marginRight: '10px' }}>👩‍🏫</span>
            <span>Teachers</span>
          </div>
          <div className={`nav-item ${activeTab === 'courses' ? 'active' : ''}`} onClick={() => setActiveTab('courses')}>
            <span style={{ width: '20px', marginRight: '10px' }}>📚</span>
            <span>Courses</span>
          </div>
          <div className={`nav-item ${activeTab === 'enrollments' ? 'active' : ''}`} onClick={() => setActiveTab('enrollments')}>
            <span style={{ width: '20px', marginRight: '10px' }}>📝</span>
            <span>Enrollments</span>
          </div>
        </nav>
      </aside>
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  )
}

export default App
