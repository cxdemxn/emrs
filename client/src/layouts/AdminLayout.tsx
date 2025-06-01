import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
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
    <div className="admin-layout">
      <header className="admin-header">
        <div className="logo">EMRS Admin</div>
        <div className="user-info">
          <span>Welcome, {userName}</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>
      
      <div className="admin-container">
        <aside className="admin-sidebar">
          <nav>
            <ul>
              <li>
                <button onClick={() => handleNavigation('/admin')}>Dashboard</button>
              </li>
              <li>
                <button onClick={() => handleNavigation('/admin/faculties')}>Faculties</button>
              </li>
              <li>
                <button onClick={() => handleNavigation('/admin/departments')}>Departments</button>
              </li>
              <li>
                <button onClick={() => handleNavigation('/admin/courses')}>Courses</button>
              </li>
              <li>
                <button onClick={() => handleNavigation('/admin/timetables/create')}>Create Timetable</button>
              </li>
              <li>
                <button onClick={() => handleNavigation('/admin/timetables/view')}>View Timetables</button>
              </li>
            </ul>
          </nav>
        </aside>
        
        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
