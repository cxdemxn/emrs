import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface StudentLayoutProps {
  children: React.ReactNode;
}

const StudentLayout: React.FC<StudentLayoutProps> = ({ children }) => {
  const { logout, userName } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="student-layout">
      <header className="student-header">
        <div className="logo">EMRS Student Portal</div>
        <div className="user-info">
          <span>Welcome, {userName}</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>
      
      <div className="student-container">
        <aside className="student-sidebar">
          <nav>
            <ul>
              <li>
                <button onClick={() => handleNavigation('/student')}>Dashboard</button>
              </li>
              <li>
                <button onClick={() => handleNavigation('/student/timetable')}>Exam Timetable</button>
              </li>
            </ul>
          </nav>
        </aside>
        
        <main className="student-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;
